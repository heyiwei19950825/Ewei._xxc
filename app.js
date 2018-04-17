var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
    //获取用户的登录信息
    user.checkLogin().then(res => {
      // //console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
    }).catch(() => {
      
    });
  },
  
  globalData: {
    userInfo: {
      nickname: 'Hi,游客',
      username: '点击去登录',
      portrait: '/static/images/default_user.png'
    },
    token: '',
  },
  goLogin: function(callback) {
    wx.showLoading({
      title: "正在登录",
      mask: true,
    });
    user.loginByWeixin().then((res) => {
      if (callback && callback instanceof Function) {
        callback(res);
      }
      // wx.removeStorageSync('token');
      // wx.removeStorageSync('userInfo');
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      // //console.log(err)
    });
  },

  getauth: function (object) {
    wx.showModal({
      title: '是否打开设置页面重新授权',
      content: object.content,
      confirmText: '去设置',
      success: function (e) {
        if (e.confirm) {
          wx.openSetting({
            success: function (res) {
              if (object.success) {
                object.success(res);
              }
            },
            fail: function (res) {
              if (object.fail) {
                object.fail(res);
              }
            },
            complete: function (res) {
              if (object.complete)
                object.complete(res);
            }
          })
        } else {
          if (object.cancel) {
            getApp().getauth(object);
          }
        }
      }
    })
  },
 
})