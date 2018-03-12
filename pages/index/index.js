const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    couponList:[],
    collectiveList:[],
    //公告参数
    text: '',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔
  },
  onShareAppMessage: function () {
    wx.getStorageSync('shopInfo', res.data.shopInfo);
    return {
      title: shopInfo.shop_name,
      desc: shopInfo.shop_name,
      path: '/pages/index/index'
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        if(res.data.system.switch == 'false'){
            wx.redirectTo({
              url: '/pages/maintain/maintain',
            })
        }
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          nav: res.data.navList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          couponList: res.data.couponList,
          collectiveList: res.data.collectiveList,
          text: res.data.system.inform
        });
        //设置店铺信息
        wx.setStorageSync('shopInfo', res.data.shopInfo);
        //设置分类页面标题
        wx.setNavigationBarTitle({
          title: res.data.shopInfo.shop_name//页面标题为路由参数
        })
      }
    });
  },
 
  //用户领取优惠券
  userGetCoupon(event){
    let that = this; 
    util.request(api.UserGetCoupon, { cid:event.currentTarget.dataset.id}, 'POST').then(res => {
        if( res.errno == 0 ){
          wx.showToast({
            title: res.errmsg,
          })
        }else{
          util.showErrorToast(res.errmsg);
        }
    })
  },
  //获取商铺信息
  shopInfoData: function (){

  },

  //跑马灯
  run1: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run1();
      }
    }, vm.data.interval);
  },
  onLoad: function (options) {
    app.goLogin()
    this.getIndexData();
    this.shopInfoData();
  },
  
  onReady: function () {
    // 页面渲染完成
    var vm = this;
    var length = vm.data.text.length * vm.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    // vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
    
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
})
