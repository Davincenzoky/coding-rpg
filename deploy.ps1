Set-Location "$PSScriptRoot"

# Clean and build
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npx expo export --platform web --output-dir dist

# Fix paths for GitHub Pages subpath
$html = Get-Content -Raw dist\index.html
$html = $html -replace '"/_expo/', '"/coding-rpg/_expo/'
$html = $html -replace '"/favicon.ico"', '"/coding-rpg/favicon.ico"'
$html = $html -replace '<title>.*?</title>', '<title>CodingRPG</title>'
$html = $html -replace 'href="/coding-rpg/favicon.ico"', 'href="/coding-rpg/favicon.png"'

# Inject Inter font from Google Fonts
$fontLink = '<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />'
$html = $html -replace '<title>', "$fontLink<title>"
# Add responsive meta & base styles
$html = $html -replace '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />', '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1, maximum-scale=5" />'
$html = $html -replace '</style>', @'
  :root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  body { margin: 0; font-family: inherit; }
  button, input, textarea { font-family: inherit; }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; -ms-overflow-style: none; }
  @media (hover: hover) {
    a, button, [role="button"] { cursor: pointer; }
  }
  #root { display: flex; justify-content: center; }
</style>
'@

# PWA manifest
$manifest = @'
{
  "name": "CodingRPG",
  "short_name": "CodingRPG",
  "description": "A Coding Tower Defense RPG",
  "start_url": "/coding-rpg/",
  "display": "standalone",
  "background_color": "#0a0a1a",
  "theme_color": "#e94560",
  "icons": [
    { "src": "/coding-rpg/favicon.png", "sizes": "500x500", "type": "image/png" }
  ]
}
'@
$manifest | Set-Content -Path dist\manifest.json -NoNewline
$html = $html -replace '<title>', '<link rel="manifest" href="/coding-rpg/manifest.json" /><title>'
# Service worker (basic offline support)
$sw = @'
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
'@
$sw | Set-Content -Path dist\sw.js -NoNewline

# Inject anti-tamper script (disable right-click & dev tools)
$antiTamper = @'
<script>
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});
</script>
'@
$html = $html -replace '</head>', "$antiTamper</head>"
Set-Content -Path dist\index.html -Value $html -NoNewline

# Copy logo as favicon
$logoPng = Get-ChildItem -Recurse dist\assets -Filter "logo.*.png" | Select-Object -First 1 -ExpandProperty FullName
if ($logoPng) {
  Copy-Item -Path $logoPng -Destination dist\favicon.png -Force
  Write-Host "Copied $logoPng to dist\favicon.png"
}

# Fix asset URIs in JS bundle
Get-ChildItem -Recurse -Path dist -Filter "*.js" | ForEach-Object {
  $content = Get-Content -Raw $_.FullName
  if ($content -match '"/assets/') {
    $content = $content -replace '"/assets/', '"/coding-rpg/assets/'
    Set-Content -Path $_.FullName -Value $content -NoNewline
    Write-Host "Fixed assets path in $($_.Name)"
  }
}

# Create .nojekyll to allow _expo directory on GitHub Pages
Set-Content -Path dist\.nojekyll -Value "" -NoNewline

# Copy index.html as 404.html for SPA routing
Copy-Item dist\index.html dist\404.html

# Deploy to gh-pages
npx gh-pages -d dist
