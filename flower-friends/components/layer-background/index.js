import { base64ToTempFilePath, createImage } from '../layer/index'

// 背景层
Component({
    properties: {
        /* 背景颜色 */
        bgColor: {
            type: String,
            value: "#fff"
        },
        /* 背景图片 */
        bgImage: {
            type: String,
            value: ""
        },
    },
    data: {
        canvas: null,
        ctx: null,
        loaded: false,
        layerWidth: 0,
        layerHeight: 0
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
            query.select('#background').fields({ node: true, size: true })
            query.exec((res) => {
                const [{ node: canvas, width, height }] = res
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = width * dpr
                canvas.height = height * dpr
                ctx.scale(dpr, dpr)
                this.data.canvas = canvas;
                this.data.ctx = ctx;
                this.data.layerWidth = width;
                this.data.layerHeight = height
                this.render();
                this.data.loaded = true;
            })
        },
        /** 渲染 */
        async render() {
            /** @type {HTMLCanvasElement} */
            const canvas = this.data.canvas;
            /** @type {CanvasRenderingContext2D} */
            const ctx = this.data.ctx;
            const { width, height } = canvas;
            const { layerWidth, layerHeight } = this.data
            // 获取宽度和高度 
            const bgImage = this.data.bgImage;
            const bgColor = this.data.bgColor;
            // 如果有图片则展示图片背景
            ctx.clearRect(0, 0, width, height)
            if (bgImage) {
                console.log(bgImage);
                const image = await createImage(canvas, bgImage)
                ctx.drawImage(image, 0, 0, layerWidth, layerHeight)
            }
            else {
                ctx.fillStyle = bgColor
                ctx.fillRect(0, 0, width, height)
            }
            this.setData({
                src: await base64ToTempFilePath(canvas.toDataURL('image/jpeg', 1))
            })
        },
        value() {
            const { bgColor, bgImage, layerWidth, layerHeight } = this.data

            return {
                bgColor: bgColor,
                src: bgImage,
                width: layerWidth,
                height: layerHeight,
                type: 'background'
            }
        }
    },
    observers: {
        'bgColor,bgImage': function () {
            if (this.data.loaded) this.render()
        }
    }
})
