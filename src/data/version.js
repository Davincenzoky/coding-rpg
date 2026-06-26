const VERSION = { major: 3, minor: 1, patch: 0 };;;

export function getVersion() {
  return `v${VERSION.major}.${VERSION.minor}.${VERSION.patch}`;
}

export function bumpMajor() {
  VERSION.major++;
  VERSION.minor = 0;
  VERSION.patch = 0;
  return getVersion();
}

export function bumpMinor() {
  VERSION.minor++;
  VERSION.patch = 0;
  return getVersion();
}

export function bumpPatch() {
  VERSION.patch++;
  return getVersion();
}

export default VERSION;


