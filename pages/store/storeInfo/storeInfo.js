var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var that;
// 最大行数
var max_row_height = 5;
// 行高
var cart_offset = 90;
// 底部栏偏移量
var food_row_height = 49;
const app = getApp()
Page({
	data: {
		categoryStates: [],
		cartData: {},
		cartObjects: [],
		maskVisual: 'hidden',
		amount: 0,
    shopId:0
	},
  onLoad: function (options) {
		that = this;
    that.setData({
      shopId: options.shop_id
    });
    util.request(api.ShopInfo, { id: options.shop_id}).then(function (res) {
      that.setData({
        seller: res.data,
        express_fee: res.data.express.cost
      });
    });
   
		that.loadCategory();
		that.loadFood();
	},
	loadCategory: function () {
    util.request(api.GetShopCategory, { id: that.data.shopId }).then(function (categoryObjects) {
      var categoryStates = [];
      for (var i = 0; i < categoryObjects.data.length; i++) {
				categoryStates.push(false);
			}
      that.setData({
				categoryObjects: categoryObjects.data,
				categoryStates: categoryStates
			});
    });
	
	},
	loadFood: function (category) {

    if (category == undefined) {
      let category = 0;
    }

    util.request(api.ShopGoodsList, { id: that.data.shopId, cid: category }).then(function (foodObjects) {
      that.setData({
        foodObjects: foodObjects.data.data
      });
    });
	},
	switchCategory: function (e) {
		// 获取分类id并切换分类
		var index = e.currentTarget.dataset.index;
		var categoryId = that.data.categoryObjects[index].id;
		// 更改分类项高亮状态
		var categoryStates = that.data.categoryStates;
		categoryStates = categoryStates.map(function (item, i) {
			if (index == i) {
				item = true;
			} else {
				item = false;
			}
			return item;
		});
		that.setData({
			categoryStates: categoryStates
		});
    that.loadFood(categoryId);
	},
	checkout: function () {
    wx.showLoading();
    util.request(api.CartAdd, { cartArray: this.data.cartData }, "POST")
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.navigateTo({
            url: '../../shopping/checkout/checkout'
          })
        } else {
          that.data.cartData[foodId]--;
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: res.errmsg,
            mask: true
          });
        }
      });
	},
	add: function (e) {
		// 所点商品id
		var foodId = e.currentTarget.dataset.foodId;
		// 读取目前购物车数据
		var cartData = that.data.cartData;
		// 获取当前商品数量
		var foodCount = cartData[foodId] ? cartData[foodId] : 0;
		// 自增1后存回
		cartData[foodId] = ++foodCount;
		// 设值到data数据中
		that.setData({
			cartData: cartData
		});
		// 转换成购物车数据为数组
		that.cartToArray(foodId);
	},
	subtract: function (e) {
		// 所点商品id
		var foodId = e.currentTarget.dataset.foodId;
		// 读取目前购物车数据
		var cartData = that.data.cartData;
		// 获取当前商品数量
		var foodCount = cartData[foodId];
		// 自减1
		--foodCount;
		// 减到零了就直接移除
		if (foodCount == 0) {
			delete cartData[foodId]
		} else {
			cartData[foodId] = foodCount;
		}
		// 设值到data数据中
		that.setData({
			cartData: cartData
		});
		// 转换成购物车数据为数组
		that.cartToArray(foodId);
	},
	cartToArray: function (foodId) {
		// 需要判断购物车数据中是否已经包含了原商品，从而决定新添加还是仅修改它的数量
		var cartData = that.data.cartData;
		var cartObjects = that.data.cartObjects;
    util.request(api.getShopOne, { id: foodId}).then(function (food) {
      if (food.errno != undefined ){
          wx.showToast({
            title: food.errmsg,
          })
        }
        food = food.data;
        // 从数组找到该商品，并修改它的数量
        for (var i = 0; i < cartObjects.length; i++) {
          if (cartObjects[i].food.id == foodId) {
            // 如果是undefined，那么就是通过点减号被删完了
            if (cartData[foodId] == undefined) {
              cartObjects.splice(i, 1);
            } else {
              cartObjects[i].quantity = cartData[foodId];
            }
            that.setData({
              cartObjects: cartObjects
            });
            // 成功找到直接返回，不再执行添加
            that.amount();
            return;
          }
        }
        // 添加商品到数组
        var cart = {};
        cart.food = food;
        cart.quantity = cartData[foodId];
        cartObjects.push(cart);
        that.setData({
          cartObjects: cartObjects
        });
        // 因为请求网络是异步的，因此汇总在此，上同
        that.amount();
    });    
	},
	cascadeToggle: function () {
		//切换购物车开与关
		if (that.data.maskVisual == 'show') {
			that.cascadeDismiss();
		} else {
			that.cascadePopup();
		}
	},
	cascadePopup: function () {
		// 购物车打开动画
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease-in-out',
		});
		that.animation = animation;
		// scrollHeight为商品列表本身的高度
		var scrollHeight = (that.data.cartObjects.length <= max_row_height ? that.data.cartObjects.length : max_row_height) * food_row_height;
		// cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
		var cartHeight = scrollHeight + cart_offset;
		animation.translateY(- cartHeight).step();
		that.setData({
			animationData: that.animation.export(),
			maskVisual: 'show',
			scrollHeight: scrollHeight,
			cartHeight: cartHeight
		});
		// 遮罩渐变动画
		var animationMask = wx.createAnimation({
			duration: 150,
			timingFunction: 'linear',
		});
		that.animationMask = animationMask;
		animationMask.opacity(0.8).step();
		that.setData({
			animationMask: that.animationMask.export(),
		});
	},
	cascadeDismiss: function () {
		// 购物车关闭动画
		that.animation.translateY(that.data.cartHeight).step();
		that.setData({
			animationData: that.animation.export()
		});
		// 遮罩渐变动画
		that.animationMask.opacity(0).step();
		that.setData({
			animationMask: that.animationMask.export(),
		});
		// 隐藏遮罩层
		that.setData({
			maskVisual: 'hidden'
		});
	},
	amount: function() {
		var cartObjects = that.data.cartObjects;
		var amount = 0;
		var quantity = 0;
		cartObjects.forEach(function (item, index) {
      amount += item.quantity * item.food.sp_price;
			quantity += item.quantity;
		});
		that.setData({
			amount: amount,
			quantity: quantity
		});
	}
})