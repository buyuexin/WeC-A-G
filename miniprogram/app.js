//app.js
App({
  onLaunch: function() {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
  },
  globalData: {
    levelList:[
      {status: "line-gray",name: "院级",},
      {status: "line-gray",name: "校级",},
      {status: "line-gray",name: "市级",},
      {status: "line-gray",name: "省级",},
      {status: "line-gray",name: "国家级",},
      {status: "line-gray",name: "国际级",},
    ],
    collegeList:[
      {status: "line-gray",name: "校方",},
      {status: "line-gray",name: "地理科学学院",},
      {status: "line-gray",name: "计算机学院",},
      {status: "line-gray",name: "教育科学学院",},
      {status: "line-gray",name: "教育信息技术学院",},
      {status: "line-gray",name: "历史文化学院",},
      {status: "line-gray",name: "马克思主义学院",},
      {status: "line-gray",name: "美术学院",},
      {status: "line-gray",name: "生命科学学院",},
      {status: "line-gray",name: "数学科学学院",},
      {status: "line-gray",name: "外国语言文化学院",},
      {status: "line-gray",name: "心理学院",},
      {status: "line-gray",name: "哲学与社会发展学院",},
      {status: "line-gray",name: "法学院",},
      {status: "line-gray",name: "化学学院",},
      {status: "line-gray",name: "环境学院",},
      {status: "line-gray",name: "经济与管理学院",},
      {status: "line-gray",name: "旅游管理学院",},
      {status: "line-gray",name: "体育科学学院",},
      {status: "line-gray",name: "文学院",},
      {status: "line-gray",name: "物理与电信工程学院",},
      {status: "line-gray",name: "信息光电子科技学院",},
      {status: "line-gray",name: "音乐学院",},
      {status: "line-gray",name: "政治与公共管理学院",},
      {status: "line-gray",name: "城市文化学院",},
      {status: "line-gray",name: "国际商学院",},
      {status: "line-gray",name: "软件学院",},
      {status: "line-gray",name: "职业教育学院",},
      ],
    typeList:['个人赛','团队赛'],
    state:['即将报名','正在报名','即将进行','正在进行','报名结束'],
    statecolor:['green','green','yellow','yellow','gray']
    // teamlist:[//用于展示招募页面时进行追加
    //   {icon:"../../images/icon.png",
    //   name:"我是开发者",
    //   startday:"2020/1/1",
    //   teamname:"冰琳霖杰",
    //   content:"未有人发起招募"}
    // ]
  }
})