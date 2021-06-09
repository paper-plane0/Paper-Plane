// miniprogram/pages/dw/phb/phb.js
const db = wx.cloud.database()//初始化数据库对象
const app = getApp()//通过const app = getApp()实现在本页面获取app.js 定义的属性globalData,即获取全局数据
//

///
///
///

//Page()函数用来注册页面
Page({

  /**
   *
   *
   * 页面的初始数据
   */
  data: {
    userlist: [],
    lr:false,//根据lr标志。区分月排行榜(false)，学期排行榜（true）
    userid:'',
    li1:{},
    li2:{},
    li3:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */

   //// 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {

    wx.updateShareMenu({//分享给朋友
      withShareTicket: true,//是否使用带 shareTicket 的转发
      success () { }//接口调用成功的回调函数
    })

    this.setData({
      userid:app.globalData.userinfo.openid //将数据库中 userid设置为用户的openid
    })
   
    db.collection('user')
      .orderBy('timesc', 'desc')// 按timesc 降序
      .limit(7)//取按 orderBy 排序之后的前ph个
      .get()//获取数据
      .then(list=>{
        this.setData({
          userlist:list.data,
          li1:list.data[0],
          li2:list.data[1],
          li3:list.data[2],
        })//list.data写入userlist，获取前三名那个的数据保存为集合
      })


  },
  tcli(){
    this.setData({
      lr:!this.data.lr
    })//bindtap当用户点击该组件的时候会js中找到相应的事件处理函数
  },

})