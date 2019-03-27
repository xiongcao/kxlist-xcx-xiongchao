let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proType: {
    type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {
        this.setData({
          type:newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type:''
  },
  lifetimes:{
    // created(){
    //   console.log('proType: ', this.proType);
    // }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(e) {
      if (e.detail.userInfo) { //允许授权
        //获取用户信息
        app.getUserInfo((userInfo) => {
          // let canIUse = this.data.type == 'user' ? true : false;
          let canIUse = false;
          this.triggerEvent('myevent', { canIUse,userInfo })
        });
      } else {  //拒绝授权
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          success: (res) => {
            if (res.cancel) {   //取消授权：则关闭授权页面  返回授权：可继续授权操作
              this.triggerEvent('myevent', { canIUse: false, userInfo:null })
            }
          }
        })
      }
    }
  }
})
