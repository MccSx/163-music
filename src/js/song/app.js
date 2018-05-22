{
  let view = {
    el: '#app',
    init() {
      this.$el = $(this.el)
    },
    render(data={}) {
      let {song, status} = data
      $(this.el).find('.bg-img').css('background-image', `url(${song.cover})`)
      $(this.el).find('img.cover').attr('src', song.cover)
      let audioUrl = $(this.el).find('audio').attr('src')
      if (audioUrl !== song.url) {
        $(this.el).find('audio').attr('src', song.url)
      }
      if (status === 'playing') {
        $(this.el).find('.disc-container').addClass('playing')
      } else {
        $(this.el).find('.disc-container').removeClass('playing')
      }
    },
    audioPlay() {
      $(this.el).find('audio')[0].play()
    },
    audioPause() {
      $(this.el).find('audio')[0].pause()
    }
  }
  let model = {
    data:{
      song: {id:'', name:'', singer:'', url:'', cover:''},
      status: 'paused'
    },
    getSong(id) {
      let query = new AV.Query('Song');
      return query.get(id).then( (song) => {
        Object.assign(this.data.song, {id: song.id, ...song.attributes})
      }, function (error) {
        console.log(error)
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.searchID = this.getSongID()
      this.model.getSong(this.searchID).then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.find('.disc-container').on('click', '.icon-play', () => {
        this.model.data.status = 'playing'
        this.view.render(this.model.data)
        this.view.audioPlay()
      })
      this.view.$el.find('.disc-container').on('click', '.icon-pause', () => {
        this.model.data.status = 'paused'
        this.view.render(this.model.data)
        this.view.audioPause()
      })
    },
    getSongID() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }

      //把查询参数类似'id=xxx&a=1&&b=2'变为['id=xxx','a=1','b=2']
      let searchArr = search.split('&').filter(v => v)
      let searchID = ''
      for (let i = 0; i < searchArr.length; i++) {
        let temp = searchArr[i].split('=')
        if (temp[0] === 'id') {
          searchID = temp[1]
        }
      }
      return searchID
    }
  }
  controller.init(view, model)
}