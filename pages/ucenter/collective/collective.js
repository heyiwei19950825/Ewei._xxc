// pages/ucenter/collective/collective.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectiveList: [],
  },

  /**
   * 获取拼团信息
   */
  getCollectiveList:function(){
    let that = this;
    util.request(api.CollectiveOrder).then(function (res){
      that.setData({
        collectiveList: res.data,
      });
    });
  },
  //跳转到订单详情页面
  toOrder: function (event){
    wx.redirectTo({
      url: '/pages/ucenter/orderDetail/orderDetail?id=' + event.currentTarget.dataset.orderId,
    })
  },  
  //跳转到团购详情
  toDetail: function (event){
    wx.redirectTo({
      url: '/pages/collectiveDetail/collectiveDetail?cid=' + event.currentTarget.dataset.collectiveId,
    })
  },                                                                                       

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectiveList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})