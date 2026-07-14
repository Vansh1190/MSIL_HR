import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';

// Import your report components
import IntimationReport from './IntimationReport';
import AdvanceReport from './AdvanceReport';
import SendBackReport from './SendBackReport';

// create a component
const Report = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [selectedReportTab, setSelectedReportTab] = useState(0);
  const {authContext, AppUserData} = useContext(AuthContext);

  let usrAccess = AppUserData?.data?.userFlag;

  useFocusEffect(
    React.useCallback(() => {
      initializeReports();
    }, [])
  );

  const initializeReports = () => {
    setLoader(false);
  };

  const handleReportTabChange = index => {
    setSelectedReportTab(index);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}

      <View showsVerticalScrollIndicator={false} style={styles.container}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginTop: 10,
            paddingHorizontal: 10,
          }}>
          <ScrollView horizontal={true}>
            <SegmentedControlTab
              borderRadius={2}
              values={['Intimation Report', 'Advance Report', 'Send Back Report']}
              selectedIndex={selectedReportTab}
              onTabPress={index => {
                handleReportTabChange(index);
              }}
              tabsContainerStyle={styles.tabsContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTabTextStyle={styles.activeTabTextStyle}
            />
          </ScrollView>
        </View>

        <View style={{flexGrow: 1, paddingHorizontal: 10}}>
          {selectedReportTab == 0 ? <IntimationReport /> : null}
          {selectedReportTab == 1 ? <AdvanceReport /> : null}
          {selectedReportTab == 2 ? <SendBackReport /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: GlobalColor.PrimaryLight,
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  tabStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB',
  },
  tabTextStyle: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#43C6DB',
  },
  activeTabTextStyle: {
    color: '#43C6DB',
  },
  spinnerTextStyle: {
    color: '#fff',
  },
});

//make this component available to the app
export default Report;
