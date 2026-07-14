import React, {useState, useContext} from 'react';
import {
 View,
 StyleSheet,
 TouchableOpacity,
 SafeAreaView,
 FlatList,
 Modal,
 ActivityIndicator,
 Image,
 ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WebView} from 'react-native-webview';

// create a component
const AdvanceReport = () => {
 const [loader, setLoader] = useState(false);
 const [reportData, setReportData] = useState([]);
 const {authContext, AppUserData} = useContext(AuthContext);
 const [selectedFinYear, setSelectedFinYear] = useState('');
 const [finYearOptions, setFinYearOptions] = useState([]);
 const [activityLogModal, setActivityLogModal] = useState(false);
 const [activityLogData, setActivityLogData] = useState([]);
 const [selectedRequestId, setSelectedRequestId] = useState('');
 const [attachmentModal, setAttachmentModal] = useState(false);
 const [attachmentData, setAttachmentData] = useState([]);
 const [fileViewerModal, setFileViewerModal] = useState(false);
 const [selectedFileBase64, setSelectedFileBase64] = useState('');
 const [selectedFileName, setSelectedFileName] = useState('');
 const [selectedFileType, setSelectedFileType] = useState(''); // 'pdf' | 'image' | 'tif'

 const getCurrentFinancialYear = () => {
 const currentDate = moment();
 const currentMonth = currentDate.month() + 1;
 const currentYear = currentDate.year();
 let startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
 const fyStart = startYear.toString().substring(2, 4);
 const fyEnd = (startYear + 1).toString().substring(2, 4);
 return fyStart + fyEnd;
 };

 const generateFinYearOptions = () => {
 const currentDate = moment();
 const currentMonth = currentDate.month() + 1;
 const currentYear = currentDate.year();
 let startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
 const years = [{ label: 'All Years', value: '' }];
 for (let year = startYear; year >= 2019; year--) {
 const fyStart = year.toString().substring(2, 4);
 const fyEnd = (year + 1).toString().substring(2, 4);
 years.push({ label: `${year}-${year + 1}`, value: fyStart + fyEnd });
 }
 setFinYearOptions(years);
 };

 useFocusEffect(
 React.useCallback(() => {
 generateFinYearOptions();
 const currentFY = getCurrentFinancialYear();
 setSelectedFinYear(currentFY);
 fetchAdvanceReport(currentFY);
 }, [])
 );

 // Helper: get file type category from filename
 const getFileType = (fileName) => {
 if (!fileName) return 'unknown';
 const ext = fileName.split('.').pop().toLowerCase();
 if (ext === 'pdf') return 'pdf';
 if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
 if (ext === 'tif' || ext === 'tiff') return 'tif';
 return 'unknown';
 };

 // Helper: get MIME type from filename
 const getMimeType = (fileName) => {
 if (!fileName) return 'application/octet-stream';
 const ext = fileName.split('.').pop().toLowerCase();
 const mimeMap = {
 pdf: 'application/pdf',
 jpg: 'image/jpeg',
 jpeg: 'image/jpeg',
 png: 'image/png',
 gif: 'image/gif',
 bmp: 'image/bmp',
 tif: 'image/tiff',
 tiff: 'image/tiff',
 };
 return mimeMap[ext] || 'application/octet-stream';
 };

 const fetchAdvanceReport = (finYear) => {
 const username = AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '';
 let apiData = {
 AppName: 'HOSP ADV',
 UserName: username,
 RequestType: 'ALL',
 RequestID: '',
 FinYear: finYear || '',
 };
 let token = AppUserData.token;
 console.log('Advance Report Request:', apiData);
 console.log('Setting loader to TRUE');
 setLoader(true);
 ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext)
 .then(result => {
 console.log('Advance Report Response:', result);
 console.log('Setting loader to FALSE');
 setLoader(false);
 if (result.Value && Array.isArray(result.Value)) {
 setReportData(result.Value);
 if (result.Value.length === 0) Toast.show('No data found', Toast.SHORT);
 } else {
 setReportData([]);
 Toast.show('No data found', Toast.SHORT);
 }
 })
 .catch(error => {
 console.log('Setting loader to FALSE (error)');
 setLoader(false);
 console.log('Advance Report Error:', error);
 setReportData([]);
 ApiService.showErrorMessage(error, authContext);
 });
 };

 const fetchActivityLog = (requestId) => {
 const compCode = AppUserData?.data?.emplCompCode || '101';
 let apiData = { AppName: 'HOSPITAL', CompCode: compCode, RequestID: requestId };
 let token = AppUserData.token;
 console.log('Activity Log Request:', apiData);
 setLoader(true);
 ApiService.PostMethode('/GetWorflowHistory', apiData, token, authContext)
 .then(result => {
 console.log('Activity Log Response:', result);
 setLoader(false);
 if (result.Value && Array.isArray(result.Value)) {
 setActivityLogData(result.Value);
 setActivityLogModal(true);
 if (result.Value.length === 0) Toast.show('No activity log found', Toast.SHORT);
 } else {
 setActivityLogData([]);
 Toast.show('No activity log found', Toast.SHORT);
 }
 })
 .catch(error => {
 setLoader(false);
 console.log('Activity Log Error:', error);
 setActivityLogData([]);
 ApiService.showErrorMessage(error, authContext);
 });
 };

 const fetchAttachments = (requestId) => {
 const compCode = AppUserData?.data?.emplCompCode || '101';
 let apiData = { AppName: 'HOSPITAL', CompCode: compCode, RequestID: requestId };
 let token = AppUserData.token;
 console.log('Get Attachment Request:', apiData);
 setLoader(true);
 ApiService.PostMethode('/GetHospitalAttachment', apiData, token, authContext)
 .then(result => {
 console.log('Get Attachment Response:', result);
 setLoader(false);
 if (result.Value && Array.isArray(result.Value)) {
 setAttachmentData(result.Value);
 setAttachmentModal(true);
 if (result.Value.length === 0) Toast.show('No attachments found', Toast.SHORT);
 } else {
 setAttachmentData([]);
 Toast.show('No attachments found', Toast.SHORT);
 }
 })
 .catch(error => {
 setLoader(false);
 console.log('Get Attachment Error:', error);
 setAttachmentData([]);
 ApiService.showErrorMessage(error, authContext);
 });
 };

 const openFileViewer = (base64Data, fileName) => {
 try {
 if (!base64Data) { Toast.show('File data not available', Toast.SHORT); return; }
 console.log('Opening file:', fileName);
 const cleanBase64 = base64Data.replace(/[\r\n\s]+/g, '').trim();
 const fileType = getFileType(fileName);
 setSelectedFileBase64(cleanBase64);
 setSelectedFileName(fileName);
 setSelectedFileType(fileType);
 setAttachmentModal(false);
 setTimeout(() => setFileViewerModal(true), 300);
 } catch (error) {
 console.log('Error opening file viewer:', error);
 Toast.show('Error opening file', Toast.SHORT);
 }
 };

 const closeFileViewer = () => {
 setFileViewerModal(false);
 setSelectedFileBase64('');
 setSelectedFileName('');
 setSelectedFileType('');
 setTimeout(() => setAttachmentModal(true), 300);
 };

 const handleActivityLogPress = (requestId) => { setSelectedRequestId(requestId); fetchActivityLog(requestId); };
 const handleAttachmentPress = (requestId) => { setSelectedRequestId(requestId); fetchAttachments(requestId); };
 const handleFinYearChange = (selectedItem) => {
 console.log('Financial Year Changed to:', selectedItem.value);
 setSelectedFinYear(selectedItem.value);
 fetchAdvanceReport(selectedItem.value);
 };

 const getPdfViewerHtml = (base64) => `
 <!DOCTYPE html>
 <html>
 <head>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
 <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
 <style>
 * { margin: 0; padding: 0; box-sizing: border-box; }
 html, body {
 width: 100%;
 height: 100%;
 background-color: #525659;
 overflow: auto;
 -webkit-overflow-scrolling: touch;
 }
 #zoom-container {
 transform-origin: top left;
 width: 100%;
 }
 #pdf-container {
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 10px 0;
 gap: 10px;
 width: 100%;
 }
 canvas {
 display: block;
 width: 100% !important;
 height: auto !important;
 box-shadow: 0 2px 8px rgba(0,0,0,0.4);
 }
 #loading {
 color: #fff;
 font-size: 16px;
 text-align: center;
 margin-top: 40vh;
 font-family: sans-serif;
 }
 #error {
 color: #ff6b6b;
 font-size: 14px;
 text-align: center;
 margin-top: 40vh;
 font-family: sans-serif;
 padding: 20px;
 display: none;
 }
 #page-info {
 color: #ccc;
 font-size: 13px;
 text-align: center;
 font-family: sans-serif;
 padding: 5px 0 10px 0;
 }
 </style>
 </head>
 <body>
 <div id="loading">Loading PDF...</div>
 <div id="error"></div>
 <div id="page-info"></div>
 <div id="zoom-container">
 <div id="pdf-container"></div>
 </div>

 <script>
 pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

 // Pinch to zoom
 let currentScale = 1;
 let startDist = 0;
 let startScale = 1;
 const zoomContainer = document.getElementById('zoom-container');

 function getDistance(touches) {
 const dx = touches[0].clientX - touches[1].clientX;
 const dy = touches[0].clientY - touches[1].clientY;
 return Math.sqrt(dx * dx + dy * dy);
 }

 document.addEventListener('touchstart', function(e) {
 if (e.touches.length === 2) {
 e.preventDefault();
 startDist = getDistance(e.touches);
 startScale = currentScale;
 }
 }, { passive: false });

 document.addEventListener('touchmove', function(e) {
 if (e.touches.length === 2) {
 e.preventDefault();
 const dist = getDistance(e.touches);
 let newScale = startScale * (dist / startDist);
 newScale = Math.min(Math.max(newScale, 1), 5);
 currentScale = newScale;
 zoomContainer.style.transform = 'scale(' + currentScale + ')';
 zoomContainer.style.transformOrigin = 'top left';
 zoomContainer.style.width = (100 / currentScale) + '%';
 }
 }, { passive: false });

 document.addEventListener('touchend', function(e) {
 if (e.touches.length < 2) startDist = 0;
 });

 // Double tap to reset zoom
 let lastTap = 0;
 document.addEventListener('touchend', function(e) {
 const now = Date.now();
 if (now - lastTap < 300) {
 currentScale = 1;
 zoomContainer.style.transform = 'scale(1)';
 zoomContainer.style.width = '100%';
 }
 lastTap = now;
 });

 // PDF rendering
 try {
 const base64Data = '${base64}';
 const pdfData = atob(base64Data);
 const pdfBytes = new Uint8Array(pdfData.length);
 for (let i = 0; i < pdfData.length; i++) {
 pdfBytes[i] = pdfData.charCodeAt(i);
 }

 pdfjsLib.getDocument({ data: pdfBytes }).promise
 .then(function(pdf) {
 document.getElementById('loading').style.display = 'none';
 const totalPages = pdf.numPages;
 document.getElementById('page-info').textContent = 'Total Pages: ' + totalPages;
 const container = document.getElementById('pdf-container');
 const scale = window.devicePixelRatio || 2;

 const renderPage = (pageNum) => {
 return pdf.getPage(pageNum).then(function(page) {
 const baseViewport = page.getViewport({ scale: 1 });
 const pageScale = window.innerWidth / baseViewport.width;
 const viewport = page.getViewport({ scale: pageScale * scale });
 const canvas = document.createElement('canvas');
 const context = canvas.getContext('2d');
 canvas.width = viewport.width;
 canvas.height = viewport.height;
 canvas.style.width = '100%';
 canvas.style.height = 'auto';
 container.appendChild(canvas);
 return page.render({ canvasContext: context, viewport: viewport }).promise;
 });
 };

 let chain = Promise.resolve();
 for (let i = 1; i <= totalPages; i++) {
 chain = chain.then(() => renderPage(i));
 }
 chain.catch(function(err) { console.log('Render error:', err); });
 })
 .catch(function(err) {
 document.getElementById('loading').style.display = 'none';
 const errorDiv = document.getElementById('error');
 errorDiv.style.display = 'block';
 errorDiv.textContent = 'Error loading PDF: ' + err.message;
 });
 } catch(e) {
 document.getElementById('loading').style.display = 'none';
 const errorDiv = document.getElementById('error');
 errorDiv.style.display = 'block';
 errorDiv.textContent = 'Error: ' + e.message;
 }
 </script>
 </body>
 </html>
 `;

 // TIF files rendered via WebView using a simple img tag
 const getTifViewerHtml = (base64, mimeType) => `
 <!DOCTYPE html>
 <html>
 <head>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
 <style>
 * { margin: 0; padding: 0; box-sizing: border-box; }
 html, body { width: 100%; height: 100%; background-color: #525659; overflow: auto; -webkit-overflow-scrolling: touch; }
 #loading { color: #fff; font-size: 16px; text-align: center; margin-top: 40vh; font-family: sans-serif; }
 #error { color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 40vh; font-family: sans-serif; padding: 20px; display: none; }
 img { display: block; width: 100%; height: auto; margin: 10px 0; }
 </style>
 </head>
 <body>
 <div id="loading">Loading image...</div>
 <div id="error"></div>
 <img
 src="data:${mimeType};base64,${base64}"
 onload="document.getElementById('loading').style.display='none';"
 onerror="document.getElementById('loading').style.display='none'; var e=document.getElementById('error'); e.style.display='block'; e.textContent='Error loading image';"
 />
 </body>
 </html>
 `;

 const renderActivityLogItem = ({item, index}) => (
 <View style={styles.activityLogCard}>
 <View style={styles.activityLogHeader}>
 <Text style={styles.activitySeqNo} Bold>Step {index + 1}</Text>
 <Text style={styles.activityStatus}>{item.WFLH_STATUS}</Text>
 </View>
 <View style={styles.activityLogTable}>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Assigned To:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ASSIGNED_TO || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Role:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_ROLE || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Department:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_DEPT || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Designation:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_DESG || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Assigned On:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ASSIGNED_ON || '-'}</Text>
 </View>
 {item.WFLH_DUE_DATE && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Due Date:</Text>
 <Text style={styles.tableValue}>{item.WFLH_DUE_DATE}</Text>
 </View>
 )}
 {item.WFLH_ACTION_TAKEN && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Action Taken:</Text>
 <Text style={[styles.tableValue, styles.actionTaken]}>{item.WFLH_ACTION_TAKEN}</Text>
 </View>
 )}
 {item.WFLH_ACTION_BY && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Action By:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ACTION_BY}</Text>
 </View>
 )}
 {item.WFLH_ACTION_DATE && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Action Date:</Text>
 <Text style={styles.tableValue}>{item.WFLH_ACTION_DATE}</Text>
 </View>
 )}
 {item.WFLH_NEW_STATUS && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>New Status:</Text>
 <Text style={[styles.tableValue, styles.newStatus]}>{item.WFLH_NEW_STATUS}</Text>
 </View>
 )}
 {item.WFLH_COMMENTS && (
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Comments:</Text>
 <Text style={styles.tableValue}>{item.WFLH_COMMENTS}</Text>
 </View>
 )}
 </View>
 </View>
 );

 const renderAttachmentItem = ({item, index}) => {
 const fileType = getFileType(item.WFAT_FILE_NAME);
 const getFileIcon = () => {
 if (fileType === 'pdf') return <MaterialIcons name="picture-as-pdf" size={24} color="#E53935" />;
 if (fileType === 'image' || fileType === 'tif') return <MaterialIcons name="image" size={24} color="#43A047" />;
 return <MaterialIcons name="attach-file" size={24} color="#43C6DB" />;
 };
 return (
 <View style={styles.attachmentCard}>
 <View style={styles.attachmentHeader}>
 {getFileIcon()}
 <View style={{flex: 1, marginLeft: 10}}>
 <Text style={styles.attachmentFileName} Bold>{item.WFAT_FILE_NAME || '-'}</Text>
 <Text style={styles.attachmentFileDesc}>{item.WFAT_FILE_DESC || '-'}</Text>
 </View>
 </View>
 <View style={styles.attachmentDetails}>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Order:</Text>
 <Text style={styles.tableValue}>{item.WFAT_ORDER_NO || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Created By:</Text>
 <Text style={styles.tableValue}>{item.WFAT_CREATED_BY || '-'}</Text>
 </View>
 <View style={styles.tableRow}>
 <Text style={styles.tableLabel}>Created On:</Text>
 <Text style={styles.tableValue}>{item.WFAT_CREATED_ON || '-'}</Text>
 </View>
 </View>
 <TouchableOpacity
 style={[styles.viewPdfButton, (fileType === 'image' || fileType === 'tif') ? styles.viewImageButton : {}]}
 onPress={() => openFileViewer(item.WFAT_ATTACHMENT, item.WFAT_FILE_NAME)}
 >
 <Ionicons name={fileType === 'pdf' ? 'document-outline' : 'eye-outline'} size={18} color="#fff" />
 <Text style={styles.viewPdfButtonText}>
 {fileType === 'pdf' ? 'View PDF' : (fileType === 'image' || fileType === 'tif') ? 'View Image' : 'View File'}
 </Text>
 </TouchableOpacity>
 </View>
 );
 };

 const renderReportItem = ({item}) => (
 <View style={styles.reportCard}>
 <View style={styles.cardHeader}>
 <Text style={styles.requestId} Bold>Request ID: {item.HSTR_REQ_ID}</Text>
 <View style={styles.cardHeaderRight}>
 <View style={[styles.statusBadge, getStatusColor(item.HSTR_REQ_STATUS)]}>
 <Text style={styles.statusText}>{item.HSTR_REQ_STATUS}</Text>
 </View>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Patient Name</Text>
 <Text style={styles.value}>{item.HSTR_PATIENT_NAME || '-'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Relation</Text>
 <Text style={styles.value}>{item.HSTR_PATIENT_RELATION || '-'}</Text>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Hospital</Text>
 <Text style={styles.value}>{item.HSTR_HSPM_NAME || '-'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>City</Text>
 <Text style={styles.value}>{item.HSTR_HSPM_CITY || '-'}</Text>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Disease</Text>
 <Text style={styles.value}>{item.HSTR_DISEASE_NAME || '-'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Emergency</Text>
 <Text style={styles.value}>{item.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No'}</Text>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Advance Requested</Text>
 <Text style={styles.value}>₹{item.HSTR_ADV_REQ_AMT || '0'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Advance Approved</Text>
 <Text style={styles.value}>₹{item.HSTR_ADV_APP_AMT || '0'}</Text>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Admitted On</Text>
 <Text style={styles.value}>{item.HSTR_ADMIT_DATE || '-'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Reference Intimation</Text>
 <Text style={styles.value}>{item.HSTR_REF_INTIMATION_ID || '-'}</Text>
 </View>
 </View>

 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Created On</Text>
 <Text style={styles.value}>{item.HSTR_CREATED_ON || '-'}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>ERP Status</Text>
 <Text style={styles.value}>{item.ERP_STATUS || '-'}</Text>
 </View>
 </View>

 {item.HSTR_DISCHARGE_DATE && (
 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Discharged On</Text>
 <Text style={styles.value}>{item.HSTR_DISCHARGE_DATE}</Text>
 </View>
 </View>
 )}

 <View style={styles.buttonRow}>
 <TouchableOpacity
 style={[styles.actionButton, styles.activityLogButton]}
 onPress={() => handleActivityLogPress(item.HSTR_REQ_ID)}
 >
 <MaterialIcons name="history" size={18} color="#fff" />
 <Text style={styles.actionButtonText}>Activity Log</Text>
 </TouchableOpacity>
 <TouchableOpacity
 style={[styles.actionButton, styles.attachmentButton]}
 onPress={() => handleAttachmentPress(item.HSTR_REQ_ID)}
 >
 <MaterialIcons name="attach-file" size={18} color="#fff" />
 <Text style={styles.actionButtonText}>Attachments</Text>
 </TouchableOpacity>
 </View>
 </View>
 );

 const getStatusColor = (status) => {
 if (!status) return styles.statusDefault;
 if (status.toLowerCase().includes('closed')) return styles.statusClosed;
 if (status.toLowerCase().includes('approved')) return styles.statusApproved;
 if (status.toLowerCase().includes('rejected')) return styles.statusRejected;
 if (status.toLowerCase().includes('submitted')) return styles.statusSubmitted;
 return styles.statusDefault;
 };

 // Render file viewer content based on type
 const renderFileViewerContent = () => {
 if (!selectedFileBase64) {
 return (
 <View style={styles.pdfLoadingContainer}>
 <ActivityIndicator size="large" color="#43C6DB" />
 <Text style={styles.pdfLoadingText}>Preparing file...</Text>
 </View>
 );
 }

 if (selectedFileType === 'pdf') {
 return (
 <WebView
 originWhitelist={['*']}
 source={{ html: getPdfViewerHtml(selectedFileBase64) }}
 style={styles.webView}
 javaScriptEnabled={true}
 domStorageEnabled={true}
 startInLoadingState={true}
 scalesPageToFit={false}
 scrollEnabled={true}
 pinchGestureEnabled={false}
 onLoadStart={() => console.log('PDF loading started')}
 onLoadEnd={() => console.log('PDF loading completed')}
 onError={(syntheticEvent) => {
 const {nativeEvent} = syntheticEvent;
 console.log('WebView error:', nativeEvent);
 Toast.show('Error loading PDF', Toast.SHORT);
 }}
 renderLoading={() => (
 <View style={styles.pdfLoadingContainer}>
 <ActivityIndicator size="large" color="#43C6DB" />
 <Text style={styles.pdfLoadingText}>Loading PDF...</Text>
 </View>
 )}
 />
 );
 }

 if (selectedFileType === 'image') {
 // jpg, jpeg, png, gif, bmp — rendered natively via <Image>
 const mimeType = getMimeType(selectedFileName);
 return (
 <ScrollView
 style={{ flex: 1, backgroundColor: '#525659' }}
 contentContainerStyle={styles.imageScrollContainer}
 maximumZoomScale={5}
 minimumZoomScale={1}
 bouncesZoom={true}
 >
 <Image
 source={{ uri: `data:${mimeType};base64,${selectedFileBase64}` }}
 style={styles.fullImage}
 resizeMode="contain"
 onError={() => Toast.show('Error loading image', Toast.SHORT)}
 />
 </ScrollView>
 );
 }

 if (selectedFileType === 'tif') {
 // TIF rendered via WebView with inline base64 img tag
 const mimeType = getMimeType(selectedFileName);
 return (
 <WebView
 originWhitelist={['*']}
 source={{ html: getTifViewerHtml(selectedFileBase64, mimeType) }}
 style={styles.webView}
 javaScriptEnabled={true}
 domStorageEnabled={true}
 startInLoadingState={true}
 scalesPageToFit={false}
 scrollEnabled={true}
 onError={() => Toast.show('Error loading image', Toast.SHORT)}
 renderLoading={() => (
 <View style={styles.pdfLoadingContainer}>
 <ActivityIndicator size="large" color="#43C6DB" />
 <Text style={styles.pdfLoadingText}>Loading image...</Text>
 </View>
 )}
 />
 );
 }

 // Unknown file type
 return (
 <View style={styles.pdfLoadingContainer}>
 <MaterialIcons name="insert-drive-file" size={60} color="#ccc" />
 <Text style={styles.pdfLoadingText}>Unsupported file type</Text>
 </View>
 );
 };

 return (
 <SafeAreaView style={{flex: 1}}>
 <Spinner visible={loader} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />

 <View style={styles.container}>
 <View style={styles.headerContainer}>
 <Text style={styles.headerText} Bold>Advance Report</Text>
 <View style={styles.filterContainer}>
 <Text style={styles.filterLabel}>Financial Year</Text>
 <SelectDropdown
 key={`finyear-${selectedFinYear}-${finYearOptions.length}`}
 buttonTextAfterSelection={(selectedItem) => selectedItem.label}
 defaultButtonText={finYearOptions.find(y => y.value === selectedFinYear)?.label || 'Select Year'}
 defaultValue={finYearOptions.find(y => y.value === selectedFinYear)}
 rowTextForSelection={(item) => item.label}
 data={finYearOptions}
 onSelect={handleFinYearChange}
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
 </View>

 <FlatList
 data={reportData}
 renderItem={renderReportItem}
 keyExtractor={(item, index) => `${item.HSTR_REQ_ID}_${index}`}
 contentContainerStyle={styles.listContainer}
 ListEmptyComponent={
 <View style={styles.emptyContainer}>
 <Ionicons name="document-text-outline" size={60} color="#ccc" />
 <Text style={styles.emptyText}>No reports available</Text>
 </View>
 }
 />
 </View>

 {/* Activity Log Modal */}
 <Modal visible={activityLogModal} animationType="slide" transparent={false} onRequestClose={() => setActivityLogModal(false)}>
 <SafeAreaView style={styles.modalContainer}>
 <View style={styles.modalHeader}>
 <View>
 <Text style={styles.modalTitle} Bold>Activity Log</Text>
 <Text style={styles.modalSubtitle}>Request ID: {selectedRequestId}</Text>
 </View>
 <TouchableOpacity onPress={() => setActivityLogModal(false)} style={styles.closeButton}>
 <Ionicons name="close" size={28} color="#333" />
 </TouchableOpacity>
 </View>
 <FlatList
 data={activityLogData}
 renderItem={renderActivityLogItem}
 keyExtractor={(item, index) => `${item.WFLH_SEQ_NO}_${index}`}
 contentContainerStyle={styles.modalListContainer}
 ListEmptyComponent={
 <View style={styles.emptyContainer}>
 <MaterialIcons name="history" size={60} color="#ccc" />
 <Text style={styles.emptyText}>No activity log available</Text>
 </View>
 }
 />
 </SafeAreaView>
 </Modal>

 {/* Attachment Modal */}
 <Modal visible={attachmentModal} animationType="slide" transparent={false} onRequestClose={() => setAttachmentModal(false)}>
 <SafeAreaView style={styles.modalContainer}>
 <View style={styles.modalHeader}>
 <View>
 <Text style={styles.modalTitle} Bold>Attachments</Text>
 <Text style={styles.modalSubtitle}>Request ID: {selectedRequestId}</Text>
 </View>
 <TouchableOpacity onPress={() => setAttachmentModal(false)} style={styles.closeButton}>
 <Ionicons name="close" size={28} color="#333" />
 </TouchableOpacity>
 </View>
 <FlatList
 data={attachmentData}
 renderItem={renderAttachmentItem}
 keyExtractor={(item, index) => `${item.WFAT_REQUEST_ID}_${index}`}
 contentContainerStyle={styles.modalListContainer}
 ListEmptyComponent={
 <View style={styles.emptyContainer}>
 <MaterialIcons name="attach-file" size={60} color="#ccc" />
 <Text style={styles.emptyText}>No attachments available</Text>
 </View>
 }
 />
 </SafeAreaView>
 </Modal>

 {/* File Viewer Modal (PDF / Image / TIF) */}
 <Modal visible={fileViewerModal} animationType="slide" transparent={false} onRequestClose={closeFileViewer}>
 <SafeAreaView style={styles.pdfModalContainer}>
 <View style={styles.pdfHeader}>
 <View style={{flex: 1, marginRight: 10}}>
 <Text style={styles.pdfTitle} Bold numberOfLines={1}>{selectedFileName}</Text>
 </View>
 <TouchableOpacity onPress={closeFileViewer} style={styles.pdfCloseButton}>
 <Ionicons name="close-circle" size={32} color="#fff" />
 </TouchableOpacity>
 </View>
 {renderFileViewerContent()}
 </SafeAreaView>
 </Modal>
 </SafeAreaView>
 );
};

// define your styles
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: GlobalColor.PrimaryLight },
 headerContainer: {
 padding: 15, backgroundColor: '#fff', marginTop: 10, marginBottom: 10,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
 },
 headerText: { fontSize: 18, color: '#43C6DB', marginBottom: 10 },
 filterContainer: { marginTop: 10 },
 filterLabel: { fontSize: 13, fontWeight: 'bold', marginBottom: 5, color: '#333' },
 dropdown2BtnStyle: {
 width: '100%', height: 40, borderWidth: 1, borderRadius: 8,
 backgroundColor: '#FFF', borderColor: '#43C6DB',
 },
 dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 13 },
 dropdown2DropdownStyle: { backgroundColor: GlobalColor.White, maxHeight: 300 },
 dropdown2RowStyle: { backgroundColor: GlobalColor.White, borderBottomColor: '#43C6DB' },
 dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 13 },
 listContainer: { padding: 10, paddingBottom: 20 },
 reportCard: {
 backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
 },
 cardHeader: {
 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
 marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
 },
 cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
 requestId: { fontSize: 15, color: '#333' },
 statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
 statusText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
 statusClosed: { backgroundColor: '#4CAF50' },
 statusApproved: { backgroundColor: '#2196F3' },
 statusRejected: { backgroundColor: '#F44336' },
 statusSubmitted: { backgroundColor: '#FF9800' },
 statusDefault: { backgroundColor: '#9E9E9E' },
 cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
 cardColumn: { flex: 1, marginRight: 10 },
 label: { fontSize: 12, color: '#666', marginBottom: 3 },
 value: { fontSize: 13, color: '#333', fontWeight: '500' },
 buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
 actionButton: {
 flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
 paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6,
 },
 activityLogButton: { backgroundColor: '#43C6DB' },
 attachmentButton: { backgroundColor: '#FF9800' },
 actionButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
 emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
 emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
 spinnerTextStyle: { color: '#fff' },
 modalContainer: { flex: 1, backgroundColor: GlobalColor.PrimaryLight },
 modalHeader: {
 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
 padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
 },
 modalTitle: { fontSize: 20, color: '#43C6DB' },
 modalSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
 closeButton: { padding: 5 },
 modalListContainer: { padding: 15, paddingBottom: 30 },
 activityLogCard: {
 backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
 },
 activityLogHeader: {
 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
 marginBottom: 15, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#43C6DB',
 },
 activitySeqNo: { fontSize: 16, color: '#43C6DB' },
 activityStatus: { fontSize: 13, color: '#666', fontWeight: '600' },
 activityLogTable: { width: '100%' },
 tableRow: {
 flexDirection: 'row', paddingVertical: 8,
 borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
 },
 tableLabel: { flex: 0.4, fontSize: 12, color: '#666', fontWeight: '600' },
 tableValue: { flex: 0.6, fontSize: 12, color: '#333' },
 actionTaken: { color: '#4CAF50', fontWeight: 'bold' },
 newStatus: { color: '#2196F3', fontWeight: 'bold' },
 attachmentCard: {
 backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
 },
 attachmentHeader: {
 flexDirection: 'row', alignItems: 'center', marginBottom: 15,
 paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#43C6DB',
 },
 attachmentFileName: { fontSize: 14, color: '#333' },
 attachmentFileDesc: { fontSize: 12, color: '#666', marginTop: 3 },
 attachmentDetails: { marginBottom: 10 },
 viewPdfButton: {
 flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
 backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 15,
 borderRadius: 6, marginTop: 10,
 },
 viewImageButton: { backgroundColor: '#43A047' },
 viewPdfButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
 pdfModalContainer: { flex: 1, backgroundColor: '#525659' },
 pdfHeader: {
 flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
 padding: 15, backgroundColor: '#43C6DB',
 },
 pdfTitle: { fontSize: 16, color: '#fff' },
 pdfCloseButton: { padding: 5 },
 webView: { flex: 1, backgroundColor: '#525659' },
 pdfLoadingContainer: {
 flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#525659',
 },
 pdfLoadingText: { fontSize: 16, color: '#fff', marginTop: 15 },
 imageScrollContainer: {
 flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 10,
 },
 fullImage: {
 width: '100%',
 aspectRatio: 1,
 minHeight: 300,
 },
});

//make this component available to the app
export default AdvanceReport;