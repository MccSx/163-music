{
  let view = {
    el:'.page-1',
    init() {
      this.$el = $(this.el)
    },
    show() {
      this.$el.addClass('active')
    },
    hide() {
      this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEventsHub()
      this.loadModules1()
      this.loadModules2()
    },
    bindEventsHub() {
      window.eventHub.on('selectTab', (tabName) => {
        if (tabName === 'page-1') {
          this.view.show()
        } else {
          this.view.hide()
        }
      })
    },
    loadModules1() {
      let scriptTag1 = document.createElement('script')
      scriptTag1.src = './js/index/page-1-1.js'
      scriptTag1.onload = function () {
        console.log('page-1-1')
      }
      document.body.appendChild(scriptTag1)
    },
    loadModules2() {
      let scriptTag2 = document.createElement('script')
      scriptTag2.src = './js/index/page-1-2.js'
      scriptTag2.onload = function () {
        console.log('page-1-2')
      }
      document.body.appendChild(scriptTag2)
    }
  }
  controller.init(view, model)
}