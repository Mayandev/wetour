import Taro, {Component} from "@tarojs/taro";
import React from "react";
import {View} from "@tarojs/components";
import {AtIcon} from "taro-ui";
import './navBar.scss';


export default class NavBar extends Component{

  constructor(props){
    super(props);
    this.state = {
      statusBarHeight: 0,
    };
  }

  componentDidMount() {
    Taro.getSystemInfo({
    }).then(res => {
      this.setState({
        statusBarHeight:  res.statusBarHeight || 0,
      });})
  }

  navBack() {
    Taro.navigateBack();
  }

  render() {
    const style = {
      top: this.state.statusBarHeight  + 'px',
      left: 20 + 'px'
    };
    return(
      <View onClick={() => this.navBack()} className="navbar at-row at-row__align--center at-row__justify--center" style={style}>
          <View className='at-icon at-icon-chevron-left back-icon'></View>
      </View>
    )
  }
}
