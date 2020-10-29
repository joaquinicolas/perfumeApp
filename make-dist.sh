#!/bin/bash
pwd
ls
cd app
pwd
ls
wine --version
echo "START BUILD"
export WINEARCH=win32
npm install
#electron-builder install-app-deps
cd ..
#electron-packager app app --platform=win32 --arch=ia32 --asar
electron-packager app app --platform=win32 --arch=x64  --asar
#electron-packager app app --platform=darwin --arch=x64  --asar
#electron-packager app app --platform=linux --arch=x64 --asar
#zip -r out/darwin-x64.zip app-darwin-x64
#zip -r out/linux-x64.zip app-linux-x64
zip -r out/win32-x64.zip app-win32-x64
#zip -r out/win32-ia32.zip app-win32-ia32
