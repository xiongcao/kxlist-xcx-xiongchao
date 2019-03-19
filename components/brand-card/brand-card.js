let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proBrand: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
      }
    }
    
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