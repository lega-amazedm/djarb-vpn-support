window.DJARB = window.DJARB || {};

DJARB.initSetupPage = function () {
  DJARB.renderSteps('setupIosSteps', DJARB.IOS_SETUP || []);
  DJARB.renderSteps('setupAndroidSteps', DJARB.ANDROID_SETUP || []);
};
