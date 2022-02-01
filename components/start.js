import React from 'react';
import { View, Text, Button,  StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const color1 = "#090C08";
const color2 = "#474056";
const color3 = "#8A95A5";
const color4 = "#B9C6AE";

export class Start extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      name: '',
      color: color4,
  };
  };

  changeBgColor = (color) => {
    this.setState({ bgColor: color });
  };

  render() {
    return (
    <ImageBackground source={require('../BgImage.png')} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        
        <Text style={styles.title}>ChatApp</Text>
      
        <View style={styles.box1}> 
        <TextInput onChangeText={(name) => this.setState({name})} value={this.state.name} placeholder='enter your name here' />
        
        <View style={styles.colorBox}>
          <TouchableOpacity color={color1} style={styles.color} onPress={() => this.changeBgColor(this.color)}></TouchableOpacity>
        <TouchableOpacity color={color2} style={styles.color} onPress={() => this.changeBgColor(this.color)}></TouchableOpacity>
        <TouchableOpacity color={color3} style={styles.color} onPress={() => this.changeBgColor(this.color)}></TouchableOpacity>
        <TouchableOpacity color={color4} style={styles.color} onPress={() => this.changeBgColor(this.color)}></TouchableOpacity>
        </View>
        
        
        <Button
          title="Go to Chat" style={styles.button}
          onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name } )}
        /></View>
        
      </View></ImageBackground>
    )
  }
};

const styles = StyleSheet.create({
   container: {
      flex:1,
      justifyContent: 'center', 
      alignItems: 'center', 
   },
   box1: {
    marginBottom: 30,
     height: '44%',
     width: '88%',
     backgroundColor: '#FFFFFF',
     justifyContent: 'space-evenly',
     alignItems: 'center',
     
  
   },
   title: {
     flex: 1,
     fontSize: 45,
     fontWeight: 'bold',
     color: '#FFFFFF',
     marginTop: 60,
     justifyContent: 'center', 
      alignItems: 'center' 
   },
   image:{
     justifyContent:'center',
     width: '100%',
     height: '100%'
   },
   button: {
     width: '88%',
     height: 30,

   },
   colorBox: {
     width: '88%',
     flexDirection: 'row',
     justifyContent: 'space-between',
     flexShrink: 0,
   },
   color: {
     width: 50,
     height: 50,
     borderRadius: 25,
     
   }
})