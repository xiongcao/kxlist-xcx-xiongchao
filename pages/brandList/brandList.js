var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryList: ["全部", "中国", "日本", "欧洲", "美国", "澳洲", "韩国", "其他"],
    sidebar: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    countryName:'全部',
    brandContentList:[],
    into:''
  },
  onShareAppMessage() {
    return {
      title: "快销清单|快消行业效率提升专业工具",
      path: '/pages/brandList/brandList'
    }
  },
  scrollToViewFn(e){
    console.log();
    let id = e.target.dataset.id;
    id = id == '#' ? 'Test' : id
    this.setData({
      into:id
    })
  },
  classifybrandlist(e){
    this.setData({
      countryName: e.target.dataset.i
    })
    this.getBrandList();
  },
  getBrandList(){
    wx.showLoading({
      title: "加载中"
    })
    let countryName = this.data.countryName == "全部" ? "" : this.data.countryName;
    app.request({
      url: "brand/location",
      data: {
        location: countryName
      },
      success: (res) => {
        if (res.code == 0) {
          res.data.length > 0 && this.handleBrandData(res.data);
        }
        wx.hideLoading();
      }
    })
  },
  handleBrandData(list){
    list = list.sort(function (a, b) {
      let s = a['firstLetter'],
        t = b['firstLetter'];
      return s < t ? -1 : 1;
    });
    list = list.map((o)=>{
      if (!/[A-Z]/.test(o.firstLetter)){
        o.firstLetter = "#"
      }
      return o;
    })
    let _tmpArr = [];
    let _first = list[0];
    let _brandContentList = [];
    list.forEach((brand)=>{
      if (_first.firstLetter == brand.firstLetter){
        _tmpArr.push(brand);
      }else{
        _brandContentList.push({ firstLetter: _tmpArr[0].firstLetter, brandList: _tmpArr })
        _tmpArr = [brand];
        _first = brand;
      }
    });
    _brandContentList.push({ firstLetter: _tmpArr[0].firstLetter, brandList: _tmpArr })
    this.setData({
      brandContentList: _brandContentList
    })
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      countryName: options.location
    })
    this.getBrandList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }

})