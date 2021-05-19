// pages/events/team_info/team_info.js
Page({
  data: {
    teaminfo:[],
    title: 'Teamup队招募：财务分析人员',
    tags: ['图像识别','挑战杯','软件学院'],
    bg_image: "../../../images/cover.jpg",
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