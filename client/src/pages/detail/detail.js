import Taro, { Component, Config, requirePlugin } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import NavBar from '../../components/navbar/navbar'

let key = 'KC5BZ-FFO34-72WUZ-XMABB-AFL6J-TOFXG';  //使用在腾讯位置服务申请的key
let referer = 'wetour-小程序端';   //调用插件的app的名称

import './detail.scss'

export default class Detail extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#fff',
    backgroundTextStyle: 'dark',
    navigationBarTextStyle: 'white'
  }

  state = {
    sceneDetail: {},
    margin: 20,
    scrollTop: 0,
    readmore: false,
    brief: '典藏武汉红色文化，展示先辈革命风采',
    isMark: false,
    sceneId: 0,
    commentList: []
  }


  openRoutePlan(address) {
    let endPoint = JSON.stringify({  //终点
      'name': address,
      'latitude': 30.559510138609127,
      'longitude': 114.30707507848044
    });
    Taro.navigateTo({ url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint })
  }


  componentWillMount() {
  }

  componentDidMount() {
    
  }

  componentWillUnmount() { }

  componentDidShow() {
    console.log('didMount');
    Taro.showLoading();
    let { id: sceneId } = this.$router.params;
    let userId = 3;
    Taro.cloud.callFunction({
      name: 'sceneDetail',
      data: {
        id: sceneId * 1
      }
    }).then(res => {
      console.log('detail',res);
      this.setState({
        sceneDetail: res.result.data[0]
      });
      Taro.cloud.callFunction({
        name: 'isMark',
        data: {
          sceneId: sceneId * 1,
        }
      }).then(res => {
        console.log(res);
        Taro.hideLoading()
        let data = res.result;
        if (data.length != 0) {
          this.setState({ isMark: true })
        }
      });

    })
    Taro.cloud.callFunction({
      name: 'comment',
      data: {
        sceneId: sceneId * 1,
        operation: 0
      }
    }).then(res => {
      console.log('comment', res);
      this.setState({ commentList: res.result })
    });
  }

  componentDidHide() { }


  onPageScroll(e) {
    // let {margin, scrollTop} = this.state;
    // console.log(e);
    // if (e.scrollTop > scrollTop) {
    //   // 向上滑动
    //   if (e.scrollTop < 40) {
    //     margin+=10;
    //   }
    // } else {
    //   // 向下滑动
    //   if (e.scrollTop < 40) {
    //     margin-=10;
    //   }
    // }
    // this.setState({margin, scrollTop: e.scrollTop})

  }

  openMarkup() {
    let date = new Date();
    const { isMark, sceneDetail } = this.state;
    if (isMark) {
      Taro.showToast({
        title: '你已经打过卡了',
        icon: 'none'
      })
    } else {
      Taro.showLoading({
        title: '加载中...'
      })
      // 查询打卡排名
      Taro.cloud.callFunction({
        name: 'markRank',
        data: {
          sceneId: sceneDetail.id,
        }
      }).then(res => {
        Taro.cloud.callFunction({
          name: 'mark',
          data: {
            sceneId: sceneDetail.id,
            date: date,
            rank: res.result.total + 1,
            sceneImage: sceneDetail.head_image,
            sceneName: sceneDetail.name
          }
        }).then(res => {
          Taro.hideLoading();
          Taro.navigateTo({ url: `/pages/markup/markup?sceneId=${sceneDetail.id}` })
        })
      });

    }
  }

  buildHeader() {
    const { sceneDetail } = this.state;
    return (
      <Swiper
        className='head-swiper'
        circular
        style="z-index: -999">
        {sceneDetail.images.map((image, index) => {
          return (
            <SwiperItem key={index}>
              <Image className="head-img" src={image}></Image>
            </SwiperItem>
          )
        })}
      </Swiper>
    );
  }

  openPhoneCall(phone) {
    Taro.makePhoneCall({ phoneNumber: phone });
  }




  buildContent() {
    let { margin, sceneDetail, readmore, brief, commentList } = this.state;
    let subIntro = sceneDetail.introduction ? sceneDetail.introduction.substring(0, 20) + '...' : '加载中';
    return (
      <View className="content-container" style={`margin-top: -${margin}px`}>
        <View className="content at-row at-row__align--center at-row__justify--around ">
          <View className="at-col at-col-7 title-container">
            <View className="title">
              {sceneDetail.name}
            </View>
            <View className="brief">
              {brief}
            </View>
          </View>
          <View className="at-col at-col-3  rate">
            <View className="rate-txt">{sceneDetail.score}</View>
            <AtRate size={15} value={sceneDetail.score} />
          </View>
        </View>
        <View className="divider"></View>
        <View onClick={this.openRoutePlan.bind(this, sceneDetail.address)} className="menu-container at-row at-row__align--center at-row__justify--between">
          <View className="menu at-row  at-col-9 at-row__align--center at-row__justify--start">
            <View className="at-icon at-icon-map-pin"></View>
            <View className="menu-title">{sceneDetail.address}</View>
          </View>
          <View className="menu-link at-row  at-col-2 at-row__align--center at-row__justify--around">
            <View>地图</View>
            <View className="at-icon at-icon-chevron-right"></View>
          </View>
        </View>
        <View className="divider"></View>
        <View onClick={this.openPhoneCall.bind(this, sceneDetail.phone)} className="menu-container at-row at-row__align--center at-row__justify--between">
          <View className="menu at-row  at-col-9 at-row__align--center at-row__justify--start">
            <View className="at-icon at-icon-phone"></View>
            <View className="menu-title">{sceneDetail.phone}</View>
          </View>
          <View className="menu-link at-row  at-col-2 at-row__align--center at-row__justify--around">
            <View>电话</View>
            <View className="at-icon at-icon-chevron-right"></View>
          </View>
        </View>
        <View className="divider2x"></View>
        <View className="intro-container">
          <View className="intro-title ">
            景点介绍
          </View>
          <View className="intro-detail" >
            {readmore ? sceneDetail.introduction : subIntro}
          </View>
          <View className='readmore-tip' onClick={this.toggle.bind(this)}>{readmore ? '收起' : '显示更多'}</View>
        </View>
        <View className="divider2x"></View>
        <View className="intro-container">
          <View className="intro-title ">
            风景图片
          </View>
          <ScrollView
            className='scrollview'
            scrollX
            scrollWithAnimation
          >
            {sceneDetail.images.map((image, index) => {
              return (
                <View className="scrollview-item" key={index}>
                  <Image src={image}></Image>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <View className="divider2x"></View>
        <View className="intro-container">
          <View className="intro-title">
            景点信息
          </View>
          <View>
            <View className="at-row table-row at-row__align--center">
              <View className="table-title at-col at-col-2">优待政策</View>
              <View className="table-content at-col at-col-9">{sceneDetail.policy}</View>
            </View>
            <View className="at-row table-row at-row__align--center">
              <View className="table-title at-col at-col-2">开放时间</View>
              <View className="table-content at-col at-col-9">{sceneDetail.open_time}</View>
            </View>
            <View className="at-row table-row at-row__align--center">
              <View className="table-title at-col at-col-2">用时建议</View>
              <View className="table-content at-col at-col-9">{sceneDetail.suggested_time}小时</View>
            </View>
          </View>
        </View>
        <View className="divider2x"></View>
        <View className="intro-container">
          <View className="intro-title">
            用户评价
          </View>
          <View>
            {commentList.map(comment => {
              return (
                <View className="comment">
                  <View className="commet-head at-row at-row__align--center">
                    <Image className="comment-avatar" src={comment.userInfo.avatarUrl}></Image>
                    <View className="comment-user">
                      <View className="comment-username">{comment.userInfo.name}</View>
                      <View className="at-row at-row__align--center">
                        <AtRate size={15} value={comment.rate}></AtRate>
                        <View className="comment-date">{comment.date}</View>
                      </View>
                    </View>
                  </View>
                  <View className="commet-txt">
                    {comment.comment}
                  </View>
                </View>
              )
            })}

          </View>
        </View>
      </View>
    );
  }

  buildOperation() {
    const { isMark } = this.state;
    return (
      <View className="operation-container at-row at-row__align--center at-row__justify--center">
        <View className="operation at-row at-row__align--center at-row__justify--center">
          <View onClick={this.openMarkup.bind(this)} className="operation-item  scene-check at-row at-row__align--center at-row__justify--center">
            <View className="at-icon at-icon-check-circle"></View>
            <View className="operation-txt">{isMark ? '已打卡' : '景点打卡'}</View>
          </View>
        </View>
      </View>
    );
  }

  toggle() {
    const { readmore } = this.state;
    this.setState({ readmore: !readmore });
    return;
  }

  render() {
    return (
      <View className='container'>
        <NavBar></NavBar>
        {this.buildHeader()}
        {this.buildContent()}
        {this.buildOperation()}
      </View>
    )
  }

}
