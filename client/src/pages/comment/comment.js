import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'

import { AtRate } from 'taro-ui'
import NavBar from '../../components/navbar/navbar'


import thumbnail from '../../assets/comment_headimg.png';
import wechat from '../../assets/icon_wechat.png';
import weibo from '../../assets/icon_weibo.png';
import moment from '../../assets/icon_moment.png';


import './comment.scss'

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
    rate: 0,
    sceneId: 0
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
    this.setState({ sceneId })
    console.log(sceneId);

  }

  componentDidHide() { }


  onTextareaBlur(e) {
    this.setState({
      comment: e.detail.value
    })
  }

  handleRateChange(e) {
    this.setState({ rate: e })
  }

  addComment() {
    const { comment, rate, sceneId } = this.state;
    const userInfo = Taro.getStorageSync('userInfo');
    console.log(userInfo);
    Taro.showLoading({
      title: '提交中...'
    })
    if (!comment || rate === 0) {
      Taro.showToast({ title: '请输入评价并打分', icon: 'none' });
      return;
    } else {
      Taro.cloud.callFunction({
        name: 'commentAdd',
        data: {
          sceneId: sceneId * 1,
          comment: comment,
          rate: rate,
          userInfo: userInfo
        }
      }).then(res => {
        console.log(res);
        Taro.showToast({
          title: '提交成功'
        });
        setTimeout(() => {
          Taro.navigateBack();

        }, 1000)
      })
    }
  }

  buildHeader() {
    return (
      <View className="head">
        <Image className="thumbnail" src={thumbnail} mode="widthFix"></Image>
      </View>
    )
  }


  buildComment() {
    return (
      <View className="comment">
        <View className="comment-container at-row at-row__justify--center" style="width:100%">
          <Textarea onBlur={this.onTextareaBlur} style='width:80%;min-height:50px;padding:20rpx;background:#fff;' placeholder="请输入您的评价" ></Textarea>
        </View>
        <View className="return-btn-container at-row at-row__justify--center">
          <View onClick={this.addComment.bind(this)} className="return-btn">发表评价</View>
        </View>
      </View>

    );
  }

  buildRate() {
    const { rate } = this.state;
    let rateText;
    switch (rate) {
      case 1:
        rateText = "很差"
        break;
      case 2:
        rateText = "较差"
        break;
      case 3:
        rateText = "还行"
        break;
      case 4:
        rateText = "推荐"
        break;
      case 5:
        rateText = "力荐"
        break;
      default:
        rateText = ''
        break;
    }

    return (
      <View>
        <View className="rate-txt">{rateText}</View>
        <View className="rate at-row at-row__justify--center">
          <AtRate
            size={30}
            value={rate}
            onChange={this.handleRateChange.bind(this)}
          />
        </View>
      </View>
    );
  }



  render() {
    return (
      <View className='container'>
        <NavBar></NavBar>
        {this.buildHeader()}
        {this.buildRate()}
        {this.buildComment()}
      </View>
    )
  }
}
