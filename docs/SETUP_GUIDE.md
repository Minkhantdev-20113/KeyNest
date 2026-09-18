# KeyNest Firebase Setup Guide

## ၁။ Firebase Project

1. Firebase Console တွင် project အသစ်ဖန်တီးပါ။
2. **Authentication > Sign-in method** တွင် **Email/Password** ကို ဖွင့်ပါ။
3. **Firestore Database** ကို production mode ဖြင့် ဖန်တီးပါ။
4. Web app တစ်ခု register လုပ်ပြီး config တန်ဖိုးများကို ကူးယူပါ။
5. **Authentication > Settings > Authorized domains** တွင် local နှင့် Vercel domain ထည့်ပါ။

## ၂။ Environment Variables

`.env.example` ကို `.env` အဖြစ်ကူးပြီး Firebase Web config ဖြည့်ပါ။ `VITE_` တန်ဖိုးများသည် browser bundle ထဲ ပါနိုင်သောကြောင့် Firebase Web config ပဲ ထည့်ပါ။ Firebase Admin private key၊ client secret၊ service-account JSON များကို မထည့်ပါနှင့်။

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_APP_NAME=AI Key Vault
```

## ၃။ Database Structure

```text
users/{uid}/profile/settings
  username: string
  avatar.text: string (အများဆုံး ၂ စာလုံး)
  avatar.color: string

users/{uid}/keys/{keyId}
  provider, label, apiKey, description, environment
  createdAt, updatedAt
```

API key CRUD သည် signed-in Firebase user ၏ `uid` ဖြင့်သာ လုပ်ဆောင်သည်။

## ၄။ Security Rules

Repository ရှိ `firestore.rules` ကို Firebase CLI ဖြင့် deploy လုပ်ပါ။ Rules သည် user ကိုယ်ပိုင် document path ကိုသာ read/write ခွင့်ပြုပြီး key fields နှင့် avatar length ကို စစ်ဆေးပါသည်။

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
```

## ၅။ Account နှင့် Authorization

Registration တွင် username၊ email နှင့် password သုံးပါသည်။ Login/logout state ကို Firebase `onAuthStateChanged` ဖြင့် ထိန်းချုပ်ပြီး login မဝင်ထားသော user သည် vault UI ကို မမြင်ရပါ။ Password ပြောင်းခြင်းသည် Firebase Auth ကို အသုံးပြုသည်။ Firestore rules သည် server-side authorization boundary ဖြစ်သည်။

Avatar သည် profile document ထဲတွင် စာလုံးနှစ်လုံးနှင့် color သာသိမ်းပြီး image upload မရှိပါ။

## ၆။ GitHub နှင့် Vercel Deployment

1. `.env` ကို commit မလုပ်ဘဲ GitHub သို့ push ပါ။
2. GitHub repository ကို Vercel တွင် import လုပ်ပါ။
3. Build command ကို `npm run build`၊ output directory ကို `dist` ထားပါ။
4. Vercel Environment Variables တွင် `.env` ထဲရှိ `VITE_FIREBASE_*` တန်ဖိုးများ ထည့်ပါ။
5. `vercel.json` SPA rewrite ပါပြီးသားဖြစ်သောကြောင့် deep links များသည် `index.html` သို့ ပြန်ဝင်ပါမည်။
6. Vercel domain ကို Firebase Authorized domains ထဲ ထည့်ပြီး redeploy လုပ်ပါ။

## ၇။ Myanmar Connectivity

Myanmar network အချို့တွင် Firebase endpoint များ မရောက်နိုင်သောအချိန်ရှိနိုင်ပါသည်။ Application အနေဖြင့် VPN၊ proxy bypass သို့မဟုတ် censorship evasion မထည့်ထားပါ။ ထိုအခြေအနေတွင် Auth နှင့် Firestore request များ fail နိုင်ပြီး browser online indicator ကသာ local network အခြေအနေကို ပြပါမည်။ နောက်ပိုင်းတွင် provider ပြောင်းလိုပါက `src/services/auth.js` နှင့် `src/services/database.js` သည် adapter boundary အဖြစ် အသုံးပြုနိုင်ပါသည်။

## ၈။ Troubleshooting နှင့် Maintenance

- `Missing Firebase configuration` တွေ့ပါက local/Vercel variables နှင့် names စစ်ပါ။
- `permission-denied` တွေ့ပါက login state နှင့် deployed rules စစ်ပါ။
- `auth/unauthorized-domain` တွေ့ပါက Firebase Authorized domains ထဲ domain ထည့်ပါ။
- `failed-precondition` တွေ့ပါက Firebase Console ရှိ index link ကို စစ်ပါ။
- Password reset ထည့်မည်ဆိုပါက Firebase `sendPasswordResetEmail` ကို အသုံးပြုပါ။
- Rules နှင့် dependencies ပြောင်းတိုင်း `npm run build` နှင့် security review လုပ်ပါ။
- Firebase မရောက်နိုင်လျှင် data ကို local-only ဟု မယူဆပါနှင့်။ Firestore write အောင်မြင်မှသာ cloud data သိမ်းပြီးဟု ယူဆပါ။
