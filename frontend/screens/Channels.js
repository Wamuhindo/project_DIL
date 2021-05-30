import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components';
import openSocket from 'socket.io-client';
const { width } = Dimensions.get('screen');
import { TouchableOpacity } from 'react-native';
import materialTheme from '../constants/Theme';
import ChannelItem from '../components/ChannelItem';
import { AsyncStorage } from 'react-native';
import {url} from '../constants/url';



export default class Channels extends React.Component {

  state = {
    isEditing: false,
    channels: [],
    totalChannels: 0,
    channelLoading: true,


  };

  

  _retrieveData = async (key) => {
     try {
       const value = await AsyncStorage.getItem(key);
    
         return value;
       
     } catch (error) {
       // Error retrieving data
       return null;
     }
   };
 

  componentDidMount() {

    this.loadChannels();
    const socket = openSocket(url);
    socket.on('channels', data => {
      if (data.action === 'assign') {
        this.addChannel(data.channel);
      } else if (data.action === 'delete') {
        this.loadChannels();
      }
    });
  }

  addChannel = channel => {
    this.setState(prevState => {
      const updatedChannels = [...prevState.channels];
      
      updatedChannels.unshift(channel);
   
      return {
        channels: updatedChannels,
        totalChannels: prevState.totalChannels + 1
      };
    });
  };

  loadChannels = () => {
    const { navigation, route } = this.props;
    const token = route.params?.token;
    const userId =route.params?.userId;
    //console.log(this.props)
    //console.log("usrId: ",userId)
    //console.log("token: ",token)
    fetch(url+'/feed/channels/' + userId, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch channels.');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          channels: resData.channels.map(channel => {
            return {
              ...channel,
            };
          }),
          totalChannels: resData.totalItems,
          channelLoading: false
        });
      })
      .catch(err=>{
        console.log(err);
      });
  };


  renderSearch = () => {
    const { navigation } = this.props;
    const iconContent = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconContent}
        placeholder="Type a channel name?"
        onFocus={() => navigation.navigate('Search')}
      />
    )
  }
  

  renderChannels = () => {

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
            {this.state.channels.map((el) => (
                <ChannelItem route={{params:{token:this.props.route.params?.token,userId:this.props.route.params?.userId}}} channel = {el}     
                id={el._id}
                key={el._id}/> 
            ))}
  
      </ScrollView>
    )
  }



  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderChannels()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width,
    paddingVertical: theme.SIZES.BASE/6,
  },
});
