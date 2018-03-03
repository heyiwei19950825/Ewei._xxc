var NewApiRootUrl = 'https://ld.mskfkj.comapi/v1/';
var NewApiRootUrl1 = 'https://ld.mskfkj.com/api/v1/';

// var NewApiRootUrl = 'http://admin.ewei.com/api/v1/';
// var NewApiRootUrl1 = 'http://127.0.0.1:8360/api/';



module.exports = {
    IndexUrl: NewApiRootUrl + 'index/index', //首页数据接口
    CatalogList: NewApiRootUrl + 'Category/all',  //分类目录全部分类数据接口
    // CatalogCurrent: NewApiRootUrl1 + 'catalog/current',  //分类目录当前分类数据接口
    // AuthLoginByWeixin: NewApiRootUrl + 'auth/loginByWeixin', //微信登录
    AuthLoginByWeixin: NewApiRootUrl + 'token/user', //微信登录
    

    GoodsCount: NewApiRootUrl + 'goods/count',  //统计商品总数
    GoodsList: NewApiRootUrl + 'goods/by_category/paginate',//获得商品列表
    CategoryList: NewApiRootUrl + 'category/list',  //获得分类数据
    GoodsDetail: NewApiRootUrl + 'goods/detail',  //获得商品的详情
    GoodsNew: NewApiRootUrl + 'goods/new',  //新品
    GoodsHot: NewApiRootUrl + 'goods/hot',  //热门
    GoodsRelated: NewApiRootUrl1 + 'goods/related',  //商品详情页的关联商品（大家都在看）
    GoodsIntegral: NewApiRootUrl +'goods/integral', // 积分兑换商品

    BrandList: NewApiRootUrl1 + 'brand/list',  //品牌列表
    BrandDetail: NewApiRootUrl1 + 'brand/detail',  //品牌详情

    CartList: NewApiRootUrl + 'cart/index', //获取购物车的数据
    CartAdd: NewApiRootUrl + 'cart/add', // 添加商品到购物车
    CartUpdate: NewApiRootUrl + 'cart/update', // 更新购物车的商品
    CartDelete: NewApiRootUrl + 'cart/delete', // 删除购物车的商品
    CartChecked: NewApiRootUrl + 'cart/checked', // 选择或取消选择商品
    CartGoodsCount: NewApiRootUrl + 'cart/goodscount', // 获取购物车商品件数
    CartCheckout: NewApiRootUrl + 'cart/checkout', // 下单前信息确认

    OrderSubmit: NewApiRootUrl + 'order/place', // 提交订单
    UpdateOrder: NewApiRootUrl + 'order/updatestatus', // 取消订单
    DelOrder: NewApiRootUrl + 'order/delorder', // 取消订单
    
    PayPrepayId: NewApiRootUrl + 'pay/pre_order', //获取微信统一下单prepay_id

    CollectList: NewApiRootUrl + 'collect/list',  //收藏列表
    CollectAddOrDelete: NewApiRootUrl + 'collect/addordelete',  //添加或取消收藏

    CommentList: NewApiRootUrl1 + 'comment/list',  //评论列表
    CommentCount: NewApiRootUrl1 + 'comment/count',  //评论总数
    CommentPost: NewApiRootUrl1 + 'comment/post',   //发表评论

    TopicList: NewApiRootUrl + 'Article/list',  //专题列表
    TopicDetail: NewApiRootUrl + 'Article/detail',  //专题详情
    TopicRelated: NewApiRootUrl + 'Article/related',  //相关专题

    SearchIndex: NewApiRootUrl + 'search/index',  //搜索页面数据
    SearchResult: NewApiRootUrl1 + 'search/result',  //搜索数据
    SearchHelper: NewApiRootUrl + 'search/helper',  //搜索帮助
    SearchClearHistory: NewApiRootUrl1 + 'search/clearhistory',  //搜索帮助

    AddressList: NewApiRootUrl + 'address/list',  //收货地址列表
    AddressDetail: NewApiRootUrl + 'address/detail',  //收货地址详情
    AddressSave: NewApiRootUrl + 'address/save',  //保存收货地址
    AddressDelete: NewApiRootUrl + 'address/delete',  //删除收货地址

    RegionList: NewApiRootUrl + 'region/list',  //获取区域列表

    OrderList: NewApiRootUrl + 'order/list',  //订单列表
    OrderDetail: NewApiRootUrl + 'order/detail',  //订单详情
    OrderCancel: NewApiRootUrl1 + 'order/cancel',  //取消订单

    FootprintList: NewApiRootUrl + 'footprint/list',  //足迹列表
    FootprintDelete: NewApiRootUrl1 + 'footprint/delete',  //删除足迹
    CouponList: NewApiRootUrl + 'coupon/userCouponList',  //优惠券列表
    UseCouponList: NewApiRootUrl + 'coupon/useCouponList',  //用户优惠券列表
    UserGetCoupon: NewApiRootUrl + 'coupon/userGetCoupon',  //用户领取优惠券

    IntegralPay: NewApiRootUrl + 'integral/integralCart',   //积分购买商品

    GoodsCollective: NewApiRootUrl + 'collective/getList',//团购商品列表
    CollectivePay: NewApiRootUrl + 'collective/cart',   //团购订单
    CollectiveDetail: NewApiRootUrl + 'collective/detail',   //团购商品详情


    FeedBack: NewApiRootUrl+'feedBack/add',//用户反馈
    
};