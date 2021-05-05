// pages/my/follow/follow.js
const app = getApp();
Page({
  data: {
    competitionList:[],
    states:[],
    state:app.globalData.state,
    statecolor:app.globalData.statecolor
  },


  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },


  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },


  // ListTouch计算滚动
  ListTouchEnd(e) {
    console.log(e.currentTarget.dataset.target)
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },


  // 删除
  delete(e) {
    var that=this
    const openid=wx.getStorageSync("openid");
    let list = that.data.competitionList;
    let idx = e.currentTarget.dataset.idx;//找到所删除的比赛在列表中的索引
    var whichcomp=that.data.competitionList[idx]
    if(idx>=0) {
      list.splice(idx,1);
    }
    that.setData({
      competitionList: list
    })
    wx.cloud.database().collection("followcomp").where({
      _openid:openid,
      class:whichcomp.class,
      id:whichcomp.id
    }).remove()
    wx.cloud.database().collection("userlike").where({
      _openid:openid,
      class:whichcomp.class,
      id:whichcomp.id
    }).update({
      data:{
        islike:0
      }
    })
  },


  onLoad: function (options) {
    var that=this
    const openid=wx.getStorageSync("openid");
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        follow:1,
        openid:openid
      },
      success(res){
        that.setData({
          competitionList:res.result.data.reverse()
        })
        that.creatstates()
      }
    })
  },


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
})