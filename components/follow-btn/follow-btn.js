let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proIsFollow: {
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { 
        if(newVal){
          this.setData({
            followImg:'follow-f'
          })
        }else{
          this.setData({
            followImg: 'follow-bebebe'
          })
        }
      } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    proId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    followImg: 'follow-bebebe'  // follow-bebebe
  },

  /**
   * 组件的方法列表
   */
  methods: {
    followTap(){
      console.log(this.data.proIsFollow,12);
      if(this.data.proIsFollow){
        this.cancelFollow();
      }else{
        this.addFollow();
      }
    }
  },
  addFollow(){
    app.requestWithToken({
      url: 'follow',
      method: 'post',
      data: {
        userID: userInfo.id,
        resourceID: brand.id,
        brandID: brand.id,
        resourceType: 5,
        status: 1,
        resourceName: brand.brandNameEN + brand.brandName
      },
      doSuccess: (res) => {
        if (res.code === 0) {
          that.setData({
            proIsFollow: true
          })
        }
      }
    })
  },
  cancelFollow(){
    app.requestWithToken({
      url: `follow/${brand.id}`,
      method: 'put',
      success: (res) => {
        if (res.code === 0) {
          that.setData({
            proIsFollow: false
          })
        }
      }
    })
  }
})
