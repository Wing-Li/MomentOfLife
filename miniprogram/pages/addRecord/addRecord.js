// miniprogram/pages/addRecord.js

import dateUtils from '../utils/DateUtils.js'
import myUtils from '../utils/MyUtils.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTitle: '',
    currentContent: '',
    time: dateUtils.formatDayTime(new Date()),
    date: dateUtils.formatDate(new Date()),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.recordId) {
      this._fetchRecord(options.recordId)
    }
  },

  _fetchRecord(recordId) {
    wx.showLoading({
      title: 'Loading...',
    })

    // 调用云函数
    wx.cloud.callFunction({
      name: 'fetchRecord',
      data: {
        recordId: recordId
      },
      success: res => {
        var record = res.result.data
        console.log('获取单个记录：', record)
        this.setData({
          currentTitle: record.title,
          currentContent: record.content,
          date: record.time.substring(0, 11),
          time: record.time.substring(11, record.time.length)
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

  onSendRecord() {
    var title = this.data.currentTitle
    var content = this.data.currentContent
    var time = this.data.date + " " + this.data.time

    if (myUtils.isEmpty(title) && myUtils.isEmpty(content)) {
      return
    }

    wx.showLoading({
      title: 'Save...',
    })

    wx.cloud.callFunction({
      name: 'addRecord',
      data: {
        title: title,
        content: content,
        time: time
      },
      success: res => {
        wx.hideLoading()

        wx.navigateBack({
          success: res => {
            this.refreshHomeData()
          }
        })
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  },

  refreshHomeData() {
    var pages = getCurrentPages()
    pages.forEach(page => {
        if (page.route == "pages/index/index") {
          page.loadRecordData()
        }
      }
    )
  },

  inputTitle(e) {
    this.setData({
      currentTitle: e.detail.value
    })
  },

  inputContent(e) {
    this.setData({
      currentContent: e.detail.value
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  bindTimeChange(e) {
    this.setData({
      time: e.detail.value,
    })
  },


  // // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]

  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath

  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})