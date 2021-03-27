import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import NavBar from '../../components/navbar/navbar'


import thumbnail from '../../assets/markup_headimg.png';
import wechat from '../../assets/icon_wechat.png';
import weibo from '../../assets/icon_weibo.png';
import moment from '../../assets/icon_moment.png';


import './markup.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'WeTour'
  }

  state = {
    markInfo: {},
    rank: 0,
    sceneName: '辛亥革命武昌起义纪念馆',
    date: '20191020',
    image: 'http://img1.bytravel.cn/720/7204/w400869508.jpg',
    tag: '武汉追寻红色文化之旅',
    sceneId: 0,
    comment: null
  }
  openMap() {
    Taro.navigateTo({ url: '/pages/map/map' })
  };
  openRange() {
    Taro.navigateTo({ url: '/pages/arrange/arrange' })
  };


  componentWillMount() {

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    const { sceneId } = this.$router.params;
    Taro.showLoading({
      title: '加载中...'
    })
    Taro.cloud.callFunction({
      name: 'isMark',
      data: {
        sceneId: sceneId * 1,
      }
    }).then(res => {
      console.log(res);
      let data = res.result[0];
      Taro.hideLoading();
      this.setState({
        markInfo: data,
        sceneId: sceneId
      })
    });
    Taro.cloud.callFunction({
      name: 'comment',
      data: {
        sceneId: sceneId * 1,
        operation: 1
      }
    }).then(res => {
      console.log('comment', res);
      this.setState({ comment: res.result[0] })
    });
  }

  componentDidHide() { }


  openDetail(id: number) {
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }

  buildHeader() {
    const { markInfo, tag } = this.state;
    return (
      <View className="head">
        <Image className="thumbnail-img" src={thumbnail} mode="widthFix"></Image>
        <View className="desc">
          <View>{`你是第 ${markInfo.rank} 位打卡${markInfo.sceneName}的人`}</View>
        </View>
        <View className="date">
          {markInfo.date}
        </View>
        <View className="address">
          {`${markInfo.sceneName}`}
        </View>
        <View className="scene-image">
          <Image src={markInfo.sceneImage}></Image>
        </View>
        <View className="tag">
          {tag}
        </View>
      </View>
    )
  }


  buildShare() {
    return (
      <View className="share-container at-row at-row__align--center" onClick={() => this.share()}>
        <View className="share-txt">分享至：</View>
        <Button openType="share" className="share-item at-row at-row__align--center at-row__justify--center">
          <Image src={wechat} className="share-icon"></Image>
          <View className="">微信</View>
        </Button>
        <Button openType="share" className="share-item at-row at-row__align--center at-row__justify--center">
          <Image src={moment} className="share-icon"></Image>
          <View className="">朋友圈</View>
        </Button>
       
      </View>
    );
  }

  buildComment() {
    const { comment } = this.state;
    let content = null;
    if (!comment) {
      content = (
        <View onClick={this.openComment.bind(this)} className="return-btn-container at-row at-row__justify--center">
          <View className="return-btn">去评价</View>
        </View>
      )
    } else {
      content = (
        <View className="comment-container">
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
        </View>)
    }
    return (
      <View>
        {content}
      </View>
    )
  }

  openComment() {
    const { sceneId } = this.state;
    Taro.navigateTo({ url: `/pages/comment/comment?sceneId=${sceneId}` })
  }

  render() {
    return (
      <View className='container'>
        <NavBar></NavBar>
        {this.buildHeader()}
        {this.buildShare()}
        {this.buildComment()}
      </View>
    )
  }
}
