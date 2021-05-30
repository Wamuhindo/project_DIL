import React from "react";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ListView
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

import { Icon, Drawer as DrawerCustomItem } from "../components/";
import { Images, materialTheme } from "../constants/";

const { width } = Dimensions.get("screen");
const abed = require('../assets/images/abednego.jpg');
const vinay = require('../assets/images/vinay.jpg');
const angelos= require('../assets/images/angelos.jpg');
const irfan = require('../assets/images/irfan.jpg');

const images = new Map();
images.set("abednego", abed);
images.set("irfan",irfan);
images.set("vinay",vinay);
images.set("dr.angelos",angelos);


const profiles = {
  avatar: Images.Profile,
  name: "Rachel",
  surname:"Brown",
  address: "Mississipi",
};

function CustomDrawerContent({
  drawerPosition,
  navigation,
  focused,
  profile,
  token,
  userId,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = [
    "Home",
    "Profile",
    "Settings",
  
  ];
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.23} style={styles.header}>
        <TouchableWithoutFeedback
         
        >
          <Block style={styles.profile}>
            <Image source={images.get(profile.name.toLowerCase())} style={styles.avatar} />
            <Text size={25} color={"white"} style={{textTransform:'capitalize'}}>
              {profile.name+" "+profile.surname}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
        <Block row>

          <Text size={16} muted style={styles.seller}>
            {profile.address}
          </Text>

        </Block>
      </Block>
      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === "left" ? insets.left : 0,
              paddingRight: drawerPosition === "right" ? insets.right : 0
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                token = {token}
                userId = {userId}
                user = {profile}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.25} style={{ paddingLeft: 7, paddingRight: 14 }}>
        <DrawerCustomItem
          title="Log Out"
          navigation={navigation}
          focused={state.index === 8 ? true : false}
        />
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#4B1958",
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: "center"
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: "flex-end"
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38
  },
  seller: {
    marginRight: 16,
    textTransform:'capitalize'
  },
});

export default CustomDrawerContent;
