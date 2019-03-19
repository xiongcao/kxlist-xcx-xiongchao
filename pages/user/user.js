let app = getApp();
let dateTime = require('../../utils/dateTime.js');

Page({
  data: {
    winHeight: app.globalData.winHeight,  //swrper距离顶部高度
    canIUse:true, //是否授权登录
    currnetIndex:0, //当前tab索引
    commodityNum:'',  //商品收藏数量
    commoditPageIndex:0,  //商品数据页码
    commodityList:[], //商品集合
    commodityLoading:true,
    brandNum:'',
    brandPageIndex:0,
    brandList:[],
    brandLoading:true,
    pageSize:10,
    recentList:[]

  },
  onLoad: function (options) {
    var that = this
    that.setData({
      ossPath: app.globalData.ossPath,
      M_100: app.globalData.M_100,
      M_500: app.globalData.M_W_500,
    })
  },
  onShow: function () {
    if (app.globalData.userInfo){ //已授权登录
      this.getFollowBrandNum();
      this.getFollowCommodityNum();
      this.getRecentList();
    }
  },
  changeTab(e){
    console.log(e.target.dataset.index);
    this.setData({
      currnetIndex: e.target.dataset.index
    })
  },
  swiperSlider(e){
    this.setData({
      currnetIndex: e.detail.current
    })
  },
  brandScroll(e){  //品牌模块滚动
    console.log("品牌到底了",e);
    if (this.data.brandPageIndex != -1 && this.data.brandLoading) {
      this.setData({ brandLoading: false })
      wx.showLoading({
        title: '加载中'
      })
      this.getBrandFollowList();
    }
  },
  commodityScroll(e) {  //商品模块滚动
    console.log("商品到底了",e);
    if (this.data.commoditPageIndex!=-1&&this.data.commodityLoading){
      wx.showLoading({
        title: '加载中',
      })
      this.setData({ commodityLoading: false })
      this.getCommodityFollowList();
    }
  },
  recenScroll(e) {  //浏览记录模块滚动
    console.log("浏览记录到底了",e);
  },
  getRecentList(){
    wx.showLoading({
      title: '加载中',
    })
    app.requestWithToken({
      url: "/browseRecords",
      success: (result) => {
        if (result.code == 0) {
          result.data = result.data.map((val, idx) => {
            val.lastModifiedDate = dateTime.shortDate(val.lastModifiedDate);
            return val;
          })
          this.setData({
            recentList: result.data
          })
        }
        wx.hideLoading();
      }
    });
  },
  getFollowCommodityNum: function () {
    var that = this
    app.requestWithToken({
      url: `follow/count`,
      data: {
        resourceType: 1
      },
      success: (result) => {
        if (result.code === 0) {
          that.setData({
            commodityNum: result.data,
            commoditPageIndex: 0
          })
          if (result.data > 0) {
            // 获取关注商品
            that.getCommodityFollowList()
          } else {
            that.setData({ commodityList: null })
          }
        }
      }
    })
  },
  getFollowBrandNum() {
    var that = this;
    app.requestWithToken({
      url: `follow/count`,
      data: {
        resourceType: 5
      },
      success: (result) => {
        if (result.code === 0) {
          that.setData({
            brandNum: result.data,
            brandPageIndex: 0
          })
          if (result.data > 0) {
            // 获取关注品牌
            that.getBrandFollowList()
          } else {
            that.setData({ brandList: null })
          }
        }
      }
    })
  },
  getBrandFollowList: function () {
    var that = this
    app.requestWithToken({
      url: 'follow',
      data: {
        resourceType: 5,
        page: that.data.brandPageIndex,
        size: that.data.pageSize
      },
      success: (result) => {
        if (result.code === 0) {
          var brandList = result.data.content;
          if(that.data.brandPageIndex!=0){
            brandList = that.data.brandList.concat(brandList);
          }
          brandList.forEach((o)=>{
            if (o.brandName && o.brandNameEN){
              o.name = o.brandNameEN + "/" + o.brandName;
            } else if (o.brandName){
              o.name = o.brandName;
            }else{
              o.name = o.brandNameEN;
            }
          })
          that.setData({
            brandPageIndex: that.data.brandPageIndex + 1,// 分页后自动+1
            brandList: brandList,
            brandLoading:true
          })
          wx.hideLoading();
        } else {
          that.setData({
            brandPageIndex: -1,
            brandLoading: true
          })
          wx.hideLoading();
        }
      }
    })
  },

  getCommodityFollowList: function () {
    var that = this
    app.requestWithToken({
      url: 'follow',
      data: {
        resourceType: 1,
        page: that.data.commoditPageIndex,
        size: that.data.pageSize
      },
      success: (result) => {
        if (result.code === 0) {
          var commodityList = result.data.content;
          if(that.data.commoditPageIndex!=0){
            commodityList = that.data.commodityList.concat(commodityList);
          }
          that.setData({
            commoditPageIndex: that.data.commoditPageIndex + 1,// 分页后自动+1
            commodityList: commodityList,
            commodityLoading:true
          })
          wx.hideLoading();
        } else {
          that.setData({
            commodityLoading: true,
            commoditPageIndex: -1 //停止请求数据
          })
          wx.hideLoading();
        }
      }
    })
  },
  bindGetUserInfo(e){
    if (e.detail.userInfo){ //允许授权
      //获取用户信息
      app.getUserInfo((userInfo)=>{
        this.setData({
          userInfo: userInfo,
          canIUse:false
        });
        this.getFollowBrandNum();
        this.getFollowCommodityNum();
        this.getRecentList();
      });
    }else{  //拒绝授权
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})