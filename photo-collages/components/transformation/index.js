
/**
 * 缩放
 * @param {number} ow 源图宽 
 * @param {number} oh 源图高
 * @param {number} tw 目标宽
 * @param {number} th 目标高
 */
function contain(ow, oh, tw, th) {
  let s = 0;
  if (ow > oh) {
    s = ow / oh;
    ow = tw;
    oh = ow / s
  }
  else {
    s = ow / oh;
    oh = th;
    ow = oh * s
  }

  if (th < oh) {
    s = ow / oh;
    oh = th;
    ow = oh * s
  }

  if (tw < ow) {
    s = ow / oh;
    ow = tw;
    oh = ow / s
  }
  return { ow, oh }
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
 * @param {string} src 
 * @returns {Promise<WechatMiniprogram.GetImageInfoSuccessCallbackResult> }
 */
function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: (res) => {
        resolve(res)
      }
    })
  })
}
/**
 * 二维向量
 */
class V2 {
  /** 
   * @param {number} x
   * @param {number} y  
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  /**
   * 来自触摸
   * @param {V2} v2 
   */
  static c(v2) {
    return new V2(v2?.x, v2?.y);
  }
  /**
   * 减
   * @param {V2} v2 
   */
  subtract(v2) {
    this.x -= v2.x;
    this.y -= v2.y;
    return this;
  }
  /**
   * 加
   * @param {V2} v2 
   */
  plus(v2) {
    this.x += v2.x;
    this.y += v2.y;
    return this;
  }
  /**
   * 距离
   * @param {V2} v2 
   */
  distance(v2) {
    return Math.sqrt(Math.pow((this.x - v2.x), 2) + Math.pow((this.y - v2.y), 2))
  }
}


/**
 * 照片
 */
class Photo {
  /** @type {number} 原始图片宽度*/
  nw
  /** @type {number} 原始图片高度*/
  nh
  /** @type {number} 缩放比例*/
  s

  /** 
   * @param {number} x 图片x
   * @param {number} y 图片y
   * @param {number} w 图片宽度
   * @param {number} h 图片高度
   * @param {CanvasImageSource} img 图片
   */
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.nw = this.w = w;
    this.nh = this.h = h;
    this.img = img;
    this.s = 1;
  }
  /**
   * 移动
   * @param {V2} v2 
   */
  move(v2) {
    this.x = v2.x;
    this.y = v2.y;
  }

  /**
   * 缩放
   * @param {number} s 比例
   * @param {number} minSize  
   * @param {number} maxSize  
   */
  scale(s, minSize, maxSize) {
    if (s < minSize) s = minSize;
    if (s > maxSize) s = maxSize;
    this.w = this.nw * s;
    this.h = this.nh * s;
    this.s = s;
  }
}




/**
 * @author 林一怂儿 
 * @description 这个组件用于移动缩放
 */
Component({
  properties: {
    minSize: {
      type: Number,
      default: .5
    },
    maxSize: {
      type: Number,
      default: 2
    },
    src: {
      type: String,
      default: ''
    },
  },
  data: {
    /** 是否加载完成 */
    loaded: false,
    /** 允许移动 */
    allowMove: true,
    /** 允许移动事件 */
    allowMoveTimeoutId: 0,
    /** 开始移动位置 */
    movePos: new V2(),
    /** 开始缩放距离 */
    scaleDis: 0,
    /** 开始缩放尺寸 */
    scaleSize: 0,
    /** 缩放开始的xy */
    scalePos: new V2(),
    /** 画布 */
    canvas: null,
    /** 画布 */
    ctx: null,
    /** 照片 */
    photo: null,
    /** 间隔 */
    interval: 50,
    /** 最后操作时间 */
    lasttime: 0,
    /** 是否使用新版的canvas */
    isNew: true
  },
  lifetimes: {
    ready() {
      this.reset();
    }
  },
  methods: {
    reset() {
      if (this.isLowerThenVersion('2.11.0')) this.setData({ isNew: false })

      const query = this.createSelectorQuery()
      query.select('#photo').fields({ node: true, size: true });
      query.select('.photo.abs').fields({ node: true, size: true });
      setTimeout(() => {
        query.exec(async (res) => {
          if (this.data.isNew) {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr)
            this.data.canvas = canvas;
            this.data.ctx = ctx;
            this.loaded = true;
          }
          else {
            this.setData({ canvas: { ...res[1] } })
            this.data.ctx = wx.createCanvasContext('photo', this)
          }
          await this.loadSrc(this.properties.src)
          this.render();
        })
      }, 0);
    },
    /**
     * 读图片
     * @param {string} src
     */
    async loadSrc(src) {
      /** @type {HTMLCanvasElement} */
      let canvas = this.data.canvas;
      let dpr = wx.getSystemInfoSync().pixelRatio
      let width = canvas.width / dpr
      let height = canvas.height / dpr
      let image = this.data.isNew ? await createImage(canvas, src) : await getImageInfo(src)
      if (!this.data.isNew) {
        width = canvas.width;
        height = canvas.height
      }
      let { ow, oh } = contain(+image.width, +image.height, width, height)
      let x = (width - ow) / 2
      let y = (height - oh) / 2
      let w = ow;
      let h = oh
      this.data.photo = new Photo(x, y, w, h, image)
    },
    toDataURL(type, quality) {
      if (!this.data.isNew) {
        return new Promise((resolve) => {
          this.data.ctx.draw(true, () => {
            wx.canvasToTempFilePath({
              fileType: 'jpg',
              quality,
              canvasId: 'photo',
              success: (res) => {
                resolve(res.tempFilePath)
              },
            }, this)
          })
        })
      }
      else {
        return this.data.canvas?.toDataURL(type, quality)
      }
    },
    touchstart(e) {
      /** @type {V2[]} */
      let touchs = e.touches;
      /** @type {Photo} */
      const photo = this.data.photo;
      this.data.scalePos = V2.c({ x: photo.x + photo.w / 2, y: photo.y + photo.h / 2 })
      if (touchs.length >= 2) {
        this.data.allowMove = false
        this.data.scaleDis = this.fingerDis(touchs)
        this.data.scaleSize = photo.s;
      }
      else if (touchs.length === 1 && this.data.allowMove) {
        this.data.movePos = V2.c(touchs[0]).subtract(this.data.photo)
      }
    },
    touchmove(e) {
      if (+new Date() - this.data.lasttime < this.data.interval) return;
      this.data.lasttime = +new Date();
      /** @type {V2[]} */
      let touchs = e.touches;
      if (touchs.length >= 2) {
        this.scaling(touchs);
        this.render();
      }
      else if (touchs.length === 1 && this.data.allowMove) {
        this.moving(touchs[0])
        this.render();
      }
    },
    touchend(e) {
      /** @type {V2[]} */
      let touchs = e.touches;
      if (touchs.length < 1) {
        this.data.allowMove = true;
      }
    },
    /**
     * 移动
     * @param {V2} v2 
     */
    moving(v2) {
      /** @type {Photo} */
      const photo = this.data.photo;
      photo.move(V2.c(v2).subtract(this.data.movePos))
    },
    /**
     * 缩放中
     * @param {V2[]} v2s 
     */
    scaling(v2s) {
      let curDis = this.fingerDis(v2s);
      let changeDis = curDis - this.data.scaleDis;
      /** @type {Photo} */
      const photo = this.data.photo;
      /** @type {V2} */
      const scalePos = this.data.scalePos
      const scaleSize = this.data.scaleSize

      photo.scale((changeDis / this.data.scaleDis) + scaleSize, this.properties.minSize, this.properties.maxSize)
      photo.x = scalePos.x - photo.w / 2;
      photo.y = scalePos.y - photo.h / 2;
    },
    /**
     * 手指距离
     * @param {V2[]} v2s  
     */
    fingerDis(v2s) {
      let start = V2.c(v2s[0]);
      let dis = 0;
      for (let i = 1; i < v2s.length; i++) {
        const other = v2s[i];
        const tmp = start.distance(other)
        if (tmp > dis) dis = tmp;
      }
      return dis;
    },
    render() {
      /** @type {HTMLCanvasElement} */
      const canvas = this.data.canvas;
      /** @type {CanvasRenderingContext2D} */
      const ctx = this.data.ctx;
      /** @type {Photo} */
      const photo = this.data.photo;
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (this.data.isNew) {
        ctx.drawImage(photo.img, photo.x, photo.y, photo.w, photo.h)
      }
      else {
        ctx.drawImage(this.properties.src, photo.x, photo.y, photo.w, photo.h)
        ctx.draw(false)
      }
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
  }
})
