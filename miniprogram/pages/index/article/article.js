// pages/index/article/article.js
Page({
  data: {
    mess:[],
    isTitleImage: 0
  },


  onLoad: function (options) {
    var that=this
    wx.cloud.database().collection("article").get({
      success(res){
        that.setData({
          mess:res.data[0]
        })
        //console.log(that.data.mess)
      }
    })
  },
})