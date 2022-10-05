// pages/print/templates/templates.js
const utils = require("../../../utils/utils");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        temps: [1, 2, 3],
        setShow:false,
        newTempsName:''
    },
    addTemp(){
        this.setData({setShow:true})
    },
    getTempName(e){
        this.setData({newTempsName:e.detail.value})
    },
    confirmName(){
        if(utils.is_define(this.data.newTempsName)){
            this.setData({
                setShow: false
            })
            wx.navigateTo({
              url: '/pages/print/temps/temps?tempName='+this.data.newTempsName,
            })
        }else{
            utils.toast('请先输入模板名称')
        }
    },
    //删除模板
    deleteTemp(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除此模板吗？',
            showCancel: true,
            confirmText: '删除',
            success(res) {
                if (res.confirm) {
                    var index = e.currentTarget.dataset.index;
                    let temps = that.data.temps;
                    temps.splice(index, 1)
                    that.setData({
                        temps: temps
                    })
                }

            }
        })
    },
    hideFix() {
        this.setData({
            setShow: false
        })
    },
    touchAnother() {
        // 阻止冒泡
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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