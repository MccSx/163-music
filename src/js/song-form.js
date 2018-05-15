{
  let view = {
    el: 'main',
    template: `
      <h1>新建歌曲</h1>
      <form action="">
        <label>歌名<input type="text"></label>
        <label>歌手<input type="text"></label>
        <label>外链<input type="text"></label>
        <button type="submit">保存</button>
      </form>
    `,
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init() {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
    }
  }
  controller.init(view, model)
}