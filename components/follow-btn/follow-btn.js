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
    resourceId: String,
    resourceType: String,
    status: String,
    resourceName: String,
    pageEntry:String,
    proUserInfo:{
      type: Object,
      value: null,
      observer: function (newVal, oldVal) {
        this.setData({
          userInfo:newVal
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    followImg: 'follow-bebebe',  // follow-bebebe
    userInfo:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    followTap(){
      if (this.data.userInfo){
        if(this.data.proIsFollow){
          this.cancelFollow();
        }else{
          this.addFollow();
        }
      }else{  //未授权
        this.triggerEvent('myevent', { canIUse: true})
      }
    },
    addFollow(){
      let data = {
        userID: this.data.userInfo.id,
        resourceID: this.data.resourceId,
        brandID: this.data.resourceId,
        resourceType: this.data.resourceType,
        status: this.data.status,
        resourceName: this.data.resourceName
      }
      this.data.pageEntry == 'brand' && (data.brandID = this.data.resourceId)
      app.requestWithToken({
        url: 'follow',
        method: 'post',
        data: data,
        success: (res) => {
          if (res.code === 0) {
            this.setData({
              proIsFollow: true
            })
          }
        }
      })
    },
    cancelFollow(){
      app.requestWithToken({
        url: `follow/${this.data.resourceId}`,
        method: 'put',
        success: (res) => {
          if (res.code === 0) {
            this.setData({
              proIsFollow: false
            })
          }
        }
      })
    }
  }
})
