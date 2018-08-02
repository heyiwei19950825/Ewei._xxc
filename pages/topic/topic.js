var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()
Page({
    data: {
        // text:"这是一个页面"
        topicList: [],
        page: 1,
        size: 10,
        count: 0,
        showPage: false,
        navList: [],
        id: 0,
        currentCategory: {},
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        page: 1,
        size: 10000
    },
    //下拉刷新
    onPullDownRefresh: function () {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      this.getTopic();
      //模拟加载
      setTimeout(function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, 1500);
    },
    onLoad: function (options) {
      let that = this;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              scrollHeight: res.windowHeight
            });
          }
        });
        if (options.cid == undefined){
          options.cid =0;
        }
        // 页面初始化 options为页面跳转所带来的参数
        that.getCategory(options.cid);
    },

    getCategory:function(id){//获取文章的分类
      let that = this;
      util.request(api.AritcleCategoryList)
        .then(function (res) {
          if (res.errno == 0) {
            that.setData({
              navList: res.data.brotherCategory,
              currentCategory: res.data.currentCategory
            });
            if (res.data.currentCategory.length == 0 && res.data.brotherCategory.length > 0 && id == 0){
                id = res.data.brotherCategory[0].id;
            }

            that.setData({
              id: id,
            });
            //nav位置
            let currentIndex = 0;
            let navListCount = that.data.navList.length;
            for (let i = 0; i < navListCount; i++) {
              currentIndex += 1;
              if (that.data.navList[i].id == that.data.id) {
                break;
              }
            }
            if (currentIndex > navListCount / 2 && navListCount > 5) {
              that.setData({
                scrollLeft: currentIndex * 60
              });
            }
            that.getTopic(that.data.id);
          } else {
            //显示错误信息
          }

        });
    },

    switchCate: function (event) {
      if (this.data.id == event.currentTarget.dataset.id) {
        return false;
      }
      var that = this;
      var clientX = event.detail.x;
      var currentTarget = event.currentTarget;
      if (clientX < 60) {
        that.setData({
          scrollLeft: currentTarget.offsetLeft - 60
        });
      } else if (clientX > 330) {
        that.setData({
          scrollLeft: currentTarget.offsetLeft
        });
      }
      this.setData({
        id: event.currentTarget.dataset.id
      });

      this.getCategory(this.data.id);
    },
    getTopic: function( id ){
        let that = this;
         that.setData({
            scrollTop: 0,
            showPage: false,
            topicList: []
        });
        // 页面渲染完成
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        });

        util.request(api.TopicList, { cid:id,page: that.data.page, size: that.data.size }).then(function (res) {
          if (res.errno === 0) {
            that.setData({
              scrollTop: 0,
              topicList: res.data.data,
              showPage: true,
              count: res.data.count
            });
          }
         
          var query = wx.createSelectorQuery();
          //选择id
          query.select('.top-item').boundingClientRect(function (rect) {
            var topHieght = rect.width * that.data.topicList.length
            that.setData({
              height: topHieght + 'px'
            })
          }).exec();
          wx.hideToast();
        });
        
    },
    prevPage: function (event) {
        if (this.data.page <= 1) {
            return false;
        }

        var that = this;
        that.setData({
            "page": parseInt(that.data.page) - 1
        });
        this.getTopic();
    },
    nextPage: function (event) {
      //console.log();
      var that = this;
      if (this.data.page + 1 > that.data.count / that.data.size) {
        return true;
      }
      that.setData({
        "page": parseInt(that.data.page) + 1
      });

      this.getTopic();

    },
})