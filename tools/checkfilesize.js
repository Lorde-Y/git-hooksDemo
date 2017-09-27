/*
*     Author: Simon
*       Desc: 检查文件大小
* createDate: 2017-09-27
*/
var fs = require('fs');
var path = require('path');

var srcPath = path.resolve('../', 'src');
var imagesPath = path.resolve(srcPath, 'assets/images');

var allAssetsArr = [];

// 默认 1MB
var limitSize = 1 * 1024 * 1024;

console.log('\n[' + getCurrentDate() + '] Starting check all images size...');

function getCurrentDate () {
  var currentDate = new Date();
  return currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
}

/*
* 读取检查目录下的文件，包含文件夹
*
*/
function readFiles (filePath) {
  var files = fs.readdirSync(filePath);
  for (var i = 0, len = files.length; i < len; i++) {
    var file = files[i];
    var asstesPath = path.resolve(filePath, file);

    var stats = fs.statSync(asstesPath);

    /**
    * 如果是文件，则递归遍历
    */
    if (stats.isDirectory()) {
      readFiles(asstesPath);
      continue;
    }

    if (stats.isFile() && checkIsImg(asstesPath)) {
      var obj = {
        name: asstesPath,
        size: stats.size,
        overLimit: false
      };
      allAssetsArr.push(obj);
    }
  }
}

/*
* 单位转换
*/
function bytesToSize (bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/*
* 检查文件是否为图片
*/
function checkIsImg (filePath) {
  var imgSuffix = ['.png', '.gif', '.jpg', '.jpeg', '.svg'];
  var flag = false;
  for (var i = 0, len = imgSuffix.length; i < len; i++) {
    if (filePath.indexOf(imgSuffix[i])) {
      flag = true;
      break;
    }
  }
  return flag;
}

/*
* 检查文件是否超过预期大小
*/
function checkFileSizeLimit (arr) {
  var newArr = arr.map(function (item) {
    if (item.size >= limitSize) {
      item.overLimit = true;
    }
    return item;
  });
  return newArr;
}

/*
* 打印警告-超过默认1MB大小文件
* git hooks用于指定在git任务执行的特定时间点自动执行的任务的脚本
* 脚本可以是shell脚本、node脚本等，只要脚本返回有效的退出码（exit code），
* 其中0表示成功，>0表示错误。
* 钩子返回值不是0，那么 git commit 命令就会中止执行。
*/
function warningAndLogLargeFile (allAssetsArr) {
  var newArr = checkFileSizeLimit(allAssetsArr);
  var flag = false;
  console.log('[' + getCurrentDate() + '] Finished check all images size...');
  var overSizeLen = 0;
  for (var i = 0, len = newArr.length; i < len; i++) {
    var item = newArr[i];
    if (item.overLimit) {
      flag = true;
      overSizeLen = overSizeLen + 1;
      console.warn('\n', item.name, '大小为:', bytesToSize(item.size));
    }
  }
  if (flag) {
    console.log('\n 以上' + overSizeLen + '个文件超过默认大小1MB，请检查！\n');
    process.exit(1);
  } else {
    console.log('\n 图片大小符合规格, Good job! \n');
    process.exit(0);
  }
}

readFiles(imagesPath);
warningAndLogLargeFile(allAssetsArr);
