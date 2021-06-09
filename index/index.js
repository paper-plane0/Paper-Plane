// miniprogram/pages/dw/user/user.js
const db = wx.cloud.database() //调用云数据库
const app = getApp() //实现在 page 页面获取 app.js 定义的属性globalData,即获取全局数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    isdk: "签到",
    rx:'',
    name:"",
    lj:'',
    clickCanDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) { //onLoad页面加载时调用，可以获取参数，通过options。
    wx.showShareMenu({ //显示当前页面的转发按钮，分享功能
      withShareTicket:true,
      menu:['shareAppMessage','shareTimeline']
    })
    this.setData({
      clickCanDate:this.getCurrentDate(1)
    })
  
    let that = this
    this.setData({
      rx:app.globalData.userinfo.tx,
      name:app.globalData.userinfo.name
    })
    console.log("111111111",app.globalData.userinfo)
    let s = 0
    db.collection('dkjl')
            .where({
              openid: app.globalData.userinfo.openid
            })
            .get().then(res=>{//查询数据库记录
              
              res.data.forEach(sj=>{
                //console.log(res)
                if(sj.time){
                  s=parseInt(s)+parseInt(sj.time)
                }
              })
              that.setData({
                lj:s
              })
              db.collection('user').doc(app.globalData.userinfo._id)
              .update({//更新数据库记录，更新当次打卡时长
                data: {
                  timesc: s
                }
              })
            })
   console.log(app.globalData.userinfo.dateid)
    if (app.globalData.userinfo.dateid) {//判断dateid值变换打卡和签退
      this.setData({
        isdk: "签退"
      })
    } else {
      
      this.setData({
        isdk: "签到"
      })
    }
  },
  openphb(){//打卡排行榜
    wx.navigateTo({
      url: '/pages/dw/phb/phb',
    })
  },
  rldj(e) {
console.log("当前日期：",e.detail.date)
this.setData({
  clickCanDate:e.detail.date
})
  },

  dkcli1() {
    //获取当前日期
     let nowdate = this.getCurrentDate(1)
    if(nowdate!=this.data.clickCanDate){
      wx.showToast({//日期错误提示
        title: '日期选择错误，请选择当天日期',
        icon:'none'
      })
      return
    }
    //114.42729315311433       23.088040083168043 
    //119.278829,26.081382 
    //119.279923,26.082316
    let that = this

    if (this.data.isdk == "签到") {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res)
          let j = res.longitude - 119.278829//res.longitude j：当前位置与图书馆经度误差
          let w = res.latitude - 26.081382//res.latitude w：当前位置与图书馆纬度误差
          if (j > 0) {
            if (j < 0.1) {
              if (w > 0) {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              } else {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              }

            }
          } else {
            if (j < 0.1) {
              if (w > 0) {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              } else {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              }

            }
          }

          wx.showToast({
            title: '签到失败,不在签到范围内',
            icon:'none'
          })
        }
      })
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res)
          let j = res.longitude - 119.278829//res.longitude
          let w = res.latitude - 26.081382//res.latitude

          if (j > 0) {
            if (j < 0.1) {
              if (w > 0) {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              } else {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              }

            }
          } else {
            if (j < 0.1) {
              if (w > 0) {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              } else {
                if (w < 0.1) {

                  that.dkcli2()
                  return
                }
              }

            }
          }


          wx.showToast({
            title: '签退失败,不在签退范围内',
            icon:'none'
          })
        }
      })
    }


  },
  //点击打卡
  async dkcli2() {//async/await 异步调用




    let that = this
    let date = await this.getCurrentDate(2)
    if (this.data.isdk == "签到") {
      db.collection('dkjl')
        .add({//添加数据
          data:
          {
            openid: app.globalData.userinfo.openid,
            start: date,
            end: '',
            time: ''
          }

        }).then(add => {
          //在用户表添加一个s时间id  修改的时候使用
          console.log(add)
          db.collection('user').doc(app.globalData.userinfo._id)
            .update({
              data: {
                dateid: add._id
              }
            }).then(up => {
              wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 2000
              })
              that.updateuserinfo()
              that.setData({
                isdk: "签退"
              })
            })

        })
    } else {//退卡

      db.collection('user').doc(app.globalData.userinfo._id)
        .update({
          data: {
            dateid: ''
          }
        }).then(up => {
          db.collection('dkjl')
            .where({
              _id: app.globalData.userinfo.dateid
            })
            .get()
            .then(find => {
              console.log("开始时间", find.data[0].start)
              let enddate = that.fun(find.data[0].start, date)
              db.collection('dkjl').doc(app.globalData.userinfo.dateid)
                .update({
                  data: {
                    end: date,
                    time: enddate
                  }
                }).then(up => {
                  wx.showToast({
                    title: '签退成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    isdk: "签到"
                  })
                })
            })




          that.updateuserinfo()
          that.setData({
            isdk: "签退"
          })
        })
    }

  },
  fun(t1, t2) {
    let startTime = new Date(t1); // 开始时间
    let endTime = new Date(t2); // 结束时间

    return Math.floor((endTime - startTime) / 1000 / 60 / 60)
  },
  updateuserinfo() {
    db.collection('user')
      .where({
        openid: app.globalData.userinfo.openid
      })
      .get()
      .then(data => {
        app.globalData.userinfo = data.data[0]
      })

  },
  getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;//递增月份
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
      time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
  }
})