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
    var index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ["编辑", "删除", ],
      success: res => {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            { // 编辑
              this._openDetails(record)
              break
            }
          case 1:
            { //删除
              this._deleteRecordDialog(record, index)
              break
            }
        }
      }
    })
  },

  onOpenDetails(e) {
    this._openDetails(e.currentTarget.dataset.value)
  },

  _openDetails(record) {
    wx.navigateTo({
      url: '/pages/addRecord/addRecord?recordId=' + record._id,
    })
  },

  _deleteRecordDialog(record, index) {
    wx.showModal({
      title: '删除',
      content: '您确定要删除 “' + record.title + '” 吗？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this._deleteRecord(record, index)
        }
      }
    })
  },

  _deleteRecord(record, index) {
    wx.showLoading({
      title: 'delete...',
      icon: 'none'
    })

    wx.cloud.callFunction({
      name: 'deleteRecord',
      data: {
        recordId: record._id
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        this.data.recordList.splice(index, 1)
        this.setData({
          recordList: this.data.recordList
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
        wx.hideLoading()
      }
    })
  },

  onGoToAddRecord() {
    wx.navigateTo({
      url: '/pages/addRecord/addRecord'
    })
  },

})