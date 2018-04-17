var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000,
    cartData: {}//购物车列表清单
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });


    this.getCategoryInfo();

  },
  add: function (e) {
    var that = this;
    // 所点商品id
    var foodId = e.currentTarget.dataset.foodId;
    // 读取目前购物车数据
    var cartData = that.data.cartData;
    // 获取当前商品数量
    var foodCount = cartData[foodId] ? cartData[foodId] : 0;
    // 自增1后存回
    cartData[foodId] = ++foodCount;
    // 设值到data数据中
    that.setData({
      cartData: cartData
    });
    // 转换成购物车数据为数组
    that.cartToArray(foodId, foodCount);
  },
  subtract: function (e) {
    var that = this;
    // 所点商品id
    var foodId = e.currentTarget.dataset.foodId;
    // 读取目前购物车数据
    var cartData = that.data.cartData;
    // 获取当前商品数量
    var foodCount = cartData[foodId];
    // 自减1
    --foodCount;
    // 减到零了就直接移除
    if (foodCount == 0) {
      delete cartData[foodId]
    } else {
      cartData[foodId] = foodCount;
    }
    // 设值到data数据中
    that.setData({
      cartData: cartData
    });
    // 转换成购物车数据为数组
    that.cartToArray();
  },
  //添加商品到购物车
  cartToArray: function (foodId, foodCount) {
    var that = this;
    util.request(api.CartAdd, { cartArray: this.data.cartData }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno != 0) {
          // 读取目前购物车数据
          var cartData = that.data.cartData;
          if (foodCount == 0) {
            delete cartData[foodId]
          } else {
            cartData[foodId] = foodCount - 1;
          }
          // 设值到data数据中
          that.setData({
            cartData: cartData
          });


          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }

      });
  },
  getCategoryInfo: function () {
    let that = this;
     
    
    util.request(api.CategoryList, { id: this.data.id })
      .then(function (res) {

        if (res.errno == 0) {
          that.setData({
            navList: res.data.brotherCategory,
            currentCategory: res.data.currentCategory
          });
          if (that.data.id == 9999){
            res.data.currentCategory.name = '全部商品';
          }
          //设置分类页面标题
          wx.setNavigationBarTitle({
            title: res.data.currentCategory.name//页面标题为路由参数
          })

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();

        } else {
          //显示错误信息
        }
        
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // //console.log(1);
  },
  onHide: function () {
    // 页面隐藏
  },
  getGoodsList: function () {
    var that = this;

    util.request(api.GoodsList, {id: that.data.id, page: that.data.page, size: that.data.size})
      .then(function (res) {
        that.setData({
          goodsList: res.data.goodsList,
        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });

    this.getCategoryInfo();
  }
})