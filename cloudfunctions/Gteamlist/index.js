// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.type==0){//comp_info页面发布队伍列表获取
    return cloud.database().collection("comp_team_rls").where({
      class:event.class,
      id:event.id
    }).get()
  }else if(event.type==1){//my_rls页面获取
    return cloud.database().collection("comp_team_rls").where({
      _openid:event.openid
    }).get()
  }else if(event.type==2){//comp_info页面发布队伍列表获取
    return cloud.database().collection("comp_team_rls").where({
      schoolcomp:event.schoolcomp
    }).get()
  }
  
}