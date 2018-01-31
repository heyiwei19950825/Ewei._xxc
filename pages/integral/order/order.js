var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    product: [],
    checkedAddress: {},
    freightPrice: 0.00,    //快递费
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    goodsId: 0,
    num:0
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
    util.request(api.IntegralPay, { addressId: that.data.addressId, goodsId: that.data.goodsId, num: that.data.num },'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
        //   checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          product: res.data.product
        //   couponNumber: res.data.couponNumber,
        //   couponPrice: res.data.couponPrice,
        //   freightPrice: res.data.freightPrice,
        //   goodsTotalPrice: res.data.goodsTotalPrice,
        //   // orderTotalPrice: res.data.orderTotalPrice,
        //   rankDiscount: res.data.rankDiscount

        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
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

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
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
        util.showErrorToast('下单失败');
      }
    });
  }
})