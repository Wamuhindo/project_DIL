import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

export default class Onboarding extends React.Component {
  render() {
    const { navigation,route } = this.props;
    const token = route.params?.token;
    const userId =route.params?.userId;
    const user =route.params?.user;
    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          <Image
            source={ Images.Onboarding }
            style={{ height: height , width, zIndex: 0, opacity:0.6}}
          />
        </Block>
        <Block flex={1.3} space="between" style={styles.padded}>
          
        <LinearGradient
              style={styles.gradient}
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} />
           
          
          <Block center style={{ paddingBottom: 30, top:-27 }}>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={() => navigation.navigate('App', { token: token,userId:userId,user:user })}>
              CHANNELS
            </Button>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={() => navigation.navigate('App')}>
              FIND A DOCTOR
            </Button>
          </Block>
          <Block style={{top:-30,  paddingHorizontal: theme.SIZES.BASE * 2,  zIndex: 3 ,marginBottom:30}}>
              <Text style={{textAlign:"center"}} size={16} color='rgba(255,255,255,0.4)'>
               Your healthcare is our priority 
              </Text>
            </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  padded: {
    // paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
    
    marginTop:185,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginBottom: 15,
    zIndex:10
   
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 8,
    marginLeft: 12,
    borderRadius: 2,
    height: 22
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    top: 33 + theme.SIZES.BASE,
    left: 0,
    right: 0,
    height: 400,
  },
});
