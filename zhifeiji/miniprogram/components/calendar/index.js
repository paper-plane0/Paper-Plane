Component({

  behaviors: [],

  properties: {
    "title": {
      type: String,
      value: ""
    },
    "date": {
      type: String,
      value: ""
    },
    "color": {
      type: String,
      value: "#fff"
    },
    "background": {
      type: String,
      value: "Tan"
    },
    "data": {
      type: Array,
      value: [{
      
      }]
    }
  },

  data: {
    year: "",
    month: "",
    day: "",
    allDay: "",
    begin: "",
    end: "",
    prevMonth: "",
    prevAllDay: "",
    nextMonth: "",
    nowMonth: "",
    boxStatus: true
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      this.setData({
        year: year,
        month: month,
        day: day,
        nowMonth: day - 1
      });


      this.getWeekDay(0, false, true);
      this.getWeekDay(1, false, true);
      this.getAdjacentMonth(0);
      this.getAdjacentMonth(1);
    },
    moved: function () {},
    detached: function () {},
  },

  methods: {
    /* 获取传入月天数 */
    getMonthData(val) {
      const date = val ? val : this.data.date.split("-");
      if (val) {
        return new Date(date[0], date[1], 0).getDate();
      } else {
        this.setData({
          allDay: new Date(date[0], date[1], 0).getDate()
        })
        return new Date(date[0], date[1], 0).getDate();
      }
    },

    /* 获取每月一号或末尾是周几 
     * 0 月初
     * 1 月末
     */
    getWeekDay(type, val, status) {
      const date = val ? val : this.data.date.split("-");
      if (type === 0) {
        if (status) {
          this.setData({
            begin: new Date(date[0], Number(date[1]) - 1, 1).getDay() === 0 ? 7 : new Date(date[0], Number(date[1]) - 1, 1).getDay()
          });
        } else {
          return new Date(date[0], Number(date[1]) - 1, 1).getDay() === 0 ? 7 : new Date(date[0], Number(date[1]) - 1, 1).getDay();
        }
      } else if (type === 1) {
        if (status) {
          this.setData({
            end: new Date(date[0], (Number(date[1]) - 1), this.getMonthData()).getDay() === 0 ? 7 : new Date(date[0], (Number(date[1]) - 1), this.getMonthData()).getDay() === 0
          });
        } else {
          let myDate = JSON.parse(JSON.stringify(date.join('-')));
          return new Date(date[0], (Number(date[1]) - 1), this.getMonthData(myDate)).getDay() === 0 ? 7 : new Date(date[0], (Number(date[1]) - 1), this.getMonthData(myDate)).getDay();
        }
      }
    },

    /* 获取当前月的上一月下一月
     * 0 上一月
     * 1 下一月
     */
    getAdjacentMonth(type) {
      let now = this.data.date.split('-').map(Number);
      if (type === 0) {
        if (now[1] === 1) {
          now[0] = now[0] - 1;
          now[1] = 12
        } else {
          now[1] = now[1] - 1;
        }

        // 获取上一月有多少天
        const lastAllDay = this.getMonthData(now);

        this.setData({
          prevAllDay: lastAllDay,
          prevMonth: now[0] + '-' + (now[1] < 10 ? '0' + now[1] : now[1])
        });
      } else if (type === 1) {
        if (now[1] === 12) {
          now[0] = now[0] + 1;
          now[1] = 1;
        } else {
          now[1] = now[1] + 1;
        }
        this.setData({
          nextMonth: now[0] + '-' + (now[1] < 10 ? '0' + now[1] : now[1])
        });
      }
    },

    /* 本月点击事件 */
    nowMonth(e) {
      let day = e.currentTarget.dataset.index + 1;
      let type = e.currentTarget.dataset.type;

      if (type === 0) {
        this.setData({
          nowMonth: e.currentTarget.dataset.index
        });
        let obj = {
          date: this.data.date + '-' + (day < 10 ? '0' + day : day)
        }

        this.triggerEvent('Click', obj);
      } else if (type === 1) {
        let day = e.currentTarget.dataset.day;
        let date = this.data.date.split('-').map(Number);
        if (date[1] === 1) {
          date[0] -= 1;
          date[1] = 12;
        } else {
          date[1] = date[1] - 1 < 10 ? '0' + (date[1] - 1) : date[1] - 1;
        }
        this.setData({
          date: date.join('-')
        });
        this.getWeekDay(0, false, true);
        this.getWeekDay(1, false, true);
        this.getAdjacentMonth(0);
        this.getAdjacentMonth(1);
        this.setData({
          nowMonth: day - 1
        });
        let obj = {
          date: this.data.date + '-' + (day < 10 ? '0' + day : day)
        }

        this.triggerEvent('Click', obj);
      } else if (type === 2) {
        let day = e.currentTarget.dataset.day;
        let date = this.data.date.split('-').map(Number);

        if (date[1] === 12) {
          date[0] += 1;
          date[1] = '01';
        } else {
          date[1] = date[1] + 1 < 10 ? '0' + (date[1] + 1) : date[1] + 1;
        }
        this.setData({
          date: date.join('-')
        });

        this.getWeekDay(0, false, true);
        this.getWeekDay(1, false, true);
        this.getAdjacentMonth(0);
        this.getAdjacentMonth(1);

        this.setData({
          nowMonth: day - 1
        });
        let obj = {
          date: this.data.date + '-' + (day < 10 ? '0' + day : day)
        };

        this.triggerEvent('Click', obj);
      }
    },

    /* 上一个 */
    prev() {
      let date = this.data.date.split('-').map(Number);

      if (date[1] === 1) {
        date[0] -= 1;
        date[1] = 12;
      } else {
        date[1] = date[1] - 1 < 10 ? ('0' + (date[1] - 1)) : date[1] - 1;
      }

      console.log(date.join('-'));

      this.setData({
        date: date.join('-')
      });

      this.getWeekDay(0, false, true);
      this.getWeekDay(1, false, true);
      this.getAdjacentMonth(0);
      this.getAdjacentMonth(1);
    },

    /* 下一个 */
    next() {
      let date = this.data.date.split('-').map(Number);

      if (date[1] === 12) {
        date[0] += 1;
        date[1] = '01';
      } else {
        date[1] = date[1] + 1 < 10 ? ('0' + (date[1] + 1)) : date[1] + 1;
      }

      console.log(date.join('-'));

      this.setData({
        date: date.join('-')
      });

      this.getWeekDay(0, false, true);
      this.getWeekDay(1, false, true);
      this.getAdjacentMonth(0);
      this.getAdjacentMonth(1);
    },
    /* 缩放 */
    zoom() {
      this.setData({
        boxStatus: !this.data.boxStatus
      });
    }
  }
})