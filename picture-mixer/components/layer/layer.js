// 图层清晰度
export const LayerDefinition = 2.5;
export const LayerType = {
    image: 'image',
    font: 'font',
    background: 'background'
}
// 图层操作模式
export const LayerOperateMode = {
    MOVE: 1,
    SCALE: 2,
    MOVE_SCALE: 3,
    ROTATE: 4,
    MOVE_ROTATE: 5,
    SCALE_ROTATE: 6,
    MOVE_SCALE_ROTATE: 7,
    REMOVE: 8,
    MOVE_REMOVE: 9,
    SCALE_REMOVE: 10,
    MOVE_SCALE_REMOVE: 11,
    ROTATE_REMOVE: 12,
    MOVE_ROTATE_REMOVE: 13,
    SCALE_ROTATE_REMOVE: 14,
    MOVE_SCALE_ROTATE_REMOVE: 15,
}
// 暂无思路
export const LayerMoveMode = {
    FREEDOM: 1,
    BOUNDARY: 2,
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
    /** @type {boolean} */
    isRender
    /** @type {boolean} */
    isDelete
}