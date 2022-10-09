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
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text
 * @returns {Promise<{ text:string , width:number}> }
 */
export function measureOneRowText(ctx, text, width, letterSpace) {
    return new Promise((resolve, reject) => {
        let str = ''
        let curWidth = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charMeasureResult = ctx.measureText(char)
            if (curWidth + charMeasureResult.width > width) {
                resolve({ text: str, width: curWidth })
            }
            curWidth += charMeasureResult.width;
            str += char
            curWidth += letterSpace
        }
        resolve({ text: str, width: curWidth })
    })
}
/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text
 * @param {string} lineSpace
 * @returns {Promise<{ text:string , height:number}> }
 */
export function measureOneColumnText(ctx, text, height, lineSpace, fontSize) {
    return new Promise((resolve, reject) => {
        let str = ''
        let curHeight = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charMeasureResult = ctx.measureText(char)
            const charHeight = /^[\u4e00-\u9fa5]+$/.test(char) ? fontSize : charMeasureResult.width

            if (curHeight + charHeight > height) {
                resolve({ text: str, height: curHeight })
            }
            curHeight += charHeight;
            str += char
            curHeight += lineSpace
        }
        resolve({ text: str, height: curHeight })
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

/**
 * 加载字体
 * @param {string} family 
 * @param {string} source 
 */
export function loadFontFace(family, source) {
    if (source.startsWith('http')) source = `url('${source}')`

    return new Promise((resolve, reject) => {
        wx.loadFontFace({
            family,
            source,
            global: true,
            scopes: ['native'],
            success: (res) => {
                console.log(family, res, source);
                resolve(res)
            },
            fail: (err) => {
                console.log(err, source);
            }
        })
    })
}

/**
 * 缩放
 * @param {number} originWidth 源图宽 
 * @param {number} originHeight 源图高
 * @param {number} targetWidth 目标宽
 * @param {number} targetHeight 目标高
 */
export function contain(originWidth, originHeight, targetWidth, targetHeight) {
    let scale = 0;
    if (originWidth > originHeight) {
        scale = originWidth / originHeight;
        originWidth = targetWidth;
        originHeight = originWidth / scale
    } else {
        scale = originWidth / originHeight;
        originHeight = targetHeight;
        originWidth = originHeight * scale
    }

    if (targetHeight < originHeight) {
        scale = originWidth / originHeight;
        originHeight = targetHeight;
        originWidth = originHeight * scale
    }
    if (targetWidth < originWidth) {
        scale = originWidth / originHeight;
        originWidth = targetWidth;
        originHeight = originWidth / scale
    }
    return {
        resultWidth: originWidth,
        resultHeight: originHeight
    }
}

/**
 * 
 * @param {number} count
 * @returns {Promise<string[]>}  
 */
export function chooseImage(count = 1) {
    return new Promise((resolve, reject) => {
        wx.showActionSheet({
            itemList: ['相册', '拍照', '从微信聊天选择'],
            success(res) {
                if (res.tapIndex == 0 || res.tapIndex == 1) {
                    wx.chooseMedia({
                        count: 1,
                        mediaType: ['image'],
                        sourceType: [res.tapIndex == 0 ? 'album' : 'camera'],
                        sizeType: ['original'],
                        success: (res) => {
                            resolve(res.tempFiles.map(a => a.tempFilePath))
                        }
                    })
                }
                else if (res.tapIndex == 2) {
                    wx.chooseMessageFile({
                        count,
                        type: 'image',
                        success: (res) => {
                            resolve(res.tempFiles.map(a => a.path))
                        }
                    })
                }
                else {
                    resolve([])
                }
            },
            fail: console.log
        })
    })
}