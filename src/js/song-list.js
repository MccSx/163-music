{
  let view = {
    el: '.songList-container',
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data={}) {
      $(this.el).html(this.template)
      let {songs} = data
      songs.map((song) => {
        let liTag = $('<li></li>').text(song.name).attr('data-song-id', song.id)
        $(this.el).find('ul').append(liTag)
      })
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    },
    activeItem(element) {
      $(element).addClass('active').siblings('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs:[]
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
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('click', 'li', (e) => {
        this.view.activeItem(e.currentTarget)
        let songID = e.currentTarget.getAttribute('data-song-id')
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