import { base64ToTempFilePath, ArrangeType, AlignType, Layer } from '../layer/index'

Component({
    properties: {
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
        canvas: null,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        src: "",
        minWidth: 0,
        minHeight: 0,
        loaded: false
    },
    lifetimes: {
        attached() {
            this.precomputation();
        },
        ready() {
            this.init();
        }
    },
    methods: {
        /** 获取边距 */
        getMargin() {
            const { marginLeft, marginTop, marginRight, marginBottom, fontSize } = this.data
            const defalutMargin = 6;
            return {
                left: marginLeft || defalutMargin,
                right: marginRight || defalutMargin,
                top: marginTop || defalutMargin,
                bottom: marginBottom || defalutMargin,
            }
        },
        /** 预计算 */
        precomputation() {
            const { text, fontSize, arrange, lineSpace, letterSpace } = this.data;
            const { left, right, top, bottom } = this.getMargin()
            let width;
            let height;
            if (arrange === ArrangeType.vertical) {
                width = fontSize + left + right;
                height = text.length * fontSize + (text.length - 1) * lineSpace
            }
            else {
                width = text.length * fontSize + (text.length - 1) * letterSpace;
                height = fontSize + top + bottom;
            }
            this.setData({
                canvasWidth: width,
                canvasHeight: height,
            })
            console.log(width, height, this.data.init);
        },
        /** 初始化 */
        init() {
            const query = this.createSelectorQuery()
            query.select('#font').fields({ node: true, size: true })
            query.exec((res) => {
                const [{ node: canvas, width, height }] = res
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = width * dpr
                canvas.height = height * dpr
                ctx.scale(dpr, dpr)
                this.data.canvas = canvas;
                this.data.ctx = ctx;
                this.render();
            })
        },
        /** 渲染 */
        async render() {
            /** @type {HTMLCanvasElement} */
            const canvas = this.data.canvas;
            /** @type {CanvasRenderingContext2D} */
            const ctx = this.data.ctx;
            const { width: canvasWidth, height: canvasHeight } = canvas;
            const { fontAlign, bgColor, fontColor, fontSize, text, arrange, lineSpace, letterSpace, fontFamily } = this.data;
            const { left, right, top, bottom } = this.getMargin()
            // 清空画布
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            // 渲染背景b
            if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight)
            }
            // 设置字体颜色
            ctx.fillStyle = fontColor;
            ctx.textBaseline = "middle"
            ctx.font = `normal ${fontSize}px "${fontFamily}"`
            let charMaxWidth = 0
            let minWidth = 0
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charMeasureResult = ctx.measureText(char);
                if (i > 0) minWidth += letterSpace
                if (charMaxWidth < charMeasureResult.width) {
                    charMaxWidth = charMeasureResult.width
                }
                let x = 0;
                let y = 0;
                let tmpTextBaseline = {
                    [AlignType.left]: 'top',
                    [AlignType.right]: 'bottom',
                }
                switch (fontAlign) {
                    case AlignType.left:
                        x = 0
                        y = 0
                        break;
                    case AlignType.right:
                        x = left + charMaxWidth + right
                        y = top + fontSize + bottom;
                        break
                    default:
                        x = left + charMaxWidth / 2;
                        y = top + fontSize / 2;
                        break;
                }
                if (arrange === ArrangeType.horizontal) {
                    ctx.textBaseline = tmpTextBaseline[fontAlign] ?? 'middle'
                    ctx.fillText(char, minWidth, y)
                }
                else {
                    ctx.textBaseline = 'top'
                    ctx.textAlign = fontAlign || AlignType.center
                    ctx.fillText(char, x, i * (fontSize + lineSpace))
                }
                minWidth += charMeasureResult.width
            }

            const dpr = wx.getSystemInfoSync().pixelRatio
            const tmp = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            let minHeight;
            if (arrange === ArrangeType.horizontal) {
                minHeight = fontSize + top + bottom;
            }
            else {
                minWidth = charMaxWidth + left + right;
                minHeight = fontSize * text.length + (text.length - 1) * lineSpace
            }
            canvas.width = minWidth * dpr
            ctx.putImageData(tmp, 0, 0)
            this.setData({
                minWidth,
                minHeight,
                src: await base64ToTempFilePath(canvas.toDataURL()),
            })

        },
        value() {
            let {
                fontAlign, bgColor, fontColor, fontSize, text, arrange, lineSpace, letterSpace, fontFamily
            } = this.data
            return { ...this.selectComponent('.image').value(), type: 'font', fontAlign, bgColor, fontColor, fontSize, text, arrange, lineSpace, letterSpace, fontFamily }
        },
        /** 删除 */
        remove() {
            this.triggerEvent('remove')
        },
        handleChange(e) {
            this.triggerEvent('change', this.value())
        },
        handleOperate(e) {
            this.triggerEvent('operate')
        },
        doubletap() {
            this.triggerEvent('doubletap')
        }
    },
    observers: {
        'text, fontSize, fontColor, fontFamily, arrange, bgColor, fontAlign': function () {
            this.precomputation();
            this.init();
        },
    }
})
