//import liraries
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    SafeAreaView,
    Alert
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { DataTable } from 'react-native-paper';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast'
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import TextInput2 from '../../components/reusable/TextInput';
import Button from './../../components/reusable/Button';


const ShiftDetails = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [selectDate, setSelectDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [second, setSecond] = useState(false);
    const [textinputDate, setTextinputDate] = useState('');
    const [textinputSecondDate, setTextinputSecondDate] = useState('');
    const [openThird, setOpenThird] = useState(false);
    const [Shift, setShift] = useState([]);
    const [shiftData, setShiftData] = useState([]);
    const [shiftType, setShiftType] = useState([]);
    const [shiftName, setShiftName] = useState('');
    const [currentShift, setCurrentShift] = useState('');
    const [shiftStatus, setShiftStatus] = useState([]);
    const [flexiShiftElig, setFlexiShiftElig] = useState('');
    const [flexidate, setFlexiDate] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [choseDate, setChoseDate] = useState('');
    const { authContext, AppUserData } = useContext(AuthContext);
    const [loader, setLoader] = useState(false)
    const [horizental, setHorizental] = useState(false);

    const LoadInitial = () => {
        GetEmplShift();
    }

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = LoadInitial();
            return () => unsubscribe;
        }, [])
    )

    // SHIFT DETAILS API
    const GetEmplShift = () => {
        let userId = AppUserData?.data?.userId;
        let token = AppUserData.token;
        let fromdate = moment(fromDate).format('DD-MMM-YYYY');
        let toDate = moment(toDate).format('DD-MMM-YYYY');
        let apiData = {
            "FromDate": fromdate,
            "ToDate": toDate,
            "EmplID": userId
        };
        setLoader(true);
        ApiService.PostMethode('/GetEmplShift', apiData, token, authContext)
            .then(result => {
// $&
                setLoader(false);
                let ApiResult = result.Value
                setShiftData(ApiResult)
            })
            .catch(error => {
                setLoader(false);
                // // console.log($1);
                ApiService.showErrorMessage(error, authContext);
            });
    }
    // END 
    return (
        <SafeAreaView style={styles.container}>
            {loader == true ? (
                <Spinner
                    visible={loader}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            ) : null}
                   
                <ScrollView
                    style={{ paddingHorizontal: 10 ,marginBottom:"10%"}}
                    contentContainerStyle={{ flex: 1 }}>
                    <Text style={{ paddingVertical: 10, paddingHorizontal: 0, fontSize: 13, fontWeight: '700' }}>
                        Select Date
                    </Text>
                    <View
                        style={styles.inlineDatepicker}>
                        <DatePicker
                            modal
                            open={open}
                            date={fromDate}
                            mode="date"
                            onConfirm={fromDate => {
                                setOpen(false);
                                setFromDate(fromDate);
                                let format = moment(fromDate).format('MMM Do YYYY');
                                setTextinputDate(format);
// $&
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '49%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <TextInput2
                                placeholder="From"
                                style={{ color: '#000' ,fontSize:12}}
                                editable={false}
                                value={textinputDate}
                            />
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Ionicons name="calendar-outline" size={25} color={'#43C6DB'} />
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            modal
                            open={second}
                            date={toDate}
                            mode="date"
                            onConfirm={toDate => {
                                setSecond(false);
                                setToDate(toDate);
                                let formatSecond = moment(toDate).format('MMM Do YYYY');
                                setTextinputSecondDate(formatSecond);
// $&
                            }}
                            onCancel={() => {
                                setSecond(false);
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '50%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <TextInput2
                                style={{ color: '#000' ,fontSize:13}}
                                placeholder="To"
                                editable={false}
                                value={textinputSecondDate}
                            />


                            <TouchableOpacity onPress={() => setSecond(true)}>
                                <Ionicons name="calendar-outline" size={25} color={'#43C6DB'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, width: "100%", alignSelf: 'center' }}>
                        <Button
                            onPress={() => {
                                GetEmplShift()
                            }}
                            title={"Submit"}
                            style={{fontSize:13}}
                        ></Button>
                    </View>





                    {/* Show Data */}
                    <DataTable
                        style={{
                            width: '100%',
                            backgroundColor: '#fff',
                            marginVertical: 10,
                        }}>
                        <DataTable.Header style={{ backgroundColor: '#fff' }}>
                            <DataTable.Title>
                                <Text Bold style={{ color: GlobalColor.Primary, fontSize: 13 }}>Date</Text>
                            </DataTable.Title>
                            <DataTable.Title numeric>
                                <Text Bold style={{ color: GlobalColor.Primary, fontSize: 13 }}>
                                In
                                </Text>
                            </DataTable.Title>
                            <DataTable.Title numeric>
                                <Text Bold style={{ color: GlobalColor.Primary, fontSize: 13 }}>
                                    Out
                                </Text>
                            </DataTable.Title>
                            <DataTable.Title numeric>
                                <Text Bold style={{ color: GlobalColor.Primary, fontSize: 13 }}>Shift</Text>
                            </DataTable.Title>
                        </DataTable.Header>

                        <FlatList
                            data={shiftData}
                            style = {{marginBottom:210,marginTop:10}}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={[styles.dataRow, { alignItems: 'center' }]}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{fontSize:13}}>{item.START_DATE}</Text>
                                        <Text style={{fontSize:13}}>To</Text>
                                        <Text style={{fontSize:13}}>{item.END_DATE}</Text>
                                    </View>

                                    <Text style={{fontSize:13}}>{item.STD_START}</Text>

                                    <Text style={{fontSize:13}}>{item.STD_STOP}</Text>

                                    <Text style={{ marginRight: 10 ,fontSize:13}}>{item.SHIFT}</Text>
                                </View>
                            )}
                        />
                    </DataTable>
                </ScrollView>                
        </SafeAreaView>
    )
}



// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalColor.PrimaryLight
    },
    box: {
        width: '100%',
        padding: 5,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        // alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.0,
        elevation: 5,
        borderRadius: 0,
    },
    inlineDatepicker: {
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        marginVertical: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputBox: {
        width: '100%',
        // alignSelf: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.0,
        elevation: 5,
        borderRadius: 0,
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
        borderColor: GlobalColor.Secondary
    },
    tabTextStyle: {
        fontSize: GlobalFontSize.P,
        color: 'grey',
        fontFamily: 'Roboto-Bold',
    },
    activeTabStyle: {
        backgroundColor: GlobalColor.PrimaryLight,
        borderBottomWidth: 4,
        borderBottomColor: GlobalColor.Secondary,
    },
    activeTabTextStyle: {
        color: GlobalColor.Secondary,
    },
    spinnerTextStyle:{
        color:GlobalColor.White
    },
    dataRow: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    addtnlBtn: {
        position: 'absolute',
        right: 10,
        top: 0,
        zIndex: 55555
    },
});

//make this component available to the app
export default ShiftDetails