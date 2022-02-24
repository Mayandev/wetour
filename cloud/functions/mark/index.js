const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const markCollection = db.collection('mark');
const TcbRouter = require('tcb-router');

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const app = new TcbRouter({ event });
  const { sceneData } = event;

  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  });

  app.router('isMark', async (ctx, next) => {
    const { OPENID } = cloud.getWXContext();
    const { sceneId } = sceneData;
    try {
      const markInfo = (
        await markCollection
          .where({
            userId: OPENID,
            sceneId,
          })
          .get()
      ).data;

      ctx.body = markInfo;
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        message: '服务器错误',
      };
    }
  });

  app.router('rank', async (ctx, next) => {
    const { sceneId } = sceneData;
    try {
      const count = await markCollection
        .where({
          sceneId,
        })
        .count();

      ctx.body = count;
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        message: '服务器错误',
      };
    }
  });

  app.router('list', async (ctx, next) => {
    const { OPENID } = cloud.getWXContext();
    try {
      const markList = await markCollection
        .where({
          userId: OPENID,
        })
        .get();

      ctx.body = markList;
    } catch (e) {
      console.log(e);
      return {
        code: 500,
        message: '服务器错误',
      };
    }
  });

  app.router('mark', async (ctx, next) => {
    const { sceneId, date, rank, sceneName, sceneImage } = sceneData;
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
        fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
      }
      return fmt;
    };
    let time = new Date(date).format('yyyyMMdd');
    try {
      const markInfo = await markCollection.add({
        data: {
          userId: OPENID,
          sceneId,
          date: time,
          rank,
          sceneName,
          sceneImage,
        },
      });

      ctx.body = markInfo;
    } catch (e) {
      console.log(e);
      ctx.body = { e, event };
    }
  });

  return app.serve();
};
