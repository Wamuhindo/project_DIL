import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
// import Animated from 'react-native-reanimated';
import { Block, Text, Button, theme,Input } from 'galio-framework';
import { Icon } from '../components';
import materialTheme from '../constants/Theme';
import Images from "../constants/Images";
import openSocket from 'socket.io-client';
import { iPhoneX, HeaderHeight } from "../constants/utils";
import { TouchableOpacity } from 'react-native-gesture-handler';
import {url} from '../constants/url';
const { height, width } = Dimensions.get('window');
const img = require('../assets/images/channel.png');
const abed = require('../assets/images/abednego.jpg');
const vinay = require('../assets/images/vinay.jpg');
const angelos= require('../assets/images/angelos.jpg');
const irfan = require('../assets/images/irfan.jpg');

const images = new Map();
images.set("abednego", abed);
images.set("irfan",irfan);
images.set("vinay",vinay);
images.set("dr.angelos",angelos);

export default class Channel extends React.Component {
  _isMounted = false;
  state = {
    selectedSize: null,
    postmessage : '',
    commentMessage:'',
    comment:false,
    postId:null,
    begin:true,
    more:null,
    posts: [],
    totalPosts: 0,
    postLoading: true,
    token:"",
    userId:"",
    channelId:"",
  };

  scrollX = new Animated.Value(0);

  

  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted)this.loadPosts();
    const socket = openSocket(url);
    socket.on('posts', data => {
      if (data.action === 'create') {
        if(this._isMounted)this.addPost(data.post);
      } else if (data.action === 'delete') {
        if(this._isMounted)this.loadPosts();
      }else if(data.action === 'createReply'){
        if(this._isMounted)this.addComment(data.post);
      }
    });

  }


  componentWillUnmount() {
    this._isMounted = false;
  }

  addComment = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      
      updatedPosts.map((_post)=>{

        if(_post._id===post.parentId){
          _post.views = post.views;
          _post.replies.push(post);
        }
      });
   
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };


  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      
      updatedPosts.unshift(post);
   
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };

  loadPosts = () => {
    const { navigation, route } = this.props;
    const token = route.params?.token;
    const userId =route.params?.userId;
    const channel = route.params?.channel;

   //console.log(this.props)
    //console.log("usrId: ",userId)
    //console.log("token: ",token)
    fetch(url+'/feed/channelposts/' + channel._id, {
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
        //console.log(resData);
        this.setState({
         posts: resData.posts.map(post => {
            return {
              ...post,
            };
          }),
          totalPost: resData.totalItems,
          postLoading: false
        });
      })
      .catch(err=>{
        console.log(err);
      });
  };


  createPost=(event,postData)=>{
    //event.preventDefault();
    console.log("user",postData.userId)
    console.log("message",postData.message)
    console.log("channel",postData.channelId)
    this.setState({ authLoading: true });
    fetch(url+'/feed/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + postData.token
      },
      body: JSON.stringify({
        message: postData.message,
        user: postData.userId,
        channel: postData.channelId,
        type:"parent",
        parentId:null
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not create post!');
        }
        return res.json();
      })
      .then((resData) => {
        //console.log(resData);
        if(this._isMounted)this.setState({postmessage:''})
      })
      .catch(err => {
        console.log(err);

      });



  }


  createComment=(event,commentData)=>{
    //event.preventDefault();
    console.log("user",commentData.userId)
    console.log("message",commentData.message)
    console.log("channel",commentData.channelId)
    console.log("postId",commentData.postId)
    this.setState({ authLoading: true });
    fetch(url+'/feed/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + commentData.token
      },
      body: JSON.stringify({
        message: commentData.message,
        user: commentData.userId,
        channel: commentData.channelId,
        type:"reply",
        parentId:commentData.postId
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not create post!');
        }
        return res.json();
      })
      .then((resData) => {
        //console.log(resData);
        if(this._isMounted)this.setState({commentMessage:'',comment:false})
      })
      .catch(err => {
        console.log(err);

      });

  }

  renderPostInput = () => {
    const { navigation } = this.props;
    const iconContent = <Icon size={16} color={theme.COLORS.MUTED} name="send" family="material" />

    return (
      <Input
        right
        color="black"
        style={this.state.postmessage.trim()==''?styles.search:styles.searchText}
        placeholder="Post Something"
        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
        onChangeText={(value)=>this.handleTextPost(value)}
        multiline={true}
        value={this.state.postmessage}
      />
    )
  }
  renderCommentInput=()=>{
 
    const { navigation, route } = this.props;
    // const { params } = navigation && navigation.state;
    // const product = params.product;
    const channel = route.params?.channel;
    const userId = route.params?.userId;
    const token = route.params?.token;



    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <Block row>
            <Input
                right
                color="black"
                style={this.state.commentMessage.trim()==''?styles.search:styles.searchText}
                placeholder="Your comment"
                onChangeText={(value)=>this.handleTextComment(value)}
                multiline={true}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                value={this.state.commentMessage}
            />
                {this.state.commentMessage.trim()!=''?
                <TouchableOpacity 
                style={{paddingVertical:15}}
                onPress={(e)=>this.createComment(e,{message:this.state.commentMessage,userId:userId,channelId:channel._id,token:token,postId:this.state.postId})}
                
                >
                    <Icon size={30} color={materialTheme.COLORS.BUTTON_COLOR} name="send" family="material" />
                </TouchableOpacity>
                :<Text></Text>}
        </Block>
        </KeyboardAvoidingView>
    )

  }
  renderChannelTitle = () => {
    const { navigation, route } = this.props;
    // const { params } = navigation && navigation.state;
    const channel = route.params?.channel;


    return (
        <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }], {useNativeDriver: false})}
      >
          <TouchableWithoutFeedback
            style ={{marginTop:0, zIndex:10, position:'absolute'}}
            onPress={() => navigation.navigate('ChannelInfo', { channel: channels })}
            >
            <Text
            size={30}
            center
            style={{color:"rgba(255,255,255,1)",textTransform:'capitalize'}}
            >{channel.name}
            </Text>
         
          </TouchableWithoutFeedback>
          </ScrollView>
    )
  }
handleTextPost=(value)=>{
this.setState({postmessage:value})

}
handleTextComment=(value)=>{
    this.setState({commentMessage:value})
    if(this.state.commentMessage.trim()==='')this.setState({begin:false})
    }

onPressComment=(postId)=>{
    this.setState({postId:postId,comment:true})
}

hideCommentInput=()=>{
    this.state.commentMessage.trim()===''&&this.state.comment===true?this.setState({comment:false,begin:true}):this.setState({})
}

handleMoreReply=(postId)=>{
    this.setState({more:postId});
}
  dateToTime=(date)=>{
    let _date = new Date(date);
    let _today = new Date();
    if(_today.getDate()>_date.getDate()){
         let days= _today.getDate()-_date.getDate();
        if(days<2) return days.toString()+" day ago"
        else if(days<31) return days.toString()+" days ago"
        else if(days<365)return Math.round(days/30)+" months ago"

    }else{

        var hr = _date.getHours();
        var min = _date.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        var ampm = "am";
        if( hr > 12 ) {
            hr -= 12;
            ampm = "pm";
        }
        return hr+":"+min+" "+ampm;
    }
   
  }

  renderGallery = () => {
    const { navigation, route } = this.props;

    const channel = route.params?.channel;
    
    const channelImages = [img];

    return (

     <Block style={{ position:"relative",zIndex:12 }}>
        {channelImages.map((image, index) => (
          <TouchableWithoutFeedback
            key={`channel-image-${index}`}
            >
            <Image
              resizeMode="cover"
              source={ image }
              style={{ width, height: iPhoneX() ? width/3 : width/3 }}
            />
          </TouchableWithoutFeedback>
        ))}
      </Block>
    )
  }

  renderProgress = () => {
    const { route } = this.props;
    const channel = route.params?.channel;
    const channelImages = [channel.image];

    const position = Animated.divide(this.scrollX, width);
    return (
      <Block row>
        {channelImages.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          const width = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [8, 18, 8],
            extrapolate: 'clamp'
          });
          return <Animated.View key={i} style={[styles.dots, {opacity, width}]} />;
        })}
      </Block>
    )
  }

  renderSize = (label) => {
    const active = this.state.selectedSize === label;

    return (
      <TouchableHighlight
        style={styles.sizeButton}
        underlayColor={materialTheme.COLORS.PRICE_COLOR}
        onPress={() => this.setState({ selectedSize: label })}>
        <Text color={active ? theme.COLORS.PRIMARY : null}>{label}</Text>
      </TouchableHighlight>
    );
  }

  renderChatButton = () => {
    const { navigation } = this.props;
    return (
      <Block style={styles.chatContainer}>
        <Button
          radius={28}
          opacity={0.9}
          style={styles.chat}
          color={materialTheme.COLORS.BUTTON_COLOR}
          onPress={() => navigation.navigate('Chat')}>
          <Icon size={16} family="GalioExtra" name="chat-33" color="white" />
        </Button>
      </Block>
    )
  }

  renderChatButtonDoctor = () => {
    const { navigation } = this.props;
    return (
      <Block style={styles.chatContainerDoctor}>
        <Button
          radius={10}
          opacity={0.9}
          style={styles.chatDoctor}
          color={materialTheme.COLORS.BUTTON_COLOR}
          onPress={() => navigation.navigate('Chat')}>
          <Icon size={16} family="GalioExtra" name="chat-33" color="white" />
        </Button>
      </Block>
    )
  }
  render() {
    const { selectedSize } = this.state;
    const { navigation, route } = this.props;
    // const { params } = navigation && navigation.state;
    // const product = params.product;
    const channel = route.params?.channel;
    const userId = route.params?.userId;
    const token = route.params?.token;

    return (
       
        <Block flex style={styles.product}>
            
   
            <Block>
            {this.renderGallery()}
            </Block>
            <Block center flex style={{position:'absolute',top:50,zIndex:15}}>
                {this.renderChannelTitle()}
            </Block>
            <Block row >
                {this.renderPostInput()}
                {this.state.postmessage.trim()!=''?
                <TouchableOpacity 
                style={{paddingVertical:15}}
                onPress={(e)=>this.createPost(e,{message:this.state.postmessage,userId:userId,channelId:channel._id,token:token})}
                >
                    <Icon size={30} color={materialTheme.COLORS.BUTTON_COLOR} name="send" family="material" />
                </TouchableOpacity>
                :<Text></Text>}
            </Block> 
          <ScrollView style={{position:"relative"}} vertical={true} showsVerticalScrollIndicator={false}>
            {   
                this.state.posts.map((post)=>{

                    let i = 0;
                     
                    return(
                        <Block 
                        key={post._id}
                        id={post._id}
                        flex 
                        style={styles.options}>
                          <Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingTop: theme.SIZES.BASE * 2 }}>
                            <Block row space="between">
                              <Block row>
                                <Image source={images.get(post.user.name.toLowerCase())} style={styles.avatar} />
                                <Block>
                                  <Text size={16} style={{fontWeight:"700",textTransform:"capitalize"}}>{post.user.name+" "+post.user.surname}</Text>
                                  <Text size={14} style={{textTransform:"capitalize"}} muted>{post.user.address}</Text>
                                </Block>
                              </Block>
                              <Text size={14} muted bold>{this.dateToTime(post.createdAt)}</Text>
                            </Block>
                            <Block>
                            <Text 
                            size={16} muted style={{color:'rgba(0,0,234,0.8)'}}
                            >
                               {post.tags.map((tag)=>{ return "#"+tag+" "})}
                            </Text>
                            </Block>
                          </Block>
                          <Block style={{ padding: theme.SIZES.BASE }}>
                            <Block card style={{ marginTop: 0, paddingHorizontal:10,paddingTop:10,paddingBottom:15 }}>
                                <TouchableWithoutFeedback
                                muted
                                onPress={()=>this.hideCommentInput()}
                                >
                                    <Block row>
                                    <Text size={16} >{post.message}</Text>
                                    </Block>
                                </TouchableWithoutFeedback>
                            </Block>
                            <Block row>
                                <Block flex middle style={[styles.size, styles.roundBottomLeft ]}>
                                    <Text muted style={{color:"rgba(0,0,234,0.6)"}}>{post.views+" views"}</Text>
                                </Block>
                                <Block flex middle style={[styles.size, { borderBottomWidth: 0 } ]}>
                                    <Text muted style={{color:"rgba(0,0,234,0.6)", backgroundColor:'rgba(240,240,240,0.95)',padding:5,borderRadius:7}}>{post.replies.length+" replies"}</Text>
                                </Block>
                                <Block flex middle style={[styles.size, styles.roundBottomRight  ]}>
                                    <TouchableOpacity
                                    onPress={()=>this.onPressComment(post._id)}
                                    >
                                        <Text muted style={{color:"rgba(0,0,234,0.6)", backgroundColor:'rgba(240,240,240,0.95)',padding:5,borderRadius:7}}>
                                            {"Reply "} 
                                            <Icon size={16} style={{color:"rgba(0,0,234,0.6)",marginLeft:5}} family="MaterialIcons" name="reply" /></Text>
                                    </TouchableOpacity>   
                                </Block>
                              </Block>
                          </Block>
                      {post.replies.map((reply)=>{
                          ++i;
                          if(this.state.more!==post._id && i>=3) return;
                          return (    
                          <Block
                           style={{width: width-200, marginLeft:40, marginRight:60, paddingRight:5}}
                           key={reply._id+""+reply.user.name}
                           >
                                <Block row space="between">
                                    <Block row>
                                        <Block  style={{paddingTop:5}}>
                                        <Image source={images.get(reply.user.name.toLowerCase())} style={styles.avatarReply} />
                                        </Block>
                                        <Block  style={{ borderRadius:10,padding:8, marginBottom:8, backgroundColor:"rgba(240,240,240,0.95)"}}>
                                        <Text size={16} style={{fontWeight:"700",textTransform:"capitalize"}}>{reply.user.name+" "+reply.user.surname}</Text>
                                        <Text size={14} muted>{reply.message}</Text>
                                        <Block flex right style={{marginTop:6,justifyItems:"flex-end"}}>
                                        <Text  size={14} style={{fontWeight:"600"}}>{this.dateToTime(reply.createdAt)}</Text>
                                        </Block>
                                        </Block>
                                    </Block>
                                    <Block>
                                    {reply.user.expertise!=null &&reply.user.expertise!=undefined && reply.user._id!==userId?this.renderChatButtonDoctor():<Text></Text>}
                                </Block>    
                                </Block>
                          </Block>)})}
                          <Block>
                          {this.state.more!==post._id &&post.replies.length>=3?
                        <TouchableOpacity
                        onPress={()=>this.handleMoreReply(post._id)}
                        >
                            <Text center style={{color:"rgba(0,0,234,0.6)"}}>
                                {'more replies'}
                            </Text>
                        </TouchableOpacity>:
                        <Text></Text>  
                        }
                          </Block>
                        </Block>
                    );
                })
            }
          </ScrollView>
          <Block style={{position:"absolute", bottom:5,backgroundColor:"rgba(250,250,250,0.9)"}}>
            {this.state.comment?this.renderCommentInput():<Text></Text>}
          </Block>
        </Block>
       
    );
  }
}

const styles = StyleSheet.create({
  product: {
    //marginTop: Platform.OS === 'android' ? HeaderHeight : 0,
  },
  options: {
    position: 'relative',
    //marginHorizontal: theme.SIZES.BASE,
    marginTop: 1 ,
    marginBottom: 1,
    paddingBottom:10,
    //borderTopLeftRadius: 13,s
    //borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
  },
  galleryImage: {
    width: width,
    height: 'auto',
    
  },
  dots: {
    height: theme.SIZES.BASE / 2,
    margin: theme.SIZES.BASE / 2,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  dotsContainer: {
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    left: 0,
    right: 0,
    bottom: height / 12,
    
  },
  addToCart: {
    width: width - theme.SIZES.BASE * 4,
    marginTop: theme.SIZES.BASE * 2,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 1
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  searchText: {
    height: 48,
    width: width - 80,
    marginLeft: 16,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
    marginRight: 8,
  },
  avatarReply: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: "auto",
    marginRight: 8,

  },
  chat: {
    width: 56,
    height: 56,
    padding: 20,
    borderRadius: 28,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 1
  },
  chatDoctor: {
    width: 30,
    height: 30,
    padding: 0,
    borderRadius: 28,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 1
  },
  chatContainer: {
    top: -30,
    right: theme.SIZES.BASE,
    zIndex: 2,
    position: 'absolute',
  },
  chatContainerDoctor: {
    //top: 30,
    //right: theme.SIZES.BASE,
    //zIndex: 2,
    position: 'relative',
  },
  size: {
    height: theme.SIZES.BASE * 3,
    width: (width - theme.SIZES.BASE * 2) / 3,
    borderBottomWidth: 0.5,
    borderBottomColor: materialTheme.COLORS.BORDER_COLOR,
    overflow: 'hidden',
  },
  sizeButton: {
    height: theme.SIZES.BASE * 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: materialTheme.COLORS.PRICE_COLOR,
  },
  roundTopLeft: {
    borderTopLeftRadius: 4,
    borderRightColor: materialTheme.COLORS.BORDER_COLOR,
    borderRightWidth: 0.5,
  },
  roundBottomLeft: {
    borderBottomLeftRadius: 4,
    borderRightColor: materialTheme.COLORS.BORDER_COLOR,
    borderRightWidth: 0.5,
    borderBottomWidth: 0,
  },
  roundTopRight: {
    borderTopRightRadius: 4,
    borderLeftColor: materialTheme.COLORS.BORDER_COLOR,
    borderLeftWidth: 0.5,
  },
  roundBottomRight: {
    borderBottomRightRadius: 4,
    borderLeftColor: materialTheme.COLORS.BORDER_COLOR,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0,
  },
});
