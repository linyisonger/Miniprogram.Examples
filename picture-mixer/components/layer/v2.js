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
    /**
     * p点绕o点旋转angle°
     * @param p 当前点
     * @param o 源点
     * @param angle 角度
     */
    static rotateAroundPoint(p, o, angle) {
        var tp = V2.subtraction(p, o);
        var cos = +Math.cos(Math.PI / 180 * angle).toFixed(3);
        var sin = +Math.sin(Math.PI / 180 * angle).toFixed(3);
        var x = tp.x * cos + tp.y * sin;
        var y = tp.y * cos - tp.x * sin;
        return new V2(x, y);
    };

    /**
     * 点乘
     * @param v1 向量1
     * @param v2 向量2
     * @returns
     */
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    /**
     * 减法 p1 - p2
     * @param p1 点1
     * @param p2 点2
     * @returns 向量
     */
    static subtraction(p1, p2) {
        return new V2(p1.x - p2.x, p1.y - p2.y);
    };
    /**
     * 检测p点是否在点p1,p2,p3,p4组成的矩形内
     * @param p
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     */
    static checkInRectangle(p, p1, p2, p3, p4) {
        var p1p2 = V2.subtraction(p2, p1);
        var p1p = V2.subtraction(p, p1);
        var p2p3 = V2.subtraction(p3, p2);
        var p2p = V2.subtraction(p, p2);
        var d1 = V2.dotProduct(p1p2, p1p);
        var d2 = V2.dotProduct(p1p2, p1p2);
        var d3 = V2.dotProduct(p2p3, p2p);
        var d4 = V2.dotProduct(p2p3, p2p3);
        return 0 <= d1 && d1 <= d2 && 0 <= d3 && d3 <= d4;
    };

}