{
  let view = {
    el: '#app',
    init() {
      this.$el = $(this.el)
    },
    render(data={}) {
      let {song, status} = data
      this.$el.find('.bg-img').css('background-image', `url(${song.cover})`)
      this.$el.find('img.cover').attr('src', song.cover)
      let audioUrl = this.$el.find('audio').attr('src')
      if (audioUrl !== song.url) {
        this.$el.find('audio').attr('src', song.url)
      }
      if (status === 'playing') {
        this.$el.find('.disc-container').addClass('playing')
      } else {
        this.$el.find('.disc-container').removeClass('playing')
      }
      this.$el.find('.song-description>h1').text(song.name)

      song.lyrics.split('\n').map((val) => {
        let pTag = document.createElement('p')
        let reg = /\[([\d:.]+)\](.+)/
        let matches = val.match(reg)
        if (matches) {
          pTag.textContent = matches[2]
          let timeArr = matches[1].split(':')
          let newTime =  parseInt(timeArr[0]) * 60 + parseFloat(timeArr[1])
          pTag.setAttribute('data-time', newTime)
        } else {
          pTag.textContent = val
        }
        this.$el.find('.lyric>.lines').append(pTag)
      })
    },
    audioPlay() {
      this.$el.find('audio')[0].play()
    },
    audioPause() {
      this.$el.find('audio')[0].pause()
    },
    showLyric(time) {
      let allP = this.$el.find('.lyric>.lines>p')
      let myPTag
      for (let i = 0; i < allP.length; i++) {
        if (i === allP.length-1) {
          myPTag = allP[i]
          break
        } else {
          let previousTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i+1).attr('data-time')
          if (previousTime <= time && time < nextTime) {
            //let height = allP.eq(i).offset().top - this.$el.find('.lyric').offset().top
            myPTag = allP[i]
            break
          }         
        }
      }
      let pHeight = myPTag.getBoundingClientRect().top
      let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
      let slideLenght = pHeight - linesHeight
      this.$el.find('.lyric>.lines').css({transform: `translateY(${-(slideLenght-25)}px)`})
      $(myPTag).addClass('active').siblings('.active').removeClass('active')
    }
  }
  let model = {
    data:{
      song: {id:'', name:'', singer:'', url:'', cover:'', lyrics:''},
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
      this.view.$el.find('audio').on('ended', () => {
        this.model.data.status = 'paused'
        this.view.render(this.model.data)
      })
      let audioTag = document.querySelector('audio')
      this.view.$el.find('audio').on('timeupdate', () => {
        this.view.showLyric(audioTag.currentTime)
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