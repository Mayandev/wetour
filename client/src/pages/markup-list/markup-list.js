import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import NavBar from '../../components/navbar/navbar'

import thumbnail from '../../assets/markup_list_headimg.png';


import './markup-list.scss'

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
    markList: []
  }
  openMap() {
    Taro.navigateTo({ url: '/pages/map/map' })
  };
  openRange() {
    Taro.navigateTo({ url: '/pages/arrange/arrange' })
  };


  componentWillMount() {
    Taro.showLoading({
      title: '加载中...'
    })
    const { sceneId } = this.$router.params;
    Taro.cloud.callFunction({
      name: 'markList',
    }).then(res => {
      console.log(res);
      Taro.hideLoading();
      this.setState({
        markList: res.result.data
      })
    });

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {

  }

  componentDidHide() { }


  openDetail(id) {
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }

  openMarkup(id) {
    Taro.navigateTo({ url: `/pages/markup/markup?sceneId=${id}` })
  }

  buildList() {
    let { markList } = this.state;
    let content;
    if (markList.length === 0) {
      content = (
        <View className="tips">
          暂无打卡数据～
        </View>
      )

    } else {
      content =
        markList.map(item => {
          return (
            <View onClick={this.openMarkup.bind(this, item.sceneId)} className="list-item at-row at-row__align--center at-row__justify--around">
              <View className="at-row at-row__align--center list-header">
                <Image src={item.sceneImage} className="list-img"></Image>
                <View className="list-title">{item.sceneName}</View>
              </View>
              <View className="list-info at-row at-row__align--center">
                <View className="list-date">{item.date}</View>
                <View className="at-icon at-icon-chevron-right"></View>
              </View>
            </View>
          )
        })
    }

    return (
      <View className="list-container">
        {content}
      </View>
    );
  }

  render() {
    return (
      <View className='container'>
        <NavBar></NavBar>

        <Image src={thumbnail} className="thumbnail" mode="widthFix"></Image>
        {this.buildList()}
      </View>
    )
  }
}
