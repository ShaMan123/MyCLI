﻿
@echo off


@echo react-devtools
start "adb" adbForReactDevTools.bat
@echo Setup instructions:
@echo https://facebook.github.io/react-native/docs/debugging#inspecting-component-instances

set /p followPath=Want to open setup instructions?
IF "%followPath%"=="yes" (start chrome https://facebook.github.io/react-native/docs/debugging#inspecting-component-instances)


cd ..
react-devtools
