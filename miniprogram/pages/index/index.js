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

  onOpenDeatils: function (e) {

  },

  onGoToAddRecord(){
    wx.navigateTo({
      url: '/pages/addRecord/addRecord',
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
