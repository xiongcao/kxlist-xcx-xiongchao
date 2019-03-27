let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: false, //是否授权登录
    brandId:'',
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossPath,
    M_W_800: app.globalData.M_W_800,
    M_W_500_BLUR: app.globalData.M_W_500_BLUR,
    aboutToggle:true,
    active:'pub',
    imgicon:'imgword',
    barOrCard:true, // 显示bar
    categoryIDs:'',
    brandInfo:null,
    commodityList:[],
    followStatus:false, //关注状态 false:未关注  true：已关注
    noCommodity:false,  // 无商品
    showCommodityGroup:false,
    showShareBtn:false,
    resourceName:''
  },
  toggleAbout(){
    this.setData({
      aboutToggle: !this.data.aboutToggle
    })
  },
  changeicon(){
    if (this.data.barOrCard){
      this.setData({
        barOrCard: false,
        imgicon: 'bigview'
      })
    }else{
      this.setData({
        barOrCard: true,
        imgicon: 'imgword'
      })
    }
  },
  commodityGroupTap(){
    this.setData({
      showCommodityGroup:!this.data.showCommodityGroup
    })
  },
  toBrandDetail(){
    wx.navigateTo({
      url: 'pages/brandDetail/brandDetail',
    })
  },
  commoditySortTaP(e){
    let field = e.currentTarget.dataset.order;
    if (this.data.active != field){
      if(field == 'pub'){
        this.getCommodityList("serial_number&properties=created_date")
      }else if(field == 'time'){
        this.getCommodityList("created_date")
      } else if (field == 'name'){
        this.getCommodityList("brandName&properties=series&properties=commodityName&properties=specification")
      }
      this.setData({
        active: field
      })
    }
  },
  getBrandInfo(){
    app.request({
      url: `brand/${this.data.brandId}`,
      success: (result) => {
        if (result.code == 0) {
          var obj = result.data
          let _resourceName = '';
          if(obj.brandName && obj.brandNameEN){
            _resourceName = obj.brandNameEN + "/" + obj.obj.brandName;
          } else if(obj.brandName){
            _resourceName = obj.brandName
          } else if (obj.brandNameEN) {
            _resourceName = obj.brandNameEN
          }
          this.setData({
            brandInfo: obj,
            categoryIDs: result.data.categoryIDs,
            resourceName:_resourceName
          });
          this.data.userInfo && this.getFollswStatus() // 查询是否关注
          this.getCommodityList("serial_number&properties=created_date");  // 获取商品数据
        } else {
          wx.showToast({
            title: '没有请求到数据',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  getFollswStatus(){
    app.requestWithToken({
      url: `follow/${this.data.brandId}`,
      success: (res) => {
        this.setData({
          followStatus: res.data
        })
      }
    })
  },
  getCommodityList(orderedBy){
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: `commodityPublic/${this.data.brandId}?properties=${orderedBy}`,
      data: {
        categoryID: this.data.categoryIDs,
        direction: 'DESC'
      },
      method: "POST",
      success: (res) => {
        if (res.code === 0 && res.data.content.length > 0) {
          this.setData({
            commodityList: res.data.content,
            noCommodity: false
          })
          wx.hideLoading();
        } else {
          this.setData({
            noCommodity: true
          })
          wx.hideLoading();
        }
      }
    })
  },
  getUserInfo(e) {
    console.log('父组件授权响应',e);
    this.setData({
      canIUse: e.detail.canIUse,
      userInfo: e.detail.userInfo
    })
    app.globalData.canIUse = true;
    console.log(app.globalData.canIUse);
    this.getBrandInfo();
  },
  toggleAuthorizePage(e){
    this.setData({
      canIUse: e.detail.canIUse
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){  //已授权
      this.setData({
        brandId:options.id,
        canIUse: false,
        userInfo:app.globalData.userInfo
      })
      this.getBrandInfo();
    }else{ 
      if (app.globalData.canIUse) {  //取消过授权
        this.setData({
          brandId: options.id
        });
        this.getBrandInfo();
      }else{  // 从来没有操作过授权
        this.setData({
          brandId: options.id,
          canIUse: true
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})