// 图片大小范围
const minWidth = 200;
const minHeight = 250;
const maxWidth = 400;
const maxHeight = 500;
// 每次加载数量
const pageSize = 20;
// 获取图片地址
function getPlacekitten() {
  const rw = minWidth + Math.round(Math.random() * (maxWidth - minWidth))
  const rh = minHeight + Math.round(Math.random() * (maxHeight - minHeight))
  return `https://placekitten.com/${rw}/${rh}`
}
// 加载图片信息
function getImageInfo(src) {
  return new Promise((resovle) => {
    wx.getImageInfo({
      src,
      success: resovle
    })
  })
}
Page({
  data: {
    column: 3, // 列数
    gap: 2, // 间距 px
    images: [], // 图片地址 string []
    masonry: [], // 存储位置
    columnList: [] // 储存数据
  },
  onLoad() {
    this.loadMore()
  },
  async loadMore() {
    const { images } = this.data
    for (let i = 0; i < pageSize; i++) {
      let src = getPlacekitten();
      // 调整加载顺序
      await getImageInfo(src)
      this.setData({ [`images[${images.length}]`]: src })
    }
  },
  onReachBottom() {
    this.loadMore()
  },
  // 图片加载完成回调
  handleAutoImageLoaded(e) {
    const { index } = e.currentTarget.dataset;
    this.handlePosition(index, e.detail)
  },
  // 处理自动位置
  handlePosition(index, rect) {
    const { column, columnList } = this.data
    // 初始化列
    if (columnList.length === 0) for (let i = 0; i < column; i++) {
      columnList[i] = []
    }
    // 求最短的
    let shortIndex = -1;
    let shortHeight = -1;
    for (let i = 0; i < columnList.length; i++) {
      let tmpColList = columnList[i];
      // 数组最后一个位置
      let tmpLast = tmpColList[tmpColList.length - 1];
      // 判断上一个位置
      let tmpHeight = (tmpLast?.top ?? 0) + (tmpLast?.height ?? 0);
      if (shortHeight > tmpHeight || shortHeight === -1) {
        shortIndex = i;
        shortHeight = tmpHeight;
      }
    }
    rect.top = shortHeight > 0 ? shortHeight + this.data.gap : shortHeight;
    rect.left = shortIndex / column
    rect.style = `top:${rect.top}px;left:${rect.left * 100}%;`;
    columnList[shortIndex].push(rect)
    this.data.columnList = columnList;
    this.setData({ [`masonry[${index}]`]: rect })
  }
})
