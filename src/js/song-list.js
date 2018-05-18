{
  let view = {
    el: '.songList-container',
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data={}) {
      $(this.el).html(this.template)
      let {songs, selectSongId} = data
      songs.map((song) => {
        let liTag = $('<li></li>').text(song.name).attr('data-song-id', song.id)
        if (song.id === selectSongId) {
          liTag.attr('class', 'active')
        }
        $(this.el).find('ul').append(liTag)
      })
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs:[],
      selectSongId: null
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then((songs) => {
        this.data.songs =  songs.map((song) => {
          return {id: song.id, ...song.attributes}
        })
        return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEventHub()
      this.getAllSong()
      this.bindEvents()
    },
    getAllSong() {
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEventHub() {
      window.eventHub.on('new', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      window.eventHub.on('update', (newData) => {
        let songList = this.model.data.songs
        for (let i = 0; i < songList.length; i++) {
          if (songList[i].id === newData.id) {
            songList[i] = newData
          }
        }
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('click', 'li', (e) => {
        let songID = e.currentTarget.getAttribute('data-song-id')
        this.model.data.selectSongId = songID
        this.view.render(this.model.data)

        let songs = this.model.data.songs
        let data = {}
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songID) {
            data = songs[i]
            break
          }
        }
        window.eventHub.trigger('select', JSON.parse(JSON.stringify(data)))
      })
    }
  }
  controller.init(view, model)
}