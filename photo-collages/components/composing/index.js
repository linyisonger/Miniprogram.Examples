export class Composing {
  /** 
   * @param {number} x  x
   * @param {number} y  y
   * @param {number} w  宽度
   * @param {number} h  高度
   */
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
export class PaperSize {
  /**  
   * @param {number} w  宽度
   * @param {number} h  高度
   * @param {string} n  姓名
   */
  constructor(w, h, n) {
    this.w = w;
    this.h = h;
    this.n = n
  }
}
const papers = [
  new PaperSize(630, 891, 'A4'),
  new PaperSize(686, 485, 'A4R'),
  new PaperSize(600, 900, '6'),
  new PaperSize(686, 457, '6R')
]
/** @type { {count:number,paperSize:PaperSize,composing:Composing[]}[] } */
const config = []

papers.forEach(ps => {
  if (ps.n.endsWith('R')) {
    config.push(...[
      {
        count: 1,
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 1),
        ]
      },
      {
        count: 2,
        icon: '/images/22.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 1),
          new Composing(.5, 0, .5, 1),
        ]
      },
      {
        count: 3,
        icon: '/images/32.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 1),
          new Composing(1 / 3, 0, 1 / 3, 1),
          new Composing(2 / 3, 0, 1 / 3, 1),
        ]
      },
      {
        count: 4,
        icon: '/images/42.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, .5),
          new Composing(.5, 0, .5, .5),
          new Composing(0, .5, .5, .5),
          new Composing(.5, .5, .5, .5),
        ]
      },
      {
        count: 5,
        icon: '/images/52.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 5.5 / 12.5),
          new Composing(1 / 3, 0, 1 / 3, 5.5 / 12.5),
          new Composing(2 / 3, 0, 1 / 3, 5.5 / 12.5),
          new Composing(0, 5.5 / 12.5, .5, 7 / 12.5),
          new Composing(.5, 5.5 / 12.5, .5, 7 / 12.5),
        ]
      },
      {
        count: 6,
        icon: '/images/62.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, .5),
          new Composing(1 / 3, 0, 1 / 3, .5),
          new Composing(2 / 3, 0, 1 / 3, .5),
          new Composing(0, .5, 1 / 3, .5),
          new Composing(1 / 3, .5, 1 / 3, .5),
          new Composing(2 / 3, .5, 1 / 3, .5),
        ]
      },
      {
        count: 7,
        icon: '/images/72.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 1),
          new Composing(1 / 3, 0, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 0, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 8,
        icon: '/images/82.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, .5),
          new Composing(0, .5, 1 / 3, .5),
          new Composing(1 / 3, 0, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 0, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 9,
        icon: '/images/92.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 1 / 3),
          new Composing(0, 1 / 3, 1 / 3, 1 / 3),
          new Composing(0, 2 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 0, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 0, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
    ])
  }
  else {
    config.push(...[
      {
        count: 1,
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 1),
        ]
      },
      {
        count: 2,
        icon: '/images/21.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, .5),
          new Composing(0, .5, 1, .5),
        ]
      },
      {
        count: 3,
        icon: '/images/31.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 1 / 3),
          new Composing(0, 1 / 3, 1, 1 / 3),
          new Composing(0, 2 / 3, 1, 1 / 3),
        ]
      },
      {
        count: 4,
        icon: '/images/41.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, .5),
          new Composing(.5, 0, .5, .5),
          new Composing(0, .5, .5, .5),
          new Composing(.5, .5, .5, .5),
        ]
      },
      {
        count: 5,
        icon: '/images/51.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 7 / 12.5, .5),
          new Composing(0, .5, 7 / 12.5, .5),
          new Composing(7 / 12.5, 0, 5.5 / 12.5, 1 / 3),
          new Composing(7 / 12.5, 1 / 3, 5.5 / 12.5, 1 / 3),
          new Composing(7 / 12.5, 2 / 3, 5.5 / 12.5, 1 / 3),
        ]
      },
      {
        count: 6,
        icon: '/images/61.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 1 / 3),
          new Composing(.5, 0, .5, 1 / 3),
          new Composing(0, 1 / 3, .5, 1 / 3),
          new Composing(.5, 1 / 3, .5, 1 / 3),
          new Composing(0, 2 / 3, .5, 1 / 3),
          new Composing(.5, 2 / 3, .5, 1 / 3),
        ]
      },
      {
        count: 7,
        icon: '/images/71.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 1 / 3),
          new Composing(0, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(0, 2 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 8,
        icon: '/images/81.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 1 / 3),
          new Composing(.5, 0, .5, 1 / 3),
          new Composing(0, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(0, 2 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 9,
        icon: '/images/91.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 1 / 3),
          new Composing(0, 1 / 3, 1 / 3, 1 / 3),
          new Composing(0, 2 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 0, 1 / 3, 1 / 3),
          new Composing(1 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 0, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
    ])
  }
})

console.log(config);
/**
 * @author 林一怂儿 
 * @description 这个组件用于排版切换
 */
Component({
  properties: {
    count: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
    }
  },
  data: {
    config: config,
    paperSizeName: 'A4'
  },
  methods: {
    change(e) {
      this.triggerEvent('change', e.currentTarget.dataset.item)
    }
  },
  observers: {
    count: function (n) {
      const comp = this.data.config.find(c => c.count == n);
      this.triggerEvent('change', comp);
    },
    name: function () {
      this.setData({ paperSizeName: this.properties.name })
    }
  }
})
