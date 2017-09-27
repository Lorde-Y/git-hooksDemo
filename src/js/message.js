(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exprots = factory();
  } else {
    root.Message = factory();
  }
})(window, function () {
  function Message (opts) {
    console.log(opts);
    this.cls = opts.cls || 'helloworld';
    this.title = opts.title || '提示';
    this.message = opts.message || '此操作将永久删除该文件, 是否继续?';
    this.confirmButtonText = opts.confirmButtonText || '确定';
    this.cancelButtonText = opts.cancelButtonText || '取消';
    this.cancelCallback = opts.Cancelcallback || function () {};
    this.confirmCallback = opts.Cancelcallback || function () {};
    this.beforeClose = opts.beforeClose || function () {};
  }

  /**
   * @param  {[dom]} 容器Dom，用于装载获得的Html
   */
  Message.prototype.render = function (dom) {
    var $dom = document.querySelector(dom);
    $dom.innerHTML = this.getHtml();
    this.bindEvents();
  };

  /**
   * 根据参数拼装字符串生成 Message弹出框
   */
  Message.prototype.getHtml = function () {
    var html = '<div class="pa-message-box ' + this.cls + '" >' +
              '<div class="pa-message-box__wrapper">' +
                '<div class="pa-message-box__header">' +
                  '<div class="pa-message-box__title">' + this.title + '</div>' +
                  '<div class="pa-message-box__close">x</div>' +
                '</div>' +
                '<div class="pa-message-box__content">' +
                  '<div class="pa-message-box__message">' + this.message + '</div>' +
                '</div>' +
                '<div class="pa-message-box__btns">' +
                  '<button class="pa-button pa-button--default" data-result="N"><span>' + this.cancelButtonText + '</span></button>' +
                  '<button class="pa-button pa-button--primary" data-result="Y"><span>' + this.confirmButtonText + '</span></button>' +
                '</div>' +
              '</div>' +
          '</div>';
    return html;
  };

  /**
   * 绑定Message弹出框所有事件
   */
  Message.prototype.bindEvents = function () {
    var $cls = $('.' + this.cls);
    var self = this;
    /**
     * 按钮事件
     */
    $cls.on('click', '.pa-button', function (e) {
      var result = $(this).attr('data-result');
      console.log(result);
      if (result === 'N') {
        console.log('Ready to close message');
        if (typeof self.cancelCallback === 'function') {
          self.beforeClose();
          self.cancelCallback();
        }
      }
      if (result === 'N') {
        if (typeof self.confirmCallback === 'function') {
          self.confirmCallback();
        }
      }
    });
    /**
     * 关闭弹窗
     */
    $cls.on('click', '.pa-message-box__close', function () {
      self.this.beforeClose();
      self.removeMessageBox();
    });
  };

  /**
   * 移除弹窗
   */
  Message.prototype.removeMessageBox = function () {
    var $cls = $('.' + this.cls);
    $cls.remove();
    this.destoryMessageBox();
  };

  /**
   * 显示弹窗
   */
  Message.prototype.showMessageBox = function () {
    var $cls = $('.' + this.cls);
    $cls.show();
  };

  /**
   * 隐藏弹窗
   */
  Message.prototype.hideMessageBox = function () {
    var $cls = $('.' + this.cls);
    $cls.hide();
  };

  Message.prototype.destoryMessageBox = function () {
    this.cls = null;
    this.title = null;
    this.message = null;
    this.confirmButtonText = null;
    this.cancelButtonText = null;
    this.callback = null;
    this.beforeClose = null;
  };

  return Message;
});
