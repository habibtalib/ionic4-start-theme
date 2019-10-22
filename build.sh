# keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
rm MEERACLE.apk
~/Library/Android/sdk/build-tools/29.0.2/zipalign -v 4  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk MEERACLE.apk