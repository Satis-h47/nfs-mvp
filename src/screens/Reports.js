import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import GoBack from "../components/GoBack";
import { useTrips } from '../context/TripContext'
import MaterialReports from './MaterialReports'
import AgencyReports from './AgencyReports'

const Reports = ({ navigation }) => {
  const { globalApi, token, theme } = useTrips();
  const [activeTab, setActiveTab] = useState('material');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
        <GoBack navigation={navigation} />
        {/* Header */}
        <Text
          style={{
            fontSize: 20,
            paddingTop: 2,
            fontWeight: "bold",
            color: theme.colors.btnBack,
            textAlign: 'center',
            marginVertical: Platform.OS === 'ios' ? 25 : 0
          }}
        >
          Reports
        </Text>
      </View>
      <View style={[styles.tabContainer ,{backgroundColor: theme.colors.border}]}>
  <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 'material' && styles.activeTab, activeTab === 'material' && {backgroundColor: theme.colors.btnBack}
    ]}
    onPress={() => setActiveTab('material')}
  >
    <Text
      style={[
        styles.tabText, {color: theme.colors.text},
        activeTab === 'material' && styles.activeTabText,
        activeTab === 'material' && {color: '#fff'}
      ]}
    >
      Material Reports
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tab,
      activeTab === 'agency' && styles.activeTab,activeTab === 'agency' && {backgroundColor: theme.colors.btnBack}
    ]}
    onPress={() => setActiveTab('agency')}
  >
    <Text
      style={[
        styles.tabText, {color: theme.colors.text},
        activeTab === 'agency' && styles.activeTabText, activeTab === 'agency' && {color: '#fff'}
      ]}
    >
      Agency Reports
    </Text>
  </TouchableOpacity>
</View>

<ScrollView>
  {activeTab === 'material' && <MaterialReports />}
  {activeTab === 'agency' && <AgencyReports />}
</ScrollView>

    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
  flexDirection: 'row',
  borderRadius: 8,
  padding:2,
  // backgroundColor: '#eee',
  marginVertical: 10,
  overflow: 'hidden',
},

tab: {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
},

activeTab: {
  // backgroundColor: '#4A90E2',
  borderRadius:8,
},

tabText: {
  // color: '#555',
  fontWeight: '500',
},

activeTabText: {
  // color: '#fff',
  fontWeight: 'bold',
},

});
