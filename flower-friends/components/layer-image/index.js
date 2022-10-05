
import { V2, getImageInfo, Layer } from '../layer/index'


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
        loaded: false
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
            const imageInfo = await getImageInfo(this.data.src)
            const { width, height } = imageInfo
            this.setData({
                left: (layerWidth - width) / 2,
                top: (layerHeight - height) / 2,
                width,
                height,
                origin: imageInfo,
                loaded: true
            })
            console.log(this.data);
        },
        /** 开始 */
        touchstart(e) {
            this.data.start = {
                ...e, self: {
                    top: this.data.top,
                    left: this.data.left,
                    width: this.data.width,
                    height: this.data.height,
                    angle: this.data.angle
                }
            };

        },
        /** 移动 */
        touchmove(e) {
            console.log(e);
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
        },
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
                angle
            };
        }
    }
})
