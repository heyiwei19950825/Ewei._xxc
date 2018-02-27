var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    url:''
  },
  onLoad: function (options) {
    let that = this.data;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.type == 'integral') {
      that.url = '/pages/integral/order/order?goodsId='+options.goodsId+'&num='+options.num;
    }
    if (options.type == 'collective') {
      that.url = '/pages/collectiveOrder/collectiveOrder?goodsId='+options.goodsId+'&num='+options.num;
    }
    if (options.type == 'default'){
      that.url = '/pages/shopping/checkout/checkout?goodsId=' + options.goodsId + '&num=' + options.num;
    } 

    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate (event) {
    //console.log(event)
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  selectAddress(event){
    //console.log(event.currentTarget.dataset.addressId);
    let that = this.data
    try {
      wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
    } catch (e) {

    }
    console.log(that.url);
    //选择该收货地址
    wx.navigateTo({
      url: that.url
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})