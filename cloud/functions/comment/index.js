const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const commentCollection = db.collection('comment')


exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const {sceneId, operation} = event;
  let commentInfo;
  if (operation === 1) {
    return (await commentCollection.where({
      sceneId: sceneId,
      userId: OPENID
    }).get()).data;
  } else {
    return (await commentCollection.where({
      sceneId: sceneId
    }).get()).data;
  }
  return null;
}
