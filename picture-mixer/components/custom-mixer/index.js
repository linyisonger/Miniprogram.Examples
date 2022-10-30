import { Layer, Transparent } from "../layer/index";
Component({
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
      bgImage: 'https://bkimg.cdn.bcebos.com/pic/d8f9d72a6059252dd42a0b8b21d0143b5bb5c8ea13a3?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5',
    },
    /** @type {Layer} */
    guide: {
      type: 'background',
      bgColor: Transparent,
      bgImage: '../../img/fuzhuxian.svg',
    },
    isRender: false,
    operateLayerIndex: -1
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
  }
})
