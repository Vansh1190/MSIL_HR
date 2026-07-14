//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import Text from '../../components/reusable/Text';
import { GlobalColor } from '../../constants/Colors';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { showErrorMessage } from '../../Utils/Utils';
import { Header } from '../../components/reusable/Header';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import { Decrypt } from '../../Service/Helper';
import moment from 'moment';


const PFBalance = () => {
    const [loader, setLoader] = useState(false)
    const [taxData, setTaxData] = useState([]);
    const [taxSaving, setTaxSaving] = useState();
    const [month, setMonth] = useState();
    const [employeePf, setEmployeePf] = useState();
    const [employerPf, setEmployerPf] = useState();
    const [netBalance, setNetBalance] = useState();
    const { authContext, AppUserData } = useContext(AuthContext);
    const [refresh, setrefresh] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [taxModalVisible, setTaxModalVisible] = useState(false);
    const [pfModalVisible, setPfModalVisible] = useState(false);
    const [savingModalVisible, setSevingModalVisible] = useState(false);

    const stopLoader = () => {
        setLoader(false);
        setrefresh(false);
    }

   // // Pf Balance Api 
  const PfBalance = async (year) => {
    //set Loader
    setLoader(true);

    try {

      //get Api Data
      let result = await ApiService.PostMethode('/GetPFStatement', {
        "EmplID": AppUserData?.data?.userId,
        "FNYR": year
      }, AppUserData.token)

      //stop Loader
      stopLoader();
      if(result.Value){
// $&
        //Set Data
        let CB1_CB2 = Decrypt(result.Value.Table3[0].PFST_CB1_CB2)
        let PFST_MUL_CB3 = Decrypt(result.Value.Table3[0].PFST_MUL_CB3)
        let NetBalance = parseFloat(CB1_CB2) + parseFloat(PFST_MUL_CB3);

// $&

        setEmployeePf(CB1_CB2)
        setEmployerPf(PFST_MUL_CB3)
        setNetBalance(parseFloat(NetBalance).toFixed(2))
      }

    } catch (error) {
      //stop Loader
      stopLoader()
      //Show Error Massage
      ApiService.showErrorMessage(error, authContext);
      
    }
  };

    useEffect(() => {
        // PfBalance()
        getfinancialyear();
    }, []);


    // useFocusEffect(
    //     React.useCallback(() => {
    //       const unsubscribe = getfinancialyear();
    //       return () => unsubscribe;
    //     }, []),
    //   );
    
      const getfinancialyear = () => {
        let apiData = {
          UserName: AppUserData?.data?.username,
        };
        // AppUserData?.data?.userId 222852
        let token = AppUserData.token;
        setLoader(true);
        ApiService.PostMethode('/LeaveStatus', apiData, token, authContext)
          .then(result => {
// $&
            stopLoader(false);
            if (result.Value) {
            //   setFinancialYear(result.Value.Table1);
              if (result.Value && result.Value.Table1[0].FNYR_YEAR) {
                PfBalance(Decrypt(result.Value.Table1[0].FNYR_YEAR));
              }
            } else {
              Toast.show('No Leave type found');
            }
          })
          .catch(error => {
            stopLoader(false);
            // // console.log($1);
            ApiService.showErrorMessage(error, authContext);
          });
      };







    if(loader){
        return(
            <SafeAreaView style={{ flex: 1,backgroundColor: GlobalColor.PrimaryLight  }}>
                <Header title="PF Balance" back/>
                <LoadingScreen/>
            </SafeAreaView>          
        )
      }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>
            <Header title="PF Balance" back />
            <View style={[styles.MainCard, { padding: 10,backgroundColor: GlobalColor.White }]}>
                <View>
                    <View style={styles.textContainer}>
                        <Text Bold style={{ fontSize: 13}} >Employee's</Text>
                        <Text Bold style={{ fontSize: 13}}>
                            Rs.{employeePf}
                        </Text>
                    </View>
                    <View style={{ borderBottomWidth:0.5,marginHorizontal:5, borderColor:GlobalColor.Secondary,}}/>
                    <View style={styles.textContainer}>
                        <Text Bold style={{ fontSize: 13}} >Employer's</Text>
                        <Text Bold style={{ fontSize: 13}}>
                            Rs.{employerPf}
                        </Text>
                    </View>
                    <View style={{ borderBottomWidth:0.5,marginHorizontal:5, borderColor:GlobalColor.Secondary,}}/>
                    <View style={styles.textContainer2}>
                        <Text Bold style={{fontSize:16}}>Net Balance</Text>
                        <Text Bold style={{fontSize:16}}>
                            Rs.{netBalance}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PFBalance

const styles = StyleSheet.create({

    textContainer: {
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,

    },
    textContainer2:{
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginVertical: 13,
 
    },
    MainCard: {

        margin: 10,
        shadowColor: GlobalColor.Black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 3.0,
        elevation: 3,
        borderRadius: 4,
    }


})