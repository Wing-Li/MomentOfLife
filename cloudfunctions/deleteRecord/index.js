// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 请求参数
 * recordId
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('Record').where({
    _id: event.recordId
  }).remove()

}