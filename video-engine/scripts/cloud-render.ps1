param(
  [ValidateSet("ConsistencyBeatsTalent", "FullOnePercent", "OpeningDemo")]
  [string]$Composition = "ConsistencyBeatsTalent",
  [string]$OutputName = "consistency-beats-talent.mp4",
  [string]$Crf = "17"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) is not installed. Install it with: winget install GitHub.cli"
  exit 1
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Push-Location $RepoRoot

try {
  Write-Host "1/4 Pushing latest storyboard & voiceover to GitHub..." -ForegroundColor Cyan
  git add video-engine/src video-engine/public/audio/*.wav video-engine/package.json video-engine/package-lock.json .github/workflows/render-video.yml
  $status = git status --porcelain
  if ($status) {
    git commit -m "chore: update storyboard/audio for cloud render ($Composition)"
  }
  git push

  Write-Host "2/4 Triggering GitHub Actions workflow ($Composition -> $OutputName)..." -ForegroundColor Cyan
  gh workflow run render-video.yml -f composition=$Composition -f output_name=$OutputName -f crf=$Crf

  Start-Sleep -Seconds 4
  $runId = gh run list --workflow=render-video.yml --limit 1 --json databaseId --jq '.[0].databaseId'
  if (-not $runId) {
    Write-Error "Could not locate triggered workflow run."
    exit 1
  }

  Write-Host "3/4 Watching cloud render run #$runId (your PC stays idle)..." -ForegroundColor Cyan
  gh run watch $runId --exit-status

  Write-Host "4/4 Downloading rendered MP4 into video-engine/out/..." -ForegroundColor Cyan
  $OutDir = Join-Path $RepoRoot "video-engine\out"
  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
  gh run download $runId --name rendered-video --dir $OutDir

  Write-Host "Done! Saved to: $OutDir\$OutputName" -ForegroundColor Green
}
finally {
  Pop-Location
}
