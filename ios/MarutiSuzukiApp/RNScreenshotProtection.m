#import "RNScreenshotProtection.h"
#import <React/RCTLog.h>

@implementation RNScreenshotProtection

RCT_EXPORT_MODULE();

- (instancetype)init {
  if (self = [super init]) {
    // Listen for screenshot notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(screenshotTaken:)
                                                 name:UIApplicationUserDidTakeScreenshotNotification
                                               object:nil];

    // Listen for screen recording notifications (iOS 11+)
    if (@available(iOS 11.0, *)) {
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(screenRecordingChanged:)
                                                   name:UIScreenCapturedDidChangeNotification
                                                 object:nil];
    }
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"ScreenshotTaken", @"ScreenRecordingChanged"];
}

- (void)screenshotTaken:(NSNotification *)notification {
  [self sendEventWithName:@"ScreenshotTaken" body:@{@"timestamp": @([[NSDate date] timeIntervalSince1970])}];
}

- (void)screenRecordingChanged:(NSNotification *)notification API_AVAILABLE(ios(11.0)) {
  BOOL isRecording = [UIScreen mainScreen].isCaptured;
  [self sendEventWithName:@"ScreenRecordingChanged" body:@{@"isRecording": @(isRecording)}];
}

RCT_EXPORT_METHOD(isScreenBeingRecorded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (@available(iOS 11.0, *)) {
    BOOL isRecording = [UIScreen mainScreen].isCaptured;
    resolve(@{@"isRecording": @(isRecording)});
  } else {
    resolve(@{@"isRecording": @(NO)});
  }
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// Required for RCTEventEmitter
+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
