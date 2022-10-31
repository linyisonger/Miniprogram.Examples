import { Layer, LayerOperateMode, Transparent } from "../layer/index";
import { config } from "./config";
Component({
    properties: {
        config: {
            type: Object,
            value: config
        }
    },
    data: {
        layerImageLength: 0,
        /** @type {Layer[]} */
        layers: [
            {
                type: "background",
                bgColor: "#fff",
                bgImage: '',
                isPrint: true
            }
        ],
        /** @type {Layer} */
        watermark: {
            type: 'background',
            bgColor: Transparent,
            bgImage: config.watermark.url,
            width: config.watermark.width,
            height: config.watermark.height
        },
        /** @type {Layer} */
        guide: {
            type: 'background',
            bgColor: Transparent,
            bgImage: '../../img/fuzhuxian.svg',
        },
        isRender: false,
        operateLayerIndex: -1,
        operateMode: LayerOperateMode.MOVE_SCALE_ROTATE_REMOVE,
        deleteIcon: '',
        scaleIcon: '',
        minRatio: 0
    },
    methods: {
        handleChangeLayer(e) {
            console.log(e);
            const { index } = e.currentTarget.dataset
            const layer = this.data.layers[index];
            let layerWeight = this.handleGetLayerImageRender()
            this.setData({ [`layers[${index}]`]: { ...layer, ...e.detail }, layerImageLength: layerWeight.length })
            this.triggerEvent('change', { layers: this.data.layers.filter(layer => layer.type === 'image') })
        },
        handleOperateLayer(e) {
            console.log("handleOperateLayer", e);
            const { operateLayerIndex, layers } = this.data;
            const { index } = e.currentTarget.dataset
            if (index == -1 || layers.length < 3) {
                this.setData({
                    ['operateLayerIndex']: index
                })
            }
            else if (index !== operateLayerIndex) {
                layers[index].weight = this.handleGetLayerImageRender().max + 1;
                this.setData({
                    [`layers[${index}]`]: layers[index],
                    ['operateLayerIndex']: index
                })
            }
        },
        handleGetLayerImageRender() {
            let { layers } = this.data
            let max = 1
            let index = -1;
            let length = 0
            for (let i = 0; i < layers.length; i++) {
                let tmp = layers[i];
                if (tmp.type !== 'image') continue;
                if (tmp.isRender === false) continue;
                if (max >= tmp?.weight) continue;
                max = layers[i].weight;
                index = i
                length++;
            }
            return { index, max, length }
        },
        handleGetLayerImageDelete() {
            let { layers } = this.data
            let tmp = layers.findIndex(layer => layer.type === 'image' && layer.isDelete == true)
            return { index: tmp > -1 ? tmp : layers.length, }
        },
        handleRemoveLayer(e) {
            console.log("handleRemoveLayer", e);
            const { index } = e.currentTarget.dataset
            const layer = this.data.layers[index]
            layer.isRender = false;
            layer.isDelete = true
            let layerWeight = this.handleGetLayerImageRender()
            console.log(layerWeight);
            this.setData({ [`layers[${index}]`]: layer, operateLayerIndex: layerWeight.index, })
        },
        async save() {
            /** @type {Layer[]} */
            let layers = this.data.layers.filter(a => !(a.type === 'background' && !a.isPrint))
            layers = layers.filter(a => a.isRender !== false)
            let result = await this.selectComponent('.layer-compose').render(layers)
            return { ...result, tempFilePath: result.tempPath }
        },
        add(tempFilePath) {
            this.setData({
                [`layers[${this.data.layers.length}]`]: {
                    type: 'image',
                    src: tempFilePath,
                    weight: this.handleGetLayerImageRender().max + 1,
                },
                operateLayerIndex: this.data.layers.length
            })
        },
    },
    observers: {
        'config': function (value) {
            let operateMode = 0;
            let update = {}
            if (value?.allowRemove !== false) operateMode += LayerOperateMode.REMOVE
            if (value?.allowScale !== false) operateMode += LayerOperateMode.SCALE
            if (value?.allowRotate !== false) operateMode += LayerOperateMode.ROTATE
            if (value?.allowMove !== false) operateMode += LayerOperateMode.MOVE
            if (operateMode !== this.data.operateMode) update[`operateMode`] = operateMode;
            if (value?.remove?.url) update[`deleteIcon`] = value?.remove.url
            if (value?.scale?.url) update[`scaleIcon`] = value?.scale.url
            if (value?.watermark?.url) update[`watermark.bgImage`] = value?.watermark?.url
            if (value?.watermark?.width) update[`watermark.width`] = value?.watermark?.width
            if (value?.watermark?.height) update[`watermark.height`] = value?.watermark?.height
            if (value?.minRatio) update[`minRatio`] = value?.minRatio

            this.setData(update)
        }
    }
})
