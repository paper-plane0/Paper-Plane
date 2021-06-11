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
           
          
          }else{//找到了
            console.log("OK")
            getApp().globalData.userinfo = userList.data[0]
          
            that.loginOK()
          }
        })
      }
    })

  },
  async wechatlogin() {//登录函数

    let that = this
    await wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        that.data.userinfo = {//赋予用户信息
          ...that.data.userinfo, name: res.userInfo.nickName,
          city: res.userInfo.city,
          tx: res.userInfo.avatarUrl,
          
        }
        that.setData(
          {
            userinfo: that.data.userinfo
          }
        )

        console.log(that.data.userinfo)

        that.login()


      }, fail: res => {
        console.log("shibai", res)
      }
    })



  },
  
  async login() {
    await this.findxs()
  },
  async findxs() {
    let that = this
    let res = null;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.data.userinfo.openid = res.result.openid
        that.setData({//查询数据库该用户数据
          userinfo: that.data.userinfo
        })
        db.collection('user')//查询用户唯一openid
          .where({
            openid: this.data.userinfo.openid
          })
          .get().then(userList=>{//返回用户数据
            console.log("getuserlist",userList)

            if(userList.data.length==0){//首次登入未找到用户数据时，添加该用户数据进入云数据库
              db.collection('user')
              .add({
                data: 
                 {...that.data.userinfo,xh:'',sc:'',timesc:'',dateid:''}
            
                
              }).then(add=>{
                console.log("add",add)
                if(add.errMsg=="collection.add:ok"){
                  getApp().globalData.userinfo = {...that.data.userinfo,xh:'',dateid:'',_id:add._id}
                 
                  that.loginOK()
                }
              })
            
            }else{//找到了用户数据
              console.log("OK")
              getApp().globalData.userinfo = userList.data[0]
            
              that.loginOK()
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)//云函数调用失败，返回报错提示
        wx.showToast({//提示框模型
          title: '登录失败！',
          icon: "error",
          duration: 2000
        })
      }
    })





  },
  loginOK(){
    wx.setStorage({
      key:"openid",
      data:getApp().globalData.userinfo.openid
    })
    wx.showToast({
      title: '登录成功',
      icon:'success'
    })

    wx.switchTab({
      url: '../index/index',
    })
    
  },
  
})