const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  if (event.name == '') {
    return db.collection('scene').get();
  } else {
    return db.collection('scene').where({
      name: db.RegExp({
        regexp: event.name
      })
    }).get();
  }
}