import { base64ToTempFilePath } from '../layer/index'

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
        bgColor: {
            type: String,
            value: "rgba(0,0,0,0)"
        },
    },
    data: {
        canvas: null,
        ctx: null,
        width: 0,
        height: 0,
        src: "",
        minWidth: 0,
        minHeight: 0
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
        /** 预计算 */
        precomputation() {
            const { text, fontSize } = this.data;
            let width = text.length * fontSize;
            let height = fontSize;
            this.setData({
                width,
                height
            })
        },
        /** 初始化 */
        init() {
            const query = this.createSelectorQuery()
            query.select('#font').fields({ node: true, size: true })
            query.exec((res) => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
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
            const { width, height } = canvas;
            const { bgColor, fontColor, fontSize, text } = this.data;
            // 渲染背景
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height)
            // 设置字体颜色
            ctx.fillStyle = fontColor;
            ctx.textBaseline = "middle"
            ctx.font = `${fontSize}px sans-serif`
            ctx.fillText(text, 0, fontSize / 2)
            const measureResult = ctx.measureText(text)
            const dpr = wx.getSystemInfoSync().pixelRatio
            const tmp = ctx.getImageData(0, 0, width, height);
            canvas.width = measureResult.width * dpr
            ctx.putImageData(tmp, 0, 0)
            this.setData({
                minWidth: measureResult.width,
                minHeight: fontSize,
                src: await base64ToTempFilePath(canvas.toDataURL()),
            })

        },
        value() {
            return this.selectComponent('.image').value()
        }

    }
})
