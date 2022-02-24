const cloud = require('wx-server-sdk');
cloud.init();
const TcbRouter = require('tcb-router');
const db = cloud.database();
const commentCollection = db.collection('comment');

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const app = new TcbRouter({ event });
  const { queryData, createData } = event;
  
  app.use(async (ctx, next) => {
		ctx.data = {}
		await next()
  });

  app.router('list', async (ctx, next) => {
    let commentInfo;
    const { operation, sceneId } = queryData;
    if (operation === 1) {
      commentInfo = (
        await commentCollection
          .where({
            sceneId,
            userId: OPENID,
          })
          .get()
      ).data;
    } else {
      commentInfo = (
        await commentCollection
          .where({
            sceneId,
          })
          .get()
      ).data;
    }
    ctx.body = commentInfo
  });

  app.router('create', async (ctx, next) => {

    const { OPENID } = cloud.getWXContext();

    const { comment, sceneId, rate, userInfo } = createData;
    Date.prototype.format = function (fmt) {
      let o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${this.getFullYear() }`).substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp(`(${ k })`).test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : (`00${ o[k]}`).substr((`${ o[k]}`).length));
        }
      }
      return fmt;
    };
    let time = new Date().format('yyyy-MM-dd');

    const commentInfo = await commentCollection.add({
      data: {
        userId: OPENID,
        userInfo,
        comment,
        rate,
        date: time,
        sceneId,
      },
    });
    ctx.body = commentInfo;
  });

  return app.serve()
};
