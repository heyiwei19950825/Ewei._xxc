// pages/shop/shop.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
var is_loading = false;
var is_no_more = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    page_count: 1,
    longitude: '',
    latitude: '',
    score: [1, 2, 3, 4, 5],
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    var page = this;
    var user_id = options.user_id;
    wx.getLocation({
      success: function (res) {
        page.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      complete: function () {
        page.loadData();
      }
    })
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
    // app.pageOnShow(this);
    // var page = this;
  },
  loadData: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
    });
    util.request(api.ShopList, { longitude: page.data.longitude, latitude: page.data.latitude }).then(function (res) {
        if (res.code == 0) {
          page.setData(res.data);
        }
        wx.hideLoading();
    })
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
    var page = this;
    page.setData({
      keyword: '',
      page: 1
    });
    wx.getLocation({
      success: function (res) {
        page.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      complete: function () {
        page.loadData();
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this;
    if (page.data.page >= page.data.page_count) {
      return;
    }
    page.loadMoreData();
  },

  loadMoreData: function () {
    var page = this;
    var p = page.data.page;
    if (is_loading) {
      return;
    }
    is_loading = true;
    wx.showLoading({
      title: '加载中',
    });
    util.request(api.ShopList, { page:p,longitude: page.data.longitude, latitude: page.data.latitude }).then(function (res) {
      if (res.code == 0) {
        var shop_list = page.data.list.concat(res.data.list);
        page.setData({
          list: shop_list,
          page_count: res.data.page_count,
          row_count: res.data.row_count,
          page: (p + 1)
        });
      }
      wx.hideLoading();
    })
  },

  goto: function (e) {
    var page = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          app.getauth({
            content: '需要获取您的地理位置授权，请到小程序设置中打开授权！',
            cancel: false,
            success: function (res) {
              if (res.authSetting['scope.userLocation']) {
                page.location(e);
              }
            }
          });
        } else {
          page.location(e);
        }
      }
    })
  },

  location: function (e) {
    var page = this;
    var index = e.currentTarget.dataset.index;
    var shop_list = page.data.list;
    wx.openLocation({
      latitude: parseFloat(shop_list[index].latitude),
      longitude: parseFloat(shop_list[index].longitude),
      name: shop_list[index].shop_name,
      address: shop_list[index].shop_address,
    })
  },

  inputFocus: function (e) {
    this.setData({
      show: true
    });
  },

  inputBlur: function (e) {
    this.setData({
      show: false
    });
  },

  inputConfirm: function (e) {
    var page = this;
    page.search();
  },

  input: function (e) {
    var page = this;
    page.setData({
      keyword: e.detail.value
    });
  },

  search: function (e) {
    var page = this;
    wx.showLoading({
      title: '搜索中',
    });
    util.request(api.ShopList, { keyword:page.data.keyword,longitude: page.data.longitude, latitude: page.data.latitude }).then(function (res) {
      if (res.code == 0) {
        page.setData(res.data);
      }
      wx.hideLoading();
    })
  },

  go: function (e) {
    var page = this;
    var index = e.currentTarget.dataset.index;
    var shop_list = page.data.list;
    wx.navigateTo({
      url: '/pages/store/storeInfo/storeInfo?shop_id=' + shop_list[index].id,
    })
  },

  navigatorClick: function (e) {
    var page = this;
    var open_type = e.currentTarget.dataset.open_type;
    var url = e.currentTarget.dataset.url;
    if (open_type != 'wxapp')
      return true;
    //console.log(url);
    url = parseQueryString(url);
    url.path = url.path ? decodeURIComponent(url.path) : "";
    console.log("Open New App");
    wx.navigateToMiniProgram({
      appId: url.appId,
      path: url.path,
      complete: function (e) {
        console.log(e);
      }
    });
    return false;

    function parseQueryString(url) {
      var reg_url = /^[^\?]+\?([\w\W]+)$/,
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        arr_url = reg_url.exec(url),
        ret = {};
      if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
          ret[result[1]] = result[2];
        }
      }
      return ret;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {

    var page = this;
    var user_info = wx.getStorageSync("user_info");
    return {
      path: "/pages/shop/shop?user_id=" + user_info.id,
    };
  },
})