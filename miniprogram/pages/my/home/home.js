// pages/me/me.js
let hover="button-hover"
Page({
  data: {
    openid:wx.getStorageSync('openid'),
    pageTopHeight: wx.getSystemInfoSync().statusBarHeight+30+7,
    useravatar:"../../../images/icon.png",
    type:0,//用于记录用户是否已经授权，已授权则禁用授权键的功能。0为未授权
    username:"点击授权",
    use:true
  },

  getUserProfile(e) {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    console.log(that.data.use)
    if(that.data.use){
      wx.getUserProfile({
        desc: '获取头像及昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)//res.userInfo.avatarUrl
          that.setData({
            username:res.userInfo.nickName,
          })
          wx.setStorageSync('useravatarurl', res.userInfo.avatarUrl)
          wx.setStorageSync('username', res.userInfo.nickName)
          wx.setStorageSync('NeedUseGetuserprofile', 0)
          wx.setStorageSync('use', false)
          wx.getImageInfo({
            src:res.userInfo.avatarUrl,
            success (res) {//res.path
              wx.cloud.uploadFile({
                cloudPath:"img/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),
                filePath:res.path,
                success:res=>{
                  console.log(res.fileID)
                  that.setData({
                    useravatar:res.fileID,
                  })
                  wx.cloud.database().collection("users").add({
                    data:{
                      useropenid:that.data.openid,
                      avatarUrl:that.data.useravatar,
                      nickname:that.data.username,
                      name:"",
                      gender:0,
                      phonenum:"",
                      email:"",
                      school:"",
                      college:"",
                      major:"",
                      grade:0,
                    }
                  })
                },
                fail:console.error
              })
            }
          })
          this.setData({
            hover:"none",
          })
          wx.showModal({
                       openid:"提示",
                       content: "是否立刻前往完善学校、学院、专业等信息",
                       success: function(res){
                         if (res.confirm) {//点击确定后跳转至信息完善界面
                            wx.redirectTo({
                               url: '../../my/myinfo/myinfo',
                            })
                         } else if (res.cancel) {//点击取消后跳转至首页
                         }
                       }
                  })
        }
      })
    }
  },

  // tab页面跳转
  pageChange(e){
    var page_name = e.currentTarget.dataset.cur;
    // console.log(page_name);
    if(page_name != "my") 
    {
      wx.redirectTo({
        url: '../../'+page_name+'/home/home',
      })
    }
  },

  onLoad: function (options) {
    var that=this
    wx.cloud.callFunction({//判断用户是否存在users中，存在则正常使用，不存在则跳转
      name:"IfopenID",
      data:{
        Iopenid:that.data.openid//Iopenid为参数
      },
      success(res){
        // console.log(res)
        if(res.result.data.length==0){//用户不存在         
        }else{//用户存在
          that.setData({
            useravatar:wx.getStorageSync('useravatarurl'),
            username:wx.getStorageSync('username'),
            hover:"none",
          })
        }
      }
    })
  },
})