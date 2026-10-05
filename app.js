const DEFAULTS = {
  people: 1,
  targetDays: 3,
  waterLiters: 6,
  waterPerPerson: 2,
  foodKcal: 6000,
  kcalPerPerson: 2000,
  powerMah: 10000,
  dailyMah: 2500,
  housing: "Appartement",
  zone: "Urbaine",
  lowProfile: false,
  checklist: {},
  foodMode: "total",
  noCooking: false,
  inventory: []
};

const CHECKLIST_ITEMS = [
  "Eau pour 72 h",
  "Nourriture sans cuisson",
  "Lampe + piles",
  "Batterie externe",
  "Radio autonome",
  "Trousse de premiers secours",
  "Traitements personnels",
  "Copies de documents",
  "Argent liquide",
  "Couverture / vêtements chauds",
  "Hygiène de base",
  "Contacts d'urgence hors ligne"
];

const MORSE = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
  K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
  U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",
  8:"---..",9:"----."
};

let state = loadState();
let signalTimer = null;
let signalQueue = [];
let signalIndex = 0;

function loadState(){
  try{
    const loaded = JSON.parse(localStorage.getItem("vaultState") || "{}");
    const data = {...DEFAULTS, ...(loaded && typeof loaded === "object" && !Array.isArray(loaded) ? loaded : {})};
    data.checklist = data.checklist && typeof data.checklist === "object" ? data.checklist : {};
    data.inventory = VaultInventory.normalize(data.inventory);
    data.foodMode = data.foodMode === "inventory" ? "inventory" : "total";
    return data;
  }catch(e){ return {...DEFAULTS, checklist:{}, inventory:[]}; }
}
function saveState(){
  localStorage.setItem("vaultState", JSON.stringify(state));
}
function clamp(n,min,max){ return Math.min(max,Math.max(min,n)); }
function fmt(n){ return Number.isFinite(n) ? n.toFixed(1) : "0.0"; }

function calc(){
  const people = Math.max(1, Number(state.people) || 1);
  const waterDays = (Number(state.waterLiters)||0) / (people * Math.max(.1,Number(state.waterPerPerson)||2));
  const foodDays = VaultInventory.effectiveCalories(state) / (people * Math.max(1,Number(state.kcalPerPerson)||2000));
  const energyDays = (Number(state.powerMah)||0) / Math.max(1,Number(state.dailyMah)||2500);
  const autonomy = Math.max(0, Math.min(waterDays, foodDays, energyDays));

  const completed = CHECKLIST_ITEMS.filter((_,i)=>state.checklist?.[i]).length;
  const checklistScore = completed / CHECKLIST_ITEMS.length;
  const target = Math.max(1, Number(state.targetDays)||3);
  const resourceScore = (
    clamp(waterDays/target,0,1) +
    clamp(foodDays/target,0,1) +
    clamp(energyDays/target,0,1)
  ) / 3;
  const score = Math.round((resourceScore*0.7 + checklistScore*0.3)*100);

  return {waterDays,foodDays,energyDays,autonomy,completed,score,target};
}

function render(){
  const c = calc();
  const critical = [
    ["Eau",c.waterDays],
    ["Nourriture",c.foodDays],
    ["Énergie",c.energyDays]
  ].sort((a,b)=>a[1]-b[1])[0];

  setText("prepScore", c.score);
  document.getElementById("prepMeter").style.width = `${c.score}%`;
  setText("autonomyDays", fmt(c.autonomy));
  setText("criticalResource", `Ressource critique : ${critical[0]}`);
  setText("homeWaterDays", fmt(c.waterDays));
  setText("homeFoodDays", fmt(c.foodDays));
  setText("homeEnergyDays", fmt(c.energyDays));
  setText("waterDays", fmt(c.waterDays));
  setText("foodDays", fmt(c.foodDays));
  setText("energyDays", fmt(c.energyDays));
  setText("checklistCount", c.completed);
  setText("checklistTotal", CHECKLIST_ITEMS.length);
  setText("kitProgress", `${c.completed} / ${CHECKLIST_ITEMS.length} prêts`);
  document.getElementById("kitMeter").style.width = `${c.completed / CHECKLIST_ITEMS.length * 100}%`;

  document.getElementById("waterMeter").style.width = `${clamp(c.waterDays/c.target,0,1)*100}%`;
  document.getElementById("foodMeter").style.width = `${clamp(c.foodDays/c.target,0,1)*100}%`;
  document.getElementById("energyMeter").style.width = `${clamp(c.energyDays/c.target,0,1)*100}%`;

  if(c.score < 35){
    setText("prepHint","Base de préparation à renforcer.");
  }else if(c.score < 70){
    setText("prepHint","Préparation partielle. Quelques manques restent critiques.");
  }else{
    setText("prepHint","Base solide. Vérifie régulièrement les consommables.");
  }

  if(critical[1] < c.target){
    setText("priorityTitle",`Renforcer : ${critical[0]}`);
    setText("priorityText",`Ta réserve de ${critical[0].toLowerCase()} couvre environ ${fmt(critical[1])} jours pour un objectif de ${c.target} jours.`);
  }else if(c.completed < CHECKLIST_ITEMS.length){
    setText("priorityTitle","Terminer la checklist");
    setText("priorityText",`${CHECKLIST_ITEMS.length-c.completed} élément(s) restent à préparer pour la base 72 h.`);
  }else{
    setText("priorityTitle","Préparation opérationnelle");
    setText("priorityText","Tes ressources atteignent l'objectif défini et ta checklist est complète.");
  }

  renderChecklist();
  syncInputs();
  applyLowProfile();
  VaultInventory.render();
}

function renderChecklist(){
  const focused = document.activeElement;
  const focusContainer = focused?.closest(".checklist, .mini-list")?.id;
  const focusCheck = focused?.dataset.check;
  const html = CHECKLIST_ITEMS.map((item,i)=>`
    <label class="check-item">
      <input type="checkbox" data-check="${i}" ${state.checklist?.[i] ? "checked" : ""}>
      <span>${item}</span>
    </label>`).join("");
  document.getElementById("checklist").innerHTML = html;

  document.getElementById("homeChecklist").innerHTML = CHECKLIST_ITEMS.slice(0,4).map((item,i)=>`
    <label class="check-item">
      <input type="checkbox" data-check="${i}" ${state.checklist?.[i] ? "checked" : ""}>
      <span>${item}</span>
    </label>`).join("");

  if(focusContainer && focusCheck != null) document.getElementById(focusContainer).querySelector(`[data-check="${focusCheck}"]`)?.focus({preventScroll:true});

  document.querySelectorAll("[data-check]").forEach(el=>{
    el.addEventListener("change",e=>{
      const idx = e.target.dataset.check;
      state.checklist[idx] = e.target.checked;
      saveState(); render();
    });
  });
}

function setText(id,text){ document.getElementById(id).textContent = text; }

function syncInputs(){
  const map = {
    peopleInput:"people",targetDaysInput:"targetDays",waterLitersInput:"waterLiters",
    waterPerPersonInput:"waterPerPerson",foodKcalInput:"foodKcal",
    kcalPerPersonInput:"kcalPerPerson",powerMahInput:"powerMah",dailyMahInput:"dailyMah",
    housingInput:"housing",zoneInput:"zone"
  };
  Object.entries(map).forEach(([id,key])=>{
    const el = document.getElementById(id);
    if(el && document.activeElement !== el) el.value = state[key];
  });
  document.getElementById("lowProfileToggle").checked = !!state.lowProfile;
}

function bindInputs(){
  const map = {
    peopleInput:"people",targetDaysInput:"targetDays",waterLitersInput:"waterLiters",
    waterPerPersonInput:"waterPerPerson",foodKcalInput:"foodKcal",
    kcalPerPersonInput:"kcalPerPerson",powerMahInput:"powerMah",dailyMahInput:"dailyMah",
    housingInput:"housing",zoneInput:"zone"
  };
  Object.entries(map).forEach(([id,key])=>{
    const el = document.getElementById(id);
    el.addEventListener("input",()=>{
      state[key] = el.type === "number" ? Number(el.value) : el.value;
      saveState(); render();
    });
  });
}

function applyLowProfile(){
  document.body.classList.toggle("low-profile", !!state.lowProfile);
  document.getElementById("lowProfileBtn").setAttribute("aria-pressed", String(!!state.lowProfile));
  document.getElementById("lowProfileToggle").checked = !!state.lowProfile;
}

function toggleLowProfile(){
  state.lowProfile = !state.lowProfile;
  saveState(); applyLowProfile();
}

function toMorse(text){
  return text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .split("").map(ch=>{
      if(ch===" ") return "/";
      return MORSE[ch] || "";
    }).filter(Boolean).join(" ");
}

function updateMorse(){
  const text = document.getElementById("morseInput").value;
  document.getElementById("morseOutput").textContent = text.trim() ? toMorse(text) : "—";
}

function buildSignalQueue(morse){
  const q = [];
  const words = morse.split("/").map(word=>word.trim()).filter(Boolean);
  words.forEach((word,wi)=>{
    const letters = word.split(/\s+/);
    letters.forEach((letter,li)=>{
      [...letter].forEach((symbol,si)=>{
        q.push([1,symbol === "." ? 1 : 3]);
        if(si < letter.length-1) q.push([0,1]);
      });
      if(li < letters.length-1) q.push([0,3]);
    });
    if(wi < words.length-1) q.push([0,7]);
  });
  return q;
}

function stopSignal(){
  if(signalTimer) clearTimeout(signalTimer);
  signalTimer = null;
  signalQueue = [];
  signalIndex = 0;
  document.getElementById("flashOverlay").style.opacity = "0";
}

function playNext(){
  if(signalIndex >= signalQueue.length){ stopSignal(); return; }
  const [on,units] = signalQueue[signalIndex++];
  document.getElementById("flashOverlay").style.opacity = on ? "1" : "0";
  signalTimer = setTimeout(playNext, units*160);
}

function playSignal(){
  VaultSensors.stop();
  stopSignal();
  const morse = toMorse(document.getElementById("morseInput").value || "SOS");
  signalQueue = buildSignalQueue(morse);
  signalIndex = 0;
  playNext();
}

function activateView(target, focusPanel = false){
  const panel = document.getElementById(`panel-${target}`);
  if(!panel) return;
  VaultSensors.stop();
  stopSignal();
  document.querySelectorAll(".nav-item").forEach(btn=>{
    const active = btn.dataset.target === target;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
    btn.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll(".view").forEach(view=>{
    const active = view === panel;
    view.classList.toggle("active", active);
    view.hidden = !active;
  });
  window.scrollTo({top:0,behavior:"instant"});
  if(focusPanel) panel.focus({preventScroll:true});
}
function bindNav(){
  const tabs = [...document.querySelectorAll(".nav-item")];
  tabs.forEach((btn,index)=>{
    btn.addEventListener("click",()=>activateView(btn.dataset.target));
    btn.addEventListener("keydown",event=>{
      let next;
      if(event.key === "ArrowRight" || event.key === "ArrowDown") next = (index+1)%tabs.length;
      if(event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index+tabs.length-1)%tabs.length;
      if(event.key === "Home") next = 0;
      if(event.key === "End") next = tabs.length-1;
      if(next == null) return;
      event.preventDefault();
      activateView(tabs[next].dataset.target);
      tabs[next].focus();
    });
  });
  document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>activateView(btn.dataset.go,true)));
  document.addEventListener("keydown",event=>{if(event.key === "Escape"){stopSignal();VaultSensors.stop();}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){stopSignal();VaultSensors.stop();}});
}

function init(){
  VaultSensors.init();
  bindNav();
  bindInputs();
  VaultInventory.init(()=>state, ()=>{saveState(); render();});
  VaultGuides.init(activateView);
  document.getElementById("lowProfileBtn").addEventListener("click",toggleLowProfile);
  document.getElementById("lowProfileToggle").addEventListener("change",e=>{
    state.lowProfile = e.target.checked; saveState(); applyLowProfile();
  });

  document.getElementById("morseInput").addEventListener("input",updateMorse);
  document.querySelectorAll(".morse-preset").forEach(b=>b.addEventListener("click",()=>{
    document.getElementById("morseInput").value = b.dataset.value;
    updateMorse();
  }));
  document.getElementById("playSignalBtn").addEventListener("click",playSignal);
  document.getElementById("stopSignalBtn").addEventListener("click",stopSignal);

  document.getElementById("resetBtn").addEventListener("click",()=>{
    if(confirm("Réinitialiser toutes les données locales de VAULT ?")){
      state = {...DEFAULTS, checklist:{}, inventory:[]};
      VaultInventory.reset();
      VaultGuides.reset();
      saveState(); render();
      document.getElementById("morseInput").value = "";
      updateMorse();
    }
  });

  window.addEventListener("pagehide",()=>VaultSensors.stop());
  render();
  updateMorse();

  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
}
init();
