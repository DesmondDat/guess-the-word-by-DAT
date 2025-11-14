// Client-side sha256 using Web Crypto
async function sha256Hex(msg){
  const enc = new TextEncoder();
  const data = enc.encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// UI elements
const secretInput = document.getElementById('secretInput');
const commitBtn = document.getElementById('commitBtn');
const commitArea = document.getElementById('commitArea');
const wordDisplay = document.getElementById('wordDisplay');
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const guessedElem = document.getElementById('guessed');
const revealBtn = document.getElementById('revealBtn');
const autoSolve = document.getElementById('autoSolve');
const pfp = document.getElementById('pfp');
const pfpFile = document.getElementById('pfpFile');
const resetPfp = document.getElementById('resetPfp');
const moreLink = document.getElementById('moreLink');

let secret = '';
let masked = [];
let guessed = new Set();
let commitHash = '';

function updateWordDisplay(){
  if(!secret) { wordDisplay.textContent='—'; return }
  wordDisplay.textContent = masked.join('');
}

function updateGuessed(){
  guessedElem.textContent = 'Guessed: ' + (Array.from(guessed).join(', ') || '—');
}

commitBtn.addEventListener('click', async ()=>{
  const s = secretInput.value.trim();
  if(!s) return alert('Enter a secret word');
  secret = s.toLowerCase();
  commitHash = await sha256Hex(secret);
  commitArea.textContent = 'Secret hash (commit): ' + commitHash;
  // prepare masked
  masked = Array.from(secret).map(ch => /[a-z]/.test(ch)? '_' : ch);
  updateWordDisplay();
  guessed.clear(); updateGuessed();
  guessBtn.disabled = false; revealBtn.disabled = false; autoSolve.disabled = false;
  // hide secret input for privacy
  secretInput.value = '';
  secretInput.placeholder = 'Secret committed — hidden';
});

guessBtn.addEventListener('click', ()=>{
  const g = guessInput.value.trim().toLowerCase();
  guessInput.value = '';
  if(!g || !/^[a-z]$/.test(g)) return;
  if(guessed.has(g)) return;
  guessed.add(g);
  for(let i=0;i<secret.length;i++) if(secret[i]===g) masked[i]=g;
  updateWordDisplay(); updateGuessed();
  // check finished
  if(!masked.includes('_')){
    revealFinal();
  }
});

autoSolve.addEventListener('click', ()=>{
  // debug helper: reveal letters in secret one by one
  if(!secret) return;
  for(const ch of secret){ if(/[a-z]/.test(ch) && !guessed.has(ch)){
    guessed.add(ch); for(let i=0;i<secret.length;i++) if(secret[i]===ch) masked[i]=ch; break; }
  }
  updateWordDisplay(); updateGuessed(); if(!masked.includes('_')) revealFinal();
});

revealBtn.addEventListener('click', revealFinal);

async function revealFinal(){
  if(!secret) return;
  const revealHash = await sha256Hex(secret);
  const ok = revealHash === commitHash;
  commitArea.textContent += '\nFinal word: ' + secret + '\nReveal hash: ' + revealHash + (ok? ' ✅ MATCH' : ' ❌ MISMATCH');
  // disable guessing
  guessBtn.disabled = true; autoSolve.disabled = true; revealBtn.disabled = true;
}

// PFP upload
pfpFile.addEventListener('change', ()=>{
  const f = pfpFile.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  pfp.src = url;
});
resetPfp.addEventListener('click', ()=>{ pfp.src = './default-pfp.png'; pfpFile.value=''; });

// About Arcium link (placeholder). Replace with official URL if desired.
moreLink.href = 'https://arcium.ai/';
moreLink.textContent = 'Visit Arcium (official)';

// initial
updateWordDisplay(); updateGuessed();
