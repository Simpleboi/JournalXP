@echo off
echo.
echo ============================================
echo    JournalXP - Get Windows IP for iPhone
echo ============================================
echo.

echo Finding your IPv4 address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set ip=%%a
    set ip=!ip: =!
    echo Found IP: !ip!
    echo.
    echo ============================================
    echo NEXT STEPS:
    echo ============================================
    echo 1. Edit frontend/capacitor.config.ts
    echo 2. Uncomment these lines in the server section:
    echo    url: 'http://!ip!:5173',
    echo    cleartext: true
    echo.
    echo 3. Make sure your iPhone is on the same WiFi
    echo 4. Run: npm run dev
    echo 5. Open JournalXP app on iPhone
    echo ============================================
    echo.
)

pause
