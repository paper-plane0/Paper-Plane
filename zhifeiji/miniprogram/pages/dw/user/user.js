// miniprogram/pages/dw/index/index.js
//getApp()获取app实例
/*在app.js的globalData中定义一个公共对象userInfo，当程序加载时实现自动登录更新userInfo对象内容，供其他页面之用
*/

//在user.js中获取globalData的userinfo
const userinfo = getApp().globalData.userinfo
/*
在开始使用数据库 API 进行增删改查操作之前，需要先获取数据库的引用。以下调用获取默认环境的数据库的引用：
--------------------------------------------------------------------------------------------
*/
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: userinfo,
    xh:''
  },

  /**
   * 生命周期函数--监听页面加载
   */

   //页面初始化 options 为页面跳转所传递过来的参数
  onLoad: function (options) {
    //向调试面板中打印 log 日志
    console.log()
    //更新userinfo和学号
    this.setData({
      user: getApp().globalData.userinfo,
      xh : getApp().globalData.userinfo.xh
    })
  },
  addbook() {
    //从user云数据库中获取数据._id属性
    db.collection('user').doc(getApp().globalData.userinfo._id)
      .update({
        //更新数据
        data: {
          xh: this.data.xh,
          city: this.data.user.city,
          name: this.data.user.name,
        }
      }).then(res => {
        //从user云数据库中获取数据
        db.collection('user')
        //变量名openid:文件私有归属标识，标记所有者 id
        .where({
          openid: getApp().globalData.userinfo.openid
        })//a=>{}箭头函数,类似于匿名函数
        .get().then(userList=>{
          getApp().globalData.userinfo = userList.data[0]
          // this.data.xh = getApp().globalData.userinfo.xh
          this.setData({
            user: getApp().globalData.userinfo,
            xh : getApp().globalData.userinfo.xh
          })
        })
        //弹框
        wx.showToast({
          //提示文字
          title: '修改成功',
        })
      })
  },
  //修改学号
  xhChange(e) {
    // let a = { ...this.data.user, xh: e.detail }
    this.setData({
      xh: e.detail
    })
  },
  //修改用户名
  nameChange(e) {
    let a = { ...this.data.user, name: e.detail }
    this.setData({
      user: a
    })
  },
  //修改城市
  cityChange(e) {
    let a = { ...this.data.user, city: e.detail }
    this.setData({
      user: a
    })
  }
})