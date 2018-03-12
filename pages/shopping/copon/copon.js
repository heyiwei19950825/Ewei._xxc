var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    couponList: [],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    types: 0,
    url:''
  },
  onLoad: function (options) {
    let that = this.data;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.type == 'integral') {
      that.url = '/pages/integral/order/order?goodsId=' + options.goodsId + '&num=' + options.num;
    }
    if (options.type == 'collective') {
      that.url = '/pages/collectiveOrder/collectiveOrder?goodsId=' + options.goodsId + '&num=' + options.num + '&collectiveNo='.options.collective_no;
    }
    if (options.type == 'default') {
      that.url = '/pages/shopping/checkout/checkout?goodsId=' + options.goodsId + '&num=' + options.num;
    } 
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
    
    // try {
    //   wx.setStorageSync('couponId', event.currentTarget.dataset.couponId);
    // } catch (e) {

    // }

    //选择该收货地址
    wx.redirectTo({
      url: this.data.url + '&couponId=' + event.currentTarget.dataset.couponId
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