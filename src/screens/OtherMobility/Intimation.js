import React, {useState, useEffect, useContext, useRef} from 'react';

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
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import TextInput from '../../components/reusable/TextInput';
import AuthContext from '../../context/AuthContext';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
import {WebView} from 'react-native-webview';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
const ALLOWED_MIME_TYPES = [
  DocumentPicker.types.pdf,
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const Intimation = ({navigation, route}) => {
  const {authContext, AppUserData} = useContext(AuthContext);

  const editMode = route?.params?.editMode || false;
  const editData = route?.params?.editData || null;

  const scrollViewRef = React.useRef(null);
  const hospitalInputRef = React.useRef(null);
  const diseaseInputRef = React.useRef(null);
  const editSessionHandledRef = React.useRef(false);

  // ─── FIX: Use refs to always hold latest attachment state ─────────────────
  // This prevents stale closure captures inside async handleSubmit chains.
  const attachmentsRef = useRef([]);
  const deletedServerAttachmentsRef = useRef([]);

  const [loader, setLoader] = useState(false);
  const [onBehalf, setOnBehalf] = useState('No');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [admittedOn, setAdmittedOn] = useState(new Date());
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalBranch, setHospitalBranch] = useState('');
  const [hospitalCity, setHospitalCity] = useState('');
  const [emergency, setEmergency] = useState('Yes');
const [taxExempted, setTaxExempted] = useState('');  
  const [taxExemptedFrom, setTaxExemptedFrom] = useState('');
  const [taxExemptedTill, setTaxExemptedTill] = useState('');
  const [hospitalType, setHospitalType] = useState('');
  const [disease, setDisease] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [searchEmp, setSearchEmp] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [advanceRequired, setAdvanceRequired] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const [familyMembers, setFamilyMembers] = useState([]);

  const [hospitalSearchKey, setHospitalSearchKey] = useState('');
  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [showHospitalSuggestions, setShowHospitalSuggestions] = useState(false);
  const [selectedHospitalData, setSelectedHospitalData] = useState(null);

  const [diseaseSearchKey, setDiseaseSearchKey] = useState('');
  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState(false);
  const [selectedDiseaseData, setSelectedDiseaseData] = useState(null);

  const [empModalVisible, setEmpModalVisible] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  const [loggedInUserEmployeeData, setLoggedInUserEmployeeData] =
    useState(null);

  const [attachments, setAttachments] = useState([]);
  const [deletedServerAttachments, setDeletedServerAttachments] = useState([]);

  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState({
    file: null,
    fileName: '',
    fileDesc: '',
    order: '1',
    base64: '',
  });

  const [isEditMode, setIsEditMode] = useState(editMode);
  const [editRequestId, setEditRequestId] = useState('');
  const [requestStatus, setRequestStatus] = useState('Draft');

  const [fileViewerModal, setFileViewerModal] = useState(false);
  const [selectedFileBase64, setSelectedFileBase64] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  const getMinAdmittedDate = () => moment().subtract(1, 'year').toDate();
  const getMaxAdmittedDate = () => new Date();

  const onBehalfOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  const emergencyOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  const advanceRequiredOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  // ─── FIX: Keep refs in sync with state whenever state changes ─────────────
  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    deletedServerAttachmentsRef.current = deletedServerAttachments;
  }, [deletedServerAttachments]);

  // ─── File type helpers ─────────────────────────────────────────────────────
  const getFileType = fileName => {
    if (!fileName) return 'unknown';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'image';
    return 'unknown';
  };

  const getMimeType = fileName => {
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

  // ─── File validation helpers ───────────────────────────────────────────────

  const validateFileExtension = fileName => {
    const fileExtension = fileName
      .substring(fileName.lastIndexOf('.'))
      .toLowerCase();
    return ALLOWED_EXTENSIONS.includes(fileExtension);
  };

  const validateFileMimeType = mimeType => {
    const allowed = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
    return allowed.includes((mimeType || '').toLowerCase());
  };

  const validateFileName = fileName => {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(nameWithoutExt);
  };

  const validateFileSize = base64String => {
    const fileSizeBytes = (base64String.length * 3) / 4;
    return fileSizeBytes <= MAX_FILE_SIZE_BYTES;
  };

  // ─── PDF Viewer HTML ───────────────────────────────────────────────────────
  const getPdfViewerHtml = base64 => `
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

  const openFileViewer = (base64Data, fileName) => {
    try {
      if (!base64Data) {
        Toast.show('File data not available', Toast.SHORT);
        return;
      }
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
          source={{html: getPdfViewerHtml(selectedFileBase64)}}
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
          style={{flex: 1, backgroundColor: '#525659'}}
          contentContainerStyle={styles.imageScrollContainer}
          maximumZoomScale={5}
          minimumZoomScale={1}
          bouncesZoom={true}>
          <Image
            source={{uri: `data:${mimeType};base64,${selectedFileBase64}`}}
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

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirmDate = date => {
    const minDate = getMinAdmittedDate();

    if (date < minDate) {
      Toast.show(
        'Admitted On cannot be older than 1 year from sysdate',
        Toast.LONG,
      );
      hideDatePicker();
      return;
    }

    setAdmittedOn(date);
    hideDatePicker();
  };

  const getCompCode = () => {
    if (onBehalf === 'Yes' && employeeData) {
      return employeeData.EMPL_COMP_CODE || '101';
    } else if (loggedInUserEmployeeData) {
      return loggedInUserEmployeeData.EMPL_COMP_CODE || '101';
    }
    return '101';
  };

  const getDefaultMobileNumber = () => {
    if (loggedInUserEmployeeData && loggedInUserEmployeeData.EMPL_MOBILE_NO) {
      return loggedInUserEmployeeData.EMPL_MOBILE_NO;
    }
    return (
      AppUserData?.data?.officialPhone || AppUserData?.data?.personalPhone || ''
    );
  };

  const getUserName = () => {
    if (onBehalf === 'Yes' && employeeData) {
      return employeeData.EMPL_ID?.toString() || '';
    } else if (loggedInUserEmployeeData) {
      return loggedInUserEmployeeData.EMPL_ID?.toString() || '';
    }
    return AppUserData?.data?.userId?.toString() || '';
  };

  // ─── Document Picker ───────────────────────────────────────────────────────
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      const file = result[0];

      // ── Resolve file name ──────────────────────────────────────────────────
      let fileName = file.name;
      if (!fileName) {
        const mimeToExt = {
          'image/png': 'image.png',
          'image/jpg': 'image.jpg',
          'image/jpeg': 'image.jpeg',
          'application/pdf': 'document.pdf',
        };
        fileName = mimeToExt[file.type] || 'file';
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

      // ── Validate extension ─────────────────────────────────────────────────
      if (!validateFileExtension(fileName)) {
        Alert.alert(
          'Invalid File Type',
          'Only PDF (.pdf), PNG (.png), JPG (.jpg), and JPEG (.jpeg) files are allowed. Please select a valid file.',
        );
        return;
      }

      // ── Secondary MIME type check ──────────────────────────────────────────
      if (file.type && !validateFileMimeType(file.type)) {
        Alert.alert(
          'Invalid File Type',
          'Only PDF (.pdf), PNG (.png), JPG (.jpg), and JPEG (.jpeg) files are allowed. Please select a valid file.',
        );
        return;
      }

      // ── Validate file name characters ──────────────────────────────────────
      if (!validateFileName(fileName)) {
        Alert.alert(
          'Invalid File Name',
          'File name should not contain special characters or spaces. Only letters, numbers, hyphens, and underscores are allowed.',
        );
        return;
      }

      // ── Read file as base64 ────────────────────────────────────────────────
      const base64 = await RNFS.readFile(file.uri, 'base64');

      // ── Validate file size (max 2 MB) ──────────────────────────────────────
      if (!validateFileSize(base64)) {
        Alert.alert(
          'File Too Large',
          `File size exceeds the maximum allowed limit of ${MAX_FILE_SIZE_MB} MB. Please select a smaller file.`,
        );
        return;
      }

      const autoOrder = (attachmentsRef.current.length + 1).toString();

      setCurrentAttachment({
        file: file,
        fileName: fileName,
        fileDesc: '',
        order: autoOrder,
        base64: base64,
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

  // ─── FIX: update ref BEFORE setState so handleSubmit snapshot always sees it
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

    // ─── FIX: compute new list, write to ref first, then setState with the value
    // Never mutate ref inside setState updater — ref must be ahead of React batching
    const updatedAttachments = [...attachmentsRef.current, newAttachment];
    attachmentsRef.current = updatedAttachments;
    setAttachments(updatedAttachments);

    setAttachmentModalVisible(false);
    setCurrentAttachment({
      file: null,
      fileName: '',
      fileDesc: '',
      order: '1',
      base64: '',
    });
    Toast.show('Attachment added successfully', Toast.SHORT);
  };

  const deleteAttachment = id => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => {
            const target = attachmentsRef.current.find(att => att.id === id);

            if (target && target.isNew === false) {
              // ─── FIX: update ref before setState
              const updatedDeleted = [
                ...deletedServerAttachmentsRef.current,
                target,
              ];
              deletedServerAttachmentsRef.current = updatedDeleted;
              setDeletedServerAttachments(updatedDeleted);
            }

            // ─── FIX: update ref before setState
            const updatedAttachments = attachmentsRef.current
              .filter(att => att.id !== id)
              .map((att, index) => ({...att, order: (index + 1).toString()}));
            attachmentsRef.current = updatedAttachments;
            setAttachments(updatedAttachments);

            Toast.show('Attachment deleted', Toast.SHORT);
          },
        },
      ],
    );
  };

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
      const result = await ApiService.PostMethode(
        '/GetHospitalAttachment',
        apiData,
        token,
        authContext,
      );
      if (
        result.Value &&
        Array.isArray(result.Value) &&
        result.Value.length > 0
      ) {
        // ─── FIX: For send-back requests, mark attachments as new so they get re-uploaded
        // Check if request status indicates send-back scenario
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
        // ─── FIX: update ref before setState
        attachmentsRef.current = fetchedAttachments;
        setAttachments(fetchedAttachments);
      } else {
        attachmentsRef.current = [];
        setAttachments([]);
      }
    } catch (error) {
      console.log('Error fetching attachments for edit:', error);
      attachmentsRef.current = [];
      setAttachments([]);
    } finally {
      setLoader(false);
    }
  };

  // ─── FIX: uploadAttachments accepts explicit snapshot params ──────────────
  const uploadAttachments = async (
    requestId,
    attachmentsSnapshot,
    deletedSnapshot,
  ) => {
    const allAttachments = attachmentsSnapshot ?? attachmentsRef.current;
    const toDelete = deletedSnapshot ?? deletedServerAttachmentsRef.current;

    const hasWork = allAttachments.length > 0 || toDelete.length > 0;
    if (!hasWork) return true;

    // ─── Only upload NEW attachments ───────────────────────────────────────────
    // isNew === true means user just picked it this session.
    // isNew === false means it already exists on the server (fetched in edit mode).
    // Skipping server files prevents duplicate uploads on retry.
    const filesToUpload = allAttachments.filter(att => att.isNew === true);

    console.log(
      `uploadAttachments — total: ${allAttachments.length}, toUpload: ${filesToUpload.length}, toDelete: ${toDelete.length}`,
    );

    const failedUploads = [];

    // ─── Upload sequentially ───────────────────────────────────────────────────
    // DO NOT use Promise.all here. Parallel uploads to the same RequestID cause
    // race conditions on the server — only some files get saved, rest are dropped.
    // Sequential guarantees each file completes before the next one starts.
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
          '/HospitalAttachment',
          apiData,
          AppUserData.token,
          authContext,
        );
        const responseValue = (result?.Value || '')
          .toString()
          .trim()
          .toUpperCase();
        if (responseValue.includes('SUCCESS')) {
          console.log('Upload OK:', attachment.fileName);
        } else {
          console.warn(
            'Non-success response for:',
            attachment.fileName,
            '| Response:',
            result?.Value,
          );
          failedUploads.push(attachment.fileName);
        }
      } catch (uploadError) {
        console.warn('Upload error for:', attachment.fileName, uploadError);
        failedUploads.push(attachment.fileName);
      }
    }

    // ─── Delete sequentially ───────────────────────────────────────────────────
    // Delete failures are non-fatal — log and move on, never block the success flow.
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
          '/HospitalAttachment',
          apiData,
          AppUserData.token,
          authContext,
        );
        console.log('Deleted OK:', attachment.fileName);
      } catch (deleteError) {
        console.warn(
          'Delete error (non-fatal):',
          attachment.fileName,
          deleteError,
        );
      }
    }

    // ─── If any uploads failed, throw with flag so handleSubmit shows the right alert
    if (failedUploads.length > 0) {
      const err = new Error(
        `The following file(s) could not be uploaded:\n${failedUploads.join(
          '\n',
        )}\n\nYour intimation was saved. Please pull-back the request and re-upload the failed file(s).`,
      );
      err.isAttachmentError = true;
      throw err;
    }

    return true;
  };

  const GetFamilyMembers = staffNo => {
    if (!staffNo) {
      Toast.show('Invalid staff number', Toast.SHORT);
      return;
    }

    let token = AppUserData.token;
    let apiData = {StaffNo: staffNo};

    const loaderTimeout = setTimeout(() => {
      setLoader(false);
      Toast.show('Request timeout. Please try again.', Toast.LONG);
    }, 15000);

    try {
      ApiService.PostMethode('/GetFamily', apiData, token, authContext)
        .then(result => {
          clearTimeout(loaderTimeout);
          setLoader(false);

          if (
            result &&
            result.Value &&
            Array.isArray(result.Value) &&
            result.Value.length > 0
          ) {
            setFamilyMembers(result.Value);
            const selfMember = result.Value.find(
              member => member.FAML_REL === 'SELF',
            );
            if (selfMember) {
              setPatientName(selfMember.FAML_NAME);
              setPatientRelation(selfMember.FAML_REL);
            } else {
              setPatientName('');
              setPatientRelation('');
            }
          } else {
            setFamilyMembers([]);
            setPatientName('');
            setPatientRelation('');
            Toast.show('No family members found', Toast.SHORT);
          }
        })
        .catch(error => {
          clearTimeout(loaderTimeout);
          setLoader(false);
          setFamilyMembers([]);
          setPatientName('');
          setPatientRelation('');
          Toast.show('Error fetching family members', Toast.SHORT);
        })
        .finally(() => {
          clearTimeout(loaderTimeout);
          setLoader(false);
        });
    } catch (error) {
      clearTimeout(loaderTimeout);
      setLoader(false);
      Toast.show('Error fetching family members', Toast.SHORT);
    }
  };

  const GetFamilyMembersForEdit = (
    staffNo,
    targetPatientName,
    targetPatientRelation,
  ) => {
    if (!staffNo) return;

    let token = AppUserData.token;
    let apiData = {StaffNo: staffNo};

    ApiService.PostMethode('/GetFamily', apiData, token, authContext)
      .then(result => {
        if (
          result &&
          result.Value &&
          Array.isArray(result.Value) &&
          result.Value.length > 0
        ) {
          setFamilyMembers(result.Value);
          if (targetPatientName) setPatientName(targetPatientName);
          if (targetPatientRelation) setPatientRelation(targetPatientRelation);
        } else {
          setFamilyMembers([]);
          if (targetPatientName) setPatientName(targetPatientName);
          if (targetPatientRelation) setPatientRelation(targetPatientRelation);
        }
      })
      .catch(error => {
        console.log('Error fetching family members for edit:', error);
        if (targetPatientName) setPatientName(targetPatientName);
        if (targetPatientRelation) setPatientRelation(targetPatientRelation);
      });
  };

  const SearchHospital = searchKey => {
    if (!searchKey || searchKey.length < 3) {
      setHospitalSuggestions([]);
      return;
    }

    let token = AppUserData.token;
    let apiData = {
      CompCode: getCompCode(),
      SearchKey: searchKey,
      RowLimit: '',
      HospitalCode: '',
    };

    ApiService.PostMethode('/SearchHospital', apiData, token, authContext)
      .then(result => {
        if (result.Value && result.Value.length > 0) {
          setHospitalSuggestions(result.Value);
          setShowHospitalSuggestions(true);
        } else {
          setHospitalSuggestions([]);
        }
      })
      .catch(error => {
        console.log('Hospital search error:', error);
      });
  };

  const SearchDisease = searchKey => {
    if (!searchKey || searchKey.length < 3) {
      setDiseaseSuggestions([]);
      return;
    }

    let token = AppUserData.token;
    let apiData = {
      CompCode: getCompCode(),
      SearchKey: searchKey,
      RowLimit: '',
    };

    ApiService.PostMethode('/SearchDisease', apiData, token, authContext)
      .then(result => {
        if (result.Value && result.Value.length > 0) {
          setDiseaseSuggestions(result.Value);
          setShowDiseaseSuggestions(true);
        } else {
          setDiseaseSuggestions([]);
        }
      })
      .catch(error => {
        console.log('Disease search error:', error);
      });
  };

  const resetToInitialState = () => {
    navigation.setParams({editMode: false, editData: null});
    editSessionHandledRef.current = false;
    setIsEditMode(false);
    setEditRequestId('');
    setRequestStatus('Draft');
    setOnBehalf('No');
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setPatientName('');
    setPatientRelation('');
    setAdmittedOn(new Date());
    setHospitalName('');
    setHospitalBranch('');
    setHospitalCity('');
    setEmergency('Yes');
    setTaxExempted('');
    setTaxExemptedFrom('');
    setTaxExemptedTill('');
    setHospitalType('');
    setDisease('');
    setSearchEmp('');
    setFormErrors({});
    setAdvanceRequired('');
    setAdvanceAmount('');
    setFamilyMembers([]);
    setHospitalSearchKey('');
    setHospitalSuggestions([]);
    setShowHospitalSuggestions(false);
    setSelectedHospitalData(null);
    setDiseaseSearchKey('');
    setDiseaseSuggestions([]);
    setShowDiseaseSuggestions(false);
    setSelectedDiseaseData(null);
    setEmployeeData(null);
    // ─── FIX: clear refs before setState on reset
    attachmentsRef.current = [];
    deletedServerAttachmentsRef.current = [];
    setAttachments([]);
    setDeletedServerAttachments([]);

    const mobile = getDefaultMobileNumber();
    setMobileNo(mobile);

    if (AppUserData?.data?.userId) {
      GetFamilyMembers(AppUserData.data.userId.toString());
    }
  };

  const clearForm = () => {
    resetToInitialState();
    Toast.show('Form cleared successfully', Toast.SHORT);
  };

  const populateEditData = async data => {
    if (!data) return;

    // ─── FIX: clear refs before setState
    deletedServerAttachmentsRef.current = [];
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

    if (data.HSTR_HSPM_CATG === 'P') {
      setHospitalType('Panel');
    } else if (data.HSTR_HSPM_CATG === 'N') {
      setHospitalType('Non Panel');
    } else if (data.HSTR_HSPM_CATG === 'R') {
      setHospitalType('Referal');
    }

    if (data.HSTR_ADMIT_DATE) {
      const parsedDate = moment(
        data.HSTR_ADMIT_DATE,
        'DD-MMM-YYYY HH:mm',
      ).toDate();
      if (!isNaN(parsedDate)) {
        setAdmittedOn(parsedDate);
      }
    }

    if (data.HSTR_ADV_REQ_AMT && parseFloat(data.HSTR_ADV_REQ_AMT) > 0) {
      setAdvanceRequired('Yes');
      setAdvanceAmount(data.HSTR_ADV_REQ_AMT.toString());
    } else {
      setAdvanceRequired('');
      setAdvanceAmount('');
    }

    if (data.HSTR_HSPM_ID) {
      setSelectedHospitalData({
        HSPM_ID: data.HSTR_HSPM_ID,
        HSPM_NAME: data.HSTR_HSPM_NAME || '',
        HSPM_BRANCH: data.HSTR_HSPM_BRANCH || '',
        HSPM_CITY: data.HSTR_HSPM_CITY || '',
        HSPM_TYPE: data.HSTR_HSPM_CATG || '',
        TAX_EXEMPT_FLAG: data.HSTR_TAX_EXEMTED_FLAG || '',
        HSPM_AYUR: '',
      });
    }

    if (data.HSTR_DISEASE_ID) {
      setSelectedDiseaseData({
        HSDM_ID: data.HSTR_DISEASE_ID,
        HSDM_NAME: data.HSTR_DISEASE_NAME || '',
        HSDM_CATG: '',
      });
    }

    if (data.HSTR_TAX_FROM) {
      setTaxExemptedFrom(moment(data.HSTR_TAX_FROM).format('DD-MM-YYYY'));
    }
    if (data.HSTR_TAX_TILL) {
      setTaxExemptedTill(moment(data.HSTR_TAX_TILL).format('DD-MM-YYYY'));
    }

    const requestorId =
      data.HSTR_RQSTR_ID?.toString() ||
      AppUserData?.data?.userId?.toString() ||
      '';
    if (requestorId) {
      GetFamilyMembersForEdit(
        requestorId,
        data.HSTR_PATIENT_NAME || '',
        data.HSTR_PATIENT_RELATION || '',
      );
    }

    if (data.HSTR_REQ_ID) {
      await fetchAttachmentsForEdit(data.HSTR_REQ_ID, data.HSTR_REQ_STATUS);
    }
  };

  // ─── FIX: validate returns both isValid flag and the fresh errors object ──
  // This way handleSubmit never reads stale formErrors state for the toast.
  const validate = () => {
    const errors = {};
    let isValid = true;

    if (onBehalf === 'Yes' && !selectedEmployee.trim()) {
      errors.selectedEmployee = 'Please select an employee.';
      isValid = false;
    }

    if (!patientName.trim()) {
      errors.patientName = 'Patient name is required.';
      isValid = false;
    }

    if (!hospitalName.trim()) {
      errors.hospitalName = 'Hospital name is required.';
      isValid = false;
    }

    if (!disease.trim()) {
      errors.disease = 'Disease is required.';
      isValid = false;
    }

    if (!mobileNo.trim()) {
      errors.mobileNo = 'Mobile number is required.';
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileNo.trim())) {
      errors.mobileNo = 'Mobile number must be exactly 10 digits.';
      isValid = false;
    }

    // ─── HARD CHECK: when advance required, both amount AND attachment are mandatory
    if (advanceRequired === 'Yes') {
      if (!advanceAmount.trim()) {
        errors.advanceAmount = 'Please enter advance amount.';
        isValid = false;
      }
      // ─── FIX: read from ref — always the latest committed value, never stale
      if (attachmentsRef.current.length === 0) {
        errors.attachments =
          'Please upload at least one attachment when advance is required.';
        isValid = false;
      }
    }

    setFormErrors(errors);
    // ─── FIX: return fresh errors object alongside isValid
    return {isValid, errors};
  };

  const checkAyurvedicCombination = () => {
    if (selectedDiseaseData && selectedHospitalData) {
      const diseaseCategory = (selectedDiseaseData.HSDM_CATG || '')
        .trim()
        .toUpperCase();
      const hospitalAyur = (selectedHospitalData.HSPM_AYUR || '')
        .trim()
        .toLowerCase();
      const isAyurvedicDisease = diseaseCategory === 'AYURVEDIC TREATMENT';
      const isAyurvedicHospital = hospitalAyur === 'yes';
      if (
        (isAyurvedicDisease && !isAyurvedicHospital) ||
        (isAyurvedicHospital && !isAyurvedicDisease)
      ) {
        return false;
      }
    }
    return true;
  };

  const getPatientCode = () => {
    const selectedMember = familyMembers.find(
      member =>
        member.FAML_NAME === patientName && member.FAML_REL === patientRelation,
    );
    return (
      selectedMember?.FAML_SEQNO ||
      (isEditMode ? editData?.HSTR_PATIENT_CODE : '') ||
      ''
    );
  };

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
          employeeNTID:
            loggedInUserEmployeeData.EMPL_NT_USER ||
            loggedInUserEmployeeData.EMPL_ID ||
            '',
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
          employeeNTID:
            AppUserData?.data?.userNT || AppUserData?.data?.userId || '',
          employeeDOB: AppUserData?.data?.dateOfBirth || '',
          employeeDOJ: AppUserData?.data?.dateOfJoining || '',
        };
      }
    }
  };

  const checkDuplicity = () => {
    return new Promise((resolve, reject) => {
      const employeeDetails = getEmployeeDetails();
      const patientCode = getPatientCode();

      if (!patientCode) {
        reject({isDuplicate: false, message: 'Patient code not found'});
        return;
      }

      const duplicityData = {
        RequestorID: employeeDetails.employeeId.toString(),
        PatientCode: patientCode.toString(),
        HospitalID: selectedHospitalData?.HSPM_ID?.toString() || '',
        AdmitDate: moment(admittedOn).format('DD-MMM-YYYY HH:mm:ss'),
        DischargeDate: '',
        RequestID: isEditMode ? editRequestId : '',
        RequestType: 'HOSP INTIM',
      };

      ApiService.PostMethode(
        '/CheckDuplicity',
        duplicityData,
        AppUserData.token,
        authContext,
      )
        .then(result => {
          if (
            result.Value &&
            Array.isArray(result.Value) &&
            result.Value.length === 0
          ) {
            resolve({noDuplicate: true});
          } else if (result.Value && result.Value.length > 0) {
            const dupReqID = result.Value[0].HSTR_REQ_ID;
            if (
              isEditMode &&
              dupReqID?.toString() === editRequestId?.toString()
            ) {
              resolve({noDuplicate: true});
            } else {
              reject({
                isDuplicate: true,
                message: `Same Intimation has already been submitted under Intimation request id ${dupReqID}.`,
              });
            }
          } else {
            resolve({noDuplicate: true});
          }
        })
        .catch(error => {
          reject({isDuplicate: false, message: 'Error checking duplicity'});
        });
    });
  };

  const submitHospitalAction = () => {
    return new Promise((resolve, reject) => {
      const employeeDetails = getEmployeeDetails();
      const patientCode = getPatientCode();

      const requestorId = isEditMode
        ? editData?.HSTR_RQSTR_ID?.toString() ||
          employeeDetails.employeeId.toString()
        : employeeDetails.employeeId.toString();

      const requestorNTID = isEditMode
        ? editData?.HSTR_RQSTR_NTID?.toString() || employeeDetails.employeeNTID
        : employeeDetails.employeeNTID;

      const hospitalActionData = {
        RequestID: isEditMode ? editRequestId : '',
        AppName: 'HOSP INTIM',
        CompCode: getCompCode(),
        RequestStatus: isEditMode ? requestStatus : 'Draft',
        Action: 'Submit',
        RequestorID: requestorId,
        RequestorName: isEditMode
          ? editData?.HSTR_RQSTR_NAME || employeeDetails.employeeName
          : employeeDetails.employeeName,
        RequestorLocn: isEditMode
          ? editData?.HSTR_RQSTR_LOCN || employeeDetails.employeeLocn
          : employeeDetails.employeeLocn,
        RequestorDesg: isEditMode
          ? editData?.HSTR_RQSTR_DESG || employeeDetails.employeeDesg
          : employeeDetails.employeeDesg,
        RequestorDept: isEditMode
          ? editData?.HSTR_RQSTR_DEPT || employeeDetails.employeeDept
          : employeeDetails.employeeDept,
        RequestorDivn: isEditMode
          ? editData?.HSTR_RQSTR_DIVN || employeeDetails.employeeDivn
          : employeeDetails.employeeDivn,
        RequestorDirc: isEditMode
          ? editData?.HSTR_RQSTR_DIRC || employeeDetails.employeeDirc
          : employeeDetails.employeeDirc,
        RequestorNTID: requestorNTID,
        RequestorPhone: mobileNo,
        PatientCode: patientCode.toString(),
        PatientName: patientName,
        PatientRelation: patientRelation,
        DiseaseID: selectedDiseaseData?.HSDM_ID?.toString() || '',
        DiseaseName: disease,
        EmergencyFlag: emergency === 'Yes' ? 'Y' : 'N',
        HospitalID: selectedHospitalData?.HSPM_ID?.toString() || '',
        HospitalName: selectedHospitalData?.HSPM_NAME || hospitalName,
        HospitalBranch: selectedHospitalData?.HSPM_BRANCH || hospitalBranch,
        HospitalCity: selectedHospitalData?.HSPM_CITY || hospitalCity,
        HospitalCatg: selectedHospitalData?.HSPM_TYPE || '',
        TaxExmpFlag: selectedHospitalData?.TAX_EXEMPT_FLAG || '',
        AdmitDate: moment(admittedOn).format('DD-MMM-YYYY HH:mm:ss'),
        DischargeDate: '',
        AdvanceReqAmount: advanceAmount || '',
        AdvanceAppAmount: '',
        CreatorName: AppUserData?.data?.emplusername || '',
        CreatorID: AppUserData?.data?.userId?.toString() || '',
        CMOAPPHospAmt: '',
        FinAPPHospAmt: '',
        HospAmount: '',
        TotalAmount: '',
        RefIntimID: '',
        RequestorAmount: '',
        CMOAPPReqAmt: '',
        FinAPPReqAAmt: '',
        RequestorDOB: isEditMode
          ? editData?.HSTR_RQSTR_DOB
            ? moment(editData.HSTR_RQSTR_DOB).format('DD-MMM-YYYY')
            : ''
          : employeeDetails.employeeDOB
          ? moment(employeeDetails.employeeDOB).format('DD-MMM-YYYY')
          : '',
        RequestorDOJ: isEditMode
          ? editData?.HSTR_RQSTR_DOJ
            ? moment(editData.HSTR_RQSTR_DOJ).format('DD-MMM-YYYY')
            : ''
          : employeeDetails.employeeDOJ
          ? moment(employeeDetails.employeeDOJ).format('DD-MMM-YYYY')
          : '',
        BillDetails: '',
        RefundAmount: '',
        UTRNumber: '',
        Documents: '',
        UserName:
          AppUserData?.data?.userNT ||
          AppUserData?.data?.userId?.toString() ||
          '',
        Comments: '',
        Attachment: '',
        CreatorNTID:
          AppUserData?.data?.userNT ||
          AppUserData?.data?.userId?.toString() ||
          '',
      };

      console.log('HospitalAction payload:', hospitalActionData);

      ApiService.PostMethode(
        '/HospitalAction',
        hospitalActionData,
        AppUserData.token,
        authContext,
      )
        .then(result => {
          if (result.Value && result.Value.includes('SUCCESS')) {
            const requestId = result.Value.split(':')[1]
              ?.trim()
              .replace(':', '');
            resolve(requestId);
          } else {
            reject('Failed to submit intimation');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // ─── FIX: Snapshot state at the very top before any async work ────────────
  const handleSubmit = async () => {
    const {isValid, errors} = validate();
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      Toast.show(firstError || 'Please fill all required fields', Toast.LONG);
      return;
    }

    if (advanceRequired === 'Yes' && attachmentsRef.current.length === 0) {
      Alert.alert(
        'Attachment Required',
        'You must upload at least one attachment before submitting when Advance Required is set to Yes.',
        [{text: 'OK'}],
      );
      return;
    }

    if (!selectedHospitalData?.HSPM_ID) {
      Toast.show('Please select a valid hospital', Toast.LONG);
      return;
    }

    if (!selectedDiseaseData?.HSDM_ID) {
      Toast.show('Please select a valid disease', Toast.LONG);
      return;
    }

    if (!checkAyurvedicCombination()) {
      Alert.alert(
        'Invalid Combination',
        'Hospital & disease combination is not valid. AYURVEDIC TREATMENT can only be selected with AYURVEDIC hospitals.',
        [{text: 'OK'}],
      );
      return;
    }

    const currentAttachmentsSnapshot = [...attachmentsRef.current];
    const currentDeletedSnapshot = [...deletedServerAttachmentsRef.current];

    console.log(
      'Submit snapshot — attachments:',
      currentAttachmentsSnapshot.length,
      'deleted:',
      currentDeletedSnapshot.length,
    );

    setLoader(true);

    try {
      await checkDuplicity();
      const requestId = await submitHospitalAction();

      const shouldUpload = isEditMode
        ? currentAttachmentsSnapshot.length > 0 ||
          currentDeletedSnapshot.length > 0
        : currentAttachmentsSnapshot.length > 0;

      if (shouldUpload) {
        await uploadAttachments(
          requestId,
          currentAttachmentsSnapshot,
          currentDeletedSnapshot,
        );
      }

      setLoader(false);

      Alert.alert(
        'Success',
        `Intimation ${
          isEditMode ? 'updated' : 'submitted'
        } successfully with Request ID: ${requestId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetToInitialState();
            },
          },
        ],
      );
    } catch (error) {
      setLoader(false);
      if (error.isDuplicate) {
        Alert.alert(
          'Duplicate Intimation',
          error.message + '\n\nDo you want to proceed anyway?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Proceed',
              onPress: async () => {
                if (
                  advanceRequired === 'Yes' &&
                  currentAttachmentsSnapshot.length === 0
                ) {
                  Alert.alert(
                    'Attachment Required',
                    'You must upload at least one attachment before submitting when Advance Required is set to Yes.',
                    [{text: 'OK'}],
                  );
                  return;
                }
                setLoader(true);
                try {
                  const requestId = await submitHospitalAction();
                  const shouldUpload = isEditMode
                    ? currentAttachmentsSnapshot.length > 0 ||
                      currentDeletedSnapshot.length > 0
                    : currentAttachmentsSnapshot.length > 0;
                  if (shouldUpload) {
                    await uploadAttachments(
                      requestId,
                      currentAttachmentsSnapshot,
                      currentDeletedSnapshot,
                    );
                  }
                  setLoader(false);
                  Alert.alert(
                    'Success',
                    `Intimation ${
                      isEditMode ? 'updated' : 'submitted'
                    } successfully with Request ID: ${requestId}`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          resetToInitialState();
                        },
                      },
                    ],
                  );
                } catch (submitError) {
                  setLoader(false);
                  // ─── TWO: duplicate proceed catch block ───────────────────
                  if (submitError.isAttachmentError) {
                    Alert.alert('Partially Submitted', submitError.message, [
                      {
                        text: 'OK',
                        onPress: () => {
                          resetToInitialState();
                        },
                      },
                    ]);
                  } else {
                    Toast.show(
                      submitError.message || 'Error submitting intimation',
                      Toast.LONG,
                    );
                  }
                }
              },
            },
          ],
        );
        // ─── ONE: main catch block ─────────────────────────────────────────────
      } else if (error.isAttachmentError) {
        Alert.alert('Partially Submitted', error.message, [
          {
            text: 'OK',
            onPress: () => {
              resetToInitialState();
            },
          },
        ]);
      } else {
        Toast.show(error.message || 'Error submitting intimation', Toast.LONG);
      }
    }
  };

  const GetLoggedInEmployeeData = () => {
    if (!AppUserData?.data?.userId) return;

    let token = AppUserData.token;
    let apiData = {
      AppName: 'HR-ASSIST',
      UserName: AppUserData.data.userId.toString(),
    };

    setLoader(true);

    ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        if (result.Value && result.Value.length > 0) {
          let responseData = result.Value[0];
          setLoggedInUserEmployeeData(responseData);
          const employeeMobile = responseData.EMPL_MOBILE_NO || '';
          if (employeeMobile && !editMode) {
            setMobileNo(employeeMobile);
          }
        } else {
          Toast.show('Could not load employee data', Toast.SHORT);
        }
      })
      .catch(error => {
        setLoader(false);
        Toast.show('Error loading employee data', Toast.SHORT);
      });
  };

  const GetLOVMCutoffDate = () => {
    return new Promise((resolve, reject) => {
      const userId = AppUserData?.data?.userId?.toString() || '';
      const token = AppUserData.token;
      const apiData = {
        SystemName: 'HR-ASSIST',
        ReportName: 'SMG_HOSPITAL',
        LOVName: 'CUTOFF_DATE',
        LOVCode: 'CUTOFF_DATE',
        UserName: userId,
      };

      ApiService.PostMethode('/GetLOVM', apiData, token, authContext)
        .then(result => {
          if (
            result.Value &&
            Array.isArray(result.Value) &&
            result.Value.length > 0
          ) {
            const lovmValueDesc = result.Value[0].LOVM_VALUE_DESC || '';
            resolve(lovmValueDesc);
          } else {
            resolve('N');
          }
        })
        .catch(error => {
          console.log('GetLOVM error:', error);
          resolve('N');
        });
    });
  };

  const SearchEmployee = async () => {
    if (!searchEmp.trim()) {
      Toast.show('Please enter a valid staff ID', Toast.LONG);
      return;
    }

    setLoader(true);

    try {
      const lovmValueDesc = await GetLOVMCutoffDate();

      if (lovmValueDesc === 'Y' && searchEmp.trim().startsWith('7')) {
        setLoader(false);
        Toast.show('Employee not found', Toast.LONG);
        setSelectedEmployee('');
        setSelectedEmployeeId('');
        return;
      }

      const token = AppUserData.token;
      const apiData = {AppName: 'HR-ASSIST', UserName: searchEmp};

      ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
        .then(result => {
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
          setLoader(false);
          Toast.show('Error searching employee', Toast.LONG);
          ApiService.showErrorMessage(error, authContext);
        });
    } catch (error) {
      setLoader(false);
      Toast.show('Error searching employee', Toast.LONG);
    }
  };

  const handleSelectEmployee = employee => {
    setSelectedEmployee(employee.EMPL_NAME || '');
    setSelectedEmployeeId(employee.EMPL_ID || '');
    setEmpModalVisible(false);
    setPatientName(employee.EMPL_NAME || '');

    const employeeMobile = employee.EMPL_MOBILE_NO || '';
    if (employeeMobile) {
      setMobileNo(employeeMobile);
    }

    const employeeId = employee.EMPL_ID?.toString() || '';
    if (employeeId) {
      setTimeout(() => {
        GetFamilyMembers(employeeId);
      }, 100);
    } else {
      Toast.show('Invalid employee ID', Toast.SHORT);
    }
  };

  const handleSelectHospital = hospital => {
    setSelectedHospitalData(hospital);
    setHospitalName(hospital.HSPM_NAME || '');
    setHospitalBranch(hospital.HSPM_BRANCH || '');
    setHospitalCity(hospital.HSPM_CITY || '');

    if (hospital.HSPM_TYPE === 'P') {
      setHospitalType('Panel');
    } else if (hospital.HSPM_TYPE === 'N') {
      setHospitalType('Non Panel');
    } else if (hospital.HSPM_TYPE === 'R') {
      setHospitalType('Referal');
    }

    setTaxExempted(hospital.TAX_EXEMPT_FLAG === 'Y' ? 'Yes' : 'No');

    if (hospital.TAX_CERT_VALID_FROM) {
      setTaxExemptedFrom(
        moment(hospital.TAX_CERT_VALID_FROM).format('DD-MM-YYYY'),
      );
    } else {
      setTaxExemptedFrom('');
    }

    if (hospital.TAX_CERT_VALID_TILL) {
      setTaxExemptedTill(
        moment(hospital.TAX_CERT_VALID_TILL).format('DD-MM-YYYY'),
      );
    } else {
      setTaxExemptedTill('');
    }

    setHospitalSearchKey('');
    setShowHospitalSuggestions(false);
  };

  const handleSelectDisease = diseaseItem => {
    setSelectedDiseaseData(diseaseItem);
    const diseaseDisplay = `${diseaseItem.HSDM_CATG || ''} # ${
      diseaseItem.HSDM_NAME || ''
    }`;
    setDisease(diseaseDisplay.trim());
    setDiseaseSearchKey('');
    setShowDiseaseSuggestions(false);
  };

  const handlePatientNameChange = selectedItem => {
    setPatientName(selectedItem.FAML_NAME || '');
    setPatientRelation(selectedItem.FAML_REL || '');
  };

  useEffect(() => {
    if (isEditMode) return;
    if (onBehalf === 'No') {
      setSelectedEmployee('');
      setSelectedEmployeeId('');
      setSearchEmp('');
      setEmployeeData(null);

      const mobile = getDefaultMobileNumber();
      setMobileNo(mobile);

      if (AppUserData?.data?.userId) {
        GetFamilyMembers(AppUserData.data.userId.toString());
      }
    } else {
      setFamilyMembers([]);
      setPatientName('');
      setPatientRelation('');
    }
  }, [onBehalf]);

  useEffect(() => {
    GetLoggedInEmployeeData();

    if (editMode && editData) {
      setIsEditMode(true);
      populateEditData(editData);
    } else {
      setIsEditMode(false);
      const now = new Date();
      setAdmittedOn(now);

      if (AppUserData?.data?.userId) {
        GetFamilyMembers(AppUserData.data.userId.toString());
      }

      const mobile =
        AppUserData?.data?.officialPhone ||
        AppUserData?.data?.personalPhone ||
        '';
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

  const renderAttachmentRow = attachment => {
    const fileType = getFileType(attachment.fileName);
    const viewBase64 = attachment.base64 || '';

    const getFileIcon = () => {
      if (fileType === 'pdf')
        return (
          <MaterialIcons name="picture-as-pdf" size={20} color="#E53935" />
        );
      if (fileType === 'image')
        return <MaterialIcons name="image" size={20} color="#43A047" />;
      return <MaterialIcons name="attach-file" size={20} color={'#43C6DB'} />;
    };

    return (
      <View key={attachment.id} style={styles.attachmentItem}>
        <View style={styles.attachmentInfo}>
          {getFileIcon()}
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.attachmentFileName}>{attachment.fileName}</Text>
            <Text style={styles.attachmentFileDesc}>{attachment.fileDesc}</Text>
            <Text style={styles.attachmentOrder}>
              Order: {attachment.order}
            </Text>
          </View>
        </View>
        <View style={styles.attachmentActions}>
          {viewBase64 ? (
            <TouchableOpacity
              style={styles.viewAttachmentButton}
              onPress={() => openFileViewer(viewBase64, attachment.fileName)}>
              <Ionicons name="eye-outline" size={22} color={'#43C6DB'} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.deleteAttachmentButton}
            onPress={() => deleteAttachment(attachment.id)}>
            <Ionicons name="trash-outline" size={22} color={'#FF3B30'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle} Bold>
                Request Details
              </Text>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Request ID</Text>
                  <Text style={styles.valueText}>
                    {isEditMode && editRequestId
                      ? editRequestId
                      : 'Not Generated'}
                  </Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Status</Text>
                  <Text style={styles.valueText}>{requestStatus}</Text>
                </View>
              </View>

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
                      buttonTextAfterSelection={selectedItem =>
                        selectedItem.label
                      }
                      defaultButtonText={onBehalf}
                      rowTextForSelection={item => item.label}
                      data={onBehalfOptions}
                      onSelect={selectedItem => setOnBehalf(selectedItem.value)}
                      buttonStyle={styles.dropdown2BtnStyle}
                      buttonTextStyle={styles.dropdown2BtnTxtStyle}
                      renderDropdownIcon={isOpened => (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#43C6DB'}
                          size={14}
                        />
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
                    Emergency <Text style={styles.required}>*</Text>
                  </Text>
                  <SelectDropdown
                    key={`emergency-${emergency}-${isEditMode}`}
                    buttonTextAfterSelection={selectedItem =>
                      selectedItem.label
                    }
                    defaultButtonText={emergency}
                    rowTextForSelection={item => item.label}
                    data={emergencyOptions}
                    onSelect={selectedItem => setEmergency(selectedItem.value)}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderDropdownIcon={isOpened => (
                      <FontAwesome
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#43C6DB'}
                        size={14}
                      />
                    )}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                </View>
              </View>

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
                        <View
                          style={{
                            width: '15%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
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
                            style={{
                              borderRadius: 8,
                              marginLeft: -10,
                              alignSelf: 'center',
                            }}
                            onPress={() => setSearchEmp('')}>
                            <Ionicons
                              name="close-circle-outline"
                              size={25}
                              color="#43C6DB"
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={SearchEmployee}
                          style={{
                            width: '15%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Ionicons name="send" size={20} color={'#43C6DB'} />
                        </TouchableOpacity>
                      </View>
                      {selectedEmployee !== '' && (
                        <TextInput
                          value={selectedEmployee}
                          editable={false}
                          style={[styles.disabledInput, {marginTop: 10}]}
                        />
                      )}
                    </>
                  )}
                  {formErrors.selectedEmployee && (
                    <Text style={styles.errorText}>
                      {formErrors.selectedEmployee}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.fullWidth}>
                <Text style={styles.label}>
                  Patient Name <Text style={styles.required}>*</Text>
                </Text>
                {isEditMode ? (
                  <TextInput
                    value={patientName}
                    editable={false}
                    style={styles.disabledInput}
                  />
                ) : (
                  <SelectDropdown
                    key={`patient-${patientName}-${familyMembers.length}-${isEditMode}`}
                    buttonTextAfterSelection={selectedItem =>
                      selectedItem.FAML_NAME
                    }
                    defaultButtonText={patientName || 'Select Patient'}
                    rowTextForSelection={item => item.FAML_NAME}
                    data={familyMembers}
                    onSelect={selectedItem =>
                      handlePatientNameChange(selectedItem)
                    }
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderDropdownIcon={isOpened => (
                      <FontAwesome
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#43C6DB'}
                        size={14}
                      />
                    )}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                    disabled={familyMembers.length === 0}
                  />
                )}
                {formErrors.patientName && (
                  <Text style={styles.errorText}>{formErrors.patientName}</Text>
                )}
              </View>

              <View style={styles.fullWidth}>
                <Text style={styles.label}>
                  Mobile No. <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={mobileNo}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    if (numericText.length <= 10) {
                      setMobileNo(numericText);
                      if (formErrors.mobileNo && numericText.length === 10) {
                        setFormErrors(prev => {
                          const newErrors = {...prev};
                          delete newErrors.mobileNo;
                          return newErrors;
                        });
                      }
                    }
                  }}
                  editable={true}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                />
                {formErrors.mobileNo && (
                  <Text style={styles.errorText}>{formErrors.mobileNo}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>
                    Patient Relation <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={patientRelation}
                    editable={false}
                    style={styles.disabledInput}
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>
                    Admitted On <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={showDatePicker}>
                    <Text style={styles.dateText}>
                      {moment(admittedOn).format('DD-MMM-YYYY HH:mm')}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={22}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    date={admittedOn || new Date()}
                    minimumDate={getMinAdmittedDate()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                  />
                </View>
              </View>

              <View
                style={styles.fullWidth}
                ref={diseaseInputRef}
                onLayout={event => {
                  diseaseInputRef.current = event.nativeEvent.layout.y;
                }}>
                <Text style={styles.label}>
                  Disease <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={diseaseSearchKey}
                  placeholder="Search Disease (min 3 characters)"
                  onChangeText={text => {
                    setDiseaseSearchKey(text);
                    SearchDisease(text);
                  }}
                  onFocus={() => {
                    if (scrollViewRef.current && diseaseInputRef.current) {
                      scrollViewRef.current.scrollTo({
                        y: diseaseInputRef.current - 100,
                        animated: true,
                      });
                    }
                  }}
                  style={styles.input}
                />
                {showDiseaseSuggestions && diseaseSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                      style={{maxHeight: 150}}>
                      {diseaseSuggestions.map((item, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.suggestionItem}
                          onPress={() => handleSelectDisease(item)}>
                          <Text style={styles.suggestionText}>
                            {item.HSDM_CATG || ''} # {item.HSDM_NAME || ''}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {disease !== '' && (
                  <TextInput
                    value={disease}
                    editable={false}
                    style={[styles.disabledInput, {marginTop: 10}]}
                  />
                )}
                {formErrors.disease && (
                  <Text style={styles.errorText}>{formErrors.disease}</Text>
                )}
              </View>

              <View
                style={styles.fullWidth}
                ref={hospitalInputRef}
                onLayout={event => {
                  hospitalInputRef.current = event.nativeEvent.layout.y;
                }}>
                <Text style={styles.label}>
                  Hospital Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={hospitalSearchKey}
                  placeholder="Search Hospital (min 3 characters)"
                  onChangeText={text => {
                    setHospitalSearchKey(text);
                    SearchHospital(text);
                  }}
                  onFocus={() => {
                    if (scrollViewRef.current && hospitalInputRef.current) {
                      scrollViewRef.current.scrollTo({
                        y: hospitalInputRef.current - 100,
                        animated: true,
                      });
                    }
                  }}
                  style={styles.input}
                />
                {showHospitalSuggestions && hospitalSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                      style={{maxHeight: 150}}>
                      {hospitalSuggestions.map((item, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.suggestionItem}
                          onPress={() => handleSelectHospital(item)}>
                          <Text style={styles.suggestionText}>
                            {item.HSPM_NAME || ''} - {item.HSPM_BRANCH || ''}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {hospitalName !== '' && (
                  <TextInput
                    value={hospitalName}
                    editable={false}
                    style={[styles.disabledInput, {marginTop: 10}]}
                  />
                )}
                {formErrors.hospitalName && (
                  <Text style={styles.errorText}>
                    {formErrors.hospitalName}
                  </Text>
                )}
              </View>

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

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Tax Exempted</Text>
                  <Text
                    style={[
                      styles.valueText,
                      taxExempted === 'No' && {
                        color: 'red',
                        fontWeight: 'bold',
                      },
                    ]}>
                    {taxExempted || '-'}
                  </Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Hospital Type</Text>
                  <Text style={styles.valueText}>{hospitalType || '-'}</Text>
                </View>
              </View>

              {(taxExemptedFrom !== '' || taxExemptedTill !== '') && (
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.label}>Tax Exempted From</Text>
                    <Text style={[styles.valueText, styles.taxDateText]}>
                      {taxExemptedFrom || '-'}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.label}>Tax Exempted Till</Text>
                    <Text style={[styles.valueText, styles.taxDateText]}>
                      {taxExemptedTill || '-'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle} Bold>
                Advance Details
              </Text>

              <View style={styles.fullWidth}>
                <Text style={styles.label}>Advance Required</Text>
                <SelectDropdown
                  key={`advancereq-${advanceRequired}-${isEditMode}`}
                  buttonTextAfterSelection={selectedItem => selectedItem.label}
                  defaultButtonText={advanceRequired || 'Select'}
                  rowTextForSelection={item => item.label}
                  data={advanceRequiredOptions}
                  onSelect={selectedItem => {
                    setAdvanceRequired(selectedItem.value);
                    if (selectedItem.value === 'No') {
                      setAdvanceAmount('');
                      // ─── FIX: clear refs before setState
                      attachmentsRef.current = [];
                      deletedServerAttachmentsRef.current = [];
                      setAttachments([]);
                      setDeletedServerAttachments([]);
                    }
                  }}
                  buttonStyle={styles.dropdown2BtnStyle}
                  buttonTextStyle={styles.dropdown2BtnTxtStyle}
                  renderDropdownIcon={isOpened => (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#43C6DB'}
                      size={14}
                    />
                  )}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown2DropdownStyle}
                  rowStyle={styles.dropdown2RowStyle}
                  rowTextStyle={styles.dropdown2RowTxtStyle}
                />
              </View>

              {advanceRequired === 'Yes' && (
                <>
                  <View style={styles.fullWidth}>
                    <Text style={styles.label}>
                      Advance Amount <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      value={advanceAmount}
                      placeholder="Enter advance amount (max 7 digits)"
                      onChangeText={text => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        if (numericText.length <= 7) {
                          setAdvanceAmount(numericText);
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={7}
                      style={styles.input}
                    />
                    {formErrors.advanceAmount && (
                      <Text style={styles.errorText}>
                        {formErrors.advanceAmount}
                      </Text>
                    )}
                  </View>

                  <View style={styles.fullWidth}>
                    <View style={styles.attachmentHeader}>
                      <Text style={styles.label}>
                        Attachments <Text style={styles.required}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={styles.addAttachmentButton}
                        onPress={pickDocument}>
                        <Ionicons
                          name="add-circle"
                          size={24}
                          color={'#43C6DB'}
                        />
                        <Text style={styles.addAttachmentText}>Add File</Text>
                      </TouchableOpacity>
                    </View>

                    {attachments.length > 0 && (
                      <View style={styles.attachmentsList}>
                        {attachments.map(attachment =>
                          renderAttachmentRow(attachment),
                        )}
                      </View>
                    )}

                    {formErrors.attachments && (
                      <Text style={styles.errorText}>
                        {formErrors.attachments}
                      </Text>
                    )}

                    <Text style={styles.attachmentNote}>
                      Note: Only PDF (.pdf), PNG (.png), JPG (.jpg), and JPEG
                      (.jpeg) files are allowed. Maximum file size is{' '}
                      {MAX_FILE_SIZE_MB} MB. File names must not contain special
                      characters or spaces (letters, numbers, hyphens, and
                      underscores only).
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearForm}>
                <Text style={styles.buttonText} Bold>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}>
                <Text style={styles.buttonText} Bold>
                  {isEditMode ? 'Update' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Employee Selection Modal */}
        <RNModal
          transparent={true}
          visible={empModalVisible}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} Bold>
                  Select Employee
                </Text>
                <TouchableOpacity onPress={() => setEmpModalVisible(false)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={30}
                    color={'#43C6DB'}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={employeeData ? [employeeData] : []}
                keyExtractor={item => item.EMPL_ID?.toString()}
                ListEmptyComponent={
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={false}
                    subtitle="Please search for an employee"
                  />
                }
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.employeeItem}
                    onPress={() => handleSelectEmployee(item)}>
                    <Ionicons
                      name="person-circle-outline"
                      size={25}
                      color={'#43C6DB'}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={{fontSize: 16}} Bold>
                        {item.EMPL_NAME || ''}
                      </Text>
                      <Text style={{fontSize: 13, color: '#666'}}>
                        {item.EMPL_DESG_CODE || ''} ,{' '}
                        {item.EMPL_DEPT_CODE || ''} ({item.EMPL_ID || ''})
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={25}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </RNModal>

        {/* Attachment Description Modal */}
        <RNModal
          transparent={true}
          visible={attachmentModalVisible}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} Bold>
                  Add Attachment
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAttachmentModalVisible(false);
                    setCurrentAttachment({
                      file: null,
                      fileName: '',
                      fileDesc: '',
                      order: '1',
                      base64: '',
                    });
                  }}>
                  <Ionicons
                    name="close-circle-outline"
                    size={30}
                    color={'#43C6DB'}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalField}>
                  <Text style={styles.label}>File Name</Text>
                  <Text style={styles.valueText}>
                    {currentAttachment.fileName}
                  </Text>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.label}>
                    File Description <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={currentAttachment.fileDesc}
                    placeholder="Enter file description (e.g., estimate proof)"
                    onChangeText={text =>
                      setCurrentAttachment({
                        ...currentAttachment,
                        fileDesc: text,
                      })
                    }
                    style={styles.input}
                    multiline
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.label}>Order</Text>
                  <Text style={styles.valueText}>
                    {currentAttachment.order}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton, {marginTop: 20}]}
                  onPress={saveAttachment}>
                  <Text style={styles.buttonText} Bold>
                    Save Attachment
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </RNModal>
      </KeyboardAvoidingView>

      {/* File Viewer Modal */}
      <RNModal
        visible={fileViewerModal}
        animationType="slide"
        transparent={false}
        onRequestClose={closeFileViewer}>
        <SafeAreaView style={styles.fileViewerContainer}>
          <View style={styles.fileViewerHeader}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.fileViewerTitle} Bold numberOfLines={1}>
                {selectedFileName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={closeFileViewer}
              style={styles.fileViewerCloseButton}>
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
  container: {flex: 1, backgroundColor: GlobalColor.PrimaryLight},
  scrollView: {flex: 1},
  content: {padding: 15, paddingBottom: 30},
  section: {
    backgroundColor: GlobalColor.White,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#43C6DB',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  column: {flex: 1},
  fullWidth: {marginBottom: 15},
  label: {fontSize: 13, fontWeight: 'bold', marginBottom: 5, color: '#333'},
  valueText: {
    fontSize: 13,
    color: '#666',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  taxDateText: {color: 'red', fontWeight: 'bold'},
  required: {color: 'red'},
  input: {
    borderWidth: 1,
    borderColor: '#43C6DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    backgroundColor: GlobalColor.White,
    height: 40,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#43C6DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    backgroundColor: '#F3F2F1',
    color: '#666',
    height: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: '#43C6DB',
  },
  searchInput: {width: '70%', paddingVertical: 5, fontSize: 13, height: 40},
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#43C6DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: GlobalColor.White,
  },
  dateText: {fontSize: 13, color: '#333'},
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#43C6DB',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: GlobalColor.White,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionText: {fontSize: 13, color: '#333'},
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: {textAlign: 'left', fontSize: 13},
  dropdown2DropdownStyle: {backgroundColor: GlobalColor.White},
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
  },
  dropdown2RowTxtStyle: {textAlign: 'left', fontSize: 13},
  errorText: {color: 'red', fontSize: 12, marginTop: 5},
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#43C6DB',
  },
  addAttachmentText: {
    fontSize: 13,
    color: '#43C6DB',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  attachmentsList: {marginTop: 10},
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  attachmentInfo: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  attachmentActions: {flexDirection: 'row', alignItems: 'center', gap: 4},
  viewAttachmentButton: {padding: 5},
  attachmentFileName: {fontSize: 13, fontWeight: 'bold', color: '#333'},
  attachmentFileDesc: {fontSize: 12, color: '#666', marginTop: 2},
  attachmentOrder: {fontSize: 11, color: '#999', marginTop: 2},
  deleteAttachmentButton: {padding: 5},
  attachmentNote: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {backgroundColor: '#43C6DB'},
  clearButton: {backgroundColor: '#FF9800'},
  buttonText: {color: GlobalColor.White, fontSize: 14},
  spinnerTextStyle: {color: GlobalColor.White},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: GlobalColor.White,
    borderRadius: 10,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  modalTitle: {fontSize: 18, color: '#43C6DB'},
  modalScroll: {maxHeight: 400},
  modalField: {marginBottom: 15},
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#43C6DB',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: GlobalColor.PrimaryLight,
  },
  fileViewerContainer: {flex: 1, backgroundColor: '#525659'},
  fileViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#43C6DB',
  },
  fileViewerTitle: {fontSize: 16, color: '#fff'},
  fileViewerCloseButton: {padding: 5},
  webView: {flex: 1, backgroundColor: '#525659'},
  fileLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#525659',
  },
  fileLoadingText: {fontSize: 16, color: '#fff', marginTop: 15},
  imageScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fullImage: {width: '100%', aspectRatio: 1, minHeight: 300},
});

export default Intimation;
