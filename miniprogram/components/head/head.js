// components/head/head.js
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
    pageTopHeight: wx.getSystemInfoSync().statusBarHeight + 30 + 7 + 4,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    customMethods(){
      console.log("Hello World!");
    }

  }
})
