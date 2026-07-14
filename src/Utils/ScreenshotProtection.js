import { NativeModules, NativeEventEmitter, Platform, Alert } from 'react-native';

const { RNScreenshotProtection } = NativeModules;

class ScreenshotProtection {
  constructor() {
    this.eventEmitter = null;
    this.listeners = [];

    if (Platform.OS === 'ios' && RNScreenshotProtection) {
      this.eventEmitter = new NativeEventEmitter(RNScreenshotProtection);
    }
  }

  /**
   * Listen for screenshot events
   * @param {Function} callback - Called when a screenshot is taken
   * @returns {Object} subscription object with remove() method
   */
  addScreenshotListener(callback) {
    if (Platform.OS !== 'ios' || !this.eventEmitter) {
      console.warn('Screenshot detection is only supported on iOS');
      return { remove: () => {} };
    }

    const subscription = this.eventEmitter.addListener('ScreenshotTaken', (data) => {
      console.warn('📸 Screenshot detected at:', new Date(data.timestamp * 1000));
      callback(data);
    });

    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Listen for screen recording events
   * @param {Function} callback - Called when screen recording starts/stops
   * @returns {Object} subscription object with remove() method
   */
  addScreenRecordingListener(callback) {
    if (Platform.OS !== 'ios' || !this.eventEmitter) {
      console.warn('Screen recording detection is only supported on iOS');
      return { remove: () => {} };
    }

    const subscription = this.eventEmitter.addListener('ScreenRecordingChanged', (data) => {
      if (data.isRecording) {
        console.warn('🎥 Screen recording started');
      } else {
        console.log('✅ Screen recording stopped');
      }
      callback(data);
    });

    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Check if screen is currently being recorded
   * @returns {Promise<boolean>}
   */
  async isScreenBeingRecorded() {
    if (Platform.OS !== 'ios' || !RNScreenshotProtection) {
      return false;
    }

    try {
      const result = await RNScreenshotProtection.isScreenBeingRecorded();
      return result.isRecording;
    } catch (error) {
      console.error('Error checking screen recording status:', error);
      return false;
    }
  }

  /**
   * Show a warning when screenshot is taken
   */
  showScreenshotWarning() {
    Alert.alert(
      '⚠️ Security Alert',
      'Screenshots are prohibited for security and data protection. This action has been logged.',
      [{ text: 'Understood', style: 'default' }],
      { cancelable: false }
    );
  }

  /**
   * Show a warning when screen recording is detected
   */
  showRecordingWarning() {
    Alert.alert(
      '⚠️ Screen Recording Detected',
      'Screen recording is not permitted while using this app. Please stop recording to continue.',
      [{ text: 'OK', style: 'destructive' }],
      { cancelable: false }
    );
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.listeners.forEach(subscription => subscription.remove());
    this.listeners = [];
  }
}

export default new ScreenshotProtection();
