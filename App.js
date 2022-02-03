import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet} from 'react-native';
import {Start} from './components/start';
import {Chat} from './components/chat';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';

//create the navigator
const Stack = createStackNavigator();


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
  return (
    <NavigationContainer style={styles.container}>
      <StatusBar />
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat' component={Chat} options={{ title: 'Welcome!' }}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
