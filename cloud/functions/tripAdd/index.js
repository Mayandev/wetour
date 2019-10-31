const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const tripCollection = db.collection('trip')
const tripDefaultCollection = db.collection('default_trip')



exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const {days, season, title, default_trip, route} = event;
  const images = [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572336582202&di=224db1e0cdcb6ba55143ddf395533b13&imgtype=0&src=http%3A%2F%2Fimages4.c-ctrip.com%2Ftarget%2Ftuangou%2F534%2F702%2F626%2Fad3ed16b344e4ccd9ab20a4ec22e9256_720_480_s.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572340397385&di=13a41dc3be14b56621a64b06c9e38481&imgtype=0&src=http%3A%2F%2Fimg8.zol.com.cn%2Fbbs%2Fupload%2F22900%2F22899167.jpg',
    'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1102465428,633710019&fm=26&gp=0.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572343154886&di=fa64381343dea3ff60076a21eb5586db&imgtype=0&src=http%3A%2F%2Fd.ifengimg.com%2Fq100%2Fimg1.ugc.ifeng.com%2Fnewugc%2F20190613%2F14%2Fwemedia%2Fb092fe8e950f1ddcb821cd6012f7a34183b1f6cc_size504_w640_h360.png',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572343231009&di=bacb7dfdd9ea42c8194f702cdb2b3f9a&imgtype=0&src=http%3A%2F%2Figuide.lvmama.com%2Fuploadfile%2F2012%2F1214%2F201212141545552514.jpg'
  ];
  let index = Math.floor(Math.random()*5);
  return (await tripCollection.add({
    data: {
      default_trip: default_trip,
      image: images[index],
      title: title,
      userId: OPENID,
      route: route
    }
  }));
   
  
}
