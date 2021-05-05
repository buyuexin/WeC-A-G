// pages/my/money/money.js
Page({
  data: {
    image: '../../../images/reward-code.png',
  },


  previewImage() {
    wx.previewImage({
      urls: ['cloud://cloud-1b148.636c-cloud-1b148-1302868324/reward-code.png'],
    })
  },


  onLaunch: function() {
    wx.cloud.init({
      traceUser: true
    });
  },
})