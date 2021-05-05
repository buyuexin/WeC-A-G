const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    levelList: app.globalData.levelList,
    collegeList: app.globalData.collegeList,
    screenShow:"none",  // 筛选框显示
    competitionList:[],
    keyword:[],  // 选中的关键词
    states:[],
    state:app.globalData.state,
    statecolor:app.globalData.statecolor
  },


  navigate(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../comp_info/comp_info?schoolcomp='+id,
    })
  },


  // 搜索
  searchItem(e) {
    let key = e.detail.value.toLowerCase();//获取输入框内的值
    let list = this.data.competitionList;//获取当前的列表数据
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].compname.toLowerCase();
      if (b.search(a) != -1) {//在b中搜索有无a字段。
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      competitionList: list
    })
  },


  // 筛选列表替换
  screenChange(e) {
    var cur = e.currentTarget.dataset.cur;
    var screenShow = this.data.screenShow;
    if(screenShow != cur) {
      screenShow = cur;
    } else {
      screenShow = "none";
    }
    this.setData({
      screenShow: screenShow,
    })
  },


  // 点击筛选中的item
  screenClick(e) {
    let listname = e.currentTarget.dataset.type;
    let list;
    if(listname == "levelList") {//判断用户正在使用哪个筛选框
      list = this.data.levelList;
    } else {
      list = this.data.collegeList;
    }
    let index = e.currentTarget.dataset.idx;
    let status = list[index].status;//选中项的status
    let name = list[index].name;//选中项的name
    let word = this.data.keyword;
    if(status == 'line-gray') {//选中前为灰色，则点击后置为橘色
      status = 'line-orange';
      word.push(name);//将name推到word中
    } else {//选中前为橘色，则点击后置为灰色
      status = 'line-gray';
      let i = word.indexOf(name);
      if(i>-1) {
        word.splice(i, 1);
      }
    }
    var key = listname+"["+index+"].status";
    var param={};
    param[key]=status;
    this.setData(param);//更新状态
    this.setData({//更新word
      keyword: word,
    })
  },


   //确定 用大数据去匹配标准，而不是用标准去大数据内搜索满足标准的数据
  confirm(e){
    let that=this;
    let word = that.data.keyword;
    let list = that.data.competitionList;
    console.log(word);
    if(word.length != 0) {
      for(let i = 0; i < list.length; i++) {
        let a = that.data.levelList[list[i].level].name;
        let b = that.data.collegeList[list[i].college].name;
        console.log('a = ',a,', b = ',b);
        if(word.indexOf(a)!=-1 || word.indexOf(b)!=-1) {
          list[i].isShow = true;
        } else {
          list[i].isShow = false;
        }
      }
      that.setData({
        competitionList: list
      })
    }
    that.setData({
      screenShow: 'none',
    })
  },


  // 重置
  reset(e) {
    //重置筛选栏
    let levelList = this.data.levelList;
    let collegeList = this.data.collegeList;
    let competitionList = this.data.competitionList;
    for(let i = 0; i < levelList.length; i++) {
        levelList[i].status = 'line-gray';
    }
    for(let i = 0; i < collegeList.length; i++) {
        collegeList[i].status = 'line-gray';
    }
    for(let i = 0; i < competitionList.length; i++) {
      competitionList[i].isShow = true;
    }
    this.setData({
      collegeList: collegeList,
      levelList: levelList,
      keyword: [],
    })
    //重置后重新获取全部数据
    this.getalllist()
    // console.log(this.data.states)
    this.setData({
      screenShow: 'none',
    })
  },


  // tab页面跳转
  pageChange(e){
    var page_name = e.currentTarget.dataset.cur;
    // console.log(page_name);
    if(page_name != "events") 
    {
      wx.redirectTo({
        url: '../../'+page_name+'/home/home',
      })
    }
  },


  //获取所有赛事信息并初始化states
  getalllist(){
    this.setData({
      states:[]
    })
    var that=this
    //获取所有赛事信息
    wx.cloud.callFunction({
      name:"Bcomplist",
      data:{
        school:1
      },
      success(res){
        that.setData({
          competitionList:res.result.data.reverse()
        })
        //初始化states
        var state=""
        var statecolor=""
        var newcompetitionList=res.result.data
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
          }else if(regEndtimestamp<=timestamp&&timestamp<=compStarttimestam){
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
      }
    })
  },


  onLoad: function () {
    var NeedUseGetuserproifle = wx.getStorageSync('NeedUseGetuserprofile')
    // console.log(NeedUseGetuserproifle)
    var that=this
    if(NeedUseGetuserproifle==0){
      console.log('可正常进入event/home页面')
    }else{
      wx.showModal({
           openid:"提示",
           content: "请先完成授权",
           success: function(res){
             if (res.confirm) {//点击确定后跳转至信息完善界面
                wx.redirectTo({
                   url: '../../my/home/home',
                })
             } else if (res.cancel) {
                 wx.redirectTo({
                   url: '../../index/home/home',
                })
             }
           }
      })
    }
    that.getalllist()
  },
})