import React from "react";
import { Text, TouchableOpacity } from "react-native"
import { useTrips } from "../context/TripContext";

const GoBack = ({navigation}) => {
    const {theme} = useTrips();
    return(
        <TouchableOpacity style={{
            // position:'absolute',
            // backgroundColor:'red',
            justifyContent:'center',
            paddingHorizontal:15,
            // left:0,
            // top:0,
            zIndex:1
            }} onPress={() => navigation.goBack()}>
            <Text style={{
    color: theme.colors.btnBack,
    fontSize: 25,
    // marginRight: 10,
  }}>{'<'}</Text>
        </TouchableOpacity>
    )
}
export default GoBack;