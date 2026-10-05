/* Nutrition comes from the user's food labels, per 100 g of edible product. */
const VaultInventory = (()=>{
  const NUTRIENTS = [
    ["energy","Calories","kcal","foodEnergy"],
    ["protein","Protéines","g","foodProtein"],
    ["carbs","Glucides","g","foodCarbs"],
    ["fat","Lipides","g","foodFat"],
    ["fibre","Fibres","g","foodFibre"],
    ["salt","Sel","g","foodSalt"]
  ];
  let readState, changed, editing = null;
  const el = id=>document.getElementById(id);
  const number = value=>{
    if(value === "" || value == null || typeof value === "boolean") return null;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const escape = value=>String(value).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const format = n=>new Intl.NumberFormat("fr-FR", {maximumFractionDigits:1}).format(n);
  const makeId = ()=>"food-" + (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  function normalize(items){
    if(!Array.isArray(items)) return [];
    const used = new Set();
    return items.filter(i=>i && typeof i === "object" && !Array.isArray(i)).map(i=>{
      let id = typeof i.id === "string" && /^food-[\w-]+$/.test(i.id) ? i.id : makeId();
      if(used.has(id)) id = makeId();
      used.add(id);
      const row = {id, name:String(i.name || "Aliment").slice(0,100), quantity:Math.min(100000,number(i.quantity) ?? 0), mass:Math.min(1000000,number(i.mass) ?? 0), inStock:i.inStock === true, ready:i.ready === true, date:typeof i.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(i.date) ? i.date : ""};
      NUTRIENTS.forEach(([key])=>{ const n = number(i[key]); row[key] = n == null ? null : Math.min(key === "energy" ? 100000 : 100,n); });
      return row;
    });
  }
  function totals(data){
    const all = Array.isArray(data.inventory) ? data.inventory : [];
    const selected = all.filter(i=>i.inStock && (!data.noCooking || i.ready) && number(i.quantity) > 0 && number(i.mass) > 0);
    const values = {}, missing = {};
    NUTRIENTS.forEach(([key])=>{
      values[key] = 0; missing[key] = 0;
      selected.forEach(i=>{
        const n = number(i[key]);
        if(n == null) missing[key]++;
        else values[key] += (number(i.quantity) * number(i.mass) / 100) * n;
      });
    });
    return {values, missing, selected:selected.length, owned:all.filter(i=>i.inStock).length, shopping:all.filter(i=>!i.inStock).length};
  }
  function effectiveCalories(data){return data.foodMode === "inventory" ? totals(data).values.energy : (number(data.foodKcal) ?? 0);}
  function render(){
    if(!readState) return;
    const data = readState(), detailed = data.foodMode === "inventory";
    el("foodMode").value = detailed ? "inventory" : "total";
    el("globalFoodLabel").hidden = detailed;
    el("inventoryPanel").hidden = !detailed;
    el("noCooking").checked = !!data.noCooking;
    const t = totals(data);
    const days = Math.max(1,number(data.targetDays) || 3), people = Math.max(1,number(data.people) || 1);
    const share = days * people;
    el("nutritionSummary").innerHTML = NUTRIENTS.map(([key,label,unit])=>{
      const unknown = t.selected === 0 || t.missing[key] === t.selected;
      const partial = t.missing[key] > 0;
      return `<div class="nutrition-metric"><span class="card-label">${label}</span><strong>${unknown ? "—" : format(t.values[key])} <small>${unit}</small></strong><span class="tiny muted">${unknown ? "Non renseigné" : `${format(t.values[key]/share)} ${unit} / pers. / j${partial ? " · partiel" : ""}`}</span></div>`;
    }).join("");
    const need = share * Math.max(1,number(data.kcalPerPerson) || 2000);
    const deficit = Math.max(0,need - t.values.energy);
    el("foodCoverage").textContent = `${format(t.values.energy)} kcal comptées · ${deficit ? `${format(deficit)} kcal manquantes` : "objectif calorique atteint"} pour ${people} personne(s) sur ${days} jour(s).`;
    el("nutritionCompleteness").textContent = `Apports / personne / jour = réserves réparties sur ton objectif de ${days} jours, sans recommandation nutritionnelle personnalisée. ${t.selected} ligne(s) comptée(s).` + (NUTRIENTS.some(([key])=>t.missing[key]) ? " Totaux partiels : certains apports ne sont pas renseignés." : "");
    el("inventoryCount").textContent = `${t.owned} en stock · ${t.shopping} à acheter`;
    (data.inventory || []).forEach(i=>{
      const row = el("foodList").querySelector(`[data-row="${i.id}"]`);
      if(!row) return;
      const eligible = i.inStock && (!data.noCooking || i.ready);
      const energy = number(i.energy);
      row.querySelector(".food-row-total").textContent = `${energy == null ? "Calories inconnues" : `${format(i.quantity*i.mass/100*energy)} kcal`} · ${!i.inStock ? "À acheter" : !eligible ? "Exclu : cuisson nécessaire" : "Compté"}`;
    });
  }
  function renderList(){
    const items = readState().inventory;
    el("foodList").innerHTML = items.length ? items.map(i=>`<article class="food-row" data-row="${i.id}">
      <div class="section-title-row"><h4>${escape(i.name)}</h4><span class="tiny muted">${i.ready ? "Sans cuisson" : "Cuisson nécessaire"}</span></div>
      <div class="food-row-controls"><label class="check-item"><input type="checkbox" data-owned="${i.id}" ${i.inStock ? "checked" : ""}><span>En stock</span></label><label>Unités<input type="number" data-quantity="${i.id}" min="0" max="100000" step="any" value="${i.quantity}" aria-label="Unités — ${escape(i.name)}"></label></div>
      <p class="tiny muted">${format(i.mass)} g / unité${i.date ? ` · Date à vérifier : ${i.date.split("-").reverse().join("/")}` : ""}</p><p class="food-row-total"></p>
      <div class="quick-actions"><button class="ghost-btn" data-edit="${i.id}">Modifier</button><button class="danger-ghost" data-remove="${i.id}" aria-label="Supprimer ${escape(i.name)}">Supprimer</button></div>
    </article>`).join("") : '<p class="muted inventory-empty">Ajoute ton premier aliment : une conserve, des biscuits, un sachet…</p>';
    render();
  }
  function openEditor(item){
    editing = item?.id || null;
    el("foodForm").reset();
    el("foodEditorTitle").textContent = item ? "Modifier l’aliment" : "Ajouter un aliment";
    el("foodName").value = item?.name || "";
    el("foodQuantity").value = item?.quantity ?? 1;
    el("foodMass").value = item?.mass ?? "";
    NUTRIENTS.forEach(([key,,,id])=>el(id).value = item?.[key] ?? "");
    el("foodDate").value = item?.date || "";
    el("foodInStock").checked = item ? item.inStock : true;
    el("foodReady").checked = item ? item.ready : true;
    el("foodEditor").open = true;
    el("foodName").focus();
  }
  function reset(){
    editing = null;
    el("foodForm").reset();
    el("foodEditorTitle").textContent = "Ajouter un aliment";
    el("foodEditor").open = false;
    renderList();
  }
  function init(getState,onChange){
    readState = getState; changed = onChange;
    el("foodMode").addEventListener("change",e=>{readState().foodMode = e.target.value; changed();});
    el("noCooking").addEventListener("change",e=>{readState().noCooking = e.target.checked; changed();});
    el("newFood").addEventListener("click",()=>openEditor());
    el("cancelFood").addEventListener("click",reset);
    el("foodForm").addEventListener("submit",event=>{
      event.preventDefault();
      if(!el("foodForm").reportValidity()) return;
      const name = el("foodName").value.trim();
      if(!name){el("foodName").focus(); return;}
      const item = {id:editing || makeId(), name, quantity:number(el("foodQuantity").value), mass:number(el("foodMass").value), inStock:el("foodInStock").checked, ready:el("foodReady").checked, date:el("foodDate").value};
      NUTRIENTS.forEach(([key,,,id])=>item[key] = number(el(id).value));
      const items = readState().inventory, index = items.findIndex(i=>i.id === editing);
      if(index < 0) items.push(item); else items[index] = item;
      reset(); changed(); el("newFood").focus();
    });
    el("foodList").addEventListener("input",event=>{
      const id = event.target.dataset.quantity;
      const row = readState().inventory.find(i=>i.id === id);
      if(!row || !event.target.validity.valid) return;
      row.quantity = number(event.target.value) ?? 0;
      changed();
    });
    el("foodList").addEventListener("change",event=>{
      const id = event.target.dataset.owned;
      const row = readState().inventory.find(i=>i.id === id);
      if(row){row.inStock = event.target.checked; changed();}
    });
    el("foodList").addEventListener("click",event=>{
      const button = event.target.closest("button");
      if(!button) return;
      const items = readState().inventory;
      if(button.dataset.edit) openEditor(items.find(i=>i.id === button.dataset.edit));
      if(button.dataset.remove){
        readState().inventory = items.filter(i=>i.id !== button.dataset.remove);
        if(editing === button.dataset.remove) reset(); else renderList();
        changed(); el("newFood").focus();
      }
    });
    renderList();
  }
  return {normalize, totals, effectiveCalories, init, render, reset};
})();
