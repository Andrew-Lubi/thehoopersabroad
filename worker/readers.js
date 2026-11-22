// Readers of thehoopersabroad.uk.
// tokenHash is the SHA-256 fingerprint of each reader's private link token. The raw link is never stored here.
// To switch someone off: set active: false and push to main. To add someone: Claude generates a new link
// and adds a line here. Hidden from the website by .assetsignore.
export const READERS = [
  { id: "andrew", name: "Andrew", email: "amdhooper@gmail.com", tokenHash: "f812f0d8a05961d5c6711b39314dbd123898bf0ba0529baf3b2b9fbfc7070a43", active: true },
  { id: "penny", name: "Penny", email: "penelopestanley0@gmail.com", tokenHash: "ef96a093abc950d683752f73e6eaace62280072df75f8071e5b0cf0572d0fefc", active: true },
  { id: "er-hooper", name: "E R Hooper", email: "erhooper1964@gmail.com", tokenHash: "bcaec89890a36d5ee4a81a3bb8133286f80588c35d18f85e108e857287ef860e", active: true },
  { id: "lis-hooper", name: "Lis Hooper", email: "lis.hooper1@gmail.com", tokenHash: "79e4c037d320a75bf2d6c42b5f6eb526aaa16ecfff24c726ce1cc68fd4db2b46", active: true },
  { id: "tim-sandys-renton", name: "Tim Sandys-Renton", email: "tim.sandys_renton@btinternet.com", tokenHash: "983c580204da65f3c262d4bb0562bdb6083c080e48c55499b43f3b6727e748c6", active: true },
  { id: "joe-grassick", name: "Joe Grassick", email: "joegrassick@yahoo.com", tokenHash: "f4040a318ef8ca8c3ff6bf63e2d88a5e616a682f0d776d83d7e8c4c46f1d51ea", active: true },
  { id: "ana", name: "Ana", email: "anahooper012@gmail.com", tokenHash: "be6e8377fa204443964027401ef02e2230ba618bc04163cbaf90e277d2c8af1b", active: true },
  { id: "ciara-ashton", name: "Ciara Ashton", email: "ciara.ashton@swaythlingprimary.org", tokenHash: "19576537a76dada3298c4c01e9d97323c773838834bdffe6abd701662ad61067", active: true },
  { id: "ashley-kearse", name: "Ashley Kearse", email: "ashley.kearse@swaythlingprimary.org", tokenHash: "ef375f3940431607d161decf9d807db854699474afdee3617f2b4f5f4097eb72", active: true },
  { id: "melissa-down", name: "Melissa Down", email: "melissa.down@swaythlingprimary.org", tokenHash: "a498a360894bd9d0d51882f29c4c01910ce7b1dcbff12425822906ef26cb9d19", active: true },
];
