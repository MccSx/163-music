{
  let view = {
    el: 'main',
    template: `
      <form action="">
        <label>歌名<input name="name" type="text" value="__name__"></label>
        <label>歌手<input name="singer" type="text" value="__singer__"></label>
        <label>外链<input name="url" type="text" value="__url__"></label>
        <label>外链<input name="cover" type="text" value="__cover__"></label>
        <label>歌词<textarea name="lyrics" cols="90" rows="10">__lyrics__</textarea></label>
        <button type="submit">保存</button>
      </form>
    `,
    render(data={}) {
      let valueArr = ['name','url','singer','id','cover','lyrics']
      let newHtml = this.template
      valueArr.map((val) => {
        newHtml = newHtml.replace(`__${val}__`, data[val] || '')
      })
      $(this.el).html(newHtml)
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    }
  }
  let model = {
    data:{name: '', url: '', singer: '', id: '', cover:'', lyrics:''},
    create(data) {
      let Song = AV.Object.extend('Song')
      let song = new Song()
      song.set('name',data.name)
      song.set('url',data.url)
      song.set('singer',data.singer)
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      return song.save().then((newSong) => {
        let {id, attributes} = newSong
        Object.assign(this.data, {id, ...attributes})
      }, (error) => {
        console.error(error)
      })
    },
    update(data) {
      // 第一个参数是 className，第二个参数是 objectId
      let song = AV.Object.createWithoutData('Song', this.data.id)
      // 修改属性
      song.set('name', data.name)
      song.set('url', data.url)
      song.set('singer', data.singer)
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      // 保存到云端
      return song.save().then((response) => {
        Object.assign(this.data, data)
        return data
      })
    }
  }
  let controller = {
    init() {
      this.view = view
      this.model = model
      this.bindEvents()
      this.view.render(this.model.data)
      this.bidnEventHub()
    },
    bidnEventHub() {
      window.eventHub.on('new', (data) => {
        if (this.model.data.id) {
          this.model.data = {name: '', url: '', singer: '', id: '', cover:'', lyrics:''}
        } else {
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    create() {
      let valueArr = ['name', 'singer', 'url', 'cover','lyrics']
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
    },
    update() {
      let valueArr = ['name', 'singer', 'url', 'cover','lyrics']
      let tempData = {}
      valueArr.map((value) => {
        tempData[value] = $(this.view.el).find(`[name="${value}"]`).val()
      })
      console.log(tempData)
      this.model.update(tempData).then(() => {
        this.view.render({})
        window.eventHub.trigger('update',JSON.parse(JSON.stringify(this.model.data)))
      })
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          this.update()
        } else {
          this.create()
        }
      })
    }
  }
  controller.init(view, model)
}