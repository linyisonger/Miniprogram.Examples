var url = "";
function request(urll, postData, doSuccess, doFail, doComplete) {
  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : '';
  if (urll == 'Login/weChat') {
    token = '';
  }
  postData.ver = '0.0.1';
  postData.token = token;
  postData.client = 'mini';
  wx.request({
    url: url + urll,
    data: postData,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        if (res.data.code == 0) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/my/login/login',
          })
        } else {
          doSuccess(res);
        }
      }
    },
    fail: function (res) {
      if (typeof doFail == "function") {
        doFail(res);
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}


function is_mobile(v) {
  var reg = /^0{0,1}(13[0-9]|18[0-9]|17[0-9]|14[0-9]|15[0-9]|16[0-9]|19[0-9])[0-9]{8}$/;
  return reg.test(v);
}

function alertCancel(title) {
  wx.showModal({
    title: '提示',
    content: title,
    showCancel: true,
    success(res) {}
  })
}

function html_decode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/<br\/>/g, "\n");
  return s;
}

function alert(title) {
  wx.showModal({
    title: '提示',
    content: title,
    showCancel: false,
    success(res) {}
  })
}
function is_define(value) {
  if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof (value) == 'undefined') {
    return false;
  } else {
    value = value + "";
    value = value.replace(/\s/g, "");
    if (value == "") {
      return false;
    }
    return true;
  }
}

function toast(title,duration) {
 var time = is_define(duration)?duration:2000
  wx.showToast({
    title: title,
    icon: 'none',
    duration:time
  })
}

module.exports = {
  is_define: is_define,
  alertCancel: alertCancel,
  alert: alert,
  is_mobile: is_mobile,
  toast: toast,
  html_decode: html_decode
}