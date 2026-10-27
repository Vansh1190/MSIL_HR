import React, {
  Component,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';

import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Easing,
  StatusBar,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import Ionicons from 'react-native-vector-icons/Ionicons';

import TouchableCard from '../components/Touchable';

import LinearGradient from 'react-native-linear-gradient';

import {SliderBox} from 'react-native-image-slider-box';

import IconBadge from 'react-native-icon-badge';

import AuthContext from './../context/AuthContext';

import {GlobalColor} from '../constants/Colors';

import {
  HomeTheme as HOME,
  HOME_VISION,
  getTimeGreeting,
} from '../constants/HomeTheme';

import {GlobalFontSize} from '../constants/FontSize';

import Text from '../components/reusable/Text';

import * as ApiService from '../Utils/Utils';

import myconfig from '../Utils/myconfig';

import DeviceInfo from 'react-native-device-info';

import PagerView from 'react-native-pager-view';

import Modal from 'react-native-modal';

import {Decrypt, encrypyDecrypt, encrypyDecryptSHA256} from '../Service/Helper';

import ViewShot from 'react-native-view-shot';

import Share from 'react-native-share';

import {BUSINESSCARD_URL} from '../API/Api';

import QRCode from 'react-native-qrcode-svg';

import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Path, Circle, Rect, Line} from 'react-native-svg';

// === SCAN BIZ CARD: camera launcher ===
import {launchCamera} from 'react-native-image-picker';

// === SCAN BIZ CARD: native contacts module (open OS "Add Contact" UI) ===
import Contacts from 'react-native-contacts';

import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';


// ── Responsive font/size scaler (base width = iPhone 11/standard 375pt) ──
const BASE_WIDTH = 375;
const scale = size => {
  const winW = Dimensions.get('window').width;
  const newSize = size * (winW / BASE_WIDTH);
  return Math.max(size * 0.85, Math.min(newSize, size * 1.15)); // clamp so tablets don't blow up
};

// ── Dynamic cache key scoped per username ──
const getBcCacheKey = username => `bc_card_cache_v1_${username}`;

// === SCAN BIZ CARD: dynamic cache key for AI access check, scoped per username ===
const getScanAccessCacheKey = username => `scan_biz_access_cache_v1_${username}`;

// ────────────────────────────────────────────────
// Utility: title-case
// ────────────────────────────────────────────────
const toTitleCase = str => {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ────────────────────────────────────────────────
// Utility: shorten social media URL to handle only
// ────────────────────────────────────────────────
const getSocialHandle = url => {
  if (!url) return '';
  try {
    const cleaned = url.replace(/\/$/, '');
    const parts = cleaned.split('/');
    const handle = parts[parts.length - 1];
    if (!handle || handle.includes('.')) {
      return cleaned.replace(/^https?:\/\/(www\.)?/, '');
    }
    return `@${handle}`;
  } catch {
    return url;
  }
};

// ────────────────────────────────────────────────
// Helper extractors
// ────────────────────────────────────────────────
const getPhoneNumber = d => {
  if (!d) return '';
  const arr = Array.isArray(d) ? d : [d];
  const chosen =
    arr.find(p => p.phoneType === '3287') ||
    arr.find(p => p.phoneType === '3288') ||
    arr[0];
  return chosen?.phoneNumber ? `+91 ${chosen.phoneNumber}` : '';
};

const getEmail = d => {
  if (!d) return '';
  const arr = Array.isArray(d) ? d : [d];
  const emailAddr =
    (arr.find(e => e.emailType === '3294') || arr[0])?.emailAddress || '';
  return emailAddr.toLowerCase();
};

const getSocialMedia = d => {
  if (!d) return {linkedin: '', instagram: '', facebook: '', twitter: ''};
  const arr = Array.isArray(d) ? d : [d];
  return {
    linkedin:
      arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'LinkedIn')
        ?.url || '',
    instagram:
      arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Instagram')
        ?.url || '',
    facebook:
      arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Facebook')
        ?.url || '',
    twitter:
      arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Twitter/X')
        ?.url || '',
  };
};

// === SCAN BIZ CARD: tiny base64 encoder (UTF-8 safe, no external deps) ===
const B64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const utf8ToBase64 = str => {
  // UTF-8 encode first
  const utf8Bytes = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8Bytes.push(charcode);
    } else if (charcode < 0x800) {
      utf8Bytes.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8Bytes.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    } else {
      // surrogate pair
      i++;
      charcode =
        0x10000 +
        (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8Bytes.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }

  let result = '';
  for (let i = 0; i < utf8Bytes.length; i += 3) {
    const b1 = utf8Bytes[i];
    const b2 = utf8Bytes[i + 1];
    const b3 = utf8Bytes[i + 2];

    const triplet = (b1 << 16) | ((b2 || 0) << 8) | (b3 || 0);

    result += B64_CHARS[(triplet >> 18) & 0x3f];
    result += B64_CHARS[(triplet >> 12) & 0x3f];
    result += b2 !== undefined ? B64_CHARS[(triplet >> 6) & 0x3f] : '=';
    result += b3 !== undefined ? B64_CHARS[triplet & 0x3f] : '=';
  }
  return result;
};

// === SCAN BIZ CARD: build a vCard 3.0 string from scanned contact data (fallback path) ===
const buildVCardFromScan = data => {
  if (!data) return '';
  const name = data.name_english || data.name || '';
  const org = data.company_english || data.company || '';
  const title = data.title_english || data.title || '';
  const phone = data.phone || '';
  const email = data.email || '';
  const address = data.address_english || data.address || '';
  const website = data.website || '';
  const note = data.additional_info_english || data.additional_info || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${name};;;`,
    `FN:${name}`,
  ];
  if (org) lines.push(`ORG:${org}`);
  if (title) lines.push(`TITLE:${title}`);
  if (phone) lines.push(`TEL;TYPE=WORK,VOICE:${phone}`);
  if (email) lines.push(`EMAIL;TYPE=WORK:${email}`);
  if (address) lines.push(`ADR;TYPE=WORK:;;${address};;;;`);
  if (website) lines.push(`URL:${website}`);
  if (note) lines.push(`NOTE:${note.replace(/\n/g, '\\n')}`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
};

// === SCAN BIZ CARD: request contacts permission (Android only; iOS prompts automatically) ===
const requestContactsPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'HR Assist needs access to your contacts to save the scanned business card.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

// === SCAN BIZ CARD: map scanned data -> react-native-contacts record shape ===
const buildContactRecordFromScan = data => {
  if (!data) return null;

  const fullName = (data.name_english || data.name || '').trim();
  const nameParts = fullName.split(' ').filter(Boolean);
  const givenName = nameParts.length ? nameParts[0] : '';
  const familyName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const phone = data.phone || '';
  const email = data.email || '';
  const company = data.company_english || data.company || '';
  const title = data.title_english || data.title || '';
  const address = data.address_english || data.address || '';
  const website = data.website || '';
  const note = data.additional_info_english || data.additional_info || '';

  return {
    givenName,
    familyName,
    displayName: fullName || undefined,
    company,
    jobTitle: title,
    phoneNumbers: phone
      ? [{label: 'work', number: phone}]
      : [],
    emailAddresses: email
      ? [{label: 'work', email}]
      : [],
    postalAddresses: address
      ? [
          {
            label: 'work',
            formattedAddress: address,
            street: address,
            city: '',
            state: '',
            region: '',
            postCode: '',
            country: '',
          },
        ]
      : [],
    urlAddresses: website ? [{label: 'work', url: website}] : [],
    note: note || '',
  };
};

// ────────────────────────────────────────────────
// Snowflake Component
// ────────────────────────────────────────────────
const Snowflake = ({delay}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const [randomX] = useState(Math.random() * Dimensions.get('window').width);
  const [randomSize] = useState(Math.random() * 8 + 4);
  const [randomDuration] = useState(Math.random() * 3000 + 4000);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: randomDuration,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, screenHeight + 50],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          left: randomX,
          transform: [{translateY}],
          opacity,
          width: randomSize,
          height: randomSize,
        },
      ]}
    />
  );
};

// ────────────────────────────────────────────────
// Christmas Greeting Modal Component
// ────────────────────────────────────────────────
const ChristmasGreetingModal = ({visible, onClose}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible]);

  const treeRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });
  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });
  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });
  const glowIntensity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (!visible) return null;

  return (
    <View style={styles.modalFullScreen}>
      <Animated.View
        style={[styles.gradientCircle1, {opacity: glowIntensity}]}
      />
      <Animated.View
        style={[styles.gradientCircle2, {opacity: glowIntensity}]}
      />

      <View style={styles.modalSnowContainer} pointerEvents="none">
        {[...Array(20)].map((_, i) => (
          <Snowflake key={i} delay={i * 150} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.christmasModalContent,
          {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
        ]}>
        <Animated.View
          style={[
            styles.cornerStar,
            styles.topLeftStar,
            {opacity: sparkleOpacity, transform: [{scale: sparkleScale}]},
          ]}>
          <Text style={styles.cornerStarText}>✨</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.cornerStar,
            styles.topRightStar,
            {opacity: sparkleOpacity, transform: [{scale: sparkleScale}]},
          ]}>
          <Text style={styles.cornerStarText}>✨</Text>
        </Animated.View>

        <Animated.View
          style={{transform: [{scale: pulseAnim}, {rotate: treeRotation}]}}>
          <View style={styles.treeContainer}>
            <Text style={styles.christmasEmoji}>🎄</Text>
            <Animated.View style={[styles.starTop, {opacity: sparkleOpacity}]}>
              <Text style={styles.starTopEmoji}>⭐</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.titleContainer}>
          <Text style={styles.christmasTitle}>Merry Christmas</Text>
          <View style={styles.titleUnderline} />
        </View>

        <Text style={styles.christmasSubtitle}>& Happy New Year 2026</Text>

        <View style={styles.christmasDecorations}>
          {['⭐', '🎁', '❄️', '🎅', '🔔'].map((emoji, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: sparkleOpacity,
                transform: [
                  {
                    translateY: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, index % 2 === 0 ? -8 : 8],
                    }),
                  },
                ],
              }}>
              <View style={styles.decorationItem}>
                <Text style={styles.decorationEmoji}>{emoji}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.christmasMessage}>
            Wishing you joy, peace, and prosperity
          </Text>
          <View style={styles.messageDivider}>
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButtonWrapper}
          onPress={onClose}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#2E7D32', '#1B5E20']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Continue</Text>
            <Text style={styles.closeButtonIcon}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomDecoration}>
          <Text style={styles.bottomDecoEmoji}>🎁</Text>
          <Text style={styles.bottomDecoEmoji}>🎄</Text>
          <Text style={styles.bottomDecoEmoji}>🎁</Text>
        </View>
      </Animated.View>
    </View>
  );
};

// ────────────────────────────────────────────────
// === SCAN BIZ CARD: Scanned Contact Preview Modal ===
// ────────────────────────────────────────────────
const ScanBizCardModal = ({
  visible,
  onClose,
  capturedImage,
  onCapture,
  onRetake,
  onSubmit,
  loading,
  scannedContact,
  onSaveContact,
  savingContact,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
      <View style={scanStyles.container}>
        <View style={scanStyles.header}>
          <Text style={scanStyles.headerTitle} Bold>
            Scan Biz Card
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle-outline" size={26} color={GlobalColor.Danger} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={scanStyles.loaderWrap}>
            <ActivityIndicator size="large" color="#2b3087" />
            <Text style={scanStyles.loaderText}>Reading card details…</Text>
          </View>
        ) : scannedContact ? (
          // ── Result preview ──
          <ScrollView contentContainerStyle={scanStyles.resultScroll}>
            <Text style={scanStyles.resultName} Bold>
              {scannedContact.name_english || scannedContact.name || 'N/A'}
            </Text>
            {!!(scannedContact.title_english || scannedContact.title) && (
              <Text style={scanStyles.resultRow}>
                {scannedContact.title_english || scannedContact.title}
              </Text>
            )}
            {!!(scannedContact.company_english || scannedContact.company) && (
              <Text style={scanStyles.resultRow}>
                {scannedContact.company_english || scannedContact.company}
              </Text>
            )}
            {!!scannedContact.phone && (
              <Text style={scanStyles.resultRow}>📞 {scannedContact.phone}</Text>
            )}
            {!!scannedContact.email && (
              <Text style={scanStyles.resultRow}>✉️ {scannedContact.email}</Text>
            )}
            {!!(scannedContact.address_english || scannedContact.address) && (
              <Text style={scanStyles.resultRow}>
                📍 {scannedContact.address_english || scannedContact.address}
              </Text>
            )}
            {!!scannedContact.website && (
              <Text style={scanStyles.resultRow}>🌐 {scannedContact.website}</Text>
            )}
            {!!(scannedContact.additional_info_english || scannedContact.additional_info) && (
              <Text style={scanStyles.resultRow}>
                ℹ️ {scannedContact.additional_info_english || scannedContact.additional_info}
              </Text>
            )}

            <TouchableOpacity
              style={[scanStyles.primaryBtn, savingContact && {opacity: 0.7}]}
              onPress={onSaveContact}
              disabled={savingContact}>
              {savingContact ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="person-add-outline" size={18} color="#fff" />
              )}
              <Text style={scanStyles.primaryBtnText}>
                {savingContact ? 'Opening…' : 'Save to Contacts'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={scanStyles.secondaryBtn} onPress={onRetake}>
              <Text style={scanStyles.secondaryBtnText}>Scan Another Card</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : capturedImage ? (
          // ── Preview captured image, allow submit / retake ──
          <View style={scanStyles.previewWrap}>
            <Image source={{uri: capturedImage}} style={scanStyles.previewImage} />
            <View style={scanStyles.previewBtnRow}>
              <TouchableOpacity style={scanStyles.secondaryBtn} onPress={onRetake}>
                <Text style={scanStyles.secondaryBtnText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={scanStyles.primaryBtn} onPress={onSubmit}>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text style={scanStyles.primaryBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ── Empty state, open camera ──
          <View style={scanStyles.emptyWrap}>
            <Ionicons name="camera-outline" size={64} color="#2B3087" />
            <Text style={scanStyles.emptyText}>
              Capture a clear photo of the business card
            </Text>
            <TouchableOpacity style={scanStyles.primaryBtn} onPress={onCapture}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={scanStyles.primaryBtnText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

// ────────────────────────────────────────────────
// Vision strip — auto-rotating brand statement card
// (pure UI, mirrors the "Our vision" block of the design)
// ────────────────────────────────────────────────
const VisionStrip = ({windowWidth}) => {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setInterval(
      () => setIndex(i => (i + 1) % HOME_VISION.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(10);
    fill.setValue(0);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fill, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  }, [index]);

  const go = i => {
    if (i === index) return;
    setIndex(i);
  };

  return (
    <View style={[homeStyles.visionCard, {width: windowWidth - 32}]}>
      <LinearGradient
        colors={['#FFFFFF', '#EFF6F3']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <View style={homeStyles.visionHead}>
        <Text style={homeStyles.visionKicker} Bold>
          OUR VISION
        </Text>
        <View style={homeStyles.visionRule} />
        <Text style={homeStyles.visionCount}>
          {index + 1} / {HOME_VISION.length}
        </Text>
      </View>

      <View style={homeStyles.visionBody}>
        <Animated.View
          style={{opacity: fade, transform: [{translateY: rise}]}}>
          <Text style={homeStyles.visionText} Bold>
            {HOME_VISION[index]}
          </Text>
        </Animated.View>
      </View>

      <View
        style={homeStyles.visionDots}
        accessibilityRole="tablist"
        accessibilityLabel="Vision statements">
        {HOME_VISION.map((label, i) => (
          <TouchableOpacity
            key={label}
            onPress={() => go(i)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{selected: i === index}}
            accessibilityLabel={`Vision statement ${i + 1}`}
            style={homeStyles.visionDotHit}>
            <View
              style={[
                homeStyles.visionTrack,
                i < index && {backgroundColor: 'rgba(43,131,121,0.35)'},
              ]}>
              {i === index ? (
                <Animated.View
                  style={[
                    homeStyles.visionFill,
                    {
                      width: fill.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────
// Home v2 presentation styles
// ────────────────────────────────────────────────
const homeStyles = StyleSheet.create({
  hero: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingRight: 10,
  },
  brandLabel: {
    color: HOME.onDark,
    fontSize: scale(18),
    letterSpacing: 0.6,
    marginLeft: 8,
  },
  heroBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: HOME.onDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    marginLeft: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: HOME.amber,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    backgroundColor: HOME.tealSoft,
  },
  identityText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  greeting: {
    color: HOME.onDarkSoft,
    fontSize: scale(13),
  },
  userName: {
    color: HOME.onDark,
    fontSize: scale(19),
    marginTop: 1,
  },
  userMeta: {
    color: HOME.onDarkFaint,
    fontSize: scale(11),
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  glassPillText: {
    color: HOME.onDark,
    fontSize: scale(12),
    marginLeft: 6,
  },

  announceCard: {
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: HOME.card,
    borderWidth: 1,
    borderColor: HOME.line,
    shadowColor: '#0B2A25',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  announceBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 11,
    backgroundColor: HOME.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announceBadgeText: {
    color: HOME.tealInk,
    fontSize: scale(10),
    letterSpacing: 0.8,
  },

  visionCard: {
    marginTop: 16,
    marginLeft: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: HOME.line,
    backgroundColor: HOME.card,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0B2A25',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  visionHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visionKicker: {
    color: HOME.teal,
    fontSize: scale(11),
    letterSpacing: 1.6,
  },
  visionRule: {
    flex: 1,
    height: 1,
    marginLeft: 8,
    backgroundColor: 'rgba(43,131,121,0.28)',
  },
  visionCount: {
    color: HOME.muted,
    fontSize: scale(11),
    marginLeft: 8,
  },
  visionBody: {
    height: 52,
    justifyContent: 'center',
    marginTop: 8,
  },
  visionText: {
    color: HOME.tealInk,
    fontSize: scale(17),
    lineHeight: scale(23),
  },
  visionDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: 2,
  },
  visionDotHit: {
    width: 30,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visionTrack: {
    width: 22,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#D8E4E0',
  },
  visionFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: HOME.teal,
  },

  amberBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: HOME.amberSoft,
    borderWidth: 1,
    borderColor: '#EFDDB8',
  },
  amberIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 11,
    backgroundColor: HOME.onDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amberBody: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  amberTitle: {
    color: HOME.amberInk,
    fontSize: scale(13),
  },
  amberSub: {
    color: '#9A7638',
    fontSize: scale(12),
    marginTop: 2,
  },
  whatsnewGif: {
    width: 74,
    height: 26,
    resizeMode: 'contain',
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 2,
  },
  sectionTitle: {
    color: HOME.ink,
    fontSize: scale(16),
  },
  sectionHint: {
    color: HOME.muted,
    fontSize: scale(12),
  },
});

// ────────────────────────────────────────────────
// Home Component
// ────────────────────────────────────────────────
const Home = ({navigation}) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  let usrAccess = AppUserData?.data?.userFlag;
  const [refreshing, setRefreshing] = React.useState(false);

  // ── Business Card modal state ──
  const [BusinessCardModal, setBusinessCardModal] = useState(false);
  const [isShare, setIsShare] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [addressEligibility, setAddressEligibility] = useState('');
  const [bcName, setBcName] = useState('');
  const [bcDesignation, setBcDesignation] = useState('');
  const [bcBusinessUnit, setBcBusinessUnit] = useState('');
  const [bcOffice, setBcOffice] = useState('');
  const [bcMobile, setBcMobile] = useState('');
  const [bcEmail, setBcEmail] = useState('');
  const [bcSocialMedia, setBcSocialMedia] = useState({
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });
  const [bcPhotoUrl, setBcPhotoUrl] = useState(null);
  const [bcCompanyName, setBcCompanyName] = useState('');
  const [bcAddress, setBcAddress] = useState('Address not available');
  const [bcWebsite] = useState('https://www.marutisuzuki.com');
  const [bcLoading, setBcLoading] = useState(false);

  // === SCAN BIZ CARD: access + modal state ===
  const [showScanBizCard, setShowScanBizCard] = useState(false);
  const [isCheckingScanAccess, setIsCheckingScanAccess] = useState(true);
  const [scanBizCardModal, setScanBizCardModal] = useState(false);
  const [scanCapturedImage, setScanCapturedImage] = useState(null); // local uri for preview
  const [scanCapturedBase64, setScanCapturedBase64] = useState(null); // base64 to submit
  const [scanLoading, setScanLoading] = useState(false);
  const [scannedContact, setScannedContact] = useState(null);
  const [savingContact, setSavingContact] = useState(false); // === SCAN BIZ CARD: Add-Contact in progress ===

  const ref = useRef();
  let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  const [img1, setImg1] = React.useState('');
  const [img2, setImg2] = React.useState('');
  const [img3, setImg3] = React.useState('');

  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [selectedId, setSelectedId] = useState('1');

  // Christmas theme state
  const [isWinterThemeActive, setIsWinterThemeActive] = useState(false);
  const [showChristmasModal, setShowChristmasModal] = useState(false);

  // Images for carousel
  const image = [
    'https://swifttest.maruti.co.in/HRAssistWebAPIMVC/Images/1.png?t=' +
      new Date(),
    'https://swifttest.maruti.co.in/HRAssistWebAPIMVC/Images/2.png?t=' +
      new Date(),
    'https://swifttest.maruti.co.in/HRAssistWebAPIMVC/Images/3.png?t=' +
      new Date(),
  ];

  // ────────────────────────────────────────────────
  // AsyncStorage helpers — all scoped to username
  // ────────────────────────────────────────────────
  const readBcCache = async username => {
    try {
      const raw = await AsyncStorage.getItem(getBcCacheKey(username));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeBcCache = async (username, cacheObj) => {
    try {
      await AsyncStorage.setItem(
        getBcCacheKey(username),
        JSON.stringify(cacheObj),
      );
    } catch {
      // silently ignore write errors
    }
  };

  const clearBcCache = async username => {
    try {
      await AsyncStorage.removeItem(getBcCacheKey(username));
    } catch {
      // silently ignore
    }
  };

  const applyBcCache = cache => {
    setBcName(cache.name);
    setBcDesignation(cache.designation);
    setBcOffice(cache.office);
    setBcBusinessUnit(cache.businessUnit);
    setBcMobile(cache.mobile);
    setBcEmail(cache.email);
    setBcSocialMedia(cache.socialMedia);
    setBcPhotoUrl(cache.photoUrl);
    setBcCompanyName(cache.companyName);
    setBcAddress(cache.address);
  };

  // ────────────────────────────────────────────────
  // Send Analytics
  // ────────────────────────────────────────────────
  const SendAnalytics = (PageName) => {
    if (!AppUserData?.data?.userId) {
      return;
    }

    let apiData = {
      StaffNo: AppUserData?.data?.userId,
      DeviceName: DeviceInfo.getBrand(),
      DeviceID: DeviceInfo.getDeviceId(),
      DeviceType: Platform.OS,
      PageName: PageName,
    };

    ApiService.PostMethode('/SubmitAnly', apiData, AppUserData.token, authContext)
      .then(result => {})
      .catch(error => {});
  };

  // ────────────────────────────────────────────────
  // fetchBusinessCard
  // ────────────────────────────────────────────────
  const fetchBusinessCard = useCallback(
    async (forceRefresh = false) => {
      const username = AppUserData?.data?.username;
      if (!username) return;

      if (!forceRefresh) {
        const cached = await readBcCache(username);
        if (cached) {
          applyBcCache(cached);
          return;
        }
      }

      const token = AppUserData.token;
      setBcLoading(true);

      ApiService.PostMethode(
        '/GetBusinessCard',
        {UserName: username},
        token,
        authContext,
      )
        .then(async result => {
          if (!result?.Value) {
            setBcLoading(false);
            return;
          }

          const decryptedData = Decrypt(result.Value);
          const data = JSON.parse(decryptedData);
          if (!data) {
            setBcLoading(false);
            return;
          }

          setCardData(data);

          const empData = data?.EmpEmployment?.EmpEmployment;
          const personalInfo =
            empData?.personNav?.PerPerson?.personalInfoNav?.PerPersonal;
          const phoneInfo = empData?.personNav?.PerPerson?.phoneNav?.PerPhone;
          const emailInfo = empData?.personNav?.PerPerson?.emailNav?.PerEmail;
          const socialInfo =
            empData?.personNav?.PerPerson?.socialAccountNav?.PerSocialAccount;
          const jobInfo = empData?.jobInfoNav?.EmpJob;
          const locationInfo =
            jobInfo?.locationNav?.FOLocation?.addressNavDEFLT
              ?.FOCorporateAddressDEFLT;
          const photoArray = empData?.photoNav?.Photo;

          const salutation = (
            personalInfo?.salutationNav?.PicklistOption?.localeLabel || ''
          ).toUpperCase();
          const firstName = (personalInfo?.firstName || '').toUpperCase();
          const lastName = (personalInfo?.lastName || '').toUpperCase();
          const middleName = (personalInfo?.middleName || '').toUpperCase();

          const name =
            [salutation, firstName, middleName, lastName]
              .filter(Boolean)
              .join(' ') || 'EMPLOYEE NAME';

          const designation = (
            jobInfo?.customString21 || 'DESIGNATION'
          ).toUpperCase();
          const officeValue = (data?.Office || '').toUpperCase();

          const businessUnitFromAPI = (
            jobInfo?.businessUnitNav?.FOBusinessUnit?.description ||
            jobInfo?.businessUnitNav?.FOBusinessUnit?.name ||
            ''
          ).toUpperCase();

          const isMatch =
            officeValue &&
            businessUnitFromAPI &&
            officeValue.toLowerCase() === businessUnitFromAPI.toLowerCase();

          const resolvedBusinessUnit = isMatch ? '' : businessUnitFromAPI;

          const mobile = getPhoneNumber(phoneInfo);
          const email = getEmail(emailInfo);
          const socialMedia = getSocialMedia(socialInfo);

          const photoData = Array.isArray(photoArray)
            ? photoArray.find(p => p.photoType === '1')
            : photoArray?.photoType === '1'
            ? photoArray
            : null;
          const photoUrl = photoData?.photo
            ? `data:image/jpeg;base64,${photoData.photo.replace(/\s+/g, '')}`
            : null;

          const companyName = toTitleCase(
            jobInfo?.companyNav?.FOCompany?.name || 'Maruti Suzuki India Ltd.',
          );

          setBcName(name);
          setBcDesignation(designation);
          setBcOffice(officeValue);
          setBcBusinessUnit(resolvedBusinessUnit);
          setBcMobile(mobile);
          setBcEmail(email);
          setBcSocialMedia(socialMedia);
          setBcPhotoUrl(photoUrl);
          setBcCompanyName(companyName);

          const userId = empData?.userId || '';
          const consentId = '778';

          ApiService.PostMethode(
            '/BusinessCardElig',
            {ConsentID: consentId, EmplID: userId},
            token,
            authContext,
          )
            .then(async eligResult => {
              const eligibility = eligResult?.Value || '';
              setAddressEligibility(eligibility);

              let resolvedAddress = 'Address not available';

              if (eligibility === '' || eligibility === null) {
                const homeAddresses =
                  empData?.personNav?.PerPerson?.homeAddressNavDEFLT
                    ?.PerAddressDEFLT;
                const homeAddr = Array.isArray(homeAddresses)
                  ? homeAddresses.find(a => a.addressType === 'IN_O')
                  : homeAddresses?.addressType === 'IN_O'
                  ? homeAddresses
                  : null;

                if (homeAddr) {
                  const parts = [
                    toTitleCase(homeAddr.address1 || ''),
                    toTitleCase(homeAddr.address2 || ''),
                    toTitleCase(homeAddr.address3 || ''),
                    [
                      toTitleCase(homeAddr.city || ''),
                      toTitleCase(
                        homeAddr.stateNav?.PicklistOption?.localeLabel || '',
                      ),
                      homeAddr.zipCode,
                    ]
                      .filter(Boolean)
                      .join(', '),
                  ].filter(Boolean);
                  resolvedAddress = parts.join('\n');
                }
              } else if (
                eligibility.includes('not elgibile') ||
                eligibility.includes('not eligible')
              ) {
                const parts = [
                  companyName,
                  toTitleCase(locationInfo?.address1 || ''),
                  toTitleCase(locationInfo?.address2 || ''),
                  toTitleCase(locationInfo?.address3 || ''),
                  [
                    toTitleCase(locationInfo?.city || ''),
                    toTitleCase(
                      locationInfo?.stateNav?.PicklistOption?.localeLabel || '',
                    ),
                    locationInfo?.zipCode,
                  ]
                    .filter(Boolean)
                    .join(', '),
                ].filter(Boolean);
                resolvedAddress = parts.join('\n');
              }

              setBcAddress(resolvedAddress);

              const cacheObj = {
                name,
                designation,
                office: officeValue,
                businessUnit: resolvedBusinessUnit,
                mobile,
                email,
                socialMedia,
                photoUrl,
                companyName,
                address: resolvedAddress,
              };
              await writeBcCache(username, cacheObj);

              setBcLoading(false);
            })
            .catch(error => {
              setBcLoading(false);
              ApiService.showErrorMessage(error, authContext);
            });
        })
        .catch(error => {
          setBcLoading(false);
          ApiService.showErrorMessage(error, authContext);
        });
    },
    [AppUserData],
  );

  const buildShareUrl = () => {
    const userId = AppUserData?.data?.userId || '';
    const now = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const sysdate = `${String(now.getDate()).padStart(2, '0')}-${
      months[now.getMonth()]
    }-${now.getFullYear()}`;
    const encryptedId = encrypyDecrypt(`${userId}#${sysdate}`);
    const urlSafe = encryptedId
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return {url: `${BUSINESSCARD_URL}${urlSafe}`, sysdate};
  };

  // ────────────────────────────────────────────────
  // handleShareBusinessCard
  // ────────────────────────────────────────────────
  const handleShareBusinessCard = () => {
    try {
      const userId = AppUserData?.data?.userId || '';
      const now = new Date();
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const pad = (n) => String(n).padStart(2, '0');

      const sysdate = `${pad(now.getDate())}-${months[now.getMonth()]}-${now.getFullYear()}`;
      const sysTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const generatedOn = `${sysdate} ${sysTime}`;
      const expiryOn = `${sysdate} 23:59:00`;

      const combined = `${userId}#${sysdate}`;
      const encryptedId = encrypyDecrypt(combined);
      const urlSafe = encryptedId
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const shareUrl = `${BUSINESSCARD_URL}${urlSafe}`;

      Alert.alert(
        'Share Business Card',
        `This link was generated on ${generatedOn} and will be valid till ${expiryOn}.\n\nDo you want to continue?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Share',
            onPress: () => {
              Share.open({
                message: `Hi, I'm ${bcName}\nHere is my Business Card Link: ${shareUrl}\n\n The link is valid till: ${expiryOn}.`,
                title: 'My Business Card',
              }).catch(() => {});
            },
          },
        ],
      );
    } catch (error) {}
  };

  const showBusinessCardModal = async () => {
    SendAnalytics("Business Card");
    setBusinessCardModal(true);
    const username = AppUserData?.data?.username;
    const cached = await readBcCache(username);
    if (cached) {
      applyBcCache(cached);
    } else {
      fetchBusinessCard();
    }
  };

  const handleRefreshBusinessCard = async () => {
    const username = AppUserData?.data?.username;
    await clearBcCache(username);
    fetchBusinessCard(true);
  };

  // === SCAN BIZ CARD: access control check (mirrors checkAIAccess in Tabs.js) ===
  // Reads any cached result first and applies it immediately (no loading flash on
  // repeat visits), then silently refreshes from the API in the background. This
  // is what stops the Scan Biz Card / What's New row from flickering every time
  // this screen regains focus.
  const checkScanBizCardAccess = useCallback(async () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData?.token;
    let username = AppUserData?.data?.username;

    let apiData = {
      EmplID: userId,
      ConsentID: '779', // TODO: replace with a dedicated ConsentID for Scan Biz Card once backend provisions one
    };

    let hadCache = false;
    try {
      const cached = await AsyncStorage.getItem(getScanAccessCacheKey(username));
      if (cached !== null) {
        hadCache = true;
        setShowScanBizCard(cached === '1');
        setIsCheckingScanAccess(false);
      }
    } catch {
      // ignore cache read errors, fall through to API check below
    }

    // Only show the "checking access" state on the very first, uncached check
    // for this user — subsequent focuses reuse the cached value silently.
    if (!hadCache) {
      setIsCheckingScanAccess(true);
    }

    ApiService.PostMethode('/CheckAIAccess', apiData, token, authContext)
      .then(async result => {
        const hasAccess = !result?.Value || result?.Value === '';
        setShowScanBizCard(hasAccess);
        setIsCheckingScanAccess(false);
        try {
          await AsyncStorage.setItem(
            getScanAccessCacheKey(username),
            hasAccess ? '1' : '0',
          );
        } catch {
          // ignore cache write errors
        }
      })
      .catch(error => {
        setIsCheckingScanAccess(false);
        // If we already had a cached value applied above, keep it as-is instead
        // of forcing it back to false — avoids an extra visible flicker.
        if (!hadCache) {
          setShowScanBizCard(false);
        }
        ApiService.showErrorMessage(error, authContext);
      });
  }, [AppUserData]);

  // === SCAN BIZ CARD: open camera and capture image ===
 // === SCAN BIZ CARD: open camera and capture image ===
const handleOpenScanCamera = () => {
  launchCamera(
    {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false, // we'll resize first, then base64 the resized file
      saveToPhotos: false,
      cameraType: 'back',
    },
    async response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Camera Error',
          response.errorMessage || 'Could not capture image. Please try again.',
        );
        return;
      }

      const asset = response.assets && response.assets[0];
      if (!asset?.uri) {
        Alert.alert('Error', 'No image was captured. Please try again.');
        return;
      }

      try {
        // Resize/compress before encoding — a business card only needs to be
        // legible, not full camera resolution. This keeps the base64 payload
        // well under the size where the ssl-pinning bridge call has been
        // observed to corrupt/truncate large JSON string bodies.
        const resized = await ImageResizer.createResizedImage(
          asset.uri,
          1280,   // max width
          1280,   // max height
          'JPEG',
          70,     // quality
          0,      // rotation
        );

        setScanCapturedImage(resized.uri);

        const base64Data = await RNFS.readFile(resized.uri, 'base64');

        if (!base64Data) {
          setScanCapturedImage(null);
          setScanCapturedBase64(null);
          Alert.alert('Error', 'Failed to process the captured image. Please retake the photo.');
          return;
        }

        setScanCapturedBase64(base64Data);
      } catch (e) {
        setScanCapturedImage(null);
        setScanCapturedBase64(null);
        Alert.alert('Error', 'Failed to process the captured image. Please retake the photo.');
      }
    },
  );
};

  const handleRetakeScan = () => {
    setScanCapturedImage(null);
    setScanCapturedBase64(null);
    setScannedContact(null);
    handleOpenScanCamera();
  };

  const handleOpenScanModal = () => {
    SendAnalytics("Scan Biz Card");
    setScanCapturedImage(null);
    setScanCapturedBase64(null);
    setScannedContact(null);
    setScanBizCardModal(true);
  };

  const handleCloseScanModal = () => {
    setScanBizCardModal(false);
    setScanCapturedImage(null);
    setScanCapturedBase64(null);
    setScannedContact(null);
    setScanLoading(false);
  };

  // === SCAN BIZ CARD: submit captured image to ScanBusinessCard API ===
  // === SCAN BIZ CARD: submit captured image to ScanBusinessCard API ===
const handleSubmitScanBizCard = () => {
  if (!scanCapturedBase64 || scanCapturedBase64.length < 100) {
    Alert.alert('Error', 'No valid image captured. Please retake the photo.');
    return;
  }

  // Base64 length should always be a multiple of 4 — a quick structural
  // check that catches truncated/corrupted strings before hitting the API.
  if (scanCapturedBase64.length % 4 !== 0) {
    Alert.alert(
      'Error',
      'The captured image appears corrupted. Please retake the photo.',
    );
    return;
  }

  const username = AppUserData?.data?.username;
  const token = AppUserData?.token;

  const payload = {
    UserName: username,
    ImageFormat: 'jpeg',
    Image: scanCapturedBase64,
  };

  setScanLoading(true);

  ApiService.PostMethode('/ScanBusinessCard', payload, token, authContext)
    .then(result => {
      if (!result?.Value) {
        setScanLoading(false);
        Alert.alert('Error', 'Could not read the business card. Please try again.');
        return;
      }

      try {
        // Outer AES decryption -> {"Value": "{...inner json string...}"}
        const decryptedOuter = Decrypt(result.Value);
        const outerJson = JSON.parse(decryptedOuter);

        // Inner JSON string -> {"success": true, "data": {...}}
        const innerJson = JSON.parse(outerJson.Value);

        setScanLoading(false);

        if (innerJson?.success && innerJson?.data) {
          setScannedContact(innerJson.data);
        } else {
          Alert.alert('Error', 'Business card details could not be extracted.');
        }
      } catch (e) {
        setScanLoading(false);
        Alert.alert('Error', 'Failed to process the scanned business card.');
      }
    })
    .catch(error => {
      setScanLoading(false);
      ApiService.showErrorMessage(error, authContext);
    });
};

  // === SCAN BIZ CARD: open the native "Add Contact" screen, pre-filled with scanned data ===
  const handleSaveScannedContact = async () => {
    if (!scannedContact) {
      Alert.alert('Error', 'No contact data to save.');
      return;
    }

    setSavingContact(true);

    try {
      const hasPermission = await requestContactsPermission();
      if (!hasPermission) {
        setSavingContact(false);
        Alert.alert(
          'Permission Required',
          'Contacts permission is needed to save this card. You can still save it as a file instead.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Save as File', onPress: handleSaveScannedContactFallback},
          ],
        );
        return;
      }

      const record = buildContactRecordFromScan(scannedContact);
      if (!record) {
        setSavingContact(false);
        Alert.alert('Error', 'No contact data to save.');
        return;
      }

      // openContactForm shows the native "Create Contact" screen, pre-filled,
      // and lets the user review/edit and tap Save themselves — same UX as
      // saving a contact normally from the Phone/Contacts app.
      await Contacts.openContactForm({
        ...record,
        isNew: true,
      });

      setSavingContact(false);
    } catch (error) {
      setSavingContact(false);
      // Fallback to vCard share if the native form isn't available on this device/build
      Alert.alert(
        'Could not open Contacts',
        'Would you like to save this card as a file instead?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Save as File', onPress: handleSaveScannedContactFallback},
        ],
      );
    }
  };

  // === SCAN BIZ CARD: vCard share fallback (used only if native contact form fails) ===
  const handleSaveScannedContactFallback = () => {
    try {
      const vcard = buildVCardFromScan(scannedContact);
      if (!vcard) {
        Alert.alert('Error', 'No contact data to save.');
        return;
      }

      const base64Vcard = utf8ToBase64(vcard);

      Share.open({
        url: `data:text/vcard;base64,${base64Vcard}`,
        filename: 'contact',
        type: 'text/vcard',
        title: 'Save Contact',
      }).catch(() => {});
    } catch (e) {
      Alert.alert('Error', 'Unable to save contact.');
    }
  };

  // Check theme status from API
  const checkThemeStatus = () => {
    let token = AppUserData.token;
    ApiService.PostMethode(
      '/GetThemeCutoff',
      {ThemeName: 'WINTER_THEME'},
      token,
      authContext,
    )
      .then(result => {
        if (result.Result === 'Y') {
          setIsWinterThemeActive(true);
          setTimeout(() => setShowChristmasModal(true), 1000);
        } else {
          setIsWinterThemeActive(false);
        }
      })
      .catch(error => {
        setIsWinterThemeActive(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const handleCloseChristmasModal = () => setShowChristmasModal(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(false);
    setTimeout(() => setRefreshing(true), 2000);
  }, []);

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {}
  };

  const showBanner = () => {
    let token = AppUserData.token;
    let apiData = {UserName: AppUserData?.data?.username};
    setLoader(true);
    ApiService.PostMethode('/GetEmployeeProfile', apiData, token, authContext)
      .then(result => stopLoader(false))
      .catch(error => {
        stopLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const checkAppUpdate = () => {
    showBanner();
    let versionfromplug = '2.1.8';
    let appname = 'HR ASSIST';
    let devicetype = 'IOS';
    let apiData = {
      AppName: appname,
      DeviceType: devicetype,
      Version: versionfromplug,
    };
    let token = AppUserData.token;

    ApiService.PostMethode('/CheckAppVersion', apiData, token, authContext)
      .then(result => {
        if (result.Result) {
          let vesionNo = result.Result.split('~');
          if (vesionNo[1] != versionfromplug) {
            Alert.alert(
              'New Update',
              "Please update the app to Newer version by downloading and installing the app.\nPlease check the What's New section after installing the newer version for latest updates",
              [{text: 'OK', onPress: () => Linking.openURL(vesionNo[0])}],
            );
          }
        }
      })
      .catch(error => ApiService.showErrorMessage(error, authContext));
  };

  useFocusEffect(
    useCallback(() => {
      // Home hero is dark teal → light status bar while this screen is focused
      StatusBar.setBarStyle('light-content', true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(HOME.teal, true);
      }

      checkAppUpdate();
      checkThemeStatus();
      checkScanBizCardAccess(); // === SCAN BIZ CARD ===
      onRefresh();

      return () => {
        StatusBar.setBarStyle('default', true);
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('#61dafb', true);
        }
      };
    }, []),
  );

  // ── Precompute brand panel dimensions once ──
  const WIN_H = Dimensions.get('window').height;
  const WIN_W = Dimensions.get('window').width;
  // Card occupies 95% of screen width; brand panel is 17% of that
  const CARD_W = WIN_W * 0.95;
  const BRAND_W = Math.round(CARD_W * 0.17);
  const MAIN_W = CARD_W - BRAND_W;
  // Card height = 88% of screen (more height = closer to full-page feel of website)
  const CARD_H = WIN_H * 0.88;

  // === Whether Scan Biz Card is currently visible on this row (access resolved + granted) ===
  const scanBizCardVisible =
    usrAccess !== 'Y' && !isCheckingScanAccess && showScanBizCard;

  // ── Hero meta (real fields already present in auth context) ──
  const empMeta = [
    AppUserData?.data?.userId,
    AppUserData?.data?.userDept,
    AppUserData?.data?.empllocn,
  ]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <SafeAreaView style={{flexGrow: 1, backgroundColor: HOME.teal}}>
      {/* Snowflakes Background */}
      {isWinterThemeActive && (
        <View style={styles.snowContainer} pointerEvents="none">
          {[...Array(30)].map((_, i) => (
            <Snowflake key={i} delay={i * 200} />
          ))}
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}>
        {/* ── Hero: identity + utilities ── */}
        <LinearGradient
          colors={[HOME.tealGlow, HOME.teal, HOME.tealDeep]}
          start={{x: 0.92, y: 0}}
          end={{x: 0.05, y: 1}}
          style={homeStyles.hero}>
          <View style={homeStyles.heroBar}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.75}
              style={homeStyles.brandPill}>
              <Ionicons name="menu-outline" size={24} color={HOME.onDark} />
              <Text style={homeStyles.brandLabel} Bold>
                HR Assist
              </Text>
            </TouchableOpacity>

            <View style={homeStyles.heroBarRight}>
              <View style={homeStyles.logoChip}>
                <Image
                  style={styles.tinyLogo}
                  source={require('./../assets/Images/mslogo.png')}
                />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}
                activeOpacity={0.75}
                style={homeStyles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel="Notifications">
                <Feather name="bell" color={HOME.onDark} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={homeStyles.identityRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.85}
              accessibilityLabel="My profile"
              style={homeStyles.avatarRing}>
              {AppUserData.data && AppUserData.data.profile_photo ? (
                <Image
                  source={{uri: AppUserData.data.profile_photo}}
                  style={homeStyles.avatar}
                />
              ) : (
                <Image
                  source={require('../assets/Images/Avtar.png')}
                  style={homeStyles.avatar}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.85}
              style={homeStyles.identityText}>
              <Text style={homeStyles.greeting}>{getTimeGreeting()}</Text>
              <Text style={homeStyles.userName} Bold numberOfLines={1}>
                {AppUserData.data && AppUserData?.data?.EMPL_NAME
                  ? AppUserData?.data?.EMPL_NAME
                  : 'User'}
              </Text>
              {!!empMeta && (
                <Text style={homeStyles.userMeta} numberOfLines={1}>
                  {empMeta}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={homeStyles.pillRow}>
            {/* Shown whenever Scan Card is not visible (covers usrAccess === 'Y' too) */}
            {!scanBizCardVisible && (
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                activeOpacity={0.8}
                style={homeStyles.glassPill}>
                <Ionicons name="person-outline" size={15} color={HOME.amber} />
                <Text style={homeStyles.glassPillText} Bold>
                  My Profile
                </Text>
              </TouchableOpacity>
            )}

            {usrAccess !== 'Y' && (
              <TouchableOpacity
                onPress={() => showBusinessCardModal()}
                activeOpacity={0.8}
                style={homeStyles.glassPill}>
                <Ionicons name="card-outline" size={15} color={HOME.amber} />
                <Text style={homeStyles.glassPillText} Bold>
                  Business Card
                </Text>
              </TouchableOpacity>
            )}

            {/* === SCAN BIZ CARD: same access rule and handler as before === */}
            {scanBizCardVisible && (
              <TouchableOpacity
                onPress={handleOpenScanModal}
                activeOpacity={0.8}
                style={homeStyles.glassPill}>
                <Ionicons name="camera-outline" size={15} color={HOME.amber} />
                <Text style={homeStyles.glassPillText} Bold>
                  Scan Card
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* ── Announcements carousel (same images, same autoplay loop) ── */}
        <View style={homeStyles.announceCard}>
          <View style={homeStyles.announceBadge}>
            <Text style={homeStyles.announceBadgeText} Bold>
              ANNOUNCEMENTS
            </Text>
          </View>
          <SliderBox
            images={image}
            autoplay={true}
            circleLoop={true}
            style={styles.carouselimg}
            sliderBoxHeight={scale(168)}
            resizeMode={'cover'}
          />
        </View>

        <VisionStrip windowWidth={WIN_W} />

        {/* ── What's new (same visibility rule + navigation) ── */}
        {usrAccess == 'Y' ? null : (
          <TouchableOpacity
            onPress={() => navigation.navigate('Whatsnew')}
            activeOpacity={0.85}
            style={homeStyles.amberBanner}>
            <View style={homeStyles.amberIcon}>
              <Ionicons name="sparkles-outline" size={18} color={HOME.teal} />
            </View>
            <View style={homeStyles.amberBody}>
              <Text style={homeStyles.amberTitle} Bold>
                New in this release
              </Text>
              <Text style={homeStyles.amberSub} numberOfLines={1}>
                See what the HR team has added
              </Text>
            </View>
            <Image
              style={homeStyles.whatsnewGif}
              source={require('./../assets/Images/whats_new.gif')}
            />
            <Ionicons
              name="chevron-forward"
              size={18}
              color={HOME.amberInk}
            />
          </TouchableOpacity>
        )}

        {/* ── Quick actions ── */}
        <View style={homeStyles.sectionHead}>
          <Text style={homeStyles.sectionTitle} Bold>
            Quick actions
          </Text>
          <Text style={homeStyles.sectionHint}>Tap a service to open</Text>
        </View>
        <TouchableCard navigation={navigation} design="v2" />
      </ScrollView>

      {/* ─────────────────────────────────────────────────────
          BUSINESS CARD MODAL
          Mirrors BusinessCard.jsx / Businesscard.css exactly:
          • bc-card  → row, 83% main + 17% brand
          • bc-main  → column, full height, scrollable
          • bc-brand → #2B3087, rotated logo
         ───────────────────────────────────────────────────── */}
      <Modal
        isVisible={BusinessCardModal}
        transparent={true}
        style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
        <ViewShot
          ref={ref}
          options={{fileName: 'BusinessCard', format: 'jpg', quality: 0.9}}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          {/* ── bc-card ── */}
          <View style={[bcStyles.card, {width: CARD_W, height: CARD_H}]}>
            {/* ── bc-main (83% of card width) ── */}
            <View style={[bcStyles.main, {width: MAIN_W}]}>
              {/* Close button — absolute top-right */}
              {isShare && (
                <TouchableOpacity
                  onPress={() => setBusinessCardModal(false)}
                  style={bcStyles.closeBtn}>
                  <Ionicons
                    name="close-circle-outline"
                    size={26}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              )}

              {bcLoading ? (
                /* ── Loading state ── */
                <View style={bcStyles.loaderWrap}>
                  <ActivityIndicator size="large" color="#2b3087" />
                  <Text style={bcStyles.loaderText}>Loading card…</Text>
                </View>
              ) : (
                /* ── Scrollable card content ── */
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={bcStyles.scrollContent}
                  bounces={false}>
                  {/* ── bc-profile-section ── */}
                  <View style={bcStyles.profileSection}>
                    {/* bc-avatar-wrap: 100×100 */}
                    <View style={bcStyles.avatarWrap}>
                      {bcPhotoUrl ? (
                        <Image
                          source={{uri: bcPhotoUrl}}
                          style={bcStyles.avatar}
                        />
                      ) : AppUserData?.data?.profile_photo ? (
                        <Image
                          source={{uri: AppUserData.data.profile_photo}}
                          style={bcStyles.avatar}
                        />
                      ) : (
                        <View
                          style={[bcStyles.avatar, bcStyles.avatarPlaceholder]}>
                          <Text style={bcStyles.avatarInitial}>
                            {bcName ? bcName.charAt(0) : '?'}
                          </Text>
                        </View>
                      )}

                      {/* bc-li-badge — LinkedIn icon on avatar */}
                      {!!bcSocialMedia.linkedin && (
                        <TouchableOpacity
                          style={bcStyles.liBadge}
                          onPress={() =>
                            Linking.openURL(bcSocialMedia.linkedin)
                          }
                          activeOpacity={0.7}>
                          <Image
                            source={require('../assets/Images/LinkedIn_icon.svg.png')}
                            style={bcStyles.liBadgeImg}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* bc-name-block */}
                    <View style={bcStyles.nameBlock}>
                      {/* bc-name: 20px, 600, UPPERCASE */}
                      <Text style={bcStyles.nameText} numberOfLines={2}>
                        {bcName}
                      </Text>
                      {/* bc-designation: 14px, 500, UPPERCASE */}
                      {!!bcDesignation && (
                        <Text style={bcStyles.designationText}>
                          {bcDesignation}
                        </Text>
                      )}
                      {/* bc-department: 13px, 400, UPPERCASE */}
                      {!!bcOffice && (
                        <Text style={bcStyles.departmentText}>{bcOffice}</Text>
                      )}
                      {!!bcBusinessUnit && (
                        <Text style={bcStyles.departmentText}>
                          {bcBusinessUnit}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* bc-divider */}
                  <View style={bcStyles.divider} />

                  {/* ── bc-contacts ── */}
                  <View style={bcStyles.contacts}>
                    {/* Phone */}
                    {!!bcMobile && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${bcMobile}`)}>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink} numberOfLines={1}>
                            {bcMobile}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Email */}
                    {!!bcEmail && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${bcEmail}`)}>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Rect x="2" y="4" width="20" height="16" rx="2" />
                              <Path d="M22 7l-10 7L2 7" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink} numberOfLines={1}>
                            {bcEmail}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* LinkedIn */}
                    {!!bcSocialMedia.linkedin && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(bcSocialMedia.linkedin)}>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                              <Circle cx="4" cy="4" r="2" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink}>
                            LinkedIn Profile
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Instagram */}
                    {!!bcSocialMedia.instagram && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(bcSocialMedia.instagram)
                        }>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5"
                                ry="5"
                              />
                              <Path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                              <Line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink}>
                            Instagram Profile
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Facebook */}
                    {!!bcSocialMedia.facebook && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(bcSocialMedia.facebook)}>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink}>
                            Facebook Profile
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Twitter / X */}
                    {!!bcSocialMedia.twitter && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(bcSocialMedia.twitter)}>
                        <View style={bcStyles.contactRow}>
                          <View style={bcStyles.iconWrap}>
                            <Svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              width={20}
                              height={20}>
                              <Path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </Svg>
                          </View>
                          <Text style={bcStyles.contactLink}>Twitter / X</Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Address — bc-contact-row--top (align-items: flex-start) */}
                    <View
                      style={[bcStyles.contactRow, {alignItems: 'flex-start'}]}>
                      <View style={[bcStyles.iconWrap, {marginTop: 2}]}>
                        <Svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width={20}
                          height={20}>
                          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <Circle cx="12" cy="10" r="3" />
                        </Svg>
                      </View>
                      <Text style={bcStyles.addressText}>{bcAddress}</Text>
                    </View>
                  </View>

                  {/* ── bc-footer-row ── */}
                  <View style={bcStyles.footerRow}>
                    {/* bc-qr-wrap: 80×80 matching website */}
                    <View style={bcStyles.qrWrap}>
                      <QRCode
                        value={buildShareUrl().url}
                        logo={{uri: base64Logo}}
                        logoSize={10}
                        size={80}
                        logoBackgroundColor="transparent"
                      />
                    </View>

                    {/* bc-website-row */}
                    <View style={bcStyles.websiteRow}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(bcWebsite)}
                        style={{flex: 1}}>
                        <Text style={bcStyles.websiteLink} numberOfLines={1}>
                          {bcWebsite}
                        </Text>
                      </TouchableOpacity>

                      {/* bc-action-btns */}
                      <View style={bcStyles.actionBtns}>
                        {isShare && (
                          <TouchableOpacity
                            style={bcStyles.actionBtn}
                            onPress={handleShareBusinessCard}>
                            <Ionicons
                              name="share-social-outline"
                              size={20}
                              color="#444444"
                            />
                          </TouchableOpacity>
                        )}
                        {isShare && (
                          <TouchableOpacity
                            style={bcStyles.actionBtn}
                            onPress={handleRefreshBusinessCard}>
                            <Ionicons
                              name="refresh-outline"
                              size={20}
                              color="#444444"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>

            {/* ── bc-brand (17% width, #2B3087, rotated logo) ── */}
            <View style={[bcStyles.brandPanel, {width: BRAND_W}]}>
              <View
                style={{width: BRAND_W, height: '100%', overflow: 'hidden'}}>
                <Image
                  source={require('../assets/Images/maruti_logo.png')}
                  tintColor="#ffffff"
                  style={{
                    width: CARD_H * 0.48,
                    height: BRAND_W * 1.4,
                    resizeMode: 'contain',
                    transform: [
                      {rotate: '90deg'},
                      {translateX: CARD_H * 0.7 - BRAND_W * 0.5}, // simplified from your formula
                      {translateY: (CARD_H * 0.48 - BRAND_W) / 2},
                    ],
                  }}
                />
              </View>
            </View>
          </View>
        </ViewShot>
      </Modal>

      {/* === SCAN BIZ CARD: Scan modal (independent of Business Card modal) === */}
      <ScanBizCardModal
        visible={scanBizCardModal}
        onClose={handleCloseScanModal}
        capturedImage={scanCapturedImage}
        onCapture={handleOpenScanCamera}
        onRetake={handleRetakeScan}
        onSubmit={handleSubmitScanBizCard}
        loading={scanLoading}
        scannedContact={scannedContact}
        onSaveContact={handleSaveScannedContact}
        savingContact={savingContact}
      />

      {/* Christmas Greeting Modal */}
      {isWinterThemeActive && showChristmasModal && (
        <Modal
          visible={showChristmasModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseChristmasModal}
          statusBarTranslucent={true}>
          <ChristmasGreetingModal
            visible={showChristmasModal}
            onClose={handleCloseChristmasModal}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────
// Business Card styles — exact port of Businesscard.css
//
// CSS → RN mapping reference:
//   bc-avatar-wrap    100×100   →  avatarWrap  100×100
//   bc-avatar         100×100 circle  →  avatar  100×100, borderRadius 50
//   bc-name           20px 600 UPPER  →  nameText
//   bc-designation    14px 500 UPPER  →  designationText
//   bc-department     13px 400 UPPER  →  departmentText
//   bc-divider        1px #dee2e6, margin 16 0 24 16  →  divider
//   bc-contacts       paddingLeft 24  →  contacts
//   bc-contact-row    gap 20, pb 12   →  contactRow (gap via iconWrap + flex)
//   bc-icon           40×40, svg 20×20  →  iconWrap 40×40, SVG 20×20
//   bc-contact-link   13px 400        →  contactLink
//   bc-address        13px 400        →  addressText
//   bc-qr-wrap        80×80           →  qrWrap
//   bc-footer-row     padding 8 16    →  footerRow
//   bc-website-link   13px 400        →  websiteLink
//   bc-brand          17%, #2B3087    →  brandPanel
// ─────────────────────────────────────────────────────
const bcStyles = StyleSheet.create({
  // bc-card
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderRadius: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  // bc-main (width set inline = 83% of card)
  main: {
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 20,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
 loaderText: {
  marginTop: 12,
  fontSize: scale(13),   // was 14
  color: '#555555',
  fontWeight: '500',
},

  // bc-profile-section: column, align flex-start, pt 16, pl 16, pr 16
  profileSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },

  // bc-avatar-wrap: 100×100, mb 12, mt 12
  avatarWrap: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 12,
    marginTop: 12,
  },

  // bc-avatar: 100×100 circle, no border
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0,
  },

  // bc-avatar-placeholder: #1a3490 bg, white 36px initial
  avatarPlaceholder: {
    backgroundColor: '#1a3490',
    justifyContent: 'center',
    alignItems: 'center',
  },
 avatarInitial: {
  color: '#ffffff',
  fontSize: scale(34),   // was 36
  fontWeight: '700',
},

  // bc-li-badge: absolute bottom-right, 22×22
  liBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    backgroundColor: 'transparent',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liBadgeImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  // bc-name-block: column, gap 4, mt 12
  nameBlock: {
    flexDirection: 'column',
    marginTop: 12,
  },

  // bc-name: 20px, 600, uppercase, lineHeight 1.3 → ~26
 nameText: {
  fontSize: scale(18),   // was 20
  fontWeight: '500',
  color: '#000000',
  lineHeight: scale(24), // was 26
  textTransform: 'uppercase',
 // fontFamily: 'Poppins-SemiBold',
  marginBottom: 4,
},

designationText: {
  fontSize: scale(13),   // was 14
  fontWeight: '400',
  color: '#000000',
  lineHeight: scale(18), // was 20
  textTransform: 'uppercase',
 // fontFamily: 'Poppins-Medium',
  marginBottom: 4,
},

departmentText: {
  fontSize: scale(12),   // was 13
  fontWeight: '400',
  color: '#000000',
  lineHeight: scale(17), // was 18
  textTransform: 'uppercase',
 // fontFamily: 'Poppins-Regular',
  paddingBottom: 8,
},



  // bc-divider: h 1, #dee2e6, margin 16 0 24 16
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginTop: 16,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 0,
  },

  // bc-contacts: column, pl 24, pr 16, pb 8
  contacts: {
    flexDirection: 'column',
    paddingLeft: 24,
    paddingRight: 16,
    paddingBottom: 8,
  },

  // bc-contact-row: flex row, gap 20 (achieved via iconWrap width + no extra margin),
  // padding-bottom 12
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },

  // bc-icon: 40×40 container, icon is 20×20
  // In CSS: width/min-width/max-width: 40px; flex-shrink: 0
  iconWrap: {
    width: 40,
    minWidth: 40,
    maxWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0,
    // gap: 20 → this is the space between icon and text
    // In RN: marginRight achieves the gap effect (CSS gap on flex row)
    marginRight: 20,
  },

  // bc-contact-link: 13px, 400, #000, lineHeight 1.5 → ~20
 contactLink: {
  fontSize: scale(12),   // was 13
  fontWeight: '400',
  color: '#000000',
  lineHeight: scale(18), // was 20
//  fontFamily: 'Poppins-Regular',
  flex: 1,
},

addressText: {
  fontSize: scale(12),   // was 13
  fontWeight: '400',
  color: '#000000',
  lineHeight: scale(18), // was 20
  //fontFamily: 'Poppins-Regular',
  flex: 1,
},


  // bc-footer-row: column, gap 8, padding 8 16
  footerRow: {
    flexDirection: 'column',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },

  // bc-qr-wrap: 80×80, mb 12, mt 8
  qrWrap: {
    width: 80,
    height: 80,
    marginBottom: 12,
    marginTop: 8,
  },

  // bc-website-row: row, space-between, gap 4
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },

  // bc-website-link: 13px, 400, #000
 websiteLink: {
  fontSize: scale(12),   // was 13
  fontWeight: '400',
  color: '#000000',
 // fontFamily: 'Poppins-Regular',
  flex: 1,
},


  // bc-action-btns: row, gap 4
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // bc-action-btn: no bg, padding 4 6
  actionBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // bc-brand: #2B3087, 17% width (set inline), full height, center
  brandPanel: {
    backgroundColor: '#2B3087',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

// ─────────────────────────────────────────────────────
// === SCAN BIZ CARD: modal styles ===
// ─────────────────────────────────────────────────────
const scanStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: '#2B3087',
  },
  loaderWrap: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#555555',
  },
  emptyWrap: {
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  previewWrap: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  previewBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  resultScroll: {
    paddingBottom: 8,
  },
  resultName: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    lineHeight: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#2B3087',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2B3087',
  },
  secondaryBtnText: {
    color: '#2B3087',
    fontWeight: '600',
    fontSize: 14,
  },
});

// ─────────────────────────────────────────────────────
// Main / Home styles (unchanged)
// ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HOME.bg,
    fontFamily: 'Montserrat-Regular',
  },
  scrollBody: {
    // clears the absolutely-positioned floating tab bar from the navigator
    paddingBottom: 96,
  },
  carouselimg: {
    minHeight: '100%',
    minWidth: '100%',
    resizeMode: 'cover',
  },
  tinyLogo: {
    width: 34,
    height: 24,
    resizeMode: 'contain',
  },
  RevtinyLogo: {
    width: 70,
    height: 30,
    resizeMode: 'contain',
    marginTop: 7,
    marginLeft: -110,
  },

  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#E8F4F8',
    borderRadius: 50,
    shadowColor: '#B3E5FC',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },

  modalFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gradientCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#2E7D32',
    top: -100,
    left: -100,
    opacity: 0.15,
  },
  gradientCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1565C0',
    bottom: -80,
    right: -80,
    opacity: 0.15,
  },
  modalSnowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  christmasModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    marginHorizontal: 20,
    shadowColor: '#2E7D32',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    width: Dimensions.get('screen').width - 40,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
    position: 'relative',
    overflow: 'visible',
  },
  cornerStar: {
    position: 'absolute',
    zIndex: 10,
  },
  topLeftStar: {
    top: -15,
    left: -15,
  },
  topRightStar: {
    top: -15,
    right: -15,
  },
  cornerStarText: {
    fontSize: 32,
  },
  treeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  christmasEmoji: {
    fontSize: 100,
  },
  starTop: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -15,
  },
  starTopEmoji: {
    fontSize: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  christmasTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
    marginTop: 8,
  },
  christmasSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 30,
    textAlign: 'center',
  },
  christmasDecorations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  decorationItem: {
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
  },
  decorationEmoji: {
    fontSize: 28,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  christmasMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 15,
  },
  messageDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  dividerLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E8F5E9',
  },
  closeButtonWrapper: {
    width: '100%',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    gap: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButtonIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomDecoration: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
    opacity: 0.6,
  },
  bottomDecoEmoji: {
    fontSize: 20,
  },
});

export default Home;