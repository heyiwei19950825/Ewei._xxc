var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,//反馈类型
    contentCount:0,//反馈内容字数,
    mobile:'',//手机号
    content:'',//反馈内容,
    disabled:false,
  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
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
  },
  bindFankuiPost : function(){
    var that = this.data;
    if (that.index == 0){
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '请选择反馈类型',
        mask: true
      });
      return;
    }
    if (that.mobile == '') {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '请输入手机号',
        mask: true
      });
      return;
    }
    if (that.content == '') {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '请输入反馈信息',
        mask: true
      });
      return;
    }
    util.request(api.FeedBack, { type: that.index,mobile:that.mobile,content:that.content }, 'POST').then(function (res) {
      var img = '';
      if (res.error_code != 0 ){
        img = '/static/images/icon_error.png';
      }
      wx.showToast({
        image: img,
        title: res.msg,
        mask: true
      });
    });
  },
  //填写手机号码
  bindMobile: function (event){
    let mobile = this.data.mobile;
    this.setData({
      mobile: event.detail.value
    });
  },
  //填写内容
  bindContent: function (event){
    let content = this.data.content;
    if (event.detail.value.length >= 140 ){
      this.setData({
        disabled: true,
      });
    }
    this.setData({
      content: event.detail.value,
      contentCount:  event.detail.value.length
    });
  },
  //删除手机号信息
  bindClearMobile: function (e){
    this.data.mobile = '';
  }
})