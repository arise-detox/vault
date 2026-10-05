/* Torch control needs a live rear-camera track; no frames are recorded or sent. */
const VaultTorch = (()=>{
  const el=id=>document.getElementById(id);
  let session=null, generation=0;
  const status=message=>{el('torchStatus').textContent=message;};
  const compatible=caps=>caps?.torch === true || (Array.isArray(caps?.torch) && caps.torch.includes(true) && caps.torch.includes(false));

  function controls(){
    const busy=!!session?.busy, ready=!!session?.ready;
    el('prepareTorch').disabled=busy;
    el('playSignalBtn').disabled=!ready || busy;
    el('testTorch').disabled=!ready || busy;
    el('stopSignalBtn').disabled=!session;
    ['morseInput','sendUnit','repeatSignal','torchCamera'].forEach(id=>el(id).disabled=busy);
    document.querySelectorAll('.morse-preset').forEach(button=>button.disabled=busy);
  }
  function release(s){
    if(!s || s.released)return;
    s.released=true;
    clearTimeout(s.timer);s.wake?.(false);s.wake=null;s.cancel?.();s.cancel=null;
    // Request darkness and stop tracks immediately, even if an on-command is pending.
    if(s.track?.readyState!=='ended' && s.track?.applyConstraints){
      try{Promise.resolve(s.track.applyConstraints({advanced:[{torch:false}]})).catch(()=>{});}catch(_){}
    }
    s.stream?.getTracks().forEach(track=>track.stop());
    if(el('torchVideo').srcObject===s.stream){el('torchVideo').pause();el('torchVideo').srcObject=null;}
    if(s.lock)Promise.resolve(s.lock.release()).catch(()=>{});
  }
  function stop(message){
    generation++;
    const previous=session;session=null;
    release(previous);controls();
    if(previous)status(message || 'Lampe arrêtée. Caméra libérée.');
  }
  const current=(s,token)=>session===s && generation===token && !s.released;
  async function command(s,on,token){
    if(!current(s,token))return false;
    let guard;
    try{
      await Promise.race([
        s.track.applyConstraints({advanced:[{torch:on}]}),
        new Promise((_,reject)=>{guard=setTimeout(()=>reject(Object.assign(new Error(),{name:'TorchTimeout'})),1500);}),
        new Promise(resolve=>{s.cancel=resolve;})
      ]);
      return current(s,token);
    }finally{clearTimeout(guard);s.cancel=null;}
  }
  function wait(s,ms,token){
    if(!current(s,token))return Promise.resolve(false);
    return new Promise(resolve=>{
      s.wake=resolve;
      s.timer=setTimeout(()=>{s.wake=null;resolve(current(s,token));},Math.max(0,ms));
    });
  }
  function errorMessage(error){
    if(error.name==='NotAllowedError' || error.name==='SecurityError')return 'Accès caméra refusé. Autorise la caméra dans ton navigateur pour commander la lampe, puis réessaie.';
    if(error.name==='NotFoundError')return 'Aucune caméra disponible. La lampe ne peut pas être commandée sur cet appareil.';
    if(error.name==='NotReadableError')return 'Caméra occupée ou indisponible. Ferme l’autre application qui l’utilise puis réessaie.';
    if(error.name==='TorchUnsupported')return 'Torche indisponible pour cette caméra ou ce navigateur. Essaie une autre caméra de la liste, ou un navigateur à jour sur ton téléphone.';
    if(error.name==='TorchSlow')return 'Commande de lampe trop lente pour cette vitesse. Augmente la durée du point, vérifie la lampe, puis réessaie.';
    if(error.name==='TorchTimeout')return 'La lampe ne répond pas. Émission interrompue et caméra libérée. Vérifie la lampe puis réessaie.';
    return 'Impossible de commander la lampe. Vérifie les autorisations et la compatibilité de ton téléphone. Aucun signal n’a été remplacé par un flash de l’écran.';
  }
  async function cameras(s,token){
    if(!navigator.mediaDevices.enumerateDevices)return;
    try{
      const devices=(await navigator.mediaDevices.enumerateDevices()).filter(device=>device.kind==='videoinput');
      if(!current(s,token))return;
      const select=el('torchCamera'), selected=select.value;
      select.replaceChildren();
      const auto=document.createElement('option');auto.value='';auto.textContent='Caméra arrière automatique';select.append(auto);
      devices.forEach((device,i)=>{const opt=document.createElement('option');opt.value=device.deviceId;opt.textContent=device.label || `Caméra ${i+1}`;select.append(opt);});
      select.value=devices.some(device=>device.deviceId===selected) ? selected : '';
      el('torchCameraLabel').hidden=devices.length<2;
    }catch(_){} // Enumeration is optional; it must not block a working torch.
  }
  async function prepare(){
    if(session?.busy)return;
    VaultSensors.stop();stop();
    if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia){
      status('Ce navigateur ne permet pas l’accès nécessaire à la lampe. Ouvre VAULT en HTTPS dans un navigateur compatible sur ton téléphone.');return;
    }
    const token=generation, s={busy:true,ready:false,stream:null,track:null,timer:null,wake:null,released:false,lock:null};session=s;
    controls();status('Autorise la caméra pour vérifier la torche…');
    try{
      const device=el('torchCamera').value;
      const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:device ? {deviceId:{exact:device}} : {facingMode:{ideal:'environment'}}});
      if(!current(s,token)){stream.getTracks().forEach(track=>track.stop());return;}
      s.stream=stream;s.track=stream.getVideoTracks()[0];
      if(!s.track)throw Object.assign(new Error(),{name:'NotFoundError'});
      s.track.addEventListener('ended',()=>{if(current(s,token))stop('Caméra déconnectée. Lampe arrêtée.');});
      s.track.addEventListener('mute',()=>{if(current(s,token))stop('Caméra interrompue par le téléphone. Lampe arrêtée.');});
      await cameras(s,token);
      if(!current(s,token))return;
      if(!s.track.applyConstraints || !compatible(s.track.getCapabilities?.()))throw Object.assign(new Error(),{name:'TorchUnsupported'});
      el('torchVideo').srcObject=stream;
      await el('torchVideo').play();
      if(!current(s,token))return;
      if(!await command(s,false,token))return;
      s.ready=true;s.busy=false;controls();
      status('Commande de torche disponible. Teste la lampe avant d’envoyer ton message.');
    }catch(error){if(current(s,token)){stop();status(errorMessage(error));}}
  }
  async function run(queue,unit,repeating=false,test=false){
    const s=session;
    if(!s?.ready || s.busy)return;
    VaultSensors.stop();
    const token=generation;
    s.busy=true;controls();
    status(test ? 'Test de la lampe pendant une seconde…' : 'Émission Morse avec la lampe en cours…');
    try{
      if(navigator.wakeLock?.request){
        try{
          const lock=await navigator.wakeLock.request('screen');
          if(!current(s,token)){await lock.release();return;}
          s.lock=lock;
        }catch(_){} // Manual instruction to keep the phone awake remains visible.
      }
      do{
        for(const [on,units] of queue){
          const started=performance.now();
          if(!await command(s,!!on,token))return;
          const latency=performance.now()-started;
          if(!test && latency>unit*.6)throw Object.assign(new Error(),{name:'TorchSlow'});
          if(!await wait(s,units*unit-latency,token))return;
        }
        if(!await command(s,false,token))return;
        if(repeating && !await wait(s,7*unit,token))return;
      }while(repeating && current(s,token));
      if(test){
        if(s.lock){await s.lock.release();s.lock=null;}
        if(!current(s,token))return;
        s.busy=false;controls();
        status('Test terminé, lampe éteinte. Vérifie qu’elle s’est allumée. Caméra prête pour émettre ; touche Arrêter pour la libérer.');
      }else stop('Message terminé. Lampe arrêtée et caméra libérée.');
    }catch(error){if(current(s,token)){stop();status(errorMessage(error));}}
  }
  function play(){
    const raw=el('morseInput').value.trim() || 'SOS';
    const queue=buildSignalQueue(toMorse(raw));
    if(!queue.length){status('Saisis un message avec des lettres ou des chiffres.');return;}
    const unit=Math.min(1200,Math.max(100,Number(el('sendUnit').value)||300));
    run(queue,unit,el('repeatSignal').checked);
  }
  function init(){
    el('prepareTorch').addEventListener('click',prepare);
    el('torchCamera').addEventListener('change',prepare);
    el('testTorch').addEventListener('click',()=>run([[1,1]],1000,false,true));
    el('playSignalBtn').addEventListener('click',play);
    el('stopSignalBtn').addEventListener('click',()=>stop());
    controls();
  }
  return {init,stop,prepare,compatible};
})();
