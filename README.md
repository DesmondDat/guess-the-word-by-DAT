Secret Word Guess — simple private-check demo

Files:
- `secret_guess.py` — Python demo. Use `--demo` for a non-interactive run; otherwise Player A inputs the secret (hidden) and Player B guesses letters.
- `SecretGuess.java` — Tiny Java console program (secret will be visible when entered in many shells).

Privacy idea shown:
- At start the program prints a SHA-256 hash of the secret (a commitment).
- During play the secret is never printed; only masked letters are shown.
- At the end the program prints the revealed word and its SHA-256 hash so anyone can verify the commit matched the reveal.

Run (PowerShell):

Python demo (checks non-interactive flow):
```powershell
python .\secret_guess.py --demo
```

Python interactive:
```powershell
python .\secret_guess.py
```

Java (compile & run):
```powershell
javac SecretGuess.java; java SecretGuess
```

Web UI (static) — ready for Vercel
1. The UI is in the `web/` folder: `index.html`, `styles.css`, `script.js`, and `default-pfp.png`.
2. To preview locally (PowerShell):
```powershell
# from the project root
cd .\web
# If you have Python 3 installed you can run a quick static server:
python -m http.server 3000; # then open http://localhost:3000
```

Deploy to Vercel
- Option A — Quick deploy: Push the repository to GitHub and import the project at https://vercel.com/new. Set the framework to "Other" or "Static Site" and the root directory to `web/`.
- Option B — CLI deploy (from `web/`):
```powershell
# install Vercel CLI (one-time) and run deploy
npm i -g vercel; vercel deploy --prod
```

Notes
- The web UI computes SHA-256 client-side using the browser Web Crypto API and shows a commit+reveal flow.
- The PFP can be uploaded in the header; it is a local image preview and not uploaded anywhere by this demo.
