// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.class==0){
    return cloud.database().collection("engineeringcourse2").where({id:event.id}).get()
  }else if(event.class==1){
    return cloud.database().collection("science2").where({id:event.id}).get()
  }else if(event.class==2){
    return cloud.database().collection("commerce2").where({id:event.id}).get()
  }else if(event.class==3){
    return cloud.database().collection("Literature_and_Sports2").where({id:event.id}).get()
  }else if(event.class==4){
    return cloud.database().collection("comprehensive2").where({id:event.id}).get()
  }else if(event.myrls==1){
    return cloud.database().collection("school_comp").where({_openid:event.openid}).get()
  }else if(event.type==0){//在校内赛事队伍发布页面获取赛事信息
    return cloud.database().collection("school_comp").where({id:event.schoolcomp}).get()
  } else{
    return cloud.database().collection("school_comp").where({_id:event.id}).get()
  }
}