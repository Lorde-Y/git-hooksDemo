# Message

## API
---

### 使用方式：
```html
<div id='container'></div>
```

```js
var message = new Message({
  cls: 'pa-message__first',
  title: 'helloworld'
  ......
});
message.render('#container');
```

### 参数说明：
参数    |     说明      |  类型   |    默认值  | 是否必选   
:------:|:-------------:|:-------:|:----------:|:----------:|
cls     |Message新增类  | string  |   ''       |  是
title   |Message标题    | string  |   ''       |  否
message |Message正文    | striing/dom |  ''    |  否
confirmButtonText | 确定按钮内容 | string | '确定' | 否
cancelButtonText  | 取消按钮内容 | string | '取消' | 否
cancelCallback    | 取消函数回调 | function | function | 否
confirmCallback   | 确定函数会调 | function | function | 否认
beforeClose       | 关闭弹窗前回调 | function | function | 否

### 暴露方法
方法    |     说明      |  类型   |  参数
:------:|:-------------:|:-------:|:-------:|
render  | 将Message弹出框渲染至容器Dom中| function | dom
showMessageBox | 显示弹出框 | function  | -
removeMessageBox | 移除弹出框 | funciton | -

