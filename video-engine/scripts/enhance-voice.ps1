param(
  [string]$OutDir = (Join-Path $PSScriptRoot "..\out")
)

$ErrorActionPreference = "Stop"

# Studio-grade excited/brighter/higher-pitch vocal mastering chain (exact duration preserved!)
$filter = "rubberband=pitch=1.08:formant=preserved:transients=crisp:pitchq=quality,highpass=f=85,equalizer=f=3200:t=q:w=1.2:g=3.5,treble=g=2.8:f=8000,acompressor=threshold=-20dB:ratio=3.2:attack=5:release=60:makeup=3.5,loudnorm=I=-13.5:TP=-1.0:LRA=6"

$files = Get-ChildItem -Path $OutDir -Filter "*.mp4" | Sort-Object Name
Write-Host "Remastering audio on $($files.Count) MP4 videos (lossless video copy)..." -ForegroundColor Cyan

foreach ($f in $files) {
  $tmp = Join-Path $f.DirectoryName "$($f.BaseName).tmp.mp4"
  Write-Host "  -> $($f.Name)"
  & ffmpeg -y -v error -i $f.FullName -c:v copy -af $filter -c:a aac -b:a 192k -ar 48000 -movflags +faststart $tmp
  if ($LASTEXITCODE -ne 0) {
    throw "FFmpeg failed on $($f.Name)"
  }
  Move-Item -Force $tmp $f.FullName
}

Write-Host "All $($files.Count) videos remastered cleanly!" -ForegroundColor Green
