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

  /**
   * 组件的方法列表
   */
  methods: {
    showBtns(){
      this.setData({
        showShareBtn: !this.data.showShareBtn
      }) 
    }
  }
})
