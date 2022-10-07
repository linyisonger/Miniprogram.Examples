import { createImage, Layer, base64ToTempFilePath } from "../layer/index"

Component({
    data: {
        canvas: null,
        ctx: null,
    },
    lifetimes: {
        ready() {
            this.init()
        }
    },
    methods: {
        /** 初始化 */
        init() {
            const query = this.createSelectorQuery()
            query.select('#compose').fields({ node: true, size: true })
            query.exec((res) => {
                const [{ node: canvas, width, height }] = res
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = width * dpr
                canvas.height = height * dpr
                ctx.scale(dpr, dpr)
                this.data.canvas = canvas;
                this.data.ctx = ctx;
            })
        },
        /** 
         * 渲染
         * @param {Layer[]} layers
         */
        async render(layers) {
            console.log(layers);
            /** @type {HTMLCanvasElement} */
            const canvas = this.data.canvas;
            /** @type {CanvasRenderingContext2D} */
            const ctx = this.data.ctx;
            const { width: canvasWidth, height: canvasHeight } = canvas;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            for (let i = 0; i < layers.length; i++) {
                let { src, left, top, width, height, angle, type, bgColor } = layers[i]
                if (src) {
                    let image = await createImage(canvas, src)
                    ctx.translate(left + width / 2, top + height / 2)
                    ctx.rotate(angle / 180 * Math.PI)
                    ctx.save();
                    ctx.drawImage(image, -width / 2, -height / 2, width, height);
                    ctx.restore();
                    ctx.rotate(-angle / 180 * Math.PI);
                    ctx.translate(-(left + width / 2), -(top + height / 2))
                }
                else {
                    ctx.fillStyle = bgColor
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
                }
            }
            let base64 = canvas.toDataURL()
            return { base64, tempPath: await base64ToTempFilePath(base64) }
        },

    }
})
