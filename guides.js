/* Small offline decision graphs. Official source links accompany each journey. */
const VaultGuides = (()=>{
  const civil = "https://www.securite-civile.interieur.gouv.fr/reagir/";
  const kit = ["Sécurité civile — kit 72 h", civil+"comment-se-preparer-face-aux-risques/kit-durgence"];
  const option = (label,next)=>({label,next});
  const node = (title,actions,question="",choices=[],shortcuts=[])=>({title,actions,question,choices,shortcuts});
  const module = (label,view)=>({label,view});
  const call = (label,phone)=>({label,phone});
  const GUIDES = [
    {id:"power",title:"Plus d’électricité",description:"Danger électrique, panne durable et réserves.",sources:[["Enedis — dépannage et urgences","https://www.enedis.fr/aide-contact/depannage-et-urgences"]],nodes:{
      start:node("Vérifier les dangers visibles",["Garde tes distances avec les câbles tombés, les coffrets abîmés et les objets en contact avec eux."],"Vois-tu des étincelles, un câble tombé ou sens-tu une odeur de brûlé ?",[option("Oui / un danger est visible","danger"),option("Non, seulement une coupure","supply")]),
      danger:node("S’éloigner et signaler",["Ne touche pas l’installation. Éloigne les personnes.","Contacte le dépannage Enedis : 09 72 67 50 suivi du numéro de ton département. En cas de feu ou de danger immédiat, appelle les secours."],"",[],[call("Appeler le 112","112")]),
      supply:node("Protéger les usages essentiels",["Utilise une lampe à piles. Laisse le réfrigérateur et le congélateur fermés.","Économise la batterie du téléphone et consulte les informations du gestionnaire de réseau."],"Un appareil médical indispensable dépend-il de l’électricité ?",[option("Oui","medical"),option("Non","reserve")]),
      medical:node("Suivre le plan de secours prévu",["Applique les consignes de ton équipe de soins et contacte-la. Si l’interruption menace la personne, appelle le 15."],"",[],[call("Appeler le 15","15")]),
      reserve:node("Évaluer la durée disponible",["Vérifie l’autonomie de tes batteries et tes aliments accessibles sans cuisson.","Réévalue les réserves et les nouvelles consignes si la panne se prolonge."],"",[],[module("Voir mon stock","stock")])
    }},
    {id:"water",title:"Eau indisponible",description:"Coupure, restriction de consommation ou réserve faible.",sources:[["Ministère de la Santé — eau du robinet","https://sante.gouv.fr/sante-et-environnement/eaux/article/eau-du-robinet"],kit],nodes:{
      start:node("Clarifier le problème",["Consulte les informations de la mairie, du distributeur ou de l’ARS."],"Une restriction de consommation est-elle annoncée ?",[option("Oui / potabilité incertaine","restriction"),option("Non, le réseau est coupé","stock")]),
      restriction:node("Choisir une eau sûre",["Suis les restrictions locales. Utilise une réserve d’eau potable sûre, par exemple des bouteilles scellées.","Ne suppose pas qu’une filtration ou une ébullition élimine tous les contaminants. Attends les instructions adaptées au problème."],"As-tu assez d’eau potable pour ton foyer ?",[option("Oui","enough"),option("Non / je ne sais pas","supply")]),
      stock:node("Faire le point sur l’eau potable",["Sépare les réserves d’eau potable de celles réservées au nettoyage.","Compare les litres disponibles au nombre de personnes et à la durée visée."],"La réserve potable est-elle suffisante ?",[option("Oui","enough"),option("Non / je ne sais pas","supply")], [module("Calculer mes réserves","stock")]),
      enough:node("Préserver la réserve",["Garde l’eau potable pour boire et préparer les aliments. Suis les informations sur le rétablissement du service.","Ne consomme pas une eau soumise à restriction avant la levée officielle de celle-ci."],"",[],[module("Actualiser mon stock","stock")]),
      supply:node("Organiser le réapprovisionnement",["Cherche les points de distribution annoncés par la mairie ou le distributeur.","Préviens-les si une personne vulnérable ne peut pas accéder à l’eau."],"",[],[module("Voir mon stock","stock")])
    }},
    {id:"flood",title:"L’eau monte",description:"Inondation : se mettre à l’abri ou suivre une évacuation.",sources:[["Géorisques — inondation","https://www.georisques.gouv.fr/me-preparer-me-proteger/que-faire-en-cas-d-inondation"]],nodes:{
      start:node("Éviter les zones inondées",["Ne descends pas en sous-sol ou dans un parking pour récupérer des affaires.","Ne traverse pas une voie inondée, à pied ou en voiture."],"Les autorités ordonnent-elles d’évacuer ?",[option("Oui","leave"),option("Non / pas de consigne reçue","shelter")]),
      leave:node("Vérifier le trajet",["Suis le lieu et l’itinéraire indiqués par les autorités."],"Le trajet indiqué est-il accessible sans traverser l’eau ?",[option("Oui","route"),option("Non / je suis bloqué","trapped")]),
      route:node("Partir par l’itinéraire sûr",["Prends le kit seulement s’il est immédiatement accessible.","Suis les secours. Ne t’engage pas sur une route devenue inondée."],"",[],[module("Vérifier mon kit","checklist")]),
      shelter:node("Se mettre en hauteur",["Rejoins un étage ou un lieu haut accessible en sécurité avec ton kit.","Coupe gaz et électricité uniquement si tu peux le faire depuis un endroit sec sans t’exposer.","Écoute les consignes officielles et garde les communications disponibles pour les urgences."],"L’eau t’empêche-t-elle de rejoindre un abri sûr ?",[option("Oui","trapped"),option("Non, je suis à l’abri","wait")]),
      trapped:node("Demander du secours",["Appelle le 112 et indique ta position, le nombre de personnes et le danger. Reste en hauteur ; n’entre pas dans l’eau."],"",[],[call("Appeler le 112","112")]),
      wait:node("Rester à l’écoute",["Reste à l’abri. Suis toute nouvelle consigne d’évacuation et ne retourne pas dans les zones inondées."],"",[])
    }},
    {id:"fire",title:"Feu ou fumée",description:"Départ de feu dans le logement ou fumée à l’extérieur.",sources:[["Sécurité civile — incendie domestique",civil+"risques-de-vie-courante/incendie-domestique"]],nodes:{
      start:node("Identifier où se trouve le feu",["Alerte les occupants. En cas d’incendie, appelle le 18 ou le 112."],"Le feu se trouve-t-il dans ton logement ?",[option("Oui","exit"),option("Non, fumée dans le couloir / ailleurs","inside"),option("Je ne sais pas / sortie enfumée","inside")],[call("Appeler le 18","18")]),
      exit:node("Vérifier une sortie sûre",["Ne tente pas de traverser un passage envahi par la fumée."],"Peux-tu sortir sans traverser les flammes ou une zone enfumée ?",[option("Oui","outside"),option("Non","blocked")]),
      outside:node("Évacuer et rester dehors",["Sors, ferme les portes derrière toi sans les verrouiller. Utilise les escaliers, jamais l’ascenseur.","Depuis un endroit sûr, appelle les secours et ne retourne pas dans le logement."],"",[],[call("Appeler le 18","18")]),
      inside:node("Rester protégé dans le logement",["Si le couloir ou l’escalier est enfumé, ne l’emprunte pas. Ferme la porte et place du linge humide au bas de celle-ci.","Appelle les secours, indique ton étage et signale ta présence à une fenêtre sans t’exposer."],"",[],[call("Appeler le 18","18")]),
      blocked:node("Signaler que tu es bloqué",["Isole-toi du feu derrière une porte fermée si possible et signale ta position aux secours.","Reste près du sol si la fumée entre. Ne saute pas par une fenêtre."],"",[],[call("Appeler le 112","112")])
    }},
    {id:"industry",title:"Alerte industrielle",description:"Se confiner et suivre les instructions locales.",sources:[["Sécurité civile — accident industriel",civil+"risques-majeurs/accident-industriel"]],nodes:{
      start:node("Recevoir la consigne",["Consulte le message FR-Alert, la radio ou les informations de la préfecture."],"Un ordre officiel d’évacuation est-il donné ?",[option("Oui","evacuate"),option("Non / consigne de confinement","shelter")]),
      shelter:node("Se confiner",["Rejoins un bâtiment clos proche. Ferme portes, fenêtres et aérations ; arrête la ventilation.","Évite flammes, cigarettes et étincelles. Reste à l’intérieur."],"Une nouvelle consigne demande-t-elle de partir ?",[option("Oui","evacuate"),option("Non","wait")]),
      evacuate:node("Suivre l’évacuation officielle",["Suis exactement la destination et l’itinéraire annoncés. Ne choisis pas de passer près du site accidenté."],"",[],[module("Mon kit de départ","checklist")]),
      wait:node("Attendre la fin officielle de l’alerte",["Reste confiné et continue à écouter les autorités. Ne sors pas sur la seule impression que le danger est passé."],"",[])
    }},
    {id:"heat",title:"Forte chaleur",description:"Repérer un malaise, se rafraîchir et aider ses proches.",sources:[["Santé publique France — canicule","https://www.santepubliquefrance.fr/linfo-accessible-a-tous/canicule"],["Santé publique France — bons réflexes","https://www.santepubliquefrance.fr/index.php/les-actualites/les-fortes-chaleurs-nous-concernent-tous-adoptons-les-bons-reflexes"]],nodes:{
      start:node("Vérifier l’état des personnes",[],"Une personne présente-t-elle un malaise ou une confusion ?",[option("Oui","urgent"),option("Non","cool")]),
      urgent:node("Appeler et rafraîchir",["Appelle le 15. Installe la personne dans un endroit frais et suis les instructions du régulateur.","Rafraîchis le corps avec de l’eau et une ventilation. Ne laisse pas la personne seule."],"",[],[call("Appeler le 15","15")]),
      cool:node("Réduire l’exposition",["Bois régulièrement de l’eau. Humidifie ton corps et évite les efforts aux heures chaudes.","Ferme volets et fenêtres pendant la chaleur ; aère lorsque l’air extérieur devient plus frais."],"Le logement reste-t-il trop chaud ?",[option("Oui","refuge"),option("Non","check")]),
      refuge:node("Chercher un lieu frais",["Passe du temps dans un lieu rafraîchi accessible en sécurité. Renseigne-toi auprès de la mairie sur les lieux ouverts."],"",[],[module("Vérifier mon eau","stock")]),
      check:node("Prendre des nouvelles",["Contacte les proches vulnérables et propose de l’aide. Réévalue la situation si des symptômes apparaissent."],"",[])
    }},
    {id:"cold",title:"Grand froid",description:"Trouver un abri et repérer les signes préoccupants.",sources:[["Ministère de la Santé — grand froid","https://sante.gouv.fr/sante-et-environnement/risques-climatiques/article/grand-froid-information-du-public"],["Service public — hébergement d’urgence","https://www.service-public.gouv.fr/particuliers/vosdroits/F20343"]],nodes:{
      start:node("Vérifier l’état des personnes",[],"Confusion, parole anormale ou grande fatigue inhabituelle après exposition au froid ?",[option("Oui / doute","urgent"),option("Non","shelter")]),
      urgent:node("Appeler les secours",["Appelle le 15 ou le 112. Mets la personne à l’abri et couvre-la ; suis les instructions reçues."],"",[],[call("Appeler le 15","15")]),
      shelter:node("Se protéger du froid",["Cherche un abri chauffé, reste au sec et porte plusieurs couches couvrant aussi les extrémités."],"Peux-tu accéder à un logement ou un abri chauffé ?",[option("Oui","warm"),option("Non","help")]),
      warm:node("Maintenir une chaleur sûre",["Utilise le chauffage conformément à sa notice et conserve une ventilation adaptée. Ne bouche pas les aérations.","Ne chauffe pas le logement avec un réchaud ou un barbecue. Un groupe électrogène doit rester dehors, jamais dans une cave ou un garage.","Prends des nouvelles des personnes isolées et limite l’exposition au froid."],"",[]),
      help:node("Demander une mise à l’abri",["Appelle le 115 pour demander une mise à l’abri. Si la santé est menacée, appelle le 15 ou le 112."],"",[],[call("Appeler le 115","115"),call("Appeler le 112","112")])
    }},
    {id:"quake",title:"Secousses",description:"Pendant le séisme, puis après les premières secousses.",sources:[["Sécurité civile — séisme",civil+"risques-majeurs/seisme"]],nodes:{
      start:node("Situer le moment",[],"Les secousses sont-elles encore en cours ?",[option("Oui","during"),option("Non","after")]),
      during:node("Se protéger pendant les secousses",["À l’intérieur, abrite-toi sous un meuble solide, couvre tête et torse et éloigne-toi des fenêtres.","À l’extérieur, reste dans un espace dégagé, loin de ce qui peut tomber. En voiture, arrête-toi sur le côté et reste dans le véhicule."],"Les secousses ont-elles cessé ?",[option("Oui, passer à la suite","after"),option("Non, rester protégé","hold")]),
      hold:node("Maintenir la protection",["Reste protégé et garde tes distances avec ce qui peut tomber."],"Quand les secousses ont cessé :",[option("Examiner la suite","after")]),
      after:node("Repérer les dégâts sans s’exposer",["Des répliques sont possibles. Écoute les autorités."],"Le bâtiment est-il endommagé ou présente-t-il un danger ?",[option("Oui / doute","leave"),option("Non","monitor")]),
      leave:node("Sortir du bâtiment endommagé",["Lorsque tu peux le faire en sécurité, sors par les escaliers ; n’utilise pas l’ascenseur.","Rejoins un espace dégagé et suis les instructions des secours. En cas de personne bloquée ou blessée, appelle le 112."],"",[],[call("Appeler le 112","112")]),
      monitor:node("Rester vigilant",["Surveille les consignes et les répliques. Ne retourne pas dans un bâtiment déclaré dangereux."],"",[])
    }},
    {id:"evacuation",title:"Préparer un départ",description:"Ordre d’évacuation, kit et consignes de destination.",sources:[kit],nodes:{
      start:node("Clarifier la raison du départ",[],"Une évacuation est-elle demandée par les autorités ?",[option("Oui","ordered"),option("Non, je prépare mon kit","prepare"),option("Un danger est déjà présent","danger")]),
      ordered:node("Suivre le départ indiqué",["Suis la destination et les consignes annoncées.","Emporte ton kit accessible : eau, nourriture sans cuisson, traitements, documents, clés, lampe et moyens de communication. Ne retarde pas le départ pour récupérer des objets."],"",[],[module("Ma checklist","checklist")]),
      prepare:node("Préparer le kit accessible",["Regroupe les ressources essentielles et vérifie régulièrement piles, consommables et dates."],"",[],[module("Compléter ma checklist","checklist"),module("Vérifier mes réserves","stock")]),
      danger:node("Choisir les consignes du danger",["Les actions diffèrent selon le danger. Choisis le parcours correspondant ou appelle le 112 en danger immédiat."],"",[],[call("Appeler le 112","112")])
    }},
    {id:"communication",title:"Réseau indisponible",description:"Alerter, économiser la batterie et garder des contacts.",sources:[kit,["Service public — numéros d’urgence","https://www.service-public.gouv.fr/particuliers/vosdroits/F33954"]],nodes:{
      start:node("Distinguer urgence et information",[],"Une personne est-elle en danger immédiat ?",[option("Oui","urgent"),option("Non","contact")]),
      urgent:node("Chercher à alerter",["Essaie le 112. Si l’appel échoue, demande à une personne disposant d’un moyen de communication d’alerter les secours, sans t’exposer."],"",[],[call("Appeler le 112","112"),module("Mes numéros d’urgence","emergency")]),
      contact:node("Conserver les moyens disponibles",["Économise la batterie et utilise la radio autonome pour les annonces.","Si le réseau le permet, transmets un message court à ton contact convenu. Garde les coordonnées importantes sur papier."],"As-tu convenu d’un contact ou d’un point de rendez-vous ?",[option("Oui","plan"),option("Non","prepare")]),
      plan:node("Suivre le plan convenu",["Utilise le contact et le lieu prévus seulement si les conditions et les consignes locales le permettent."],"",[],[module("Signal Morse","signal")]),
      prepare:node("Préparer les contacts",["Ajoute les contacts hors ligne et la radio à ton kit. Le Morse peut échanger un message entre personnes équipées ; il ne garantit pas qu’un appel de secours sera reçu."],"",[],[module("Ma checklist","checklist"),module("Signal Morse","signal")])
    }}
  ];
  let active = null, path = [], checked = new Set(), go;
  const el = id=>document.getElementById(id);
  function renderMenu(){
    el("guideMenu").innerHTML = GUIDES.map((g,i)=>`<button class="card guide-card guide-select" data-guide="${g.id}"><span class="guide-index">${String(i+1).padStart(2,"0")}</span><strong>${g.title}</strong><span class="muted">${g.description}</span><span class="guide-open">Commencer →</span></button>`).join("");
  }
  function render(focus=true){
    el("guideMenu").hidden = !!active;
    el("guideJourney").hidden = !active;
    if(!active) return;
    const id = path[path.length-1], step = active.nodes[id];
    el("guideTitle").textContent = active.title;
    el("guideTrail").textContent = `Étape ${path.length} · ` + path.map(p=>active.nodes[p].title).join(" → ");
    el("guideStep").textContent = step.title;
    el("guideActions").innerHTML = step.actions.map((text,i)=>`<label class="check-item"><input type="checkbox" data-action="${id}-${i}" ${checked.has(`${id}-${i}`) ? "checked" : ""}><span>${text}</span></label>`).join("");
    el("guideQuestion").textContent = step.question || "Reste attentif à l’évolution de la situation et aux nouvelles consignes.";
    el("guideChoices").innerHTML = step.choices.map((choice,i)=>`<button class="ghost-btn" data-choice="${i}">${choice.label} →</button>`).join("");
    el("guideShortcuts").innerHTML = step.shortcuts.map(s=>s.phone ? `<a class="primary-btn" href="tel:${s.phone}">${s.label}</a>` : `<button class="ghost-btn" data-guide-view="${s.view}">${s.label}</button>`).join("");
    el("guideBack").disabled = path.length < 2;
    el("guideSources").innerHTML = '<div class="card-label">SOURCES OFFICIELLES · VÉRIFIÉES LE 05/10/2026</div>' + active.sources.map(([label,url])=>`<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("");
    if(focus) el("guideStep").focus();
  }
  function reset(){active=null; path=[]; checked.clear(); render(false);}
  function init(navigate){
    go = navigate; renderMenu();
    el("guideMenu").addEventListener("click",e=>{
      const button = e.target.closest("[data-guide]");
      if(!button) return;
      active = GUIDES.find(g=>g.id === button.dataset.guide); path=["start"]; checked.clear(); render();
    });
    el("guideChoices").addEventListener("click",e=>{
      const button = e.target.closest("[data-choice]");
      if(!button || !active) return;
      path.push(active.nodes[path[path.length-1]].choices[Number(button.dataset.choice)].next); render();
    });
    el("guideActions").addEventListener("change",e=>{
      const key = e.target.dataset.action;
      if(key) e.target.checked ? checked.add(key) : checked.delete(key);
    });
    el("guideShortcuts").addEventListener("click",e=>{const button=e.target.closest("[data-guide-view]"); if(button) go(button.dataset.guideView,true);});
    el("guideBack").addEventListener("click",()=>{if(path.length>1){path.pop();render();}});
    el("guideRestart").addEventListener("click",()=>{path=["start"];checked.clear();render();});
    el("guideMenuBtn").addEventListener("click",()=>{reset();el("guideMenu").querySelector("button")?.focus();});
  }
  return {init, reset, data:GUIDES};
})();
