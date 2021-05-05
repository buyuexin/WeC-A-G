// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    if(event.collegenum==-1){
        return  cloud.database().collection("school_comp").where({ level:event.levelnum}).get()
    }else if(event.levelnum==-1){
        return  cloud.database().collection("school_comp").where({ college:event.collegenum }).get()
    }else{
        return  cloud.database().collection("school_comp").where({ level:event.levelnum, college:event.collegenum }).get()
    }
    
}