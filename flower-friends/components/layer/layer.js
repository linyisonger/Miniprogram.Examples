export const ArrangeType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}
export const AlignType = {
  center: 'center',
  left: 'left',
  right: 'right'
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
  /** @type {'image'|'font'|'background'} */
  type
  /** @type {typeof ArrangeType} */
  arrange
  /** @type {typeof AlignType} */
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
}