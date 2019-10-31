const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const tripCollection = db.collection('trip')



exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  try {
    const tripInfo = (await tripCollection.where({
      userId: OPENID,
    }).get()).data;

    return tripInfo;
   
  }catch (e) {
    console.log(e);
    return {
      code: 500,
      message: "服务器错误",
    }
  }
}
