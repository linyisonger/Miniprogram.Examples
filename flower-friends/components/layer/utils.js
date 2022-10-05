/**
 * @param {HTMLCanvasElement} canvas 
 * @param {string} src 
 * @returns {Promise<CanvasImageSource> }
 */
export function createImage(canvas, src) {
  return new Promise((resolve, reject) => {
    let img = canvas.createImage();
    img.src = src;
    img.onload = () => {
      resolve(img)
    }
  })
}

/**
 * 获取临时图片
 * @param {string} base64 
 * @returns {Promise<string>}
 */
export function base64ToTempFilePath(base64) {
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
 * @param {string} src 
 * @returns {Promise<WechatMiniprogram.GetImageInfoSuccessCallbackResult> }
 */
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: (res) => {
        resolve(res)
      }
    })
  })
}