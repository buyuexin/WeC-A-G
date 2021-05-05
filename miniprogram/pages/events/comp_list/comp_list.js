let DB=wx.cloud.database()
const app = getApp();
Page({
  data: {
    type: 0,  // 有两种形式，0或1，赛氪上的列表用0，自己创建的赛事列表用1
    title:"",
    end:10,//用于实现触底加载更多
    competitionList:[],//赛事列表
    compListnum:0,//某类赛事列表名代号
    isLoadMore: false,
    states:[],
    state:app.globalData.state,
    statecolor:app.globalData.statecolor
  },


  onLoad: function (options) {
    var that=this
    if(options.title==0){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          a:options.title
        },
        success(res){
          that.setData({
            compListnum:0,
            competitionList:res.result.data.slice(0,that.data.end),
            title:"工科"
          })
          that.creatstates()
        }
      })
    }else if(options.title==1){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          a:options.title
        },
        success(res){
          that.setData({
            compListnum:1,
            competitionList:res.result.data.slice(0,that.data.end),
            title:"理科"
          })
          that.creatstates()
        }
      })
    }else if(options.title==2){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          a:options.title
        },
        success(res){
          console.log(1)
          that.setData({
            compListnum:2,
            competitionList:res.result.data.slice(0,that.data.end),
            title:"商科"
          })
          console.log(that.data.state)
          that.creatstates()
        }
      })
    }else if(options.title==3){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          a:options.title
        },
        success(res){
          that.setData({
            compListnum:3,
            competitionList:res.result.data.slice(0,that.data.end),
            title:"文体"
          })
          that.creatstates()
        }
      })
    }else if(options.title==4){
      wx.cloud.callFunction({
        name:"Bcomplist",
        data:{
          a:options.title
        },
        success(res){
          that.setData({
            compListnum:4,
            competitionList:res.result.data.slice(0,that.data.end),
            title:"综合"
          })
          that.creatstates()
        }
      })
    }
  },


  //初始化states函数功能封装
  creatstates(){
    var that=this
    //初始化states
    var state=""
    var statecolor=""
    console.log(that.data.competitionList)
    var newcompetitionList=that.data.competitionList
    var timestamp = Date.parse(new Date());//获取当前时间戳
    var regStarttimestamp=0
    var regEndtimestamp=0
    var compStarttimestamp=0
    var compEndtimestamp=0
    for(var index in newcompetitionList){
      regStarttimestamp=new Date(newcompetitionList[index].regStart).getTime();//将报名开始时间转为时间戳
      regEndtimestamp=new Date(newcompetitionList[index].regEnd).getTime()+86486399;//报名结束时间当天的23:59:59
      compStarttimestamp=new Date(newcompetitionList[index].compStart).getTime();//将比赛开始时间转为时间戳
      compEndtimestamp=new Date(newcompetitionList[index].compEnd).getTime()+86486399;//比赛结束时间当天的23:59:59
      if(timestamp<=regStarttimestamp){
        state=0,
        statecolor=0,
        that.data.states.push(
          {
            state:state,
            statecolor:statecolor
          }
        )
    }else if(regStarttimestamp<=timestamp&&timestamp<=regEndtimestamp){
        state=1,
        statecolor=1
        that.data.states.push(
          {
            state:state,
            statecolor:statecolor
          }
        )
    }else if(regEndtimestamp<=timestamp&&timestamp<=compStarttimestamp){
        state=2,
        statecolor=2
        that.data.states.push(
          {
            state:state,
            statecolor:statecolor
          }
        )
    }else if(compStarttimestamp<=timestamp&&timestamp<=compEndtimestamp){
      state=3,
      statecolor=3
      that.data.states.push(
        {
          state:state,
          statecolor:statecolor
        }
      )
    }else{
        state=4,
        statecolor=4
        that.data.states.push(
          {
            state:state,
            statecolor:statecolor
          }
        )
    }
    }
    //不知道哪来的bug，for循环了两次
    console.log(that.data.states.slice(0,newcompetitionList.length))
    that.setData({
      states:that.data.states.slice(0,newcompetitionList.length)
    })
  },

  
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that=this
    this.data.end+=10
    this.setData({
      isHideLoadMore: true
    })
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        a:that.data.compListnum
      },
      success(res){
        if(that.data.end>res.result.data.length){
          wx.showToast({ title: '到底了哟~', })
        }else{
          that.setData({
            competitionList:res.result.data.slice(0,that.data.end),
          })
          that.creatstates()
        }
      }
    })
    
  },
})