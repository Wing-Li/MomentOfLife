//index.js
const app = getApp()

Page({
  data: {
    recordList: []
  },

  onLoad: function() {
    this.loadRecordData()
   
  },

  loadRecordData() {
    wx.showLoading({
      title: 'Loading...',
    })

    // 调用云函数
    wx.cloud.callFunction({
      name: 'fetchRecord',
      data: {},
      success: res => {
        console.log('获取记录列表：', res.result)
        this.setData({
          recordList: res.result.list
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '数据获取失败',
          icon: 'none'
        })
        console.error('获取记录列表失败。', err)
      }
    })
  },

  onLongOpt(e) {
    var record = e.currentTarget.dataset.value
    wx.showActionSheet({
      itemList: ["编辑", "删除",],
      success: res => {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0: { // 编辑
            this._onOpenDetails(record._id)
            break
          }
          case 1: { //删除
            this._deleteRecord(record)
            break
          }
        }
      }
    })
  },

  _onOpenDetails(recordId = undefined) {
    wx.navigateTo({
      url: '/pages/addRecord/addRecord?recordId=' + recordId,
    })
  },

  _deleteRecord(record) {
    wx.showModal({
      title: '删除',
      content: '您确定要删除 “' + record.title + '” 吗？' ,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
      }
    })
  },

  onGoToAddRecord(){
    wx.navigateTo({
      url: '/pages/addRecord/addRecord'
    })
  },

})
