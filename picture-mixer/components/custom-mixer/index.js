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
            const { index } = e.currentTarget.dataset
            const layer = this.data.layers[index];
            this.setData({ [`layers[${index}]`]: { ...layer, ...e.detail } })
        },
        handleOperateLayer(e) {
            const { operateLayerIndex, layers } = this.data;
            const { index } = e.currentTarget.dataset
            if (index == -1 || layers.length < 3) {
                this.setData({
                    ['operateLayerIndex']: index
                })
            }
            else if (index !== operateLayerIndex) {
                layers[index].weight = this.handleGetMaxLayerWeight() + 1;
                this.setData({
                    [`layers[${index}]`]: layers[index],
                    ['operateLayerIndex']: index
                })
            }
        },
        handleGetMaxLayerWeight() {
            const { layers } = this.data
            let max = layers[0]?.weight ?? 1
            for (let i = 1; i < layers.length; i++) if (max < layers[i]?.weight) max = layers[i].weight
            return max;
        },
        handleRemoveLayer(e) {
            const { index } = e.currentTarget.dataset
            this.setData({ isRender: true })
            this.data.layers.splice(index, 1)
            this.setData({ layers: this.data.layers, isRender: false })
        },
        async save() {
            /** @type {Layer[]} */
            let layers = this.selectAllComponents('.paper-child').map((pc) => pc.value())
            layers = layers.filter(a => !(a.type === 'background' && !a.isPrint))
            let result = await this.selectComponent('.layer-compose').render(layers)
            return { ...result, tempFilePath: result.tempPath }
        },
        add(tempFilePath) {
            this.setData({
                [`layers[${this.data.layers.length}]`]: {
                    type: 'image',
                    src: tempFilePath,
                    weight: this.handleGetMaxLayerWeight() + 1
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
