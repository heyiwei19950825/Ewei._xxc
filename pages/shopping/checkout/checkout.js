var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponNumber: 0,
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    // orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    goodsId: 0,
    num: 0,
    isVip:'',
    vipPrice:0,   //总价是否参与VIP价格
    content: ''
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (options.addressId) {
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

      var couponId = options.couponId;
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
      //判断是否是VIP
      let userInfo = app.globalData.userInfo;
      if (userInfo.is_vip ==2 ){
        this.setData({
          'isVip':'会员价'
        })
      }
      

    } catch (e) {
      // Do something when catch error
    }
  },
  //留言变量绑定和字数统计
  bindInpuntValue(event) {

    let value = event.detail.value;

    //判断是否超过140个字符
    if (value && value.length > 140) {
      return false;
    }
    this.setData({
      content: event.detail.value,
    })
    // //console.log(event.detail)
  },
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { goodsId: that.data.goodsId, num: that.data.num,addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponNumber: res.data.couponNumber,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          vipPrice: res.data.vipOrderTotalPrice,
          // orderTotalPrice: res.data.orderTotalPrice,
          rankDiscount: res.data.rankDiscount
          
        });

        //有默认收货地址
        if (that.data.addressId == 0 && that.data.checkedAddress != 0) {
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
      url: '/pages/shopping/address/address?type=default&goodsId=' + this.data.goodsId + '&num=' + this.data.num + '&type=default',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd?type=default&goodsId='+this.data.goodsId+'&num='+this.data.num+'&type=default',
    })
  },
  selectCoupon(){
    wx.navigateTo({
      url: '/pages/shopping/copon/copon?type=default&goodsId=' + this.data.goodsId + '&num=' + this.data.num + '&type=default',
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
    util.request(api.OrderSubmit, { goodsId: this.data.goodsId, num: this.data.num, addressId: this.data.addressId, couponId: this.data.couponId,buyer_message:this.data.content }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        try {
          wx.setStorageSync('couponId', 0);
        } catch (e) {

        }
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