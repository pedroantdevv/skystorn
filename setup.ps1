$serverUrl = "http://localhost:3000"
Write-Host "Server loading..."
npm run start
if ($LASTEXITCODE -eq 0) {
    Write-Host "Server Runnning!!!"
    Start-Process $serverUrl
    exit
}
Write-Host "Error in server loading. Trying to fix..."
try {
    $ping = Test-Connection -ComputerName www.google.com -Count 1 -Quiet -ErrorAction Stop
} catch {
    $ping = $false
}
if (-not $ping) {
    Write-Host "No internet connection."
    Pause
    exit
}
Write-Host "Download dependencies..."
npm install
npm run start
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error undefined. Trying to fix..."
    Pause
    exit
}
Write-Host "Server Runnning"
Start-Process $serverUrl