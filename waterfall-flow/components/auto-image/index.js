Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: 'aspectFill'
    }
  },
  data: {
    width: 'auto',
    height: 'auto',
    loaded: false
  },
  methods: {
    imageLoad(e) {
      this.createSelectorQuery().select('.in-image-content').boundingClientRect().exec(([{ width: conWidth }]) => {
        // 获取图片的源宽度/高度
        let { width, height } = e.detail
        // 获取比例
        let scale = width / conWidth
        // 宽度赋值
        width = conWidth;
        // 高度比例缩放
        height /= scale
        // 高度取整
        height = Math.round(height)
        this.setData({ width: `${width}px`, height: `${height}px`, loaded: true })
        this.triggerEvent('loaded', { width, height })
      })
    }
  }
})
