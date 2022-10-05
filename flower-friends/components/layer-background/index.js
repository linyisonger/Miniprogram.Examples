import { createImage } from '../layer/index'

// 背景层
Component({
  properties: {
    /* 背景颜色 */
    bgColor: {
      type: String,
      value: "#fff"
    },
    /* 背景图片 */
    bgImage: {
      type: String,
      value: ""
    },
  },
  data: {
    canvas: null,
    ctx: null,
  },
  lifetimes: {
    ready() {
      this.init()
    }
  },
  methods: {
    /** 初始化 */
    init() {
      const query = this.createSelectorQuery()
      query.select('#background').fields({ node: true, size: true })
      query.exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        this.data.canvas = canvas;
        this.data.ctx = ctx;
        this.render();
      })
    },
    /** 渲染 */
    async render() {
      /** @type {HTMLCanvasElement} */
      const canvas = this.data.canvas;
      /** @type {CanvasRenderingContext2D} */
      const ctx = this.data.ctx;
      const { width, height } = canvas;
      // 获取宽度和高度 
      const bgImage = this.data.bgImage;
      const bgColor = this.data.bgColor;
      // 如果有图片则展示图片背景
      if (bgImage) {
        const image = await createImage(canvas, bgImage)
        ctx.drawImage(image, width, height)
      }
      else {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, width, height)
      }
    },
    value() {
      return {
        bgColor: this.data.bgColor,
        bgImage: this.data.bgImage,
      }
    }
  }
})
