Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    showShareBtn:false //隐藏二级按钮
  },
  onShareAppMessage() {
    return {
      title: "快销清单|快消行业效率提升专业工具",
      path: '/pages/index/index'
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showBtns(){
      this.setData({
        showShareBtn: !this.data.showShareBtn
      }) 
    },
    saveQRcode(){

    }
  }
})
