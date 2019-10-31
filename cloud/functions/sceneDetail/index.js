const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  return db.collection('scene').where({
    id: event.id
  }).get();
}