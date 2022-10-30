// 画布清晰度
const CanvasDefinition = 2;
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
 * canvas最大尺寸
 * @param {HTMLCanvasElement} canvas 
 * @param {number} width 
 * @param {number} height 
 * @param {number} dpr 
 */
function maximumSizeOfCanvas(canvas, width, height, dpr) {
  let scale = 0;
  let targetWidth = 3600;
  let targetHeight = 3600;
  let currWidth = width;
  let currHeight = height;

  width *= dpr
  height *= dpr

  if (width < targetWidth && height < targetHeight) {
    canvas.width = width;
    canvas.height = height;
    return { width, height, dpr, canvas }
  }
  if (width > height) {
    scale = width / height;
    width = targetWidth;
    height = width / scale
  }
  else {
    scale = width / height;
    height = targetHeight;
    width = height * scale
  }

  if (targetHeight < height) {
    scale = width / height;
    height = targetHeight;
    width = height * scale
  }

  if (targetWidth < width) {
    scale = width / height;
    width = targetWidth;
    height = width / scale
  }

  canvas.width = width;
  canvas.height = height;

  return { width, height, canvas, dpr: width / currWidth }
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
  /**
   * 获取角度通过向量
   * @param {V2} v2 
   */
  angleByVector(v2) {
    return Math.sign(this.multiplicationCross(v2)) * Math.acos((this.x * v2.x + this.y * v2.y) / (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) * Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2)))) * 180 / Math.PI
  }
  /**
   * 叉乘
   * @param {V2} v2 
   */
  multiplicationCross(v2) {
    return this.x * v2.y - this.y * v2.x;
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
  /** @type {number} 旋转角度*/
  a
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
    this.a = 0
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
  /**
   * 旋转
   * @param {number} a 
   */
  rotate(a) {
    this.a = a;
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
    /** 旋转开始的位置 */
    rotatePos: new V2(),
    /** 旋转开始的角度 */
    rotateAngle: 0,
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
    isNew: true,
    /** 准备好了吗 */
    isReady: false,
    /** 缓存宽高 */
    width: 0,
    height: 0,
  },
  lifetimes: {
    ready() {
      this.data.isReady = true;
      this.reset();
    }
  },
  methods: {
    reset() {
      if (!this.data.isReady) return;
      if (this.isLowerThenVersion('2.11.0')) this.setData({ isNew: false })

      const query = this.createSelectorQuery()
      query.select('#photo').fields({ node: true, size: true });
      query.select('.photo.abs').fields({ node: true, size: true });
      // setTimeout(() => {
      query.exec(async (res) => {
        if (this.data.isNew) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          let dpr = wx.getSystemInfoSync().pixelRatio * CanvasDefinition;
          let maximumSize = maximumSizeOfCanvas(canvas, res[0].width, res[0].height, dpr)
          ctx.scale(maximumSize.dpr, maximumSize.dpr)
          this.data.canvas = canvas;
          this.data.ctx = ctx;
          this.data.width = res[0].width
          this.data.height = res[0].height
          this.loaded = true;
        }
        else {
          this.setData({ canvas: { ...res[1] } })
          this.data.ctx = wx.createCanvasContext('photo', this)
        }
        await this.loadSrc(this.properties.src)
        // setTimeout(() => {
        this.setData({ photo: this.data.photo })
        // }, 0)
      })
      // }, 0);
    },
    /**
     * 读图片
     * @param {string} src
     */
    async loadSrc(src) {
      /** @type {HTMLCanvasElement} */
      let canvas = this.data.canvas;
      let width = this.data.width
      let height = this.data.height
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
    async toDataURL(type, quality) {
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
        let { width, height, canvas, ctx } = this.data
        await this.render();
        let base64 = this.data.canvas?.toDataURL(type, quality)
        ctx.clearRect(0, 0, width, height)
        return base64
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
        this.data.rotatePos = V2.c(touchs[1]).subtract(touchs[0])
        this.data.rotateAngle = photo.a;
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
        this.rotating(touchs)
        this.setData({ photo: this.data.photo })
      }
      else if (touchs.length === 1 && this.data.allowMove) {
        this.moving(touchs[0])
        this.setData({ photo: this.data.photo })
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
     * 旋转中
     * @param {V2[]} v2s 
     */
    rotating(v2s) {
      /** @type {Photo} */
      const photo = this.data.photo;
      /** @type {V2} */
      const rotatePos = this.data.rotatePos
      const rotateAngle = this.data.rotateAngle
      const rotateEndAngle = V2.c(v2s[1]).subtract(v2s[0]).angleByVector(rotatePos);
      photo.rotate(rotateAngle - rotateEndAngle);
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
      return new Promise((resolve) => {
        /** @type {HTMLCanvasElement} */
        const canvas = this.data.canvas;
        /** @type {CanvasRenderingContext2D} */
        const ctx = this.data.ctx;
        /** @type {Photo} */
        const photo = this.data.photo;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (this.data.isNew) {
          ctx.save();
          ctx.translate(photo.x + photo.w / 2, photo.y + photo.h / 2)
          ctx.rotate(photo.a * Math.PI / 180)
          ctx.drawImage(photo.img, -photo.w / 2, -photo.h / 2, photo.w, photo.h)
          ctx.restore();
          resolve()
        }
        else {
          ctx.translate(photo.x + photo.w / 2, photo.y + photo.h / 2)
          ctx.rotate(photo.a * Math.PI / 180)
          ctx.drawImage(this.properties.src, -photo.w / 2, -photo.h / 2, photo.w, photo.h)
          ctx.draw(false, resolve)
        }
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
  }
})
