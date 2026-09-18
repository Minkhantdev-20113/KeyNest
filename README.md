# KeyNest

KeyNest သည် Firebase Authentication နှင့် Cloud Firestore ကို အသုံးပြုသော AI API key vault ဖြစ်သည်။ Account တစ်ခုချင်းစီ၏ key များကို `users/{uid}/keys` အောက်တွင် သီးခြားသိမ်းဆည်းပြီး avatar အတွက် စာလုံးနှစ်လုံးအထိနှင့် background color ကိုသာ သိမ်းပါသည်။ Profile ပုံ upload နှင့် Firebase Storage မသုံးပါ။

## Local Development

```bash
npm install
copy .env.example .env
npm run dev
```

Production build ကို စစ်ရန် `npm run build` ကို အသုံးပြုပါ။

## Firebase နှင့် Vercel

အသေးစိတ် setup၊ Firestore rules၊ GitHub workflow၊ Vercel environment variables နှင့် Myanmar network limitation များကို [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) တွင် ဖတ်ပါ။ Firebase Web configuration သည် client-side identifier များသာဖြစ်ပြီး Admin SDK credential မဟုတ်ပါ။ Service-account key များကို repository သို့မဟုတ် Vercel `VITE_*` variables ထဲ မထည့်ပါနှင့်။

## Security Model

- Firebase Auth က account session နှင့် password ကို စီမံသည်။
- Firestore rules က signed-in user ၏ ကိုယ်ပိုင် UID path ကိုသာ ခွင့်ပြုသည်။
- API key value သည် Firestore တွင် sensitive data ဖြစ်သောကြောင့် export ဖိုင်ကိုလည်း လုံခြုံစွာထားရမည်။
- Firebase သည် Myanmar network မှ တစ်ခါတစ်ရံ မရောက်နိုင်ပါက application code ဖြင့် VPN သို့မဟုတ် bypass မလုပ်ပါ။ အဲဒီအခြေအနေတွင် login နှင့် cloud data operations မရနိုင်ပါ။
