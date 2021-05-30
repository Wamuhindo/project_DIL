import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { Block, Button, Input, Text, theme } from 'galio-framework';

import { LinearGradient } from 'expo-linear-gradient';
import { materialTheme } from '../constants/';
import { HeaderHeight } from "../constants/utils";
import { AsyncStorage } from 'react-native';
import {url} from '../constants/url';
const { width } = Dimensions.get('window');

export default class SignIn extends React.Component {
  state = {
    name: '-',
    password: '-',
    active: {
      name: false,
      password: false,
    },
    isAuth: true,
    token: null,
    authLoading: false,
    userId: null
  }

  handleChange = (_name, value) => {
    this.setState({ [_name]: value });
  }

  _storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(
        key,
        value
      );
    } catch (error) {
      // Error saving data
    }
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

  toggleActive = (_name) => {
    const { active } = this.state;
    active[_name] = !active[_name];

    this.setState({ active });
  }

 handleLogin = (event, authData) => {
    event.preventDefault();
   // console.log(authData.name);
  //  console.log(authData.password);
    this.setState({ authLoading: true });
    fetch(url+'/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: authData.name,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then((resData) => {
        //console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId
        });
        const{navigation} = this.props;
        this._storeData('token', resData.token);
        this._storeData('userId', resData.userId);
        navigation.navigate('Onboarding',{token:resData.token,userId:resData.userId,user:resData.user})
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };



  render() {
    const { navigation } = this.props;
    const { name, password } = this.state;

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1.1 }}
        locations={[0.2, 1]}
        colors={['#6C24AA', '#15002B']}
        style={[styles.signin, {flex: 1, paddingTop: theme.SIZES.BASE * 4}]}>
        <Block flex middle>
          <KeyboardAvoidingView behavior="position" enabled>
            
            <Block flex style={{marginTop:theme.SIZES.BASE * 20}}>
              <Block center>
                <Input
                  borderless
                  color="white"
                  placeholder="Your name"
                  autoCapitalize="none"
                  bgColor='transparent'
                  onBlur={() => this.toggleActive('name')}
                  onFocus={() => this.toggleActive('name')}
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  onChangeText={text => this.handleChange('name', text)}
                  style={[styles.input, this.state.active.name ? styles.inputActive : null]}
                />
                <Input
                  password
                  viewPass
                  borderless
                  color="white"
                  iconColor="white"
                  placeholder="Password"
                  bgColor='transparent'
                  onBlur={() => this.toggleActive('password')}
                  onFocus={() => this.toggleActive('password')}
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  onChangeText={text => this.handleChange('password', text)}
                  style={[styles.input, this.state.active.password ? styles.inputActive : null]}
                />
                <Text
                  color={theme.COLORS.WHITE}
                  size={theme.SIZES.FONT * 0.75}
                  onPress={() => Alert.alert('Not implemented')}
                  style={{ alignSelf: 'flex-end', lineHeight: theme.SIZES.FONT * 2 }}
                >
                  Forgot your password?
                  </Text>
              </Block>
              <Block center flex style={{ marginTop: 20 }}>
                <Button
                  size="large"
                  shadowless
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  style={{ height: 48 }}
                  onPress={(e) => this.handleLogin(e,{
                    name: this.state.name,
                    password: this.state.password
                  })}
                >
                  SIGN IN
                </Button>

              </Block>
            </Block>
          </KeyboardAvoidingView>
        </Block>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  signin: {        
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 1
  },
  input: {
    width: width * 0.9, 
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputActive: {
    borderBottomColor: "white",
  },
});
