// pages/events/team_info/team_info.js
Page({
  data: {
    teaminfo:[]
  },


  onLoad: function (options) {
    var that=this
    wx.cloud.callFunction({
      name:"Getteaminfo",
      data:{
        id:options.id
      },
      success(res){
        that.setData({
          teaminfo:res.result.data[0]
        })
      }
    })
  },
}) 