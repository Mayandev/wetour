## WeTour 小程序

❗️❗️不兼容 Taro 最新版本，请使用 Taro v1.3.18.

## 项目介绍

一款旅游打卡小程序，使用云开发技术，taro 构建，主要功能有：景点列表、景点详情、打卡、评论、景点地图、导航等等，具体看下面的截图。

## 2、截图

### 小程序端


![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/wetour-1.png)


首页、景点详情、导航

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/wetour-2.png)

打卡记录、打卡成功、评价

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/wetour-3.png)

景点地图、行程规划、行程路线

### 云开发管理后台

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/wetour-4.png)


## 项目运行

### 导入数据

1、先将所有的云函数右键上传。

2、在云数据库中新建comment（评论）、default_trip(系统默认路线)、mark（打卡记录）、scene（景点）、trip（用户行程）、user（用户）集合。

3、将 data 文件夹中对应的数据导入到集合中，剩下的数据则在小程序界面操作即可。

### 运行项目

```bash
$ git clone https://github.com/Mayandev/wetour.git
$ cd wetour/client
$ npm install
$ npm run dev:weapp
$ # 打包
$ npm run build:weapp
```

## 最后

如果本项目对你有帮助，记得点一个 Star。

你也可以关注我的公众号，可以向我进行提问。

![](https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/qrcode_for_gh_5dbad4a52584_258.jpg)
