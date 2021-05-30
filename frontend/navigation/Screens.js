import React from "react";
import { Easing, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Icon, Header } from "../components/";
import { Images, materialTheme } from "../constants/";

// screens
import OnboardingScreen from "../screens/Onboarding";

import ChannelsScreen from "../screens/Channels";
import ChannelScreen from "../screens/Channel";

import ChatScreen from "../screens/Chat";


import SignInScreen from "../screens/SignIn";
import SignUpScreen from "../screens/SignUp";

import SearchScreen from "../screens/Search";

import SettingsScreen from "../screens/Settings";
import NotificationsScreen from "../screens/Notifications";
import PrivacyScreen from "../screens/Privacy";
import AboutScreen from "../screens/About";
import AgreementScreen from "../screens/Agreement";

import CustomDrawerContent from "./Menu";


const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();




function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen
        name="Agreement"
        component={AgreementScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Agreement"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Privacy"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="About us"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Notifications Settings"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Dr Angelos"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />

    </Stack.Navigator>
  );
}



export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      
      <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true
        }}
      />
       <Stack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{
          headerTransparent: true
        }}
      />

    <Stack.Screen
        name="Channels"
        component={ChannelsScreen}

        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              title="Channels"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
       <Stack.Screen
        name="Channel"
        component={ChannelScreen}

        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              title="Channel"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen 
      name="App"
      component={AppStack}
      options={{
        header: ({ navigation, scene }) => (
          <Header
            title=""
            navigation={navigation}
            scene={scene}
          />
        ),
        headerTransparent: true
      }} />
    </Stack.Navigator>
  );
}


function HomeStack(props) {
  //console.log(props.route)
  return (
    <Stack.Navigator mode="card" headerMode="screen">

      <Stack.Screen
        name="Channels"
        component={ChannelsScreen}
        initialParams={{userId:props.route.params?.userId,token:props.route.params?.token}}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              title="Channels"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Channel"
        component={ChannelScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Channel"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />

      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Dr Angelos"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title="Search" navigation={navigation} scene={scene} />
          )
        }}
      />
        <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
            back 
            title="Search" 
            navigation={navigation} 
            scene={scene} />
          ),
          headerTransparent: true
        }}
      />
        <Stack.Screen
        name="Log Out"
        component={SignInScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back
             title="Search"
             navigation={navigation}
             scene={scene} />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  //console.log(props)
  return (
    <Drawer.Navigator
    
      style={{ flex: 1 }}
      drawerContent={prop => (
        <CustomDrawerContent {...prop} token={props.route.params?.token} userId={props.route.params?.userId} profile={props.route.params?.user} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Channels"
    >
       <Drawer.Screen
        name="Channels"
        component={HomeStack}
        initialParams={{userId:props.route.params?.userId,token:props.route.params?.token}}
        options={{
          
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />

    <Drawer.Screen
        name="Log Out"
        component={SignInScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        initialParams={{userId:props.route.params?.userId,token:props.route.params?.token}}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-person-add"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
    </Drawer.Navigator>
  );
}
