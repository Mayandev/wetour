const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const defaultTripCollection = db.collection('default_trip')



exports.main = async (event) => {
  const {days, season} = event;
  try {
    const tripInfo = (await defaultTripCollection.where({
      days: days,
      season: season
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
