// Client-side sha256 using Web Crypto
async function sha256Hex(msg){
  const enc = new TextEncoder();
  const data = enc.encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// Word list with hints
const WORDS = [
  { word: 'elephant', hint: 'A large gray animal with a trunk' },
  { word: 'butterfly', hint: 'A colorful insect with wings' },
  { word: 'mountain', hint: 'A very tall landform' },
  { word: 'ocean', hint: 'A vast body of salt water' },
  { word: 'guitar', hint: 'A stringed musical instrument' },
  { word: 'rainbow', hint: 'Appears after rain in the sky' },
  { word: 'computer', hint: 'An electronic device for processing data' },
  { word: 'pizza', hint: 'Popular Italian dish' },
  { word: 'astronaut', hint: 'A person who travels to space' },
  { word: 'treasure', hint: 'Hidden valuables waiting to be found' }
];

// UI elements
const startBtn = document.getElementById('startBtn');
const gameStatus = document.getElementById('gameStatus');
const hintSection = document.getElementById('hintSection');
const playSection = document.getElementById('playSection');
const hintText = document.getElementById('hintText');
const wordDisplay = document.getElementById('wordDisplay');
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const guessedElem = document.getElementById('guessed');
const newGameBtn = document.getElementById('newGameBtn');
const resultElem = document.getElementById('result');
const pfp = document.getElementById('pfp');
const pfpFile = document.getElementById('pfpFile');
const resetPfp = document.getElementById('resetPfp');

let secret = '';
let masked = [];
let guessed = new Set();
let commitHash = '';
let gameActive = false;

function updateWordDisplay(){
  wordDisplay.textContent = masked.join('');
}

function updateGuessed(){
  guessedElem.textContent = 'Guessed: ' + (Array.from(guessed).join(', ') || '—');
}

function startGame(){
  // Pick a random word
  const pick = WORDS[Math.floor(Math.random() * WORDS.length)];
  secret = pick.word.toLowerCase();
  
  // Show hint
  hintText.textContent = pick.hint;
  
  // Compute and store commitment hash
  sha256Hex(secret).then(hash => {
    commitHash = hash;
    console.log('Secret committed (hash):', commitHash);
  });
  
  // Initialize masked word
  masked = Array.from(secret).map(ch => /[a-z]/.test(ch)? '_' : ch);
  updateWordDisplay();
  
  guessed.clear();
  updateGuessed();
  resultElem.textContent = '';
  
  // Show/hide sections
  gameStatus.style.display = 'none';
  hintSection.style.display = 'block';
  playSection.style.display = 'block';
  
  guessBtn.disabled = false;
  gameActive = true;
  guessInput.focus();
}

guessBtn.addEventListener('click', ()=>{
  if(!gameActive) return;
  const g = guessInput.value.trim().toLowerCase();
  guessInput.value = '';
  
  if(!g || !/^[a-z]$/.test(g)) return;
  if(guessed.has(g)) { guessInput.focus(); return; }
  
  guessed.add(g);
  
  // Check if letter is in word
  let found = false;
  for(let i=0;i<secret.length;i++){
    if(secret[i]===g){
      masked[i]=g;
      found = true;
    }
  }
  
  updateWordDisplay();
  updateGuessed();
  
  if(!found){
    resultElem.textContent = '❌ Not in the word';
    resultElem.style.color = '#ff6b6b';
  } else {
    resultElem.textContent = '✅ Correct!';
    resultElem.style.color = '#51cf66';
  }
  
  // Check if won
  if(!masked.includes('_')){
    revealWin();
  }
  
  guessInput.focus();
});

async function revealWin(){
  gameActive = false;
  guessBtn.disabled = true;
  const revealHash = await sha256Hex(secret);
  const match = revealHash === commitHash;
  resultElem.innerHTML = `<strong style="font-size:18px">🎉 You won!</strong><br/>Secret word: <strong>${secret}</strong><br/>
  Commit: ${commitHash.substring(0,16)}...<br/>
  Reveal: ${revealHash.substring(0,16)}... ${match? '✅ MATCH' : '❌ MISMATCH'}`;
  resultElem.style.color = '#51cf66';
}

startBtn.addEventListener('click', startGame);
newGameBtn.addEventListener('click', ()=>{
  gameStatus.style.display = 'block';
  hintSection.style.display = 'none';
  playSection.style.display = 'none';
  resultElem.textContent = '';
});

// PFP upload
pfpFile.addEventListener('change', ()=>{
  const f = pfpFile.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  pfp.src = url;
});
resetPfp.addEventListener('click', ()=>{ pfp.src = './default-pfp.png'; pfpFile.value=''; });

