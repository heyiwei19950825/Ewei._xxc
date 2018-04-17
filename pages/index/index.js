const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    couponList:[],
    collectiveList:[],
    //公告参数
    text: '',
    cartData: {},//购物车列表清单
    cartIdData:{} //购物车id列表，与清单对应
  },
  onShareAppMessage: function () {
    wx.getStorageSync('shopInfo', res.data.shopInfo);
    return {
      title: shopInfo.shop_name,
      desc: shopInfo.shop_name,
      path: '/pages/index/index'
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        if(res.data.system.switch == 'false'){
            wx.redirectTo({
              url: '/pages/maintain/maintain',
            })
        }
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          nav: res.data.navList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          couponList: res.data.couponList,
          collectiveList: res.data.collectiveList,
          text: res.data.system.inform
        });
        //设置店铺信息
        wx.setStorageSync('shopInfo', res.data.shopInfo);
        //设置分类页面标题
        wx.setNavigationBarTitle({
          title: res.data.shopInfo.shop_name//页面标题为路由参数
        })
      }
    });
  },
 
  //用户领取优惠券
  userGetCoupon(event){
    let that = this; 
    util.request(api.UserGetCoupon, { cid:event.currentTarget.dataset.id}, 'POST').then(res => {
        if( res.errno == 0 ){
          wx.showToast({
            title: res.errmsg,
          })
        }else{
          util.showErrorToast(res.errmsg);
        }
    })
  },
  //获取商铺信息
  shopInfoData: function (){

  },
  onLoad: function (options) {
    app.goLogin((res)=>{
      this.getCartList();
    })
    this.getIndexData();
    this.shopInfoData();
  },

  add: function (e) {
    var that = this;
    // 所点商品id
    var foodId = e.currentTarget.dataset.foodId;
    // 获取当前商品数量
    var foodCount = that.data.cartData[foodId] ? that.data.cartData[foodId] : 0;
    // 自增1后存回
    that.data.cartData[foodId] = ++foodCount;
    // 转换成购物车数据为数组
    that.cartToArray(foodId, foodCount);
  },
  subtract: function (e) {
    var that = this;
    // 所点商品id
    var foodId = e.currentTarget.dataset.foodId;
    // 获取当前商品数量
    var foodCount = that.data.cartData[foodId];
    // 自减1
    --foodCount;
    // 减到零了就直接移除
    if (foodCount == 0) {
      delete that.data.cartData[foodId]
    } else {
      that.data.cartData[foodId] = foodCount;
    }
    // 转换成购物车数据为数组
    that.cartToArray(foodId, foodCount);
  },

  //添加商品到购物车
  cartToArray: function (foodId, foodCount){
    var that = this;
    wx.showLoading();
    if (foodCount!=0){
      util.request(api.CartAdd, { cartArray: this.data.cartData }, "POST")
        .then(function (res) {
          wx.hideLoading();
          if (res.errno == 0) {
            that.getCartList();
          }else{
            that.data.cartData[foodId] --;
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: res.errmsg,
              mask: true
            });
          }

        });
    }else{
      let productIds = this.data.cartIdData[foodId];
      util.request(api.CartDelete, {
        productIds: productIds
      }, 'POST').then((res)=>{
        wx.hideLoading();
        if (res.errno === 0) {
          this.getCartList();
        }else{
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: res.errmsg,
            mask: true
          });
        }
      })
    }
  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        let list = res.data.cartList;
        let o = {},c = {};
        list.forEach((val)=>{
          o[val.goods_id] = val.num;
          c[val.goods_id] = val.id;
        })
        that.setData({
          cartData:o,
          cartIdData:c
        })
      }
    });
  },
  onReady: function () {
  },
  onShow: function () {
    try {
      var token = wx.getStorageSync('token');
      console.log(token);
      if (token) {
        this.getCartList();
      }
    } catch (e) {
    }
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
