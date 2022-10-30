import { config } from "../../components/custom-mixer/config";

Page({
    data: {
        config: config
    },
    onReady() {
        this.setData({ ['config.allowRemove']: true })
        this.setData({ ['config.allowScale']: true })
        this.setData({ ['config.allowMove']: true })
        this.setData({ ['config.allowRotate']: true })
    },
    add() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: (res) => {
                res.tempFiles.forEach(t => {
                    try {
                        this.selectComponent('#pm').add(t.tempFilePath)
                    } catch (error) {
                        console.log(error);
                    }
                })
            }
        })
    },
    async save() {
        let res = await this.selectComponent('#pm').save()
        console.log(res);
        wx.previewImage({
            urls: [res.tempFilePath],
        })
        this.setData({ preSrc: res.tempFilePath, w: res.width, h: res.height })
    },
    change(e) {
        console.log(e);
    }
})
