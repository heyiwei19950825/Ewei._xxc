// pages/ucenter/member/member.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphone: '',
    email: '',
    username: '',
    isVip:0,
    userInfo:[],
    vipNote: '普通会员',
    title:'会员申请',
    goodsList:[],
    filterCategory:[],
    categoryId: 0,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    page: 1,
    size: 1000,
    reason:''
  },

  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindIphoneInput: function (e) {

    this.setData({
      iphone: e.detail.value
    });
  },
  bindEmailInput: function (e) {

    this.setData({
      email: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-iphone':
        this.setData({
          iphone: ''
        });
        break;
      case 'clear-email':
        this.setData({
          email: ''
        });
        break;
    }
  },
 //申请会员 
  ApplyVip:function(){
    let that = this;
    util.request(api.ApplyVip, { username: that.data.username, iphone: that.data.iphone, email: that.data.email }, 'POST').then(res =>      {
      if (res.errno == 0) {
        wx.showToast({
          title: res.errmsg,
        })
      }
    })
  },
  getGoodsList: function () {
    that.getGoodsList();
  },
  getGoodsList() {
    var that = this;

    util.request(api.GoodsList, { id: that.data.categoryId, page: that.data.page, size: that.data.size, order: that.data.currentSortOrder, sort: that.data.currentSortType, categoryId: that.data.categoryId, types: 'vip' })
      .then(function (res) {
        if (res.errno === 0) {
          that.setData({
            goodsList: res.data.goodsList,
            filterCategory: res.data.filterCategory
          });
        }
      });
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortType': 'category',
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'sp_integral',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'id',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    this.setData({
      'categoryFilter': false,
      'categoryId': this.data.filterCategory[currentIndex].id
    });
    this.getGoodsList();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.goLogin()
    this.setData({
      userInfo: app.globalData.userInfo,
      isVip: app.globalData.userInfo.is_vip,
      reason: app.globalData.userInfo.vip_refuse_note,
    });
    if (this.data.userInfo.is_vip == 2) {
      this.setData({
        vipNote: 'VIP会员'
      });
      this.getGoodsList();
    }
    //修改会员状态注释

    switch (this.data.userInfo.is_vip) {
      case 0:
        this.setData({
          title: '会员申请'
        });
        break;
      case 1:
        this.setData({
          title: '等待审核'
        });
        break;
      case 2:
        this.setData({
          title: '会员专享'
        });
        break;
      case 3:
        this.setData({
          title: '拒绝申请',

        });
        break;
    }
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