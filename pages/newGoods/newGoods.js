var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    bannerInfo: {
      'img_url': 'http://api.redkylin.com/uploads/goods_group/1532276477.jpg',
      'name': '积分商城'
    },
    categoryFilter: false,
    filterCategory: [],
    goodsList: [],
    categoryId: 0,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    page: 1,
    size: 1000
  },
  getGoodsList: function () {
     that.getGoodsList();
  },
  getGoodsList() {
    var that = this;

    util.request(api.GoodsList, { id: that.data.categoryId, page: that.data.page, size: that.data.size, order: that.data.currentSortOrder, sort: that.data.currentSortType, categoryId: that.data.categoryId ,types:'integral'})
      .then(function (res) {
        if (res.errno === 0) {
          that.setData({
            goodsList: res.data.goodsList,
            filterCategory: res.data.filterCategory,
            bannerInfo:res.data.banner
          });
        }
      });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getGoodsList();
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

  }
})