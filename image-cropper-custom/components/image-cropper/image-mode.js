/**
 * 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
 * @param originWidth 源 宽
 * @param originHeight 源 高
 * @param targetWidth 目标 宽
 * @param targetHeight 目标 高
 */
export function aspectFit(originWidth, originHeight, targetWidth, targetHeight) {

    let offsetX = 0;
    let offsetY = 0;
    let resultWidth = 0;
    let resultHeight = 0;

    /** 宽高比例 */
    let scale = originWidth / originHeight

    /** 检测宽高大小 */
    if (originWidth > originHeight) {
        /** 
         * 结果的宽度 = 目标的宽度
         * 结果的高度 = 目标宽度 / 宽高比
         */
        resultWidth = targetWidth;
        resultHeight = resultWidth / scale;
    }
    else {
        /** 
         * 结果的高度 = 目标的高度
         * 结果的宽度 = 目标高度 * 宽高比
         */
        resultHeight = targetHeight;
        resultWidth = resultHeight * scale;
    }

    /** 如果结果宽度大于目标宽度 */
    if (resultWidth > targetWidth) {
        resultWidth = targetWidth;
        resultHeight = resultWidth / scale;
    }
    /** 如果结果高度大于目标高度 */
    if (resultHeight > targetHeight) {
        resultHeight = targetHeight;
        resultWidth = resultHeight * scale;
    }

    offsetX = (targetWidth - resultWidth) / 2;
    offsetY = (targetHeight - resultHeight) / 2


    return {
        offsetX,
        offsetY,
        resultWidth,
        resultHeight,
    }
}

/**
 * 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
 * @param originWidth 源 宽
 * @param originHeight 源 高
 * @param targetWidth 目标 宽
 * @param targetHeight 目标 高
 */
export function aspectFill(originWidth, originHeight, targetWidth, targetHeight) {

    let offsetX = 0;
    let offsetY = 0;
    let resultWidth = 0;
    let resultHeight = 0;

    /** 宽高比例 */
    let scale = originWidth / originHeight
    /** 检测宽高大小 */
    if (originWidth < originHeight) {
        /** 
         * 结果的宽度 = 目标的宽度
         * 结果的高度 = 目标宽度 / 宽高比
         */
        resultWidth = targetWidth;
        resultHeight = resultWidth / scale;
    }
    else {
        /** 
         * 结果的高度 = 目标的高度
         * 结果的宽度 = 目标高度 * 宽高比
         */
        resultHeight = targetHeight;
        resultWidth = resultHeight * scale;
    }

    offsetX = (targetWidth - resultWidth) / 2;
    offsetY = (targetHeight - resultHeight) / 2

    return {
        offsetX,
        offsetY,
        resultWidth,
        resultHeight,
    }
}