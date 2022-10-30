// 图层清晰度
export const LayerDefinition = 2;
export const LayerType = {
    image: 'image',
    font: 'font',
    background: 'background'
}

export const Transparent = 'transparent';
export const ArrangeType = {
    horizontal: 'horizontal',
    vertical: 'vertical'
}
export const AlignType = {
    center: 'center',
    left: 'left',
    right: 'right'
}
export const InitSize = {
    [LayerType.font]: {
        width: 3 / 4,
        height: 1 / 2
    },
    [LayerType.image]: {
        width: 1 / 2,
        height: 1 / 2
    }
}
export class Layer {
    /** @type {string} */
    src
    /** @type {string} */
    bgImage
    /** @type {number} */
    width
    /** @type {number} */
    height
    /** @type {number} */
    left
    /** @type {number} */
    top
    /** @type {number} */
    angle
    /** @type {keyof LayerType} */
    type
    /** @type {keyof ArrangeType} */
    arrange
    /** @type {keyof AlignType} */
    fontAlign
    /** @type {string} */
    bgColor
    /** @type {string} */
    fontFamily
    /** @type {string} */
    text
    /** @type {number} */
    fontSize
    /** @type {string} */
    fontColor
    /** @type {number} */
    letterSpace
    /** @type {number} */
    lineSpace
    /** @type {boolean} */
    isPrint
    /** @type {number} */
    weight
}