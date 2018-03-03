var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    express: [],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      id: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        // //console.log(res.data);
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption,
          express: res.data.express
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      // //console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      id: that.data.orderId || 15
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
            that.getOrderDetail();
          },
          'fail': function (res) {
            that.getOrderDetail();
          }
        });
      }
    });

  },
  //取消订单
  updateOrder(event){
    let that = this;
    let status = event.currentTarget.dataset.status;
    util.request(api.UpdateOrder, {
      id: that.data.orderId, status: status
    }, 'POST').then(function (res) {
      wx.showToast({
        title: res.errmsg,
      })
      that.getOrderDetail();
    });
  },
  //删除订单
  delOrder() {
    let that = this;
    util.request(api.DelOrder, {
      id: that.data.orderId || 15
    }).then(function (res) {
      wx.showToast({
        title: res.errmsg,
      })
      //跳转到订单列表
      wx.redirectTo({
        url: '/pages/ucenter/order/order'
      })
    });
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
  }
})