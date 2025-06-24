# 💸 CRYPTeX

A modern, minimalistic crypto wallet frontend — **built with React, Firebase, and Web3 tools** — that doesn't just manage your tokens, it vibes with them.

---

## 🚀 Features

- 🔐 **Firebase Auth** (Google OAuth) — no passwords, just vibes.
- 📊 **Transaction Viewer** — see your Solana transaction history like a boss.
- 📈 **Chart Visualizations** — powered by Chart.js + `react-chartjs-2`.
- 🌐 **Web3-Ready** — integrated with `ethers`, `@solana/web3.js`, and `web3-react`.
- 🎨 **Beautiful UI** — TailwindCSS + Radix UI + Lucide Icons.
- ⚙️ **Typed & Tooled** — Built with TypeScript, ESLint, and Vite for the modern stack.
- 🔒 **Seed Phrase Generation** — using `bip39`, `ed25519-hd-key`, and `@scure/bip32`.

---

## 🧱 Tech Stack

| Category        | Tools / Libraries                                  |
|----------------|-----------------------------------------------------|
| Frontend       | React 19, React Router DOM, Tailwind CSS            |
| Web3           | ethers, Solana Web3.js, web3-react                  |
| Auth / Backend | Firebase (auth, firestore)                          |
| Charts         | chart.js + react-chartjs-2                          |
| Crypto Utils   | bip39, @scure/bip32, crypto-js                      |
| Dev Tooling    | Vite, ESLint, TypeScript, Node Polyfills            |

---

## 🛠️ Setup

> Clone and fire it up in 60 seconds.

```bash
git clone https://github.com/jallpatell/cryptex.git
cd cryptex
npm install
cp .env.example .env # Add your Firebase keys
npm run dev
```

---

## 🔐 Firebase Setup

- Create a Firebase project
- Enable **Authentication > Google**
- Setup Firestore
- Add your Firebase config to `.env`

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
...
```

---

## 🌍 Deployment

This project is ready for [**Vercel**](https://vercel.com/) deployment. Already configured via `vercel.json`.

```bash
vercel --prod
```

---

## 🧪 Scripts

| Command         | Description           |
|----------------|-----------------------|
| `npm run dev`  | Start dev server      |
| `npm run build`| Build for production  |
| `npm run lint` | Run ESLint            |
| `npm run preview` | Preview production |

---

## 🤓 Developer Notes

- Modular and scalable file structure.
- Built with “hooks first” architecture.
- Tailwind + class-variance-authority for consistent styling.
- Polyfilled Node.js modules for full crypto/browser compatibility.

---

## 📁 Project Structure

```
server/              # auths, middlewares and controllers
src/
 ┣ components/       # UI elements
 ┣ pages/            # Page components
 ┣ lib/              # Firebase, Wallet logic
 ┣ hooks/            # Custom React hooks
 ┣ App.tsx           # App shell
 ┣ main.tsx          # Vite entry
public/
firebase.json        # Firebase config
vercel.json          # Deployment config
```

---

## 👨‍💻 Author

**Jal Patel** — [@jallpatell](https://github.com/jallpatell)  
> Built with too much coffee and not enough ETH.

---

## 📜 License

MIT — Use it, fork it, improve it.

---

![Built with Web3 Vibes](https://img.shields.io/badge/Built%20with-Web3%20Vibes-4e11ab)
