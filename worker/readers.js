// Readers of thehoopersabroad.uk.
// tokenHash is the SHA-256 fingerprint of each reader's private link token. The raw link is never stored here.
// To switch someone off: set active: false and push to main. To add someone: Claude generates a new link
// and adds a line here. Hidden from the website by .assetsignore.
export const READERS = [
  { id: "andrew", name: "Andrew", email: "amdhooper@gmail.com", tokenHash: "f812f0d8a05961d5c6711b39314dbd123898bf0ba0529baf3b2b9fbfc7070a43", active: true },
];
