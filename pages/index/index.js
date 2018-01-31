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
    couponList:[]
  },
  onShareAppMessage: function () {
    return {
      title: '九宴食材',
      desc: '九宴食材微信小程序商城',
      path: '/pages/index/index'
    }
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
          couponList:[1,2,3]
        });
        console.log(that.couponList);
        
      }
    });
  },
  goLogin() {
    user.loginByWeixin().then(res => {
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
  onLoad: function (options) {
    this.goLogin()
    this.getIndexData();
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
