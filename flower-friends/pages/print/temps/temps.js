import { ArrangeType, chooseImage, contain, Layer, Transparent, loadFontFace } from "../../../components/layer/index";
const paperSizeConfig = {
    minWidth: 142,
    minHeight: 255,
    maxWidth: 686,
    maxHeight: 970
}

const getDefaultFontSet = function () {
    return {
        fontName: '',
        fontSize: '16',
        letterSpace: '0',
        lineSpace: '0',
        align: 'center',
        arrange: 'horizontal',
        content: '',
        cardBg: 'rgba(255,255,255,1)',
        fontBg: Transparent,
        fontColor: 'rgba(0,0,0,1)'
    }
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        tempName: '',
        paper: {
            width: 343,
            height: 243
        },
        fakePaper: {
            width: 343,
            height: 243
        },
        fontSet: getDefaultFontSet(),
        arrangesArray: [{
            'name': '水平',
            'align': 'horizontal'
        },
        {
            'name': '垂直',
            'align': 'vertical'
        }
        ],
        arrangeIndex: 0,
        alignsArray: [
            {
                'name': '居中',
                'align': 'center'
            }, {
                'name': '左对齐',
                'align': 'left'
            },
            {
                'name': '右对齐',
                'align': 'right'
            }
        ],
        alignIndex: 0,
        fontIndex: 0,
        fontsArray: [
            {
                'id': 0,
                'name': '秋日纷至沓来',
                'font': 'Qiu Ri',
                'url': 'https://mxj.zv100.net/a.ttf'
            },
            {
                'id': 1,
                'name': '银河微微光亮',
                'font': 'Yin He',
                'url': 'https://mxj.zv100.net/b.ttf'
            },
        ],
        setTitle: '卡片',
        setShow: false,
        rgba: 'rgba(0,154,97,1)', //初始值
        pick: false,
        chooseColorIndex: 0,
        /** @type {Layer[]} */
        layers: [
            {
                type: "background",
                bgColor: Transparent,
                bgImage: '',
                isPrint: false
            }
        ],
        operateLayerIndex: -1,
        isRender: false,
        paperContainer: {
            width: 0,
            height: 0
        }
    },
    async loadFontFaces() {
        for (const font of this.data.fontsArray) {
            await loadFontFace(font.font, font.url)
        }
    },
    handleIsPrintBackgroundChange(e) {
        this.setData({ [`layers[0].isPrint`]: e.detail.value })
    },
    handlePaperContainerSize() {
        const query = this.createSelectorQuery();
        query.select('.paper-container').boundingClientRect();
        query.exec((res) => {
            this.setData({ paperContainer: res[0] })
            this.handlePaperAutoSize()
        })
    },
    handlePaperAutoSize() {
        const { width: targetWidth, height: targetHeight } = this.data.paperContainer;
        const { width: originWidth, height: originHeight } = this.data.fakePaper
        const { width: realWidth, height: realHeight } = this.data.paper

        let width;
        let height;
        if (originWidth < targetWidth && originHeight < targetHeight) {
            width = originWidth;
            height = originHeight
        }
        else {
            let { resultWidth, resultHeight } = contain(originWidth, originHeight, targetWidth, targetHeight)
            width = Math.round(resultWidth);
            height = Math.round(resultHeight);
        }
        if (width == realWidth && height == realHeight) return;
        this.setData({ isRender: true })
        this.setData({
            'paper': { width, height },
            isRender: false
        })
    },
    // 显示取色器
    toPick(e) {
        console.log(e)
        var index = e.currentTarget.dataset.index;
        var currentcolor = e.currentTarget.dataset.currentcolor;

        this.setData({
            chooseColorIndex: index,
            rgba: currentcolor,
            pick: true,
        })
    },
    //取色结果回调
    pickColor(e) {
        let rgba = e.detail.color;
        let { layers } = this.data
        switch (this.data.chooseColorIndex) {
            case '0':
                layers[0].bgColor = rgba;
                this.setData({
                    [`layers[0]`]: layers[0],
                    ['fontSet.cardBg']: rgba
                })
                break;
            case '1':
                this.setData({
                    ['fontSet.fontBg']: rgba
                })
                break;
            case '2':
                this.setData({
                    ['fontSet.fontColor']: rgba
                })
                break;
        }
    },
    async handleTabClick(e) {
        const { index } = e.currentTarget.dataset;
        switch (index) {
            case '图片':
                const result = await chooseImage(1)
                if (result.length > 0) {
                    this.setData({
                        [`layers[${this.data.layers.length}]`]: {
                            type: 'image',
                            src: result[0],
                        },
                        operateLayerIndex: this.data.layers.length
                    })
                }
                break;
            case '文字':
                this.setData({ setTitle: index, operateLayerIndex: -1, setShow: true })
                this.handleInitFontSet()
                break;
            default:
                this.setData({ setTitle: index, setShow: true })
                break;
        }
    },
    hideFix() {
        this.setData({ setShow: false })
        this.handlePaperAutoSize()
    },
    touchAnother() {
        // 阻止冒泡
    },
    // 字体
    bindPickerChangeFont(e) {
        this.setData({
            fontIndex: e.detail.value,
            ['fontSet.fontName']: this.data.fontsArray[e.detail.value].font
        })
    },
    //对齐
    bindPickerChangeFontAlign(e) {
        this.setData({
            alignIndex: e.detail.value,
            ['fontSet.align']: this.data.alignsArray[e.detail.value].align
        })
    },
    //排列
    bindPickerChangeFontArrange(e) {
        this.setData({
            arrangeIndex: e.detail.value,
            ['fontSet.arrange']: this.data.arrangesArray[e.detail.value].align
        })
    },
    handleContentInput(e) {
        this.setData({ ['fontSet.content']: e.detail.value })
    },
    handleFontSizeInput(e) {
        this.setData({ ['fontSet.fontSize']: e.detail.value })
    },
    handleLetterSpaceInput(e) {
        this.setData({ ['fontSet.letterSpace']: e.detail.value })
    },
    handleLineSpaceInput(e) {
        this.setData({ ['fontSet.lineSpace']: e.detail.value })
    },
    handleFakePaperWidthInput(e) {
        let width = +e.detail.value
        // const { maxWidth, minWidth } = paperSizeConfig;
        // if (width > maxWidth) width = maxWidth;
        // else if (width < minWidth) width = minWidth
        this.setData({ [`fakePaper.width`]: width })
        this.handlePaperAutoSize()
    },
    handleFakePaperWidthBlur(e) {
        let width = +e.detail.value
        const { maxWidth, minWidth } = paperSizeConfig;
        if (width > maxWidth) width = maxWidth;
        else if (width < minWidth) width = minWidth
        this.setData({ [`fakePaper.width`]: width })
        this.handlePaperAutoSize()
    },
    handleFakePaperHeightInput(e) {
        let height = +e.detail.value
        // const { maxHeight, minHeight } = paperSizeConfig;
        // if (height > maxHeight) height = maxHeight;
        // else if (height < minHeight) height = minHeight
        this.setData({ [`fakePaper.height`]: height })
        this.handlePaperAutoSize()
    },
    handleFakePaperHeightBlur(e) {
        let height = +e.detail.value
        const { maxHeight, minHeight } = paperSizeConfig;
        if (height > maxHeight) height = maxHeight;
        else if (height < minHeight) height = minHeight
        this.setData({ [`fakePaper.height`]: height })
        this.handlePaperAutoSize()
    },
    async handleCardPreview() {
        /** @type {Layer[]} */
        let layers = this.selectAllComponents('.parper-child').map((pc) => pc.value())
        console.log(layers);
        layers = layers.filter(a => !(a.type === 'background' && !a.isPrint))
        let result = await this.selectComponent('.layer-compose').render(layers)
        wx.previewImage({
            urls: [result.tempPath],
            fail: (err) => {
                console.log(err);
            }
        })
    },
    handleRemoveLayer(e) {
        const { index } = e.currentTarget.dataset
        this.setData({ isRender: true })
        this.data.layers.splice(index, 1)
        this.setData({ layers: this.data.layers, isRender: false })
    },
    handleChangeLayer(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset
        const layer = this.data.layers[index];
        this.setData({ [`layers[${index}]`]: { ...layer, ...e.detail } })
        console.log(this.data.layers);
    },
    handleOperateLayer(e) {
        const { index } = e.currentTarget.dataset
        this.setData({ operateLayerIndex: index })
    },
    async handleSaveLayers(e) {
        wx.setStorageSync('layers', this.data.layers)
        /** @type {Layer[]} */
        let layers = this.selectAllComponents('.parper-child').map((pc) => pc.value())
        console.log(layers);
        layers = layers.filter(a => !(a.type === 'background' && !a.isPrint))
        let result = await this.selectComponent('.layer-compose').render(layers)
        wx.saveImageToPhotosAlbum({
            filePath: result.tempPath,
            success: (res) => {
                console.log(res);
            },
            fail: (err) => {
                console.log(err);
            }
        })
    },
    handleInitFontSet() {
        this.setData({ fontSet: getDefaultFontSet() })
        this.bindPickerChangeFont({ detail: { value: 0 } })
        this.bindPickerChangeFontAlign({ detail: { value: 0 } })
        this.bindPickerChangeFontArrange({ detail: { value: 0 } })
    },
    handleDoubleTapLayer(e) {
        const { index } = e.currentTarget.dataset
        const { layers, fontsArray, alignsArray, arrangesArray } = this.data;
        const layer = layers[index];

        const fontIndex = fontsArray.findIndex(a => a.font === layer.fontFamily)
        const alignIndex = alignsArray.findIndex(a => a.align === layer.fontAlign)
        const arrangeIndex = arrangesArray.findIndex(a => a.align === layer.arrange)

        this.setData({
            setShow: true,
            setTitle: "文字",
            ['fontSet.fontSize']: layer.fontSize,
            ['fontSet.lineSpace']: layer.lineSpace,
            ['fontSet.letterSpace']: layer.letterSpace,
            ['fontSet.fontBg']: layer.bgColor,
            ['fontSet.fontColor']: layer.fontColor,
            ['fontSet.content']: layer.text,
        })
        this.bindPickerChangeFont({ detail: { value: fontIndex } })
        this.bindPickerChangeFontAlign({ detail: { value: alignIndex } })
        this.bindPickerChangeFontArrange({ detail: { value: arrangeIndex } })
    },
    doneConfirm() {
        const { layers, fontsArray, fontIndex, fontSet, alignsArray, alignIndex, arrangesArray, arrangeIndex, operateLayerIndex } = this.data;
        let layerIndex = operateLayerIndex
        let layer = layers[operateLayerIndex]
        if (!layer || layer.type !== 'font') {
            layer = new Layer()
            layerIndex = layers.length;
        }
        layer.type = 'font';
        layer.fontFamily = fontsArray[fontIndex].font
        layer.fontSize = fontSet.fontSize
        layer.lineSpace = fontSet.lineSpace
        layer.letterSpace = fontSet.letterSpace
        layer.bgColor = fontSet.fontBg;
        layer.fontColor = fontSet.fontColor
        layer.text = fontSet.content;
        layer.arrange = arrangesArray[arrangeIndex].align
        layer.fontAlign = alignsArray[alignIndex].align

        this.setData({
            [`layers[${layerIndex}]`]: layer,
            operateLayerIndex: layerIndex,
            setShow: false
        })
    },
    handleIsTopLayer(e) {
        const { index } = e.currentTarget.dataset
        this.setData({ isRender: true })
        const layer = this.data.layers.splice(index, 1)
        const layers = [...this.data.layers, ...layer]
        console.log(layer);
        this.setData({ layers, isRender: false, operateLayerIndex: layers.length - 1 })
    },
    async handleInsetBgImage() {
        const paths = await chooseImage(1)
        let { layers } = this.data
        if (!paths.length > 0) return;
        layers[0].bgImage = paths[0]
        this.setData({
            [`layers[0]`]: layers[0],
        })
    },
    handleDeleteBgImage() {
        let { layers } = this.data
        layers[0].bgImage = ''
        this.setData({
            [`layers[0]`]: layers[0],
        })
    },
    handleBgColorAlpha() {
        this.setData({
            [`layers[0].bgColor`]: Transparent
        })
    },
    handleFontBgColorAlpha() {
        this.setData({
            ['fontSet.fontBg']: Transparent
        })
    },
    async onLoad(options) {
        var that = this;
        wx.getSystemInfo({
            success: (result) => {
                var model = result.model;
                if (model == 'iPhone X') {
                    that.setData({
                        pdbottom: '68',
                        lineH: 128,
                        tempName: options.tempName
                    })
                } else {
                    that.setData({
                        pdbottom: '40',
                        lineH: 100,
                        tempName: options.tempName
                    })
                }
            },
        })
        await this.loadFontFaces();
    },
    onReady() {
        this.handlePaperContainerSize()
    }
})