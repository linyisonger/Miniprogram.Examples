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
Page({
  data: {
    /** 底部安全距离 */
    safeAreaBottom: 0,
    /** 图片地址 */
    imageUrls: [],
    /** 排版 */
    composingArr: [],
    /** 纸张尺寸 */
    paperSize: null,
    /** 最大上传图片数 */
    maxUploadImageCount: 9,
    /** 纸张名称 */
    paperSizeName: 'A4'
  },
  onLoad(options) {
    if (options.sizeName) this.setData({ paperSizeName: options.sizeName })
    if (getApp().isLowerThenVersion("2.20.1")) {
      const systemInfo = wx.getSystemInfoSync();
      this.setData({ safeAreaBottom: systemInfo.screenHeight - systemInfo.safeArea?.bottom ?? systemInfo.screenHeight })
    }
    else {
      const windowInfo = wx.getWindowInfo()
      this.setData({ safeAreaBottom: windowInfo.screenHeight - windowInfo.safeArea.bottom })
    }

  },
  addPhotos() {
    if (getApp().isLowerThenVersion("2.10.0")) {
      wx.chooseImage({
        count: this.data.maxUploadImageCount - this.data.imageUrls.length,
        success: (res) => {
          this.setData({ imageUrls: [...this.data.imageUrls, ...res.tempFiles.map(f => f.path)] })
        }
      })
    }
    else {
      wx.chooseMedia({
        count: this.data.maxUploadImageCount - this.data.imageUrls.length,
        mediaType: ['image'],
        success: (res) => {
          this.setData({ imageUrls: [...this.data.imageUrls, ...res.tempFiles.map(f => f.tempFilePath)] })
        }
      })
    }
  },
  removePhoto(e) {
    this.data.imageUrls.splice(e.detail.index, 1)
    this.setData({ imageUrls: this.data.imageUrls })
  },
  composingChange(e) {
    const paperSize = e.detail?.paperSize ?? { w: 0, h: 0 }
    setTimeout(() => {
      wx.createSelectorQuery().select('.container').boundingClientRect().exec((res) => {
        let { windowWidth } = wx.getSystemInfoSync()
        let [con] = res
        let w = paperSize.w / 750 * windowWidth;
        let h = paperSize.h / 750 * windowWidth;
        let cw = con.width - 20
        let ch = con.height - 40
        let { ow, oh } = contain(w, h, cw, ch)
        ow = ow / windowWidth * 750;
        oh = oh / windowWidth * 750;
        paperSize.w = ow;
        paperSize.h = oh;
        this.setData({ composingArr: e.detail?.composing ?? [], paperSize })
      })
    }, 0);
  },
  async composePhoto() {
    let result = await this.selectComponent('.main').toDataUrl()
    wx.saveImageToPhotosAlbum({
      filePath: result.tempFilePath,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          mask: true,
        })
      }
    })
  }
})
