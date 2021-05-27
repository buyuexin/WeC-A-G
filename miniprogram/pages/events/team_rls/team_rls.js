// pages/team_rls/team_rls.js
var schoolcomp=wx.getStorageSync("schoolcomp")
var util = require('../../../utils/util.js');
let standard=1
let isoutput=0
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
    major:'',
    teamname:"",  
    contact: '',  // 联系方式
    startday: '',
    endday:"",
    contentCount: 0,
    content: "",
    tags: [], // 标签列表
    images:[],  // 上传的图片列表
    cloud_images:[],
    covers: ['https://636f-comp-assistant-0gwpijvx2dc4b360-1306023792.tcb.qcloud.la/covers/cover1.jpeg?sign=bbfa7d2d87ee8c9e23215eb8e1c90495&t=1622054051', 'https://636f-comp-assistant-0gwpijvx2dc4b360-1306023792.tcb.qcloud.la/covers/cover2.jpeg?sign=963c29ad11fb424b25271bb27044653c&t=1622054109', 'https://636f-comp-assistant-0gwpijvx2dc4b360-1306023792.tcb.qcloud.la/covers/cover3.jpeg?sign=b613559317cf49954bbe6fa425d45e7c&t=1622054134', 'https://636f-comp-assistant-0gwpijvx2dc4b360-1306023792.tcb.qcloud.la/covers/cover4.jpeg?sign=738a90bf066d2156cb94483eaa05950d&t=1622054148', 'https://636f-comp-assistant-0gwpijvx2dc4b360-1306023792.tcb.qcloud.la/covers/cover5.jpeg?sign=8192b55858bf616084c5e3afb2f9824b&t=1622054161'],
    my_image:'',
    cloud_my_image:'',
    clickIndex: 0,
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

  chooseImage2(e) {
    var that=this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可选择原图或压缩
        sourceType: ['album','camera'], // 开放相册/相机
        success: res => {
          that.setData({
            my_image:res.tempFilePaths,
            clickIndex:-1
          })
        }
      })
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

  getmajor(e){
    this.setData({
      major:e.detail.value
    })
  },
  //点击封面
  coverClick(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    console.log(index)
    that.setData({
      clickIndex: index
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
    const openid=wx.getStorageSync("openid");
    var that=this
    wx.cloud.callFunction({//判断用户是否存在users中，存在则正常使用，不存在则跳转
      name:"IfopenID",
      data:{
        Iopenid:openid//Iopenid为参数
      },
      success(res){
        // console.log(res)
        if(res.result.data.length==0){//用户不存在
          wx.showModal({
                       openid:"提示",
                       content: "请先完成授权",
                       success: function(res){
                         if (res.confirm) {//点击确定后跳转至信息完善界面
                            wx.redirectTo({
                               url: '../../my/home/home',
                            })
                         } else if (res.cancel) {//点击取消后跳转至首页
                             wx.redirectTo({
                               url: '../../index/home/home',
                            })
                         }
                       }
                  })
        }else if(res.result.data[0].school==''||res.result.data[0].college==''||res.result.data[0].major==''){
          wx.showModal({
                       openid:"提示",
                       content: "请先前往个人信息设置界面完善学校、学院、专业信息",
                       success: function(res){
                         if (res.confirm) {//点击确定后跳转至信息完善界面
                            wx.redirectTo({
                               url: '../../my/myinfo/myinfo',
                            })
                         } else if (res.cancel) {//点击取消后跳转至首页
                             wx.redirectTo({
                               url: '../../index/home/home',
                            })
                         }
                       }
                  })
        }
      }
    })
    //为日期赋值 
    var date = util.formatDate(new Date());// 调用函数时，传入new Date()参数，返回值是日期和时间
    this.setData({// 再通过setData更改Page()里面的data，动态更新页面的数据
      endday: date
    })
    //获取发布者个人信息,为icon，name，college，class，id赋值
    const classvalue=wx.getStorageSync("class");
    const idvalue=wx.getStorageSync("id");
    let userinfo=Promise.resolve(wx.cloud.database().collection("users").where({useropenid:openid}).get())
    userinfo.then(res=>{
      that.setData({
        icon:res.data[0].avatarUrl,
        name:res.data[0].name,
        college:res.data[0].college, 
        major:res.data[0].major,
        class:classvalue,
        id:idvalue
      })
      if(res.data[0].email!=""){
        that.setData({
          contact:res.data[0].email
        })
      }else if(res.data[0].phonenum!=""){
        that.setData({
          contact:res.data[0].phonenum
        })
      }else{}//contact置为空，contact本身为空
    })
  },
  //判断能否提交
  getstandard(){
    if(this.data.content==""||this.data.teamname==""||this.data.name==""||this.data.college==""||this.data.contact==""){
      standard=0
    }else{
      standard=1  
    }
  },
  //提交表格
  formsubmit(){
    var that=this
    isoutput=0
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
    //如果没选择图片
    if(that.data.images.length==0)
    {
            if(that.data.clickIndex==-1){//上传个人选择图片
              console.log(that.data.my_image)
                wx.cloud.uploadFile({
                cloudPath: "img/" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
                filePath: that.data.my_image[0],
                success: res => {
                  console.log(res.fileID);
                  that.setData({
                    cloud_my_image: res.fileID,
                  });
                  if (schoolcomp != 0) {
                    console.log(1);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        schoolcomp: schoolcomp,
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.cloud_my_image
                      }
                    });
                  } else {
                    console.log(2);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.cloud_my_image
                      }
                    });
                  }
                  wx.navigateBack({
                    delta: 0,
                  });
                },
                fail: console.error
              })
            }else{//上传默认图片
                  if (schoolcomp != 0) {
                    console.log(1);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        schoolcomp: schoolcomp,
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.covers[that.data.clickIndex]
                      }
                    });
                  } else {
                    console.log(2);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.covers[that.data.clickIndex]
                      }
                    });
                  }
                  wx.navigateBack({
                    delta: 0,
                  });
            
          }
    }else{//选择了图片
      for(var index in that.data.images)
    {
      console.log(index)
      console.log(that.data.images[index])
       wx.cloud.uploadFile({
        cloudPath:"img/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),
        filePath:that.data.images[index],
        success:res=>{
          console.log(res.fileID)
          that.data.cloud_images = that.data.cloud_images.concat(res.fileID)
          console.log(that.data.cloud_images)
          console.log('数组长度为'+that.data.images.length+'；index的大小为'+index)
          if((index==that.data.images.length-1)&&(isoutput==0))
          {
            isoutput=1
            console.log('数组长度为'+that.data.images.length+'；index的大小为'+index)
            if(that.data.clickIndex==-1){//上传个人选择图片
              console.log(that.data.my_image)
                wx.cloud.uploadFile({
                cloudPath: "img/" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
                filePath: that.data.my_image[0],
                success: res => {
                  console.log(res.fileID);
                  that.setData({
                    cloud_my_image: res.fileID,
                  });
                  if (schoolcomp != 0) {
                    console.log(1);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        schoolcomp: schoolcomp,
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.cloud_my_image
                      }
                    });
                  } else {
                    console.log(2);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.cloud_my_image
                      }
                    });
                  }
                  wx.navigateBack({
                    delta: 0,
                  });
                },
                fail: console.error
              })
            }else{//上传默认图片
                  console.log(res.fileID);
                  that.setData({
                    cloud_my_image: res.fileID,
                  });
                  if (schoolcomp != 0) {
                    console.log(1);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        schoolcomp: schoolcomp,
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.covers[that.data.clickIndex]
                      }
                    });
                  } else {
                    console.log(2);
                    wx.cloud.database().collection("comp_team_rls").add({
                      data: {
                        compname: that.data.compname,
                        class: that.data.class,
                        id: that.data.id,
                        icon: that.data.icon,
                        name: that.data.name,
                        college: that.data.college,
                        major: that.data.major,
                        teamname: that.data.teamname,
                        contact: that.data.contact,
                        startday: that.data.startday,
                        endday: that.data.endday,
                        contentCount: that.data.contentCount,
                        content: that.data.content,
                        tags: that.data.tags,
                        images: that.data.cloud_images,
                        my_image: that.data.covers[that.data.clickIndex]
                      }
                    });
                  }
                  wx.navigateBack({
                    delta: 0,
                  });
            }
          }
        },
        fail:console.error
      })
    }
    }}else{//信息不完整，无法发布
      wx.showToast({
        title: '请将信息补充完整',
        icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
        duration: 2000     
      })  
    }
  },
})