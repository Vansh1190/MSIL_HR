//import liraries
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView,PermissionsAndroid, Alert ,Linking} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../components/reusable/Text';
import { Header } from '../../components/reusable/Header';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import { GlobalColor } from '../../constants/Colors';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { showErrorMessage } from '../../Utils/Utils';
import { GlobalFontSize } from '../../constants/FontSize';
import { Decrypt } from '../../Service/Helper';
import Button from '../../components/reusable/Button';
import RNFetchBlob from 'rn-fetch-blob'
import base64 from 'react-native-base64'
   
var i = 1;

const Form16 = ({ navigation }) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [salaryTypeisModalVisible, setsalaryTypeisModalVisible] = useState(false);
    const [month, setMonth] = useState([]);
    const [formType, setFormType] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [defaultDate, setDefaultDate] = useState('Select Month');
    const [DefaultSalary, setsetDefaultSalary] = useState("");
    const [loader, setLoader] = useState(false)
    const [table1Data, setTable1Data] = useState('')
    const [table2Data, setTable2Data] = useState('')
    const [table3Data, setTable3Data] = useState('')
    const [defFormType, setDefFormType] = useState('')
    const [salaryType, setSalaryType = useState] = useState('')
    const { authContext, AppUserData } = useContext(AuthContext);
    const [refresh, setrefresh] = useState(false);

    const [data_filePath, setdata_filePath] = useState('')


    const [sap_month, setsap_month] = useState('01')
    const [sap_year, setsap_year] = useState('2024')
    const [reg_PayslipURL, setreg_PayslipURL] = useState('')
    const [sap_User, setSapUser] = useState('')
    const [sap_Pass, setSapPass] = useState('')
    const [sap_Auth, setSapAuth] = useState('')
    const [sap_selDet, setselDet] = useState('')
    const [sap_salType, setSapSalType] = useState('0')
    const [sap_OffCycleLink, setOffCycleLink] = useState('')
    const [slryShow, setslryShow] = useState(false);
    const [sap_salCutoff, setsap_salCutoff] = useState(202404)
    const [selectMyDet, setSelectMyDate] = useState(202404);


    // // console.log($1);
   let current_date = moment(new Date()).format('DD-MMM-YYYY');
 


 

    actualDownload = () => {
        let EmplID = AppUserData?.data?.userId
        let randomNum = Math.random()* 100000;

        let salarySlipURL = '';

        let mm = 0;
        let yy = 0;
        let yyS = 0;
 
        let sapMon = Number(sap_month);
        if(sapMon < 4)
        {
          mm = sapMon + 9
        }
        else{
            mm = sapMon -3
        }
 
        if(mm < 10)
        {

           
            mm='0'+mm;
        }

        if(mm >= 10)
        {
            yyS = Number(sap_year) - 1;
            // // console.log($1);
        }
       else{
        yyS = Number(sap_year);
       }


        
        // // console.log($1);
        // // console.log($1);
        let uurl = reg_PayslipURL;
        let mainURL = uurl.replace("{EmpID}", EmplID).replace("{Month}", mm).replace("{Year}",yyS);

        let offCy = sap_OffCycleLink;
        let mainURLOffCycle =  offCy.replace("{EmpID}", EmplID).replace("{Month}", mm).replace("{Year}",sap_year).replace("{PayDate}",sap_selDet);

        salarySlipURL = sap_salType  == '0'?mainURL:mainURLOffCycle;

        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        // // console.log($1);
        i++;
        // // console.log($1);
      
        setLoader(true);
        try{
        const { dirs } = RNFetchBlob.fs;
       // let myurl = 'https://sapproxy.maruti.co.in:443/sap/opu/odata/sap/ZPY_REG_PAYSLIP_API_SRV/RegPayslipSet(EmployeeId=%27'+EmplID+'%27,Month=%27'+sap_month+'%27,FinancialYear=%27'+sap_year+'%27)/$value?sap-client=130';
       RNFetchBlob.config({
         fileCache: true,
         addAndroidDownloads: {
         useDownloadManager: true,
         notification: true,
         mediaScannable: true,
         title: `Salary_Slip${sap_month}${sap_year}year ${randomNum}.pdf`,
         path: `${dirs.DownloadDir}/Salary_Slip${sap_month}${sap_year}year ${randomNum}.pdf`,
         },
       })
         .fetch('GET', salarySlipURL, {
          Authorization : 'Basic '+sap_Auth,

         // Authorization : 'Basic QVBJX1RFU1RfMTpNc2lsQCMyMDI0',
        //   Username:base64.encode(sap_User),
        //   Password:base64.encode(sap_Pass)
         })
         .then((res) => {
            setLoader(false);
            Alert.alert('HR Assist', 'Salary Slip Downloaded Successfully', [
                
                {text: 'OK', onPress: () =>
                 //console.log("Ok Press")
                 RNFetchBlob.android.actionViewIntent(res.path(), "application/pdf")
               // Linking.openURL("file:/"+res.path())
                },
              ]);
        //    // console.log($1);
        //    // console.log($1);
         })
         .catch((e) => {
            setLoader(false);
            Toast.show("Something Went Wrong");
        //    console.log(e)
         });
        }

        catch(e)
        {
            setLoader(false);
            Toast.show("Something Went Wrong");
            // // console.log($1);
        }
     }

  





     
     const Form16Download = (filepath) => {
       // console.log($1);
       if (!filepath || filepath.trim() === "") {
         Alert.alert("HR Assist", "Please Select Form 16 Type");
         return;
       }
     
       let token = AppUserData.token;
       let apiData = {
         Type: "Download",
         Name: filepath,
       };
     
       // console.log($1);
       setLoader(true);
     
       ApiService.PostMethode("/proxyFileHandler", apiData, token, authContext)
         .then((result) => {
           stopLoader();
     
           let parsedResult;
           try {
             parsedResult = typeof result === "string" ? JSON.parse(result) : result;
           } catch (e) {
             console.error("Failed to parse API response:", e);
             Alert.alert("Error", "Invalid response format.");
             return;
           }
     
           let base64Data = parsedResult?.name;
           if(base64Data?.substring(0, 100) != "File doesn't exist.")
           {

           // console.log($1);
     
           if (!base64Data || typeof base64Data !== "string") {
             Alert.alert("Error", "No PDF data received.");
             return;
           }
     
           const prefix = "data:application/pdf;base64,";
           if (base64Data.startsWith(prefix)) {
             base64Data = base64Data.slice(prefix.length);
           }
     
           const { fs } = RNFetchBlob;
           const dirs = fs.dirs;
           // Use DownloadDir for Android, DocumentDir for iOS
           const filePath =
             Platform.OS === "android"
               ? `${dirs.DownloadDir}/Form16_${new Date().getTime()}.pdf`
               : `${dirs.DocumentDir}/Form16_${new Date().getTime()}.pdf`;
     
           fs.writeFile(filePath, base64Data, "base64")
             .then(() => {
              // Alert.alert("HR Assist", "Form 16 downloaded successfully.");
               if (Platform.OS === "android") {
                 RNFetchBlob.android.actionViewIntent(filePath, "application/pdf");
               } else {
                 RNFetchBlob.ios.openDocument(filePath);
               }
              
             })
             .catch((err) => {
               //console.error("File write error:", err);
               Alert.alert("Error", "Failed to save PDF.");
             });
           }
           else
           {
            Alert.alert(base64Data?.substring(0, 100));
           }
         })
         .catch((error) => {
           stopLoader();
           ApiService.showErrorMessage(error, authContext);
         });
     };
     
    
    
    
    
    
     
     downloadFile = async () => {
       try {
           const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
             this.actualDownload();
           } else {
             Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
           }
         } catch (err) {
           console.warn(err);
         } 
     }



     const GetMonth = () => {
        let token = AppUserData.token;
        let EmplID = AppUserData?.data?.userId;
        let apiData = {
          StaffNo: EmplID,
        };
      
        setLoader(true);
        ApiService.PostMethode('/GetF16Year', apiData, token, authContext)
          .then(result => {
            stopLoader();
            let responseData = result.Value;
            // console.log($1);
      
            let defaultDate = result.Value[0].FNYR_YEAR_CODE;
            GetFormType(defaultDate);
            // console.log($1);
      
            setDefaultDate(defaultDate);
            setMonth(responseData.slice(0, 3)); // 👈 take only first 3
          })
          .catch(error => {
            stopLoader();
            ApiService.showErrorMessage(error, authContext);
          });
      };
      


    const GetFormType = (yearss) => {
        let token = AppUserData.token;
        let EmplID = AppUserData?.data?.userId;
        let apiData = {
            USER_ID: EmplID,
            YEAR: yearss
        };
    
        // console.log($1);
        setLoader(true);
    
        ApiService.PostMethode('/GetF16LOV', apiData, token, authContext)
            .then(result => {
                stopLoader();
    
                let responseData = result?.Value;
                // console.log($1);
    
                if (Array.isArray(responseData) && responseData.length > 0) {
                    let defaultType = responseData[0]?.LOVM_VALUE_DESC;
                    // console.log($1);
    
                    // Extract the key dynamically
                    const pathKey = Object.keys(responseData[0]).find(key =>
                        key.includes("ATTRIBUTE2") && key.includes("ATTRIBUTE3")
                    );
    
                    if (pathKey) {
                        const fullPath = responseData[0][pathKey];
                        const modifiedPath = fullPath.replace(/^\\\\mydrive\\/, "\\\\10.194.44.21\\");
                        const attribute3 = fullPath.split("\\").pop(); // Extract filename
    
                        // console.log($1);
                        // console.log($1);
    
                        setdata_filePath(modifiedPath);
                    }
    
                    setDefFormType(defaultType);
                    setFormType(responseData);
                } else {
                    // console.log($1);
                    setFormType([]);
                }
            })
            .catch(error => {
                stopLoader();
                ApiService.showErrorMessage(error, authContext);
            });
    };
    
    


  
   


   

    useEffect(() => {
        GetMonth()
      
       
        
    }, [])
    // // console.log($1);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };


    const salaryTypetoggleModal = () => {
        setsalaryTypeisModalVisible(!salaryTypeisModalVisible);
    };







    const stopLoader = () => {
        setLoader(false);
        setrefresh(false);
    }

    if (loader) {
        return (
            <SafeAreaView style={styles.containerLoading}>
                <Header title="Form-16" />
                <LoadingScreen />
            </SafeAreaView>
        )
    }




    return (

        <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: GlobalColor.PrimaryLight }}>
            {loader == true ? (
                <Spinner
                    visible={loader}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            ) : null}


            <Header title="Form-16" />

           
            <View style={{ flex: 1, paddingHorizontal: 10, marginVertical: 10, }}>

                <TouchableOpacity
                    style={styles.Salary}
                    onPress={() => {
                        // GetSalaryTypeApi()
                        toggleModal()
                        // console.log("Sal-1",month)
                    }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}>
                        <Text  style={{fontSize:13}} Bold>
                            {defaultDate}
                        </Text>
                        <Feather name="corner-up-right" size={18} color={'#43C6DB'} />
                    </View>
                </TouchableOpacity>

                {/* salary month modal */}
                <Modal
                    backdropOpacity={0.1}
                    coverScreen={true}
                    isVisible={isModalVisible}>
                    <View style={styles.modal}>
                        <TouchableOpacity style={{ position:'absolute', top:5, right:5, zIndex:55555 }}>
                            <Feather
                                name="x-circle"
                                color={GlobalColor.Danger}
                                size={22}
                                onPress={toggleModal}
                                style={{ margin: 10 }}
                            />
                        </TouchableOpacity>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={month}
                            ListEmptyComponent={() => {
                                return (
                                    <ListEmptyComponent title="No Data Found"
                                    // enableRefresh={true}
                                    // onRefreshCallback={()=>GetShutlPastFutrReportApi(true)} refreshing={refresh}
                                    ></ListEmptyComponent>
                                )
                            }}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                    // console.log($1);
                                      
                                        GetFormType(item.FNYR_YEAR_CODE);
                                        setDefaultDate(item.FNYR_YEAR_CODE)
                                        
                                       
                                        toggleModal()
                                    }}
                                    style={styles.textContainer}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 8, color: "#000", fontSize: 13 }}>{item.FNYR_YEAR_CODE}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
                <TouchableOpacity
                    onPress={()=>{
                        salaryTypetoggleModal()
                    }}
                    style={styles.Salary}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}>
                        {defFormType == '' ? (
                            <Text style={{fontSize:13}}>
                                Select Type
                            </Text>
                        ) : (
                            <Text style={{fontSize:13}}>
                                {defFormType}
                            </Text>

                            // salaryType && salaryType.map((item) => {
                            //     return (
                            //         <Text Bold>
                            //             {Decrypt(item.PYDT_DESCRIPTION)}
                            //         </Text>
                            //     )
                            // })
                        )}
                        <Feather name="corner-up-right" size={18}  color={'#43C6DB'} />
                    </View>
                </TouchableOpacity>

                <Modal
                    backdropOpacity={0.1}
                    coverScreen={true}
                    isVisible={salaryTypeisModalVisible}>
                    <View style={styles.modal}>
                        <TouchableOpacity 
                            style={{ position:'absolute', top:5, right:5, zIndex:55555 }}>
                            <Feather
                                name="x-circle"
                                color={GlobalColor.Danger}
                                size={22}
                                onPress={salaryTypetoggleModal}
                                style={{ margin: 10 }}
                            />
                        </TouchableOpacity>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={formType}
                            ListEmptyComponent={() => {
                                return (
                                    <ListEmptyComponent title="No Data Found"
                                    // enableRefresh={true}
                                    // onRefreshCallback={()=>GetShutlPastFutrReportApi(true)} refreshing={refresh}
                                    ></ListEmptyComponent>
                                )
                            }}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                                const fullPathKey = "ATTRIBUTE2||DECODE(:B3,'EMPL_ID',TO_CHAR(EMPL_ID),EMPL_ITAX_PAN_NO)||ATTRIBUTE3";
                                const originalPath = item[fullPathKey];
                            
                                // Replace '\\mydrive\' with '\\10.194.44.21\'
                                const modifiedPath = originalPath?.replace(/^\\\\mydrive\\/, "\\\\10.194.44.21\\");
                                const escapedPath = modifiedPath?.replace(/\\/g, '\\\\');
                            
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            // console.log($1);
                                            // console.log($1); // Just for logging
                                            // console.log($1);
                                            setDefFormType(item.LOVM_VALUE_DESC);
                                            setdata_filePath(modifiedPath); // Use modified path for API
                                            salaryTypetoggleModal();
                                        }}
                                        style={styles.textContainer}
                                    >
                                        <Text style={{ paddingVertical: 5, paddingHorizontal: 8, color: "#000", fontSize: 13 }}>
                                            {item.LOVM_VALUE_DESC}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            
                            
                            
                            
                            
                        />
                    </View>
                </Modal>
             

 

                <Button
                  onPress={() => {
                   Form16Download(data_filePath);
                 
                  }}
                  title="Download"
                  style={{fontSize:13}}></Button>
                

            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    gradient: {
        padding: 20,
    },
    containerLoading: {
        flex: 1,
        width: '100%', height: '100%',
        backgroundColor: GlobalColor.PrimaryLight
    },
    container: {
        flexDirection: 'row',

    },
    modal: {
        position:'relative',
        paddingVertical: 15,
        height: '100%',
        marginTop:"30%",
       
        width: '100%',
        alignSelf: 'center',
        backgroundColor: GlobalColor.White,
        borderRadius: 3,
        shadowColor: GlobalColor.Black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 3.0,
        elevation: 5,
    },
    Salary: {
        // top: 10,
        marginVertical: 5,
        paddingVertical:15,
        width: '100%',
        backgroundColor: GlobalColor.White,
        alignSelf: 'center',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: GlobalColor.Black,
        shadowOffset: {
            width: -0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 5,
        borderRadius: 3
    },
    textContainer: {
        width: '100%',
        padding: 5,
        backgroundColor: GlobalColor.White,
        alignSelf: 'center',
        // marginVertical: 8.5,
        // shadowColor: GlobalColor.Black,
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.18,
        // shadowRadius: 3.0,
        // elevation: 5,
        // borderRadius:3,
        // paddingVertical: 10,
        // paddingHorizontal: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        borderBottomWidth: 0.5,
        borderColor: GlobalColor.LightDark
    },
    Table: {
        width: '100%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 0,
        borderBottomWidth: 0.5,
        borderColor: GlobalColor.Secondary,
        paddingVertical:15
    },
    tableRow: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 0,
        alignSelf: 'center'
    }
});

// //make this component available to the app
export default Form16;
