import Taro, { Component, Config } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'
import NavBar from '../../components/navbar/navbar'



import './map.scss'

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
    latitude: 0,
    longitude: 0,
    markers: []

  }
  onCalloutTap(e) {
    console.log(e);
    let id = e.markerId;
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }


  componentWillMount() {
    Taro.getLocation({

    }).then(res => {
      console.log(res);
      let { latitude, longitude } = res;
      this.setState({ latitude, longitude });
    });
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.cloud.callFunction({
      name: 'scene',
      data: {
        name: ''
      }
    }).then(res => {
      console.log(res);
      let sceneList = res.result.data;
      let markers = [];
      sceneList.map((item, index) => {
        let marker = {
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          callout: { content: item.name, padding: 10, display: 'ALWAYS', textAlign: 'center' }
        }
        markers.push(marker);
      })
      this.setState({
        markers
      })
    })
  }

  componentDidHide() { }


  openDetail(id: number) {
  }





  render() {
    const { markers, latitude, longitude } = this.state;
    return (
      <View className='container'>
        <NavBar></NavBar>

        <Map className="map" scale={12} longitude={longitude} latitude={latitude} onCalloutTap={this.onCalloutTap.bind(this)} markers={markers} />
      </View>
    )
  }

}
