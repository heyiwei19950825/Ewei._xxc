var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    couponList:[],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    types:0
  },
  onLoad: function (options) {
    this.getCouponList();
  },

  getCouponList() {
    let that = this;
    util.request(api.CouponList,{types:that.data.types}).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          couponList: res.data.data,
          types: res.data.types
        });
      }
    });
  },
  switchCoupon: function (event) {
    if (this.data.types == event.currentTarget.dataset.types) {
      return false;
    }
    this.setData({
      types: event.currentTarget.dataset.types
    });

    this.getCouponList();
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