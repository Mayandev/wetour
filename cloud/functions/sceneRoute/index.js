const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  return db.collection('scene').where({
    id: _.in(event.route)
  }).get();
}