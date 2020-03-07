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



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})