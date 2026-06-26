param([ValidateSet('major','minor','patch')][string]$Part='patch')

$path = 'src\data\version.js'
$content = Get-Content $path -Raw
if ($content -match 'const VERSION = \{ major: (\d+), minor: (\d+), patch: (\d+) \}') {
  $major = [int]$Matches[1]
  $minor = [int]$Matches[2]
  $patch = [int]$Matches[3]
  switch ($Part) {
    'major' { $major++; $minor=0; $patch=0 }
    'minor' { $minor++; $patch=0 }
    'patch' { $patch++ }
  }
  $new = "const VERSION = { major: $major, minor: $minor, patch: $patch };"
  $content = $content -replace 'const VERSION = \{ major: \d+, minor: \d+, patch: \d+ \}', $new
  Set-Content $path $content
  Write-Host "Bumped to v$major.$minor.$patch"
} else {
  Write-Host "Could not parse version.js" -ForegroundColor Red
}
