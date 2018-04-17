Page({
    data:{
      viewIndex:0,
      sliverLeft:'0%',
      navList:[
        { title: '本店热销', id: 0 },
        { title: '本店特色', id: 1 },
        { title: '农家小炒', id: 2 },
        { title: '田园蔬菜', id: 3 },
        { title: '汤羹系列', id: 4 },
      ],
      navIndex:0,
      goodsList:[
        { imageUrl:'https://img.meituan.net/100.100.90/wmproduct/d896ba97cffe315bff75249c8f43d465893214.jpg',id:0,sales:123,price:12,goodsName:'圣女果'},
        { imageUrl: 'https://img.meituan.net/100.100.90/wmproduct/d896ba97cffe315bff75249c8f43d465893214.jpg', id: 1, sales: 123, price: 14, goodsName: '圣女果' },
        { imageUrl: 'https://img.meituan.net/100.100.90/wmproduct/d896ba97cffe315bff75249c8f43d465893214.jpg', id: 2, sales: 123, price: 13 },
        { imageUrl: 'https://img.meituan.net/100.100.90/wmproduct/d896ba97cffe315bff75249c8f43d465893214.jpg', id: 3, sales: 123, price: 16, goodsName: '圣女果' },
      ]
    },
    tabChange(event){
      console.log(event);
      let index = event.currentTarget.dataset.index;
      let l = index/3*100+'%';
      this.setData({
        viewIndex:index,
        sliverLeft:l
      })
    },
    caseChange(event){
      let index = event.currentTarget.dataset.index;
      console.log(index);
      this.setData({
        navIndex: index,
      })
    },
    decrease(event){
      let index = event.currentTarget.dataset.index;
      let item = this.data.goodsList[index];
      let count = item.count?item.count:0;
      count--;
      this.data.goodsList[index].count = count<0?0:count;
      let list = this.data.goodsList;
      this.setData({
        goodsList: list
      })
    },
    add(event){
      let index = event.currentTarget.dataset.index;
      let item = this.data.goodsList[index];
      let count = item.count ? item.count : 0;
      count++;
      console.log(this);
      this.data.goodsList[index].count = count > 100 ? 100 : count;
      let list = this.data.goodsList;
      this.setData({
        goodsList:list
      })
    }
})