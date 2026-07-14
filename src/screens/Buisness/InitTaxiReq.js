import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Pressable, StatusBar, Alert, Image, ActivityIndicator, Dimensions, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import Text from '../../components/reusable/Text';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import { GlobalColor } from '../../constants/Colors';
import { showErrorMessage } from '../Utils/Utils';
import { useFocusEffect } from '@react-navigation/native';
import TextInput from '../../components/reusable/TextInput';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils/';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import Feather from 'react-native-vector-icons/Feather';
import { CommonActions } from '@react-navigation/native';
import { Decrypt } from '../../Service/Helper';
// import Pdf from 'react-native-pdf';
// create a component
const InitTaxiReq = ({ }) => {
  const navigation = useNavigation();
  const { authContext, AppUserData } = useContext(AuthContext);
  let userId = AppUserData?.data?.userId;
  let userNT = AppUserData?.data?.userNT;
  const [isSelected, setSelection] = useState(true);
  const [isSelectedTerm, setSelectionTerm] = useState(true);
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notifi, setNotifi] = useState([]);
  const [selectedBookingType, setSelectedBookingType] = useState('S'); // S: Self, B: On Behalf, G: Guest
  const [search, setSearch] = useState('');
  const [CostC, setCostC] = useState('');
  const [selfCostC, setSelfCostC] = useState('');
  const [RM, setRM] = useState('');
  const [selfRM, setSelfRM] = useState('');
  const [selfName, setSelfName] = useState('');
  const [selfMobile, setSelfMobile] = useState('');
  const [isDpm, setIsDpm] = useState('');
  const [selfIsDpm, setSelfIsDpm] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [timeExp, setTimeExp] = useState(null);
  const [timeExp1, setTimeExp1] = useState(null);
  const [minPickupTime, setMinPickupTime] = useState(null);
  const [maxPickupTime, setMaxPickupTime] = useState(null);
  const [minArrivalTime, setMinArrivalTime] = useState(null);
  const [maxArrivalTime, setMaxArrivalTime] = useState(null);
  const [employ, setEmploy] = useState([]);
  const [empModalVisible, setEmpModalVisible] = useState(false);
  const [passengerForms, setPassengerForms] = useState([]);
  // const [waypoints, setWaypoints] = useState([]); // ✅ Add this
  const [Gnem, setGNem] = useState('');
  const [Gdesg, setGDesg] = useState('');
  const [Gmobile, setGMob] = useState('');
  const [G_cmpny, setG_cmpny] = useState('');
  const [additionAprv, setAdditionalAprv] = useState([]);
  const [taxiModal, setTaxiModal] = useState([]);
  const [taxiModelsFull, setTaxiModelsFull] = useState([]);
  const [nem, setNem] = useState('');
  const [desg, setDesg] = useState('');
  const [mobile, setMob] = useState('');
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripWay, setTripWay] = useState('');
  const [ApproxKm, setApproxKm] = useState('');
  const [psngr, setpsngr] = useState(1);
  const [waypoints, setWaypoints] = useState([{ value: "", suggestions: [] }]);
  const [isSelfBookingMode, setIsSelfBookingMode] = useState(false);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [waySuggestions, setWaySuggestions] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const screenHeight = Dimensions.get('window').height;
  const [tripPurpose, setTripPurpose] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [taxiModel, setTaxiModel] = useState('');
  const [pickupTim, setPickupTim] = useState('');
  const [dropTim, setDropTim] = useState('');
  const [selectedTaxi, setSelectedTaxi] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState('');
  const [AdnAprv, setAdnAprv] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerMob, setPassengerMob] = useState('');
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(-1);
  const [passengerLimit, setPassengerLimit] = useState(4);
  const [formErrors, setFormErrors] = useState({});
  const [passengerErrors, setPassengerErrors] = useState([]);
  const taxiDropdownRef = useRef(null);
  const ApproverDropdownRef = useRef(null);
  const passengerDropdownRef = useRef(null);
  const personDropdownRef = useRef(null);
  const bookingTypeDropdownRef = useRef(null);
  const [ReportModal, setReportModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [YatriName, setYatriName] = useState([]);
  const [YatriMob, setYatriMob] = useState([]);
  const [TandCModal, setTandC] = useState(true);
  const [pdfImages, setPdfImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [taxiModalSelct, settaxiModalSelct] = useState(false);
  const BASE_URL = "https://swifttest.maruti.co.in/HrAssist/TaxiTandC/";
  const FILE_PREFIX = "T&c_page-"; // file name prefix
  const FILE_EXT = ".jpg"; // extension
  const loadPdfImages = async () => {
    setLoadingImages(true); // START LOADER
    let page = 1;
    let images = [];
    while (true) {
      const num = String(page).padStart(4, "0");
      const imageUrl = `${BASE_URL}${FILE_PREFIX}${num}${FILE_EXT}`;
      try {
        const res = await fetch(imageUrl, { method: "HEAD" });
        if (res.ok) {
          images.push(imageUrl);
          page++;
        } else {
          break;
        }
      } catch (err) {
        break;
      }
    }
    setPdfImages(images);
    setLoadingImages(false); // STOP LOADER
  };
  useEffect(() => {
    if (TandCModal) {
      loadPdfImages();
    }
  }, [TandCModal]);
  const BookingTypes = [
    { label: 'Self Booking', value: 'S' },
    { label: 'On Behalf Booking', value: 'B' },
    { label: 'Guest Booking', value: 'G' },
  ];
  const Purpose = [
    { label: 'Select', value: '' },
    { label: 'PART TESTING', value: 'PART TESTING' },
    { label: 'AMC', value: 'AMC' },
    { label: 'MEETING', value: 'MEETING' },
    { label: 'JOINT ANALYSIS', value: 'JOINT ANALYSIS' },
    { label: 'VEHICLE TESTING', value: 'VEHICLE TESTING' },
    { label: 'FACILITY INSPECTION', value: 'FACILITY INSPECTION' },
    { label: 'AUDIT', value: 'AUDIT' },
  ];
  const PassengerType = [
    { label: 'Select Type', value: '' },
    { label: 'Employee', value: 'E' },
    { label: 'Guest', value: 'G' },
  ];
  const PersonNo = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];
  const validate = () => {
    const errors = {};
    const passengerErrorsLocal = passengerForms.map(() => ({}));
    let isValid = true;
    // Prepare TripWayPoint
    const finalWaypoints = waypoints
      .filter(w => w.value && w.value.trim() !== "")
      .map(w => w.value.trim())
      .join("#");
    // Validate trip details
    if (!tripPurpose) {
      errors.purpose = 'Purpose is required.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(tripPurpose)) {
      errors.purpose = 'Purpose can only contain alphabets and spaces.';
      isValid = false;
    } else if (tripPurpose.length < 10) {
      errors.purpose = 'Purpose must be at least 10 characters long.';
      isValid = false;
    } else if (tripPurpose.length > 50) {
      errors.purpose = 'Purpose must not exceed 50 characters.';
      isValid = false;
    }
    if (!tripFrom) {
      errors.from = 'Pickup location is required.';
      isValid = false;
    }
    if (!tripTo) {
      errors.to = 'Drop location is required.';
      isValid = false;
    }
    if (tripFrom.trim() === tripTo.trim() && finalWaypoints === "") {
      errors.waypoints = 'Waypoints are required when pickup and drop locations are the same.';
      isValid = false;
    }
    if (!selectedTaxi) {
      errors.taxi = 'Taxi model is required.';
      isValid = false;
    }
    if (!timeExp) {
      errors.pickupTime = 'Pickup time is required.';
      isValid = false;
    }
    if (!timeExp1) {
      errors.arrivalTime = 'Arrival time is required.';
      isValid = false;
    }
    if (timeExp && moment(timeExp).isBefore(moment(minPickupTime))) {
      errors.pickupTime = 'Pickup time cannot be in the past.';
      isValid = false;
    }
    if (timeExp && moment(timeExp).isAfter(moment(maxPickupTime))) {
      errors.pickupTime = 'Pickup time cannot be more than 7 days from now.';
      isValid = false;
    }
    if (timeExp1 && minArrivalTime && moment(timeExp1).isBefore(moment(minArrivalTime))) {
      errors.arrivalTime = 'Arrival time must be at least 1 hour after pickup time.';
      isValid = false;
    }
    if (timeExp1 && maxArrivalTime && moment(timeExp1).isAfter(moment(maxArrivalTime))) {
      errors.arrivalTime = 'Arrival time cannot be more than 5 days from pickup time.';
      isValid = false;
    }
    if (passengerForms.length > passengerLimit) {
      errors.passengerLimit = 'Too many passengers for selected taxi model.';
      isValid = false;
    }
    // Validate passenger data
    const passengerData = passengerForms.map(form => ({
      pStaffId: form.pStaffId,
      pName: form.pName,
      pMob: form.pMob,
      pFlag: form.pFlag
    }));
    passengerData.forEach((passenger, index) => {
      const pErrors = {};
      if (!passenger.pFlag) {
        pErrors.pFlag = 'Passenger type is required.';
        isValid = false;
      }
      if (passenger.pFlag === 'E') {
        if (!passenger.pStaffId) {
          pErrors.pStaffId = 'Staff ID is required.';
          isValid = false;
        } else if (!/^\d{6}$/.test(passenger.pStaffId)) {
          pErrors.pStaffId = 'Staff ID must be exactly 6 digits.';
          isValid = false;
        }
      }
      if (!passenger.pName) {
        pErrors.pName = 'Passenger name is required.';
        isValid = false;
      } else if (!/^[a-zA-Z.\s]+$/.test(passenger.pName)) {
        pErrors.pName = 'Name can only contain alphabets, spaces, and dots.';
        isValid = false;
      }
      if (!passenger.pMob) {
        pErrors.pMob = 'Mobile number is required.';
        isValid = false;
      } else if (!/^\d{10}$/.test(passenger.pMob)) {
        pErrors.pMob = 'Mobile number must be exactly 10 digits.';
        isValid = false;
      }
      passengerErrorsLocal[index] = pErrors;
    });
    setFormErrors(errors);
    setPassengerErrors(passengerErrorsLocal);
    if (!isValid) {
      // Scroll to top or focus first error, but for now, just return false
      return false;
    }
    // Clear errors if valid
    setFormErrors({});
    setPassengerErrors(Array(passengerForms.length).fill({}));
    return true;
  };
  const showDatePickera = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const showDatePickera1 = () => {
    setDatePickerVisibility1(!isDatePickerVisible1);
  };
  const hideDatePickera = () => {
    setDatePickerVisibility(false);
  };
  const hideDatePickera1 = () => {
    setDatePickerVisibility1(false);
  };
  // const fetchWaySuggestions = async (input) => {
  // const apiKey = 'AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30';
  // const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}&components=country:in`;
  // try {
  // const response = await fetch(url);
  // const json = await response.json();
  // if (json.predictions) {
  // setWaySuggestions(json.predictions);
  // }
  // } catch (error) {
  // console.error('Error fetching drop location suggestions:', error);
  // }
  // };
  const fetchWaySuggestions = async (input, index) => {
    const apiKey = "AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30";
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}&components=country:in`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.predictions) {
        setWaypoints(prev => {
          const updated = [...prev];
          updated[index].suggestions = json.predictions; // ✅ Update only this waypoint's suggestions
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching waypoint suggestions:", error);
    }
  };
  const fetchToSuggestions = async (input) => {
    const apiKey = 'AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}&components=country:in`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.predictions) {
        setToSuggestions(json.predictions);
      }
    } catch (error) {
      console.error('Error fetching drop location suggestions:', error);
    }
  };
  const handleAddWaypoint = () => {
    setWaypoints(prev => [...prev, { value: "", suggestions: [] }]);
  };
  const fetchDistanceBetweenPlaces = async (origin, destination) => {
    const apiKey = 'AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&units=metric`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (
        json.status === 'OK' &&
        json.rows &&
        json.rows[0].elements &&
        json.rows[0].elements[0].status === 'OK'
      ) {
        const distanceText = json.rows[0].elements[0].distance.text;
        const durationText = json.rows[0].elements[0].duration.text;
        console.log(`Distance: ${distanceText}, Duration: ${durationText}`);
        setApproxKm(distanceText);
        return { distance: distanceText, duration: durationText };
      } else {
        console.warn('Distance Matrix API returned no results.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
      return null;
    }
  };
  // ✅ Function to calculate distance including waypoint
  const calculateTotalDistanceWithWaypoints = async (origin, destination, waypointsArray) => {
    console.log(origin);
    console.log(destination);
    console.log(waypointsArray);
    const apiKey = 'AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30'; // Replace with your actual API key
    const waypointsParam = waypointsArray.join('|'); // For single waypoint, still works
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypointsParam)}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.routes.length > 0) {
        const distanceMeters = data.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
        const distanceKm = (distanceMeters / 1000).toFixed(2);
        setApproxKm(`${distanceKm} km`);
      } else {
        console.warn('Directions API Error:', data.status, data.error_message);
      }
    } catch (error) {
      console.error('Error calculating distance with waypoint:', error);
    }
  };
  const fetchPlaceSuggestions = async (input) => {
    const apiKey = 'AIzaSyD2JT4dMG7dL0UvuXdZg5ynsfEjikTiQ30';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}&components=country:in`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.predictions) {
        setFromSuggestions(json.predictions);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClearPickup = () => {
    setTimeExp(null); // Clear pickup time
    setTimeExp1(null); // Clear arrival time as it depends on pickup
    setDatePickerVisibility(false); // Close the modal
    Toast.show('Pickup time cleared.', Toast.LONG);
  };
  const handleClearArrival = () => {
    setTimeExp1(null); // Clear arrival time
    setDatePickerVisibility1(false); // Close the modal
    Toast.show('Arrival time cleared.', Toast.LONG);
  };
  const handleConfirma = (date) => {
    const now = moment();
    const maxPickup = moment(maxPickupTime);
    if (moment(date).isBefore(now)) {
      Toast.show('Pickup time cannot be in the past.', Toast.LONG);
      return; // Keep modal open for reselection
    }
    if (moment(date).isAfter(maxPickup)) {
      Toast.show('Pickup time cannot be more than 7 days from now.', Toast.LONG);
      return; // Keep modal open for reselection
    }
    setTimeExp(date);
    if (timeExp1 && moment(timeExp1).isBefore(moment(date).add(1, 'hour'))) {
      setTimeExp1(null); // Clear arrival time if it becomes invalid
      Toast.show('Arrival time reset as it was before the new pickup time.', Toast.LONG);
    }
    hideDatePickera();
  };
  const handleConfirma1 = (date) => {
    if (!timeExp) {
      Toast.show('Please select a pickup time first.', Toast.LONG);
      return; // Keep modal open for reselection
    }
    if (moment(date).isBefore(moment(timeExp).add(1, 'hour'))) {
      Toast.show('Arrival time must be at least 1 hour after pickup time.', Toast.LONG);
      return; // Keep modal open for reselection
    }
    if (moment(date).isAfter(moment(maxArrivalTime))) {
      Toast.show('Arrival time cannot be more than 5 days from pickup time.', Toast.LONG);
      return; // Keep modal open for reselection
    }
    setTimeExp1(date);
    hideDatePickera1();
  };
  const handleFrom = text => {
    setTripFrom(text);
  };
  const handleTo = text => {
    setTripTo(text);
  };
  const handlePurpose = text => {
   setTripPurpose(text);
  };
  const handleNem = text => {
    setNem(text);
  };
  const handleDesg = text => {
    setDesg(text);
  };
  const handleMob = text => {
    setMob(text);
  };
  const handleGNem = text => {
    setGNem(text);
  };
  const handleGDesg = text => {
    setGDesg(text);
  };
  const handleGMob = text => {
    setGMob(text);
  };
  const handleCmpny = text => {
    setG_cmpny(text);
  };
  const handleAddPassenger = () => {
    console.log("p---", psngr + passengerForms.length);
    setpsngr(psngr + passengerForms.length);
    if (passengerForms.length >= passengerLimit) {
      Toast.show(`Cannot add more passengers. Maximum limit is ${passengerLimit} for selected taxi model.`, Toast.LONG);
      return;
    }
    setPassengerForms([...passengerForms, { id: Date.now(), pStaffId: '', pName: '', pMob: '', pFlag: '' }]);
  };
  const removeWaypoint = (index) => {
    setWaypoints(prev => prev.filter((_, i) => i !== index));
    // Recalculate distance after delete
    setTimeout(() => {
      const cleaned = waypoints
        .filter((w, i) => i !== index && w.value.trim() !== "")
        .map(w => w.value);
      if (tripFrom && tripTo) {
        if (cleaned.length === 0) {
          fetchDistanceBetweenPlaces(tripFrom, tripTo);
        } else {
          calculateTotalDistanceWithWaypoints(tripFrom, tripTo, cleaned);
        }
      }
    }, 50);
  };
  const handleRemovePassenger = (id) => {
    if (id === 'self') {
      Toast.show('Cannot remove self passenger.', Toast.LONG);
      return;
    }
    setPassengerForms(passengerForms.filter(form => form.id !== id));
  };
  const handleButtonPress = (merge_id, action) => {
    if (!validate()) {
      return;
    }
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    // Prepare TripWayPoint
    const finalWaypoints = waypoints
      .filter(w => w.value && w.value.trim() !== "")
      .map(w => w.value.trim())
      .join("#");
    console.log("FINAL WAYPOINT STRING → ", finalWaypoints);
    // Modify action for self booking with DPM=Y
    let finalAction = action;
    if (action === 'Submit' && selectedBookingType === 'S' && isDpm === 'Y') {
      finalAction = 'Approve';
    }
    // Modify action for on behalf booking with DPM=Y
    if (action === 'Submit' && selectedBookingType === 'B' && isDpm === 'Y') {
      finalAction = 'Approve';
    }
    const formattedPassengerData = passengerForms.map(item => `${item.pFlag === 'G' ? '000000' : item.pStaffId}~${item.pMob}~${item.pName}~${item.pFlag}`)
      .join('#') + '#';
    let newData = {
      AppName: "TAXI-BOOK",
      RequestID: "",
      RequestStatus: "DRAFT",
      TourType: "L",
      RequestorType: selectedBookingType,
     RequestorID: selectedBookingType === 'B' ? Number(passengerForms[0]?.pStaffId || AppUserData?.data?.userId) : Number(AppUserData?.data?.userId),
      RequestorMobile: selectedBookingType === 'S' ? selfMobile : mobile,
      TripStartPoint: tripFrom,
      TripEndPoint: tripTo,
      TripStartTime: moment(timeExp).format('DD-MMM-YY h:mm:ss A'),
      TripEndTime: moment(timeExp1).format('DD-MMM-YY h:mm:ss A'),
      TripWayPoint: finalWaypoints,
      Purpose: tripPurpose,
      RequestorModel: selectedTaxi,
      ApproverModel: selectedTaxi,
      AllottedModel: selectedTaxi,
      VendorID: "",
      VehicleRegNo: "",
      DriverID: "",
      CreatorID: Number(AppUserData?.data?.userId),
      Action: finalAction,
      Comments: "",
      PassengerDet: formattedPassengerData,
      ExtraBills: "",
      MergeRequestID: merge_id,
      AdditionalAppr: AdnAprv,
      Remarks: "",
      OdometerReading: "",
      UserName: userNT,
      // no_person: passengerData.length.toString(),
      // nem: selectedBookingType === 'S' ? selfName : nem,
      // desg: selectedBookingType === 'S' ? AppUserData?.data?.desg : desg,
      // mob: selectedBookingType === 'S' ? selfMobile : mobile,
      // guest_nem: Gnem,
      // guest_desg: Gdesg,
      // guest_mob: Gmobile,
      // guest_cmpny: G_cmpny,
      // passenger_det: formattedPassengerData,
      // additional_appr: AdnAprv,
    };
    console.table(newData);
    // console.log('Submit Data ', newdata);
    setLoader(true);
    ApiService.PostMethode('/UpdateActionEmp', newData, token, authContext)
      .then(result => {
        // console.log('APiresult InsertRequest', result);
        if (result.Result.startsWith('SUCCESS')) {
          setReportModal(!ReportModal);
          setLoader(false);
          const requestId = result.Result.split('-')[1] || '';
          const successMessage = `${requestId} Taxi request has been submitted successfully!`;
          // GetReportApi();
          Alert.alert(successMessage);
          setApproxKm('');
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BuisnessTravel',
            })
          );
        }
        else {
          setReportModal(!ReportModal);
          setLoader(false);
          // GetReportApi();
          console.log(result.Result);
          Alert.alert(result.Result);
          setApproxKm('');
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BuisnessTravel',
            })
          );
        }
      })
      .catch(error => {
        setLoader(false);
        // setReportModal(!ReportModal);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
    // navigation.navigate('TripSubmit', { tripData: newData });
  };
  const emptyList = () => {
    setSearch('');
  };
  //AvailableTours
  const AvailableTours = () => {
    if (!validate()) {
      return;
    }
    let apiData = {
      Passenger: psngr,
      Startdate: moment(timeExp).format('DD-MMM-YYYY').toUpperCase(),
      UserName: userNT
    };
    let token = AppUserData.token;
    console.log(apiData);
    setLoader(true);
    ApiService.PostMethode('/AvailableToursEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value || [];
        console.log("----", responseData);
        if (responseData.length > 0) {
          setModalData(responseData); // ✅ Save full array
        } else {
          setModalData([]); // ✅ Empty array if no data
        }
        setReportModal(true); // ✅ Open modal after fetching
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const getEmpDet = () => {
    let apiData = { AppName: "HR-ASSIST", UserName: userNT };
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
        console.log("hiiamhere", responseData);
        setSelfCostC(responseData[0].EMPL_CCEN_CODE);
        setSelfRM(responseData[0].EMPL_MGR_NAME);
        setSelfName(responseData[0].EMPL_NAME);
        setSelfMobile(responseData[0].EMPL_MOBILE_NO);
        setSelfIsDpm(responseData[0].EMPL_IS_DPM);
        setCostC(responseData[0].EMPL_CCEN_CODE);
        setRM(responseData[0].EMPL_MGR_NAME);
        setIsDpm(responseData[0].EMPL_IS_DPM);
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  console.log("heythere12", CostC)
  const getAdsnlAprv = (empId = userId) => {
    let apiData = { UserName: empId };
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetDivnApprEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
        const dropdownData = responseData.map(emp => ({
          label: emp.EMPL_NAME,
          value: emp.EMPL_ID
        }));
        setAdditionalAprv(dropdownData);
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const GetModel = () => {
    let apiData = { UserName: userId, ModelCode: "", ModelMake: "" };
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetModelEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
        console.log("---R---", responseData);
        setTaxiModelsFull(responseData);
        const dropdownData = responseData.map(emp => ({
          label: emp.MODL_CODE,
          value: emp.MODL_CLASS_CODE,
          capcity: emp.MODL_PASS_CAP
        }));
        setTaxiModal(dropdownData);
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const SearchEmployee = (searchText, passengerIndex = -1) => {
    console.log("----", searchText, passengerIndex);
    if (!searchText) {
      Toast.show('Please enter a valid search term.', Toast.LONG);
      return;
    }
    let token = AppUserData.token;
    setLoader(true);
    if (passengerIndex >= 0) {
      let apiData = { AppName: "HR-ASSIST", UserName: searchText };
      ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
        .then(result => {
          setLoader(false);
          console.log(result.Value);
          if (result.Value && result.Value.length > 0) {
            let responseData = result.Value[0];
            const updatedForms = [...passengerForms];
            updatedForms[passengerIndex].pName = responseData.EMPL_NAME;
            updatedForms[passengerIndex].pMob = responseData.EMPL_MOBILE_NO;
            updatedForms[passengerIndex].pStaffId = searchText;
            setPassengerForms(updatedForms);
          } else {
            Toast.show('Employee not found.', Toast.LONG);
            // 🔥 Reset ONLY the passenger form for this index
            const updatedForms = [...passengerForms];
            updatedForms[passengerIndex].pName = '';
            updatedForms[passengerIndex].pMob = '';
            updatedForms[passengerIndex].pStaffId = '';
            setPassengerForms(updatedForms);
          }
        })
        .catch(error => {
          setLoader(false);
          ApiService.showErrorMessage(error, authContext);
        });
    } else {
      // let apiData = { Search: searchText, UserName: userId };
      let apiData = { AppName: "HR-ASSIST", UserName: searchText };
      console.log(apiData);
      ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
        .then(result => {
          setLoader(false);
          console.log(result);
          let responseData = result.Value[0];
          // Extract only required fields
          const selectedData = {
            EMPL_NAME: responseData.EMPL_NAME,
            EMPL_DESG_CODE: responseData.EMPL_DESG_CODE,
            EMPL_MOBILE_NO: responseData.EMPL_MOBILE_NO,
            EMPL_DEPT_CODE: responseData.EMPL_DEPT_CODE,
            EMPL_ID: responseData.EMPL_ID,
            EMPL_CCEN_CODE: responseData.EMPL_CCEN_CODE,
            EMPL_MGR_NAME: responseData.EMPL_MGR_NAME,
            EMPL_IS_DPM: responseData.EMPL_IS_DPM
          };
          console.log("s--", selectedData);
          setEmploy(selectedData);
          // Populate CostC, RM, isDpm for On Behalf
          setCostC(selectedData.EMPL_CCEN_CODE || '');
          setRM(selectedData.EMPL_MGR_NAME || '');
          setIsDpm(selectedData.EMPL_IS_DPM || '');
          // Refresh additional approvers with the searched employee's ID
          getAdsnlAprv(selectedData.EMPL_ID);
          setEmpModalVisible(true);
        })
        .catch(error => {
          setLoader(false);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  };
  useEffect(() => {
    // Set min and max pickup time
    const now = moment();
    setMinPickupTime(now.toDate());
    setMaxPickupTime(now.add(7, 'days').toDate());
  }, []);
  useEffect(() => {
    if (selectedBookingType === 'B' && employ) {
      const updatedForms = [...passengerForms];
      updatedForms[0] = {
        ...updatedForms[0],
        pStaffId: employ.EMPL_ID?.toString() || '',
        pName: employ.EMPL_NAME || '',
        pMob: employ.EMPL_MOBILE_NO || '',
        pFlag: 'E' // ✅ Set passenger type to Employee
      };
      setPassengerForms(updatedForms);
    }
  }, [selectedBookingType, employ]);
  useEffect(() => {
    // Update min and max arrival time when pickup time changes
    if (timeExp) {
      const pickupDate = moment(timeExp);
      setMinArrivalTime(pickupDate.clone().add(1, 'hour').toDate());
      setMaxArrivalTime(pickupDate.clone().add(5, 'days').toDate());
      if (timeExp1 && moment(timeExp1).isBefore(pickupDate.clone().add(1, 'hour'))) {
        setTimeExp1(null); // Clear invalid arrival time
      }
    } else {
      setMinArrivalTime(null);
      setMaxArrivalTime(null);
      setTimeExp1(null);
    }
  }, [timeExp]);
  useEffect(() => {
    getEmpDet();
    getAdsnlAprv();
    GetModel();
  }, []);
  useEffect(() => {
    if (selectedBookingType === 'S') {
      setCostC(selfCostC);
      setRM(selfRM);
      setIsDpm(selfIsDpm);
      getAdsnlAprv(userId); // ✅ Refresh approvers for self booking
      if (selfName && selfMobile) {
        setPassengerForms([{
          id: 'self',
          pStaffId: userId,
          pName: selfName,
          pMob: selfMobile,
          pFlag: 'E'
        }]);
      }
      setNem(selfName);
      setMob(selfMobile);
    } else if (selectedBookingType === 'B') {
      setCostC('');
      setRM('');
      setIsDpm('');
      setPassengerForms([{ id: Date.now(), pStaffId: '', pName: '', pMob: '', pFlag: '' }]);
      setNem('');
      setDesg('');
      setMob('');
      setEmploy(null);
    } else {
      setCostC(selfCostC);
      setRM(selfRM);
      setIsDpm(selfIsDpm);
      getAdsnlAprv(userId);
      setPassengerForms([]);
      setGNem('');
      setGDesg('');
      setGMob('');
      setG_cmpny('');
      setNem('');
      setDesg('');
      setMob('');
    }
    setTimeExp(null);
    setTimeExp1(null);
    setTripFrom('');
    setTripTo('');
    // ✅ Reset waypoints but KEEP one empty textbox
    setWaypoints([{ value: '', suggestions: [] }]);
    setTripPurpose('');
    setSelectedTaxi('');
   setSelectedPerson('');
    setApproxKm('');
    setTripWay('');
    if (taxiDropdownRef.current) taxiDropdownRef.current.reset();
    if (ApproverDropdownRef.current) ApproverDropdownRef.current.reset();
    if (personDropdownRef.current) personDropdownRef.current.reset();
  }, [selectedBookingType, selfName, selfMobile]);
  useEffect(() => {
    if (selectedTaxi) {
      const selectedModel = taxiModelsFull.find(emp => emp.MODL_CLASS_CODE === selectedTaxi);
      if (selectedModel) {
        setPassengerLimit(selectedModel.MODL_PASS_CAP);
      }
    }
  }, [selectedTaxi, taxiModelsFull]);
  const stopLoader = () => {
    try {
      setLoader(false);
      setRefresh(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Get current DPM flag based on booking type
  const getCurrentDpmFlag = () => {
    if (selectedBookingType === 'B') {
      return isDpm;
    }
    // For Self and Guest, use selfIsDpm
    return selfIsDpm;
  };
  const shouldHideReportingAndApprover = getCurrentDpmFlag() === 'Y';
  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingScreen />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <View style={{ marginHorizontal: 2, marginBottom: "35%", flex: 1 }}>
            <View style={{ width: '100%', paddingRight: 10, marginVertical: 10 }}>
              <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                Booking Type {<Text style={{ color: 'red' }}>*</Text>}
              </Text>
              <SelectDropdown
                ref={bookingTypeDropdownRef}
                buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                defaultButtonText={
                  selectedBookingType
                    ? BookingTypes.find(x => x.value === selectedBookingType)?.label
                    : "Select Booking Type"
                }
                rowTextForSelection={(item) => item.label}
                dropdownBackgroundColor={'transparent'}
                data={BookingTypes}
                onSelect={(selectedItem) => {
                  setSelectedBookingType(selectedItem.value);
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => (
                  <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#43C6DB'} size={14} />
                )}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
              />
            </View>
            <View>
              {selectedBookingType === 'B' && (
                <View style={{ width: '100%', marginVertical: 10 }}>
                  <Text style={{ paddingHorizontal: 0, paddingTop: 10, paddingVertical: 5, fontSize: 13 }} Bold>
                    On Behalf
                  </Text>
                  <View style={{ width: '100%', flexDirection: 'row', borderWidth: 1, borderRadius: 5, alignSelf: 'center', backgroundColor: '#fff', borderColor: '#43C6DB' }}>
                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="search" size={18} color={'#43C6DB'} />
                    </View>
                    <TextInput
                      placeholder="Search By Staff ID"
                      value={search}
                      onChangeText={data => setSearch(data)}
                      style={{ width: '70%', paddingVertical: 5, fontSize: 13, height: 40 }}
                    />
                    {search !== '' && (
                      <TouchableOpacity style={{ borderRadius: 8, marginLeft: -10, alignSelf: 'center' }} onPress={emptyList}>
                        <Ionicons name="close-circle-outline" size={25} color='#43C6DB' />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => SearchEmployee(search)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="send" size={20} color={'#43C6DB'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {selectedBookingType === 'B' && (
                <View style={{ width: '100%', alignSelf: 'center', marginVertical: 10 }}>
                  <Text style={{ paddingHorizontal: 0, fontSize: 13, fontWeight: 'bold' }}>Name</Text>
                  <TextInput
                    value={nem}
                    placeholder="Enter Name"
                    editable={false} // makes it non-editable
                    style={{
                      marginVertical: 10,
                      width: '100%',
                      borderWidth: 1,
                      paddingVertical: 5,
                      alignSelf: 'center',
                      borderRadius: 8,
                      backgroundColor: '#E0E0E0', // light gray background
                      borderColor: '#43C6DB',
                      fontSize: 13,
                      height: 40
                    }}
                  />
                  <Text style={{ paddingHorizontal: 0, fontSize: 13, fontWeight: 'bold' }}>Designation</Text>
                  <TextInput
                    value={desg}
                    placeholder="Enter Designation"
                    editable={false} // disables editing
                    style={{
                      marginVertical: 10,
                      width: '100%',
                      borderWidth: 1,
                      paddingVertical: 12,
                      alignSelf: 'center',
                      borderRadius: 8,
                      backgroundColor: '#E0E0E0', // light gray background
                      borderColor: '#43C6DB',
                      height: 40,
                      fontSize: 13
                    }}
                  />
                </View>
              )}
              <Text style={{ paddingHorizontal: 0, fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>From</Text>
              <View style={{ width: '100%', marginVertical: 10 }}>
                <TextInput
                  value={tripFrom}
                  placeholder="Enter Your Pickup location"
                 onChangeText={(text) => {
                    setTripFrom(text);
                    fetchPlaceSuggestions(text);
                  }}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 12,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize: 13,
                    height: 40
                  }}
                />
                {fromSuggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    onPress={() => {
                      setTripFrom(item.description);
                      setFromSuggestions([]);
                      const cleanedWaypoints = waypoints
                        .filter(w => w.value?.trim() !== "")
                        .map(w => w.value); // <-- IMPORTANT
                      if (tripTo && cleanedWaypoints.length === 0) {
                        fetchDistanceBetweenPlaces(item.description, tripTo);
                      } else if (tripTo && cleanedWaypoints.length > 0) {
                        calculateTotalDistanceWithWaypoints(item.description, tripTo, cleanedWaypoints);
                      }
                    }}
                  >
                    <Text style={{ padding: 10 }}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
                {formErrors.from && (
                  <Text style={styles.errorText}>{formErrors.from}</Text>
                )}
              </View>
              <Text style={{ paddingHorizontal: 0, fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>To</Text>
              <View style={{ width: '100%', marginVertical: 10 }}>
                <TextInput
                  value={tripTo}
                  placeholder="Enter Your Drop location"
                  onChangeText={(text) => {
                    setTripTo(text);
                    fetchToSuggestions(text);
                  }}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 12,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize: 13,
                    height: 40
                  }}
                />
                {toSuggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    onPress={() => {
                      setTripTo(item.description);
                      setToSuggestions([]);
                      const cleanedWaypoints = waypoints
                        .filter(w => w.value?.trim() !== "")
                        .map(w => w.value); // <-- IMPORTANT
                      // ⭐ If From and To are the SAME → Waypoint required
                      if (tripFrom && tripFrom.trim() === item.description.trim()) {
                        if (cleanedWaypoints.length === 0) {
                          Toast.show('Waypoints are mandatory when Pickup and Destination are the same', Toast.LONG);
                          return;
                        }
                      }
                      if (tripFrom && cleanedWaypoints.length === 0) {
                        fetchDistanceBetweenPlaces(tripFrom, item.description);
                      } else if (tripFrom && cleanedWaypoints.length > 0) {
                        calculateTotalDistanceWithWaypoints(tripFrom, item.description, cleanedWaypoints);
                      }
                    }}
                  >
                    <Text style={{ padding: 10, backgroundColor: '#f0f0f0', borderBottomWidth: 1 }}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
                {formErrors.to && (
                  <Text style={styles.errorText}>{formErrors.to}</Text>
                )}
              </View>
              <View style={{
                //flexDirection: 'row',
                //justifyContent: 'space-between',
                width: '100%',
                // alignItems: 'flex-start',
                marginTop: 15
              }}>
                {/* Waypoints Section */}
                {waypoints.length > 0 && (
                  <View style={{ flex: 1, paddingRight: 10, width: '100%' }}>
                    {/* Show label only if waypoint fields exist */}
                    <Text style={{ fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>Waypoints</Text>
                    {waypoints.map((wp, index) => (
                      <View key={index} style={{ marginBottom: 15 }}>
                        {/* TextInput wrapper with X button inside */}
                        <View style={{ position: "relative" }}>
                          <TextInput
                            value={wp.value}
                            placeholder={`Waypoint ${index + 1}`}
                            onChangeText={(text) => {
                              setWaypoints(prev => {
                                const updated = [...prev];
                                updated[index].value = text;
                                return updated;
                              });
                              fetchWaySuggestions(text, index);
                            }}
                            style={{
                              marginTop: 8,
                              width: '100%',
                              borderWidth: 1,
                              paddingVertical: 12,
                              paddingRight: 35, // space for X button
                              borderRadius: 8,
                              backgroundColor: '#fff',
                              borderColor: '#43C6DB',
                              fontSize: 13,
                              height: 40
                            }}
                          />
                          {/* ❌ Cross Button to Remove Waypoint */}
                          {wp.value !== "" && (
                            <TouchableOpacity
                              onPress={() => removeWaypoint(index)}
                              style={{
                                position: "absolute",
                                right: 10,
                                top: 12,
                                backgroundColor: "#f8d7da",
                                width: 24,
                                height: 24,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 12
                              }}
                            >
                              <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>×</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        {/* Suggestions for this waypoint */}
                        {wp.suggestions.map(item => (
                          <TouchableOpacity
                            key={item.place_id}
                            onPress={() => {
                              // Update text
                             setWaypoints(prev => {
                                const updated = [...prev];
                                updated[index].value = item.description;
                                updated[index].suggestions = [];
                                return updated;
                              });
                              // Recalculate distance after selecting suggestion
                              setTimeout(() => {
                                const cleaned = waypoints
                                  .filter(w => w.value?.trim() !== "")
                                  .map(w => w.value);
                                if (tripFrom && tripTo) {
                                  if (cleaned.length === 0) {
                                    fetchDistanceBetweenPlaces(tripFrom, tripTo);
                                  } else {
                                    calculateTotalDistanceWithWaypoints(tripFrom, tripTo, cleaned);
                                  }
                                }
                              }, 50);
                            }}
                          >
                            <Text
                              style={{
                                padding: 10,
                                backgroundColor: '#f0f0f0',
                                borderBottomWidth: 1
                              }}
                            >
                              {item.description}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                    {/* Add Waypoints Button - Aligned below waypoints */}
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        padding: 10,
                        alignSelf: 'center',
                        borderColor: '#43C6DB',
                        marginVertical: 10
                      }}
                      onPress={handleAddWaypoint}
                    >
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#43C6DB' }}>
                        + Add Waypoint
                      </Text>
                    </TouchableOpacity>
                    {formErrors.waypoints && (
                      <Text style={styles.errorText}>{formErrors.waypoints}</Text>
                    )}
                  </View>
                )}
                {/* // ✅ Approx KM Section */}
                <View style={{ flex: 1, paddingLeft: 10 }}>
                </View>
              </View>
              <Text style={{ marginBottom: 5, fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>
                Approx KM <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                value={ApproxKm}
                placeholder="Approximate Distance"
                editable={false}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: '#F3F2F1',
                  borderColor: '#43C6DB',
                  fontSize: 13,
                  height: 40,
                  marginVertical: 10
                }}
              />
              <View>
                <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                  Purpose {<Text style={{ color: 'red' }}>*</Text>}
                </Text>
                <View style={{ width: '100%', marginVertical: 10 }}>
                  <TextInput
                    value={tripPurpose}
                    placeholder="Enter Purpose"
                    onChangeText={handlePurpose}
                    style={{ width: '100%', borderWidth: 1, paddingVertical: 12, alignSelf: 'center', borderRadius: 8, backgroundColor: GlobalColor.White, borderColor: '#43C6DB', fontSize: 13, height: 40 }}
                  />
                  {formErrors.purpose && (
                    <Text style={styles.errorText}>{formErrors.purpose}</Text>
                  )}
                </View>
              </View>
              {/* Improved alignment for Taxi Model and Cost Center */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10 }}>
                <View style={{ width: '48%', paddingRight: 2 }}>
                  <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                    Taxi Model {<Text style={{ color: 'red' }}>*</Text>}
                  </Text>
                  <SelectDropdown
                    ref={taxiDropdownRef}
                    buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                    defaultButtonText={selectedTaxi ? selectedTaxi : 'Select Taxi'}
                    rowTextForSelection={(item) => item.label}
                    dropdownBackgroundColor={'transparent'}
                    data={taxiModal}
                    onSelect={(selectedItem) => {
                      // console.log("Tour Type 1",selectedItem.value);
                      // console.log("Tour Type 2",selectedItem.label);
                      console.log(selectedItem.capcity);
                      setPassengerLimit(selectedItem.capcity);
                      setSelectedTaxi(selectedItem.label);
                      settaxiModalSelct(true);
                    }}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderDropdownIcon={isOpened => (
                      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#43C6DB'} size={14} />
                    )}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                  {formErrors.taxi && (
                    <Text style={styles.errorText}>{formErrors.taxi}</Text>
                  )}
                </View>
                <View style={{ width: '48%', paddingLeft: 2 }}>
                  <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                    Cost Center {<Text style={{ color: 'red' }}>*</Text>}
                  </Text>
                  <TextInput
                    value={CostC}
                    editable={false}
                    style={{ marginVertical: 1, width: '100%', borderWidth: 1, paddingVertical: 12, alignSelf: 'center', borderRadius: 8, backgroundColor: '#F3F2F1', borderColor: '#43C6DB', fontSize: 13, height: 40 }}
                  />
                </View>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                is24Hour={false}
                onConfirm={handleConfirma}
                onCancel={hideDatePickera}
                minimumDate={minPickupTime}
                maximumDate={maxPickupTime}
                minuteInterval={15}
                customCancelButtonIOS={() => (
                  <TouchableOpacity onPress={handleClearPickup} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{ width: '100%', marginBottom: 30 }}>
                <View style={{ width: '100%', paddingRight: 10, marginVertical: 10 }}>
                  <Text style={{ paddingHorizontal: 0, paddingTop: 10, paddingVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                    Expected Pickup Time: {<Text style={{ color: 'red' }}>*</Text>}
                  </Text>
                  <TouchableOpacity
                    style={{ width: '100%', backgroundColor: GlobalColor.White, borderWidth: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 12, alignSelf: 'center', borderColor: '#43C6DB', borderRadius: 8 }}
                    onPress={showDatePickera}
                  >
                    <Text style={{ color: timeExp ? 'black' : 'gray', fontSize: 13 }}>
                      {timeExp ? moment(timeExp).format('YYYY-MM-DD HH:mm') : 'Select Pickup Time'}
                    </Text>
                    <Ionicons name="calendar-outline" size={22} color={'#43C6DB'} />
                  </TouchableOpacity>
                  {formErrors.pickupTime && (
                    <Text style={styles.errorText}>{formErrors.pickupTime}</Text>
                  )}
                </View>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible1}
                  mode="datetime"
                  is24Hour={false}
                  onConfirm={handleConfirma1}
                  onCancel={hideDatePickera1}
                  minimumDate={minArrivalTime || minPickupTime}
                  maximumDate={maxArrivalTime}
                  minuteInterval={15}
                  customCancelButtonIOS={() => (
                    <TouchableOpacity onPress={handleClearArrival} style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  )}
                />
                <View style={{ width: '100%', paddingRight: 10, marginVertical: 10 }}>
                  <Text style={{ paddingHorizontal: 0, paddingTop: 10, paddingVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                    Expected Arrival Time: {<Text style={{ color: 'red' }}>*</Text>}
                  </Text>
                  <TouchableOpacity
                    style={{ width: '100%', backgroundColor: GlobalColor.White, borderWidth: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 12, alignSelf: 'center', borderColor: '#43C6DB', borderRadius: 8 }}
                    onPress={showDatePickera1}
                  >
                    <Text style={{ color: timeExp1 ? 'black' : 'gray', fontSize: 13 }}>
                     {timeExp1 ? moment(timeExp1).format('YYYY-MM-DD HH:mm') : 'Select Arrival Time'}
                    </Text>
                    <Ionicons name="calendar-outline" size={22} color={'#43C6DB'} />
                  </TouchableOpacity>
                  {formErrors.arrivalTime && (
                    <Text style={styles.errorText}>{formErrors.arrivalTime}</Text>
                  )}
                </View>
              </View>
              {!shouldHideReportingAndApprover && (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                  <View style={{ width: '50%', paddingRight: 10 }}>
                    <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                      Reporting manager {<Text style={{ color: 'red' }}>*</Text>}
                    </Text>
                    <TextInput
                      value={RM}
                      editable={false}
                      style={{ marginVertical: 1, width: '100%', borderWidth: 1, paddingVertical: 12, alignSelf: 'center', borderRadius: 8, backgroundColor: '#F3F2F1', borderColor: '#43C6DB', fontSize: 13, height: 40 }}
                    />
                  </View>
                  <View style={{ width: '50%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>
                      Additional Approver
                    </Text>
                    <CheckBox
                      disabled={false}
                      value={!isSelected}
                      onChange={() => setSelection(!isSelected)}
                      tintColors={{ true: '#43C6DB', false: GlobalColor.LightDark }}
                      boxType="square"
                      style={{ height: 20, width: 20, marginRight: 5, marginLeft: 10 }}
                    />
                  </View>
                </View>
              )}
              {!shouldHideReportingAndApprover && !isSelected && (
                <View style={{ width: '100%', paddingRight: 10, marginBottom: "10%" }}>
                  <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                    Select Additional Approver
                  </Text>
                  <SelectDropdown
                    ref={ApproverDropdownRef}
                    buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                    defaultButtonText={AdnAprv ? AdnAprv : 'Select Approver'}
                    rowTextForSelection={(item) => item.label}
                    dropdownBackgroundColor={'transparent'}
                    data={additionAprv}
                    onSelect={(selectedItem) => {
                      setAdnAprv(selectedItem.value);
                    }}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderDropdownIcon={isOpened => (
                      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#43C6DB'} size={14} />
                    )}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                </View>
              )}
              {/* Remaining Capacity - Moved above passenger details */}
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
                  Remaining Capacity: {passengerLimit - passengerForms.length}
                </Text>
                {formErrors.passengerLimit && (
                  <Text style={styles.errorText}>{formErrors.passengerLimit}</Text>
                )}
              </View>
              {passengerForms.map((form, index) => {
                const isSelfOrFirstOnBehalf = form.id === 'self' || (selectedBookingType === 'B' && index === 0);
                const isEditableMobile = true; // ✅ Make mobile editable for all passengers (previously restricted, now always editable)
                return (
                <View key={form.id} style={{ marginBottom: "15%", marginTop: "3%", borderColor: "#43c6db", borderWidth: 1, borderRadius: 10, padding: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ textAlign: "left", marginBottom: 5, backgroundColor: "#3f51b5", color: "#fff", borderRadius: 5, fontWeight: "bold", fontSize: 16, paddingHorizontal: 10, paddingVertical: 5 }}>
                      Passenger Details {index + 1}
                    </Text>
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={() => handleRemovePassenger(form.id)}
                        style={{}}
                      >
                        <Ionicons name="trash" size={25} color={GlobalColor.Danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ width: '49%', paddingRight: 5 }}>
                      <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                        Passenger Type {<Text style={{ color: 'red' }}>*</Text>}
                      </Text>
                      <SelectDropdown
                        ref={passengerDropdownRef}
                        buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                        defaultButtonText={
                          selectedBookingType === 'B' && index === 0
                            ? 'Employee'
                            : form.pFlag === 'E'
                              ? 'Employee'
                              : form.pFlag === 'G'
                                ? 'Guest'
                                : 'Select Type'
                        }
                        rowTextForSelection={(item) => item.label}
                        dropdownBackgroundColor={'transparent'}
                        data={PassengerType}
                        onSelect={(selectedItem) => {
                          const updatedForms = [...passengerForms];
                          updatedForms[index] = { ...updatedForms[index], pFlag: selectedItem.value };
                          setPassengerForms(updatedForms);
                          if (selectedItem.value !== 'E') {
                            updatedForms[index].pStaffId = '';
                            updatedForms[index].pName = '';
                            updatedForms[index].pMob = '';
                            setPassengerForms(updatedForms);
                          }
                        }}
                        // buttonStyle={styles.dropdown2BtnStyle}
                        buttonStyle={{
                          ...styles.dropdown2BtnStyle,
                          backgroundColor:
                            form.id === 'self' || (selectedBookingType === 'B' && index === 0)
                              ? '#F3F2F1' // grey background for auto-selected employee
                              : '#FFFFFF', // white for normal selection
                        }}
                        buttonTextStyle={styles.dropdown2BtnTxtStyle}
                        renderDropdownIcon={isOpened => (
                          <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#43C6DB'} size={14} />
                        )}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown2DropdownStyle}
                        rowStyle={styles.dropdown2RowStyle}
                        rowTextStyle={styles.dropdown2RowTxtStyle}
                        disabled={form.id === 'self' || (selectedBookingType === 'B' && index === 0)}
                      />
                      {passengerErrors[index]?.pFlag && (
                        <Text style={styles.errorText}>{passengerErrors[index].pFlag}</Text>
                      )}
                    </View>
                    <View style={{ width: '49%', paddingLeft: 5 }}>
                      <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                        Passenger Staff Id {<Text style={{ color: 'red' }}>*</Text>}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, borderColor: '#43C6DB', backgroundColor: form.pFlag === 'E' ? '#F3F2F1' : '#F3F2F1', height: 40, width: '100%' }}>
                        <TextInput
                          value={form.pStaffId}
                          placeholder="Enter Staff Id"
                          onChangeText={text => {
                            const updatedForms = [...passengerForms];
                            updatedForms[index] = { ...updatedForms[index], pStaffId: text.replace(/[^0-9]/g, '').slice(0, 6) };
                            setPassengerForms(updatedForms);
                            if (text.length === 6 && form.pFlag === 'E' && form.id !== 'self' && !(selectedBookingType === 'B' && index === 0)) {
                              SearchEmployee(text, index);
                            }
                          }}
                          editable={form.id !== 'self' && form.pFlag === 'E' && !(selectedBookingType === 'B' && index === 0)}
                          style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 13, backgroundColor: (form.id !== 'self' && form.pFlag === 'E' && !(selectedBookingType === 'B' && index === 0)) ? GlobalColor.White : 'transparent' }}
                        />
                        {form.pFlag === 'E' && form.id !== 'self' && !(selectedBookingType === 'B' && index === 0) && (
                          <TouchableOpacity onPress={() => SearchEmployee(form.pStaffId, index)} style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="send" size={20} color={'#43C6DB'} />
                          </TouchableOpacity>
                        )}
                      </View>
                      {passengerErrors[index]?.pStaffId && (
                        <Text style={styles.errorText}>{passengerErrors[index].pStaffId}</Text>
                      )}
                    </View>
                  </View>
                  <View style={{ width: '100%' }}>
                    <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                      Passenger Name {<Text style={{ color: 'red' }}>*</Text>}
                    </Text>
                    <TextInput
                      value={form.pName}
                      placeholder="Enter Passenger Name"
                      onChangeText={text => {
                        const updatedForms = [...passengerForms];
                        updatedForms[index] = { ...updatedForms[index], pName: text };
                        setPassengerForms(updatedForms);
                      }}
                      editable={form.pFlag === 'G'}
                      style={{ marginVertical: 1, width: '100%', borderWidth: 1, paddingVertical: 12, alignSelf: 'center', borderRadius: 8, backgroundColor: form.pFlag === 'E' ? '#F3F2F1' : GlobalColor.White, borderColor: '#43C6DB', fontSize: 13, height: 40 }}
                    />
                    {passengerErrors[index]?.pName && (
                      <Text style={styles.errorText}>{passengerErrors[index].pName}</Text>
                    )}
                  </View>
                  <View style={{ width: '100%', marginBottom: 10 }}>
                    <Text style={{ paddingHorizontal: 4, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                      Passenger Mobile No {<Text style={{ color: 'red' }}>*</Text>}
                    </Text>
                    <TextInput
                      value={form.pMob}
                      placeholder="Enter Mobile No."
                      onChangeText={text => {
                        const updatedForms = [...passengerForms];
                        updatedForms[index] = { ...updatedForms[index], pMob: text.replace(/[^0-9]/g, '').slice(0, 10) };
                        setPassengerForms(updatedForms);
                      }}
                      editable={isEditableMobile} // ✅ Now always editable
                      keyboardType="numeric"
                      maxLength={10}
                      style={{ marginVertical: 1, width: '100%', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12, alignSelf: 'center', borderRadius: 8, backgroundColor: GlobalColor.White, borderColor: '#43C6DB', fontSize: 13, height: 40 }}
                    />
                    {passengerErrors[index]?.pMob && (
                      <Text style={styles.errorText}>{passengerErrors[index].pMob}</Text>
                    )}
                  </View>
                </View>
              )})}
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: 'transparent', borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 12, alignSelf: 'center', borderColor: '#43C6DB', marginVertical: 10 }}
                onPress={handleAddPassenger}
              >
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#43C6DB' }}>
                  + Add Passenger
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: '#43C6DB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 12, alignSelf: 'center', marginVertical: 10 }}
                onPress={AvailableTours}
              >
                <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal transparent={false} visible={empModalVisible}>
        <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: GlobalColor.White, padding: 0, borderRadius: 0, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0 }} onPress={() => setEmpModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={30} color={'#43C6DB'} />
            </TouchableOpacity>
            <FlatList
              style={{ width: '100%', marginHorizontal: 0, marginTop: 40 }}
              ListEmptyComponent={<ListEmptyComponent title="No Data Found" enableRefresh={false} subtitle="Please change the Id & Employee Name" />}
              data={employ ? [employ] : []}
              keyExtractor={item => item.EMPL_ID}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.FlatListData}
                  key={index}
                  onPress={() => {
                    setNem(item.EMPL_NAME);
                    setDesg(item.EMPL_DESG_CODE);
                    setMob(item.EMPL_MOBILE_NO);
                    setEmpModalVisible(false);
                  }}
                >
                  <Ionicons name="person-circle-outline" size={25} color={'#43C6DB'} />
                  <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16 }}>{item.EMPL_NAME}</Text>
                    <Text>{item.EMPL_DESG_CODE} , {item.EMPL_DEPT_CODE} ({item.EMPL_ID})</Text>
                  </View>
                  <Ionicons name="chevron-forward-circle-outline" size={25} color={'#43C6DB'} />
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
      {/* Merge Request Id Start*/}
      <Modal isVisible={ReportModal} transparent={true}>
        <View style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 8,
          width: '100%',
          maxHeight: '90%' // ✅ Prevent overflow
        }}>
          {/* ✅ Header (Fixed) */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#43C6DB' }}>
              Available Trips For Merge
            </Text>
            <TouchableOpacity onPress={() => setReportModal(false)}>
              <Ionicons name="close-circle-outline" size={28} color={GlobalColor.Danger} />
            </TouchableOpacity>
          </View>
          {/* ✅ Scrollable Trip List */}
          <ScrollView style={{ marginTop: 10, maxHeight: 400 }}>
            {modalData.length === 0 ? (
              <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginVertical: 20 }}>
                No data available for merge
              </Text>
            ) : (
              modalData.map((item, index) => (
                <View key={index} style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 12,
                  backgroundColor: '#f9f9f9'
                }}>
                  {/* ✅ Bold title + normal data */}
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Request Id: </Text>{item.RQST_ID}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Requester Name: </Text>{item.RQST_RQSTR_NAME}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Requester Dept: </Text>{item.RQST_RQSTR_DEPT}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>From Place: </Text>{item.RQST_FROM_PLACE}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>To Place: </Text>{item.RQST_TO_PLACE}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Way Point: </Text>{item.RQST_WAY_POINT || 'N/A'}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Model: </Text>{item.MODL_CODE}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Remaining Capacity: </Text>{item.REM_CAP}
                  </Text>
                  <Text style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13 }}>Departure Time: </Text>
                    {moment(item.RQST_START_DATE).format('DD-MMM-YYYY HH:mm')}
                  </Text>
                  {/* ✅ Merge Trip Button for this item */}
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      borderRadius: 5,
                      backgroundColor: GlobalColor.Secondary,
                      marginTop: 10,
                      alignSelf: 'flex-start',
                      width: 120
                    }}
                    onPress={() => handleButtonPress(item.RQST_ID, 'Merge')}
                  >
                    <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>Merge Trip</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
          {/* ✅ Footer (Fixed) */}
          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            borderTopWidth: 1,
            borderColor: '#ddd',
            marginTop: 10,
            paddingTop: 10
          }}>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: GlobalColor.Secondary,
                minWidth: 120
              }}
              onPress={() => handleButtonPress("", 'Submit')}
            >
              <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>Skip Merge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Merge Request Id End */}
      {/* Terms and Condition Start*/}
      <Modal isVisible={TandCModal} transparent={true}>
        <View style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 8,
         width: '100%',
          maxHeight: '60%' // ✅ Prevent overflow
        }}>
          {/* ✅ Header (Fixed) */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#43C6DB' }}>
              Terms and Condition
            </Text>
            <View style={styles.container}>
            </View>
            {/* <TouchableOpacity onPress={() => setTandC(false)}>
        <Ionicons name="close-circle-outline" size={28} color={GlobalColor.Danger} />
      </TouchableOpacity> */}
          </View>
          {loadingImages ? (
            <View style={{ alignItems: "center", justifyContent: "center", height: 200 }}>
              <ActivityIndicator size="large" color="#43C6DB" />
              <Text style={{ marginTop: 10, color: "#555" }}>Loading...</Text>
            </View>
          ) : (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <ScrollView showsVerticalScrollIndicator={true}>
                {pdfImages.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={{
                      width: 550, // Large width for zoom
                      height: 780, // Large height for zoom
                      resizeMode: "contain",
                      marginBottom: 20,
                      marginLeft: -50
                    }}
                  />
                ))}
              </ScrollView>
            </ScrollView>
          )}
          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            borderTopWidth: 1,
            borderColor: '#ddd',
            marginTop: 10,
            paddingTop: 10
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 35 }}>
              <CheckBox
                disabled={false}
                value={!isSelectedTerm}
                onChange={() => setSelectionTerm(!isSelectedTerm)}
                tintColors={{ true: '#43C6DB', false: GlobalColor.LightDark }}
                boxType="square"
                // hideBox
                style={{ height: 20, width: 20, marginRight: 5 }}
              />
              <Text style={{ fontSize: 13, fontWeight: 'bold', marginVertical: 5 }}>
                I accept the{' '}
                <Text
                  style={{ color: 'blue', fontSize: 13, fontWeight: 'bold' }}
                  onPress={() => Linking.openURL('https://swifttest.maruti.co.in/HrAssist/Images/T&c.pdf')}
                >
                  terms and conditions
                </Text>
              </Text>
            </View>
          </View>
          {isSelectedTerm == false ?
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: GlobalColor.Secondary,
                minWidth: 120,
                marginTop: 10
              }}
              onPress={() => setTandC(false)}
            >
              <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>I Agree</Text>
            </TouchableOpacity>
            : null}
        </View>
     </Modal>
      {/* Terms and Condition End */}
    </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Link: {
    color: '#43C6DB',
    fontWeight: '600',
    fontSize: 13,
  },
  spinnerTextStyle: {
    color: '#fff'
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
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 14 },
  dropdown2DropdownStyle: { backgroundColor: GlobalColor.White },
  dropdown2RowStyle: { backgroundColor: GlobalColor.White, borderBottomColor: '#43C6DB' },
  dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 16 },
  clearButton: {
    backgroundColor: '#FF4D4F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'left',
  },
});
export default InitTaxiReq;