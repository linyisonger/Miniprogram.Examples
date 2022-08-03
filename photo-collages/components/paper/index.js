
class Rect {
  /** @type {number} 节点的ID */
  id
  /** @type {any} 节点的dataset */
  dataset
  /** @type {number} 节点的左边界坐标 */
  left
  /** @type {number} 节点的右边界坐标 */
  right
  /** @type {number} 节点的上边界坐标 */
  top
  /** @type {number} 节点的下边界坐标 */
  bottom
  /** @type {number} 节点的宽度 */
  width
  /** @type {number} 节点的高度 */
  height
}
/**
 * 获取临时图片
 * @param {string} base64 
 * @returns {Promise<string>}
 */
function base64ToTempFilePath(base64) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const times = new Date().getTime();
    const tempFilePath = wx.env.USER_DATA_PATH + '/' + times + '.png';
    fs.writeFile({
      filePath: tempFilePath,
      data: base64.split(',')[1],
      encoding: 'base64',
      success: (res) => {
        resolve(tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}
/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {string} src 
 * @returns {Promise<CanvasImageSource> }
 */
function createImage(canvas, src) {
  return new Promise((resolve, reject) => {
    let img = canvas.createImage();
    img.src = src;
    img.onload = () => {
      resolve(img)
    }
  })
}
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 */
function drawBorder(ctx, x, y, w, h) {
  let lineColor = "rgb(241, 241, 241)"
  let lineWidth = 1;
  ctx.beginPath()
  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth;
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - lineWidth, y);
  ctx.lineTo(x + w - lineWidth, y + h - lineWidth);
  ctx.lineTo(x, y + h - lineWidth);
  ctx.lineTo(x, y);
  ctx.stroke()
}

/**
 * @author 林一怂儿 
 * @description 这个组件用于排版展示
 */
Component({
  properties: {
    /** 排版 */
    composing: {
      type: Array,
      default: []
    },
    /** 图片地址 */
    imageUrls: {
      type: Array,
      default: []
    },
    /** 图片尺寸 */
    paperSize: {
      type: Object,
      default: null
    }
  },
  data: {
    isNew: true
  },
  lifetimes: {
    created() {
    },
    ready() {
      if (this.isLowerThenVersion('2.11.0')) this.setData({ isNew: false })
    }
  },
  methods: {
    delete(e) {
      this.triggerEvent('delete', { index: e.currentTarget.dataset.index })
    },
    async toDataUrl(type, quality) {
      return new Promise((resolve) => {
        const query = this.createSelectorQuery()
        query.select('.compose').fields({ node: true, size: true });
        query.select('.paper').boundingClientRect()
        query.select('.content').boundingClientRect()
        query.selectAll('.trans').boundingClientRect()
        query.exec(async (res) => {
          /** @type {HTMLCanvasElement} */
          let canvas
          /** @type {CanvasRenderingContext2D} */
          let ctx
          if (this.data.isNew) {
            canvas = res[0].node
            ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr)
          }
          else {
            canvas = { ...res[0] }
            ctx = wx.createCanvasContext('compose', this)
          }
          /** @type {Rect} */
          let paper = res[1]
          /** @type {Rect} */
          let content = res[2]
          /** @type {Rect[]} */
          let trans = res[3]

          let width = res[0].width;
          let height = res[0].height;

          if (this.data.isNew) ctx.fillStyle = "#fff";
          else ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, width, height)

          let padding = paper.width - content.width;
          // 结果图片数组
          let resultImageUrls = this.data.isNew ? this.selectAllComponents('.trans').map(tran => {
            return tran.toDataURL(type, query)
          }) : await Promise.all(this.selectAllComponents('.trans').map(tran => {
            return tran.toDataURL(type, query)
          }))
          // 摆盘
          for (let i = 0; i < this.data.composing.length; i++) {
            /** @type {import('../composing/index').Composing} */
            let com = this.data.composing[i]
            let tran = trans[i];
            let imgUrl = resultImageUrls[i];
            let x = tran.left - paper.left + padding
            let y = tran.top - paper.top + padding;
            let w = tran.width - padding;
            let h = tran.height - padding;
            let img = this.data.isNew ? await createImage(canvas, imgUrl) : imgUrl
            ctx.drawImage(img, x, y, w, h);
            // drawBorder(ctx, x, y, w, h) 
          }
          if (!this.data.isNew) {
            ctx.draw(false, () => {
              wx.canvasToTempFilePath({
                canvasId: 'compose',
                success: (res) => {
                  resolve({
                    tempFilePath: res.tempFilePath
                  })
                },
              }, this)
            }, this)
          }
          else {
            const base64 = canvas.toDataURL(type, quality)
            const tempFilePath = await base64ToTempFilePath(base64)
            resolve({
              tempFilePath,
              base64
            })
          }
        })
      })
    },
    // 是否低于某个版本
    isLowerThenVersion(target) {
      let SDKVersion = wx.getSystemInfoSync().SDKVersion;
      let currArr = /([\d]{1,}).([\d]{1,}).([\d]{1,})/.exec(SDKVersion);
      let targArr = /([\d]{1,}).([\d]{1,}).([\d]{1,})/.exec(target);
      let currMaj = +currArr[1]
      let currMin = +currArr[2]
      let currPat = +currArr[3]
      let targMaj = +targArr[1]
      let targMin = +targArr[2]
      let targPat = +targArr[3]
      if (currMaj < targMaj) return true;
      if (currMaj > targMaj) return false;
      if (currMin < targMin) return true;
      if (currMin > targMin) return false;
      if (currPat < targPat) return true;
      return false
    }
  },
  observers: {
    imageUrls(v) {
      this.selectAllComponents('.trans').forEach((tran) => tran.reset())
    },
    composing(v) {
      this.selectAllComponents('.trans').forEach((tran) => tran.reset())
    },
  }
})
