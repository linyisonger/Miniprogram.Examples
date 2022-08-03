App({
  onLaunch() {
  },
  // 是否低于某个版本
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
  }
})
