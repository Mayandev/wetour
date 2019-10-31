const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const markCollection = db.collection('mark')



exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const {sceneId, date, rank, sceneName, sceneImage} = event;
  Date.prototype.format = function(fmt) { 
    var o = { 
      "M+" : this.getMonth()+1,                 //月份 
      "d+" : this.getDate(),                    //日 
      "h+" : this.getHours(),                   //小时 
      "m+" : this.getMinutes(),                 //分 
      "s+" : this.getSeconds(),                 //秒 
      "q+" : Math.floor((this.getMonth()+3)/3), //季度 
      "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          }
      }
    return fmt; 
  }
  let time = new Date(date).format('yyyyMMdd');
  try {
    const markInfo = (await markCollection.add({
      data: {
        userId: OPENID,
        sceneId: sceneId,
        date: time,
        rank: rank,
        sceneName:sceneName,
        sceneImage: sceneImage
      }
    }));

    return markInfo;
   
  }catch (e) {
    console.log(e);
    return {e: e, event: event};
  }
}
