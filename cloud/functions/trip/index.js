const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const tripCollection = db.collection('trip');
const TcbRouter = require('tcb-router');
const defaultTripCollection = db.collection('default_trip')

exports.main = async event => {
  const { tripData } = event;
  const app = new TcbRouter({ event });

  const { OPENID } = cloud.getWXContext();

  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  });

  app.router('default', async (ctx, next) => {
    const { days, season } = tripData;
    try {
      const tripInfo = (
        await defaultTripCollection
          .where({
            days,
            season,
          })
          .get()
      ).data;

      ctx.body = tripInfo;
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        message: '服务器错误',
      };
    }
  });

  app.router('add', async ctx => {
    const { OPENID } = cloud.getWXContext();
    const { days, season, title, default_trip, route } = tripData;
    const images = [
      'http://b0.bdstatic.com/ugc/cfYk00ERBSmPe2BoGx3K0Q1de238e4638911f5c8f7650602b89612.jpg',
      'https://www.2008php.com/2019_Website_appreciate/2019-08-13/20190813102644.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1102465428,633710019&fm=26&gp=0.jpg',
      'https://s1.51cto.com/oss/201912/05/793a1330cc3d6274c5db8d87ba3b9e07.jpg',
      'http://p2.ifengimg.com/fck/2018_15/14697be0eb1b7ed_w1080_h698.jpg',
    ];
    let index = Math.floor(Math.random() * 5);
    ctx.body = await tripCollection.add({
      data: {
        default_trip,
        image: images[index],
        title,
        userId: OPENID,
        route,
      },
    });
  });

  app.router('list', async (ctx, next) => {
    try {
      const tripInfo = (
        await tripCollection
          .where({
            userId: OPENID,
          })
          .get()
      ).data;

      ctx.body = tripInfo;
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        message: '服务器错误',
      };
    }
  });

  return app.serve();
};
