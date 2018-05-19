{
  let view = {
    el: '.loading-wrapper',
    template:`<div class="loading"></div>`,
    render(data={}) {
      $(this.el).html(this.template)
    },
    show() {
      $(this.el).addClass('active')
    },
    hide() {
      $(this.el).removeClass('active')
    }
  }
  let controller = {
    init(view) {
      this.view = view
      this.view.render()
      this.bindEventHub()
    },
    bindEventHub() {
      window.eventHub.on('uploading', () => {
        this.view.show()
      })
      window.eventHub.on('uploaded', () => {
        this.view.hide()
      })
    }
  }
  controller.init(view)
}