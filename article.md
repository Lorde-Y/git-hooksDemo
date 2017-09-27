# 手牵手使用Husky & Nodejs脚本 自定义你的Git钩子

## 概述
和其它版本控制系统一样，Git能在一些特定的重要动作发生时触发自定义脚本。Git钩子最常见的使用场景包括进行提交规范审核，代码规范审核，进行自动化部署等。在本篇文章中，我会用一个例子详细介绍使用Husky & nodeJs脚本配合使用Git常用钩子。

## Git钩子在何方
当你用`git init`初始化一个项目的时候，钩子都被存储在当前项目下`.git/hooks`子目录中。Git默认会在这个目录中放置一些示例脚本，这些脚本大多是shell和PERL语言，但是你可以`使用任何脚本语言`。如果你想启用它们，需要将 **.sample** 这个后缀删除。
```shell
├── applypatch-msg.sample
├── commit-msg.sample
├── post-update.sample
├── pre-applypatch.sample
├── pre-commit.sample
├── pre-push.sample
├── pre-rebase.sample
├── pre-receive.sample
├── prepare-commit-msg.sample
└── update.sample
```

## 背景
在多人协作的项目中，代码风格统一、代码提交信息的说明等重要性不言而喻。因此，在本篇文章中，我会介绍如下两个Git钩子：
1. pre-commit
2. commit-msg

## NodeJs安装
安装过程就不详细介绍了，可以去[官网直接下载](https://nodejs.org/zh-cn/download/)

## [husky](https://github.com/typicode/husky)介绍
husky继承了Git下所有的钩子，在触发钩子的时候，husky可以阻止不合法的commit,push等等。
```
npm install husky --save-dev
```

### Eslint
1. 介绍
[ESLint](http://eslint.cn/docs/user-guide/configuring) 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于2013年6月创建。在小项目或者小团队中，成员间可以拟定一份约定的代码规范并依靠自觉和人工检查去遵守这个规范来达到这个目的。但是随着规模的扩大的新成员的加入，这个问题就不能只靠自觉和人工来解决，我们需要强制和自动化来确保每个成员提交的代码都是符合规范的。

2. 全局安装
```
npm install -g eslint
```

### 项目搭建
[github地址](https://github.com/Lorde-Y/git-hooksDemo)
- 新建一个项目，`git-hooksDemo`, 安装所需依赖,依次执行以下命令。
```shell
// 进入目录
cd git-hooksDemo
// 初始化git & package.json
git init 
npm init
npm install husky eslint --save-dev
```

## 项目结构如下
```
├── node_modules
├── package.json
├── src
│   ├── assets
│   │   └── images
│   │       ├── brand.jpg
│   │       └── hello.jpg
│   └── js
│       ├── README.md
│       └── message.js
└── tools
    ├── checkcommitmsg.js
    └── checkfilesize.js
```

- 初始化Eslint配置，详细配置可以参考[Eslint config](http://eslint.cn/docs/user-guide/configuring)，eslint初始化时，你可以根据自身项目的需求选择对应的代码风格。目前，我们项目主要用的最多的还是[Standard标准](https://standardjs.com)
```shell
node_modules/.bin/eslint --init

//如果是全局安装eslint 可以直接键入命令
eslint --init
```

### 创建pre-commit钩子
客户端钩子，它会在Git键入提交信息前运行。因此，我们可以利用这个时机来做代码风格检查。
查看husky文档 & husky对应[Git的钩子](https://git-scm.com/docs/githooks)，可以清楚看到 `precommit对应pre-commit`
**编辑pageage.json**, 在scripts中加入如下命令：
```shell
{
  "scripts": {
    "eslint": "eslint src/**/*.js",
    "precommit": "npm run eslint"
  }
}
```

当你在终端输入`git commit -m "xxx"`,提交代码的时候，
如果代码不符合Eslint规则，则可能会有如下错误提示：
```shell
 11:22  error  Missing semicolon  semi

✖ 1 problem (1 error, 0 warnings)
  1 error, 0 warnings potentially fixable with the `--fix` option.


husky > pre-commit hook failed (add --no-verify to bypass)
```

当然你可以根据提示 增加参数 `git commit -m "xxx" --no-verify` 绕过验证，强制提交。

已经解决了提交前的Eslint代码检查工作。现在，有一个需求，在提交代码之前，`检查项目下所有图片文件大小是否符合要求`。我们结合上面所提到的，使用NodeJs脚本实现这个需求。
在package.json文件中，新增脚本命令如下：
```shell
{
  "scripts": {
    "checkFileSize": "cd tools && node checkfilesize.js",
    "eslint": "eslint src/**/*.js",
    "precommit": "npm run eslint"
  }
}
```

终端输入命令`git commit -m "xxx"`, 运行结果如下：
```shell
[13:52:15] Starting check all images size...
[13:52:15] Finished check all images size...

 /Users/simon/practice/git-hooksDemo/src/assets/images/01f53a5787a1920000018c1b3c94cb.jpg 大小为: 2.79 MB

 以上1个文件超过默认大小1MB，请检查！


husky > pre-commit hook failed (add --no-verify to bypass)
```

**precommit钩子，会先检查代码合法性，如果通过，再去检查所有图片大小合法性。**

截取部分关键代码：
```js
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
```

### 创建commit-msg钩子
客户端钩子，它会根据Git键入提交信息判断 **提交信息是否符合团队规范性**。

依旧在package.json新增脚本命令：
```shell
{
  "scripts": {
    "checkFileSize": "cd tools && node checkfilesize.js",
    "eslint": "eslint src/**/*.js",
    "precommit": "npm run eslint",
    "commitmsg": "cd tools && node checkcommitmsg.js ${GIT_PARAMS}"
  }
}
```

终端输入命令`git commit -m "xxx"`, 运行结果如下：
```
 提交代码信息不符合规范，信息中应包含字符"HELLO-".

 例如：08-28版本HELLO- frist commit.


husky > commit-msg hook failed (add --no-verify to bypass)
```

当你在终端键入`git commit -m "HELLO- xxx"`的时候，就可以通过该检测。

功能代码如下：
```js
/*
*    功能： git commit时，自动验证提交信息是否符合规范
* 提交规范： 信息中应包含字符"HELLO-"，同时提交 当前版本的信息。例如："08-18 HELLO-某个功能开发"
* https://github.com/typicode/husky/issues/71
* https://github.com/typicode/husky/issues/
* 主要是读取 .git/COMMIT_EDITMSG 这个文件，文件记录了当前commit之后的信息
*/
var fs = require('fs');
var path = require('path');

var gitPath = path.join('../', process.env.GIT_PARAMS);
var commitMsg = fs.readFileSync(gitPath, 'utf-8');

var pattern = /HELLO-/g;

if (!pattern.test(commitMsg)) {
  console.log(' 提交代码信息不符合规范，信息中应包含字符"HELLO-".\n');
  console.log(' 例如：08-28版本HELLO- frist commit.\n');
  process.exit(1);
}
process.exit(0);
```

### 最后
pre-commit & commit-msg 两个钩子的用法已经介绍完了。
Git钩子还有很多功能，可以帮助开发者实现更好的功能需求。
感谢您的阅读，文章中的DEMO已经放在 [github地址](https://github.com/Lorde-Y/git-hooksDemo)，欢迎提出issue，star是最好的了。2333333

