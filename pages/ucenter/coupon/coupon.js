var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    couponList:[],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCouponList();
  },

  getCouponList() {
    let that = this;
    util.request(api.CouponList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          couponList: res.data
        });
      }
    });
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