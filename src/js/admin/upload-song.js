{
  let view = {
    el: '.uploadArea',
    find(selector) {
      return $(this.el).find(selector)[0]
    },
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.initQiniu()
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        runtimes: 'html5',      // 上传模式，依次退化
        browse_button: this.view.find('#btn'),         // 上传选择的点选按钮，必需
        uptoken_url: 'http://localhost:8888/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
        domain: 'p8ptcvff3.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
        //container: '',             // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '40mb',             // 最大文件体积限制
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: this.view.find('#wrapper'),          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后，处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                  // 每个文件上传前，处理相关的事情
              window.eventHub.trigger('uploading')
            },
            'UploadProgress': function(up, file) {
              uploadStatus.textContent = '上传中...'
                  // 每个文件上传时，处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
              window.eventHub.trigger('uploaded')
              uploadStatus.textContent = '上传完毕'
                  // 每个文件上传成功后，处理相关的事情
                  // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                  // {
                  //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                  //    "key": "gogopher.jpg"
                  //  }
                  // 查看简单反馈
              var domain = up.getOption('domain');
              var response = JSON.parse(info.response);
              var sourceLink = "http://" + domain +"/"+ encodeURIComponent(response.key);
              window.eventHub.trigger('new', {
                name: response.key,
                url: sourceLink
              })
            },
            'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
            },
            'UploadComplete': function() {
                  //队列文件处理完毕后，处理相关的事情
            }
        }
      });
    }
  }
  controller.init(view, model)
}