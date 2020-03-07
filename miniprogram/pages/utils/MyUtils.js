//判断字符是否为空的方法
function isEmpty(obj) {
  return obj == "undefined" || obj == null || obj == ""
}

module.exports = {
  isEmpty: isEmpty
}