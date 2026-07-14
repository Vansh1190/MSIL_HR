// Advance.js — FULL UPDATED FILE

import React, { useState, useEffect, useContext, useRef } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import TextInput from '../../components/reusable/TextInput';
import AuthContext from '../../context/AuthContext';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ApiService from '../../Utils/Utils';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

const Advance = ({ navigation, route }) => {
  const { authContext, AppUserData } = useContext(AuthContext);

  // Edit mode params from navigation
  const editMode = route?.params?.editMode || false;
  const editData = route?.params?.editData || null;

  // ScrollView ref
  const scrollViewRef = React.useRef(null);

  // Tracks whether the current edit session params have already been loaded.
  const editSessionHandledRef = React.useRef(false);

  // State variables
  const [loader, setLoader] = useState(false);
  const [onBehalf, setOnBehalf] = useState('No');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Intimation ID states
  const [intimationId, setIntimationId] = useState('');
  const [selectedIntimationId, setSelectedIntimationId] = useState('');
  const [pendingIntimations, setPendingIntimations] = useState([]);
  const [intimationModalVisible, setIntimationModalVisible] = useState(false);
  const [intimationDetails, setIntimationDetails] = useState(null);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [admittedOn, setAdmittedOn] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalBranch, setHospitalBranch] = useState('');
  const [hospitalCity, setHospitalCity] = useState('');
  const [emergency, setEmergency] = useState('');
  const [taxExempted, setTaxExempted] = useState('');
  const [hospitalType, setHospitalType] = useState('');
  const [disease, setDisease] = useState('');
  const [searchEmp, setSearchEmp] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  // Employee Modal
  const [empModalVisible, setEmpModalVisible] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  // Logged-in user's complete employee data
  const [loggedInUserEmployeeData, setLoggedInUserEmployeeData] = useState(null);

  // ─── Attachment states ─────────────────────────────────────────────────────
  const [attachments, setAttachments] = useState([]);
  const [deletedServerAttachments, setDeletedServerAttachments] = useState([]);
  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState({
    file: null,
    fileName: '',
    fileDesc: '',
    order: '1',
    base64: ''
  });

  // File viewer states
  const [fileViewerModal, setFileViewerModal] = useState(false);
  const [selectedFileBase64, setSelectedFileBase64] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  // Edit mode specific state
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [editRequestId, setEditRequestId] = useState('');
  const [requestStatus, setRequestStatus] = useState('Draft');

  // Dropdown options
  const onBehalfOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  // ─── ALLOWED: only PDF and PNG; max 2 MB ──────────────────────────────────
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

  // ─── File type helpers ────────────────────────────────────────────────────
  const getFileType = (fileName) => {
    if (!fileName) return 'unknown';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'image';
    return 'unknown';
  };

  const getMimeType = (fileName) => {
    if (!fileName) return 'application/octet-stream';
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeMap = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };
    return mimeMap[ext] || 'application/octet-stream';
  };

  // ─── PDF Viewer HTML ──────────────────────────────────────────────────────
  const getPdfViewerHtml = (base64) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; background-color: #525659; overflow: auto; -webkit-overflow-scrolling: touch; }
          #zoom-container { transform-origin: top left; width: 100%; }
          #pdf-container { display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 10px; width: 100%; }
          canvas { display: block; width: 100% !important; height: auto !important; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
          #loading { color: #fff; font-size: 16px; text-align: center; margin-top: 40vh; font-family: sans-serif; }
          #error { color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 40vh; font-family: sans-serif; padding: 20px; display: none; }
          #page-info { color: #ccc; font-size: 13px; text-align: center; font-family: sans-serif; padding: 5px 0 10px 0; }
        </style>
      </head>
      <body>
        <div id="loading">Loading PDF...</div>
        <div id="error"></div>
        <div id="page-info"></div>
        <div id="zoom-container"><div id="pdf-container"></div></div>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          let currentScale = 1, startDist = 0, startScale = 1;
          const zoomContainer = document.getElementById('zoom-container');
          function getDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
          }
          document.addEventListener('touchstart', function(e) { if (e.touches.length === 2) { e.preventDefault(); startDist = getDistance(e.touches); startScale = currentScale; } }, { passive: false });
          document.addEventListener('touchmove', function(e) { if (e.touches.length === 2) { e.preventDefault(); const dist = getDistance(e.touches); let newScale = startScale * (dist / startDist); newScale = Math.min(Math.max(newScale, 1), 5); currentScale = newScale; zoomContainer.style.transform = 'scale(' + currentScale + ')'; zoomContainer.style.transformOrigin = 'top left'; zoomContainer.style.width = (100 / currentScale) + '%'; } }, { passive: false });
          document.addEventListener('touchend', function(e) { if (e.touches.length < 2) startDist = 0; });
          let lastTap = 0;
          document.addEventListener('touchend', function(e) { const now = Date.now(); if (now - lastTap < 300) { currentScale = 1; zoomContainer.style.transform = 'scale(1)'; zoomContainer.style.width = '100%'; } lastTap = now; });
          try {
            const base64Data = '${base64}';
            const pdfData = atob(base64Data);
            const pdfBytes = new Uint8Array(pdfData.length);
            for (let i = 0; i < pdfData.length; i++) { pdfBytes[i] = pdfData.charCodeAt(i); }
            pdfjsLib.getDocument({ data: pdfBytes }).promise
              .then(function(pdf) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('page-info').textContent = 'Total Pages: ' + pdf.numPages;
                const container = document.getElementById('pdf-container');
                const scale = window.devicePixelRatio || 2;
                const renderPage = (pageNum) => {
                  return pdf.getPage(pageNum).then(function(page) {
                    const baseViewport = page.getViewport({ scale: 1 });
                    const pageScale = window.innerWidth / baseViewport.width;
                    const viewport = page.getViewport({ scale: pageScale * scale });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width; canvas.height = viewport.height;
                    canvas.style.width = '100%'; canvas.style.height = 'auto';
                    container.appendChild(canvas);
                    return page.render({ canvasContext: context, viewport: viewport }).promise;
                  });
                };
                let chain = Promise.resolve();
                for (let i = 1; i <= pdf.numPages; i++) { chain = chain.then(() => renderPage(i)); }
              })
              .catch(function(err) {
                document.getElementById('loading').style.display = 'none';
                const errorDiv = document.getElementById('error'); errorDiv.style.display = 'block'; errorDiv.textContent = 'Error loading PDF: ' + err.message;
              });
          } catch(e) {
            document.getElementById('loading').style.display = 'none';
            const errorDiv = document.getElementById('error'); errorDiv.style.display = 'block'; errorDiv.textContent = 'Error: ' + e.message;
          }
        </script>
      </body>
    </html>
  `;

  // ─── Get CompCode ─────────────────────────────────────────────────────────
  const getCompCode = () => {
    if (onBehalf === 'Yes' && employeeData) {
      return employeeData.EMPL_COMP_CODE || '101';
    } else if (loggedInUserEmployeeData) {
      return loggedInUserEmployeeData.EMPL_COMP_CODE || '101';
    }
    return '101';
  };

  // ─── Get UserName ─────────────────────────────────────────────────────────
  const getUserName = () => {
    if (onBehalf === 'Yes' && employeeData) {
      return employeeData.EMPL_ID?.toString() || '';
    } else if (loggedInUserEmployeeData) {
      return loggedInUserEmployeeData.EMPL_ID?.toString() || '';
    }
    return AppUserData?.data?.userId?.toString() || '';
  };

  // ─── Get Requestor ID ─────────────────────────────────────────────────────
  const getRequestorId = () => {
    if (onBehalf === 'Yes' && selectedEmployeeId) {
      return selectedEmployeeId.toString();
    } else {
      return AppUserData?.data?.userId?.toString() || '';
    }
  };

  // ─── Validate file name ───────────────────────────────────────────────────
  const validateFileName = (fileName) => {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(nameWithoutExt);
  };

  // ─── Validate file extension — only PDF, PNG, JPG, JPEG allowed ──────────────────
  const validateFileExtension = (fileName) => {
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  // ─── GetLOVM API — checks if '7-series' employee IDs are blocked ──────────
  const GetLOVMCutoffFlag = async () => {
    const userId = AppUserData?.data?.userId?.toString() || '';
    const token = AppUserData.token;
    const apiData = {
      SystemName: 'HR-ASSIST',
      ReportName: 'SMG_HOSPITAL',
      LOVName: 'CUTOFF_DATE',
      LOVCode: 'CUTOFF_DATE',
      UserName: userId,
    };

    try {
      const result = await ApiService.PostMethode('/GetLOVM', apiData, token, authContext);
      if (result.Value && result.Value.length > 0) {
        return result.Value[0].LOVM_VALUE_DESC || 'N';
      }
      return 'N';
    } catch (error) {
      console.log('GetLOVM error:', error);
      return 'N'; // default: don't block on API failure
    }
  };

  // ─── pickDocument — only PDF and PNG, max 2 MB ────────────────────────────
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.images, // we narrow by extension after picking
        ],
      });

      const file = result[0];

      let fileName = file.name;
      if (!fileName) {
        const mimeToExt = {
          'image/png': 'image.png',
          'image/jpg': 'image.jpg',
          'image/jpeg': 'image.jpeg',
          'application/pdf': 'document.pdf',
        };
        fileName = mimeToExt[file.type] || 'file.pdf';
      }

      if (!fileName.includes('.')) {
        const mimeToExt = {
          'image/png': '.png',
          'image/jpg': '.jpg',
          'image/jpeg': '.jpeg',
          'application/pdf': '.pdf',
        };
        const ext = mimeToExt[file.type] || '';
        fileName = fileName + ext;
      }

      // ── Extension check: only PDF, PNG, JPG, JPEG ──
      if (!validateFileExtension(fileName)) {
        Alert.alert(
          'Invalid File Type',
          'Only PDF (.pdf), PNG (.png), JPG (.jpg), and JPEG (.jpeg) files are allowed.'
        );
        return;
      }

      // ── File name character check ──
      if (!validateFileName(fileName)) {
        Alert.alert(
          'Invalid File Name',
          'File name should not contain special characters or spaces. Only letters, numbers, hyphens, and underscores are allowed.'
        );
        return;
      }

      // ── Size check: max 2 MB ──
      const fileSize = file.size || 0;
      if (fileSize > MAX_FILE_SIZE_BYTES) {
        Alert.alert(
          'File Too Large',
          'Maximum allowed file size is 2 MB. Please select a smaller file.'
        );
        return;
      }

      const base64 = await RNFS.readFile(file.uri, 'base64');

      // Auto-assign order based on current attachments count
      const autoOrder = (attachments.length + 1).toString();

      setCurrentAttachment({
        file: file,
        fileName: fileName,
        fileDesc: '',
        order: autoOrder,
        base64: base64
      });

      setAttachmentModalVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('Error picking document:', err);
        Toast.show('Error picking document', Toast.SHORT);
      }
    }
  };

  // ─── saveAttachment ───────────────────────────────────────────────────────
  const saveAttachment = () => {
    if (!currentAttachment.fileDesc.trim()) {
      Toast.show('Please enter file description', Toast.SHORT);
      return;
    }

    const newAttachment = {
      ...currentAttachment,
      id: Date.now().toString(),
      isNew: true,
    };

    setAttachments([...attachments, newAttachment]);
    setAttachmentModalVisible(false);
    setCurrentAttachment({ file: null, fileName: '', fileDesc: '', order: '1', base64: '' });
    Toast.show('Attachment added successfully', Toast.SHORT);
  };

  // ─── deleteAttachment ─────────────────────────────────────────────────────
  const deleteAttachment = (id) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const target = attachments.find(att => att.id === id);
            if (target && target.isNew === false) {
              setDeletedServerAttachments(prev => [...prev, target]);
            }
            setAttachments(prev => {
              const updated = prev.filter(att => att.id !== id);
              return updated.map((att, index) => ({ ...att, order: (index + 1).toString() }));
            });
            Toast.show('Attachment deleted', Toast.SHORT);
          },
        },
      ]
    );
  };

  // ─── fetchAttachmentsForEdit ──────────────────────────────────────────────
  const fetchAttachmentsForEdit = async (requestId, status) => {
    if (!requestId) return;
    const compCode = '101';
    let apiData = {
      AppName: 'HOSPITAL',
      CompCode: compCode,
      RequestID: requestId.toString(),
    };
    let token = AppUserData.token;
    setLoader(true);
    try {
      const result = await ApiService.PostMethode('/GetHospitalAttachment', apiData, token, authContext);
      if (result.Value && Array.isArray(result.Value) && result.Value.length > 0) {
        // ─── FIX: For send-back requests, mark attachments as new so they get re-uploaded
        const isSendBack = status && (
          status.toUpperCase().includes('BACK TO INITIATOR') ||
          status.toUpperCase().includes('SEND BACK') ||
          status.toUpperCase().includes('SENDBACK')
        );

        const fetchedAttachments = result.Value.map((att, index) => ({
          id: `fetched_${att.WFAT_REQUEST_ID}_${index}_${Date.now()}`,
          fileName: att.WFAT_FILE_NAME || '',
          fileDesc: att.WFAT_FILE_DESC || '',
          order: att.WFAT_ORDER_NO?.toString() || (index + 1).toString(),
          base64: att.WFAT_ATTACHMENT || '',
          file: null,
          isNew: isSendBack, // Mark as new if send-back to trigger re-upload
          serverData: att,
        }));
        setAttachments(fetchedAttachments);
      } else {
        setAttachments([]);
      }
    } catch (error) {
      console.log('Error fetching attachments for edit:', error);
      setAttachments([]);
    } finally {
      setLoader(false);
    }
  };

  // ─── uploadAttachments ────────────────────────────────────────────────────
  // FIX: Accept attachments and deletedServerAttachments as parameters to avoid
  // stale closure issues where state hasn't updated yet at call time.
 const uploadAttachments = async (requestId, currentAttachments, currentDeletedAttachments) => {
  const allAttachments = currentAttachments ?? attachments;
  const toDelete = currentDeletedAttachments ?? deletedServerAttachments;

  const hasWork = allAttachments.length > 0 || toDelete.length > 0;
  if (!hasWork) return true;

  // Only upload NEW attachments — skip server files to avoid duplicates on retry
  const filesToUpload = allAttachments.filter(att => att.isNew === true);

  console.log(
    `uploadAttachments — total: ${allAttachments.length}, toUpload: ${filesToUpload.length}, toDelete: ${toDelete.length}`
  );

  const failedUploads = [];

  // Sequential — one file at a time, no Promise.all
  for (const attachment of filesToUpload) {
    try {
      const apiData = {
        AppName: 'HOSPITAL',
        CompCode: getCompCode(),
        RequestID: requestId,
        ReferenceNo: '',
        FileName: attachment.fileName,
        FileDesc: attachment.fileDesc,
        Attachment: attachment.base64,
        Order: attachment.order,
        DeleteFlag: '',
        UserName: getUserName(),
      };
      console.log('Uploading:', attachment.fileName);
      const result = await ApiService.PostMethode(
        '/HospitalAttachment', apiData, AppUserData.token, authContext
      );
      const responseValue = (result?.Value || '').toString().trim().toUpperCase();
      if (responseValue.includes('SUCCESS')) {
        console.log('Upload OK:', attachment.fileName);
      } else {
        console.warn('Non-success response for:', attachment.fileName, '| Response:', result?.Value);
        failedUploads.push(attachment.fileName);
      }
    } catch (uploadError) {
      console.warn('Upload error for:', attachment.fileName, uploadError);
      failedUploads.push(attachment.fileName);
    }
  }

  // Delete sequentially — non-fatal
  for (const attachment of toDelete) {
    try {
      const serverAtt = attachment.serverData || {};
      const apiData = {
        AppName: 'HOSPITAL',
        CompCode: getCompCode(),
        RequestID: requestId,
        ReferenceNo: serverAtt.WFAT_REFERENCE_NO || '',
        FileName: attachment.fileName,
        FileDesc: attachment.fileDesc,
        Attachment: attachment.base64 || '',
        Order: attachment.order,
        DeleteFlag: 'Y',
        UserName: getUserName(),
      };
      console.log('Deleting:', attachment.fileName);
      await ApiService.PostMethode(
        '/HospitalAttachment', apiData, AppUserData.token, authContext
      );
      console.log('Deleted OK:', attachment.fileName);
    } catch (deleteError) {
      console.warn('Delete error (non-fatal):', attachment.fileName, deleteError);
    }
  }

  if (failedUploads.length > 0) {
    const err = new Error(
      `The following file(s) could not be uploaded:\n${failedUploads.join('\n')}\n\nYour advance was saved. Please pull-back the request and re-upload the failed file(s).`
    );
    err.isAttachmentError = true;
    throw err;
  }

  return true;
};
  // ─── GetPendingIntimations ────────────────────────────────────────────────
  const GetPendingIntimations = () => {
    const requestorId = getRequestorId();

    if (!requestorId) {
      Toast.show('Invalid requestor ID', Toast.SHORT);
      return;
    }

    let token = AppUserData.token;
    let apiData = {
      AppName: 'Advance',
      RequestorID: requestorId
    };

    setLoader(true);

    const loaderTimeout = setTimeout(() => {
      setLoader(false);
      Toast.show('Request timeout. Please try again.', Toast.LONG);
    }, 15000);

    ApiService.PostMethode('/GetPendingIntim', apiData, token, authContext)
      .then(result => {
        clearTimeout(loaderTimeout);
        setLoader(false);

        if (result.Value && result.Value.length > 0) {
          setPendingIntimations(result.Value);
          setIntimationModalVisible(true);
        } else {
          Alert.alert(
            'No Data Found',
            'No pending intimation ID found for the selected employee.',
            [{ text: 'OK' }]
          );
          setPendingIntimations([]);
        }
      })
      .catch(error => {
        clearTimeout(loaderTimeout);
        setLoader(false);
        Alert.alert(
          'Error',
          'Error fetching pending intimations. Please try again.',
          [{ text: 'OK' }]
        );
      })
      .finally(() => {
        clearTimeout(loaderTimeout);
        setLoader(false);
      });
  };

  // ─── GetIntimationDetails ─────────────────────────────────────────────────
  const GetIntimationDetails = (reqId) => {
    let token = AppUserData.token;
    let apiData = {
      AppName: 'HOSP INTIM',
      UserName: AppUserData?.data?.userId?.toString() || '',
      RequestType: 'REQUEST',
      RequestID: reqId.toString(),
      FinYear: ''
    };

    const loaderTimeout = setTimeout(() => {
      setLoader(false);
      Toast.show('Request timeout. Please try again.', Toast.LONG);
    }, 15000);

    ApiService.PostMethode('/GetHospGenReport', apiData, token, authContext)
      .then(result => {
        clearTimeout(loaderTimeout);
        setLoader(false);

        if (result.Value && result.Value.length > 0) {
          const details = result.Value[0];
          setIntimationDetails(details);

          setEmergency(details.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No');
          setPatientName(details.HSTR_PATIENT_NAME || '');
          setMobileNo(details.HSTR_RQSTR_CONTACT || '');
          setPatientRelation(details.HSTR_PATIENT_RELATION || '');
          setAdmittedOn(details.HSTR_ADMIT_DATE || '');
          setDisease(details.HSTR_DISEASE_NAME || '');
          setHospitalName(details.HSTR_HSPM_NAME || '');
          setHospitalBranch(details.HSTR_HSPM_BRANCH || '');
          setHospitalCity(details.HSTR_HSPM_CITY || '');
          setTaxExempted(details.HSTR_TAX_EXEMTED_FLAG === 'Y' ? 'Yes' : 'No');

          if (details.HSTR_HSPM_CATG === 'P') {
            setHospitalType('Panel');
          } else if (details.HSTR_HSPM_CATG === 'N') {
            setHospitalType('Non Panel');
          } else if (details.HSTR_HSPM_CATG === 'R') {
            setHospitalType('Referal');
          }

          setSelectedIntimationId(reqId.toString());
          setIntimationId(reqId.toString());

          Toast.show('Intimation details loaded successfully', Toast.SHORT);
        } else {
          Toast.show('No intimation details found', Toast.SHORT);
        }
      })
      .catch(error => {
        clearTimeout(loaderTimeout);
        setLoader(false);
        Toast.show('Error fetching intimation details', Toast.SHORT);
      })
      .finally(() => {
        clearTimeout(loaderTimeout);
        setLoader(false);
      });
  };

  // ─── handleSelectIntimation ───────────────────────────────────────────────
  const handleSelectIntimation = (intimation) => {
    GetIntimationDetails(intimation.HSTR_REQ_ID);
    setIntimationModalVisible(false);
  };

  // ─── populateEditData ─────────────────────────────────────────────────────
  const populateEditData = async (data) => {
    if (!data) return;

    setDeletedServerAttachments([]);

    setEditRequestId(data.HSTR_REQ_ID?.toString() || '');
    setRequestStatus(data.HSTR_REQ_STATUS || 'Draft');
    setPatientName(data.HSTR_PATIENT_NAME || '');
    setPatientRelation(data.HSTR_PATIENT_RELATION || '');
    setMobileNo(data.HSTR_RQSTR_CONTACT || '');
    setEmergency(data.HSTR_EMER_FLAG === 'Y' ? 'Yes' : 'No');
    setDisease(data.HSTR_DISEASE_NAME || '');
    setHospitalName(data.HSTR_HSPM_NAME || '');
    setHospitalBranch(data.HSTR_HSPM_BRANCH || '');
    setHospitalCity(data.HSTR_HSPM_CITY || '');
    setTaxExempted(data.HSTR_TAX_EXEMTED_FLAG === 'Y' ? 'Yes' : 'No');
    setAdmittedOn(data.HSTR_ADMIT_DATE || '');

    if (data.HSTR_HSPM_CATG === 'P') {
      setHospitalType('Panel');
    } else if (data.HSTR_HSPM_CATG === 'N') {
      setHospitalType('Non Panel');
    } else if (data.HSTR_HSPM_CATG === 'R') {
      setHospitalType('Referal');
    }

    if (data.HSTR_ADV_REQ_AMT) {
      setAdvanceAmount(data.HSTR_ADV_REQ_AMT.toString());
    }

    // ─── FIX: Handle intimation ID - primary field is HSTR_REF_INTIMATION_ID ───
    const intimationRefId = data.HSTR_REF_INTIMATION_ID || data.HSTR_REF_INTIM_ID || '';

    console.log('Advance Edit Mode - Intimation ID:', {
      HSTR_REF_INTIMATION_ID: data.HSTR_REF_INTIMATION_ID,
      HSTR_REF_INTIM_ID: data.HSTR_REF_INTIM_ID,
      resolved: intimationRefId
    });

    if (intimationRefId) {
      setIntimationId(intimationRefId.toString());
      setSelectedIntimationId(intimationRefId.toString());
    } else {
      console.warn('No intimation ID found in edit data. Available fields:', Object.keys(data));
    }

    setIntimationDetails({
      HSTR_PATIENT_CODE: data.HSTR_PATIENT_CODE || '',
      HSTR_DISEASE_ID: data.HSTR_DISEASE_ID || '',
      HSTR_HSPM_ID: data.HSTR_HSPM_ID || '',
      HSTR_HSPM_CATG: data.HSTR_HSPM_CATG || '',
      HSTR_RQSTR_CONTACT: data.HSTR_RQSTR_CONTACT || '',
    });

    const rqstrId = data.HSTR_RQSTR_ID?.toString() || '';
    const creatorId = data.HSTR_CREATOR_ID?.toString() || '';
    if (rqstrId && creatorId && rqstrId !== creatorId) {
      setOnBehalf('Yes');
      if (data.HSTR_RQSTR_NAME) {
        setSelectedEmployee(data.HSTR_RQSTR_NAME);
        setSelectedEmployeeId(rqstrId);
      }
    } else {
      setOnBehalf('No');
      setSelectedEmployee('');
      setSelectedEmployeeId('');
    }

    if (data.HSTR_REQ_ID) {
      await fetchAttachmentsForEdit(data.HSTR_REQ_ID, data.HSTR_REQ_STATUS);
    }
  };

  // ─── resetToInitialState ──────────────────────────────────────────────────
  const resetToInitialState = () => {
    navigation.setParams({ editMode: false, editData: null });
    editSessionHandledRef.current = false;
    setIsEditMode(false);
    setEditRequestId('');
    setRequestStatus('Draft');
    setOnBehalf('No');
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setIntimationId('');
    setSelectedIntimationId('');
    setPatientName('');
    setPatientRelation('');
    setAdmittedOn('');
    setHospitalName('');
    setHospitalBranch('');
    setHospitalCity('');
    setEmergency('');
    setTaxExempted('');
    setHospitalType('');
    setDisease('');
    setSearchEmp('');
    setFormErrors({});
    setAdvanceAmount('');
    setEmployeeData(null);
    setIntimationDetails(null);
    setPendingIntimations([]);
    setAttachments([]);
    setDeletedServerAttachments([]);

    const mobile = loggedInUserEmployeeData?.EMPL_MOBILE_NO
      || AppUserData?.data?.officialPhone
      || AppUserData?.data?.personalPhone
      || '';
    setMobileNo(mobile);
  };

  const clearForm = () => {
    resetToInitialState();
    Toast.show('Form cleared successfully', Toast.SHORT);
  };

  // ─── validate ─────────────────────────────────────────────────────────────
  // FIX: Returns the errors object directly instead of relying on formErrors state,
  // which may not have updated yet (async setState) when handleSubmit reads it.
  const validate = (currentAttachments) => {
    const errors = {};
    let isValid = true;

    if (onBehalf === 'Yes' && !selectedEmployee.trim()) {
      errors.selectedEmployee = 'Please select an employee.';
      isValid = false;
    }

    if (!intimationId.trim()) {
      errors.intimationId = 'Please select an intimation ID.';
      isValid = false;
    }

    if (!advanceAmount.trim()) {
      errors.advanceAmount = 'Advance amount is required.';
      isValid = false;
    } else if (isNaN(advanceAmount) || parseFloat(advanceAmount) <= 0) {
      errors.advanceAmount = 'Please enter a valid amount.';
      isValid = false;
    }

    if (!mobileNo.trim()) {
      errors.mobileNo = 'Mobile number is required.';
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileNo.trim())) {
      errors.mobileNo = 'Mobile number must be exactly 10 digits.';
      isValid = false;
    }

    // FIX: Use the passed-in currentAttachments snapshot, not the state variable,
    // to avoid any timing/closure mismatch.
    if (advanceAmount.trim() && currentAttachments.length === 0) {
      errors.attachments = 'Please upload at least one attachment when requesting advance.';
      isValid = false;
    }

    setFormErrors(errors);
    // FIX: Return both isValid flag AND the errors object so handleSubmit
    // can use the fresh errors without waiting for state to re-render.
    return { isValid, errors };
  };

  // ─── getEmployeeDetails ───────────────────────────────────────────────────
  const getEmployeeDetails = () => {
    if (onBehalf === 'Yes' && employeeData) {
      return {
        employeeId: employeeData.EMPL_ID || '',
        employeeName: employeeData.EMPL_NAME || '',
        employeeLocn: employeeData.EMPL_LOCN_CODE || '',
        employeeDesg: employeeData.EMPL_DESG_CODE || '',
        employeeDept: employeeData.EMPL_DEPT_CODE || '',
        employeeDivn: employeeData.EMPL_DIVN_CODE || '',
        employeeDirc: employeeData.EMPL_DIRC_CODE || '',
        employeeNTID: employeeData.EMPL_NT_USER || employeeData.EMPL_ID || '',
        employeeDOB: employeeData.EMPL_BIRTH_DATE || '',
        employeeDOJ: employeeData.EMPL_JOIN_DATE || '',
      };
    } else {
      if (loggedInUserEmployeeData) {
        return {
          employeeId: loggedInUserEmployeeData.EMPL_ID || '',
          employeeName: loggedInUserEmployeeData.EMPL_NAME || '',
          employeeLocn: loggedInUserEmployeeData.EMPL_LOCN_CODE || '',
          employeeDesg: loggedInUserEmployeeData.EMPL_DESG_CODE || '',
          employeeDept: loggedInUserEmployeeData.EMPL_DEPT_CODE || '',
          employeeDivn: loggedInUserEmployeeData.EMPL_DIVN_CODE || '',
          employeeDirc: loggedInUserEmployeeData.EMPL_DIRC_CODE || '',
          employeeNTID: loggedInUserEmployeeData.EMPL_NT_USER || loggedInUserEmployeeData.EMPL_ID || '',
          employeeDOB: loggedInUserEmployeeData.EMPL_BIRTH_DATE || '',
          employeeDOJ: loggedInUserEmployeeData.EMPL_JOIN_DATE || '',
        };
      } else {
        return {
          employeeId: AppUserData?.data?.userId || '',
          employeeName: AppUserData?.data?.userName || '',
          employeeLocn: AppUserData?.data?.locationCode || '',
          employeeDesg: AppUserData?.data?.designationCode || '',
          employeeDept: AppUserData?.data?.departmentCode || '',
          employeeDivn: AppUserData?.data?.divisionCode || '',
          employeeDirc: AppUserData?.data?.directorateCode || '',
          employeeNTID: AppUserData?.data?.userNT || AppUserData?.data?.userId || '',
          employeeDOB: AppUserData?.data?.dateOfBirth || '',
          employeeDOJ: AppUserData?.data?.dateOfJoining || '',
        };
      }
    }
  };

  // ─── submitHospitalAction ─────────────────────────────────────────────────
  const submitHospitalAction = () => {
    return new Promise((resolve, reject) => {
      const employeeDetails = getEmployeeDetails();

      const requestorId = isEditMode
        ? (editData?.HSTR_RQSTR_ID?.toString() || employeeDetails.employeeId.toString())
        : employeeDetails.employeeId.toString();

      const requestorNTID = isEditMode
        ? (editData?.HSTR_RQSTR_NTID?.toString() || employeeDetails.employeeNTID)
        : employeeDetails.employeeNTID;

      const hospitalActionData = {
        RequestID: isEditMode ? editRequestId : '',
        AppName: 'HOSP ADV',
        CompCode: getCompCode(),
        RequestStatus: isEditMode ? requestStatus : 'Draft',
        Action: 'Submit',
        RequestorID: requestorId,
        RequestorName: isEditMode ? (editData?.HSTR_RQSTR_NAME || employeeDetails.employeeName) : employeeDetails.employeeName,
        RequestorLocn: isEditMode ? (editData?.HSTR_RQSTR_LOCN || employeeDetails.employeeLocn) : employeeDetails.employeeLocn,
        RequestorDesg: isEditMode ? (editData?.HSTR_RQSTR_DESG || employeeDetails.employeeDesg) : employeeDetails.employeeDesg,
        RequestorDept: isEditMode ? (editData?.HSTR_RQSTR_DEPT || employeeDetails.employeeDept) : employeeDetails.employeeDept,
        RequestorDivn: isEditMode ? (editData?.HSTR_RQSTR_DIVN || employeeDetails.employeeDivn) : employeeDetails.employeeDivn,
        RequestorDirc: isEditMode ? (editData?.HSTR_RQSTR_DIRC || employeeDetails.employeeDirc) : employeeDetails.employeeDirc,
        RequestorNTID: requestorNTID,
        RequestorPhone: mobileNo,
        PatientCode: intimationDetails?.HSTR_PATIENT_CODE?.toString() || '',
        PatientName: patientName,
        PatientRelation: patientRelation,
        DiseaseID: intimationDetails?.HSTR_DISEASE_ID?.toString() || '',
        DiseaseName: disease,
        EmergencyFlag: emergency === 'Yes' ? 'Y' : 'N',
        HospitalID: intimationDetails?.HSTR_HSPM_ID?.toString() || '',
        HospitalName: hospitalName,
        HospitalBranch: hospitalBranch,
        HospitalCity: hospitalCity,
        HospitalCatg: intimationDetails?.HSTR_HSPM_CATG || '',
        TaxExmpFlag: taxExempted === 'Yes' ? 'Y' : 'N',
        AdmitDate: admittedOn ? moment(admittedOn, 'DD-MMM-YYYY HH:mm').format('DD-MMM-YYYY HH:mm:ss') : '',
        DischargeDate: '',
        AdvanceReqAmount: advanceAmount || '',
        AdvanceAppAmount: '',
        CreatorName: AppUserData?.data?.emplusername || '',
        CreatorID: AppUserData?.data?.userId?.toString() || '',
        CMOAPPHospAmt: '',
        FinAPPHospAmt: '',
        HospAmount: '',
        TotalAmount: '',
        RefIntimID: selectedIntimationId,
        RequestorAmount: '',
        CMOAPPReqAmt: '',
        FinAPPReqAAmt: '',
        RequestorDOB: isEditMode
          ? (editData?.HSTR_RQSTR_DOB ? moment(editData.HSTR_RQSTR_DOB).format('DD-MMM-YYYY') : '')
          : (employeeDetails.employeeDOB ? moment(employeeDetails.employeeDOB).format('DD-MMM-YYYY') : ''),
        RequestorDOJ: isEditMode
          ? (editData?.HSTR_RQSTR_DOJ ? moment(editData.HSTR_RQSTR_DOJ).format('DD-MMM-YYYY') : '')
          : (employeeDetails.employeeDOJ ? moment(employeeDetails.employeeDOJ).format('DD-MMM-YYYY') : ''),
        BillDetails: '',
        RefundAmount: '',
        UTRNumber: '',
        Documents: '',
        UserName: AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '',
        Comments: '',
        Attachment: '',
        CreatorNTID: AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '',
      };

      console.log('HospitalAction (Advance) payload:', hospitalActionData);

      ApiService.PostMethode('/HospitalAction', hospitalActionData, AppUserData.token, authContext)
        .then(result => {
          if (result.Value && result.Value.includes('SUCCESS')) {
            const requestId = result.Value.split(':')[1]?.trim().replace(':', '');
            resolve(requestId);
          } else {
            reject('Failed to submit advance');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // ─── handleSubmit ─────────────────────────────────────────────────────────
  // FIX: Capture a snapshot of attachments and deletedServerAttachments at the
  // moment Submit is pressed. This prevents stale-closure bugs where the async
  // flow reads an outdated state value after React batches state updates.
  const handleSubmit = async () => {
  const attachmentsSnapshot = [...attachments];
  const deletedAttachmentsSnapshot = [...deletedServerAttachments];

  const { isValid, errors } = validate(attachmentsSnapshot);

  if (!isValid) {
    const firstError = Object.values(errors)[0];
    Toast.show(firstError || 'Please fill all required fields', Toast.LONG);
    return;
  }

  setLoader(true);

  try {
    const requestId = await submitHospitalAction();

    const hasNewAttachments = attachmentsSnapshot.length > 0;
    const hasDeletedAttachments = deletedAttachmentsSnapshot.length > 0;
    const shouldUpload = hasNewAttachments || hasDeletedAttachments;

    if (shouldUpload) {
      await uploadAttachments(requestId, attachmentsSnapshot, deletedAttachmentsSnapshot);
    }

    setLoader(false);

    Alert.alert(
      'Success',
      `Advance ${isEditMode ? 'updated' : 'submitted'} successfully with Request ID: ${requestId}`,
      [{ text: 'OK', onPress: () => { resetToInitialState(); } }]
    );
  } catch (error) {
    setLoader(false);
    if (error.isAttachmentError) {
      // Advance was saved — only file upload partially failed
      Alert.alert(
        'Partially Submitted',
        error.message,
        [{ text: 'OK', onPress: () => { resetToInitialState(); } }]
      );
    } else {
      Toast.show(error.message || 'Error submitting advance', Toast.LONG);
    }
  }
};

  // ─── GetLoggedInEmployeeData ──────────────────────────────────────────────
  const GetLoggedInEmployeeData = () => {
    if (!AppUserData?.data?.userId) return;

    let token = AppUserData.token;
    let apiData = {
      AppName: 'HR-ASSIST',
      UserName: AppUserData.data.userId.toString()
    };

    setLoader(true);

    const loaderTimeout = setTimeout(() => {
      setLoader(false);
    }, 15000);

    ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
      .then(result => {
        clearTimeout(loaderTimeout);
        setLoader(false);

        if (result.Value && result.Value.length > 0) {
          let responseData = result.Value[0];
          setLoggedInUserEmployeeData(responseData);

          const employeeMobile = responseData.EMPL_MOBILE_NO || '';
          if (employeeMobile && !editMode) {
            setMobileNo(employeeMobile);
          }
        }
      })
      .catch(error => {
        clearTimeout(loaderTimeout);
        setLoader(false);
      })
      .finally(() => {
        clearTimeout(loaderTimeout);
        setLoader(false);
      });
  };

  // ─── SearchEmployee — with GetLOVM gate for 7-series IDs ─────────────────
  const SearchEmployee = async () => {
    if (!searchEmp.trim()) {
      Toast.show('Please enter a valid staff ID', Toast.LONG);
      return;
    }

    setLoader(true);

    try {
      // Step 1: check LOVM cutoff flag
      const cutoffFlag = await GetLOVMCutoffFlag();

      // Step 2: if flag is 'Y' and employee ID starts with '7' → block
      if (cutoffFlag === 'Y' && searchEmp.trim().startsWith('7')) {
        setLoader(false);
        Toast.show('Employee not found', Toast.LONG);
        setSelectedEmployee('');
        setSelectedEmployeeId('');
        return;
      }

      // Step 3: proceed with normal employee search
      let token = AppUserData.token;
      let apiData = { AppName: 'HR-ASSIST', UserName: searchEmp };

      const loaderTimeout = setTimeout(() => {
        setLoader(false);
        Toast.show('Request timeout. Please try again.', Toast.LONG);
      }, 15000);

      ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
        .then(result => {
          clearTimeout(loaderTimeout);
          setLoader(false);

          if (result.Value && result.Value.length > 0) {
            let responseData = result.Value[0];
            setEmployeeData(responseData);
            setEmpModalVisible(true);
          } else {
            Toast.show('Employee not found', Toast.LONG);
            setSelectedEmployee('');
            setSelectedEmployeeId('');
          }
        })
        .catch(error => {
          clearTimeout(loaderTimeout);
          setLoader(false);
          Toast.show('Error searching employee', Toast.LONG);
        });
    } catch (error) {
      setLoader(false);
      Toast.show('Error searching employee', Toast.LONG);
    }
  };

  // ─── handleSelectEmployee ─────────────────────────────────────────────────
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee.EMPL_NAME || '');
    setSelectedEmployeeId(employee.EMPL_ID || '');
    setEmpModalVisible(false);

    const employeeMobile = employee.EMPL_MOBILE_NO || '';
    if (employeeMobile) {
      setMobileNo(employeeMobile);
    }

    setIntimationId('');
    setSelectedIntimationId('');
    setIntimationDetails(null);
    clearFormFieldsExceptEmployee();
  };

  const clearFormFieldsExceptEmployee = () => {
    setPatientName('');
    setPatientRelation('');
    setAdmittedOn('');
    setHospitalName('');
    setHospitalBranch('');
    setHospitalCity('');
    setEmergency('');
    setTaxExempted('');
    setHospitalType('');
    setDisease('');
    setAdvanceAmount('');
    setAttachments([]);
    setDeletedServerAttachments([]);
  };

  // ─── openFileViewer ───────────────────────────────────────────────────────
  const openFileViewer = (base64Data, fileName) => {
    try {
      if (!base64Data) { Toast.show('File data not available', Toast.SHORT); return; }
      const cleanBase64 = base64Data.replace(/[\r\n\s]+/g, '').trim();
      const fileType = getFileType(fileName);
      setSelectedFileBase64(cleanBase64);
      setSelectedFileName(fileName);
      setSelectedFileType(fileType);
      setFileViewerModal(true);
    } catch (error) {
      Toast.show('Error opening file', Toast.SHORT);
    }
  };

  const closeFileViewer = () => {
    setFileViewerModal(false);
    setSelectedFileBase64('');
    setSelectedFileName('');
    setSelectedFileType('');
  };

  // ─── renderFileViewerContent — only PDF and PNG ───────────────────────────
  const renderFileViewerContent = () => {
    if (!selectedFileBase64) {
      return (
        <View style={styles.fileLoadingContainer}>
          <ActivityIndicator size="large" color="#43C6DB" />
          <Text style={styles.fileLoadingText}>Preparing file...</Text>
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
          onError={() => Toast.show('Error loading PDF', Toast.SHORT)}
          renderLoading={() => (
            <View style={styles.fileLoadingContainer}>
              <ActivityIndicator size="large" color="#43C6DB" />
              <Text style={styles.fileLoadingText}>Loading PDF...</Text>
            </View>
          )}
        />
      );
    }
    if (selectedFileType === 'image') {
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
    return (
      <View style={styles.fileLoadingContainer}>
        <MaterialIcons name="insert-drive-file" size={60} color="#ccc" />
        <Text style={styles.fileLoadingText}>Unsupported file type</Text>
      </View>
    );
  };

  // ─── renderAttachmentRow ──────────────────────────────────────────────────
  const renderAttachmentRow = (attachment) => {
    const fileType = getFileType(attachment.fileName);
    const viewBase64 = attachment.base64 || '';

    const getFileIcon = () => {
      if (fileType === 'pdf') return <MaterialIcons name="picture-as-pdf" size={20} color="#E53935" />;
      if (fileType === 'image') return <MaterialIcons name="image" size={20} color="#43A047" />;
      return <MaterialIcons name="attach-file" size={20} color={'#43C6DB'} />;
    };

    return (
      <View key={attachment.id} style={styles.attachmentItem}>
        <View style={styles.attachmentInfo}>
          {getFileIcon()}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.attachmentFileName}>{attachment.fileName}</Text>
            <Text style={styles.attachmentFileDesc}>{attachment.fileDesc}</Text>
            <Text style={styles.attachmentOrder}>Order: {attachment.order}</Text>
          </View>
        </View>
        <View style={styles.attachmentActions}>
          {viewBase64 ? (
            <TouchableOpacity
              style={styles.viewAttachmentButton}
              onPress={() => openFileViewer(viewBase64, attachment.fileName)}
            >
              <Ionicons name="eye-outline" size={22} color={'#43C6DB'} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.deleteAttachmentButton}
            onPress={() => deleteAttachment(attachment.id)}
          >
            <Ionicons name="trash-outline" size={22} color={'#FF3B30'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode) return;
    if (onBehalf === 'No') {
      setSelectedEmployee('');
      setSelectedEmployeeId('');
      setSearchEmp('');
      setEmployeeData(null);

      const mobile = loggedInUserEmployeeData?.EMPL_MOBILE_NO
        || AppUserData?.data?.officialPhone
        || AppUserData?.data?.personalPhone
        || '';
      setMobileNo(mobile);

      setIntimationId('');
      setSelectedIntimationId('');
      setIntimationDetails(null);
      clearFormFieldsExceptEmployee();
    } else {
      setIntimationId('');
      setSelectedIntimationId('');
      setIntimationDetails(null);
      clearFormFieldsExceptEmployee();
    }
  }, [onBehalf]);

  useEffect(() => {
    GetLoggedInEmployeeData();

    if (editMode && editData) {
      editSessionHandledRef.current = true;
      setIsEditMode(true);
      populateEditData(editData);
    } else {
      setIsEditMode(false);
      const mobile = AppUserData?.data?.officialPhone || AppUserData?.data?.personalPhone || '';
      setMobileNo(mobile);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentEditMode = route?.params?.editMode || false;
      const currentEditData = route?.params?.editData || null;

      if (currentEditMode && currentEditData) {
        if (!editSessionHandledRef.current) {
          editSessionHandledRef.current = true;
          setIsEditMode(true);
          populateEditData(currentEditData);
        }
      } else {
        if (editSessionHandledRef.current) {
          resetToInitialState();
        }
      }
    });

    return unsubscribe;
  }, [navigation, route?.params]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {loader && (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* ── Request Details Section ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle} Bold>Request Details</Text>

              {/* Request ID and Status */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Request ID</Text>
                  <Text style={styles.valueText}>
                    {isEditMode && editRequestId ? editRequestId : 'Not Generated'}
                  </Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Status</Text>
                  <Text style={styles.valueText}>{requestStatus}</Text>
                </View>
              </View>

              {/* On Behalf and Mobile No */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>
                    On Behalf <Text style={styles.required}>*</Text>
                  </Text>
                  {isEditMode ? (
                    <TextInput
                      value={onBehalf}
                      editable={false}
                      style={styles.disabledInput}
                    />
                  ) : (
                    <SelectDropdown
                      key={`onbehalf-${onBehalf}-${isEditMode}`}
                      buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                      defaultButtonText={onBehalf}
                      rowTextForSelection={(item) => item.label}
                      data={onBehalfOptions}
                      onSelect={(selectedItem) => setOnBehalf(selectedItem.value)}
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
                  )}
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>
                    Mobile No. <Text style={styles.required}>*</Text>
                  </Text>
                  <View>
                    <TextInput
                      value={mobileNo}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        if (numericText.length <= 10) {
                          setMobileNo(numericText);
                          if (formErrors.mobileNo && numericText.length === 10) {
                            setFormErrors(prev => ({ ...prev, mobileNo: '' }));
                          }
                        }
                      }}
                      editable={true}
                      keyboardType="phone-pad"
                      maxLength={10}
                      style={styles.input}
                      placeholder="Enter 10-digit mobile number"
                    />
                    {formErrors.mobileNo ? (
                      <Text style={styles.errorText}>{formErrors.mobileNo}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Search Employee (only if On Behalf = Yes) */}
              {onBehalf === 'Yes' && (
                <View style={styles.fullWidth}>
                  <Text style={styles.label}>
                    Select Employee <Text style={styles.required}>*</Text>
                  </Text>
                  {isEditMode ? (
                    <TextInput
                      value={selectedEmployee}
                      editable={false}
                      style={styles.disabledInput}
                    />
                  ) : (
                    <>
                      <View style={styles.searchContainer}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                          <Feather name="search" size={18} color={'#43C6DB'} />
                        </View>
                        <TextInput
                          placeholder="Search By Staff ID"
                          value={searchEmp}
                          onChangeText={setSearchEmp}
                          style={styles.searchInput}
                        />
                        {searchEmp !== '' && (
                          <TouchableOpacity
                            style={{ borderRadius: 8, marginLeft: -10, alignSelf: 'center' }}
                            onPress={() => setSearchEmp('')}
                          >
                            <Ionicons name="close-circle-outline" size={25} color='#43C6DB' />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={SearchEmployee}
                          style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Ionicons name="send" size={20} color={'#43C6DB'} />
                        </TouchableOpacity>
                      </View>
                      {selectedEmployee !== '' && (
                        <TextInput
                          value={selectedEmployee}
                          editable={false}
                          style={[styles.disabledInput, { marginTop: 10 }]}
                        />
                      )}
                    </>
                  )}
                  {formErrors.selectedEmployee ? (
                    <Text style={styles.errorText}>{formErrors.selectedEmployee}</Text>
                  ) : null}
                </View>
              )}

              {/* Intimation ID */}
              <View style={styles.fullWidth}>
                <Text style={styles.label}>
                  Intimation ID <Text style={styles.required}>*</Text>
                </Text>
                {isEditMode ? (
                  <TextInput
                    value={intimationId}
                    editable={false}
                    style={styles.disabledInput}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={GetPendingIntimations}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !intimationId && { color: '#999' }]}>
                      {intimationId || 'Select Intimation ID'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={'#43C6DB'} />
                  </TouchableOpacity>
                )}
                {formErrors.intimationId ? (
                  <Text style={styles.errorText}>{formErrors.intimationId}</Text>
                ) : null}
              </View>

              {/* Patient Name and Emergency */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Patient Name</Text>
                  <Text style={styles.valueText}>{patientName || '-'}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Emergency</Text>
                  <Text style={styles.valueText}>{emergency || '-'}</Text>
                </View>
              </View>

              {/* Patient Relation and Admitted On */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Patient Relation</Text>
                  <Text style={styles.valueText}>{patientRelation || '-'}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Admitted On</Text>
                  <Text style={styles.valueText}>{admittedOn || '-'}</Text>
                </View>
              </View>

              {/* Disease and Hospital Name */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Disease</Text>
                  <Text style={styles.valueText}>{disease || '-'}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Hospital Name</Text>
                  <Text style={styles.valueText}>{hospitalName || '-'}</Text>
                </View>
              </View>

              {/* Hospital Branch and City */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Hospital Branch</Text>
                  <Text style={styles.valueText}>{hospitalBranch || '-'}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Hospital City</Text>
                  <Text style={styles.valueText}>{hospitalCity || '-'}</Text>
                </View>
              </View>

              {/* Tax Exempted and Hospital Type */}
              <View style={styles.row}>
                <View style={styles.column}>
                <Text style={styles.label}>Tax Exempted</Text>
<Text style={[styles.valueText, taxExempted === 'No' && { color: 'red', fontWeight: 'bold' }]}>
  {taxExempted || '-'}
</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Hospital Type</Text>
                  <Text style={styles.valueText}>{hospitalType || '-'}</Text>
                </View>
              </View>
            </View>

            {/* ── Advance Details Section ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle} Bold>Advance Details</Text>

              <View style={styles.fullWidth}>
                <Text style={styles.label}>
                  Advance Amount <Text style={styles.required}>*</Text>
                </Text>
                <View>
                 <TextInput
                  value={advanceAmount}
                  placeholder="Enter advance amount (max 7 digits)"
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    if (numericText.length <= 7) {
                      setAdvanceAmount(numericText);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={7}
                  style={styles.input}
                />
                  {formErrors.advanceAmount ? (
                    <Text style={styles.errorText}>{formErrors.advanceAmount}</Text>
                  ) : null}
                </View>
              </View>

              {/* Attachments */}
              <View style={styles.fullWidth}>
                <View style={styles.attachmentHeader}>
                  <Text style={styles.label}>
                    Attachments <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity style={styles.addAttachmentButton} onPress={pickDocument}>
                    <Ionicons name="add-circle" size={24} color={'#43C6DB'} />
                    <Text style={styles.addAttachmentText}>Add File</Text>
                  </TouchableOpacity>
                </View>

                {attachments.length > 0 && (
                  <View style={styles.attachmentsList}>
                    {attachments.map((attachment) => renderAttachmentRow(attachment))}
                  </View>
                )}

                {formErrors.attachments && formErrors.attachments !== '' && (
                  <Text style={styles.errorText}>{formErrors.attachments}</Text>
                )}

                <Text style={styles.attachmentNote}>
                  Note: Only PDF (.pdf), PNG (.png), JPG (.jpg), and JPEG (.jpeg) files are allowed. Maximum file size is 2 MB.
                  File names should not contain special characters or spaces.
                </Text>
              </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearForm}>
                <Text style={styles.buttonText} Bold>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText} Bold>{isEditMode ? 'Update' : 'Submit'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* ── Employee Selection Modal ── */}
        <RNModal transparent={true} visible={empModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} Bold>Select Employee</Text>
                <TouchableOpacity onPress={() => setEmpModalVisible(false)}>
                  <Ionicons name="close-circle-outline" size={30} color={'#43C6DB'} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={employeeData ? [employeeData] : []}
                keyExtractor={item => item.EMPL_ID?.toString()}
                ListEmptyComponent={
                  <ListEmptyComponent title="No Data Found" enableRefresh={false} subtitle="Please search for an employee" />
                }
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.employeeItem} onPress={() => handleSelectEmployee(item)}>
                    <Ionicons name="person-circle-outline" size={25} color={'#43C6DB'} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontSize: 16 }} Bold>{item.EMPL_NAME || ''}</Text>
                      <Text style={{ fontSize: 13, color: '#666' }}>
                        {item.EMPL_DESG_CODE || ''} , {item.EMPL_DEPT_CODE || ''} ({item.EMPL_ID || ''})
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward-circle-outline" size={25} color={'#43C6DB'} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </RNModal>

        {/* ── Intimation Selection Modal ── */}
        <RNModal transparent={true} visible={intimationModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} Bold>Pending Intimation List</Text>
                <TouchableOpacity onPress={() => setIntimationModalVisible(false)}>
                  <Ionicons name="close-circle-outline" size={30} color={'#43C6DB'} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pendingIntimations}
                keyExtractor={item => item.HSTR_REQ_ID?.toString()}
                ListEmptyComponent={
                  <ListEmptyComponent title="No Pending Intimations" enableRefresh={false} subtitle="No pending intimations found" />
                }
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.intimationItem} onPress={() => handleSelectIntimation(item)}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.intimationRow}>
                        <Text style={styles.intimationLabel}>Request ID:</Text>
                        <Text style={styles.intimationValue} Bold>{item.HSTR_REQ_ID || ''}</Text>
                      </View>
                      <View style={styles.intimationRow}>
                        <Text style={styles.intimationLabel}>Employee:</Text>
                        <Text style={styles.intimationValue}>{item.HSTR_RQSTR_NAME || ''}</Text>
                      </View>
                      <View style={styles.intimationRow}>
                        <Text style={styles.intimationLabel}>Patient:</Text>
                        <Text style={styles.intimationValue}>{item.HSTR_PATIENT_NAME || ''}</Text>
                      </View>
                      <View style={styles.intimationRow}>
                        <Text style={styles.intimationLabel}>Admitted On:</Text>
                        <Text style={styles.intimationValue}>{item.HSTR_ADMIT_DATE || ''}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-circle-outline" size={25} color={'#43C6DB'} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </RNModal>

        {/* ── Attachment Modal ── */}
        <RNModal transparent={true} visible={attachmentModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} Bold>Add Attachment</Text>
                <TouchableOpacity onPress={() => {
                  setAttachmentModalVisible(false);
                  setCurrentAttachment({ file: null, fileName: '', fileDesc: '', order: '1', base64: '' });
                }}>
                  <Ionicons name="close-circle-outline" size={30} color={'#43C6DB'} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalField}>
                  <Text style={styles.label}>File Name</Text>
                  <Text style={styles.valueText}>{currentAttachment.fileName}</Text>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.label}>
                    File Description <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={currentAttachment.fileDesc}
                    placeholder="Enter file description (e.g., estimate proof)"
                    onChangeText={(text) => setCurrentAttachment({ ...currentAttachment, fileDesc: text })}
                    style={styles.input}
                    multiline
                  />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.label}>Order</Text>
                  <Text style={styles.valueText}>{currentAttachment.order}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, { marginTop: 20 }]}
                  onPress={saveAttachment}
                >
                  <Text style={styles.buttonText} Bold>Save Attachment</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </RNModal>
      </KeyboardAvoidingView>

      {/* ── File Viewer Modal ── */}
      <RNModal
        visible={fileViewerModal}
        animationType="slide"
        transparent={false}
        onRequestClose={closeFileViewer}
      >
        <SafeAreaView style={styles.fileViewerContainer}>
          <View style={styles.fileViewerHeader}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fileViewerTitle} Bold numberOfLines={1}>
                {selectedFileName}
              </Text>
            </View>
            <TouchableOpacity onPress={closeFileViewer} style={styles.fileViewerCloseButton}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          {renderFileViewerContent()}
        </SafeAreaView>
      </RNModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GlobalColor.PrimaryLight },
  scrollView: { flex: 1 },
  content: { padding: 15, paddingBottom: 30 },
  section: {
    backgroundColor: GlobalColor.White, borderRadius: 8, padding: 15, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  sectionTitle: {
    fontSize: 16, color: '#43C6DB', marginBottom: 15,
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10 },
  column: { flex: 1 },
  fullWidth: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  valueText: { fontSize: 13, color: '#666', paddingVertical: 8, paddingHorizontal: 2 },
  required: { color: 'red' },
  input: {
    borderWidth: 1, borderColor: '#43C6DB', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 12, fontSize: 13,
    backgroundColor: GlobalColor.White, height: 40,
  },
  disabledInput: {
    borderWidth: 1, borderColor: '#43C6DB', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 12, fontSize: 13,
    backgroundColor: '#F3F2F1', color: '#666', height: 40,
  },
  searchContainer: {
    flexDirection: 'row', borderWidth: 1, borderRadius: 8,
    alignSelf: 'center', backgroundColor: '#fff', borderColor: '#43C6DB',
  },
  searchInput: { width: '70%', paddingVertical: 5, fontSize: 13, height: 40 },
  selectButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#43C6DB', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 12, backgroundColor: GlobalColor.White,
    height: 40,
  },
  selectButtonText: { fontSize: 13, color: '#333' },
  dropdown2BtnStyle: {
    width: '100%', height: 40, borderWidth: 1, borderRadius: 8,
    backgroundColor: '#FFF', borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 13 },
  dropdown2DropdownStyle: { backgroundColor: GlobalColor.White },
  dropdown2RowStyle: { backgroundColor: GlobalColor.White, borderBottomColor: '#43C6DB' },
  dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 13 },
  errorText: { color: 'red', fontSize: 12, marginTop: 5 },
  attachmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  addAttachmentButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#43C6DB',
  },
  addAttachmentText: { fontSize: 13, color: '#43C6DB', marginLeft: 5, fontWeight: 'bold' },
  attachmentsList: { marginTop: 10 },
  attachmentItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F9F9F9', padding: 12, borderRadius: 8, marginBottom: 10,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  attachmentInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  attachmentActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAttachmentButton: { padding: 5 },
  attachmentFileName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  attachmentFileDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  attachmentOrder: { fontSize: 11, color: '#999', marginTop: 2 },
  deleteAttachmentButton: { padding: 5 },
  attachmentNote: { fontSize: 11, color: '#999', fontStyle: 'italic', marginTop: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 30 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  submitButton: { backgroundColor: '#43C6DB' },
  clearButton: { backgroundColor: '#FF9800' },
  buttonText: { color: GlobalColor.White, fontSize: 14 },
  spinnerTextStyle: { color: GlobalColor.White },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: GlobalColor.White, borderRadius: 10, width: '90%', maxHeight: '70%', padding: 20 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10,
  },
  modalTitle: { fontSize: 18, color: '#43C6DB' },
  modalScroll: { maxHeight: 400 },
  modalField: { marginBottom: 15 },
  employeeItem: {
    flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1,
    borderColor: '#43C6DB', borderRadius: 8, marginBottom: 10, backgroundColor: GlobalColor.PrimaryLight,
  },
  intimationItem: {
    flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1,
    borderColor: '#43C6DB', borderRadius: 8, marginBottom: 10, backgroundColor: GlobalColor.PrimaryLight,
  },
  intimationRow: { flexDirection: 'row', marginBottom: 5 },
  intimationLabel: { fontSize: 13, color: '#666', width: 100 },
  intimationValue: { fontSize: 13, color: '#333', flex: 1 },
  fileViewerContainer: { flex: 1, backgroundColor: '#525659' },
  fileViewerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15, backgroundColor: '#43C6DB',
  },
  fileViewerTitle: { fontSize: 16, color: '#fff' },
  fileViewerCloseButton: { padding: 5 },
  webView: { flex: 1, backgroundColor: '#525659' },
  fileLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#525659' },
  fileLoadingText: { fontSize: 16, color: '#fff', marginTop: 15 },
  imageScrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  fullImage: { width: '100%', aspectRatio: 1, minHeight: 300 },
});

export default Advance;