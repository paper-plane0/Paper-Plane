const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {
      openid: '',
      name: '',
    },
    xhLogin:true,
    pwd:'',
    zh:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'openid',
      success (res) {
        console.log(res.data)
        db.collection('user')
        .where({
          openid: res.data
        })
        .get().then(userList=>{
          console.log("getuserlist",userList)
          if(userList.data.length==0){//找不到
     
            wx.showToast({
              title: '请授权登录',
              icon:'error'
            })

          }else{//找到了
            console.log("OK")
            getApp().globalData.userinfo = userList.data[0]
            that.loginOK()
          }
        })
      }
    })

  },
  
  async wechat() {

    let that = this
    that.login()
  },
  async login() {
    await this.findxs()


  },
  async findxs() {
    let that = this
    let res = null;
    wx.cloud.callFunction({
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.data.userinfo.openid = res.result.openid
        that.setData({
          userinfo: that.data.userinfo
        })
        db.collection('user')
          .where({
            openid: this.data.userinfo.openid
          })
          .get().then(userList=>{
            console.log("getuserlist",userList)

            if(userList.data.length==0){//找不到 
                  that.logins()
     
            }else{//找到了
            
              that.loginOK()
            }
          })
      },
      fail: err => {

          that.logins()

      }
    })

  },
  logins(){

    wx.navigateTo({
      url: '../login/login',
    })

  },
  loginOK(){

    wx.showToast({
      title: '登录成功',
      icon:'success'
    })

    wx.switchTab({
      url: '../index/index',
    })
    
  },
  
})