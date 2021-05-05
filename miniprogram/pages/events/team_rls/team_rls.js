// pages/team_rls/team_rls.js
var schoolcomp=wx.getStorageSync("schoolcomp")
var util = require('../../../utils/util.js');
let standard=1
Page({
  data: {
    isShowModel: null,  // 是否弹出标签输入框
    inputValue: "",  // 标签输入框的值
    //发布时需获取的值
    class:0,
    id:0,
    compname:"",
    icon:"",
    name:"",
    college: '',  // 所在学校及院系(可以是该用户填的university+college)
    teamname:"",  
    contact: '',  // 联系方式
    startday: '',
    endday:"",
    contentCount: 0,
    content: "",
    tags: [], // 标签列表
    images:[],  // 上传的图片列表
  },


  //获取赛事名
  getcompname(){
    this.data.compname=wx.getStorageSync('compname')
  },


  // 获取输入文本框的字数
  getContentInput(e){
    const value = e.detail.value;
    this.data.content = value;
    var len = parseInt(value.length);
    this.setData({
      contentCount: len
    })
  },


  // 选择图片
  chooseImage(e) {
    if(this.data.images.length >= 6) {
      wx.showToast({
        title: '上传图片数量已达上限！',
        icon: 'none',
        duration: 2000,
      })
    } else {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可选择原图或压缩
        sourceType: ['album','camera'], // 开放相册/相机
        success: res => {
          const tempFilePaths = res.tempFilePaths
          //console.log(tempFilePaths)
          const images = this.data.images.concat(tempFilePaths)
          this.setData({
            images: images.length <=6 ? images : images.slice(0, 6)
          })
        }
      })
    }
   // console.log(this.data.images)
  },


  // 预览图片
  previewImage(e){
    const idx = e.target.dataset.idx;
    const images = this.data.images;
    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },


  // 长按删除图片
  deleteImage: function (e) {//删除图片
    var that = this;
    var images = that.data.images;
    const index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定');
          images.splice(index, 1);//通过splice方法删除当前元素
          that.setData({
            images: images,
          });
        } 
        else if (res.cancel) {
          console.log('点击取消');
          return false;
        }
      }
    })
  },


  addTag(e) {
    this.setData({
      modalName: 'DialogModal2',
    })
  },


  hideModal(e) {
    this.setData({
      inputValue: "",
      modalName: null
    })
  },


  getteamname(e){
    this.setData({
      teamname:e.detail.value
    })
  },


  getname(e){
    this.setData({
      name:e.detail.value
    })
  },


  getcollege(e){
    this.setData({
      college:e.detail.value
    })
  },


  getcontact(e){
    this.setData({
      contact:e.detail.value
    })
  },


  getchange(e){
    this.setData({
      endday:e.detail.value
    })
  },


  formSubmit(e) {
    let that = this;
    let tags = that.data.tags;
    let tag = e.detail.value.tag;
    if(tags.length>=5) {
      wx.showToast({
        title: '最多只能添加5个标签！',
        icon: 'none',
      })
      that.hideModal();
    } else if(tag.length>=10) {
      wx.showToast({
        title: '最多只能输入10个字符！',
        icon: 'none',
      })
    } else if(tag.length==0) {
      wx.showToast({
        title: '标签不能为空！',
        icon: 'none',
      })
    } else {
      tags.push(tag);
      that.setData({
        tags: tags,
      })
      that.hideModal();
    }
  },


  deletetag(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该标签吗？',
      success (res) {
        if (res.confirm) {
          let idx = e.currentTarget.dataset.idx;
          let tags = that.data.tags;
          if(idx>=0) {
            tags.splice(idx,1);
            that.setData({
              tags: tags
            })
          }
        }
      }
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
    //为日期赋值 
    var date = util.formatDate(new Date());// 调用函数时，传入new Date()参数，返回值是日期和时间
    this.setData({// 再通过setData更改Page()里面的data，动态更新页面的数据
      endday: date
    })
    //获取发布者个人信息,为icon，name，college，class，id赋值
    const openid=wx.getStorageSync("openid");
    const classvalue=wx.getStorageSync("class");
    const idvalue=wx.getStorageSync("id");
    let userinfo=Promise.resolve(wx.cloud.database().collection("users").where({useropenid:openid}).get())
    userinfo.then(res=>{
      that.setData({
        icon:res.data[0].avatarUrl,
        name:res.data[0].name,
        college:res.data[0].college+res.data[0].major, 
        class:classvalue,
        id:idvalue
      })
    })
  },


  getstandard(){
    if(this.data.content==""||this.data.teamname==""||this.data.name==""||this.data.college==""||this.data.contact==""){
      standard=0
    }else{
      standard=1  
    }
  },


  formsubmit(){
    var that=this
    that.getcompname()
    that.getstandard()
    console.log(schoolcomp)
    if(standard==1){//信息填写完整
      //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //console.log("当前时间戳为：" + timestamp); 
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //转换为时间格式字符串  
    // console.log(date.toLocaleDateString());
    that.setData({
      startday:date.toLocaleDateString()
    })
    if(schoolcomp!=0){
      console.log(1)
      wx.cloud.database().collection("comp_team_rls").add({
        data:{
          schoolcomp:schoolcomp,
          compname:that.data.compname,
          class:that.data.class,
          id:that.data.id,
          icon:that.data.icon,
          name:that.data.name,
          college: that.data.college,  // 所在学校及院系(可以是该用户填的university+college)
          teamname:that.data.teamname,  
          contact: that.data.contact,  // 联系方式
          startday: that.data.startday,
          endday:that.data.endday,
          contentCount: that.data.contentCount,
          content: that.data.content,
          tags: that.data.tags,
          images:that.data.images
        }
      })
    }else{
      console.log(2)
      wx.cloud.database().collection("comp_team_rls").add({
        data:{
          compname:that.data.compname,
          class:that.data.class,
          id:that.data.id,
          icon:that.data.icon,
          name:that.data.name,
          college: that.data.college,  
          teamname:that.data.teamname,  
          contact: that.data.contact,  
          startday: that.data.startday,
          endday:that.data.endday,
          contentCount: that.data.contentCount,
          content: that.data.content,
          tags: that.data.tags,
          images:that.data.images
        }
      })
      }
      
      wx.navigateBack({
        delta: 0,
      })
    }else{
      wx.showToast({
        title: '请将信息补充完整',
        icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
        duration: 2000     
      })  
    }
  },
})