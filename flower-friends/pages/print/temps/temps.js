
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tempName: '',
        paper: {
            width: 686,
            height: 485
        },
        fontSet: {
            fontName: '',
            fontSize: '16',
            letterSpace: '0',
            lineSpace: '0',
            align: 'center',
            arrange: 'horizontal',
            content: '',
            cardBg: 'rgb(255,255,255)',
            fontBg: 'rgb(255,255,255)',
            fontColor: 'rgb(0,0,0)'
        },
        arranges: ['水平', '垂直'],
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
        aligns: ['左对齐', '居中', '右对齐'],
        alignsArray: [{
            'name': '左对齐',
            'align': 'left'
        },
        {
            'name': '居中',
            'align': 'center'
        },
        {
            'name': '右对齐',
            'align': 'right'
        }
        ],
        alignIndex: 0,
        fonts: ['方正仿宋简体', '站酷快乐体', '思源黑体-常规'],
        fontIndex: 0,
        fontsArray: [{
            'id': 0,
            'name': '方正仿宋简体',
            'font': 'Fz'
        },
        {
            'id': 1,
            'name': '站酷快乐体',
            'font': 'Zk'
        },
        {
            'id': 2,
            'name': '思源黑体-常规',
            'font': 'Sy'
        }
        ],
        setTitle: '卡片',
        setShow: false,
        rgb: 'rgb(0,154,97)', //初始值
        pick: false,
        chooseColorIndex: 0,
        layers: []
    },
    // 显示取色器
    toPick(e) {
        console.log(e)
        var index = e.currentTarget.dataset.index;
        var currentcolor = e.currentTarget.dataset.currentcolor;
        this.setData({
            chooseColorIndex: index,
            rgb: currentcolor,
            pick: true
        })
    },
    //取色结果回调
    pickColor(e) {
        let rgb = e.detail.color;
        switch (this.data.chooseColorIndex) {
            case '0':
                this.setData({
                    ['fontSet.cardBg']: rgb
                })
                break;
            case '1':
                this.setData({
                    ['fontSet.fontBg']: rgb
                })
                break;
            case '2':
                this.setData({
                    ['fontSet.fontColor']: rgb
                })
                break;
        }
    },
    uodateSet(e) {
        var index = e.currentTarget.dataset.index;
        if (index != '图片') {
            this.setData({
                setTitle: index,
                setShow: true
            })
        } else {
            this.chooseStyle()
        }
    },
    hideFix() {
        this.setData({
            setShow: false
        })
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
            ['fontSet.arrange']: this.data.arrangesArray[e.detail.value].arrange
        })
    },
    changeContent(e) {
        this.setData({
            ['fontSet.content']: e.detail.value
        })
    },
    //选择照片方式
    chooseStyle() {
        var that = this;
        wx.showActionSheet({
            itemList: ['相册', '拍照', '从微信聊天选择'],
            success(res) {
                if (res.tapIndex == 0) {
                    that.getPhoto('album');
                }
                if (res.tapIndex == 1) {
                    that.getPhoto('camera');
                }
                if (res.tapIndex == 2) {
                    that.getPhotoMessage();
                }
            },
            fail(res) {

            }
        })
    },
    getPhotoMessage() {
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success: (res) => {

            }
        })
    },
    getPhoto(type) {
        if (getApp().isLowerThenVersion("2.10.0")) {
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: [type],
                success: (res) => {

                }
            })
        }
        else {
            wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: [type],
                sizeType: ['original'],
                success: (res) => {
                    console.log(res);
                    this.setData({
                        [`layers[${this.data.layers.length}]`]: {
                            src: res.tempFiles[0].tempFilePath
                        }
                    })
                }
            })
        }
    },
    async handleCardPreview() {
        let result = await this.selectComponent('.layer-compose').render(this.selectAllComponents('.parper-child').map((pc) => pc.value()))
        wx.previewImage({
            urls: [result.tempPath],
            fail: (err) => {
                console.log(err);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})