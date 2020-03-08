// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 请求参数：
 * 
 * recordId : 如果传了 id 就是 update
 * 
 * title
 * content
 * time
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.recordId) {
    return await db.collection('Record').where({
      _id: event.recordId
    }).update({
        data: {
          title: event.title,
          content: event.content,
          time: event.time,
        },
      })

  } else {
    return await db.collection("Record").add({
      data: {
        userId: wxContext.OPENID,
        title: event.title,
        content: event.content,
        time: event.time,
        createAt: new Date()
      },
      success: function (res) {
        console.log(res)
      }
    })
  }

}