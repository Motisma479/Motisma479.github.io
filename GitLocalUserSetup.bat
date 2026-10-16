@echo off

echo -------------------
echo ^| Local git Setup ^|
echo -------------------

echo.
echo Please enter your information:

set /p gitLocalUser= username: 
set /p gitLocalEmail= email: 

git config --local user.name %gitLocalUser%
git config --local user.email %gitLocalEmail%

echo.
echo new values:

git config --local user.name > %Temp%\gitUsenameTemp.txt
set /p nvusername=<%Temp%\gitUsenameTemp.txt
del %Temp%\gitUsenameTemp.txt

git config --local user.email > %Temp%\gitEmailTemp.txt
set /p nvemail=<%Temp%\gitEmailTemp.txt
del %Temp%\gitEmailTemp.txt

echo new username: %nvusername%
echo new email: %nvemail%

pause