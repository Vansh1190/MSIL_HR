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

  Platform,

  ActivityIndicator,

} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SegmentedControlTab from 'react-native-segmented-control-tab';

import * as ApiService from '../../../Utils/Utils';

import Toast from 'react-native-simple-toast';

import { useFocusEffect } from '@react-navigation/native';

import AuthContext from '../../../context/AuthContext';

import moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';

import { GlobalColor } from '../../../constants/Colors';

import Text from '../../../components/reusable/Text';

import ListEmptyComponent from '../../../components/reusable/ListEmptyComponent';

import TextInput from '../../../components/reusable/TextInput';

import Button from '../../../components/reusable/Button';

import { WebView } from 'react-native-webview';

 

export const HospitalApprovalScreens = () => {

  const [approve, setApprove] = useState(0);

  const { authContext, AppUserData } = useContext(AuthContext);

  const [loader, setLoader] = useState(false);

  const [refresh, setrefresh] = useState(false);

 

  // Intimation Approval States

  const [PendingIntimationReq, setPendingIntimationReq] = useState([]);

  const [IntimationDetailModal, setIntimationDetailModal] = useState(false);

  const [modalDataIntimation, setModalDataIntimation] = useState({});

  const [commentsIntimation, setCommentsIntimation] = useState([]);

 

  // Advance Approval States

  const [PendingAdvanceReq, setPendingAdvanceReq] = useState([]);

  const [AdvanceDetailModal, setAdvanceDetailModal] = useState(false);

  const [modalDataAdvance, setModalDataAdvance] = useState({});

  const [commentsAdvance, setCommentsAdvance] = useState([]);

 

  // Action States

  const [actionComment, setActionComment] = useState('');

  const [approvedAmount, setApprovedAmount] = useState('');

 const [filtersUsed, setFiltersUsed] = useState(false);

  // Filter States

  const [requestIdFilter, setRequestIdFilter] = useState('');

  const [finYearFilter, setFinYearFilter] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  const [showFinYearModal, setShowFinYearModal] = useState(false);

 

  // Attachment States

  const [attachmentModal, setAttachmentModal] = useState(false);

  const [attachmentData, setAttachmentData] = useState([]);

  const [selectedRequestId, setSelectedRequestId] = useState('');

 

  // ── ACTIVITY LOG STATES (added) ──────────────────────────────────────────────
  const [activityLogModal, setActivityLogModal] = useState(false);
  const [activityLogData, setActivityLogData] = useState([]);

 

  // File Viewer States (PDF + Images)

  const [fileViewerModal, setFileViewerModal] = useState(false);

  const [selectedFileBase64, setSelectedFileBase64] = useState('');

  const [fileViewerFileName, setFileViewerFileName] = useState('');

  const [fileViewerType, setFileViewerType] = useState('pdf'); // 'pdf' | 'image'

 

  const [hasData, setHasData] = useState(false);

 

  // Hospital detail states for tax exempted info

  const [intimationHospitalData, setIntimationHospitalData] = useState(null);

  const [advanceHospitalData, setAdvanceHospitalData] = useState(null);

 

  const getCurrentFinancialYear = () => {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();

    const currentYear = currentDate.getFullYear();

    let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

    const yearStr = startYear.toString().slice(-2);

    const nextYearStr = (startYear + 1).toString().slice(-2);

    return `${yearStr}${nextYearStr}`;

  };



  const generateFinYears = () => {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();

    const currentYear = currentDate.getFullYear();

    let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

    const finYears = [{ label: 'All Years', value: '' }];

    for (let year = startYear; year >= 2020; year--) {

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



  const [finYearOptions] = useState(generateFinYears());

 

  const stopLoader = () => {

    setLoader(false);

    setrefresh(false);

  };

 

  const getUsername = () => {

    return AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '';

  };

 

  const getHospitalType = (catg) => {

    if (!catg) return '-';

    if (catg === 'P') return 'Panel';

    if (catg === 'N') return 'Non Panel';

    if (catg === 'R') return 'Referral';

    return catg;

  };

 

  // Helper: check if status is "Submitted to Finance" (case-insensitive)

  const isSubmittedToFinance = (status) => {

    if (!status) return false;

    return status.trim().toLowerCase() === 'submitted to finance';

  };

 

  // Helper: check API response value contains "success" (case-insensitive)

  const isSuccessResponse = (responseValue) => {

    if (!responseValue) return false;

    return responseValue.toString().trim().toLowerCase().includes('success');

  };

 

  // Helper: detect file type from filename extension

  const getFileType = (fileName) => {

    if (!fileName) return 'pdf';

    const ext = fileName.split('.').pop().toLowerCase();

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff'];

    if (imageExts.includes(ext)) return 'image';

    return 'pdf';

  };

 

  // Helper: get MIME type from filename extension

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

 

  // Fetch hospital details by HospitalCode for tax exempted info

  const fetchHospitalDetails = async (hospitalId, compCode) => {

    if (!hospitalId) return null;

    let token = AppUserData.token;

    let apiData = {

      CompCode: compCode || '101',

      SearchKey: '',

      RowLimit: '',

      HospitalCode: hospitalId?.toString() || '',

    };

    try {

      const result = await ApiService.PostMethode('/SearchHospital', apiData, token, authContext);

      console.log('Hospital Details Response:', result);

      if (result?.Value && Array.isArray(result.Value) && result.Value.length > 0) {

        return result.Value[0];

      }

      return null;

    } catch (error) {

      console.log('Hospital Details Error:', error);

      return null;

    }

  };

 

  // Helper: format tax exempted date or return '-'

  const formatTaxDate = (dateValue) => {

    if (!dateValue) return '-';

    const formatted = moment(dateValue).format('DD-MMM-YYYY');

    if (formatted === 'Invalid date') return '-';

    return formatted;

  };

 

  // Helper: safely convert any value to string for custom Text component

  const safeStr = (val) => {

    if (val === null || val === undefined) return '-';

    return String(val);

  };

 

  const GetPendingIntimationReq = async (showLoader = true, requestId = '', finYear = '') => {

    const username = getUsername();

    let token = AppUserData.token;

    const requestType = requestId && requestId.trim() !== '' ? 'REQUEST' : 'PENDING';

    let apiData = {

      AppName: 'HOSP INTIM',

      UserName: username,

      RequestType: requestType,

      RequestID: requestId || '',

      FinYear: finYear || '',

    };

    if (showLoader) setLoader(true);

    try {

      const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);

      console.log('Intimation Pending Requests:', result);

      if (Array.isArray(result?.Value) && result.Value.length > 0) {

        const filteredResults = result.Value.filter(item => {

          const status = item.HSTR_REQ_STATUS?.toLowerCase() || '';

          return status !== 'back to initiator';

        });

        setPendingIntimationReq(filteredResults);

        setHasData(filteredResults.length > 0);

        if (filteredResults.length === 0) {

          setTimeout(() => { Toast.show('No Pending Request Found'); }, 500);

        }

      } else {

        setPendingIntimationReq([]);

        setHasData(false);

        setTimeout(() => { Toast.show('No Pending Request Found'); }, 500);

      }

    } catch (error) {

      ApiService.showErrorMessage(error, authContext);

      setHasData(false);

    } finally {

      if (showLoader) setLoader(false);

    }

  };

 

  const GetPendingAdvanceReq = async (showLoader = true, requestId = '', finYear = '') => {

    const username = getUsername();

    let token = AppUserData.token;

    const requestType = requestId && requestId.trim() !== '' ? 'REQUEST' : 'PENDING';

    let apiData = {

      AppName: 'HOSP ADV',

      UserName: username,

      RequestType: requestType,

      RequestID: requestId || '',

      FinYear: finYear || '',

    };

    if (showLoader) setLoader(true);

    try {

      const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);

      console.log('Advance Pending Requests:', result);

      if (Array.isArray(result?.Value) && result.Value.length > 0) {

        const filteredResults = result.Value.filter(item => {

         const status = item.HSTR_REQ_STATUS?.toLowerCase() || '';

          return status !== 'back to initiator';

        });

        setPendingAdvanceReq(filteredResults);

        setHasData(filteredResults.length > 0);

        if (filteredResults.length === 0) {

          setTimeout(() => { Toast.show('No Pending Request Found'); }, 500);

        }

      } else {

        setPendingAdvanceReq([]);

        setHasData(false);

        setTimeout(() => { Toast.show('No Pending Request Found'); }, 500);

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

    let token = AppUserData.token;

    let apiData = {

      AppName: appName,

      UserName: username,

      RequestType: 'COMMENTS',

      RequestID: requestId?.toString() || '',

      FinYear: '',

    };

    try {

      const result = await ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext);

      console.log('Comments Response:', result);

      if (Array.isArray(result?.Value) && result.Value.length > 0) {

        return result.Value;

      } else {

        return [];

      }

    } catch (error) {

      console.log('Comments Error:', error);

      return [];

    }

  };

 

  // Fetch attachments for a given requestId

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

 

  // Fetch attachments silently (no modal) and return them

  const fetchAttachmentsForAction = async (requestId) => {

    const compCode = AppUserData?.data?.emplCompCode || '101';

    let apiData = { AppName: 'HOSPITAL', CompCode: compCode, RequestID: requestId };

    let token = AppUserData.token;

    try {

      const result = await ApiService.PostMethode('/GetHospitalAttachment', apiData, token, authContext);

      console.log('Get Attachment For Action Response:', result);

      if (result.Value && Array.isArray(result.Value) && result.Value.length > 0) {

        return result.Value;

      }

      return [];

    } catch (error) {

      console.log('Get Attachment For Action Error:', error);

      return [];

    }

  };

 

  // ── FETCH ACTIVITY LOG (added) ───────────────────────────────────────────────
  const fetchActivityLog = requestId => {
    const compCode = AppUserData?.data?.emplCompCode || '101';
    let apiData = {
      AppName: 'HOSPITAL',
      CompCode: compCode,
      RequestID: requestId,
    };
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
          if (result.Value.length === 0)
            Toast.show('No activity log found', Toast.SHORT);
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

 

  // Helper: extract new RequestID from HospitalAction response

  // Response format example: "SUCCESS: 265400:" → extract "265400"

  const extractNewRequestIdFromResponse = (responseValue) => {

    if (!responseValue) return null;

    try {

      const responseStr = responseValue.toString().trim();

      const match = responseStr.match(/:\s*(\d+)\s*:/);

      if (match && match[1]) {

        console.log('Extracted new RequestID from response:', match[1]);

        return match[1];

      }

      console.log('Could not extract RequestID from response:', responseStr);

      return null;

    } catch (error) {

      console.log('Error extracting RequestID from response:', error);

      return null;

    }

  };

 

  // Re-upload attachments after HospitalAction using new RequestID

  // Returns true if all uploads succeeded (or no attachments), false if any failed

 const reUploadAttachments = async (attachments, newRequestId, action, requestStatus) => {
  if (!attachments || attachments.length === 0) return true;

  const username = getUsername();
  const failedUploads = [];

  // Check if status is "Back to CMO" (case-insensitive)
  const isBackToCMO = requestStatus && requestStatus.toUpperCase().includes('BACK TO CMO');

  console.log('Re-upload attachments:', {
    requestStatus,
    isBackToCMO,
    action,
    willSendNullReferenceNo: isBackToCMO || action === 'Send Back',
    attachmentCount: attachments.length
  });

  // Sequential — one at a time, no Promise.all
  // Parallel uploads to the same RequestID cause race conditions on the server
  for (const attachment of attachments) {
    try {
      const apiData = {
        AppName: 'HOSPITAL',
        CompCode: attachment.WFLH_COMP || '101',
        RequestID: newRequestId,
        // FIX: Send null for ReferenceNo when status is "Back to CMO" (any action) or action is "Send Back"
        ReferenceNo: (isBackToCMO || action === 'Send Back') ? null : (attachment.WFAT_REF_NO || ''),
        FileName: attachment.WFAT_FILE_NAME || '',
        FileDesc: attachment.WFAT_FILE_DESC || '',
        Attachment: attachment.WFAT_ATTACHMENT || '',
        Order: attachment.WFAT_ORDER_NO || '1',
        DeleteFlag: '',
        UserName: username,
      };
      console.log('Re-uploading:', attachment.WFAT_FILE_NAME, '| newRequestId:', newRequestId);
      console.log('=== Re-upload Payload ===', JSON.stringify({
  ...apiData,
  Attachment: apiData.Attachment?.substring(0, 50) + '...[truncated]',
}, null, 2));
      const result = await ApiService.PostMethode(
        '/HospitalAttachment', apiData, AppUserData.token, authContext
      );
      const responseValue = (result?.Value || '').toString().trim().toUpperCase();
      if (responseValue.includes('SUCCESS')) {
        console.log('Re-upload OK:', attachment.WFAT_FILE_NAME);
      } else {
        console.warn('Re-upload non-success:', attachment.WFAT_FILE_NAME, '| Response:', result?.Value);
        failedUploads.push(attachment.WFAT_FILE_NAME);
      }
    } catch (error) {
      console.warn('Re-upload error:', attachment.WFAT_FILE_NAME, error);
      failedUploads.push(attachment.WFAT_FILE_NAME);
    }
  }

  if (failedUploads.length > 0) {
    console.warn('Re-upload failed for:', failedUploads.join(', '));
    return false;
  }

  return true;
};

 

  // Opens PDF or Image viewer based on file extension

  const openFileViewer = (base64Data, fileName) => {

    try {

      if (!base64Data) { Toast.show('File data not available', Toast.SHORT); return; }

      console.log('Opening file:', fileName);

      const cleanBase64 = base64Data.replace(/[\r\n\s]+/g, '').trim();

      const type = getFileType(fileName);

      setSelectedFileBase64(cleanBase64);

      setFileViewerFileName(fileName);

      setFileViewerType(type);

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

    setFileViewerFileName('');

    setFileViewerType('pdf');

    setTimeout(() => setAttachmentModal(true), 300);

  };

 

  // PDF Viewer HTML

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

          #zoom-container { transform-origin: top left; width: 100%; }

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

          #loading { color: #fff; font-size: 16px; text-align: center; margin-top: 40vh; font-family: sans-serif; }

         #error { color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 40vh; font-family: sans-serif; padding: 20px; display: none; }

          #page-info { color: #ccc; font-size: 13px; text-align: center; font-family: sans-serif; padding: 5px 0 10px 0; }

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

 

  // Image Viewer HTML

  const getImageViewerHtml = (base64, mimeType) => `

    <!DOCTYPE html>

    <html>

      <head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">

        <style>

          * { margin: 0; padding: 0; box-sizing: border-box; }

          html, body {

            width: 100%;

            height: 100%;

            background-color: #525659;

            display: flex;

            justify-content: center;

            align-items: flex-start;

            overflow: auto;

            -webkit-overflow-scrolling: touch;

          }

          #zoom-container {

            transform-origin: top center;

            width: 100%;

            display: flex;

            justify-content: center;

            padding: 10px 0;

          }

          img {

            max-width: 100%;

            height: auto;

            display: block;

            box-shadow: 0 2px 8px rgba(0,0,0,0.5);

            background: #fff;

          }

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

              zoomContainer.style.transformOrigin = 'top center';

              zoomContainer.style.width = (100 / currentScale) + '%';

            }

          }, { passive: false });

          document.addEventListener('touchend', function(e) {

            if (e.touches.length < 2) startDist = 0;

          });

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

        </script>

      </body>

    </html>

  `;

 

  const handleAttachmentPress = (requestId) => {

    setSelectedRequestId(requestId);

    fetchAttachments(requestId);

  };

 

  // ── HANDLE ACTIVITY LOG PRESS (added) ────────────────────────────────────────
  const handleActivityLogPress = requestId => {
    setSelectedRequestId(requestId);
    fetchActivityLog(requestId);
  };

 

  // openIntimationDetail — also fetches hospital details

  const openIntimationDetail = async (item) => {

    setModalDataIntimation(item);

    setIntimationHospitalData(null);

    setIntimationDetailModal(true);

    const defaultAmount = item.HSTR_ADV_APP_AMT

      ? item.HSTR_ADV_APP_AMT?.toString()

      : item.HSTR_ADV_REQ_AMT

      ? item.HSTR_ADV_REQ_AMT?.toString()

      : '';

    setApprovedAmount(defaultAmount);

 

    const [comments, hospitalDetail] = await Promise.all([

      fetchComments(item.HSTR_REQ_ID, 'HOSP INTIM'),

      fetchHospitalDetails(item.HSTR_HSPM_ID, item.HSTR_COMP_CODE || '101'),

    ]);

    setCommentsIntimation(comments);

    setIntimationHospitalData(hospitalDetail);

  };

 

  // openAdvanceDetail — also fetches hospital details

  const openAdvanceDetail = async (item) => {

    setModalDataAdvance(item);

    setAdvanceHospitalData(null);

    setAdvanceDetailModal(true);

    const defaultAmount = item.HSTR_ADV_APP_AMT

      ? item.HSTR_ADV_APP_AMT?.toString()

      : item.HSTR_ADV_REQ_AMT

      ? item.HSTR_ADV_REQ_AMT?.toString()

      : '';

    setApprovedAmount(defaultAmount);

 

    const [comments, hospitalDetail] = await Promise.all([

      fetchComments(item.HSTR_REQ_ID, 'HOSP ADV'),

      fetchHospitalDetails(item.HSTR_HSPM_ID, item.HSTR_COMP_CODE || '101'),

    ]);

    setCommentsAdvance(comments);

    setAdvanceHospitalData(hospitalDetail);

  };

 

  // ─── performIntimationAction ───────────────────────────────────────────────────

  const performIntimationAction = (data, action, comment, amount) => {

    if (action === 'Approve' && data.HSTR_ADV_REQ_AMT && !amount?.trim()) {

      Alert.alert('Error', 'Please enter approved amount', [{ text: 'Okay', style: 'cancel' }]);

      return;

    }

    if (action === 'Approve' && data.HSTR_ADV_REQ_AMT && amount?.trim()) {

      const approvedAmountValue = parseFloat(amount);

      // CHECK: approved amount must be >= 1

      if (isNaN(approvedAmountValue) || approvedAmountValue < 1) {

        Alert.alert('Error', 'Approved amount must be greater than or equal to 1', [{ text: 'Okay', style: 'cancel' }]);

        return;

      }

      const requestedAmount = parseFloat(data.HSTR_ADV_REQ_AMT);

      if (approvedAmountValue > requestedAmount) {

        Alert.alert('Error', 'Approved advance amount is greater than requested amount', [{ text: 'Okay', style: 'cancel' }]);

        return;

      }

    }

    setIntimationDetailModal(false);

    const actionText = action === 'Approve' ? 'Approve' : 'Send Back';

    setTimeout(() => {

      Alert.alert(actionText, `Are you sure you want to ${actionText.toLowerCase()}?`, [

        { text: 'Cancel', style: 'cancel', onPress: () => { setIntimationDetailModal(true); } },

        {

          text: 'OK',

          onPress: async () => {

            setLoader(true);

            const employeeDetails = { employeeNTID: AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '' };

            let token = AppUserData.token;

 

            // STEP 1: Fetch existing attachments BEFORE calling HospitalAction

            let existingAttachments = [];

            try {

              existingAttachments = await fetchAttachmentsForAction(data.HSTR_REQ_ID?.toString() || '');

              console.log('Step 1 - Fetched existing attachments count:', existingAttachments.length);

            } catch (attachErr) {

              console.log('Step 1 - Error fetching attachments before action:', attachErr);

            }

 

            // STEP 2: Call HospitalAction

            let apiData = {

              RequestID: data.HSTR_REQ_ID?.toString() || '',

              AppName: 'HOSP INTIM',

              CompCode: data.HSTR_COMP_CODE?.toString() || '101',

              RequestStatus: data.HSTR_REQ_STATUS || 'Draft',

              Action: action,

              RequestorID: data.HSTR_RQSTR_ID?.toString() || '',

              RequestorName: data.HSTR_RQSTR_NAME || '',

              RequestorLocn: data.HSTR_RQSTR_LOCN || '',

              RequestorDesg: data.HSTR_RQSTR_DESG || '',

              RequestorDept: data.HSTR_RQSTR_DEPT || '',

              RequestorDivn: data.HSTR_RQSTR_DIVN || '',

              RequestorDirc: data.HSTR_RQSTR_DIRC || '',

              RequestorNTID: data.HSTR_RQSTR_NTID || '',

              RequestorPhone: data.HSTR_RQSTR_CONTACT || '',

              PatientCode: data.HSTR_PATIENT_CODE?.toString() || '',

              PatientName: data.HSTR_PATIENT_NAME || '',

              PatientRelation: data.HSTR_PATIENT_RELATION || '',

              DiseaseID: data.HSTR_DISEASE_ID?.toString() || '',

              DiseaseName: data.HSTR_DISEASE_NAME || '',

              EmergencyFlag: data.HSTR_EMER_FLAG || '',

              HospitalID: data.HSTR_HSPM_ID?.toString() || '',

              HospitalName: data.HSTR_HSPM_NAME || '',

              HospitalBranch: data.HSTR_HSPM_BRANCH || '',

              HospitalCity: data.HSTR_HSPM_CITY || '',

              HospitalCatg: data.HSTR_HSPM_CATG || '',

              TaxExmpFlag: data.HSTR_TAX_EXEMTED_FLAG || '',

              AdmitDate: data.HSTR_ADMIT_DATE || '',

              DischargeDate: data.HSTR_DISCHARGE_DATE || '',

              AdvanceReqAmount: data.HSTR_ADV_REQ_AMT?.toString() || '',

              AdvanceAppAmount: action === 'Approve' && data.HSTR_ADV_REQ_AMT ? (amount || data.HSTR_ADV_REQ_AMT?.toString() || '') : data.HSTR_ADV_APP_AMT?.toString() || '',

              CreatorName: data.HSTR_CREATOR_NAME || '',

              CreatorID: data.HSTR_CREATOR_ID?.toString() || '',

              CMOAPPHospAmt: data.HSTR_CMO_APP_HOSP_AMT?.toString() || '',

              FinAPPHospAmt: data.HSTR_FIN_APP_HOSP_AMT?.toString() || '',

              HospAmount: data.HSTR_HOSP_AMT?.toString() || '',

              TotalAmount: data.HSTR_TOTAL_AMT?.toString() || '',

              RefIntimID: data.HSTR_REF_INTIMATION_ID?.toString() || '',

              RequestorAmount: data.HSTR_RQSTR_AMT?.toString() || '',

              CMOAPPReqAmt: data.HSTR_CMO_APP_REQ_AMT?.toString() || '',

              FinAPPReqAAmt: data.HSTR_FIN_APP_REQ_AMT?.toString() || '',

              RequestorDOB: data.hstr_rqstr_dob || '',

              RequestorDOJ: data.hstr_rqstr_doj || '',

              BillDetails: '',

              RefundAmount: data.HSTR_REFUND?.toString() || '',

              UTRNumber: data.HSTR_UTR || '',

              Documents: '',

              UserName: employeeDetails.employeeNTID,

              Comments: comment || '',

              Attachment: '',

              CreatorNTID: data.HSTR_CREATED_BY?.toString() || '',

            };

            console.log(`Step 2 - ${action} Intimation API Data:`, apiData);

            try {

              const result = await ApiService.PostMethode('/HospitalAction', apiData, token, authContext);

              console.log('action', apiData);

              console.log(`Step 2 - ${action} Intimation Response:`, result);

 

              // Check HospitalAction response for success/failure

              if (result.Value && isSuccessResponse(result.Value)) {

                // STEP 3: Extract new RequestID and re-upload attachments

                const newRequestId = extractNewRequestIdFromResponse(result.Value);

                console.log('Step 3 - New RequestID from HospitalAction response:', newRequestId);

                if (existingAttachments.length > 0 && newRequestId) {

                  try {

                    const attachUploadSuccess = await reUploadAttachments(existingAttachments, newRequestId, action, data.HSTR_REQ_STATUS);

                    if (attachUploadSuccess) {

                      console.log('Step 3 - Attachments re-uploaded successfully with new RequestID:', newRequestId);

                    } else {

                      console.log('Step 3 - Some attachments failed to re-upload with new RequestID:', newRequestId);

                    }

                  } catch (attachErr) {

                    console.log('Step 3 - Error re-uploading attachments:', attachErr);

                  }

                } else {

                  console.log('Step 3 - Skipping re-upload: attachments count:', existingAttachments.length, '| newRequestId:', newRequestId);

                }

                setLoader(false);

                const successMessage = action === 'Approve' ? 'Intimation approved successfully' : 'Intimation sent back successfully';

                Alert.alert('Success', successMessage, [{

                  text: 'OK',

                  onPress: () => {

                    setActionComment('');

                    setApprovedAmount('');

                    GetPendingIntimationReq(true, requestIdFilter, finYearFilter);

                  },

                }]);

              } else {

                // API returned a value but it is not a success — show the API error message

                setLoader(false);

                const errorMessage = result.Value

                  ? result.Value.toString()

                  : `Failed to ${action.toLowerCase()}`;

                Alert.alert('Error', errorMessage, [{ text: 'Okay', style: 'cancel' }]);

              }

            } catch (error) {

              setLoader(false);

              console.log(`${action} Intimation Error:`, error);

              ApiService.showErrorMessage(error, authContext);

            }

          },

        },

      ]);

    }, 300);

  };

 

  // ─── performAdvanceAction ─────────────────────────────────────────────────────

  const performAdvanceAction = (data, action, comment, amount) => {

    if (action === 'Approve' && !amount?.trim()) {

      Alert.alert('Error', 'Please enter approved amount', [{ text: 'Okay', style: 'cancel' }]);

      return;

    }

    if (action === 'Approve' && amount?.trim()) {

      const approvedAmountValue = parseFloat(amount);

      // CHECK: approved amount must be >= 1

      if (isNaN(approvedAmountValue) || approvedAmountValue < 1) {

        Alert.alert('Error', 'Approved amount must be greater than or equal to 1', [{ text: 'Okay', style: 'cancel' }]);

        return;

      }

      const requestedAmount = parseFloat(data.HSTR_ADV_REQ_AMT);

      if (approvedAmountValue > requestedAmount) {

        Alert.alert('Error', 'Approved advance amount is greater than requested amount', [{ text: 'Okay', style: 'cancel' }]);

        return;

      }

    }

    setAdvanceDetailModal(false);

    const actionText = action === 'Approve' ? 'Approve' : 'Send Back';

    setTimeout(() => {

      Alert.alert(actionText, `Are you sure you want to ${actionText.toLowerCase()}?`, [

        { text: 'Cancel', style: 'cancel', onPress: () => { setAdvanceDetailModal(true); } },

        {

          text: 'OK',

          onPress: async () => {

            setLoader(true);

            const employeeDetails = { employeeNTID: AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '' };

            let token = AppUserData.token;

 

            // STEP 1: Fetch existing attachments BEFORE calling HospitalAction

            let existingAttachments = [];

            try {

              existingAttachments = await fetchAttachmentsForAction(data.HSTR_REQ_ID?.toString() || '');

              console.log('Step 1 - Fetched existing attachments count:', existingAttachments.length);

            } catch (attachErr) {

              console.log('Step 1 - Error fetching attachments before action:', attachErr);

            }

 

            // STEP 2: Call HospitalAction

            let apiData = {

              RequestID: data.HSTR_REQ_ID?.toString() || '',

              AppName: 'HOSP ADV',

              CompCode: data.HSTR_COMP_CODE?.toString() || '101',

              RequestStatus: data.HSTR_REQ_STATUS || 'Draft',

              Action: action,

              RequestorID: data.HSTR_RQSTR_ID?.toString() || '',

              RequestorName: data.HSTR_RQSTR_NAME || '',

              RequestorLocn: data.HSTR_RQSTR_LOCN || '',

              RequestorDesg: data.HSTR_RQSTR_DESG || '',

              RequestorDept: data.HSTR_RQSTR_DEPT || '',

             RequestorDivn: data.HSTR_RQSTR_DIVN || '',

              RequestorDirc: data.HSTR_RQSTR_DIRC || '',

              RequestorNTID: data.HSTR_RQSTR_NTID || '',

              RequestorPhone: data.HSTR_RQSTR_CONTACT || '',

              PatientCode: data.HSTR_PATIENT_CODE?.toString() || '',

              PatientName: data.HSTR_PATIENT_NAME || '',

              PatientRelation: data.HSTR_PATIENT_RELATION || '',

              DiseaseID: data.HSTR_DISEASE_ID?.toString() || '',

              DiseaseName: data.HSTR_DISEASE_NAME || '',

              EmergencyFlag: data.HSTR_EMER_FLAG || '',

              HospitalID: data.HSTR_HSPM_ID?.toString() || '',

              HospitalName: data.HSTR_HSPM_NAME || '',

              HospitalBranch: data.HSTR_HSPM_BRANCH || '',

              HospitalCity: data.HSTR_HSPM_CITY || '',

              HospitalCatg: data.HSTR_HSPM_CATG || '',

              TaxExmpFlag: data.HSTR_TAX_EXEMTED_FLAG || '',

              AdmitDate: data.HSTR_ADMIT_DATE || '',

              DischargeDate: data.HSTR_DISCHARGE_DATE || '',

              AdvanceReqAmount: data.HSTR_ADV_REQ_AMT?.toString() || '',

              AdvanceAppAmount: amount || '',

              CreatorName: data.HSTR_CREATOR_NAME || '',

              CreatorID: data.HSTR_CREATOR_ID?.toString() || '',

              CMOAPPHospAmt: data.HSTR_CMO_APP_HOSP_AMT?.toString() || '',

              FinAPPHospAmt: data.HSTR_FIN_APP_HOSP_AMT?.toString() || '',

              HospAmount: data.HSTR_HOSP_AMT?.toString() || '',

              TotalAmount: data.HSTR_TOTAL_AMT?.toString() || '',

              RefIntimID: data.HSTR_REF_INTIMATION_ID?.toString() || '',

              RequestorAmount: data.HSTR_RQSTR_AMT?.toString() || '',

              CMOAPPReqAmt: data.HSTR_CMO_APP_REQ_AMT?.toString() || '',

              FinAPPReqAAmt: data.HSTR_FIN_APP_REQ_AMT?.toString() || '',

              RequestorDOB: data.hstr_rqstr_dob || '',

              RequestorDOJ: data.hstr_rqstr_doj || '',

              BillDetails: '',

              RefundAmount: data.HSTR_REFUND?.toString() || '',

              UTRNumber: data.HSTR_UTR || '',

              Documents: '',

              UserName: employeeDetails.employeeNTID,

              Comments: comment || '',

              Attachment: '',

              CreatorNTID: data.HSTR_CREATED_BY?.toString() || '',

            };

            console.log(`Step 2 - ${action} Advance API Data:`, apiData);

            try {

              const result = await ApiService.PostMethode('/HospitalAction', apiData, token, authContext);

              console.log(`Step 2 - ${action} Advance Response:`, result);

 

              // Check HospitalAction response for success/failure

              if (result.Value && isSuccessResponse(result.Value)) {

                // STEP 3: Extract new RequestID and re-upload attachments

                const newRequestId = extractNewRequestIdFromResponse(result.Value);

                console.log('Step 3 - New RequestID from HospitalAction response:', newRequestId);

                if (existingAttachments.length > 0 && newRequestId) {

                  try {

                    const attachUploadSuccess = await reUploadAttachments(existingAttachments, newRequestId, action, data.HSTR_REQ_STATUS);

                    if (attachUploadSuccess) {

                      console.log('Step 3 - Attachments re-uploaded successfully with new RequestID:', newRequestId);

                    } else {

                      console.log('Step 3 - Some attachments failed to re-upload with new RequestID:', newRequestId);

                    }

                  } catch (attachErr) {

                    console.log('Step 3 - Error re-uploading attachments:', attachErr);

                  }

                } else {

                  console.log('Step 3 - Skipping re-upload: attachments count:', existingAttachments.length, '| newRequestId:', newRequestId);

                }

                setLoader(false);

                const successMessage = action === 'Approve' ? 'Advance approved successfully' : 'Advance sent back successfully';

                Alert.alert('Success', successMessage, [{

                  text: 'OK',

                  onPress: () => {

                    setActionComment('');

                    setApprovedAmount('');

                    GetPendingAdvanceReq(true, requestIdFilter, finYearFilter);

                  },

                }]);

              } else {

                // API returned a value but it is not a success — show the API error message

                setLoader(false);

                const errorMessage = result.Value

                  ? result.Value.toString()

                  : `Failed to ${action.toLowerCase()}`;

                Alert.alert('Error', errorMessage, [{ text: 'Okay', style: 'cancel' }]);

              }

            } catch (error) {

              setLoader(false);

              console.log(`${action} Advance Error:`, error);

              ApiService.showErrorMessage(error, authContext);

            }

          },

        },

      ]);

    }, 300);

  };

 

  const handleApprove = index => {

    setApprove(index);

    setRequestIdFilter('');

    const currentFY = finYearFilter || getCurrentFinancialYear();

    if (index == 0) { GetPendingIntimationReq(true, '', currentFY); } else { GetPendingAdvanceReq(true, '', currentFY); }

  };

 

  const handleSearch = () => {
      setFiltersUsed(true);  // ← add this


    if (approve == 0) { GetPendingIntimationReq(true, requestIdFilter, finYearFilter); }

    else { GetPendingAdvanceReq(true, requestIdFilter, finYearFilter); }

  };

 

  const handleClearFilters = () => {

    setRequestIdFilter('');

    setFinYearFilter('');
      setFiltersUsed(false);  // ← add this


    if (approve == 0) { GetPendingIntimationReq(); } else { GetPendingAdvanceReq(); }

  };

 

  const initialLoading = async () => {

    setLoader(true);

    const currentFY = getCurrentFinancialYear();

    setFinYearFilter(currentFY);

    try { await GetPendingIntimationReq(false, '', currentFY); }

    finally { setLoader(false); }

  };



  useFocusEffect(React.useCallback(() => { initialLoading(); }, []));

 

  const getStatusColor = (status) => {

    if (!status) return styles.statusDefault;

    const statusLower = status.toLowerCase();

    if (statusLower.includes('closed')) return styles.statusClosed;

    else if (statusLower.includes('approved')) return styles.statusApproved;

    else if (statusLower.includes('rejected') || statusLower.includes('sendback')) return styles.statusRejected;

    else if (statusLower.includes('submitted') || statusLower.includes('pending')) return styles.statusSubmitted;

    else return styles.statusDefault;

  };

 

  // ── RENDER ACTIVITY LOG ITEM (added) ─────────────────────────────────────────
  const renderActivityLogItem = ({item, index}) => (
    <View style={styles.activityLogCard}>
      <View style={styles.activityLogHeader}>
        <Text style={styles.activitySeqNo} Bold>
          {'Step ' + (index + 1)}
        </Text>
        <Text style={styles.activityStatus}>{item.WFLH_STATUS}</Text>
      </View>
      <View style={styles.activityLogTable}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>{'Assigned To:'}</Text>
          <Text style={styles.tableValue}>{item.WFLH_ASSIGNED_TO || '-'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>{'Role:'}</Text>
          <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_ROLE || '-'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>{'Department:'}</Text>
          <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_DEPT || '-'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>{'Designation:'}</Text>
          <Text style={styles.tableValue}>{item.WFLH_ASSIGNEE_DESG || '-'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>{'Assigned On:'}</Text>
          <Text style={styles.tableValue}>{item.WFLH_ASSIGNED_ON || '-'}</Text>
        </View>
        {item.WFLH_DUE_DATE && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'Due Date:'}</Text>
            <Text style={styles.tableValue}>{item.WFLH_DUE_DATE}</Text>
          </View>
        )}
        {item.WFLH_ACTION_TAKEN && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'Action Taken:'}</Text>
            <Text style={[styles.tableValue, styles.actionTaken]}>{item.WFLH_ACTION_TAKEN}</Text>
          </View>
        )}
        {item.WFLH_ACTION_BY && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'Action By:'}</Text>
            <Text style={styles.tableValue}>{item.WFLH_ACTION_BY}</Text>
          </View>
        )}
        {item.WFLH_ACTION_DATE && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'Action Date:'}</Text>
            <Text style={styles.tableValue}>{item.WFLH_ACTION_DATE}</Text>
          </View>
        )}
        {item.WFLH_NEW_STATUS && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'New Status:'}</Text>
            <Text style={[styles.tableValue, styles.newStatus]}>{item.WFLH_NEW_STATUS}</Text>
          </View>
        )}
        {item.WFLH_COMMENTS && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{'Comments:'}</Text>
            <Text style={styles.tableValue}>{item.WFLH_COMMENTS}</Text>
          </View>
        )}
      </View>
    </View>
  );

 

  // renderAttachmentItem

  const renderAttachmentItem = ({ item, index }) => {

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

            <Text style={styles.tableLabel}>{'Order:'}</Text>

            <Text style={styles.tableValue}>{item.WFAT_ORDER_NO || '-'}</Text>

          </View>

          <View style={styles.tableRow}>

            <Text style={styles.tableLabel}>{'Created By:'}</Text>

            <Text style={styles.tableValue}>{item.WFAT_CREATED_BY || '-'}</Text>

          </View>

          <View style={styles.tableRow}>

            <Text style={styles.tableLabel}>{'Created On:'}</Text>

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

 

  const renderIntimationCard = ({ item }) => (

    <TouchableOpacity style={styles.reportCard} onPress={() => openIntimationDetail(item)}>

      <View style={styles.cardHeader}>

        <Text style={styles.requestId} Bold>{'Request ID: ' + item.HSTR_REQ_ID}</Text>

        <View style={[styles.statusBadge, getStatusColor(item.HSTR_REQ_STATUS)]}>

          <Text style={styles.statusText}>{item.HSTR_REQ_STATUS}</Text>

        </View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Patient Name'}</Text><Text style={styles.value}>{item.HSTR_PATIENT_NAME || '-'}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Relation'}</Text><Text style={styles.value}>{item.HSTR_PATIENT_RELATION || '-'}</Text></View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Hospital'}</Text><Text style={styles.value}>{item.HSTR_HSPM_NAME || '-'}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'City'}</Text><Text style={styles.value}>{item.HSTR_HSPM_CITY || '-'}</Text></View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Disease'}</Text><Text style={styles.value}>{item.HSTR_DISEASE_NAME || '-'}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Admitted On'}</Text><Text style={styles.value}>{item.HSTR_ADMIT_DATE || '-'}</Text></View>

      </View>

      {item.HSTR_ADV_REQ_AMT != null && (

        <View style={styles.cardRow}>

          <View style={styles.cardColumn}><Text style={styles.label}>{'Advance Requested'}</Text><Text style={styles.value}>{'₹' + (item.HSTR_ADV_REQ_AMT || '0')}</Text></View>

          <View style={styles.cardColumn}><Text style={styles.label}>{'Advance Approved'}</Text><Text style={styles.value}>{'₹' + (item.HSTR_ADV_APP_AMT || '0')}</Text></View>

        </View>

      )}

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Emergency'}</Text><Text style={styles.value}>{item.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No'}</Text></View>

        <View style={styles.cardColumn} />

      </View>

      {/* ── UPDATED buttonRow: Activity Log + Attachments (added Activity Log) ── */}
      <View style={styles.buttonRow}>

        <TouchableOpacity
          style={[styles.actionButton, styles.activityLogButton]}
          onPress={() => handleActivityLogPress(item.HSTR_REQ_ID)}>
          <MaterialIcons name="history" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>{'Activity Log'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.attachmentButton]} onPress={() => handleAttachmentPress(item.HSTR_REQ_ID)}>

          <MaterialIcons name="attach-file" size={18} color="#fff" />

          <Text style={styles.actionButtonText}>{'Attachments'}</Text>

        </TouchableOpacity>

      </View>

    </TouchableOpacity>

  );

 

  const renderAdvanceCard = ({ item }) => (

    <TouchableOpacity style={styles.reportCard} onPress={() => openAdvanceDetail(item)}>

      <View style={styles.cardHeader}>

        <Text style={styles.requestId} Bold>{'Request ID: ' + item.HSTR_REQ_ID}</Text>

        <View style={[styles.statusBadge, getStatusColor(item.HSTR_REQ_STATUS)]}>

          <Text style={styles.statusText}>{item.HSTR_REQ_STATUS}</Text>

        </View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Patient Name'}</Text><Text style={styles.value}>{item.HSTR_PATIENT_NAME || '-'}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Relation'}</Text><Text style={styles.value}>{item.HSTR_PATIENT_RELATION || '-'}</Text></View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Hospital'}</Text><Text style={styles.value}>{item.HSTR_HSPM_NAME || '-'}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'City'}</Text><Text style={styles.value}>{item.HSTR_HSPM_CITY || '-'}</Text></View>

      </View>

      <View style={styles.cardRow}>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Advance Requested'}</Text><Text style={styles.value}>{'₹' + (item.HSTR_ADV_REQ_AMT || '0')}</Text></View>

        <View style={styles.cardColumn}><Text style={styles.label}>{'Admitted On'}</Text><Text style={styles.value}>{item.HSTR_ADMIT_DATE || '-'}</Text></View>

      </View>

      {item.HSTR_ADV_APP_AMT != null && (

        <View style={styles.cardRow}>

          <View style={styles.cardColumn}><Text style={styles.label}>{'Approved Amount'}</Text><Text style={styles.value}>{'₹' + (item.HSTR_ADV_APP_AMT || '0')}</Text></View>

          <View style={styles.cardColumn}><Text style={styles.label}>{'Ref. Intimation'}</Text><Text style={styles.value}>{safeStr(item.HSTR_REF_INTIMATION_ID)}</Text></View>

        </View>

      )}

      {/* ── UPDATED buttonRow: Activity Log + Attachments (added Activity Log) ── */}
      <View style={styles.buttonRow}>

        <TouchableOpacity
          style={[styles.actionButton, styles.activityLogButton]}
          onPress={() => handleActivityLogPress(item.HSTR_REQ_ID)}>
          <MaterialIcons name="history" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>{'Activity Log'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.attachmentButton]} onPress={() => handleAttachmentPress(item.HSTR_REQ_ID)}>

          <MaterialIcons name="attach-file" size={18} color="#fff" />

          <Text style={styles.actionButtonText}>{'Attachments'}</Text>

        </TouchableOpacity>

      </View>

    </TouchableOpacity>

  );

 

  // RENDER

  return (

    <View style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>

      <Spinner visible={loader} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />

 

      {/* Sub-Tab: Intimation Approval / Advance Approval */}

      <View style={styles.headerContainer}>

        <SegmentedControlTab

          borderRadius={0}

          values={['Intimation Approval', 'Advance Approval']}

          selectedIndex={approve}

          onTabPress={index => { handleApprove(index); }}

          tabsContainerStyle={styles.tabsContainerStyle}

          tabStyle={styles.tabStyle}

          tabTextStyle={styles.tabTextStyle}

          activeTabStyle={styles.activeTabStyle}

          activeTabTextStyle={styles.activeTabTextStyle}

        />

      </View>

 

      {(hasData || filtersUsed) &&(

        <View style={styles.filterContainer}>

          <TouchableOpacity

            style={styles.filterToggleButton}

            onPress={() => setShowFilters(!showFilters)}>

            <Ionicons name={showFilters ? 'chevron-up' : 'chevron-down'} size={20} color="#FF6347" />

            <Text Bold style={styles.filterToggleText}>

              {showFilters ? 'Hide Filters' : 'Show Filters'}

            </Text>

          </TouchableOpacity>

          {showFilters && (

            <View style={styles.filterContent}>

              <View style={styles.filterRow}>

                <View style={styles.filterInputContainer}>

                  <Text Bold style={styles.filterLabel}>{'Request ID'}</Text>

                  <TextInput

                    placeholder="Enter Request ID"

                    value={requestIdFilter}

                    keyboardType="numeric"

                    style={styles.filterInput}

                    onChangeText={text => setRequestIdFilter(text)}

                  />

                </View>

                <View style={styles.filterInputContainer}>

                  <Text Bold style={styles.filterLabel}>{'Financial Year'}</Text>

                  <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFinYearModal(true)}>

                    <Text style={styles.dropdownButtonText}>

                      {finYearFilter ? finYearOptions.find(opt => opt.value === finYearFilter)?.label : 'Select Financial Year'}

                    </Text>

                    <Ionicons name="chevron-down" size={20} color="#666" />

                  </TouchableOpacity>

                </View>

              </View>

              <View style={styles.filterButtonContainer}>

                <TouchableOpacity style={[styles.filterButton, styles.searchButton]} onPress={handleSearch}>

                  <Ionicons name="search" size={18} color="#fff" />

                  <Text Bold style={styles.filterButtonText}>{'Search'}</Text>

                </TouchableOpacity>

                <TouchableOpacity style={[styles.filterButton, styles.clearButton]} onPress={handleClearFilters}>

                  <Ionicons name="close-circle" size={18} color="#fff" />

                  <Text Bold style={styles.filterButtonText}>{'Clear'}</Text>

                </TouchableOpacity>

              </View>

            </View>

          )}

        </View>

      )}

 

      <View style={styles.contentContainer}>

        {approve == 0 ? (

          <FlatList

            data={PendingIntimationReq}

            renderItem={renderIntimationCard}

            keyExtractor={(item, index) => `intimation-${item.HSTR_REQ_ID}-${index}`}

            contentContainerStyle={styles.listContainer}

            onRefresh={() => GetPendingIntimationReq(true, requestIdFilter, finYearFilter)}

            refreshing={refresh}

            ListEmptyComponent={

              <View style={styles.emptyContainer}>

                <Ionicons name="document-text-outline" size={60} color="#ccc" />

                <Text style={styles.emptyText}>{'No pending intimations'}</Text>

              </View>

            }

          />

        ) : (

          <FlatList

            data={PendingAdvanceReq}

            renderItem={renderAdvanceCard}

            keyExtractor={(item, index) => `advance-${item.HSTR_REQ_ID}-${index}`}

            contentContainerStyle={styles.listContainer}

            onRefresh={() => GetPendingAdvanceReq(true, requestIdFilter, finYearFilter)}

            refreshing={refresh}

            ListEmptyComponent={

              <View style={styles.emptyContainer}>

                <Ionicons name="document-text-outline" size={60} color="#ccc" />

                <Text style={styles.emptyText}>{'No pending advances'}</Text>

              </View>

            }

          />

        )}

 

        {/* ── Intimation Detail Modal ─────────────────────────────────────────── */}

        <Modal transparent={true} visible={IntimationDetailModal}>

          <View style={styles.centeredView}>

            <View style={styles.modalViewDetail}>

              <View style={styles.modalHeader}>

                <View style={{ flex: 1 }}>

                  <Text Bold style={styles.modalTitle}>{'Intimation Details'}</Text>

                  {modalDataIntimation.HSTR_REQ_STATUS && (

                    <View style={[styles.statusBadge, getStatusColor(modalDataIntimation.HSTR_REQ_STATUS), { marginTop: 5, alignSelf: 'flex-start' }]}>

                      <Text style={styles.statusText}>{modalDataIntimation.HSTR_REQ_STATUS}</Text>

                    </View>

                  )}

                </View>

                <TouchableOpacity onPress={() => { setIntimationDetailModal(false); setActionComment(''); setApprovedAmount(''); setIntimationHospitalData(null); }}>

                  <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />

                </TouchableOpacity>

              </View>

              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Request Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_REQ_ID)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request Creator Name:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_CREATOR_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request Creator ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_CREATOR_ID)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor Name:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_RQSTR_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_RQSTR_ID)}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor Location:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.RQSTR_LOCN_DESC)}</Text></View>


                </View>

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Patient Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Patient:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_PATIENT_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Relation:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_PATIENT_RELATION)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Disease:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_DISEASE_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Emergency:'}</Text><Text style={styles.detailValue}>{modalDataIntimation.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No'}</Text></View>

                </View>

 

                {/* Hospital Information section */}

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Hospital Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Hospital:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_HSPM_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Branch:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_HSPM_BRANCH)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'City:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_HSPM_CITY)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Type:'}</Text><Text style={styles.detailValue}>{getHospitalType(modalDataIntimation.HSTR_HSPM_CATG)}</Text></View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted:'}</Text>

                    <Text style={styles.detailValue}>

                      {modalDataIntimation.HSTR_TAX_EXEMTED_FLAG

                        ? (modalDataIntimation.HSTR_TAX_EXEMTED_FLAG === 'Y' ? 'Yes' : 'No')

                        : '-'}

                    </Text>

                  </View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted From:'}</Text>

                    <Text style={styles.detailValue}>

                      {intimationHospitalData

                        ? formatTaxDate(intimationHospitalData.TAX_CERT_VALID_FROM)

                        : '-'}

                    </Text>

                  </View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted To:'}</Text>

                    <Text style={styles.detailValue}>

                      {intimationHospitalData

                        ? formatTaxDate(intimationHospitalData.TAX_CERT_VALID_TILL)

                        : '-'}

                    </Text>

                  </View>

                </View>

 

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Dates'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Admitted On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_ADMIT_DATE)}</Text></View>

                  {modalDataIntimation.HSTR_DISCHARGE_DATE && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Discharged On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_DISCHARGE_DATE)}</Text></View>)}

                  {modalDataIntimation.HSTR_CREATED_ON && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Created On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataIntimation.HSTR_CREATED_ON)}</Text></View>)}

                </View>

                {modalDataIntimation.HSTR_ADV_REQ_AMT != null && (

                  <View style={styles.detailSection}>

                    <Text Bold style={styles.sectionTitle}>{'Amount Details'}</Text>

                    <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Advance Requested:'}</Text><Text Bold style={[styles.detailValue, { color: '#FF6347' }]}>{'₹' + safeStr(modalDataIntimation.HSTR_ADV_REQ_AMT)}</Text></View>

                    {modalDataIntimation.HSTR_ADV_APP_AMT != null && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Advance Approved:'}</Text><Text Bold style={[styles.detailValue, { color: '#4CAF50' }]}>{'₹' + safeStr(modalDataIntimation.HSTR_ADV_APP_AMT)}</Text></View>)}

                  </View>

                )}

                {commentsIntimation && commentsIntimation.length > 0 && (

                  <View style={styles.detailSection}>

                    <Text Bold style={styles.sectionTitle}>{'Comments'}</Text>

                    {commentsIntimation.map((comment, index) => (

                      <View key={index} style={styles.commentItem}>

                        <View style={styles.commentHeader}>

                          <Text Bold style={styles.commentUser}>{comment.USER_NAME || comment.HSTR_CREATOR_NAME || 'User'}</Text>

                          <Text style={styles.commentDate}>{comment.CREATED_ON || comment.HSTR_CREATED_ON || ''}</Text>

                        </View>

                        <Text style={styles.commentText}>{comment.COMMENTS || comment.HSTR_COMMENTS || '-'}</Text>

                      </View>

                    ))}

                  </View>

                )}

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Action'}</Text>

 

                  {/* ── Approved Amount field for Intimation ── */}

                  {modalDataIntimation.HSTR_ADV_REQ_AMT != null && (

                    <View style={styles.inputContainer}>

                      <View style={{ flexDirection: 'row', marginBottom: 8 }}>

                        <Text Bold style={styles.inputLabel}>{'Approved Amount '}</Text>

                        <Text style={[styles.inputLabel, { color: '#FF6347' }]}>{'*'}</Text>

                      </View>

                      {isSubmittedToFinance(modalDataIntimation.HSTR_REQ_STATUS) ? (

                        // Non-editable display when status is "Submitted to Finance"

                        <View style={[styles.input, styles.inputDisabled]}>

                          <Text style={styles.inputDisabledText}>{approvedAmount || '-'}</Text>

                        </View>

                      ) : (

                      <TextInput
  placeholder="Enter Approved Amount"
  value={approvedAmount}
  keyboardType="numeric"
  style={styles.input}
  onChangeText={text => setApprovedAmount(text.replace(/[^0-9]/g, ''))}
/>

                      )}

                      {isSubmittedToFinance(modalDataIntimation.HSTR_REQ_STATUS) && (

                        <Text style={styles.nonEditableNote}>{'Amount '}</Text>

                      )}

                    </View>

                  )}

 

                  <View style={styles.inputContainer}>

                    <Text Bold style={styles.inputLabel}>{'Comment'}</Text>

                    <TextInput

                      placeholder="Enter Comment (Optional)"

                      value={actionComment}

                      multiline

                      numberOfLines={4}

                      style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}

                      onChangeText={text => setActionComment(text)}

                    />

                  </View>

                </View>

                <View style={styles.actionButtonContainer}>

                  <TouchableOpacity style={[styles.actionButton, styles.sendBackButton]} onPress={() => {

                    if (!actionComment.trim()) { Alert.alert('Error', 'Please enter a comment for send back', [{ text: 'Okay', style: 'cancel' }]); return; }

                    performIntimationAction(modalDataIntimation, 'Send Back', actionComment, approvedAmount);

                  }}>

                    <Ionicons name="arrow-undo" size={20} color="#fff" />

                    <Text Bold style={styles.actionButtonText}>{'Send Back'}</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => { performIntimationAction(modalDataIntimation, 'Approve', actionComment, approvedAmount); }}>

                    <Ionicons name="checkmark-circle" size={20} color="#fff" />

                    <Text Bold style={styles.actionButtonText}>{'Approve'}</Text>

                  </TouchableOpacity>

                </View>

              </ScrollView>

            </View>

          </View>

        </Modal>

 

        {/* ── Advance Detail Modal ────────────────────────────────────────────── */}

        <Modal transparent={true} visible={AdvanceDetailModal}>

          <View style={styles.centeredView}>

            <View style={styles.modalViewDetail}>

              <View style={styles.modalHeader}>

                <View style={{ flex: 1 }}>

                  <Text Bold style={styles.modalTitle}>{'Advance Details'}</Text>

                  {modalDataAdvance.HSTR_REQ_STATUS && (

                    <View style={[styles.statusBadge, getStatusColor(modalDataAdvance.HSTR_REQ_STATUS), { marginTop: 5, alignSelf: 'flex-start' }]}>

                      <Text style={styles.statusText}>{modalDataAdvance.HSTR_REQ_STATUS}</Text>

                    </View>

                  )}

                </View>

                <TouchableOpacity onPress={() => { setAdvanceDetailModal(false); setActionComment(''); setApprovedAmount(''); setAdvanceHospitalData(null); }}>

                  <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />

                </TouchableOpacity>

              </View>

              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Request Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_REQ_ID)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request Creator Name:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_CREATOR_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Request Creator ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_CREATOR_ID)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor Name:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_RQSTR_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor ID:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_RQSTR_ID)}</Text></View>
                   <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Requestor Location:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.RQSTR_LOCN_DESC)}</Text></View>


                  {modalDataAdvance.HSTR_REF_INTIMATION_ID != null && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Ref. Intimation:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_REF_INTIMATION_ID)}</Text></View>)}

                </View>

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Patient Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Patient:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_PATIENT_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Relation:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_PATIENT_RELATION)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Disease:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_DISEASE_NAME)}</Text></View>

                </View>

 

                {/* Hospital Information section */}

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Hospital Information'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Hospital:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_HSPM_NAME)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Branch:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_HSPM_BRANCH)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'City:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_HSPM_CITY)}</Text></View>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Type:'}</Text><Text style={styles.detailValue}>{getHospitalType(modalDataAdvance.HSTR_HSPM_CATG)}</Text></View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted:'}</Text>

                    <Text style={styles.detailValue}>

                      {modalDataAdvance.HSTR_TAX_EXEMTED_FLAG

                        ? (modalDataAdvance.HSTR_TAX_EXEMTED_FLAG === 'Y' ? 'Yes' : 'No')

                        : '-'}

                    </Text>

                  </View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted From:'}</Text>

                    <Text style={styles.detailValue}>

                      {advanceHospitalData

                        ? formatTaxDate(advanceHospitalData.TAX_CERT_VALID_FROM)

                        : '-'}

                    </Text>

                  </View>

                  <View style={styles.detailRow}>

                    <Text style={styles.detailLabel}>{'Tax Exempted To:'}</Text>

                    <Text style={styles.detailValue}>

                      {advanceHospitalData

                        ? formatTaxDate(advanceHospitalData.TAX_CERT_VALID_TILL)

                        : '-'}

                    </Text>

                  </View>

                </View>

 

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Amount Details'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Advance Requested:'}</Text><Text Bold style={[styles.detailValue, { color: '#FF6347' }]}>{'₹' + safeStr(modalDataAdvance.HSTR_ADV_REQ_AMT)}</Text></View>

                  {modalDataAdvance.HSTR_ADV_APP_AMT != null && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Approved Amount:'}</Text><Text Bold style={[styles.detailValue, { color: '#4CAF50' }]}>{'₹' + safeStr(modalDataAdvance.HSTR_ADV_APP_AMT)}</Text></View>)}

                </View>

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Dates'}</Text>

                  <View style={styles.detailRow}><Text style={styles.detailLabel}>{'Admitted On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_ADMIT_DATE)}</Text></View>

                  {modalDataAdvance.HSTR_DISCHARGE_DATE && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Discharged On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_DISCHARGE_DATE)}</Text></View>)}

                  {modalDataAdvance.HSTR_CREATED_ON && (<View style={styles.detailRow}><Text style={styles.detailLabel}>{'Created On:'}</Text><Text style={styles.detailValue}>{safeStr(modalDataAdvance.HSTR_CREATED_ON)}</Text></View>)}

                </View>

                {commentsAdvance && commentsAdvance.length > 0 && (

                  <View style={styles.detailSection}>

                    <Text Bold style={styles.sectionTitle}>{'Comments'}</Text>

                    {commentsAdvance.map((comment, index) => (

                      <View key={index} style={styles.commentItem}>

                        <View style={styles.commentHeader}>

                          <Text Bold style={styles.commentUser}>{comment.USER_NAME || comment.HSTR_CREATOR_NAME || 'User'}</Text>

                          <Text style={styles.commentDate}>{comment.CREATED_ON || comment.HSTR_CREATED_ON || ''}</Text>

                        </View>

                        <Text style={styles.commentText}>{comment.COMMENTS || comment.HSTR_COMMENTS || '-'}</Text>

                      </View>

                    ))}

                  </View>

                )}

                <View style={styles.detailSection}>

                  <Text Bold style={styles.sectionTitle}>{'Action'}</Text>

 

                  {/* ── Approved Amount field for Advance ── */}

                  <View style={styles.inputContainer}>

                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>

                      <Text Bold style={styles.inputLabel}>{'Approved Amount '}</Text>

                      <Text style={[styles.inputLabel, { color: '#FF6347' }]}>{'*'}</Text>

                    </View>

                    {isSubmittedToFinance(modalDataAdvance.HSTR_REQ_STATUS) ? (

                      // Non-editable display when status is "Submitted to Finance"

                      <View style={[styles.input, styles.inputDisabled]}>

                        <Text style={styles.inputDisabledText}>{approvedAmount || '-'}</Text>

                      </View>

                    ) : (

                   <TextInput
  placeholder="Enter Approved Amount"
  value={approvedAmount}
  keyboardType="numeric"
  style={styles.input}
  onChangeText={text => setApprovedAmount(text.replace(/[^0-9]/g, ''))}
/>

                    )}

                    {isSubmittedToFinance(modalDataAdvance.HSTR_REQ_STATUS) && (

                      <Text style={styles.nonEditableNote}>{'Amount'}</Text>

                    )}

                  </View>

 

                  <View style={styles.inputContainer}>

                    <Text Bold style={styles.inputLabel}>{'Comment'}</Text>

                    <TextInput

                      placeholder="Enter Comment (Optional)"

                      value={actionComment}

                      multiline

                      numberOfLines={4}

                      style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}

                      onChangeText={text => setActionComment(text)}

                    />

                  </View>

               </View>

                <View style={styles.actionButtonContainer}>

                  <TouchableOpacity style={[styles.actionButton, styles.sendBackButton]} onPress={() => {

                    if (!actionComment.trim()) { Alert.alert('Error', 'Please enter a comment for send back', [{ text: 'Okay', style: 'cancel' }]); return; }

                    performAdvanceAction(modalDataAdvance, 'Send Back', actionComment, approvedAmount);

                  }}>

                    <Ionicons name="arrow-undo" size={20} color="#fff" />

                    <Text Bold style={styles.actionButtonText}>{'Send Back'}</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => { performAdvanceAction(modalDataAdvance, 'Approve', actionComment, approvedAmount); }}>

                    <Ionicons name="checkmark-circle" size={20} color="#fff" />

                    <Text Bold style={styles.actionButtonText}>{'Approve'}</Text>

                  </TouchableOpacity>

                </View>

              </ScrollView>

            </View>

          </View>

        </Modal>

 

        {/* Financial Year Modal */}

        <Modal transparent={true} visible={showFinYearModal} animationType="fade">

          <View style={styles.centeredView}>

            <View style={styles.modalViewDropdown}>

              <View style={styles.modalHeader}>

                <Text Bold style={styles.modalTitle}>{'Select Financial Year'}</Text>

                <TouchableOpacity onPress={() => setShowFinYearModal(false)}>

                  <Ionicons name="close-circle-outline" size={23} color={GlobalColor.Danger} />

                </TouchableOpacity>

              </View>

              <ScrollView showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={[styles.dropdownItem, finYearFilter === '' && styles.dropdownItemSelected]} onPress={() => { setFinYearFilter(''); setShowFinYearModal(false); }}>

                  <Text style={[styles.dropdownItemText, finYearFilter === '' && styles.dropdownItemTextSelected]}>{'All'}</Text>

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

 

        {/* ── ACTIVITY LOG MODAL (added) ──────────────────────────────────────── */}
        <Modal
          visible={activityLogModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setActivityLogModal(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeaderFull}>
              <View>
                <Text style={styles.modalTitleFull} Bold>{'Activity Log'}</Text>
                <Text style={styles.modalSubtitle}>{'Request ID: ' + selectedRequestId}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActivityLogModal(false)}
                style={styles.closeButton}>
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
                  <Text style={styles.emptyText}>{'No activity log available'}</Text>
                </View>
              }
            />
          </SafeAreaView>
        </Modal>

 

        {/* Attachment Modal */}

        <Modal visible={attachmentModal} animationType="slide" transparent={false} onRequestClose={() => setAttachmentModal(false)}>

          <SafeAreaView style={styles.modalContainer}>

            <View style={styles.modalHeaderFull}>

              <View>

                <Text style={styles.modalTitleFull} Bold>{'Attachments'}</Text>

                <Text style={styles.modalSubtitle}>{'Request ID: ' + selectedRequestId}</Text>

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

                  <Text style={styles.emptyText}>{'No attachments available'}</Text>

                </View>

              }

            />

          </SafeAreaView>

        </Modal>

 

        {/* Unified File Viewer Modal (PDF + Images) */}

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

                onLoadStart={() => console.log('File loading started')}

                onLoadEnd={() => console.log('File loading completed')}

                onError={(syntheticEvent) => {

                  const { nativeEvent } = syntheticEvent;

                  console.log('WebView error:', nativeEvent);

                  Toast.show('Error loading file', Toast.SHORT);

                }}

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

                <Text style={styles.pdfLoadingText}>{'Preparing file...'}</Text>

              </View>

            )}

          </SafeAreaView>

        </Modal>

 

      </View>

    </View>

  );

};

 

export default HospitalApprovalScreens;

 

const styles = StyleSheet.create({

  headerContainer: {

    padding: 15,

    backgroundColor: '#fff',

    marginTop: 10,

    marginBottom: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

  },

  contentContainer: { paddingHorizontal: 10, flex: 1 },

  spinnerTextStyle: { color: '#fff' },

  tabsContainerStyle: { borderRadius: 8, width: '100%' },

  tabStyle: { paddingVertical: 10, borderWidth: 1, borderRadius: 8, borderColor: '#FF6347' },

  tabTextStyle: { fontSize: 13, color: 'grey', fontFamily: 'Roboto-Bold' },

  activeTabStyle: { backgroundColor: '#FF6347' },

  activeTabTextStyle: { color: '#fff' },

  filterContainer: {

    backgroundColor: '#fff',

    marginHorizontal: 10,

    marginBottom: 10,

    borderRadius: 8,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

  },

  filterToggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 8 },

  filterToggleText: { fontSize: 14, color: '#FF6347' },

  filterContent: { padding: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0' },

  filterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },

  filterInputContainer: { flex: 1 },

  filterLabel: { fontSize: 13, color: '#333', marginBottom: 8 },

  filterInput: { borderWidth: 1, borderColor: '#FF6347', borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fff' },

  dropdownButton: { borderWidth: 1, borderColor: '#FF6347', borderRadius: 8, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  dropdownButtonText: { fontSize: 13, color: '#333' },

  modalViewDropdown: { width: '85%', maxHeight: '70%', backgroundColor: GlobalColor.White, padding: 20, borderRadius: 8 },

  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },

  dropdownItemSelected: { backgroundColor: '#FFF5F5' },

  dropdownItemText: { fontSize: 14, color: '#333' },

  dropdownItemTextSelected: { color: '#FF6347', fontWeight: 'bold' },

  filterButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },

  filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, gap: 8 },

  searchButton: { backgroundColor: '#FF6347' },

  clearButton: { backgroundColor: '#9E9E9E' },

  filterButtonText: { color: '#fff', fontSize: 14 },

  listContainer: { padding: 10, paddingBottom: 20 },

  reportCard: {

    backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8,

    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,

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

  // ── UPDATED: flex row to hold Activity Log + Attachments side by side ────────
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },

  // ── UPDATED: flex: 1 so both card buttons split width evenly ─────────────────
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6 },

  attachmentButton: { backgroundColor: '#FF9800' },

  // ── NEW: Activity Log button colour (teal, matching IntimationReport) ─────────
  activityLogButton: { backgroundColor: '#43C6DB' },

  actionButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginLeft: 6 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },

  emptyText: { fontSize: 16, color: '#999', marginTop: 10 },

  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },

  modalView: { position: 'relative', width: '90%', maxHeight: '80%', backgroundColor: GlobalColor.White, padding: 20, borderRadius: 8 },

  modalViewDetail: { position: 'relative', width: '90%', maxHeight: '85%', backgroundColor: GlobalColor.White, padding: 20, borderRadius: 8 },

  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: 15 },

  modalTitle: { fontSize: 16, color: '#333' },

  detailSection: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },

  sectionTitle: { fontSize: 14, color: '#FF6347', marginBottom: 12 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },

  detailLabel: { fontSize: 13, color: '#666', flex: 0.4 },

  detailValue: { fontSize: 13, color: '#333', fontWeight: '500', flex: 0.6, textAlign: 'right' },

  commentItem: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 6, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#FF6347' },

  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  commentUser: { fontSize: 12, color: '#333' },

  commentDate: { fontSize: 11, color: '#999' },

  commentText: { fontSize: 13, color: '#555' },

  actionButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },

  approveButton: { flex: 1, backgroundColor: '#4CAF50' },

  sendBackButton: { flex: 1, backgroundColor: '#FF9800' },

  inputContainer: { marginBottom: 20 },

  inputLabel: { fontSize: 13, color: '#333', marginBottom: 8 },

  input: { borderWidth: 1, borderColor: '#FF6347', borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fff' },

  // Disabled / non-editable approved amount styles

  inputDisabled: {

    backgroundColor: '#F5F5F5',

    borderColor: '#BDBDBD',

    justifyContent: 'center',

    minHeight: 42,

  },

  inputDisabledText: {

    fontSize: 13,

    color: '#757575',

  },

  nonEditableNote: {

    fontSize: 11,

    color: '#9E9E9E',

    marginTop: 4,

    fontStyle: 'italic',

  },

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

  // ── NEW: Activity Log card styles (matching IntimationReport) ─────────────────
  activityLogCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#43C6DB',
  },
  activitySeqNo: { fontSize: 16, color: '#43C6DB' },
  activityStatus: { fontSize: 13, color: '#666', fontWeight: '600' },
  activityLogTable: { width: '100%' },
  actionTaken: { color: '#4CAF50', fontWeight: 'bold' },
  newStatus: { color: '#2196F3', fontWeight: 'bold' },

});