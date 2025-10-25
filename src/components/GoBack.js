import React from "react";
import { Text, TouchableOpacity } from "react-native"

const GoBack = ({navigation}) => {
    return(
        <TouchableOpacity style={{
            // position:'absolute',
            // backgroundColor:'red',
            justifyContent:'center',
            padding:15,
            // left:0,
            // top:0,
            zIndex:1
            }} onPress={() => navigation.goBack()}>
            <Text style={{
    color: "white",
    fontSize: 25,
    // marginRight: 10,
  }}>{'<'}</Text>
        </TouchableOpacity>
    )
}
export default GoBack;