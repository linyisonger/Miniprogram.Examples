
import { V2, LayerDefinition, getImageInfo, measureOneColumnText, Layer, contain, ArrangeType, AlignType, measureOneRowText, base64ToTempFilePath, Transparent, InitSize, LayerType } from '../layer/index'

const doubleTime = 500;
const longTime = 500;

Component({
    properties: {
        minWidth: {
            type: Number,
            value: 20
        },
        minHeight: {
            type: Number,
            value: 20
        },
        text: {
            type: String,
            value: "哈哈哈哈"
        },
        fontSize: {
            type: Number,
            value: 20
        },
        fontColor: {
            type: String,
            value: "rgba(0,0,0,1)"
        },
        fontFamily: {
            type: String,
            value: 'yihua'
        },
        arrange: {
            type: String,
            value: ArrangeType.horizontal
        },
        fontAlign: {
            type: String,
            value: AlignType.center
        },
        bgColor: {
            type: String,
            value: "rgba(0,0,0,0)"
        },
        letterSpace: {
            type: Number,
            value: 0
        },
        lineSpace: {
            type: Number,
            value: 0
        },
        marginTop: {
            type: Number,
            value: 0
        },
        marginBottom: {
            type: Number,
            value: 0
        },
        marginLeft: {
            type: Number,
            value: 0
        },
        marginRight: {
            type: Number,
            value: 0
        },
        init: {
            type: Layer,
            value: null
        },
        operate: {
            type: Boolean,
            value: false
        }
    },
    data: {
        layerWidth: 100,
        layerHeight: 100,
        layerLeft: 0,
        layerTop: 0,
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        angle: 0,
        start: null,
        loaded: false,
        lastTime: 0,
        canvas: null,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        src: '',
        longTapTimeoutId: 0 // 长按事件回调
    },
    lifetimes: {
        async ready() {
            await this.initContainer();
            this.initLayer();
            this.render()
        }
    },
    methods: {
        /** 初始化 */
        initContainer() {
            return new Promise((resolve) => {
                const query = this.createSelectorQuery()
                query.select('.layer-container').boundingClientRect();
                query.select('#font').fields({ node: true, size: true })
                query.exec(
                    (res) => {
                        const [{ width, height, left, top }] = res;
                        this.data.layerWidth = width;
                        this.data.layerHeight = height;
                        this.data.layerLeft = left
                        this.data.layerTop = top
                        resolve()
                    })
            })
        },
        initCanvas() {
            return new Promise((resolve) => {
                const query = this.createSelectorQuery()
                query.select('.layer-container').boundingClientRect();
                query.select('#font').fields({ node: true, size: true })
                query.exec(
                    (res) => {
                        const [, { node: canvas, width: canvasWidth, height: canvasHeight }] = res;
                        const ctx = canvas.getContext('2d')
                        let dpr = wx.getSystemInfoSync().pixelRatio
                        dpr *= LayerDefinition;
                        canvas.width = canvasWidth * dpr
                        canvas.height = canvasHeight * dpr
                        ctx.scale(dpr, dpr)
                        this.data.canvas = canvas;
                        this.data.ctx = ctx;
                        this.data.canvasWidth = canvasWidth
                        this.data.canvasHeight = canvasHeight
                        resolve()
                    })
            })
        },
        initLayer() {
            const { layerWidth, layerHeight } = this.data;
            /** @type {Layer} */
            const init = this.data.init;
            const { width: initWidth, height: initHeight } = InitSize[LayerType.font]
            const containerWidth = layerWidth * initWidth
            const containerHeight = layerWidth * initHeight
            const { width, height } = this.data;
            const { resultWidth, resultHeight } = contain(width || containerWidth, height || containerHeight, containerWidth, containerHeight)
            let tmpWidth = Math.max(resultWidth, this.data.minWidth)
            let tmpHeight = Math.max(resultHeight, this.data.minHeight)
            this.setData({
                left: init?.left ?? (layerWidth - tmpWidth) / 2,
                top: init?.top ?? (layerHeight - tmpHeight) / 2,
                width: init?.width ?? tmpWidth,
                height: init?.height ?? tmpHeight,
                angle: init?.angle ?? 0,
                loaded: true
            })
        },
        /** 渲染 */
        async render() {
            await this.initCanvas();
            /** @type {HTMLCanvasElement} */
            const canvas = this.data.canvas;
            /** @type {CanvasRenderingContext2D} */
            const ctx = this.data.ctx;
            const { arrange, canvasWidth, width, height, canvasHeight, bgColor, fontColor, fontFamily, fontSize, letterSpace, lineSpace, text, fontAlign } = this.data;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            if (bgColor && bgColor != Transparent) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight)
            }
            ctx.fillStyle = fontColor
            ctx.font = `normal ${fontSize}px "${fontFamily}"`
            if (arrange === ArrangeType.horizontal) {
                if (fontAlign === AlignType.left) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneRowText(ctx, r, width, letterSpace)
                        r = r.substr(ol.text.length)
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            ctx.fillText(char, x, y)
                            x += charMeasureResult.width + letterSpace;
                        }
                        x = 0;
                        y += fontSize + lineSpace;
                    }
                }
                else if (fontAlign === AlignType.right) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneRowText(ctx, r, width, letterSpace)
                        r = r.substr(ol.text.length)
                        x = width - ol.width
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            ctx.fillText(char, x, y)
                            x += charMeasureResult.width + letterSpace;
                        }
                        x = 0;
                        y += fontSize + lineSpace;
                    }

                }
                else if (fontAlign === AlignType.center) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneRowText(ctx, r, width, letterSpace)
                        r = r.substr(ol.text.length)
                        x = (width - ol.width) / 2
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            ctx.fillText(char, x, y)
                            x += charMeasureResult.width + letterSpace;
                        }
                        x = 0;
                        y += fontSize + lineSpace;
                    }
                }
            }
            else if (arrange === ArrangeType.vertical) {
                if (fontAlign === AlignType.left) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneColumnText(ctx, r, height, lineSpace, fontSize)
                        console.log(ol);
                        r = r.substr(ol.text.length)
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            if (/^[\u4e00-\u9fa5]+$/.test(char)) {
                                ctx.textBaseline = 'top'
                                ctx.fillText(char, x, y)
                                y += fontSize + lineSpace;
                            }
                            else {
                                ctx.textBaseline = 'bottom'
                                ctx.translate(x, y)
                                ctx.rotate(90 / 180 * Math.PI)
                                ctx.save();
                                ctx.fillText(char, 0, 0)
                                ctx.restore();
                                ctx.rotate(-90 / 180 * Math.PI);
                                ctx.translate(-x, -y)
                                y += charMeasureResult.width + lineSpace;
                            }
                        }
                        x += fontSize + lineSpace;
                        y = 0;
                    }
                }
                else if (fontAlign === AlignType.center) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneColumnText(ctx, r, height, lineSpace, fontSize)
                        r = r.substr(ol.text.length)
                        y = (height - ol.height) / 2
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            if (/^[\u4e00-\u9fa5]+$/.test(char)) {
                                ctx.textBaseline = 'top'
                                ctx.fillText(char, x, y)
                                y += fontSize + lineSpace;
                            }
                            else {
                                ctx.textBaseline = 'bottom'
                                ctx.translate(x, y)
                                ctx.rotate(90 / 180 * Math.PI)
                                ctx.save();
                                ctx.fillText(char, 0, 0)
                                ctx.restore();
                                ctx.rotate(-90 / 180 * Math.PI);
                                ctx.translate(-x, -y)
                                y += charMeasureResult.width + lineSpace;
                            }
                        }
                        x += fontSize + lineSpace;
                        y = 0;
                    }
                }
                else if (fontAlign === AlignType.right) {
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'top'
                    let x = 0;
                    let y = 0;
                    /** @type {string} */
                    let r = text;
                    while (r.length > 0) {
                        let ol = await measureOneColumnText(ctx, r, height, lineSpace, fontSize)
                        console.log(ol);
                        r = r.substr(ol.text.length)
                        y = height - ol.height
                        for (let i = 0; i < ol.text.length; i++) {
                            const char = ol.text[i];
                            const charMeasureResult = ctx.measureText(char);
                            if (/^[\u4e00-\u9fa5]+$/.test(char)) {
                                ctx.textBaseline = 'top'
                                ctx.fillText(char, x, y)
                                y += fontSize + lineSpace;
                            }
                            else {
                                ctx.textBaseline = 'bottom'
                                ctx.translate(x, y)
                                ctx.rotate(90 / 180 * Math.PI)
                                ctx.save();
                                ctx.fillText(char, 0, 0)
                                ctx.restore();
                                ctx.rotate(-90 / 180 * Math.PI);
                                ctx.translate(-x, -y)
                                y += charMeasureResult.width + lineSpace;
                            }
                        }
                        x += fontSize + lineSpace;
                        y = 0;
                    }
                }
            }
            this.data.src = await base64ToTempFilePath(canvas.toDataURL())
            this.triggerEvent('change', this.value())
        },
        /** 开始 */
        touchstart(e) {
            console.log(e);
            this.data.longTapTimeoutId = setTimeout(() => this.triggerEvent('longtap'), longTime);
            if (e.touches.length < 2 && +new Date() - this.data.lastTime < doubleTime) return this.triggerEvent('doubletap')
            this.data.lastTime = +new Date()
            const { layerLeft, layerTop } = this.data;
            let touchs = e.touches.map(t => {
                return {
                    x: t.clientX - layerLeft,
                    y: t.clientY - layerTop
                }
            });
            this.data.start = {
                ...e, self: {
                    top: this.data.top,
                    left: this.data.left,
                    width: this.data.width,
                    height: this.data.height,
                    angle: this.data.angle,
                    rotateV2: touchs.length >= 2 ? V2.c(touchs[1]).subtract(touchs[0]) : null
                }
            };
            this.triggerEvent('operate')
        },
        /** 移动 */
        touchmove(e) {
            console.log(e);
            clearTimeout(this.data.longTapTimeoutId)
            const { touches: [{ clientX: startX, clientY: startY }], self: { top, left, width, height, angle, rotateV2 }, currentTarget: { dataset: { type } } } = this.data.start;
            const { touches: [{ clientX: moveX, clientY: moveY }] } = e;
            const { layerLeft, layerTop } = this.data;
            let touchs = e.touches.map(t => {
                return {
                    x: t.clientX - layerLeft,
                    y: t.clientY - layerTop
                }
            });
            if (type === 'scale') {
                let tmpCenterX = left + width / 2;
                let tmpCenterY = top + height / 2;
                // let tmpStartDistance = new V2(tmpCenterX, tmpCenterY).distance(new V2(startX, startY))
                // let tmpMoveDistance = new V2(tmpCenterX, tmpCenterY).distance(new V2(moveX, moveY))
                // let scale = tmpMoveDistance / tmpStartDistance;
                let tmpWidth = Math.abs(moveX - layerLeft - tmpCenterX) * 2;
                let tmpHeight = Math.abs(moveY - layerTop - tmpCenterY) * 2
                tmpWidth = Math.max(tmpWidth, this.data.minWidth)
                tmpHeight = Math.max(tmpHeight, this.data.minHeight)
                let tmpLeft = left + width / 2 - tmpWidth / 2;
                let tmpTop = top + height / 2 - tmpHeight / 2;
                this.setData({
                    left: tmpLeft,
                    top: tmpTop,
                    width: tmpWidth,
                    height: tmpHeight,
                })
            }
            else if (touchs.length >= 2) {
                const rotateEndAngle = V2.c(touchs[1]).subtract(touchs[0]).angleByVector(rotateV2);
                this.setData({
                    angle: angle - rotateEndAngle
                })
            }
            else {
                this.setData({
                    left: moveX - startX + left,
                    top: moveY - startY + top
                })
            }
        },
        /** 结束 */
        touchend(e) {
            clearTimeout(this.data.longTapTimeoutId)
            this.render()
        },
        /** 输出值 */
        value() {
            let {
                width,
                height,
                left,
                top,
                angle,
                fontAlign,
                bgColor,
                fontColor,
                fontSize,
                text,
                arrange,
                lineSpace,
                letterSpace,
                fontFamily,
                src
            } = this.data
            return {
                width,
                height,
                left,
                top,
                src,
                angle,
                type: 'font',
                fontAlign,
                bgColor,
                fontColor,
                fontSize,
                text,
                arrange,
                lineSpace,
                letterSpace,
                fontFamily
            }

        },
        /** 删除 */
        remove() {
            this.triggerEvent('remove')
        },
    }
})
