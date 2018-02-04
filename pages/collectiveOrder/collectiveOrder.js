var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();

Page({
  data: {
    product: [],
    checkedAddress: {},
    freightPrice: 0.00,    //快递费
    actualPrice: 0.00,     //实际需要支付的总价
    goodsPrice: 0.00,
    addressId: 0,
    
    goodsId: 0,
    num: 0,
    userInfo: []
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var goodsId = options.goodsId;
      if (goodsId) {
        this.setData({
          'goodsId': goodsId
        });
      }

      var num = options.num;
      if (num) {
        this.setData({
          'num': num
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CollectivePay, { addressId: that.data.addressId, goodsId: that.data.goodsId, num: that.data.num }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          //   checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          product: res.data.product,
         
          //   couponNumber: res.data.couponNumber,
          //   couponPrice: res.data.couponPrice,
            freightPrice: res.data.freightPrice,
            goodsPrice: res.data.goodsPrice
          //   // orderTotalPrice: res.data.orderTotalPrice,
          //   rankDiscount: res.data.rankDiscount

        });

        //有默认收货地址
        if (that.data.addressId == 0 && that.data.checkedAddress != 0 ){
          that.setData({
            addressId: res.data.checkedAddress.id
          })
        }
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address?type=collective&goodsId=' + this.data.goodsId + '&num=' + this.data.num,
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd?type=collective&goodsId=' + this.data.goodsId + '&num=' + this.data.num,
    })
  },
  selectCoupon() {
    wx.navigateTo({
      url: '/pages/shopping/copon/copon',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
    // 页面显示
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    console.log(that.data.userInfo);
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            //console.log(res)
          },
          'fail': function (res) {
            // //console.log(res)
          }
        });
      }
    });

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId,goodsId: this.data.goodsId, num: this.data.num,type:'collective' }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        if (res.errmsg === '') {
          util.showErrorToast('下单失败');
        } else {
          util.showErrorToast(res.errmsg);
        }
      }
    });
  }
})