const minWidth = 200;
const minHeight = 250;
const maxWidth = 400;
const maxHeight = 500;
const pageSize = 10;
function getPlacekitten() {
  const rw = minWidth + Math.round(Math.random() * (maxWidth - minWidth))
  const rh = minHeight + Math.round(Math.random() * (maxHeight - minHeight))
  return `https://placekitten.com/${rw}/${rh}`
}

Page({
  data: {
    column: 3,
    images: []
  },
  onLoad() {
    this.loadMore()
  },
  loadMore() {
    const { images } = this.data
    for (let i = 0; i < pageSize; i++) {
      images.push(getPlacekitten())
    }
    this.setData({ images })
  },
  onReachBottom() {
    this.loadMore()
  }
})
