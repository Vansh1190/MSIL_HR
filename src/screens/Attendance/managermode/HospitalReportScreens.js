import React, { useState, useContext } from 'react';
import {
 View,
 StyleSheet,
 TouchableOpacity,
 FlatList,
 SafeAreaView,
 Modal,
 Alert,
 ScrollView,
 ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as ApiService from '../../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { GlobalColor } from '../../../constants/Colors';
import Text from '../../../components/reusable/Text';
import TextInput from '../../../components/reusable/TextInput';
import { WebView } from 'react-native-webview';

const HospitalReportScreens = () => {
 const [activeTab, setActiveTab] = useState(0); // 0=Intimation Report, 1=Advance Report
 const { authContext, AppUserData } = useContext(AuthContext);
 const [loader, setLoader] = useState(false);
 const [refresh, setRefresh] = useState(false);

 // Report Data
 const [IntimationReportData, setIntimationReportData] = useState([]);
 const [AdvanceReportData, setAdvanceReportData] = useState([]);

 // Detail Modal States - Intimation
 const [IntimationDetailModal, setIntimationDetailModal] = useState(false);
 const [modalDataIntimation, setModalDataIntimation] = useState({});
 const [commentsIntimation, setCommentsIntimation] = useState([]);

 // Detail Modal States - Advance
 const [AdvanceDetailModal, setAdvanceDetailModal] = useState(false);
 const [modalDataAdvance, setModalDataAdvance] = useState({});
 const [commentsAdvance, setCommentsAdvance] = useState([]);

 // Filter States
 const [requestIdFilter, setRequestIdFilter] = useState('');
 const [finYearFilter, setFinYearFilter] = useState('');
 const [showFilters, setShowFilters] = useState(false);
 const [showFinYearModal, setShowFinYearModal] = useState(false);

 // Attachment States
 const [attachmentModal, setAttachmentModal] = useState(false);
 const [attachmentData, setAttachmentData] = useState([]);
 const [selectedRequestId, setSelectedRequestId] = useState('');

 // File Viewer States (PDF + Images)
 const [fileViewerModal, setFileViewerModal] = useState(false);
 const [selectedFileBase64, setSelectedFileBase64] = useState('');
 const [fileViewerFileName, setFileViewerFileName] = useState('');
 const [fileViewerType, setFileViewerType] = useState('pdf'); // 'pdf' | 'image'

 // ── NEW: hasData flag (same as HospitalApprovalScreens) ──────────────────
 const [hasData, setHasData] = useState(false);

 // ─── Helpers ──────────────────────────────────────────────────────────────

 const generateFinYears = () => {
 const currentDate = new Date();
 const currentMonth = currentDate.getMonth();
 const currentYear = currentDate.getFullYear();
 let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
 const finYears = [{ label: 'All Years', value: '' }];
 for (let year = startYear; year >= 2019; year--) {
 const nextYear = year + 1;
 const yearStr = year.toString().slice(-2);
 const nextYearStr = nextYear.toString().slice(-2);
 finYears.push({
 label: `FY ${year}-${nextYear} (${yearStr}${nextYearStr})`,
 value: `${yearStr}${nextYearStr}`,
 });
 }
 return finYears;
 };

 // Get current financial year dynamically (e.g. "2526" for FY 2025-26)
 const getCurrentFinYear = () => {
 const currentDate = new Date();
 const currentMonth = currentDate.getMonth();
 const currentYear = currentDate.getFullYear();
 const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
 const nextYear = startYear + 1;
 return `${startYear.toString().slice(-2)}${nextYear.toString().slice(-2)}`;
 };

 const [finYearOptions] = useState(generateFinYears());

 const getUsername = () =>
 AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '';

 const getHospitalType = (catg) => {
 if (!catg) return '-';
 if (catg === 'P') return 'Panel';
 if (catg === 'N') return 'Non Panel';
 if (catg === 'R') return 'Referral';
 return catg;
 };

 // ─── File type helpers (same as HospitalApprovalScreens) ─────────────────

 const getFileType = (fileName) => {
 if (!fileName) return 'pdf';
 const ext = fileName.split('.').pop().toLowerCase();
 const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff'];
 if (imageExts.includes(ext)) return 'image';
 return 'pdf';
 };

 const getMimeType = (fileName) => {
 if (!fileName) return 'image/jpeg';
 const ext = fileName.split('.').pop().toLowerCase();
 const mimeMap = {
 jpg: 'image/jpeg',
 jpeg: 'image/jpeg',
 png: 'image/png',
 gif: 'image/gif',
 bmp: 'image/bmp',
 tif: 'image/tiff',
 tiff: 'image/tiff',
 };
 return mimeMap[ext] || 'image/jpeg';
 };

 // ─── API Calls ────────────────────────────────────────────────────────────

 const GetIntimationReport = async (showLoader = true, requestId = '', finYear = '') => {
 const username = getUsername();
 const token = AppUserData.token;
 // ── SAME LOGIC as HospitalApprovalScreens: REQUEST type when requestId given
 const requestType = requestId && requestId.trim() !== '' ? 'REQUEST' : 'APPROVE';
 const apiData = {
 AppName: 'HOSP INTIM',
 UserName: username,
 RequestType: requestType,
 RequestID: requestId || '',
 FinYear: finYear || getCurrentFinYear(),
 };
 if (showLoader) setLoader(true);
 try {
 const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);
 if (Array.isArray(result?.Value) && result.Value.length > 0) {
 setIntimationReportData(result.Value);
 setHasData(true);
 } else {
 setIntimationReportData([]);
 setHasData(false);
 setTimeout(() => Toast.show('No Report Data Found'), 500);
 }
 } catch (error) {
 ApiService.showErrorMessage(error, authContext);
 setHasData(false);
 } finally {
 if (showLoader) setLoader(false);
 }
 };

 const GetAdvanceReport = async (showLoader = true, requestId = '', finYear = '') => {
 const username = getUsername();
 const token = AppUserData.token;
 // ── SAME LOGIC as HospitalApprovalScreens: REQUEST type when requestId given
 const requestType = requestId && requestId.trim() !== '' ? 'REQUEST' : 'APPROVE';
 const apiData = {
 AppName: 'HOSP ADV',
 UserName: username,
 RequestType: requestType,
 RequestID: requestId || '',
 FinYear: finYear || getCurrentFinYear(),
 };
 if (showLoader) setLoader(true);
 try {
 const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);
 if (Array.isArray(result?.Value) && result.Value.length > 0) {
 setAdvanceReportData(result.Value);
 setHasData(true);
 } else {
 setAdvanceReportData([]);
 setHasData(false);
 setTimeout(() => Toast.show('No Report Data Found'), 500);
 }
 } catch (error) {
 ApiService.showErrorMessage(error, authContext);
 setHasData(false);
 } finally {
 if (showLoader) setLoader(false);
 }
 };

 const fetchComments = async (requestId, appName) => {
 const username = getUsername();
 const token = AppUserData.token;
 const apiData = {
 AppName: appName,
 UserName: username,
 RequestType: 'COMMENTS',
 RequestID: requestId?.toString() || '',
 FinYear: '',
 };
 try {
 const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);
 return Array.isArray(result?.Value) && result.Value.length > 0 ? result.Value : [];
 } catch {
 return [];
 }
 };

 const fetchAttachments = (requestId) => {
 const compCode = AppUserData?.data?.emplCompCode || '101';
 const apiData = { AppName: 'HOSPITAL', CompCode: compCode, RequestID: requestId };
 const token = AppUserData.token;
 setLoader(true);
 ApiService.PostMethode('/GetHospitalAttachment', apiData, token, authContext)
 .then(result => {
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
 setAttachmentData([]);
 ApiService.showErrorMessage(error, authContext);
 });
 };

 // ─── File Viewer (PDF + Images) ────────────────────────────────────────────

 const openFileViewer = (base64Data, fileName) => {
 if (!base64Data) { Toast.show('File data not available', Toast.SHORT); return; }
 const cleanBase64 = base64Data.replace(/[\r\n\s]+/g, '').trim();
 const type = getFileType(fileName);
 setSelectedFileBase64(cleanBase64);
 setFileViewerFileName(fileName);
 setFileViewerType(type);
 setAttachmentModal(false);
 setTimeout(() => setFileViewerModal(true), 300);
 };

 const closeFileViewer = () => {
 setFileViewerModal(false);
 setSelectedFileBase64('');
 setFileViewerFileName('');
 setFileViewerType('pdf');
 setTimeout(() => setAttachmentModal(true), 300);
 };

 // ─── PDF Viewer HTML ───────────────────────────────────────────────────────
 const getPdfViewerHtml = (base64) => `
 <!DOCTYPE html><html>
 <head>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
 <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
 <style>
 * { margin:0; padding:0; box-sizing:border-box; }
 html,body { width:100%; height:100%; background-color:#525659; overflow:auto; -webkit-overflow-scrolling:touch; }
 #zoom-container { transform-origin:top left; width:100%; }
 #pdf-container { display:flex; flex-direction:column; align-items:center; padding:10px 0; gap:10px; width:100%; }
 canvas { display:block; width:100% !important; height:auto !important; box-shadow:0 2px 8px rgba(0,0,0,0.4); }
 #loading { color:#fff; font-size:16px; text-align:center; margin-top:40vh; font-family:sans-serif; }
 #error { color:#ff6b6b; font-size:14px; text-align:center; margin-top:40vh; font-family:sans-serif; padding:20px; display:none; }
 #page-info { color:#ccc; font-size:13px; text-align:center; font-family:sans-serif; padding:5px 0 10px 0; }
 </style>
 </head>
 <body>
 <div id="loading">Loading PDF...</div>
 <div id="error"></div>
 <div id="page-info"></div>
 <div id="zoom-container"><div id="pdf-container"></div></div>
 <script>
 pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 let currentScale=1,startDist=0,startScale=1;
 const zoomContainer=document.getElementById('zoom-container');
 function getDistance(t){const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;return Math.sqrt(dx*dx+dy*dy);}
 document.addEventListener('touchstart',function(e){if(e.touches.length===2){e.preventDefault();startDist=getDistance(e.touches);startScale=currentScale;}},{passive:false});
 document.addEventListener('touchmove',function(e){if(e.touches.length===2){e.preventDefault();const dist=getDistance(e.touches);let s=startScale*(dist/startDist);s=Math.min(Math.max(s,1),5);currentScale=s;zoomContainer.style.transform='scale('+s+')';zoomContainer.style.width=(100/s)+'%';}},{passive:false});
 document.addEventListener('touchend',function(e){if(e.touches.length<2)startDist=0;});
 let lastTap=0;
 document.addEventListener('touchend',function(e){const now=Date.now();if(now-lastTap<300){currentScale=1;zoomContainer.style.transform='scale(1)';zoomContainer.style.width='100%';}lastTap=now;});
 try{
 const base64Data='${base64}';
 const pdfData=atob(base64Data);
 const pdfBytes=new Uint8Array(pdfData.length);
 for(let i=0;i<pdfData.length;i++)pdfBytes[i]=pdfData.charCodeAt(i);
 pdfjsLib.getDocument({data:pdfBytes}).promise.then(function(pdf){
 document.getElementById('loading').style.display='none';
 document.getElementById('page-info').textContent='Total Pages: '+pdf.numPages;
 const container=document.getElementById('pdf-container');
 const scale=window.devicePixelRatio||2;
 const renderPage=(n)=>pdf.getPage(n).then(function(page){
 const bv=page.getViewport({scale:1});
 const ps=window.innerWidth/bv.width;
 const vp=page.getViewport({scale:ps*scale});
 const canvas=document.createElement('canvas');
 canvas.width=vp.width;canvas.height=vp.height;
 canvas.style.width='100%';canvas.style.height='auto';
 container.appendChild(canvas);
 return page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
 });
 let chain=Promise.resolve();
 for(let i=1;i<=pdf.numPages;i++)chain=chain.then(()=>renderPage(i));
 }).catch(function(err){
 document.getElementById('loading').style.display='none';
 const e=document.getElementById('error');e.style.display='block';e.textContent='Error: '+err.message;
 });
 }catch(e){
 document.getElementById('loading').style.display='none';
 const err=document.getElementById('error');err.style.display='block';err.textContent='Error: '+e.message;
 }
 </script>
 </body></html>
 `;

 // ─── Image Viewer HTML ─────────────────────────────────────────────────────
 const getImageViewerHtml = (base64, mimeType) => `
 <!DOCTYPE html>
 <html>
 <head>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
 <style>
 * { margin: 0; padding: 0; box-sizing: border-box; }
 html, body {
 width: 100%; height: 100%;
 background-color: #525659;
 display: flex; justify-content: center; align-items: flex-start;
 overflow: auto; -webkit-overflow-scrolling: touch;
 }
 #zoom-container { transform-origin: top center; width: 100%; display: flex; justify-content: center; padding: 10px 0; }
 img { max-width: 100%; height: auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.5); background: #fff; }
 #loading { color: #fff; font-size: 16px; text-align: center; margin-top: 40vh; font-family: sans-serif; position: absolute; width: 100%; }
 #error { color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 40vh; font-family: sans-serif; padding: 20px; display: none; position: absolute; width: 100%; }
 </style>
 </head>
 <body>
 <div id="loading">Loading image...</div>
 <div id="error"></div>
 <div id="zoom-container">
 <img
 id="img"
 src="data:${mimeType};base64,${base64}"
 onload="document.getElementById('loading').style.display='none';"
 onerror="document.getElementById('loading').style.display='none'; var e=document.getElementById('error'); e.style.display='block'; e.textContent='Error loading image';"
 />
 </div>
 <script>
 let currentScale=1,startDist=0,startScale=1;
 const zoomContainer=document.getElementById('zoom-container');
 function getDistance(t){const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;return Math.sqrt(dx*dx+dy*dy);}
 document.addEventListener('touchstart',function(e){if(e.touches.length===2){e.preventDefault();startDist=getDistance(e.touches);startScale=currentScale;}},{passive:false});
 document.addEventListener('touchmove',function(e){if(e.touches.length===2){e.preventDefault();const dist=getDistance(e.touches);let s=startScale*(dist/startDist);s=Math.min(Math.max(s,1),5);currentScale=s;zoomContainer.style.transform='scale('+s+')';zoomContainer.style.transformOrigin='top center';zoomContainer.style.width=(100/s)+'%';}},{passive:false});
 document.addEventListener('touchend',function(e){if(e.touches.length<2)startDist=0;});
 let lastTap=0;
 document.addEventListener('touchend',function(e){const now=Date.now();if(now-lastTap<300){currentScale=1;zoomContainer.style.transform='scale(1)';zoomContainer.style.width='100%';}lastTap=now;});
 </script>
 </body>
 </html>
 `;

 // ─── Modal Open Handlers ──────────────────────────────────────────────────

 const openIntimationDetail = async (item) => {
 setModalDataIntimation(item);
 setIntimationDetailModal(true);
 const comments = await fetchComments(item.HSTR_REQ_ID, 'HOSP INTIM');
 setCommentsIntimation(comments);
 };

 const openAdvanceDetail = async (item) => {
 setModalDataAdvance(item);
 setAdvanceDetailModal(true);
 const comments = await fetchComments(item.HSTR_REQ_ID, 'HOSP ADV');
 setCommentsAdvance(comments);
 };

 // ─── Tab / Filter Handlers ────────────────────────────────────────────────

 const handleTabSwitch = (index) => {
 setActiveTab(index);
 setRequestIdFilter('');
 const currentFY = finYearFilter || getCurrentFinYear();
 setHasData(false); // reset hasData on tab switch
 if (index === 0) GetIntimationReport(true, '', currentFY);
 else GetAdvanceReport(true, '', currentFY);
 };

 const handleSearch = () => {
 if (activeTab === 0) GetIntimationReport(true, requestIdFilter, finYearFilter);
 else GetAdvanceReport(true, requestIdFilter, finYearFilter);
 };

 const handleClearFilters = () => {
 setRequestIdFilter('');
 setFinYearFilter('');
 if (activeTab === 0) GetIntimationReport();
 else GetAdvanceReport();
 };

 useFocusEffect(React.useCallback(() => {
 const currentFY = getCurrentFinYear();
 setFinYearFilter(currentFY);
 GetIntimationReport(true, '', currentFY);
 }, []));

 // ─── Status Helpers ───────────────────────────────────────────────────────

 const getStatusColor = (status) => {
 if (!status) return styles.statusDefault;
 const s = status.toLowerCase();
 if (s.includes('closed')) return styles.statusClosed;
 if (s.includes('approved')) return styles.statusApproved;
 if (s.includes('rejected') || s.includes('sendback')) return styles.statusRejected;
 if (s.includes('submitted') || s.includes('pending')) return styles.statusSubmitted;
 return styles.statusDefault;
 };

 // ─── Shared Detail Rows Renderer ─────────────────────────────────────────

 const renderDetailRows = (data) => (
 <>
 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Request Information</Text>
 {[
 ['Request ID', data.HSTR_REQ_ID],
 ['Creator Name', data.HSTR_CREATOR_NAME],
 ['Creator ID', data.HSTR_CREATOR_ID],
 ['Requestor Name', data.HSTR_RQSTR_NAME],
 ['Requestor ID', data.HSTR_RQSTR_ID],
 ].map(([label, val], i) => (
 <View style={styles.detailRow} key={i}>
 <Text style={styles.detailLabel}>{label}:</Text>
 <Text style={styles.detailValue}>{val || '-'}</Text>
 </View>
 ))}
 {data.HSTR_REF_INTIMATION_ID ? (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Ref. Intimation:</Text>
 <Text style={styles.detailValue}>{data.HSTR_REF_INTIMATION_ID}</Text>
 </View>
 ) : null}
 </View>

 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Patient Information</Text>
 {[
 ['Patient', data.HSTR_PATIENT_NAME],
 ['Relation', data.HSTR_PATIENT_RELATION],
 ['Disease', data.HSTR_DISEASE_NAME],
 ['Emergency', data.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No'],
 ].map(([label, val], i) => (
 <View style={styles.detailRow} key={i}>
 <Text style={styles.detailLabel}>{label}:</Text>
 <Text style={styles.detailValue}>{val || '-'}</Text>
 </View>
 ))}
 </View>

 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Hospital Information</Text>
 {[
 ['Hospital', data.HSTR_HSPM_NAME],
 ['Branch', data.HSTR_HSPM_BRANCH],
 ['City', data.HSTR_HSPM_CITY],
 ['Category', data.HSTR_HSPM_CATG],
 ['Type', getHospitalType(data.HSTR_HSPM_CATG)],
 ].map(([label, val], i) => (
 <View style={styles.detailRow} key={i}>
 <Text style={styles.detailLabel}>{label}:</Text>
 <Text style={styles.detailValue}>{val || '-'}</Text>
 </View>
 ))}
 </View>

 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Dates</Text>
 {[
 ['Admitted On', data.HSTR_ADMIT_DATE],
 ['Discharged On', data.HSTR_DISCHARGE_DATE],
 ['Created On', data.HSTR_CREATED_ON],
 ].filter(([, v]) => v).map(([label, val], i) => (
 <View style={styles.detailRow} key={i}>
 <Text style={styles.detailLabel}>{label}:</Text>
 <Text style={styles.detailValue}>{val}</Text>
 </View>
 ))}
 </View>

 {data.HSTR_ADV_REQ_AMT && (
 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Amount Details</Text>
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Advance Requested:</Text>
 <Text Bold style={[styles.detailValue, { color: '#FF6347' }]}>₹{data.HSTR_ADV_REQ_AMT || '0'}</Text>
 </View>
 {data.HSTR_ADV_APP_AMT && (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Advance Approved:</Text>
 <Text Bold style={[styles.detailValue, { color: '#4CAF50' }]}>₹{data.HSTR_ADV_APP_AMT}</Text>
 </View>
 )}
 {data.HSTR_CMO_APP_HOSP_AMT && (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>CMO App Hosp Amt:</Text>
 <Text style={styles.detailValue}>₹{data.HSTR_CMO_APP_HOSP_AMT}</Text>
 </View>
 )}
 {data.HSTR_FIN_APP_HOSP_AMT && (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Fin App Hosp Amt:</Text>
 <Text style={styles.detailValue}>₹{data.HSTR_FIN_APP_HOSP_AMT}</Text>
 </View>
 )}
 {data.HSTR_HOSP_AMT && (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Hospital Amount:</Text>
 <Text style={styles.detailValue}>₹{data.HSTR_HOSP_AMT}</Text>
 </View>
 )}
 {data.HSTR_TOTAL_AMT && (
 <View style={styles.detailRow}>
 <Text style={styles.detailLabel}>Total Amount:</Text>
 <Text Bold style={[styles.detailValue, { color: '#333' }]}>₹{data.HSTR_TOTAL_AMT}</Text>
 </View>
 )}
 </View>
 )}
 </>
 );

 // ─── Render Helpers ───────────────────────────────────────────────────────

 // ── UPDATED: renderAttachmentItem supports PDF + image files ─────────────
 const renderAttachmentItem = ({ item }) => {
 const fileType = getFileType(item.WFAT_FILE_NAME);
 const isImage = fileType === 'image';
 return (
 <View style={styles.attachmentCard}>
 <View style={styles.attachmentHeader}>
 <MaterialIcons name="attach-file" size={24} color="#FF6347" />
 <View style={{ flex: 1, marginLeft: 10 }}>
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
 style={[styles.viewPdfButton, isImage && styles.viewImageButton]}
 onPress={() => openFileViewer(item.WFAT_ATTACHMENT, item.WFAT_FILE_NAME)}>
 <Ionicons name={isImage ? 'image-outline' : 'eye-outline'} size={18} color="#fff" />
 <Text style={styles.viewPdfButtonText}>{isImage ? 'View Image' : 'View PDF'}</Text>
 </TouchableOpacity>
 </View>
 );
 };

 // Shared report card (read-only, tappable to open detail modal)
 const renderReportCard = ({ item }, isIntimation) => (
 <TouchableOpacity
 style={styles.reportCard}
 onPress={() => isIntimation ? openIntimationDetail(item) : openAdvanceDetail(item)}>
 <View style={styles.cardHeader}>
 <Text style={styles.requestId} Bold>Request ID: {item.HSTR_REQ_ID}</Text>
 <View style={[styles.statusBadge, getStatusColor(item.HSTR_REQ_STATUS)]}>
 <Text style={styles.statusText}>{item.HSTR_REQ_STATUS}</Text>
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
 <Text style={styles.label}>Admitted On</Text>
 <Text style={styles.value}>{item.HSTR_ADMIT_DATE || '-'}</Text>
 </View>
 </View>
 {item.HSTR_ADV_REQ_AMT && (
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
 )}
 <View style={styles.cardRow}>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Hospital Type</Text>
 <Text style={styles.value}>{getHospitalType(item.HSTR_HSPM_CATG)}</Text>
 </View>
 <View style={styles.cardColumn}>
 <Text style={styles.label}>Emergency</Text>
 <Text style={styles.value}>{item.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No'}</Text>
 </View>
 </View>
 <View style={styles.buttonRow}>
 <TouchableOpacity
 style={[styles.actionBtn, styles.attachmentButton]}
 onPress={() => { setSelectedRequestId(item.HSTR_REQ_ID); fetchAttachments(item.HSTR_REQ_ID); }}>
 <MaterialIcons name="attach-file" size={18} color="#fff" />
 <Text style={styles.actionButtonText}>Attachments</Text>
 </TouchableOpacity>
 </View>
 </TouchableOpacity>
 );

 // ─── RENDER ───────────────────────────────────────────────────────────────

 return (
 <View style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>
 <Spinner visible={loader} textContent={'Loading...'} textStyle={{ color: '#fff' }} />

 {/* Inner Sub-Tab */}
 <View style={styles.subTabContainer}>
 <SegmentedControlTab
 borderRadius={0}
 values={['Intimation Approved Report', 'Advance Approved Report']}
 selectedIndex={activeTab}
 onTabPress={handleTabSwitch}
 tabsContainerStyle={styles.tabsContainerStyle}
 tabStyle={styles.tabStyle}
 tabTextStyle={styles.tabTextStyle}
 activeTabStyle={styles.activeTabStyle}
 activeTabTextStyle={styles.activeTabTextStyle}
 />
 </View>

 {/* ── UPDATED: Filter Section - only visible when hasData (same as HospitalApprovalScreens) ── */}
 {hasData && (
 <View style={styles.filterContainer}>
 <TouchableOpacity style={styles.filterToggleButton} onPress={() => setShowFilters(!showFilters)}>
 <Ionicons name={showFilters ? 'chevron-up' : 'chevron-down'} size={20} color="#FF6347" />
 <Text Bold style={styles.filterToggleText}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Text>
 </TouchableOpacity>
 {showFilters && (
 <View style={styles.filterContent}>
 <View style={styles.filterRow}>
 <View style={styles.filterInputContainer}>
 <Text Bold style={styles.filterLabel}>Request ID</Text>
 <TextInput
 placeholder="Enter Request ID"
 value={requestIdFilter}
 keyboardType="numeric"
 style={styles.filterInput}
 onChangeText={setRequestIdFilter}
 />
 </View>
 <View style={styles.filterInputContainer}>
 <Text Bold style={styles.filterLabel}>Financial Year</Text>
 <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFinYearModal(true)}>
 <Text style={styles.dropdownButtonText}>
 {finYearFilter ? finYearOptions.find(o => o.value === finYearFilter)?.label : 'Select Financial Year'}
 </Text>
 <Ionicons name="chevron-down" size={20} color="#666" />
 </TouchableOpacity>
 </View>
 </View>
 <View style={styles.filterButtonContainer}>
 <TouchableOpacity style={[styles.filterButton, styles.searchButton]} onPress={handleSearch}>
 <Ionicons name="search" size={18} color="#fff" />
 <Text Bold style={styles.filterButtonText}>Search</Text>
 </TouchableOpacity>
 <TouchableOpacity style={[styles.filterButton, styles.clearButton]} onPress={handleClearFilters}>
 <Ionicons name="close-circle" size={18} color="#fff" />
 <Text Bold style={styles.filterButtonText}>Clear</Text>
 </TouchableOpacity>
 </View>
 </View>
 )}
 </View>
 )}

 {/* List */}
 <View style={styles.contentContainer}>
 <FlatList
 data={activeTab === 0 ? IntimationReportData : AdvanceReportData}
 renderItem={(props) => renderReportCard(props, activeTab === 0)}
 keyExtractor={(item, index) => `${activeTab === 0 ? 'rpt-intim' : 'rpt-adv'}-${item.HSTR_REQ_ID}-${index}`}
 contentContainerStyle={styles.listContainer}
 onRefresh={() => activeTab === 0
 ? GetIntimationReport(true, requestIdFilter, finYearFilter)
 : GetAdvanceReport(true, requestIdFilter, finYearFilter)}
 refreshing={refresh}
 ListEmptyComponent={
 <View style={styles.emptyContainer}>
 <Ionicons name="document-text-outline" size={60} color="#ccc" />
 <Text style={styles.emptyText}>
 {activeTab === 0 ? 'No intimation report data' : 'No advance report data'}
 </Text>
 </View>
 }
 />
 </View>

 {/* ── Intimation Detail Modal (read-only) ── */}
 <Modal transparent={true} visible={IntimationDetailModal}>
 <View style={styles.centeredView}>
 <View style={styles.modalViewDetail}>
 <View style={styles.modalHeader}>
 <View style={{ flex: 1 }}>
 <Text Bold style={styles.modalTitle}>Intimation Details</Text>
 {modalDataIntimation.HSTR_REQ_STATUS && (
 <View style={[styles.statusBadge, getStatusColor(modalDataIntimation.HSTR_REQ_STATUS), { marginTop: 5, alignSelf: 'flex-start' }]}>
 <Text style={styles.statusText}>{modalDataIntimation.HSTR_REQ_STATUS}</Text>
 </View>
 )}
 </View>
 <TouchableOpacity onPress={() => setIntimationDetailModal(false)}>
 <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />
 </TouchableOpacity>
 </View>
 <ScrollView showsVerticalScrollIndicator={false}>
 {renderDetailRows(modalDataIntimation)}
 {commentsIntimation.length > 0 && (
 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Comments</Text>
 {commentsIntimation.map((c, i) => (
 <View key={i} style={styles.commentItem}>
 <View style={styles.commentHeader}>
 <Text Bold style={styles.commentUser}>{c.USER_NAME || c.HSTR_CREATOR_NAME || 'User'}</Text>
 <Text style={styles.commentDate}>{c.CREATED_ON || c.HSTR_CREATED_ON || ''}</Text>
 </View>
 <Text style={styles.commentText}>{c.COMMENTS || c.HSTR_COMMENTS || '-'}</Text>
 </View>
 ))}
 </View>
 )}
 {/* Read-only notice */}
 <View style={[styles.detailSection, { borderBottomWidth: 0 }]}>
 <View style={styles.readOnlyBadge}>
 <Ionicons name="information-circle-outline" size={16} color="#2196F3" />
 <Text style={styles.readOnlyText}>This is a view-only report</Text>
 </View>
 </View>
 </ScrollView>
 </View>
 </View>
 </Modal>

 {/* ── Advance Detail Modal (read-only) ── */}
 <Modal transparent={true} visible={AdvanceDetailModal}>
 <View style={styles.centeredView}>
 <View style={styles.modalViewDetail}>
 <View style={styles.modalHeader}>
 <View style={{ flex: 1 }}>
 <Text Bold style={styles.modalTitle}>Advance Details</Text>
 {modalDataAdvance.HSTR_REQ_STATUS && (
 <View style={[styles.statusBadge, getStatusColor(modalDataAdvance.HSTR_REQ_STATUS), { marginTop: 5, alignSelf: 'flex-start' }]}>
 <Text style={styles.statusText}>{modalDataAdvance.HSTR_REQ_STATUS}</Text>
 </View>
 )}
 </View>
 <TouchableOpacity onPress={() => setAdvanceDetailModal(false)}>
 <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />
 </TouchableOpacity>
 </View>
 <ScrollView showsVerticalScrollIndicator={false}>
 {renderDetailRows(modalDataAdvance)}
 {commentsAdvance.length > 0 && (
 <View style={styles.detailSection}>
 <Text Bold style={styles.sectionTitle}>Comments</Text>
 {commentsAdvance.map((c, i) => (
 <View key={i} style={styles.commentItem}>
 <View style={styles.commentHeader}>
 <Text Bold style={styles.commentUser}>{c.USER_NAME || c.HSTR_CREATOR_NAME || 'User'}</Text>
 <Text style={styles.commentDate}>{c.CREATED_ON || c.HSTR_CREATED_ON || ''}</Text>
 </View>
 <Text style={styles.commentText}>{c.COMMENTS || c.HSTR_COMMENTS || '-'}</Text>
 </View>
 ))}
 </View>
 )}
 {/* Read-only notice */}
 <View style={[styles.detailSection, { borderBottomWidth: 0 }]}>
 <View style={styles.readOnlyBadge}>
 <Ionicons name="information-circle-outline" size={16} color="#2196F3" />
 <Text style={styles.readOnlyText}>This is a view-only report</Text>
 </View>
 </View>
 </ScrollView>
 </View>
 </View>
 </Modal>

 {/* ── Financial Year Modal ── */}
 <Modal transparent={true} visible={showFinYearModal} animationType="fade">
 <View style={styles.centeredView}>
 <View style={styles.modalViewDropdown}>
 <View style={styles.modalHeader}>
 <Text Bold style={styles.modalTitle}>Select Financial Year</Text>
 <TouchableOpacity onPress={() => setShowFinYearModal(false)}>
 <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />
 </TouchableOpacity>
 </View>
 <ScrollView showsVerticalScrollIndicator={false}>
 <TouchableOpacity style={[styles.dropdownItem, finYearFilter === '' && styles.dropdownItemSelected]} onPress={() => { setFinYearFilter(''); setShowFinYearModal(false); }}>
 <Text style={[styles.dropdownItemText, finYearFilter === '' && styles.dropdownItemTextSelected]}>All</Text>
 {finYearFilter === '' && <Ionicons name="checkmark" size={20} color="#FF6347" />}
 </TouchableOpacity>
 {finYearOptions.map((option) => (
 <TouchableOpacity key={option.value} style={[styles.dropdownItem, finYearFilter === option.value && styles.dropdownItemSelected]} onPress={() => { setFinYearFilter(option.value); setShowFinYearModal(false); }}>
 <Text style={[styles.dropdownItemText, finYearFilter === option.value && styles.dropdownItemTextSelected]}>{option.label}</Text>
 {finYearFilter === option.value && <Ionicons name="checkmark" size={20} color="#FF6347" />}
 </TouchableOpacity>
 ))}
 </ScrollView>
 </View>
 </View>
 </Modal>

 {/* ── Attachment Modal ── */}
 <Modal visible={attachmentModal} animationType="slide" transparent={false} onRequestClose={() => setAttachmentModal(false)}>
 <SafeAreaView style={styles.modalContainer}>
 <View style={styles.modalHeaderFull}>
 <View>
 <Text style={styles.modalTitleFull} Bold>Attachments</Text>
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

 {/* ── UPDATED: Unified File Viewer Modal (PDF + Images) ── */}
 <Modal visible={fileViewerModal} animationType="slide" transparent={false} onRequestClose={closeFileViewer}>
 <SafeAreaView style={styles.pdfModalContainer}>
 <View style={styles.pdfHeader}>
 <View style={{ flex: 1, marginRight: 10 }}>
 <Text style={styles.pdfTitle} Bold numberOfLines={1}>{fileViewerFileName}</Text>
 </View>
 <TouchableOpacity onPress={closeFileViewer} style={styles.pdfCloseButton}>
 <Ionicons name="close-circle" size={32} color="#fff" />
 </TouchableOpacity>
 </View>
 {selectedFileBase64 ? (
 <WebView
 originWhitelist={['*']}
 source={{
 html: fileViewerType === 'image'
 ? getImageViewerHtml(selectedFileBase64, getMimeType(fileViewerFileName))
 : getPdfViewerHtml(selectedFileBase64),
 }}
 style={styles.webView}
 javaScriptEnabled={true}
 domStorageEnabled={true}
 startInLoadingState={true}
 scalesPageToFit={false}
 scrollEnabled={true}
 pinchGestureEnabled={false}
 onError={() => Toast.show('Error loading file', Toast.SHORT)}
 renderLoading={() => (
 <View style={styles.pdfLoadingContainer}>
 <ActivityIndicator size="large" color="#FF6347" />
 <Text style={styles.pdfLoadingText}>
 {fileViewerType === 'image' ? 'Loading image...' : 'Loading PDF...'}
 </Text>
 </View>
 )}
 />
 ) : (
 <View style={styles.pdfLoadingContainer}>
 <ActivityIndicator size="large" color="#FF6347" />
 <Text style={styles.pdfLoadingText}>Preparing file...</Text>
 </View>
 )}
 </SafeAreaView>
 </Modal>

 </View>
 );
};

export default HospitalReportScreens;

const styles = StyleSheet.create({
 subTabContainer: {
 padding: 15,
 backgroundColor: '#fff',
 shadowColor: '#000',
 shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.1,
 shadowRadius: 4,
 elevation: 3,
 },
 contentContainer: { paddingHorizontal: 10, flex: 1 },
 tabsContainerStyle: { borderRadius: 8, width: '100%' },
 tabStyle: { paddingVertical: 10, borderWidth: 1, borderRadius: 8, borderColor: '#FF6347' },
 tabTextStyle: { fontSize: 13, color: 'grey', fontFamily: 'Roboto-Bold' },
 activeTabStyle: { backgroundColor: '#FF6347' },
 activeTabTextStyle: { color: '#fff' },
 filterContainer: {
 backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 8, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
 },
 filterToggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 8 },
 filterToggleText: { fontSize: 14, color: '#FF6347' },
 filterContent: { padding: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
 filterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
 filterInputContainer: { flex: 1 },
 filterLabel: { fontSize: 13, color: '#333', marginBottom: 8 },
 filterInput: { borderWidth: 1, borderColor: '#FF6347', borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fff' },
 dropdownButton: { borderWidth: 1, borderColor: '#FF6347', borderRadius: 8, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
 dropdownButtonText: { fontSize: 13, color: '#333', flex: 1, marginRight: 5 },
 filterButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
 filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, gap: 8 },
 searchButton: { backgroundColor: '#FF6347' },
 clearButton: { backgroundColor: '#9E9E9E' },
 filterButtonText: { color: '#fff', fontSize: 14 },
 listContainer: { padding: 10, paddingBottom: 20 },
 reportCard: {
 backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
 },
 cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
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
 buttonRow: { marginTop: 10 },
 actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6 },
 attachmentButton: { backgroundColor: '#FF9800' },
 actionButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
 emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
 emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
 centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
 modalViewDetail: { width: '90%', maxHeight: '85%', backgroundColor: GlobalColor.White, padding: 20, borderRadius: 8 },
 modalViewDropdown: { width: '85%', maxHeight: '70%', backgroundColor: GlobalColor.White, padding: 20, borderRadius: 8 },
 modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: 15 },
 modalTitle: { fontSize: 16, color: '#333' },
 detailSection: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
 sectionTitle: { fontSize: 14, color: '#FF6347', marginBottom: 12 },
 detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
 detailLabel: { fontSize: 13, color: '#666', flex: 0.45 },
 detailValue: { fontSize: 13, color: '#333', fontWeight: '500', flex: 0.55, textAlign: 'right' },
 commentItem: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 6, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#FF6347' },
 commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
 commentUser: { fontSize: 12, color: '#333' },
 commentDate: { fontSize: 11, color: '#999' },
 commentText: { fontSize: 13, color: '#555' },
 readOnlyBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F2FD', padding: 10, borderRadius: 6, gap: 6, marginBottom: 10 },
 readOnlyText: { fontSize: 13, color: '#2196F3' },
 dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
 dropdownItemSelected: { backgroundColor: '#FFF5F5' },
 dropdownItemText: { fontSize: 14, color: '#333' },
 dropdownItemTextSelected: { color: '#FF6347', fontWeight: 'bold' },
 modalContainer: { flex: 1, backgroundColor: GlobalColor.PrimaryLight },
 modalHeaderFull: {
 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
 padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
 },
 modalTitleFull: { fontSize: 20, color: '#FF6347' },
 modalSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
 closeButton: { padding: 5 },
 modalListContainer: { padding: 15, paddingBottom: 30 },
 attachmentCard: {
 backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,
 shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
 },
 attachmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#FF6347' },
 attachmentFileName: { fontSize: 14, color: '#333' },
 attachmentFileDesc: { fontSize: 12, color: '#666', marginTop: 3 },
 attachmentDetails: { marginBottom: 10 },
 tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
 tableLabel: { flex: 0.4, fontSize: 12, color: '#666', fontWeight: '600' },
 tableValue: { flex: 0.6, fontSize: 12, color: '#333' },
 viewPdfButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, marginTop: 10 },
 viewImageButton: { backgroundColor: '#2196F3' },
 viewPdfButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
 pdfModalContainer: { flex: 1, backgroundColor: '#525659' },
 pdfHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FF6347' },
 pdfTitle: { fontSize: 16, color: '#fff' },
 pdfCloseButton: { padding: 5 },
 webView: { flex: 1, backgroundColor: '#525659' },
 pdfLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#525659' },
 pdfLoadingText: { fontSize: 16, color: '#fff', marginTop: 15 },
});