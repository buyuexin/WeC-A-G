// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const DB=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //return event
  return DB.collection("users").where({_openid:event.Iopenid}).get()//方式users集合内指定openID的条目
}