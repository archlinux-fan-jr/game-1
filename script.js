
let clicks = 0;
let basePerClick = 0.01;
let perClick = 0.01;
let cps = 0;
let autoMultiplier = 1;
let tempBoost = 1;
let activeTimer = null;
let lastUnlockState = "";

// Statistika za posebne nadgradnje
let rainUnlocked = false;
let luckChance = 0; 
let luckMult = 1;
let combo = 1;
let maxCombo = 1;
let comboTimer = null;
let adrenalineActive = false;


// AVTOMATI (ostanejo enaki)
let autos = [
  {name:"Baby Donkey",        base:0.01,          cost:1,             		level:0},
  {name:"Toddler Donkey",     base:0.05,          cost:5,              		level:0},
  {name:"Kiddo Donkey",       base:0.20,          cost:20,              	level:0},
  {name:"Farm Donkey",        base:1,             cost:500,             	level:0},
  {name:"Factory Donkey",     base:2,             cost:1000,             	level:0},
  {name:"Mega Donkey",        base:5,            	cost:2000,           		level:0},
  {name:"Ultra Donkey",       base:10,           	cost:5000,           		level:0},
  {name:"God Donkey",         base:25,           	cost:10000,           	level:0},
  {name:"Galactic Donkey",    base:50,          	cost:20000,          		level:0},
  {name:"Quantum Donkey",     base:100,         	cost:50000,         		level:0},
  {name:"Multiverse Donkey",  base:250,         	cost:100000,        		level:0},
  {name:"Portal Donkey",      base:500,        		cost:200000,        		level:0},
  {name:"Atomic Donkey",      base:1000,       		cost:500000,       			level:0},
  {name:"Nebula Donkey",      base:2500,       		cost:1000000,      			level:0},
  {name:"Stellar Donkey",     base:5000,      		cost:2000000,     			level:0},
  {name:"Cosmic Donkey",      base:10000,     		cost:5000000,    				level:0},
  {name:"Eternal Donkey",     base:25000,     		cost:10000000,   				level:0},
  {name:"Infinity Donkey",    base:50000,    			cost:20000000,  				level:0},
  {name:"Singularity Donkey", base:100000,   			cost:50000000, 					level:0},
  {name:"Omni Donkey",        base:250000,   			cost:1000000000,				level:0},
  {name:"Legendary Donkey",   base:500000,  			cost:2000000000,				level:0},
  {name:"Mythic Donkey",      base:999000000, 		cost:999000000000,			level:0}
];

// 1. DINAMIČNE NADGRADNJE
let upgrades = [
  { name: "Baby Double Click",		desc: "x2 manual click", 						cost:	0.50, 		bought: false, type: "clickMult", value: 2 },
  { name: "Baby Two&Half Click",	desc: "x2.5 manual click", 					cost: 2.5, 			bought: false, type: "clickMult", value: 2.5 },
  { name: "Baby Cinco Click",			desc: "x5 manual click", 						cost: 10, 			bought: false, type: "clickMult", value: 5 },
  { name: "Full Click", 					desc: "First Full click", 					cost: 100, 			bought: false, type: "clickMult", value: 4 },
  { name: "Double Click", 				desc: "x2 manual click", 						cost: 250, 			bought: false, type: "clickMult", value: 2 },
  { name: "Two&Half Click", 			desc: "x2.5 manual click", 					cost: 750, 			bought: false, type: "clickMult", value: 2.5 },
  { name: "Double Click", 				desc: "x2 manual click", 						cost: 2000, 		bought: false, type: "clickMult", value: 2 },
  { name: "Two&Half Click",				desc: "x2.5 manual click", 					cost: 5000, 		bought: false, type: "clickMult", value: 2.5 },
  
  { name: "Lucky Hoof",				desc: "10% chance for 2x click", 			cost: 8000, 			bought: false, type: "luck", chance: 0.1, mult: 2 },
   
  { name: "Ultra Click", 			desc: "x4 manual click", 							cost: 20000, 			bought: false, type: "clickMult", value: 4 },
  
  { name: "Adrenaline",				desc: "Clicks x3 for 10s every 60s", 	cost: 80000, 			bought: false, type: "special", 	id: "adrenaline" },
  
  { name: "Treasure Click", 	desc: "1% chance to gain 1% of bank", cost: 99999, 		bought: false, type: "special", 	id: "treasure" },
   
  { name: "Combo Starter", 		desc: "Clicks stack combo (max x5)", 	cost: 100000, 		bought: false, type: "special", 	id: "combo5" },
 
  { name: "Cinco Click", 			desc: "x5 manual click", 							cost: 500000, 		bought: false, type: "clickMult", value: 5 },
  
  { name: "Divine Hoof", 			desc: "50% chance for 5x click", 			cost: 5005005, 		bought: false, type: "luck", chance: 0.5, mult: 5 },
  
  { name: "God Click", 				desc: "x7 manual click", 							cost: 7000000, 		bought: false, type: "clickMult", value: 7 },
  
  { name: "Mega Click", 			desc: "x10 manual click", 						cost: 100000000, 		bought: false, type: "clickMult", value: 10 },
  
  { name: "Donkey rain", 			desc: "x3 farm every 10 mins for 2 mins", cost: 800000000,bought: false, type: "special", 	id: "rain" },
  																																				
  { name: "Quantum Click",		desc: "x20 manual click", 						cost: 2000000000, 	bought: false, type: "clickMult", value: 20 },
  { name: "OMG Click", 				desc: "x50 manual click", 						cost: 50000000000,	bought: false, type: "clickMult", value: 50 },
  { name: "Infinity Click", 	desc: "x999 manual click", 						cost: 9990000000000,bought: false, type: "clickMult", value: 999 }
  
];



function format(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";

  if (n < 1000) {
    // Če je manj kot 1€, pokaži 2 decimalki (npr. 0,50)
    return n.toLocaleString('de-DE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  } else {
    // Če je 1€ ali več, odreži decimalke in uporabi pike za tisočice (npr. 1.000)
    return Math.floor(n).toLocaleString('de-DE', { 
      maximumFractionDigits: 0 
    });
  }
}

function calculatePerClick() {
  let power = basePerClick;

  // Samo še množenje (Double Click, OMG Click itd.)
  upgrades.forEach(u => {
    if (u.bought && u.type === "clickMult") {
      power *= u.value;
    }
  });

  // Začasni bonusi
  power *= combo;
  if (adrenalineActive) power *= 3;

  return power;
}

function clickDonkey(){
  let currentPower = calculatePerClick();
  let finalGain = currentPower;
  let msg = "+" + format(finalGain);

  // LOGIKA: Luck (Sreča)
  upgrades.filter(u => u.bought && u.type === "luck").forEach(u => {
    if (Math.random() < u.chance) {
        finalGain *= u.mult;
        msg = "CRIT! +" + format(finalGain);
    }
  });

	// LOGIKA: Treasure Click (Jackpot)
  if (upgrades.find(u => u.name === "Treasure Click" && u.bought)) {
      if (Math.random() < 0.01) {
          let bonus = clicks * 0.01;
          if(bonus < 1) bonus = clicks * 0.1 + 10; 
          
          finalGain += bonus;
          
          // Pokličemo efekte s številko dobitka
          triggerJackpotEffects(bonus);
          
          // Ker efekte sprožimo ročno, lahko msg pustimo prazen ali kratek
          msg = ""; 
      }
  }

  clicks += finalGain;
  
  // LOGIKA: Kombo sistem
  if (maxCombo > 1) {
      combo = Math.min(combo + 0.1, maxCombo);
      clearTimeout(comboTimer);
      comboTimer = setTimeout(() => { combo = 1; update(); }, 2000);
  }

  spawnFloating(msg);
  update();
}

// Funkcija za vizualni feedback (trzaj osla)
function animateDonkey() {
    const donkey = document.getElementById("donkey");
    donkey.classList.add("clicking");
    
    // Odstranimo razred po 50ms, da se vrne v prvotno stanje
    setTimeout(() => {
        donkey.classList.remove("clicking");
    }, 50);
}


// Onemogoči desni klik meni na CELOTNI strani
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Poslušalec za klike (ostane podobno, le da zdaj pokriva vse gumbe/kartice)
const donkeyImg = document.getElementById("donkey");

// Posodobljeno klikanje z miško
donkeyImg.addEventListener("mousedown", function(e) {
    e.preventDefault(); 
    if (e.button === 0 || e.button === 2) {
        animateDonkey(); // Sproži animacijo
        clickDonkey();   // Dodaj denar
    }
});

// Posodobljeno klikanje za mobilnike
donkeyImg.addEventListener("touchstart", function(e) {
    e.preventDefault();
    animateDonkey(); // Sproži animacijo
    clickDonkey();   // Dodaj denar
}, {passive: false});

function buyUpgrade(i){
  let u = upgrades[i];
  if(!u.bought && clicks >= u.cost){
    clicks -= u.cost;
    u.bought = true;

    // Aktiviraj posebne logike ob nakupu
    if (u.id === "rain") startRainCycle();
    if (u.id === "adrenaline") startAdrenalineCycle();
    if (u.id === "combo5") maxCombo = 5;

    updateCPS();
    update();
  }
}

// SPECIAL EVENTI
setInterval(() => {
    if (cps > 0) {
        clicks += cps;
        spawnFloating("+" + format(cps), true);
        update(); // To zdaj ne bo več "skakalo"
    }
}, 1000);

function updateTimer(seconds) {
  let timerEl = document.getElementById("eventTimer");
  
  // Počistimo prejšnji timer, če obstaja, da ne tečeta dva hkrati
  if (activeTimer) clearTimeout(activeTimer);

  if (seconds <= 0) {
    timerEl.innerText = "";
    document.body.classList.remove("event-active");
    return;
  }
  
  document.body.classList.add("event-active");
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  timerEl.innerText = `SPECIAL EVENT: ${min}:${sec < 10 ? '0' : ''}${sec}`;
  
  activeTimer = setTimeout(() => updateTimer(seconds - 1), 1000);
}

// Popravi startRainCycle, da sproži timer
function startRainCycle() {
  setInterval(() => {
    tempBoost = 3;
    updateCPS();
    updateTimer(120); // 2 minuti (120s)
    
    setTimeout(() => {
      tempBoost = 1;
      updateCPS();
    }, 120000);
  }, 600000);
}

function startAdrenalineCycle() {
  setInterval(() => {
    adrenalineActive = true;
    updateTimer(10); // Timer nastavimo na 10 sekund
    
    // Adrenalin traja 10 sekund (10000 ms)
    setTimeout(() => {
      adrenalineActive = false;
    }, 10000); 
    
  }, 60000); // Dogodek se sproži vsakih 60 sekund
}

function buyAuto(i){
  let a = autos[i];
  if(clicks >= a.cost){
    clicks -= a.cost;
    a.level++;
    // Povečamo ceno za 20%, a ne uporabimo Math.floor, 
    // da ne zaokrožimo na 0, če je znesek nizek.
    a.cost = a.cost * 1.2; 
    updateCPS();
    update();
  }
}

function updateCPS(){
  cps = 0;
  autos.forEach(a=> cps += a.level * a.base);
  cps *= autoMultiplier * tempBoost;
}

function spawnFloating(text, isAuto = false) {
  let el = document.createElement("div");
  el.className = "float";
  el.innerText = text;
  
  // Če sporočilo vsebuje besedo JACKPOT, mu dodamo poseben stil
  if (text.includes("JACKPOT")) {
      el.classList.add("jackpot");
  }

  if (isAuto) {
    el.style.left = "-50px"; 
    el.style.color = "cyan";
  } else {
    el.style.right = "-50px";
    // Če ni jackpot, naj bo običajen lime
    if (!text.includes("JACKPOT")) el.style.color = "lime";
  }

  document.getElementById("floating").appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function triggerJackpotEffects(bonusAmount) {
    const mainArea = document.querySelector(".main-area");
    const floatingLayer = document.getElementById("floating");

    // Aktiviramo prosojen zlat sij samo v sredini
    mainArea.classList.add("jackpot-active");
    
    // 1. Ustvarimo velik naslov "JACKPOT"
    let title = document.createElement("div");
    title.className = "float jackpot-title";
    title.innerText = "💰 JACKPOT 💰";
    floatingLayer.appendChild(title);
    
    // 2. Ustvarimo zelo vidno številko dobitka
    let amount = document.createElement("div");
    amount.className = "float jackpot-amount";
    amount.innerText = "+" + format(bonusAmount) + " €";
    // Premaknemo številko malo nižje od naslova
    amount.style.marginTop = "60px";
    floatingLayer.appendChild(amount);
    
    // Po 1.5 sekundi odstranimo efekte
    setTimeout(() => {
        mainArea.classList.remove("jackpot-active");
        title.remove();
        amount.remove();
    }, 2500);
}

function update() {
    perClick = calculatePerClick();
    document.getElementById("clicks").innerText = format(clicks);
    document.getElementById("perClick").innerText = format(perClick) + (combo > 1 ? " (x" + combo.toFixed(1) + ")" : "");
    document.getElementById("cps").innerText = format(cps);

    // USTVARIMO STANJE:
    // 1. Spremljamo kupljene nadgradnje in stopnje avtomatov
    // 2. Spremljamo vidnost vsakega avtomata posebej (ali je nad 1/2.5 cene)
    // 3. Spremljamo vidnost vsake nadgradnje posebej
    let currentUnlockState = upgrades.map(u => u.bought).join(",") + 
                             autos.map(a => a.level).join(",") + 
                             autos.map(a => clicks >= a.cost / 4).join(",") +
                             upgrades.map(u => clicks >= u.cost / 4).join(",");

    // Če se katerikoli prag spremeni, takoj izrišemo trgovino
    if (currentUnlockState !== lastUnlockState) {
        lastUnlockState = currentUnlockState;
        renderShops();
    }
    
    // Osvežimo samo prosojnost
    document.querySelectorAll('.card').forEach(card => {
        let cost = parseFloat(card.getAttribute('data-cost'));
        card.style.opacity = clicks >= cost ? "1" : "0.5";
    });

    save();
}

function renderShops() {
    // --- AUTO FARMERS SHOP ---
    let autoShop = document.getElementById("autoShop");
    autoShop.innerHTML = "";
    autos.forEach((a, i) => {
        let unlockThreshold = a.cost / 4;
        if (clicks >= unlockThreshold || a.level > 0 || i === 0) {
            let div = document.createElement("div");
            div.className = "card";
            div.setAttribute('data-cost', a.cost);
            div.onclick = () => buyAuto(i);
            div.innerHTML = `<b>${a.name}</b><br>${format(a.base)} €/s (lvl ${a.level})<br>${format(a.cost)} €`;
            autoShop.prepend(div);
        }
    });

    // --- UPGRADES SHOP ---
    let upgradeShop = document.getElementById("upgradeShop");
    upgradeShop.innerHTML = "";
    let firstAvailableUpgradeFound = false;
    upgrades.forEach((u, i) => {
        let unlockThreshold = u.cost / 4;
        let isFirstAvailable = false;
        if (!u.bought && !firstAvailableUpgradeFound) {
            isFirstAvailable = true;
            firstAvailableUpgradeFound = true;
        }
        if (!u.bought && (clicks >= unlockThreshold || isFirstAvailable)) {
            let div = document.createElement("div");
            div.className = "card";
            div.setAttribute('data-cost', u.cost);
            div.onclick = () => buyUpgrade(i);
            div.innerHTML = `<b>${u.name}</b><br>${u.desc}<br>${format(u.cost)} €`;
            upgradeShop.prepend(div);
        }
    });
}


function save(){
  localStorage.setItem("donkeySave",JSON.stringify({clicks, autos, upgrades, maxCombo}));
}

function load(){
  let d=JSON.parse(localStorage.getItem("donkeySave"));
  if(d){
    clicks=d.clicks||0;
    if(d.autos) d.autos.forEach((a,i)=> { if(autos[i]) autos[i].level = a.level; autos[i].cost = a.cost; });
    if(d.upgrades) d.upgrades.forEach((u,i)=> { if(upgrades[i]) upgrades[i].bought = u.bought; });
    maxCombo = d.maxCombo || 1;
    
    // Ponovno zaženi cikle, če so kupljeni
    if(upgrades.find(u=>u.id==="rain" && u.bought)) startRainCycle();
    if(upgrades.find(u=>u.id==="adrenaline" && u.bought)) startAdrenalineCycle();
  }
  updateCPS();
}

function resetGame(){ localStorage.clear(); location.reload(); }
function toggleTheme(){ document.body.classList.toggle("light"); }

load();
update();

// toggle console
document.getElementById("devTrigger").onclick = () => {
  let c = document.getElementById("devConsole");
  c.style.display = c.style.display === "none" ? "block" : "none";
};

// input handler
document.getElementById("devInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let input = e.target.value.trim();
    handleCommand(input);
    e.target.value = "";
  }
});

function handleCommand(cmd) {
  try {
    if (!cmd.startsWith("$")) return;

    let [key, value] = cmd.split("=");
    key = key.toLowerCase();
    value = Number(value);

    if (!isFinite(value) || value < 0) return;

    // 💰 MONEY (exact set)
    if (key === "$money") {
      clicks = value;
    }

    // 🏭 AUTO (SET CPS DIRECTLY instead of levels)
    if (key === "$auto") {
      cps = value; // 🔥 THIS FIXES BILLION BUG
    }

    // 🖱 CLICK (force override)
    if (key === "$click") {
      perClick = value;

      // force UI update immediately
      document.getElementById("perClick").innerText = format(perClick);
    }

    // update UI only (DO NOT recalc CPS after auto command)
    document.getElementById("clicks").innerText = format(clicks);
    document.getElementById("cps").innerText = format(cps);

    save();

  } catch (e) {
    console.log("Invalid command");
  }
}
