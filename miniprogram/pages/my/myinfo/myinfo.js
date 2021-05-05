// pages/myinfo/myinfo.js
Page({
  data: {
    genderList:["请选择","男","女"],
    gradeList:["请选择","大一","大二","大三","大四","研一","研二","研三"],
    useropenid:"",
    avatarUrl:"",
    nickname:"",
    name:"",
    gender:0,
    phonenum:"",
    email:"",
    school:"",
    college:"",
    major:"",
    grade:0,
    disabled: true  // 保存按钮是否禁用，有修改才启用
  },


  //获取姓名
  getname(e){
    this.setData({
      name:e.detail.value,
      disabled:false
    })
  },


  //获取手机号
  getphonenum(e){
    this.setData({
      phonenum:e.detail.value,
      disabled: false
    })
  },


   //获取邮箱
   getemail(e){
    this.setData({
      email:e.detail.value,
      disabled: false
    })
  },


  //获取学校
  getschool(e){
    this.setData({
      school:e.detail.value,
      disabled: false
    })
  },


  //获取院系
  getcollege(e){
    this.setData({
      college:e.detail.value,
      disabled: false
    })
  },


  //获取专业
  getmajor(e){
    this.setData({
      major:e.detail.value,
      disabled: false
    })
  },


  // 性别选择
  genderChange(e) {
    // console.log(e);
    let g = this.data.gender;
    if(g != e.detail.value) {
      this.setData({
        disabled: false,
        gender: e.detail.value
      })
    }
  },
  

  // 年级选择
  gradeChange(e) {
    // console.log(e);
    let g = this.data.grade;
    if(g != e.detail.value) {
      this.setData({
        disabled: false,
        grade: e.detail.value
      })
    }
  },

  // 表单提交
  submitform() {
    var that=this
    const stropenid=wx.getStorageSync("openid")
    wx.cloud.database().collection("users").where({_openid:stropenid}).update({
      data:{
        useropenid:stropenid,
        avatarUrl:that.data.avatarUrl,
        nickname:that.data.nickname,
        name:that.data.name,
        gender:that.data.gender,
        phonenum:that.data.phonenum,
        email:that.data.email,
        school:that.data.school,
        college:that.data.college,
        major:that.data.major,
        grade:that.data.grade,
      }
    })
    that.setData({//每次提交后将按钮置灰
      disabled:true
    })
  },


  back(){
    wx.navigateBack({
      delta:1
    })
  },


  onLoad: function (options) {
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
  },


  onShow: function () {
    var that=this;
    const openid=wx.getStorageSync("openid");
    let user=Promise.resolve(wx.cloud.database().collection("users").where({useropenid:openid}).get())
    user.then(res=>{
    that.setData({
      avatarUrl:res.data[0].avatarUrl,
      nickname:res.data[0].nickname,
      name:res.data[0].name,
      gender:res.data[0].gender,
      phonenum:res.data[0].phonenum,
      email:res.data[0].email,
      school:res.data[0].school,
      college:res.data[0].college,
      major:res.data[0].major,
      grade:res.data[0].grade,
    })
    console.log(res.data[0])
  })
  },
})