package com.transportdplusproject.DL;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.airbnb.android.react.maps.MapsPackage;
import codes.simen.IMEI.IMEI;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.airbnb.android.react.maps.MapsPackage;
import codes.simen.IMEI.IMEI;
//import com.rssignaturecapture.RSSignatureCapturePackage;
import com.airbnb.android.react.maps.MapsPackage;
import codes.simen.IMEI.IMEI;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.transportdplusproject.DL.BuildConfig;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new MapsPackage(),
            new IMEI(),
            new RSSignatureCapturePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
