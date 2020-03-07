// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
/**
 * 获取个人记录列表
 * 请求参数
 * 
 * startIndex (int): 分页查询，从第几个开始
 * count (int)： 每次查询多少个
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var list = []

  var start = 0
  var count = 1000
  if (event.startIndex) start = event.startIndex
  if (event.count) count = event.count

  var dbRes = db.collection('Record').aggregate()
  dbRes.sort({
    time: -1, // -1 代表降序排列（从大到小）
  })
  dbRes.skip(start)
  dbRes.limit(count)
  // dbRes.lookup({
  //   from: 'User',
  //   localField: 'userId',
  //   foreignField: '_id',
  //   as: 'userInfo',
  // })
  var data = await dbRes.end()

  // 返回数据内总个数，用于分页加载，判断是否还有下一页
  var total = await db.collection('Record').count()

  return {
    dbAllCount: total.total,
    list: data.list
  }
}