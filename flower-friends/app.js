import { loadFontFace } from "./components/layer/index";

//app.js
App({
    onShow: function (e) {

    },
    isLowerThenVersion(target) {
        let SDKVersion = wx.getSystemInfoSync().SDKVersion;
        let currArr = /([\d]{1,}).([\d]{1,}).([\d]{1,})/.exec(SDKVersion);
        let targArr = /([\d]{1,}).([\d]{1,}).([\d]{1,})/.exec(target);
        let currMaj = +currArr[1]
        let currMin = +currArr[2]
        let currPat = +currArr[3]
        let targMaj = +targArr[1]
        let targMin = +targArr[2]
        let targPat = +targArr[3]
        if (currMaj < targMaj) return true;
        if (currMaj > targMaj) return false;
        if (currMin < targMin) return true;
        if (currMin > targMin) return false;
        if (currPat < targPat) return true;
        return false
    },
    onLaunch: function (e) {
        this.uploadMam()
        this.loadFontFaces();

    },
    onHide() {

    },
    async loadFontFaces() {
        // await loadFontFace('yinhe', 'http://localhost:5000/files/b4ef824c6b9c4dc8b2c0e6eb9639866d638007053540155549.ttf')
        // await loadFontFace('yinhe', 'http://localhost:5000/files/4a05b33e81474408a78d266379e8d2ac638007062997159099.ttf')
        await loadFontFace('yinhe', 'https://mxj-test-dev.oss-cn-shanghai.aliyuncs.com/%E7%A7%8B%E6%97%A5%E7%BA%B7%E8%87%B3%E6%B2%93%E6%9D%A5.ttf')
        await loadFontFace('qiuri', 'https://mxj-test-dev.oss-cn-shanghai.aliyuncs.com/%E9%93%B6%E6%B2%B3%E5%BE%AE%E5%BE%AE%E5%85%89%E4%BA%AE.ttf')
    },
    uploadMam() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        success: function (res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
                updateManager.onUpdateFailed(function () {
                    // 新的版本下载失败
                    wx.showModal({
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                    })
                })
            }
        })
    },
})