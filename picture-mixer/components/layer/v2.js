/**
 * 二维向量
 */
export class V2 {
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

  /**
   * 获取距离源点的角度
   */
  angleByOrigin() {
    return Math.atan2(this.y, this.x) * 180 / Math.PI
  }
}