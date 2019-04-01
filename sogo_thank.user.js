// ==UserScript==
// @name        sogo_thank
// @namespace   sogo_thank@cake
// @include     http*://oursogo.com/*tid=*
// @include     http*://oursogo.com/thread*
// @version     1
// @grant       GM.xmlHttpRequest
// ==/UserScript==
var THANK_URL= 'https://oursogo.com/forum.php?mod=misc&action=thanks&thankssubmit=yes&infloat=yes';

function post_to_url2(path, postObj, callback) {
  var formBody = [
  ];
  for (var property in postObj) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(postObj[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  console.log('ready to post data to: ' + path, 'with body: ' + formBody);
  GM.xmlHttpRequest({
    method: 'POST',
    url: path,
    data: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    onload: function (response) {
      callback(response);
    }
  });
}
function goThank() {
  var hidediv = document.getElementsByClassName('locked');
  var thank_path = THANK_URL ;
  if (hidediv.length > 0 && document.getElementsByClassName('locked')[0].textContent.includes("才能瀏覽"))  {
    console.log('has hidediv, send thank..');
    var formhash = document.getElementById('modactions').formhash.value;
    var referer = encodeURIComponent(document.URL);
    var thankonclick = document.getElementById('thank_tmp').getAttribute('onclick');
    var tidPropStr = thankonclick.match(/tid=[0-9]*&/) [0];
    var tid = tidPropStr.substr(4, tidPropStr.length - 5);
    var pidPropStr = thankonclick.match(/pid=[0-9]*&/) [0];
    var pid = pidPropStr.substr(4, pidPropStr.length - 5);
    var extraPropStr = thankonclick.match(/extra.*'/) [0];
    var extra = extraPropStr.substr(6, extraPropStr.length - 7);
    var postObj = {
      //path: thank_path,
      formhash: formhash,
      referer: referer,
      tid: tid,
      pid: pid,
      extra: extra,
      handlekey: 'thanks'
    };
    post_to_url2(thank_path, postObj, function (response) {
      console.log('status:', response.status );
      console.log('post done.. go redirecting...')
      location.href = document.URL;
    });
  } 

}
goThank();
