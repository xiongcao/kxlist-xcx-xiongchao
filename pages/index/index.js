//index.js
//获取应用实例
const app = getApp()
let timeUtils = require('../../utils/dateTime.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    countryList:[
      {
        imgsrc: "/resources/country_all.jpg",
        country: "全部",
      },
      {
        imgsrc: "/resources/country_China.jpg",
        country: "中国",

      },
      {
        imgsrc: "/resources/country_Japan.jpg",
        country: "日本",
      },
      {
        imgsrc: "/resources/country_Europe.jpg",
        country: "欧洲",
      },
      {
        imgsrc: "/resources/country_USA.jpg",
        country: "美国",
      },
      {
        imgsrc: "/resources/country_Australia.jpg",
        country: "澳洲",
      },
      {
        imgsrc: "/resources/country_Korea.jpg",
        country: "韩国",
      },
      {
        imgsrc: "/resources/country_others.jpg",
        country: "其他",
      }
    ],
    brandList:[], //处理之后可以渲染的所有品牌数据
    beforBrandList:[],  //处理之前的所有品牌数据
    pageNum:0,
    pullUpLoadComplete:false  //上拉加载是否完成
  },
  onShareAppMessage(){
    return {
      title: "快销清单|快消行业效率提升专业工具",
      path:'/pages/index/index'
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow(){
    this.getBrandList();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goToSearch(){
    console.log("触摸了搜索框");
  },
  scanBtn(){
    wx.scanCode({
      success(res) {
        this.checkCommodity(res.result);
      }
    })
  },
  checkCommodity(barCode) {
    app.request({
      url: '/commodityPublic/barCode?barCode=' + barCode,
      data: {},
      success: (res) => {
        if (res.code == 0) {
          wx.navigateTo({
            url: '/pages/commodity/commodity?publicID=' + res.data,
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/scanResult/scanResult?barCode=' + barCode,
          })
        }
      },
      doFail() {
        wx.showToast({
          title: '扫码出错，请重新扫描',
        })
      }
    })
  },
  toBrandListPage(e){
    let name = e.target.dataset.name;
    wx.navigateTo({
      url: '../brandList/brandList?location='+name
    })
  },
  onReachBottom(){
    if (this.data.pullUpLoadComplete){
      this.setData({
        pullUpLoadComplete: false,
        pageNum: this.data.pageNum + 1
      })
      this.getBrandList();
    }
  },
  getBrandList(){
    app.request({
      url: `lastInfo`,
      data: {
        properties: 'createdDate',
        page: this.data.pageNum,
        size: 10,
        direction: 'DESC'
      },
      success: (res) => {
        if (res.code == 0) {
          let content = res.data.content;
          if(content.length!=0){
            this.setData({
              pullUpLoadComplete: true
            })
          } else {
            this.setData({
              pullUpLoadComplete: false
            })
            return
          }
          let _arr = [];
          content.forEach((o)=>{
            o.createdDate = timeUtils.shortDate(o.createdDate)
          })
          _arr = this.data.beforBrandList.concat(content);
          this.setData({
            beforBrandList:_arr
          })
          this.handleBrandData();
        }else{
          this.setData({
            pullUpLoadComplete: false
          })
        }
      }
    })
  },
  handleBrandData(){
    let _first;
    this.data.beforBrandList.length > 0 && (_first = this.data.beforBrandList[0])
    let _arr = [], brandList = [];
    this.data.beforBrandList.forEach((brand)=>{
      if(_first.createdDate == brand.createdDate){
        _arr.push(brand);
      }else{
        brandList.push({ createdDate: _arr[0].createdDate,num:_arr.length,brands:_arr});
        _arr = [brand];
        _first = brand;
      }
    })
    brandList.push({ createdDate: _arr[0].createdDate, num: _arr.length, brands: _arr });
    this.setData({
      brandList: brandList
    })
  }
})
