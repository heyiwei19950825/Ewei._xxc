var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    couponList: [],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    types: 0
  },
  onLoad: function (options) {
    this.getCouponList();
  },

  getCouponList() {
    let that = this;
    util.request(api.UseCouponList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          couponList: res.data.data,
          types: res.data.types
        });
      }
    });
  },
  selectCoupon(event) {
    //console.log(event.currentTarget.dataset.addressId);

    try {
      wx.setStorageSync('couponId', event.currentTarget.dataset.couponId);
    } catch (e) {

    }

    //选择该收货地址
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