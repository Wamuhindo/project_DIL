import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { withNavigation } from '@react-navigation/compat';

const { width } = Dimensions.get('screen');
import { TouchableOpacity } from 'react-native';
import materialTheme from '../constants/Theme';



 class ChannelItem extends React.Component {
  state = {
    
  }

  render() {
    const {channel,navigation,route} =this.props;
    //console.log("routes",route)
   return( <TouchableOpacity 
    onPress={()=> navigation.navigate('Channel', { channel: channel, token:route.params?.token,userId:route.params?.userId })}
    id={channel._id}
    key={channel._id}
    style={{backgroundColor:"rgba(255,255,255,0.9)",marginTop:2,paddingVertical:15,width:width, paddingHorizontal:15}}
    >
        <Block>
            <Text 
            color = {materialTheme.COLORS.BUTTON_COLOR}
            size={20}
            
            style={{fontWeight:"bold", textTransform:'capitalize'}}
            >
                {"# "+channel.name}
            </Text>
        </Block>
    </TouchableOpacity>)
  }
}
export default withNavigation(ChannelItem);