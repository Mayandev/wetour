const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const { name, gender, avatarUrl } = event;
  console.log('event', event);

  try {
    const [userRecord] = (await userCollection
      .where({
        openId: OPENID
      })
      .get()).data;
    console.log("查到的用户信息", userRecord);
    if (!userRecord) {
      return {
        code: 1,
        message: "用户不存在"
      };
    } else {
      await userCollection.doc(userRecord._id).update({
        data: {
          name,
          gender,
          avatarUrl
        }
      });
    }
    return {
      openId: OPENID,
      name,
      gender,
      avatarUrl
    };
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: "服务器错误",
    }
  }
};

