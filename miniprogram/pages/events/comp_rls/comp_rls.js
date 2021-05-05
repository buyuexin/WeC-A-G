const app = getApp();
var util = require('../../../utils/util.js');
var schoolcomp=""
var standard=1//用于判断是否所有输入框都有输入（照片除外）及判断时间设置逻辑是否真确
const image=""
Page({
  data: {
    levelList: app.globalData.levelList,
    collegeList: app.globalData.collegeList,
    typeList: app.globalData.typeList,
    content:"",
    contentCount:0,
    images:[],
    compname:"",
    sponsor:"",
    college:0,
    level:0,
    type:0,
    today:"",
    regStart:"",
    regEnd:"",
    compStart:"",
    compEnd:"",
    isShow:true
  },


  // 获取输入文本框的内容及字数
  getContentInput(e){
    const value = e.detail.value;
    this.data.content = value;
    var len = parseInt(value.length);
    this.setData({
      contentCount: len
    })
  },


  //获取赛事名称
  getcompname(e){
    this.setData({
      compname:e.detail.value
    })
  },


  //获取主办方
  getsponsor(e){
    this.setData({
      sponsor:e.detail.value
    })
  },


  // 选择图片
  chooseImage(e) {
    var that=this
    if(that.data.images.length >= 6) {
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
          // console.log(tempFilePaths)
          wx.cloud.uploadFile({
            cloudPath:new Date().getTime()+'.png',
            filePath:tempFilePaths[0],
            success:res=>{
              // console.log(res)
              that.data.images=that.data.images.concat(res.fileID)
              // console.log(that.data.images)
              that.setData({
                images: that.data.images.length <=6 ? that.data.images : that.data.images.slice(0, 6)
              })
            },
            fail:console.error
          })
        }
      })
    }
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


  // 赛事级别选择
  levelChange(e) {
    // console.log(e)
    this.setData({
      level: parseInt(e.detail.value) 
    })
  },


  // 发布学院选择
  collegeChange(e) {
    this.setData({
      college:parseInt(e.detail.value) 
    })
  },


  // 赛事类型选择
  typeChange(e) {
    this.setData({
      type: e.detail.value
    })
  },


  // 时间选择
  DateChange(e) {
    console.log(e);
    let type = e.currentTarget.dataset.time;
    let time = e.detail.value;
    if(type == 'regStart') {
      this.setData({
        regStart: time
      })
    } else if(type == 'regEnd') {
      this.setData({
        regEnd: time
      })
    } else if(type == 'compStart') {
      this.setData({
        compStart: time
      })
    } else {
      this.setData({
        compEnd: time
      })
    }
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
    schoolcomp=wx.getStorageSync("schoolcomp")
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var date = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      today: date,
      regStart: date,
      regEnd: date,
      compStart: date,
      compEnd: date,
    });
  },


  //判断发布信息是否填写完整
  getstandard(){
    if(this.data.content==""||this.data.compname==""||this.data.sponsor==""){
      standard=0
    }else{
      standard=1  
    }
  },


  //提交表单
  submitform(){
    var that=this
    that.getstandard()
    if(standard==1){      
    if(schoolcomp!=0){
      wx.cloud.database().collection("school_comp").add({
        data:{
          schoolcomp:schoolcomp,
          content:that.data.content,
          contentCount:that.data.contentCount,
          images:that.data.images,
          compname:that.data.compname,
          sponsor:that.data.sponsor,
          college:that.data.college,
          level:that.data.level,
          type:that.data.type,
          regStart:that.data.regStart,
          regEnd:that.data.regEnd,
          compStart:that.data.compStart,
          compEnd:that.data.compEnd,
          isShow:that.data.isShow
        }
      })
    }else{
      wx.cloud.database().collection("school_comp").add({
        data:{
          content:that.data.content,
          contentCount:that.data.contentCount,
          images:that.data.images,
          compname:that.data.compname,
          sponsor:that.data.sponsor,
          college:that.data.college,
          level:that.data.level,
          type:that.data.type,
          regStart:that.data.regStart,
          regEnd:that.data.regEnd,
          compStart:that.data.compStart,
          compEnd:that.data.compEnd,
          isShow:that.data.isShow
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