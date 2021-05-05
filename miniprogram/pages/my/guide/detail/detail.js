// pages/my/guide/detail/detail.js
Page({
  data: {
    mess: {},
  },


  onLoad: function (options) {
    var that = this
    wx.cloud.database().collection("guide").get({
      success(res){
        that.setData({
          mess: res.data[0]
        })
        console.log(that.data.mess)
      }
    })
  },
})