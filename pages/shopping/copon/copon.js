var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {
  },
  selectCopon(event) {
    try {
      wx.setStorageSync('addressId', event.currentTarget.dataset.coponId);
    } catch (e) {

    }
    //选择该优惠券
    wx.redirectTo({
      url: '/pages/shopping/checkout/checkout'
    })
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})