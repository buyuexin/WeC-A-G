// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.a==0){
    return cloud.database().collection("engineeringcourse2").get()
  }else if(event.a==1){
    return cloud.database().collection("science2").get()
  }else if(event.a==2){
    return cloud.database().collection("commerce2").get()
  }else if(event.a==3){
    return cloud.database().collection("Literature_and_Sports2").get()
  }else if(event.a==4){
    return cloud.database().collection("comprehensive2").get()
  }else if(event.school==1){
    return cloud.database().collection("school_comp").get()
  }else if(event.follow==1){
    return cloud.database().collection("followcomp").where({_openid:event.openid}).get()
  }else if(event.like==1){
    return cloud.database().collection("userlike").where({_openid:event.openid,class:event.class,id:event.id}).get()
  }else if(event.like==2){
    return cloud.database().collection("userlike").where({id:event.schoolcomp,_openid:event.openid}).get()
  }
}