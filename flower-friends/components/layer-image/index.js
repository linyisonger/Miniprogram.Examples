
import { V2, getImageInfo, Layer, contain } from '../layer/index'

const doubleTime = 200;

Component({
    properties: {
        /** 图片 */
        src: {
            type: String,
            value: ""
        },
        minWidth: {
            type: Number,
            value: 70
        },
        minHeight: {
            type: Number,
            value: 70
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
        width: 100,
        height: 100,
        left: 0,
        top: 0,
        angle: 0,
        start: null,
        origin: null,
        loaded: false,
        lastTime: 0
    },
    lifetimes: {
        async ready() {
            await this.init();
            await this.render();
        }
    },
    methods: {
        /** 初始化 */
        init() {
            return new Promise((resolve) => {
                const query = this.createSelectorQuery()
                query.select('.layer-container').boundingClientRect((res) => {
                    const { width, height, left, top } = res;
                    this.data.layerWidth = width;
                    this.data.layerHeight = height;
                    this.data.layerLeft = left
                    this.data.layerTop = top
                    resolve()
                }).exec()
            })
        },
        /** 渲染 */
        async render() {
            const { layerWidth, layerHeight } = this.data;
            /** @type {Layer} */
            const init = this.data.init;
            const imageInfo = await getImageInfo(this.data.src)
            const { width, height } = imageInfo
            const { resultWidth, resultHeight } = contain(width, height, layerWidth / 2, layerHeight / 2)
            let tmpWidth = resultWidth
            let tmpHeight = resultHeight
            tmpWidth = Math.max(tmpWidth, this.data.minWidth)
            tmpHeight = Math.max(tmpHeight, this.data.minHeight)
            console.log(init);
            this.setData({
                left: init?.left ?? (layerWidth - tmpWidth) / 2,
                top: init?.top ?? (layerHeight - tmpHeight) / 2,
                width: init?.width ?? tmpWidth,
                height: init?.height ?? tmpHeight,
                angle: init?.angle ?? 0,
                origin: imageInfo,
                loaded: true
            })
            this.triggerEvent('change', this.value())
        },
        /** 开始 */
        touchstart(e) {
            if (+new Date() - this.data.lastTime < doubleTime) return this.triggerEvent('doubletap')
            this.data.lastTime = +new Date()

            this.data.start = {
                ...e, self: {
                    top: this.data.top,
                    left: this.data.left,
                    width: this.data.width,
                    height: this.data.height,
                    angle: this.data.angle
                }
            };
            this.triggerEvent('operate')
        },
        /** 移动 */
        touchmove(e) {
            // console.log(e);
            const { touches: [{ clientX: startX, clientY: startY }], self: { top, left, width, height, angle }, currentTarget: { dataset: { type } } } = this.data.start;
            const { touches: [{ clientX: moveX, clientY: moveY }] } = e;
            const { width: originWidth, height: originHeight } = this.data.origin
            const { layerLeft, layerTop } = this.data;
            if (type === 'scale') {
                let tmpCenterX = left + width / 2;
                let tmpCenterY = top + height / 2;
                let tmpStartDistance = new V2(tmpCenterX, tmpCenterY).distance(new V2(startX, startY))
                let tmpMoveDistance = new V2(tmpCenterX, tmpCenterY).distance(new V2(moveX, moveY))
                let scale = tmpMoveDistance / tmpStartDistance;
                let tmpWidth = width * scale
                let tmpHeight = height * scale
                tmpWidth = Math.max(tmpWidth, this.data.minWidth)
                tmpHeight = Math.max(tmpHeight, this.data.minHeight)
                let tmpLeft = left + width / 2 - tmpWidth / 2;
                let tmpTop = top + height / 2 - tmpHeight / 2;
                let tmpAngle = new V2(moveX - layerLeft - tmpCenterX, moveY - layerTop - tmpCenterY).angleByOrigin() - new V2(width / 2, height / 2).angleByOrigin()

                this.setData({
                    left: tmpLeft,
                    top: tmpTop,
                    width: tmpWidth,
                    height: tmpHeight,
                    angle: tmpAngle
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
            // console.log(e);
            this.triggerEvent('change', this.value())

        },
        /** 输出值 */
        value() {
            let {
                width,
                height,
                left,
                top,
                src,
                angle
            } = this.data
            return {
                width,
                height,
                left,
                top,
                src,
                angle,
                type: 'image'
            };
        },
        /** 删除 */
        remove() {
            this.triggerEvent('remove')
        },
    }
})
