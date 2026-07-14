import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  FlatList,
  TouchableOpacity,
  PanResponder,
  Image,
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import SelectDropdown from 'react-native-select-dropdown';
import {GlobalColor} from '../../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {DataTable} from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import LoginButton from '../../components/reusable/LoginButton';
import {LoadingScreen} from './../../components/reusable/LoadingScreen';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

const AccumulatedHours = () => {
  const [RawPunches, setRawPunches] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(new Date().getDate() - 1));
  const [toDate, setToDate] = useState(new Date(new Date().getDate() - 1));
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const payrollMonthRef = useRef();
  const blockRef = useRef();

  const [firstOUT, setfirstOut] = useState('');
  const [secondOUT, setsecondOUT] = useState('');
  const [expOUT, setexpOUT] = useState('');
  const [modalItem, setModalItem] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalLoader, setmodalLoader] = useState(false);
  const [shiftData, setShiftData] = useState('');

  const [fin_year, setFin_Year] = useState([
    {
      label: 'No-Data',
      value: 'No-Data',
    },
  ]);

  const dummyData = [
    {
      label: 'No-Data',
      value: 'No-Data',
    },
  ];
  const [fn_yr, setfn_yr] = useState('');
  const [totalH, settotalH] = useState(0);
  const [availd_hrs, setavaild_hrs] = useState(0);

  const [accum_os, setAccume_os] = useState(0);

  const [totalHours, settotalHours] = useState(1);
  const [completedHours, setcompletedHours] = useState(1);

  const [mnth, setmnth] = useState([
    {
      label: 'Select Yr.',
      value: 'Select Yr.',
    },
  ]);
  const [mnt, setmnt] = useState('');

  const [block, setBlock] = useState([
    {
      label: 'Select Mnth',
      value: 'Select Mnth',
    },
  ]);
  const [blck, setblck] = useState('');

  const [monthh, setmonthh] = useState('');
  const [blockk, setBlockk] = useState('');
  const [datee, setDatee] = useState('');

  // Animation value
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Graphic theme state
  const [graphicTheme, setGraphicTheme] = useState('dotarc');

  // Theme options for cycling
  const themes = ['dotarc', 'ring'];

  // Swipe to change theme
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Detect swipe direction
        if (gestureState.dx > 50) {
          // Swipe right
          const currentIndex = themes.indexOf(graphicTheme);
          const nextIndex = (currentIndex - 1 + themes.length) % themes.length;
          setGraphicTheme(themes[nextIndex]);
        } else if (gestureState.dx < -50) {
          // Swipe left
          const currentIndex = themes.indexOf(graphicTheme);

          const nextIndex = (currentIndex + 1) % themes.length;

          setGraphicTheme(themes[nextIndex]);
        }
      },
    }),
  ).current;

  // Calculate ring properties
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const options = [
    {
      label: 'Yes',
      value: 'Y',
    },
    {
      label: 'No',
      value: 'N',
    },
  ];

  const GetFnyear = (finyear, month, block) => {
    let apiData = {
      FinYear: finyear,
      Month: month,
      Block: block,
      UserName: AppUserData?.data?.userId,
    };
    // console.log($1);

    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/AccumulatedHours', apiData, token, authContext)
      .then(result => {
        // console.log($1);
        // console.log($1);

        let responseDataNew = result.Value.Table.map(element => ({
          label: element.SRTFALL_FNYR,
          value: element.SRTFALL_FNYR,
        }));
        setFin_Year(responseDataNew);

        let responseDataNew1 = result.Value.Table1.map(element => ({
          label: element.SRTFALL_PAYROLL_MONTH,
          value: element.SRTFALL_PAYROLL_MONTH,
        }));

        let responseDataNew2 = result.Value.Table2.map(element => ({
          label: element.SRTFALL_WEEK_NUMBER,
          value: element.DAYS,
        }));
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetMonth = (finyear, month, block) => {
    let apiData = {
      FinYear: finyear,
      Month: month,
      Block: block,
      UserName: AppUserData?.data?.userId,
    };
    // console.log($1);

    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/AccumulatedHours', apiData, token, authContext)
      .then(result => {
        // console.log($1);

        let responseDataNew1 = result.Value.Table1.map(element => ({
          label: element.MONTH_DESC,
          value: element.SRTFALL_PAYROLL_MONTH,
        }));
        setmnth(responseDataNew1);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetBlock = (finyear, month, block) => {
    let apiData = {
      FinYear: finyear,
      Month: month,
      Block: block,
      UserName: AppUserData?.data?.userId,
    };
    // console.log($1);

    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/AccumulatedHours', apiData, token, authContext)
      .then(result => {
        // console.log($1);
         
        if (result.Value.Table2 === '') {
          setBlock(dummyData);
        } else {
          let responseDataNew2 = result.Value.Table2.map(element => ({
            label: element.SRTFALL_WEEK_NUMBER,
            value: element.DAYS,
          }));
          setBlock(responseDataNew2);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        // console.log($1);
        // console.log($1);

        let errorMessage = 'Something went wrong while fetching Block data.';

        try {
          if (error?.bodyString) {
            const parsed = JSON.parse(error.bodyString);
            const rawMessage =
              parsed.ExceptionMessage || parsed.Message || errorMessage;

            // Extract human-readable message from first ORA-xxxxx:
            const match = rawMessage.match(/ORA-\d+:\s*([^\n]+)/);
            errorMessage = match ? match[1].trim() : errorMessage;
          } else if (error?.response?.data?.Message) {
            errorMessage = error.response.data.Message;
          }
        } catch (parseErr) {
          // console.log($1);
        }

        // console.log($1);
        Toast.show(errorMessage); // This will only show: "no data found"

        // ApiService.showErrorMessage(errorMessage, authContext);
      });
  };

  // const formatHours = decimalHours => {
  //   let hours = Math.floor(decimalHours);
  //   let minutes = Math.round((decimalHours - hours) * 60);
   
  //   // Handle minute overflow (e.g., 14:60 -> 15:00)
  //   if (minutes === 60) {
  //     hours += 1;
  //     minutes = 0;
  //   }
   
  //   // Always show 2-digit hours and minutes
  //   return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`;
  // };

  // const formatHours = decimalHours => {
  //   if (decimalHours == null || isNaN(decimalHours)) return "00:00";
   
  //   const hours = Math.floor(decimalHours);
  //   const minutes = Math.round((decimalHours - hours) * 60);
   
  //   // Handle minute overflow (e.g., 14:60 -> 15:00)
  //   if (minutes >= 60) {
  //     return `${(hours + 1).toString().padStart(2, '0')} : 00`;
  //   }
   
  //   // Always show 2-digit hours and minutes
  //   return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`;
  // };

  // const formatHours = (decimalHours) => {
  //   if (decimalHours == null || isNaN(decimalHours)) return "00:00";
   
  //   const hours = Math.floor(decimalHours);
   
  //   // Fix floating-point precision by truncating to 2 decimal places first
  //   const preciseDecimal = Math.floor(decimalHours * 100) / 100;
   
  //   const minutes = Math.floor((preciseDecimal - hours) * 60);
   
  //   return `${hours.toString().padStart(2, '0')}:${minutes
  //     .toString()
  //     .padStart(2, '0')}`;
  // };  

  const formatHours = (decimalHours) => {
    if (decimalHours == null || isNaN(decimalHours)) return "00:00";
  
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
  
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };
  

  const GetData = (finyear, month, block) => {
    let apiData = {
      FinYear: finyear,
      Month: month,
      Block: block === '--No-Data--' ? '' : block,
      UserName: AppUserData?.data?.userId,
    };
    // console.log($1);
    // console.log($1);

    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/AccumulatedHours', apiData, token, authContext)
      .then(result => {
        // console.log($1);
        // console.log($1);
        // console.log($1);

        // console.log($1);
        // console.log($1);
       
        GetBlock(fn_yr, mnt, '');
        setAccume_os(result.Value.Table3[0]['ACC_OST']);
        setRawPunches(result.Value.Table3);
        if (result.Value.Table3 == '') {
          settotalH('0');
          setavaild_hrs('0');
          const res = result.Value.Table3?.[0] || {};
          const total = res['SRTFALL_TOT_HRS'] || '0:00';
          const completed = res['SRTFALL_AVILD_HRS'] || '0:00';

          const totalDecimal = convertToDecimalHours(total);
          const completedDecimal = convertToDecimalHours(completed);
       
          settotalHours(totalDecimal);
          setcompletedHours(completedDecimal);
        }

        settotalHours(
          result.Value.Table3[0]['SRTFALL_TOT_HRS'] === '' || null || 0
            ? 1
            : result.Value.Table3[0]['SRTFALL_TOT_HRS'],
        );
        setcompletedHours(
          result.Value.Table3[0]['SRTFALL_AVILD_HRS'] === '' || null || 0
            ? 1
            : result.Value.Table3[0]['SRTFALL_AVILD_HRS'],
        );
        settotalH(result.Value.Table3[0]['SRTFALL_TOT_HRS']);
        setavaild_hrs(result.Value.Table3[0]['SRTFALL_AVILD_HRS']);
       
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        settotalH('0');
        setavaild_hrs('0');
        setRawPunches([]);
        const res = result.Value.Table3?.[0] || {};
        const total = res['SRTFALL_TOT_HRS'] || '0:00';
        const completed = res['SRTFALL_AVILD_HRS'] || '0:00';

        const totalDecimal = convertToDecimalHours(total);
        const completedDecimal = convertToDecimalHours(completed);

        settotalHours(totalDecimal);
        setcompletedHours(completedDecimal);

        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetInitData = (finyear, month, block) => {
    let apiData = {
      FinYear: finyear,

      Month: month,

      Block: '',

      UserName: AppUserData?.data?.userId,
    };

    // console.log($1);

    let token = AppUserData.token;

    setLoader(true);

    ApiService.PostMethode('/AccumulatedHours', apiData, token, authContext)

      .then(result => {
        // console.log($1);

        const table3 = result?.Value?.Table3;

        // ✅ Check if table3 is a valid non-empty array
        

        if (Array.isArray(table3) && table3.length > 0) {
          const row = table3[0];

          const data = [{...row}];

          //// console.log($1);

          setRawPunches(table3);

          settotalHours(row['SRTFALL_TOT_HRS'] || 1);

          setcompletedHours(row['SRTFALL_AVILD_HRS'] || 1);

          settotalH(row['SRTFALL_TOT_HRS']);
          setAccume_os(row['ACC_OST'])

          setavaild_hrs(row['SRTFALL_AVILD_HRS']);
        } else {
          // ⚠️ Handle empty or missing data safely

          //  console.warn('Table3 is empty or missing');

          setRawPunches([]);

          settotalHours(0);

          setcompletedHours(0);

          settotalH(0);

          setavaild_hrs(0);
        }

        setLoader(false);
      })

      .catch(error => {
        setLoader(false);

        ApiService.showErrorMessage(error, authContext);
      });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const initialLoading = () => {
    GetFnyear('', '', '');
    GetInitData('', '', '');
  };

  useEffect(() => {
    initialLoading();
  }, []);

  const convertToDecimalHours = timeString => {
    if (
      !timeString ||
      typeof timeString !== 'string' ||
      !timeString.includes(':')
    )
      return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return (isNaN(hours) ? 0 : hours) + (isNaN(minutes) ? 0 : minutes / 60);
  };

  useEffect(() => {
    const progress =
      totalHours === 0 ? 0 : Math.min(1, completedHours / totalHours);
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [totalHours, completedHours]);

  const convertToHoursMinutes = (decimalTime) => {
    if (decimalTime == null || isNaN(decimalTime)) return "00:00";
   
    const isNegative = decimalTime < 0;
    const absTime = Math.abs(decimalTime);
   
    const hours = Math.floor(absTime);
    const minutes = Math.round((absTime - hours) * 60);
   
    return `${isNegative ? "-" : ""}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const Exp_out = () => {
    let apiData = {
      UserName: AppUserData?.data?.userId,
    };
    // // console.log($1);
    // AppUserData?.data?.userId
    //setmodalLoader(true);
     setModalVisible(true);
  };

  const renderItem = ({item}) => {

    // console.log($1);
  
    return (
  <View style={styles.renderitem}>
  <Text style={{fontSize: 13, marginLeft: -2}}>{item.MONTH_DESC}</Text>
  <Text style={{fontSize: 13}}>{item.SRTFALL_WEEK_NUMBER}</Text>
  <Text style={{fontSize: 13}}>
  
          {item.CAPP_DATE == null
  
            ? item.CAPP_DATE
  
            : moment(item.CAPP_DATE).format('DD-MMM-YYYY')}
  </Text>
  <Text style={{fontSize: 13, flex: 0.3}}>
  
          {convertToHoursMinutes(item.CAPP_TOT_HRS)}
  </Text>
  {/* <Text
  
          style={{
  
            fontSize: 13,
  
            flex: 0.3,
  
            color: item.CURR_OST < 0 ? 'red' : 'green',
  
           
  
          }}
  >
  
          {convertToHoursMinutes(item.CURR_OST)}
  </Text> */}
  </View>
  
    );
  
  };
  
   

  // Create animated components
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  // Animate the progress
  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const dotOpacity = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const segmentAngle = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  // Calculate arrow position and path for ring
  const createArrowPath = angle => {
    const arrowSize = 12;
    const angleInRadians = (angle * Math.PI) / 180;
    const arrowX = size / 2 + radius * Math.cos(angleInRadians);
    const arrowY = size / 2 + radius * Math.sin(angleInRadians);

    const point1X =
      arrowX + arrowSize * Math.cos(angleInRadians - Math.PI / 1.5);
    const point1Y =
      arrowY + arrowSize * Math.sin(angleInRadians - Math.PI / 1.5);
    const point2X =
      arrowX + arrowSize * Math.cos(angleInRadians + Math.PI / 1.5);
    const point2Y =
      arrowY + arrowSize * Math.sin(angleInRadians + Math.PI / 1.5);

    return `M ${arrowX} ${arrowY} L ${point1X} ${point1Y} L ${point2X} ${point2Y} Z`;
  };

  // Create segment path for radial segments
  const createSegmentPath = (startAngle, endAngle) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${size / 2} ${
      size / 2
    } L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Render graphic based on theme
  const renderGraphic = () => {
    switch (graphicTheme) {
      case 'dotarc':
        return (
          <Svg width={size} height={size} style={styles.ring}>
            {[...Array(20)].map((_, index) => {
              const angle = (index / 20) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = size / 2 + radius * Math.cos(rad);
              const y = size / 2 + radius * Math.sin(rad);
              return <Circle key={index} cx={x} cy={y} r={6} fill="#E0E0E0" />;
            })}
            {[...Array(20)].map((_, index) => {
              const angle = (index / 20) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = size / 2 + radius * Math.cos(rad);
              const y = size / 2 + radius * Math.sin(rad);
              return (
                <AnimatedCircle
                  key={index}
                  cx={x}
                  cy={y}
                  r={6}
                  fill="#43c6db"
                  opacity={dotOpacity.interpolate({
                    inputRange: [index / 20, (index + 1) / 20],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  })}
                />
              );
            })}
          </Svg>
        );
      case 'ring':
        return (
          <Svg width={size} height={size} style={styles.ring}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#43c6db"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
      <ScrollView
        nestedScrollEnabled={true}
        style={{marginTop: 5,}}>
        <View style={styles.ringContainer} {...panResponder.panHandlers}>
          {renderGraphic()}
          <View style={styles.centralText}>
<Text style={styles.hoursText}>
    {formatHours(availd_hrs >= totalH ? totalH : availd_hrs)} / {formatHours(totalH)}
</Text>
<Text style={styles.label}>Hours Completed</Text>
</View>
        </View>

        <View style={styles.themeIconsContainer}>
          <TouchableOpacity onPress={() => setGraphicTheme('dotarc')}>
            <FontAwesome
              name="circle"
              size={8}
              color={graphicTheme === 'dotarc' ? '#43c6db' : '#E0E0E0'}
              style={[
                styles.themeIcon,
                graphicTheme === 'dotarc' && styles.themeIconActive,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGraphicTheme('ring')}>
            <FontAwesome
              name="circle-o"
              size={8}
              color={graphicTheme === 'ring' ? '#43c6db' : '#E0E0E0'}
              style={[
                styles.themeIcon,
                graphicTheme === 'ring' && styles.themeIconActive,
              ]}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() =>
              // setModalVisible(true)
              Exp_out()
            }>
            <Text style={{color: '#43C6DB'}}>Current Outstanding</Text>
          </TouchableOpacity> */}
        </View>

        {/* <View style ={{backgroundColor:'#43c6db'}}>
          <Text style = {{textAlign:'center',color:'#fff',fontWeight:'bold'}}>
          
            {convertToHoursMinutes(accum_os)}
            </Text>
          <Text style = {{textAlign:'center',color:'#fff',fontWeight:'bold'}}>Accumulated Outstanding</Text>
        </View> */}
        {/* <View style={styles.accumulatedContainer}>
<Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: accum_os < 0 ? 'red' : 'green',
      }}
>
      {convertToHoursMinutes(accum_os)}
</Text>
<Text style={{fontSize: 12, color: '#555'}}>Accumulated Outstanding</Text>
</View> */}

        <View style={styles.separator} />
        <View style={{width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View style={{width: '28%'}}>
              {/* <Text
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 5,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                Year {<Text style={{ color: 'red' }}>*</Text>}
              </Text> */}
              <SelectDropdown
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  return item.label;
                }}
                data={fin_year}
                defaultButtonText="Year"
                onSelect={(selectedItem, index) => {
                  // console.log($1);
                  // console.log($1);
                  // Clear month & block
                  payrollMonthRef.current?.reset();
                  blockRef.current?.reset();
                  setfn_yr(selectedItem.value);

                  GetMonth(selectedItem.value, mnt, blck);
                  GetFnyear('', '', '');
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#43C6DB'}
                      size={14}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
              />
            </View>

            <View style={{width: '44%'}}>
              {/* <Text
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 5,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                Payroll Month {<Text style={{ color: 'red' }}>*</Text>}
              </Text> */}
              <SelectDropdown
                ref={payrollMonthRef}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  return item.label;
                }}
                data={mnth}
                defaultButtonText="Payroll Month"
                onSelect={(selectedItem, index) => {
                  blockRef.current?.reset();
                  // console.log($1);
                  // console.log($1);
                  setRawPunches([]);
                  setAccume_os('');
                  GetBlock(fn_yr, selectedItem.value, '');
                  GetMonth(fn_yr, '', '');

                  setmnt(selectedItem.value);
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#43C6DB'}
                      size={14}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
              />
            </View>

            <View style={{width: '28%'}}>
              
              <SelectDropdown
                ref={blockRef}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  return item.label;
                }}
                data={block}
                defaultButtonText="Block"
                onSelect={(selectedItem, index) => {
                  // console.log($1);
                  // console.log($1);
                  setblck(selectedItem.label);

                  // console.log($1);
                  // console.log($1);
                 
                  if (mnt === '') {
                    setblck('Select Month');
                  } else {
                    
                    GetData(fn_yr, mnt, selectedItem.label);
                  }
                  setmonthh(mnt);
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#43C6DB'}
                      size={14}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
              />
            </View>
          </View>
        </View>
        <DataTable
          style={{
            width: '100%',
            backgroundColor: '#fff',
            marginVertical: 15,
            flex: 1,
          }}>
       <DataTable.Header
  style={{
    backgroundColor: '#fff',
    width: '100%', // ✅ Fit within screen
  }}
>
<DataTable.Title style={{ flex: 4.5 }}>
<Text style={styles.tableHeaderText}>Payroll Month</Text>
</DataTable.Title>
 
  <DataTable.Title style={{ flex: 2.1 }}>
<Text style={styles.tableHeaderText}>Block</Text>
</DataTable.Title>
 
  <DataTable.Title style={{ flex: 2.1 ,marginRight:12}}>
<Text style={styles.tableHeaderText}>Date</Text>
</DataTable.Title>
 
  <DataTable.Title style={{ flex: 3.8,marginLeft:-18 }}>
<Text style={styles.tableHeaderText}>Hrs. Worked</Text>
</DataTable.Title>
 
  {/* <DataTable.Title style={{ flex: 3.6,marginLeft:5 }}>
<Text style={styles.tableHeaderText}>Outstanding</Text>
</DataTable.Title> */}
</DataTable.Header>

          <FlatList
            contentContainerStyle={{flexGrow: 1, marginBottom: '35%'}}
            data={RawPunches}
            style={{marginBottom: '10%'}}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <ListEmptyComponent
                title="No Data Found"
                subtitle="Please select dates and submit to view data"
              />
            )}
          />
        </DataTable>
      </ScrollView>

      <Modal
        backdropOpacity={0.7}
        coverScreen={true}
        isVisible={isModalVisible}>
        <View
          style={{
            minHeight: 230,
            borderRadius: 15,
            backgroundColor: GlobalColor.White,
          }}>
          {modalLoader ? (
            <LoadingScreen />
          ) : (
            <View style={styles.modal}>
              <TouchableOpacity style={styles.ModalCloseIcon}>
                <Feather
                  name="x-circle"
                  color={'#43C6DB'}
                  size={25}
                  onPress={toggleModal}
                  style={{marginVertical: 10, marginHorizontal: 10}}
                />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 3,
                  borderColor: '#43C6DB',
                  borderRadius: 65,
                  marginTop: 20,
                }}>
                {expOUT == null ? (
                  <Image
                    source={require('../../assets/Images/sad.gif')}
                    style={[styles.profileImg, {marginRight: 5}]}
                  />
                ) : (
                  <Image
                    source={require('../../assets/Images/work.gif')}
                    style={[styles.profileImg, {marginRight: 5}]}
                  />
                )}
              </View>
              {expOUT == null ? (
                <View
                  style={{
                    paddingVertical: 15,
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    No Data Found
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingVertical: 15,
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 13,
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      {firstOUT == '' ? 'Expected Second' : 'Expected First'}{' '}
                      Half Time Out -{' '}
                    </Text>
                    {firstOUT == '' ? secondOUT : firstOUT}
                  </Text>
                  <Text
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 13,
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      Expected Shift Time Out -{' '}
                    </Text>
                    {expOUT}
                  </Text>
                </View>
              )}
              <View
                style={{
                  // height: '23%',
                  marginTop: 5,
                  // backgroundColor:'yellow',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'space-around',
                  width: '50%',
                  alignItems: 'flex-end',
                }}></View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    transform: [{rotate: '-90deg'}],
    marginTop: 20,
  },
  centralText: {
    position: 'absolute',
    alignItems: 'center',
  },
  tableHeaderText: {
    color: GlobalColor.Primary,
    fontSize: 11, // ✅ Slightly smaller so it fits
    fontWeight: 'bold',
  },
  
  
  hoursText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 20,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  modal: {
    height: 105,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: GlobalColor.PrimaryLight,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: 'relative',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  gradient: {
    padding: 20,
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 2,
    fontSize: 13,
  },
  box: {
    padding: 5,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
  },
  FlatListData: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#43C6DB',
    backgroundColor: GlobalColor.PrimaryLight,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 40,
    marginLeft: 5,
  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: {textAlign: 'left', fontSize: 14},
  dropdown2DropdownStyle: {backgroundColor: GlobalColor.White},
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
  },
  dropdown2RowTxtStyle: {textAlign: 'left', fontSize: 16},
  centeredView: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  Modalclose: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#43C6DB',
    justifyContent: 'center',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  Modalclosetxt: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 13,
  },
  checkboxLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  ModalHeading: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
  renderitem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  themeIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  themeIcon: {
    marginHorizontal: 15,
  },
  themeIconActive: {
    transform: [{scale: 1.2}],
  },
  ableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  tableCell: {
    fontSize: 13,
    paddingHorizontal: 4,
  },
  accumulatedContainer: {
    
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  }
});

export default AccumulatedHours;
