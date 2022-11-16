
//获取应用实例
const app = getApp()
Page({
    data: {
        oldSrc: '',
        src: '',
        width: 300, //宽度
        height: 424.2858, //高度
        addList: 0,
        isShow: false,
        mengHeight: 0,
        export_scale: 4,
        pdbper: 0,
        temps: [],
        imgUrl: '',
        imgId: 0,
        chooseTempIndex: 0,
        filters: [],
        requestUrl: '',
        appkey: '',
        intoView: 'viewshi',
        index:0,
        switch1Checked:true
    },
    switch1Change(e){
        this.setData({
            switch1Checked:e.detail.value
        })
    },
    //旋转
    rotate() {
        //在用户旋转的基础上旋转90°
        this.cropper.setAngle(this.cropper.data.angle += 90);
    },
    //重置
    reset() {
        var that = this;
        that.cropper.imgReset();
    },
    //确定
    submitBtn() {
        var that = this;
        // wx.showLoading({
        //     title: '美好值得等待'
        // })
        that.cropper.getImg((obj) => {
            wx.saveImageToPhotosAlbum({
              filePath: obj.url,
              success:(res)=>{
                  console.log(res);
              }
            })
            // that.uploadFile(obj.url, '');
            console.log(obj.url)
        });
    },
    //确定后继续上传
    uploadFile(path) {
       
    },
    onLoad: function (options) {
        var export_scale = 5;
        var query = wx.createSelectorQuery();
        var that = this;
        that.setData({
            export_scale: export_scale
        })
        wx.getSystemInfo({
            success: (result) => {
                var barHeight = result.screenHeight - result.safeArea.bottom + 20
                that.setData({
                    pdbottom: barHeight + 'px',
                    pdbper: barHeight
                })
            },
        })
        that.cropper = that.selectComponent("#image-cropper");
        query.select('#editBottom').boundingClientRect()
        query.exec(function (res) {
            //res就是 所有标签为mjltest的元素的信息 的数组
            //取高度
            that.setData({
                mengHeight: res[0].height,
                pdbper: res[0].height,
            })
        })
        this.setData({
            width: 240,
            height: 339.42864,
            disable_ratio: false,
            disable_width: true,
            disable_height: true,
            src:options.img
        })
        wx.setNavigationBarTitle({
            title: '图片编辑',
        })
        // that.cropper.upload();

        this.loadimage();
    },
    loadimage(e) {
        this.cropper.imgReset();
    },
    clickcut(e) {

    },
    end(e) {
        clearInterval(this.data[e.currentTarget.dataset.type]);
    },
})