import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../components/reusable/Text';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import { GlobalColor } from '../../constants/Colors';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { showErrorMessage } from '../../Utils/Utils';
import { Header } from '../../components/reusable/Header';
import { Decrypt } from '../../Service/Helper';
import Button from '../../components/reusable/Button';
import RNFetchBlob from 'rn-fetch-blob';

const TaxComputationSlip = () => {
    const [loader, setLoader] = useState(false);
    const [TaxData, setTaxData] = useState([]);
    const { authContext, AppUserData } = useContext(AuthContext);
    const [refresh, setrefresh] = useState(false);

    const stopLoader = () => {
        setLoader(false);
        setrefresh(false);
    };

    const GetTaxAppApi = async (isrefresh = false) => {
        if (!isrefresh) {
            setLoader(true);
        }
        ApiService.PostMethode('/GetTaxApp', { "UserName": AppUserData?.data?.username }, AppUserData.token, authContext)
            .then(result => {
                stopLoader();
                if (result.Value.length > 0) {
                    let responseData = result.Value;
                    let arrayData = responseData.map((item) => {
                        return { ...item };
                    });
                    setTaxData(responseData);
                } else {
                    setTaxData([]);
                }
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
        let yyyy = 0;
        let today = new Date();
        yyyy = today.getFullYear();
        let mmm = String(today.getMonth() - 0).padStart(2, '0');

        if (mmm < 4) {
            mm = mmm + 9;
        } else {
            mm = mmm - 3;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        if (mmm >= 10) {
            yyyy = today.getFullYear() - 1;
        }

        let apiData = {
            "EmplID": EmplID,
            "DocType": "SAP_OAUTH_TAX_STAT",
            "Year": yyyy.toString(),
            "Month": mm,
            "PayDate": null
        };
        console.log("apidata",apiData)
        let token = AppUserData.token;
        setLoader(true);

        try {
            const result = await ApiService.PostMethode('/GetDocFromSap', apiData, token, authContext);
            if (result.Value) {
                const base64Data = result.Value;
                const { dirs } = RNFetchBlob.fs;
                const filePath = `${dirs.DocumentDir}/Tax_Sttmt${mm}${randomNum}.pdf`;

                await RNFetchBlob.fs.writeFile(filePath, base64Data, 'base64');
                setLoader(false);
                Alert.alert('HR Assist', 'Tax Statement Downloaded Successfully', [
                    {
                        text: 'OK',
                        onPress: () => RNFetchBlob.ios.openDocument(filePath)
                    },
                ]);
            } else {
                setLoader(false);
                Toast.show("Failed to obtain tax statement");
            }
        } catch (e) {
            setLoader(false);
            Toast.show("Something Went Wrong");
        }
    };

    useEffect(() => {
        GetTaxAppApi();
    }, []);

    if (loader) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>
                <Header title="Tax Computation Slip" back />
                <LoadingScreen />
            </SafeAreaView>
        );
    }

    const FlatList_Header_Approve = () => {
        return (
            <View style={styles.textContainer}>
                <Text style={{ fontSize: 13 }} Bold>Component</Text>
                <Text style={{ fontSize: 13 }} Bold>Amount (Rs.)</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>
            <Header title="Tax Computation Slip" back />
            <View style={[styles.MainCard, { padding: 10, backgroundColor: GlobalColor.White }]}>
                {TaxData == '' ? null : (
                    <FlatList
                        data={TaxData}
                        ListEmptyComponent={() => {
                            return (
                                <ListEmptyComponent
                                    title="No Data Found"
                                    enableRefresh={true}
                                    onRefreshCallback={() => GetTaxAppApi(true)}
                                    refreshing={refresh}
                                ></ListEmptyComponent>
                            );
                        }}
                        ListHeaderComponent={FlatList_Header_Approve}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => (
                            <View style={styles.textContainer}>
                                <Text style={{ fontSize: 13 }}>{Decrypt(item.SALARY_HEAD)}</Text>
                                <Text style={{ fontSize: 13 }}>{Decrypt(item.AMOUNT)}</Text>
                            </View>
                        )}
                    />
                )}
                <Button
                    onPress={() => {
                        actualDownload();
                    }}
                    title="Download Tax Statement"
                    style={{ fontSize: 13 }}
                ></Button>
            </View>
        </SafeAreaView>
    );
};

export default TaxComputationSlip;

const styles = StyleSheet.create({
    textContainer: {
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    MainCard: {
        flex: 1,
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
});
