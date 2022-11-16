
/**
 * @typedef {object} ImageInfoRes 
 * @property {number} width
 * @property {number} height
 */

/**
 * 
 * @param {string} src
 * @returns {Promise<ImageInfoRes>} 
 */
export function getImageInfo(src) {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src,
            success: resolve,
            fail: reject
        })
    })
}