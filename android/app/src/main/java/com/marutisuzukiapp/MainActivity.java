package com.maruti.hrapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash; // <- add this necessary import


import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MarutiSuzukiApp";
  }
  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  // super.onCreate(null);
  // }

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //     super.onCreate(savedInstanceState);      
  //     RNBootSplash.init(MainActivity.this);
  // }   

    @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {

      @Override
      protected void loadApp(String appKey) {
        // RNBootSplash.init(MainActivity.this); // <- initialize the splash screen
        checkInstalledPackage();
        super.loadApp(appKey);
      }
    };
  }

    private boolean checkInstalledPackage(){
      String[] packages = {
      "com.thirdparty.superuser",
      "eu.chainfire.supersu",
      "com.noshufou.android.su",
      "com.koushikdutta.superuser",
      "com.zachspong.temprootremovejb",
      "com.ramdroid.appquarantine",
      "com.topjohnwu.magisk",
      // "com.android.chrome"
      };

      for (int i=0; i<packages.length; i++) {
          Boolean checkResult = isPackageInstalled(packages[i], this.getPackageManager());
          Log.d("PACKAGE CHECKED",packages[i]+String.valueOf(checkResult));
        if(checkResult){
          Toast.makeText(MainActivity.this, "Your device has installed harmful application.", Toast.LENGTH_LONG).show();
          MainActivity.this.finish();
          System.exit(0);
        }
      }
      return false;
  }

  private boolean isPackageInstalled(String packageName, PackageManager packageManager) {
    try {
      // packageManager.getPackageInfo(packageName, 0);
      return packageManager.getApplicationInfo(packageName, 0).enabled;
      // return true;
    } catch (PackageManager.NameNotFoundException e) {
    return false;
    }
  }


}
