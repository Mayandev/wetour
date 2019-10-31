import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtRate } from 'taro-ui'

import thumbnail from '../../assets/thumbnail.jpg';
import auth_image from '../../assets/icon_wechat_auth.png';
import icon_map from '../../assets/icon_map.png';
import icon_mark from '../../assets/icon_mark.png';
import icon_arrange from '../../assets/icon_arrange.png';

import './index.scss'


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
    sceneList: [],
    showModal: false,
  }
  openMap() {
    Taro.navigateTo({ url: '/pages/map/map' })
  }
  openRange() {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({ url: '/pages/arrange/arrange' })
  }

  openMarkList() {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({url: '/pages/markup-list/markup-list'})
  }


  componentWillMount() {
    this.login();

  }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中...'
    })
    Taro.cloud.callFunction({
      name: 'scene',
    }).then(res => {
      console.log(res);
      Taro.hideLoading();
      this.setState({
        sceneList: res.result.data
      })
    })
  }

  componentWillUnmount() {}

  componentDidShow() {
    
  }

  componentDidHide() { 
    
  }


  openDetail(id: any) {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }

  onGetUserInfo(e) {
    console.log(e);
    const { detail } = e;
    if (detail.errMsg.endsWith('ok')) { // 确认授权
      const userInfo = JSON.parse(detail.rawData);
      const { nickName, gender, avatarUrl } = userInfo;
      Taro.cloud.callFunction({
        name: 'postUserInfo',
        data: {
          name: nickName,
          gender: gender,
          avatarUrl: avatarUrl,
        },
      }).then(res => {
        console.log(res);
          Taro.setStorageSync('userInfo', res.result);
          this.setState({
            showModal: false
          });
          Taro.showToast({
            title: '登录成功'
          })
        })
      
    }
  }

  login() {
    Taro.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log('用户信息', res)
      this.setState({
        userInfo: res.result,
      })
    }).catch(console.log)
  }

  buildHeader() {
    return (
      <View className="head">
        <Image className="thumbnail-img" src={thumbnail} mode="aspectFill"></Image>
        <View className="thumbnail-mask"></View>
        <View className="desc">
          <View className="city-ch">武汉</View>
          <View className="city-en">Wuhan</View>
        </View>
        <View className="weather">
          <Text>13°C ～ 15°C</Text>
        </View>
      </View>
    )
  }

  buildMenu() {
    return (
      <View className="menu-container at-row at-row__align--center at-row__justify--around">
        <View onClick={this.openMap.bind(this)} className="menu-item">
          <Image className="menu-icon" src={icon_map}></Image>
          <View className="menu-txt">景点地图</View>
        </View>
        <View onClick={this.openRange.bind(this)} className="menu-item">
          <Image className="menu-icon" src={icon_arrange}></Image>
          <View className="menu-txt">我的行程</View>
        </View>
        <View onClick={this.openMarkList.bind(this)} className="menu-item">
          <Image className="menu-icon" src={icon_mark}></Image>
          <View className="menu-txt">打卡记录</View>
        </View>
        {/* <View onClick={this.openMap.bind(this)} className="menu-item at-row at-row__align--center at-row__justify--center">
          <View className="at-icon at-icon-map-pin"></View>
          <View>景点地图</View>
        </View>
        <View onClick={this.openRange.bind(this)} className="menu-item at-row at-row__align--center at-row__justify--center">
          <View className="at-icon at-icon-bookmark"></View>
          <View>行程规划</View>
        </View> */}
      </View>
    )
  }

  buildSceneList() {
    const { sceneList } = this.state;
    return (
      <View className="list-container">
        <View className="divider"></View>
        <View className="list-header at-row at-row__align--center at-row__justify--between">
          <View className="header-title">景点推荐</View>
          <View className="more at-row at-row__align--center at-row__justify--center">
            <View>更多</View>
            <View className="at-icon at-icon-chevron-right"></View>
          </View>
        </View>
        <View className="list">
          {
            sceneList.map(item => {
              return (
                <View key={item.id} className="list-item at-row at-row__align--start" onClick={this.openDetail.bind(this, item.id)}>
                  <Image className="scene-img" src={item.head_image}></Image>
                  <View className="scene-desc">
                    <View className="scene-title">{item.name}</View>
                    <View className="at-row rate">
                      <AtRate size={15} value={item.score} />
                      <Text style="margin-left: 20rpx;">{item.score}分</Text>
                    </View>
                    <View className="region">
                      <Text>{item.type} | {item.region}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          }
        </View>
      </View>

    )
  }

  buildModal() {
    return (
      <View className="mask">
        <View className="modal-content">
          <Image src={auth_image} className="auth-img"></Image>
          <View className="tips">请求获得你的头像和昵称</View>
          <Button className="auth-btn" openType="getUserInfo" onGetUserInfo={this.onGetUserInfo}>一键授权</Button>
        </View>

      </View>
    );
  }

  render() {
    const {showModal} = this.state;
    let modalView;
    if (showModal) {
      modalView = this.buildModal();
    } else {
      modalView = (<View></View>)
    }
    return (
      <View className='container'>
        {this.buildHeader()}
        {this.buildMenu()}
        {this.buildSceneList()}
        {modalView}
      </View>
    )
  }
}
