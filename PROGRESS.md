# KeyNest Progress

## Current Architecture

- React 18 + Vite frontend
- Firebase Authentication with email/password accounts
- Cloud Firestore under `users/{uid}/keys` and `users/{uid}/profile/settings`
- Firestore rules enforce UID ownership and basic field validation
- Vercel SPA rewrite in `vercel.json`
- Avatar settings store up to two characters and a color; no image uploads or Storage

## Production Checklist

- [x] Google Sheets and Apps Script removed
- [x] PIN and local IndexedDB authentication removed
- [x] Firebase Auth state and protected app gate added
- [x] User-scoped Firestore CRUD added
- [x] Account profile, password, logout, and avatar settings added
- [x] Firebase environment template added
- [x] Burmese deployment and connectivity guide added
- [ ] Add Firebase project values to local/Vercel environment variables
- [ ] Deploy `firestore.rules`
- [ ] Test registration, login, logout, CRUD, and password update in the Firebase project
