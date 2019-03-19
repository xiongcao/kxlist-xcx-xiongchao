let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proName: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    proDate: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { 
      } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    proImage:String,
    proId:String,
    proType:String,
    proStatus:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    ossPath: app.globalData.ossPath
  },

  /**
   * 组件的方法列表
   */
  methods: {
 
  }
})
