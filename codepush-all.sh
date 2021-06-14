ionic cordova prepare ios
code-push release meeracle-ios ./platforms/ios/www/ 1.0.19 --description "Add Checking Blackisted" -d "Production"
ionic cordova prepare android
code-push release meeracle-android ./platforms/android/app/src/main/assets/www/ 1.0.8 --description "Add Checking Blackisted" -d "Production"