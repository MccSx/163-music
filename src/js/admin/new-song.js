{
  let view = {
    el: '.newSong',
    template: `新建歌曲`,
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.date)
      this.active()
      this.bindEventHub()
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', () =>{
        this.active()
        window.eventHub.trigger('new')
      })
    },
    bindEventHub() {
      window.eventHub.on('new', (data) => {
        this.active()
      })
      window.eventHub.on('select', (data) => {
        this.deactive()
      })
    },
    active() {
      $(this.view.el).addClass('active')
    },
    deactive() {
      $(this.view.el).removeClass('active')
    }
  }
  controller.init(view, model)
}