let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityList:[],
    brandList:[],
    searchRecordList:[],
    userInfo:app.globalData.userInfo,
    searchText:'',
    isShowCloseBtn:false,
    searchKeywords:'',
    pageIndex:0,
    currentTab:0,
    commodityLoading:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchRecordList();
  },
  getSearchRecordList(){
    let that = this;
    wx.getStorage({
      key: 'historyRecord',
      success(res) {
        console.log(res,"历史记录")
        if (res.data){
          that.setData({
            searchRecordList:res.data
          })
        }
      }
    })
  },
  searchInput(e){  // 输入框事件
    let value = e.detail.value;
    this.setData({
      searchText: value,
      searchKeywords: value,
      isShowCloseBtn:value ? true : false
    });
  },
  searchTap(e){ // 搜索按钮、Enter事件
    this.setData({
      commodityList: [],
      pageIndex: 0,
      commodityLoading: false
    })
    this.getCommodityList(e.detail.value,0);
    this.getBrandList();
  },
  handleSearchRecord(e){
    let historyRecord = e;
    let _searchRecordList = [...this.data.searchRecordList];
    let index = _searchRecordList.indexOf(historyRecord);
    if (index != -1) { // 记录列表数据中已存在该条数据
      _searchRecordList.splice(index, 1)
    }
    _searchRecordList.unshift(historyRecord);
    this.setData({
      searchRecordList: _searchRecordList
    })
    wx.setStorage({
      key: 'historyRecord',
      data: _searchRecordList
    })
  },
  clearall(){ //清除所有历史记录
    let that = this;
    wx.removeStorage({
      key: 'historyRecord',
      success(res) {
        that.setData({
          searchRecordList:[]
        })
      }
    })
  },
  clearSearch(){  // 清除搜索文本
    this.setData({
      searchText: '',
      searchKeywords: '',
      isShowCloseBtn: false
    });
  },
  clickItemSearch(e){  //单击记录列表搜索
    let keywords = e.target.dataset.keywords;
    this.setData({
      commodityList:[],
      pageIndex: 0,
      commodityLoading: false,
      searchKeywords:keywords
    })
    this.getCommodityList(keywords,1);
    this.getBrandList();
  },
  tabClick(e) {
    if (this.data.currentTab !== e.target.dataset.current) {
      this.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  boxSlide(e){ // swiper滑块事件
    this.setData({ currentTab: e.detail.current })
  },
  commodityScroll() {  // 商品上拉加载事件
    if (this.data.commodityLoading && this.data.pageIndex != -1){
      let index = ++this.data.pageIndex;
      this.setData({
        pageIndex: index,
        commodityLoading: false
      })
      this.getCommodityList();
    }

  },
  getCommodityList(e,type){
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: "/search/commodityPublic",
      data: {
        queryString: this.data.searchKeywords,
        pageSize: 10,
        startPage: this.data.pageIndex
      },
      method: "POST",
      success: (res) => {
        if (res.code === 0) {
          let _tmpList = [];
          let commodityList = res.data.commodities;
          commodityList.forEach((o,i)=>{
            let commodity = {
              id:o.id,
              commodityId:o.commodity.commodityId,
              commodityImage:o.commodity.image,
              barCode: o.commodity.barCode,
              categoryId:o.commodity.categoryId,
              commodityName: o.commodity.name,
              origin: o.commodity.origin,
              prices: o.commodity.prices,
              priceUnits: o.commodity.priceUnits
            };
            _tmpList.push(commodity);
          });
          let newCommodityList = [...this.data.commodityList];
          newCommodityList = newCommodityList.concat(_tmpList);
          let _commodityLoading = false;
          if (commodityList.length!=0){
            _commodityLoading = true;
          }
          this.setData({
            commodityList: newCommodityList,
            commodityLoading: _commodityLoading
          });
        } else {
          this.setData({
            pageIndex: -1,
            commodityLoading: false
          });
        }
        wx.hideLoading();
        type == 0 && this.handleSearchRecord(e);
      }
    })
  },
  getBrandList(){
    app.request({
      url: "brand/search",
      data: {
        brandName: this.data.searchKeywords
      },
      success: (res) => {
        if (res.code === 0) {
          this.setData({
            brandList: res.data,
          });
        } else {
          this.setData({
            brandList: []
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})