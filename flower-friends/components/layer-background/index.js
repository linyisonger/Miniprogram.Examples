import { base64ToTempFilePath, createImage, LayerDefinition, Transparent } from '../layer/index'

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
        isPrint: {
            type: Boolean
        }
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
                let dpr = wx.getSystemInfoSync().pixelRatio
                dpr *= LayerDefinition;
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
                this.setData({ src: await base64ToTempFilePath(canvas.toDataURL('image/jpeg', 1)) })
            }
            else {
                ctx.fillStyle = bgColor
                ctx.fillRect(0, 0, width, height)
                this.setData({
                    src: bgColor != Transparent ? await base64ToTempFilePath(canvas.toDataURL('image/jpeg', 1)) : ''
                })
            }
        },
        value() {
            const { bgColor, bgImage, layerWidth, layerHeight, isPrint } = this.data

            return {
                bgColor: bgColor,
                src: bgImage,
                width: layerWidth,
                height: layerHeight,
                isPrint,
                type: 'background'
            }
        }
    },
    observers: {
        'bgColor,bgImage,isPrint': function (old, n, o) {
            if (this.data.loaded) this.render()
        },
    }
})
