let DB=wx.cloud.database()
let openid=""
const app = getApp();
Page({
  data: {
    title: null,
    nav: [
      {color:'#ad1010', title:'工科'},
      {color:'#1979d3', title:'理科'},
      {color:'#e9ad09', title:'商科'},
      {color:'#f71239', title:'文体'},
      {color:'#ff7f1c', title:'综合'}],
    // 当前列表选中
    itemCur: 0,
    //当前轮播图的id
    cardCur: 0,
    //轮播图数据
    swiperList:[],
    //用于触底加载更多
    end:10,
    //存储赛事列表
    competitionList:[],
    // 滚动条位置
    scrollTop: 0,
    states:[],
    state:app.globalData.state,
    statecolor:app.globalData.statecolor,
    isLoadMore: false,
  },


  onLoad(options) {
    var that=this
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var Client = wx.getMenuButtonBoundingClientRect();
        var height = res.windowHeight - (res.statusBarHeight + Client.height + (Client.top - res.statusBarHeight) * 2)
        that.setData({
          clientHeight: res.windowHeight,
          height_scroll: height - 600 / 750 * wx.getSystemInfoSync().windowWidth,
        });
      }
    });
    console.log(that.data.height_sys);
    wx.cloud.callFunction({//获取用户openID
      name:"Gusermess",
      success(res){
        //console.log(res)//变量过多会导致功能缺陷？
        openid=res.result.openid;//将openid存入缓存
        wx.setStorageSync('openid',openid)
          wx.cloud.callFunction({//判断用户是否存在users中
            name:"IfopenID",
            data:{
              Iopenid:openid//Iopenid为参数
            },
            success(res){
              // console.log(res)
              if(res.result.data.length==0){//用户不存在
                wx.setStorageSync('NeedUseGetuserprofile', 1)
                wx.setStorageSync('use', true)
              }else{
                console.log(res.result.data)
                wx.setStorageSync('useravatarurl', res.result.data[0].avatarUrl)
                wx.setStorageSync('username', res.result.data[0].nickname)
                wx.setStorageSync('NeedUseGetuserprofile', 0)
                wx.setStorageSync('use', false)
              }
            }
          })
      }
    })
    //初始化swiperList
    var that=this
    DB.collection("swiperList").get({
      success(res){
        that.setData({//此处用setData让数据从逻辑层传到渲染层，实现动态渲染
          swiperList:res.data
        })
      }
    })
    //初始itemCur值为0
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        a:that.data.itemCur,
      },
      success(res){
        console.log(res)
        that.setData({
          competitionList:res.result.data.slice(0,that.data.end)
        })
        that.creatstates()
        console.log(that.data.competitionList)
      },
    })
  },

  // cardSwiper
  cardSwiper(e) {
    // 更新当前item的id
    this.setData({
      cardCur: e.detail.current,
    })
  },

  // 点击五个分类中的一个
  tabClick(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        a:index,
      },
      success(res){
        console.log(res)
        that.setData({
          competitionList:res.result.data.slice(0,that.data.end)
        })
        that.creatstates()
        console.log(that.data.competitionList)
      },
    })
    that.setData({
      itemCur: index,
      scrollTop: 0,
    })
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

  // tab页面跳转
  pageChange(e){
    var page_name = e.currentTarget.dataset.cur;
    // console.log(page_name);
    if(page_name != "index") 
    {
      wx.redirectTo({
        url: '../../'+page_name+'/home/home',
      })
    }
  },

  //触底加载更多
  reachBottom(){
    var that=this
    this.data.end+=10
    this.setData({
      isHideLoadMore: true
    })
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        a:that.data.itemCur
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
  }
})