import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
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
import RNFetchBlob from 'rn-fetch-blob';

const SalarySlip = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [salaryTypeisModalVisible, setsalaryTypeisModalVisible] = useState(false);
    const [month, setMonth] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [defaultDate, setDefaultDate] = useState('Select Month');
    const [DefaultSalary, setsetDefaultSalary] = useState('');
    const [loader, setLoader] = useState(false);
    const [table1Data, setTable1Data] = useState('');
    const [table2Data, setTable2Data] = useState('');
    const [table3Data, setTable3Data] = useState('');
    const [table4Data, setTable4Data] = useState('');
    const [salaryType, setSalaryType] = useState('');
    const { authContext, AppUserData } = useContext(AuthContext);
    const [refresh, setrefresh] = useState(false);
    const [sap_month, setsap_month] = useState('01');
    const [sap_year, setsap_year] = useState('2024');
    const [sap_selDet, setselDet] = useState('');
    const [sap_salType, setSapSalType] = useState('0');
    const [slryShow, setslryShow] = useState(false);
    const [selectMyDet, setSelectMyDate] = useState(202404);

    let current_date = moment(new Date()).format('DD-MMM-YYYY');

    const GetMonth = () => {
        let token = AppUserData.token;
        let EmplID = AppUserData?.data?.userId;
        let apiData = {
            EmplID: EmplID
        };
        setLoader(true);
        ApiService.PostMethode('/GetSalaryMonth', apiData, token, authContext)
            .then(result => {
                stopLoader();
                let responseData = result.Value;
                let defaultDate = result.Value[0].SHIS_YYMM_CODE;
                let year = Decrypt(defaultDate).substring(0, 4);
                let month = Decrypt(defaultDate).substring(4, 6);
                setsap_month(month);
                setsap_year(year);
                setDefaultDate(defaultDate);
                setMonth(responseData);
                GetSalaryTypeApi(defaultDate);
            })
            .catch(error => {
                stopLoader();
                ApiService.showErrorMessage(error, authContext);
            });
    };

    const GetSalaryTypeApi = (data) => {
        let token = AppUserData.token;
        let EmplID = AppUserData?.data?.userId;
        let apiData = {
            "SalaryMonth": Decrypt(data),
            "EmplID": EmplID,
        };
        setLoader(true);
        ApiService.PostMethode('/GetSalaryType', apiData, token, authContext)
            .then(result => {
                stopLoader();
                if (result.Value) {
                    let responseData = result.Value;
                    setsetDefaultSalary(result.Value[0]);
                    setSalaryType(responseData);
                    setSapSalType(Decrypt(result.Value[0].PYDT_YYMM_RUNNO));
                    setselDet(Decrypt(result.Value[0].date));
                    GetSalaryData(data, result.Value[0].PYDT_YYMM_RUNNO);
                }
            })
            .catch(error => {
                stopLoader();
                ApiService.showErrorMessage(error, authContext);
            });
    };

    const GetSalaryData = (data, salarytype = 0) => {
        let token = AppUserData.token;
        let EmplID = AppUserData?.data?.userId;
        let apiData = {
            "EmplID": EmplID,
            "SalaryMonth": Decrypt(data),
            "SalType": Decrypt(salarytype)
        };
        setLoader(true);
        ApiService.PostMethode('/GetSalaryData', apiData, token, authContext)
            .then(result => {
                let responseData = result.Value.Table2;
                let responseData2 = result.Value.Table3;
                let responseData3 = result.Value.Table4;
                let responseData4 = result.Value.Table5;
                setTable1Data(responseData);
                setTable2Data(responseData2);
                setTable3Data(responseData3);
                setTable4Data(responseData4);
                responseData2 == '' ? setslryShow(true) : setslryShow(false);
                stopLoader();
            })
            .catch(error => {
                stopLoader();
                ApiService.showErrorMessage(error, authContext);
            });
    };

    const actualDownload = async () => {
        let EmplID = AppUserData?.data?.userId;
        let randomNum = Math.random() * 100000;
        let mm = 0;
        let yyS = 0;
        let sapMon = Number(sap_month);
        if (sapMon < 4) {
            mm = sapMon + 9;
        } else {
            mm = sapMon - 3;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (mm >= 10) {
            yyS = Number(sap_year) - 1;
        } else {
            yyS = Number(sap_year);
        }

        let apiData = {
            "EmplID": EmplID,
            "DocType": sap_salType === '0' ? "SAP_OAUTH_MAIN_SLIP" : "SAP_OAUTH_OFFC_SLIP",
            "Year": yyS,
            "Month": mm,
            "PayDate": sap_salType === '0' ? null : sap_selDet
        };

        let token = AppUserData.token;
        setLoader(true);

        try {
            const result = await ApiService.PostMethode('/GetDocFromSap', apiData, token, authContext);
            if (result.Value) {
                const base64Data = result.Value;
                const { dirs } = RNFetchBlob.fs;
                const filePath = `${dirs.DocumentDir}/Salary_Slip${sap_month}${sap_year}year${randomNum}.pdf`;

                await RNFetchBlob.fs.writeFile(filePath, base64Data, 'base64');
                setLoader(false);
                Alert.alert('HR Assist', 'Salary Slip Downloaded Successfully', [
                    {
                        text: 'OK',
                        onPress: () => RNFetchBlob.ios.openDocument(filePath)
                    },
                ]);
            } else {
                setLoader(false);
                Toast.show("Failed to obtain salary slip");
            }
        } catch (e) {
            setLoader(false);
            Toast.show("Something Went Wrong");
        }
    };

    useEffect(() => {
        GetMonth();
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const salaryTypetoggleModal = () => {
        setsalaryTypeisModalVisible(!salaryTypeisModalVisible);
    };

    const stopLoader = () => {
        setLoader(false);
        setrefresh(false);
    };

    if (loader) {
        return (
            <SafeAreaView style={styles.containerLoading}>
                <Header title="Salary Slip" />
                <LoadingScreen />
            </SafeAreaView>
        );
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

            <Header title="Salary Slip" />

            <View style={{ flex: 1, paddingHorizontal: 10, marginVertical: 10 }}>
                <TouchableOpacity
                    style={styles.Salary}
                    onPress={() => {
                        toggleModal();
                    }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}>
                        <Text style={{ fontSize: 13 }} Bold>
                            {Decrypt(defaultDate)}
                        </Text>
                        <Feather name="corner-up-right" size={18} color={'#43C6DB'} />
                    </View>
                </TouchableOpacity>

                <Modal
                    backdropOpacity={0.1}
                    coverScreen={true}
                    isVisible={isModalVisible}>
                    <SafeAreaView>
                        <View style={styles.modal}>
                            <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 55555 }}>
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
                                        <ListEmptyComponent title="No Data Found"></ListEmptyComponent>
                                    );
                                }}
                                keyExtractor={({ item, index }) => index}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            let yeaar = Decrypt(item.SHIS_YYMM_CODE).substring(0, 4);
                                            let montha = Decrypt(item.SHIS_YYMM_CODE).substring(4, 6);
                                            setsap_month(montha);
                                            setsap_year(yeaar);
                                            setSelectMyDate(Decrypt(item.SHIS_YYMM_CODE));
                                            setDefaultDate(item.SHIS_YYMM_CODE);
                                            GetSalaryTypeApi(item.SHIS_YYMM_CODE);
                                            toggleModal();
                                        }}
                                        style={styles.textContainer}>
                                        <Text style={{ paddingVertical: 5, paddingHorizontal: 8, color: "#000", fontSize: 13 }}>{Decrypt(item.SHIS_YYMM_CODE)}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
                <TouchableOpacity
                    onPress={() => {
                        salaryTypetoggleModal();
                    }}
                    style={styles.Salary}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}>
                        {DefaultSalary == '' ? (
                            <Text style={{ fontSize: 13 }}>
                                Select Type
                            </Text>
                        ) : (
                            <Text style={{ fontSize: 13 }}>
                                {Decrypt(DefaultSalary.PYDT_DESCRIPTION)}
                            </Text>
                        )}
                        <Feather name="corner-up-right" size={18} color={'#43C6DB'} />
                    </View>
                </TouchableOpacity>

                <Modal
                    backdropOpacity={0.1}
                    coverScreen={true}
                    isVisible={salaryTypeisModalVisible}>
                    <SafeAreaView>
                        <View style={styles.modal}>
                            <TouchableOpacity
                                style={{ position: 'absolute', top: 5, right: 5, zIndex: 55555 }}>
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
                                data={salaryType}
                                ListEmptyComponent={() => {
                                    return (
                                        <ListEmptyComponent title="No Data Found"></ListEmptyComponent>
                                    );
                                }}
                                keyExtractor={({ item, index }) => index}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            GetSalaryData(defaultDate, item.PYDT_YYMM_RUNNO);
                                            setsetDefaultSalary(item);
                                            setselDet(Decrypt(item.date));
                                            setSapSalType(Decrypt(item.PYDT_YYMM_RUNNO));
                                            salaryTypetoggleModal();
                                        }}
                                        style={styles.textContainer}>
                                        <Text style={{ paddingVertical: 5, paddingHorizontal: 8, color: "#000", fontSize: 13 }}>{Decrypt(item.PYDT_DESCRIPTION)}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
                {selectMyDet < 202404 ? (
                    <ScrollView style={{ backgroundColor: GlobalColor.White, marginVertical: 10 }}>
                        {table1Data.length > 0 ? (
                            <View style={{ paddingHorizontal: 10 }}>
                                <View style={[styles.Table]}>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Pay Element</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Earnings</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Deduction</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Remarks</Text>
                                    </View>
                                </View>
                                <FlatList
                                    data={table1Data}
                                    keyExtractor={({ item, index }) => index}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.Table]}>
                                                <View style={[styles.tableRow, { alignItems: 'center' }]}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: 13, textAlign: 'center' }}>{Decrypt(item.MDESC)}</Text>
                                                </View>
                                                <View style={styles.tableRow}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: GlobalFontSize.P - 2 }}>{Decrypt(item.EARNING)}</Text>
                                                </View>
                                                <View style={styles.tableRow}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: GlobalFontSize.P - 2 }}>{Decrypt(item.DED)}</Text>
                                                </View>
                                                <View style={styles.tableRow}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: GlobalFontSize.P - 2 }}>{Decrypt(item.SHIS_REMARKS)}</Text>
                                                </View>
                                            </View>
                                        );
                                    }} />
                            </View>
                        ) : null}

                        {table4Data.length > 0 ? (
                            <View style={{ paddingHorizontal: 5 }}>
                                <View style={[styles.Table, { justifyContent: 'space-between' }]}>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Earnings</Text>
                                    </View>
                                    <View style={[styles.tableRow, { flex: 1 }]}>
                                        <Text style={{ fontSize: 13 }} Bold>Deduction</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={{ fontSize: 13 }} Bold>Total</Text>
                                    </View>
                                </View>
                                <FlatList
                                    data={table4Data}
                                    keyExtractor={({ item, index }) => index}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.Table, { justifyContent: 'space-between' }]}>
                                                <View style={styles.tableRow}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: 13 }}>{Decrypt(item.EARNING)}</Text>
                                                </View>
                                                <View style={[styles.tableRow, { flex: 1 }]}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: 13 }}>{Decrypt(item.DED)}</Text>
                                                </View>
                                                <View style={styles.tableRow}>
                                                    <Text style={{ color: GlobalColor.Black, fontSize: 13 }}>{Decrypt(item.NET)}</Text>
                                                </View>
                                            </View>
                                        );
                                    }} />
                            </View>
                        ) : null}

                        {table2Data.length > 0 ? (
                            <View style={{ paddingHorizontal: 5 }}>
                                <View style={styles.Table}>
                                    <Text style={{ fontSize: 13 }} Bold>General Message</Text>
                                </View>
                                <FlatList
                                    data={table2Data}
                                    keyExtractor={({ item, index }) => index}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.Table, { flexDirection: 'column' }]}>
                                                <Text style={{ color: GlobalColor.Black, fontSize: 13 }}>{Decrypt(item.GLMS_MESSAGES)}</Text>
                                            </View>
                                        );
                                    }} />
                            </View>
                        ) : null}

                        {table3Data.length > 0 ? (
                            <View style={{ paddingHorizontal: 5 }}>
                                <View style={[styles.Table]}>
                                    <Text style={{ fontSize: 13 }} Bold>Employee Message</Text>
                                </View>
                                <FlatList
                                    data={table3Data}
                                    keyExtractor={({ item, index }) => index}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.Table, { flexDirection: 'column' }]}>
                                                <Text style={{ color: GlobalColor.Black, fontSize: 13 }}>{Decrypt(item.EXMS_MESSAGES)}</Text>
                                            </View>
                                        );
                                    }} />
                            </View>
                        ) : null}
                    </ScrollView>
                ) : null}

                {selectMyDet < 202404 ? null : (
                    <Button
                        onPress={() => {
                            actualDownload();
                        }}
                        title="Download Salary Slip"
                        style={{ fontSize: 13 }}
                    ></Button>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    gradient: {
        padding: 20,
    },
    containerLoading: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: GlobalColor.PrimaryLight
    },
    container: {
        flexDirection: 'row',
    },
    modal: {
        position: 'relative',
        paddingVertical: 15,
        height: '100%',
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
        marginVertical: 5,
        paddingVertical: 15,
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
        paddingHorizontal: 5,
        borderBottomWidth: 0.5,
        borderColor: GlobalColor.Secondary,
        paddingVertical: 15
    },
    tableRow: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 0,
        alignSelf: 'center'
    }
});

export default SalarySlip;
