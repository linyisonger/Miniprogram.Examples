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
/** @type { {count:number,paperSize:PaperSize,weight:number,composing:Composing[]}[] } */
let config = []

papers.forEach(ps => {
  let tmp = []
  if (ps.n.endsWith('R')) {
    tmp = [
      {
        count: 1,
        icon: '/images/12.png',
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
    ]
    config = config.concat(tmp.map(a => {
      a.weight = 2;
      return a
    }))
    tmp = [
      {
        count: 2,
        icon: '/images/24.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 2 / 3),
          new Composing(.5, 1 / 3, .5, 2 / 3),
        ]
      },
      {
        count: 3,
        icon: '/images/34.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 2 / 3, 1),
          new Composing(2 / 3, 0, 1 / 3, .5),
          new Composing(2 / 3, .5, 1 / 3, .5),
        ]
      },
      {
        count: 4,
        icon: '/images/44.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, .5),
          new Composing(0, .5, 1 / 3, .5),
          new Composing(1 / 3, .5, 1 / 3, .5),
          new Composing(2 / 3, .5, 1 / 3, .5),
        ]
      },
      {
        count: 5,
        icon: '/images/54.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 3 / 5, .5),
          new Composing(0, .5, 3 / 5, .5),
          new Composing(3 / 5, 0, 2 / 5, 1 / 3),
          new Composing(3 / 5, 1 / 3, 2 / 5, 1 / 3),
          new Composing(3 / 5, 2 / 3, 2 / 5, 1 / 3),
        ]
      },
      {
        count: 6,
        icon: '/images/64.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 2 / 5),
          new Composing(1 / 3, 0, 1 / 3, 2 / 5),
          new Composing(2 / 3, 0, 1 / 3, 2 / 5),
          new Composing(0, 2 / 5, 1 / 3, 3 / 5),
          new Composing(1 / 3, 2 / 5, 1 / 3, 3 / 5),
          new Composing(2 / 3, 2 / 5, 1 / 3, 3 / 5),
        ]
      },
      {
        count: 7,
        icon: '/images/74.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 1 / 3),
          new Composing(.5, 0, .5, 1 / 3),
          new Composing(0, 1 / 3, .5, 1 / 3),
          new Composing(.5, 1 / 3, .5, 1 / 3),
          new Composing(0, 2 / 3, 1 / 3, 1 / 3),
          new Composing(1 / 3, 2 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 8,
        icon: '/images/84.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .25, .5),
          new Composing(0, .5, .25, .5),
          new Composing(.25, 0, .25, .5),
          new Composing(.25, .5, .25, .5),
          new Composing(.5, 0, .25, .5),
          new Composing(.5, .5, .25, .5),
          new Composing(.75, 0, .25, .5),
          new Composing(.75, .5, .25, .5),
        ]
      },
      {
        count: 9,
        icon: '/images/94.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, 1),
          new Composing(1 / 3, 0, 1 / 3, .25),
          new Composing(1 / 3, .25, 1 / 3, .25),
          new Composing(1 / 3, .5, 1 / 3, .25),
          new Composing(1 / 3, .75, 1 / 3, .25),
          new Composing(2 / 3, 0, 1 / 3, .25),
          new Composing(2 / 3, .25, 1 / 3, .25),
          new Composing(2 / 3, .5, 1 / 3, .25),
          new Composing(2 / 3, .75, 1 / 3, .25),
        ]
      },
    ]
    config = config.concat(tmp.map(a => {
      a.weight = 4;
      return a
    }))
  }
  else {
    tmp = [
      {
        count: 1,
        icon: '/images/11.png',
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
    ]
    config = config.concat(tmp.map(a => {
      a.weight = 1;
      return a
    }))
    tmp = [
      {
        count: 1,
        icon: '/images/13.png',
        paperSize: ps,
        composing: [
          new Composing(1 / 4, 1 / 4, 1 / 2, 1 / 2),
        ]
      },
      {
        count: 1,
        icon: '/images/14.png',
        paperSize: ps,
        composing: [
          new Composing(1 / 7, 1 / 9, 5 / 7, 3 / 9),
        ]
      },
      {
        count: 2,
        icon: '/images/23.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 2 / 3, .5),
          new Composing(1 / 3, .5, 2 / 3, .5),
        ]
      },
      {
        count: 3,
        icon: '/images/33.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 2 / 3),
          new Composing(0, 2 / 3, .5, 1 / 3),
          new Composing(0.5, 2 / 3, .5, 1 / 3),
        ]
      },
      {
        count: 4,
        icon: '/images/43.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 1),
          new Composing(.5, 0, .5, 1 / 3),
          new Composing(.5, 1 / 3, .5, 1 / 3),
          new Composing(.5, 2 / 3, .5, 1 / 3),
        ]
      },
      {
        count: 5,
        icon: '/images/53.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .5, 3 / 5),
          new Composing(.5, 0, .5, 3 / 5),
          new Composing(0, 3 / 5, 1 / 3, 2 / 5),
          new Composing(1 / 3, 3 / 5, 1 / 3, 2 / 5),
          new Composing(2 / 3, 3 / 5, 1 / 3, 2 / 5),
        ]
      },
      {
        count: 6,
        icon: '/images/63.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 3 / 5, 1 / 3),
          new Composing(0, 1 / 3, 3 / 5, 1 / 3),
          new Composing(0, 2 / 3, 3 / 5, 1 / 3),
          new Composing(3 / 5, 0, 2 / 5, 1 / 3),
          new Composing(3 / 5, 1 / 3, 2 / 5, 1 / 3),
          new Composing(3 / 5, 2 / 3, 2 / 5, 1 / 3),
        ]
      },
      {
        count: 7,
        icon: '/images/73.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1 / 3, .5),
          new Composing(0, .5, 1 / 3, .5),
          new Composing(1 / 3, 0, 1 / 3, .5),
          new Composing(1 / 3, .5, 1 / 3, .5),
          new Composing(2 / 3, 0, 1 / 3, 1 / 3),
          new Composing(2 / 3, 1 / 3, 1 / 3, 1 / 3),
          new Composing(2 / 3, 2 / 3, 1 / 3, 1 / 3),
        ]
      },
      {
        count: 8,
        icon: '/images/83.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, .25, .5),
          new Composing(0, .5, .25, .5),
          new Composing(.25, 0, .25, .5),
          new Composing(.25, .5, .25, .5),
          new Composing(.5, 0, .25, .5),
          new Composing(.5, .5, .25, .5),
          new Composing(.75, 0, .25, .5),
          new Composing(.75, .5, .25, .5),
        ]
      },
      {
        count: 9,
        icon: '/images/93.png',
        paperSize: ps,
        composing: [
          new Composing(0, 0, 1, 1 / 3),
          new Composing(0, 1 / 3, .25, 1 / 3),
          new Composing(.25, 1 / 3, .25, 1 / 3),
          new Composing(.5, 1 / 3, .25, 1 / 3),
          new Composing(.75, 1 / 3, .25, 1 / 3),
          new Composing(0, 2 / 3, .25, 1 / 3),
          new Composing(.25, 2 / 3, .25, 1 / 3),
          new Composing(.5, 2 / 3, .25, 1 / 3),
          new Composing(.75, 2 / 3, .25, 1 / 3),
        ]
      },
    ]
    config = config.concat(tmp.map(a => {
      a.weight = 3;
      return a
    }))
  }
})
config.sort((a, b) => a.weight - b.weight)
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
      const comp = this.data.config.find(c => c.paperSize.n.includes(this.properties.name) && c.count == n);
      this.triggerEvent('change', comp);
    },
    name: function (n) {
      this.setData({ paperSizeName: n })
    }
  }
})
