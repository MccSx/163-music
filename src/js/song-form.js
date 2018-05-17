{
  let view = {
    el: 'main',
    template: `
      <h1>新建歌曲</h1>
      <form action="">
        <label>歌名<input name="name" type="text" value="__name__"></label>
        <label>歌手<input name="singer" type="text" value=""></label>
        <label>外链<input name="url" type="text" value="__url__"></label>
        <button type="submit">保存</button>
      </form>
    `,
    render(data={}) {
      let valueArr = ['name','url','singer','id']
      let newHtml = this.template
      valueArr.map((val) => {
        newHtml = newHtml.replace(`__${val}__`, data[val] || '')
      })
      $(this.el).html(newHtml)
    }
  }
  let model = {
    data:{name: '', url: '', singer: '', id: ''},
    create(data) {
      let Song = AV.Object.extend('Song')
      let song = new Song()
      song.set('name',data.name)
      song.set('url',data.url)
      song.set('singer',data.singer)
      return song.save().then((newSong) => {
        let {id, attributes} = newSong
        Object.assign(this.data, {id, ...attributes})
      }, (error) => {
        console.error(error)
      })
    }
  }
  let controller = {
    init() {
      this.view = view
      this.model = model
      this.bindEvents()
      this.view.render(this.model.data)
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        let valueArr = ['name', 'singer', 'url']
        let tempData = {}
        valueArr.map((value) => {
          tempData[value] = $(this.view.el).find(`[name="${value}"]`).val()
        })
        this.model.create(tempData).then(() => {
          this.view.render({})
          // window.eventHub.trigger('create', this.model.data)  //这里触发trigger发布的data(this.model.data)只是this.model.data的地址
          let copyData = JSON.parse(JSON.stringify(this.model.data))
          window.eventHub.trigger('create',copyData)
        })
      })
    }
  }
  controller.init(view, model)
}