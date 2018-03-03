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
    collectiveList:[]
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
    this.getIndexData();
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
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          nav: res.data.navList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          couponList: res.data.couponList,
          collectiveList: res.data.collectiveList
          
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
  goLogin() {
    user.loginByWeixin().then(res => {
      // wx.removeStorageSync('token');
      // wx.removeStorageSync('userInfo');
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      this.onShow();
    }).catch((err) => {
      // //console.log(err)
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
    this.goLogin()
    this.getIndexData();
    this.shopInfoData();
  },
  
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
