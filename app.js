App({
  globalData: {
    requestApi: "https://www.kxlist.com/api/",
    ossPath: "https://oss.kxlist.com/",
    M_100: "@!M_100",
    M_W_500: "@!M_W_500",
    M_W_800: "@!M_W_800",
    M_W_500_BLUR: "@!M_W_500_BLUR",
    winHeight:0,
    windowWidth:0,
    userInfo: null,
    canIUse:false //  是否授权
  },
  onReachBottom() {
    console.log(123123123)
  },
  onLaunch: function () {
    // 获取系统信息 
    wx.getSystemInfo({
      success: res => {
        this.globalData.winHeight = res.windowHeight;
        this.globalData.winWidth = res.windowWidth;
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 授权
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.request({
            url: "wechat/ma/session",
            data: { code: res.code },
            success: (result) => {
              if (result.code == 0) {
                console.log(result, "发送 res.code 到后台换取 openId, sessionKey, unionId");
                wx.setStorageSync('sessionKey', result.data.sessionKey);
                wx.setStorageSync('openId', result.data.openid);
                wx.setStorageSync('unionId', result.data.unionid);
              } else {
                wx.showToast({
                  title: `${result.msg}`,
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo();
        }
      }
    })
  },
  getUserInfo(fn1,fn2){
    if (this.globalData.userInfo){ 
      typeof fn1 == "function" && fn1(this.globalData.userInfo);
    }else{
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          // 解密用户信息获得unionId，根据unionId获取平台用户信息
          //是否授权标记
          this.request({
            url: "wechat/ma",
            data: {
              sessionKey: wx.getStorageSync('sessionKey'),
              signature: res.signature,
              encryptedData: res.encryptedData,
              iv: res.iv,
              rawData: res.rawData
            },
            success: (result) => {
              var obj = result.data
              if (result.code == 0) {
                wx.setStorageSync("Authorization", result.msg);
                wx.setStorageSync('autoLogin', true)
                // 用户信息放到全局
                this.globalData.userInfo = obj;
                wx.setStorageSync('userInfo', obj);
                typeof fn1 == "function" && fn1(this.globalData.userInfo);
              } else if (result.code === 5) {
                wx.setStorageSync('autoLogin', false)
              } else {
                console.log(result.msg)
              }
            }
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
  },
  request(requestConfig){
    let contentType = requestConfig.contentType ? requestConfig.contentType : 'application/x-www-form-urlencoded'
    wx.request({
      url: this.globalData.requestApi + requestConfig.url,
      data: requestConfig.data,
      header: {
        'Content-Type': contentType
      },
      method: requestConfig.method ? requestConfig.method : 'GET',
      success: function (res) {
        if (typeof requestConfig.success == "function")
          res.statusCode === 200 && requestConfig.success(res.data)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络请求异常',
          icon: 'success',
          duration: 2000
        })
        typeof requestConfig.error == "function" && requestConfig.error(err)
      },
      complete: function () {
        typeof requestConfig.complete == "function" && requestConfig.complete()
      }
    })
  },
  requestWithToken(requestConfig) {
    let that = this;
    let AuthorizationMsg = wx.getStorageSync("Authorization") ? { 'Authorization': wx.getStorageSync("Authorization") } : {}
    wx.request({
      url: this.globalData.requestApi + requestConfig.url,
      method: requestConfig.method,
      data: requestConfig.data,
      header: Object.assign({
        'content-type': requestConfig.contentType || 'application/x-www-form-urlencoded'
      }, AuthorizationMsg),
      success: function (res) {
        if (typeof requestConfig.success == "function") {
          res.statusCode === 200 && requestConfig.success(res.data)
        }
        if (res.data.code == 403) {
          // that.getUserInfo(requestConfig.doGetUser);
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络请求异常',
          icon: 'success',
          duration: 2000
        })
        typeof requestConfig.error == "function" && requestConfig.error()
      },
      complete: function () {
        typeof requestConfig.complete == "function" && requestConfig.complete()
      }
    })
  }
})