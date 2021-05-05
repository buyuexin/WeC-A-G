const app = getApp();
let classvalue=0;
let idvalue=0;
let schoolcomp=""//用于唯一标识某个校内赛事
let openid=""

Page({


  data:{
    CustomBar: app.globalData.CustomBar,
    islike: 0,
    cur: 0, 
    teamList:[],
    complist:[],
    title:"赛事详情",
  },


  //点击“招募消息”
  clickrls(e) {
    this.setData({
      cur: parseInt(e.currentTarget.dataset.idx),
    })
    this.upteamlist()
  },


  //更新“招募消息”列表
  upteamlist(){
    var that=this
    if(schoolcomp!=0){
      wx.cloud.callFunction({
        name:"Gteamlist",
        data:{
          type:2,
          schoolcomp:schoolcomp
        },
        success(res){
          console.log(res)
          var changeteamList=res.result.data
          if(changeteamList.length>1){changeteamList.splice(0,1)}
          that.setData({
            teamList:changeteamList,
          })
        }
      })
    }else{
      wx.cloud.callFunction({
        name:"Gteamlist",
        data:{
          type:0,
          class:classvalue,
          id:idvalue
        },
        success(res){
          var changeteamList=res.result.data.reverse()
          that.setData({
            teamList:changeteamList,
          })
        }
      })
    }
  },


  //点击“比赛详情”
  clickinfo(e){
    this.setData({
         cur: parseInt(e.currentTarget.dataset.idx),
       })
  },


  bindChange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      cur: e.detail.current
    });
  },


  //跳转至赛事发布界面
  toTeamrls(e) {
    wx.navigateTo({
      url: '../events/team_rls/team_rls',
    })
  },


  //关注
  collect: function(e) {
    var that=this
    let like = 1-that.data.islike;//记录点击关注键后的关注状态
    that.setData({
      islike: like
    })
    if(that.data.islike==1)//为关注状态
    {
      if(schoolcomp!=0){//所关注的赛事为校内赛事
        wx.cloud.database().collection("followcomp").add({//添加收藏
          data:{
            //默认存入用户的openid到_openid
            schoolcomp:schoolcomp,
            compname:that.data.complist.compname,
            regStart:that.data.complist.regStart,
            regEnd:that.data.complist.regEnd,
            compStart:that.data.complist.compStart,
            compEnd:that.data.complist.compEnd,
            image:that.data.complist.images[0]
          }
        })
      }else{//所关注的赛事为普通赛事
          wx.cloud.database().collection("followcomp").add({//添加收藏
            data:{
              class:classvalue,
              id:idvalue,
              compname:that.data.complist.name,
              regTime:that.data.complist.regTime,
              compTime:that.data.complist.compTime,
              regStart:that.data.complist.regStart,
              regEnd:that.data.complist.regEnd,
              compStart:that.data.complist.compStart,
              compEnd:that.data.complist.compEnd,
              image:that.data.complist.image
            }
          })
      }
    }else{//为非关注状态
      if(schoolcomp!=0){
        wx.cloud.database().collection("followcomp").where({//删除收藏
          schoolcomp:schoolcomp,
          _openid:openid
        }).remove()
      }else{
        wx.cloud.database().collection("followcomp").where({
          class:classvalue,
          id:idvalue,
          _openid:openid
        }).remove()
      }
    }
    //将关注键状态改变在userlike内进行记录进行记录
    if(schoolcomp!=0){
      wx.cloud.database().collection("userlike").where({
        _openid:openid,
        id:schoolcomp
      }).update({
        data:{
          islike:that.data.islike
        }
      })
    }else{
      wx.cloud.database().collection("userlike").where({
        _openid:openid,
        class:classvalue,
        id:idvalue
      }).update({
        data:{
          islike:that.data.islike
        }
      })
    }
  },


  onLoad: function (options) {
    var that = this;
    classvalue=parseInt(options.class)
    idvalue=parseInt(options.id)
    schoolcomp=options.schoolcomp
    wx.setStorageSync('class',classvalue)
    wx.setStorageSync('id',idvalue)
    wx.setStorageSync('schoolcomp',schoolcomp)
    openid=wx.getStorageSync("openid");
    wx.getSystemInfo({
      success: function(res) {
        var Client = wx.getMenuButtonBoundingClientRect();
        var height = res.windowHeight - (res.statusBarHeight + Client.height + (Client.top - res.statusBarHeight) * 2)
        that.setData({
          clientHeight: res.windowHeight,
          height_sys: height -44,
        });
      }
    });
    // console.log(that.data.height_sys)
    that.getcompinfo()
  },


  //获取比赛详情
  getcompinfo(){
    var that=this
    if(schoolcomp!=0){
      // console.log(1)
      wx.cloud.callFunction({//获取校内赛事具体信息
        name:"Getcompinfo",
        data:{
          id:schoolcomp
        },
        success(res){
          //console.log(res)
          var comp=res.result.data[0]
          if(comp.type==0){comp.type="个人赛"}else{comp.type="团体赛"}
          if(comp.level==0){comp.level="院级"}else if(comp.level==1){comp.level="校级"}else if(comp.level==2){comp.level="市级"}else if(comp.level==3){comp.level="省级"}else if(comp.level==4){comp.level="国家级"}else if(comp.level==5){comp.level="国际级"}
          that.setData({
            complist:res.result.data[0]
          })
          //将比赛名存入缓存
          wx.setStorageSync('compname', comp.compname)
        }
      })
    }else{//获取普通赛事具体信息
      wx.cloud.callFunction({
        name:"Getcompinfo",
        data:{
          class:classvalue,
          id:idvalue
        },
        success(res){
          //console.log(res)
          that.setData({
            complist:res.result.data[0]
          })
          //将比赛名存入缓存
          wx.setStorageSync('compname', res.result.data[0].name)   
        }
      })
    }
  },


  //获取用户对赛事的关注信息
  getuserlike(){
    var that=this
    if(schoolcomp!=0){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          like:2,
          schoolcomp:schoolcomp,
          openid:openid
        },
        success(res){//判断用户是否点开过此赛事
          if(res.result.data.length==0){//否
            wx.cloud.database().collection("userlike").add({//添加用户对此赛事的关注信息到userlike集合
              data:{
                id:schoolcomp,
                islike:0
              }
            })
            that.setData({
              islike:0
            })
          }else{//是
            that.setData({
              islike:res.result.data[0].islike//更新islike的值
            })
          }
        }
      })
    }else{
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        like:1,
        openid:openid,
        class:classvalue,
        id:idvalue
      },
      success(res){
        if(res.result.data.length==0){
          wx.cloud.database().collection("userlike").add({
            data:{
              class:classvalue,
              id:idvalue,
              islike:0
            }
          })
        }else{
          that.setData({
            islike:res.result.data[0].islike
          })
        }
      }
    })
    }
  },


  onShow:function(){
   this.upteamlist()
   this.getuserlike()
  }
})