import React, { Component } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { Bubble, Day, SystemMessage, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import 'firebase/firestore';




import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
//import firebase from 'firebase';
//import firestore from 'firebase';

//const firebase = require('firebase');
 //require('firebase/firestore');


//configuring firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyB2d7Xd_9B5S-DwbiEB7myo3nkBvX61v-U",
  authDomain: "chatapp-866bc.firebaseapp.com",
  projectId: "chatapp-866bc",
  storageBucket: "chatapp-866bc.appspot.com",
  messagingSenderId: "842497082223",
  
  appId: "1:842497082223:web:63ea75695aab8e9cfade9a",
  measurementId: "G-6J2BETDT0Y"
};



export class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
      user: {
				_id: '',
				name: '',
				avatar: '',
			},
      isConnected: false,

    };

    //initialize firebase
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
     
    }
    // const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);

    // reference to the Firestore messages collection
		this.referenceChatMessages = firebase.firestore().collection('messages');
    this.refMsgsUser = null;
// To remove warning message in the console 
//LogBox.ignoreLogs([
 // 'Warning: ...',
 // 'undefined',
 // 'Animated.event now requires a second argument for options',
//]);


  };




  onCollectionUpdate = QuerySnapshot => {
		const messages = [];
		// go through each document
		QuerySnapshot.forEach(doc => {
			// get the queryDocumentSnapshot's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: data.user.avatar,
				},
			});
		});
		this.setState({
			messages: messages,
		});
	};


  // get messages from AsyncStorage
	getMessages = async () => {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	};


  // save messages on the asyncStorage
	saveMessages = async () => {
		try {
			await AsyncStorage.setItem(
				'messages',
				JSON.stringify(this.state.messages)
			);
		} catch (error) {
			console.log(error.message);
		}
	};



	// delete message from asyncStorage
	deleteMessages = async () => {
		try {
			await AsyncStorage.removeItem('messages');
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
	};




  componentDidMount() {
    // Set the page title once Chat is loaded
    let name  = this.props.route.params.name;
    // Adds the name to top of screen
    this.props.navigation.setOptions({ title: name })


    // check if user is online
		NetInfo.fetch().then(connection => {
			if (connection.isConnected) {
				this.setState({ isConnected: true });
				console.log('online');
				// listens for updates in the collection
				this.unsubscribe = this.referenceChatMessages
					.orderBy('createdAt', 'desc')
					.onSnapshot(this.onCollectionUpdate);


    // user authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }

    
       //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });

      //referencing messages of current user
      this.refMsgsUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
    });


  // save messages locally to AsyncStorage
  this.saveMessages();
} else {
  // if the user is offline
  this.setState({ isConnected: false });
  console.log('offline');
  this.getMessages();
}
});
}

// Add messages to database
addMessages() {
  const message = this.state.messages[0];
  // add a new message to the collection
  this.referenceChatMessages.add({
    _id: message._id,
    text: message.text || '',
    createdAt: message.createdAt,
    user: this.state.user
  });
}



//attaches messages to chat
onSend(messages = []) {
  this.setState(
    previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.saveMessages();
      this.addMessages();
    });
}

//customizes text bubbles
renderBubble(props) {
  return (
    <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: '#000',
      }
    }}
    />
  )
};


// customizes system messages
renderSystemMessage(props) {
  return (
    <SystemMessage
      {...props}
      textStyle={{
        color: "#fff",
      }}
    />
  );
}

// customizes day messages
  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: "#fff",
        }}
      />
    );
  }

  //customizes input toolbar (hide if offline)
  renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

  
  componentWillUnmount() {
    // close connections when we close the app
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
      }
    });
  }
  





  render() {
   

    let bgColor = this.props.route.params.bgColor;
 
    return (
      <View style={styles.container}>
        <View style={{...styles.container, backgroundColor: bgColor ? bgColor: '#FFF'}}  >
 
        
  <GiftedChat

  renderBubble={this.renderBubble.bind(this)}
  renderSystemMessage={this.renderSystemMessage.bind(this)}
  renderDay={this.renderDay.bind(this)}
  renderInputToolbar={this.renderInputToolbar.bind(this)}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: this.state.user._id,
							name: this.state.name,
							avatar: this.state.user.avatar,
        }}
      />
      
      
{ Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
    container: {
       flex:1, 
    },
    
 
  
 })