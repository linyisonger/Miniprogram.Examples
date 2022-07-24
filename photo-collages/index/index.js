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
    const windowInfo = wx.getWindowInfo()
    this.setData({ safeAreaBottom: windowInfo.screenHeight - windowInfo.safeArea.bottom })
  },
  addPhotos() {
    wx.chooseMedia({
      count: this.data.maxUploadImageCount - this.data.imageUrls.length,
      mediaType: ['image'],
      success: (res) => {
        this.setData({ imageUrls: [...this.data.imageUrls, ...res.tempFiles.map(f => f.tempFilePath)] })
      }
    })
  },
  removePhoto(e) {
    this.data.imageUrls.splice(e.detail.index, 1)
    this.setData({ imageUrls: this.data.imageUrls })
  },
  composingChange(e) {
    this.setData({ composingArr: e.detail.composing, paperSize: e.detail.paperSize })
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
