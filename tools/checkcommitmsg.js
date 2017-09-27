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
