@echo off
echo 🔍 Checking for Firebase emulator processes on common ports...

for %%p in (5001 8080 8085 9099 9199 4000) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
    echo ⚡ Killing process on port %%p (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
  )
)

echo ✅ All Firebase emulator ports have been cleared.
pause
