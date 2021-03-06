var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    types: 9999
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList,{types: that.data.types }).then(function (res) {
        that.setData({
          orderList: res.data.list,
          types: res.data.types
        });
    });
  },
  switchOrder: function (event) {
    if (this.data.types == event.currentTarget.dataset.types) {
      return false;
    }
    this.setData({
      types: event.currentTarget.dataset.types
    });

    this.getOrderList();
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})