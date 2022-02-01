import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


export class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
    container: {
       flex:1,
       justifyContent: 'center', 
       alignItems: 'center' 
    } 
 })