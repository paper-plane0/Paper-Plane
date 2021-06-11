//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-4g78erwhf193925b',//云开发配置环境ID
        traceUser: true,
      })
    }

    this.globalData = {
      userinfo:{}
    }
  }
})

/*
App({
  onLaunch: function () {
    if (!wx.cloud) {
	console.login
      console.error('请使用 2.2.0 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-4g78erwhf193925b',//云开发配置环境ID
        traceUser: true,
      })
    }

    this.globalData = {
      userinfo:{}
    }
  }
})
*/
