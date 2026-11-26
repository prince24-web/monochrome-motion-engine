param(
  [Parameter(Mandatory = $true)]
  [string]$Slug,
  [double]$Tempo = 1.15,
  [double]$Pitch = 1.07,
  [double]$StopDuration = 0.26,
  [string]$StopThreshold = "-38dB"
)

$ErrorActionPreference = "Stop"

$EngineDir = Split-Path -Parent $PSScriptRoot
$AudioPath = Join-Path $EngineDir "public\audio\$Slug.wav"
$JsonPath = Join-Path $EngineDir "src\data\$Slug.json"
$BackupDir = Join-Path $EngineDir ".audio-backups"
$BackupPath = Join-Path $BackupDir "$Slug.raw.wav"
$TempOut = Join-Path $BackupDir "$Slug.tight.wav"

if (-not (Test-Path $AudioPath)) {
  throw "Audio file not found: $AudioPath"
}
if (-not (Test-Path $JsonPath)) {
  throw "Storyboard JSON not found: $JsonPath"
}

if (-not (Test-Path $BackupDir)) {
  New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Preserve pristine raw TTS audio on first run so re-runs stay idempotent
if (-not (Test-Path $BackupPath)) {
  Copy-Item $AudioPath $BackupPath
  Write-Host "Backed up raw voiceover -> $BackupPath"
}

$origDur = [double](ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $BackupPath)
Write-Host ("Original duration: {0:N2}s" -f $origDur)

$filter = @(
  "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-42dB:stop_periods=-1:stop_duration=${StopDuration}:stop_threshold=${StopThreshold}",
  "rubberband=tempo=${Tempo}:pitch=${Pitch}:formant=preserved:transients=crisp:pitchq=quality",
  "acompressor=threshold=-18dB:ratio=3:attack=8:release=120",
  "loudnorm=I=-13.5:TP=-1.0:LRA=9"
) -join ","

Write-Host "Running FFmpeg cadence + brightness pass..."
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& ffmpeg -y -loglevel error -i $BackupPath -af $filter -ar 44100 -ac 1 -c:a pcm_s16le $TempOut
$ffExit = $LASTEXITCODE
$ErrorActionPreference = $prevEap
if ($ffExit -ne 0) {
  throw "FFmpeg failed with exit code $ffExit"
}

Move-Item -Force $TempOut $AudioPath

$newDur = [double](ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $AudioPath)
Write-Host ("Tightened duration: {0:N2}s (saved {1:N2}s)" -f $newDur, ($origDur - $newDur))

# Resync storyboard JSON scene durations proportionally to exact new audio length
$json = Get-Content $JsonPath -Raw | ConvertFrom-Json
$oldSum = 0.0
foreach ($s in $json.scenes) {
  $oldSum += [double]$s.durationSec
}

$runningSum = 0.0
$count = $json.scenes.Count
for ($i = 0; $i -lt $count; $i++) {
  $scene = $json.scenes[$i]
  if ($i -lt ($count - 1)) {
    $scaled = [Math]::Round(([double]$scene.durationSec / $oldSum) * $newDur, 2)
    $scene.durationSec = $scaled
    $runningSum += $scaled
  } else {
    $scene.durationSec = [Math]::Round($newDur - $runningSum, 2)
  }
  Write-Host ("  [{0}] {1}: {2:N2}s" -f ($i + 1), $scene.id, $scene.durationSec)
}

$json | ConvertTo-Json -Depth 10 | Set-Content -Path $JsonPath -Encoding UTF8
Write-Host "Updated storyboard JSON -> $JsonPath"
