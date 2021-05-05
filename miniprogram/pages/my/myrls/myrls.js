// pages/my/myrls/myrls.js
const app = getApp();
let openid=wx.getStorageSync("openid");
Page({
  data: {
    cur: 0,
    teamList:[],
    compList:[]
  },


  click(e) {
    //console.log(parseInt(e.currentTarget.dataset.idx))
    this.setData({
      cur: parseInt(e.currentTarget.dataset.idx),
    })
  },


  bindChange: function(e) {
    this.setData({
      cur: e.detail.current
    });
  },


  onLoad: function (options) {
    var that = this;
    const useropenid=wx.getStorageSync("openid");
    wx.getSystemInfo({
      success: function(res) {
        var Client = wx.getMenuButtonBoundingClientRect();
        var height = res.windowHeight - (res.statusBarHeight + Client.height + (Client.top - res.statusBarHeight) * 2)
        that.setData({
          clientHeight: res.windowHeight,
          height_sys: height - 64,
        });
      }
    });
    wx.cloud.callFunction({
      name:"Gteamlist",
      data:{
        type:1,
        openid:useropenid
      },
      success(res){
        that.setData({
          teamList:res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name:"Getcompinfo",
      data:{
        myrls:1,
        openid:openid
      },
      success(res){
        //console.log(res)
        that.setData({
          compList:res.result.data
        })
      }
    })
  },
})