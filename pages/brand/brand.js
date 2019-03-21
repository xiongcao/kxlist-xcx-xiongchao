let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    brandId:'',
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
    followStatus:false, //关注状态
    noCommodity:false,  // 无商品
    showCommodityGroup:false,
    showShareBtn:false
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
          this.setData({
            brandInfo: obj,
            categoryIDs: result.data.categoryIDs
          });
          this.getFollswStatus() // 查询是否关注
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brandId:options.id
    })
    this.getBrandInfo();
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