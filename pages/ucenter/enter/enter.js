var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterInfo:[],
    array: [],
    index: 0,//店铺类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkEnter();
    this.getShopCategory();
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  getShopCategory:function(){
    let that = this;
    util.request(api.GetShopGroup).then(function (res) {
      that.setData({
        array:res.data
      })
    })
  },
  formSubmit: function (e) {
    e.detail.value.category = this.data.index;
    util.request(api.ShopEnter, e.detail.value,'POST').then(function (res) {
      if (res.errno === 1) {
      }else{
        // util.showErrorToast(res.msg);
        wx.showModal({
          title: '请求成功',
          content: res.msg,
          showCancel: false
        });
      }
    });
  },

  // 检测是否申请过
  checkEnter:function(){
    let that = this;
    util.request(api.ShopEnter).then(function (res) {
      if (res.errno === 1){
        that.setData({
          enterInfo: res.data
        });
      }
    });    
  }
})