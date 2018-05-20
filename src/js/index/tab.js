{
  let view = {
    el: '.globalTabs',
    init() {
      this.$el = $(this.el)
    }
  }
  let controller = {
    init(view) {
      this.view = view
      this.view.init()
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', 'li', (e) => {
        $(e.currentTarget).addClass('active').siblings('.active').removeClass('active')
        let pageName = $(e.currentTarget).attr('data-tab-name')
        window.eventHub.trigger('selectTab', pageName)
      })
    }
  }
  controller.init(view)
}