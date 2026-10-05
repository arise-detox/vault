/* Local, ephemeral sensor processing. No recordings and no network requests. */
const VaultSensors = (() => {
  const alphabet = {
    '.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J',
    '-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T',
    '..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z',
    '-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9',
    '.-.-.-':'.','--..--':',','..--..':'?','-..-.':'/','-....-':'-','.----.':"'",'-.-.--':'!','...---...':'SOS'
  };
  function translate(raw) {
    const normalized = raw.trim().replace(/[·•]/g,'.').replace(/[–—−]/g,'-');
    if (!normalized) return '';
    return normalized.split(/\s*\/\s*|\n+/).map(word => word.trim().split(/\s+/).filter(Boolean)
      .map(token => alphabet[token] || '?').join('')).filter(Boolean).join(' ');
  }

  // Edge timestamps, rather than sample count, preserve timing across frame rates.
  class MorseDecoder {
    constructor(unit = 160) {
      this.unit = unit; this.on = false; this.edge = null;
      this.candidate = false; this.candidateAt = 0;
      this.token = ''; this.raw = ''; this.text = ''; this.wordDone = true;
      this.badPulses = 0;
    }
    letter() {
      if (!this.token) return;
      this.text = (this.text + (alphabet[this.token] || '?')).slice(-1000);
      this.raw = (this.raw + (this.raw && !this.raw.endsWith('/') ? ' ' : '') + this.token).slice(-4000);
      this.token = '';
    }
    gap(duration) {
      if (duration >= this.unit * 2.4) this.letter();
      if (duration >= this.unit * 6 && !this.wordDone) {
        if (this.text && !this.text.endsWith(' ')) this.text += ' ';
        if (this.raw && !this.raw.endsWith('/')) this.raw += ' /';
        this.wordDone = true;
      }
    }
    feed(value, timestamp) {
      if (this.edge === null) this.edge = timestamp;
      if (value !== this.candidate) { this.candidate = value; this.candidateAt = timestamp; }
      const debounce = Math.min(25, this.unit * 0.15);
      if (this.candidate !== this.on && timestamp - this.candidateAt >= debounce) {
        const duration = this.candidateAt - this.edge;
        if (this.on) {
          if (duration >= this.unit * 0.35 && duration <= this.unit * 5) {
            this.token += duration < this.unit * 2 ? '.' : '-';
            if (this.token.length > 9) { this.letter(); this.badPulses++; }
            this.wordDone = false;
          } else { this.badPulses++; }
        } else this.gap(duration);
        this.on = this.candidate; this.edge = this.candidateAt;
      }
      // Do not flush a letter while a new rising edge is being debounced.
      if (!this.on && !this.candidate) this.gap(timestamp - this.edge);
    }
    finish() { this.letter(); }
    snapshot() { return {morse:(this.raw + (this.token ? ' ' + this.token : '')).trim(), text:this.text.trim(), badPulses:this.badPulses}; }
  }

  function spectralFeatures(frequency, waveform, sampleRate, fftSize) {
    let sum = 0;
    for (const x of waveform) sum += x*x;
    const rms = Math.sqrt(sum / waveform.length);
    const db = 20*Math.log10(Math.max(rms,1e-8));
    const binHz = sampleRate / fftSize;
    const lo = Math.max(1,Math.ceil(80/binHz)), hi = Math.min(frequency.length-1,Math.floor(6000/binHz));
    let total = 0, peak = lo, peakDb = -160;
    for(let i=lo;i<=hi;i++) {
      const value = Number.isFinite(frequency[i]) ? frequency[i] : -160;
      total += 10**(value/10);
      if(value > peakDb) {peakDb=value;peak=i;}
    }
    let peakPower = 0;
    for(let i=Math.max(lo,peak-2);i<=Math.min(hi,peak+2);i++) peakPower += 10**((Number.isFinite(frequency[i]) ? frequency[i] : -160)/10);
    const toneShare = peakPower/Math.max(total,1e-16);
    // Harmonic peaks alone do not identify their physical source.
    let harmonics = 0;
    for(let multiple=2;multiple<=5;multiple++) {
      const expected = peak*multiple;
      if(expected > hi) break;
      const tolerance = Math.max(2,Math.round(expected*.025));
      let harmonicDb = -160;
      for(let i=Math.max(lo,expected-tolerance);i<=Math.min(hi,expected+tolerance);i++) harmonicDb=Math.max(harmonicDb,frequency[i]);
      if(harmonicDb > -75 && harmonicDb > peakDb-20) harmonics++;
    }
    return {db, peakHz:peak*binHz, toneShare, harmonics};
  }

  class AcousticTracker {
    constructor() {this.history=[];}
    update(features, timestamp) {
      if(features.db < -60) {this.history=[];return {title:'Son très faible',detail:'Aucune signature exploitable. Ce résultat ne permet pas de conclure à l’absence d’une source sonore.'};}
      this.history.push({hz:features.peakHz,time:timestamp});
      this.history=this.history.filter(item=>timestamp-item.time<2500).slice(-100);
      const mean=this.history.reduce((sum,x)=>sum+x.hz,0)/this.history.length;
      const deviation=Math.sqrt(this.history.reduce((sum,x)=>sum+(x.hz-mean)**2,0)/this.history.length)/Math.max(mean,1);
      const stable=this.history.length>=15 && timestamp-this.history[0].time>=1500 && deviation<.06;
      if(stable && features.toneShare>.12 && features.harmonics>=2) return {title:'Harmoniques persistantes',detail:'Indices compatibles avec une source motorisée. Drone, ventilateur ou véhicule possibles ; la source ne peut pas être identifiée.'};
      if(stable && features.toneShare>.25) return {title:'Tonalité stable',detail:'Une fréquence ressort régulièrement. Bip, sifflement ou moteur possibles ; la source reste indéterminée.'};
      if(features.toneShare>.25) return {title:'Son tonal détecté',detail:'Une fréquence dominante est présente. Laisse l’écoute se poursuivre pour vérifier sa stabilité.'};
      return {title:'Bruit diffus ou variable',detail:'Pas de motif tonal stable relevé. Voix, circulation et vent peuvent produire ce type de spectre.'};
    }
  }

  const el=id=>document.getElementById(id);
  const text=(id,value)=>{if(el(id).textContent!==String(value))el(id).textContent=value;};
  const numeric=(id,min,max,fallback)=>Math.min(max,Math.max(min,Number(el(id).value)||fallback));
  let generation=0, current=null, decoder=null;
  function updateDecoded() {
    if(!decoder) return;
    const result=decoder.snapshot();
    text('receivedMorse',result.morse || '—');text('receivedText',result.text || '—');
  }
  function release(session) {
    if(!session)return;
    clearTimeout(session.timer);cancelAnimationFrame(session.frame);
    if(session.stream)session.stream.getTracks().forEach(track=>track.stop());
    if(session.source)try{session.source.disconnect();}catch(_){}
    if(session.context)session.context.close().catch(()=>{});
  }
  function stop(reason) {
    generation++;
    const previous=current;current=null;release(previous);
    el('receiveVideo').srcObject=null;el('cameraFrame').hidden=true;
    el('startReceive').disabled=false;el('startAcoustic').disabled=false;
    el('stopReceive').disabled=true;el('stopAcoustic').disabled=true;
    ['receiveMode','receiveUnit','receiveAutoFrequency','receiveFrequency','receiveThreshold','lightThreshold'].forEach(id=>el(id).disabled=false);
    el('receiveFrequency').disabled=el('receiveAutoFrequency').checked;
    el('receiveLamp').classList.remove('detected');
    el('receiveMeter').style.width='0%';el('acousticMeter').style.width='0%';
    if(previous?.mode==='acoustic') text('acousticStatus',reason || 'Microphone arrêté. Dernière observation conservée.');
    else if(previous) {decoder?.finish();updateDecoded();text('receiveStatus',reason || 'Réception arrêtée.');text('receiveLevel','Capteur arrêté');}
  }
  function sensorError(error) {
    if(error.name==='NotAllowedError' || error.name==='SecurityError')return 'Accès refusé. Autorise le capteur dans les réglages du navigateur, puis réessaie.';
    if(error.name==='NotFoundError')return 'Aucun capteur compatible trouvé sur cet appareil.';
    if(error.name==='NotReadableError')return 'Capteur indisponible : il est peut-être utilisé par une autre application.';
    return 'Impossible de démarrer ce capteur. Vérifie les autorisations et utilise HTTPS ou localhost.';
  }
  async function start(mode) {
    stop();
    if(typeof stopSignal==='function') stopSignal();
    const status=mode==='acoustic'?'acousticStatus':'receiveStatus';
    if(!navigator.mediaDevices?.getUserMedia || !window.isSecureContext){text(status,'Les capteurs nécessitent HTTPS ou localhost et un navigateur compatible.');return;}
    const token=generation;
    const session={mode,stream:null,context:null,timer:null,frame:null};current=session;
    const acoustic=mode==='acoustic';
    el(acoustic?'startAcoustic':'startReceive').disabled=true;
    el(acoustic?'stopAcoustic':'stopReceive').disabled=false;
    if(!acoustic) {
      decoder=new MorseDecoder(numeric('receiveUnit',60,1000,160));updateDecoded();
      ['receiveMode','receiveUnit','receiveAutoFrequency','receiveFrequency','receiveThreshold','lightThreshold'].forEach(id=>el(id).disabled=true);
    }
    text(status,'En attente de l’autorisation du capteur…');
    try {
      if(mode!=='camera') {
        const Audio=window.AudioContext || window.webkitAudioContext;
        if(!Audio) throw new Error('Audio non disponible');
        session.context=new Audio();
        // Resume within the button gesture for mobile browser compatibility.
        await session.context.resume();
        if(token!==generation)return;
      }
      const stream=await navigator.mediaDevices.getUserMedia(mode==='camera'
        ? {video:{facingMode:{ideal:'environment'},width:{ideal:640},height:{ideal:480}},audio:false}
        : {audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
      if(token!==generation){stream.getTracks().forEach(track=>track.stop());return;}
      session.stream=stream;
      stream.getTracks().forEach(track=>track.addEventListener('ended',()=>{if(current===session)stop('Capteur déconnecté.');}));
      if(mode==='camera') {
        const video=el('receiveVideo');video.srcObject=stream;
        el('cameraFrame').hidden=false;
        await video.play();
        if(token!==generation)return;
        text(status,'Caméra active. Vise les flashes au centre du cadre.');
        cameraLoop(session,token);
      } else {
        if(session.context.state!=='running')await session.context.resume();
        if(token!==generation)return;
        session.context.onstatechange=()=>{if(current===session && session.context.state!=='running')stop('Écoute interrompue par le navigateur. Redémarre pour reprendre.');};
        session.source=session.context.createMediaStreamSource(stream);
        session.analyser=session.context.createAnalyser();
        session.analyser.fftSize=acoustic?4096:2048;
        session.analyser.smoothingTimeConstant=acoustic?.35:0;
        session.source.connect(session.analyser); // Not connected to speakers.
        text(status,acoustic?'Microphone actif. Analyse locale en cours.':'Microphone actif. En attente de bips réguliers.');
        audioLoop(session,token);
      }
    } catch(error) {
      if(token!==generation)return;
      stop();text(status,sensorError(error));
    }
  }
  function audioLoop(session,token) {
    const frequency=new Float32Array(session.analyser.frequencyBinCount);
    const waveform=new Float32Array(session.analyser.fftSize);
    const tracker=new AcousticTracker();
    let detected=false;
    const fixedHz=numeric('receiveFrequency',200,3000,700),threshold=numeric('receiveThreshold',-80,-15,-45);
    const automatic=el('receiveAutoFrequency').checked;
    function tick() {
      if(token!==generation)return;
      session.analyser.getFloatFrequencyData(frequency);session.analyser.getFloatTimeDomainData(waveform);
      const now=performance.now();
      if(session.mode==='acoustic') {
        const features=spectralFeatures(frequency,waveform,session.context.sampleRate,session.analyser.fftSize);
        const result=tracker.update(features,now);
        text('acousticResult',result.title);text('acousticDetail',result.detail);
        text('acousticLevel',`${Math.round(features.db)} dBFS`);
        text('acousticPeak',features.db<-60?'—':`${Math.round(features.peakHz)} Hz`);
        el('acousticMeter').style.width=`${Math.max(0,Math.min(100,(features.db+80)/.8))}%`;
      } else {
        const binHz=session.context.sampleRate/session.analyser.fftSize;
        let hz=fixedHz;
        if(automatic){
          let loudest=-160;
          for(let i=Math.ceil(200/binHz);i<Math.min(frequency.length,Math.floor(3000/binHz));i++){
            if(frequency[i]>loudest){loudest=frequency[i];hz=i*binHz;}
          }
        }
        let toneDb=-160,sideSum=0,sideCount=0;
        for(let i=Math.max(1,Math.floor((hz-350)/binHz));i<=Math.min(frequency.length-1,Math.ceil((hz+350)/binHz));i++) {
          if(Math.abs(i*binHz-hz)<=80)toneDb=Math.max(toneDb,frequency[i]);
          else {sideSum+=10**(frequency[i]/10);sideCount++;}
        }
        const sideDb=10*Math.log10(Math.max(sideSum/Math.max(sideCount,1),1e-16));
        detected=toneDb>(detected?threshold-4:threshold) && toneDb-sideDb>6;
        decoder.feed(detected,now);updateDecoded();
        el('receiveLamp').classList.toggle('detected',detected);
        el('receiveMeter').style.width=`${Math.max(0,Math.min(100,(toneDb+80)/.8))}%`;
        text('receiveLevel',detected?`Bip détecté · ${Math.round(hz)} Hz`:'En attente de bip');
      }
      session.timer=setTimeout(tick,session.mode==='acoustic'?50:20);
    }
    tick();
  }
  function cameraLoop(session,token) {
    const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    if(!context)throw new Error('Caméra non disponible');
    const video=el('receiveVideo'),threshold=numeric('lightThreshold',5,95,60);
    let detected=false;
    function tick(now) {
      if(token!==generation)return;
      if(video.readyState>=2 && video.videoWidth) {
        const w=video.videoWidth,h=video.videoHeight;
        el('cameraFrame').style.aspectRatio=`${w}/${h}`;
        context.drawImage(video,w*.375,h*.375,w*.25,h*.25,0,0,32,32);
        const pixels=context.getImageData(0,0,32,32).data;
        let brightness=0;
        for(let i=0;i<pixels.length;i+=4)brightness+=.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2];
        brightness=brightness/(32*32*255)*100;
        detected=brightness>(detected?threshold-5:threshold);
        decoder.feed(detected,now);updateDecoded();
        el('receiveLamp').classList.toggle('detected',detected);
        el('receiveMeter').style.width=`${brightness}%`;
        text('receiveLevel',`${Math.round(brightness)} % · ${detected?'lumière détectée':'en attente de flash'}`);
      }
      session.frame=requestAnimationFrame(tick);
    }
    session.frame=requestAnimationFrame(tick);
  }
  function signalMode(receiving) {
    stop();
    if(typeof stopSignal==='function')stopSignal();
    el('sendMorsePanel').hidden=receiving;el('receiveMorsePanel').hidden=!receiving;
    el('showSend').setAttribute('aria-pressed',String(!receiving));
    el('showReceive').setAttribute('aria-pressed',String(receiving));
  }
  function init() {
    el('showSend').addEventListener('click',()=>signalMode(false));
    el('showReceive').addEventListener('click',()=>signalMode(true));
    el('startAcoustic').addEventListener('click',()=>start('acoustic'));
    el('stopAcoustic').addEventListener('click',()=>stop());
    el('startReceive').addEventListener('click',()=>start(el('receiveMode').value));
    el('stopReceive').addEventListener('click',()=>stop());
    el('clearReceive').addEventListener('click',()=>{stop();decoder=new MorseDecoder();updateDecoded();text('receiveStatus','Message effacé. Capteurs arrêtés.');});
    el('receiveMode').addEventListener('change',()=>{stop();const camera=el('receiveMode').value==='camera';el('audioSettings').hidden=camera;el('cameraSettings').hidden=!camera;});
    el('receiveAutoFrequency').addEventListener('change',()=>{el('receiveFrequency').disabled=el('receiveAutoFrequency').checked;});
    el('receiveThreshold').addEventListener('input',()=>text('audioThresholdLabel',`${el('receiveThreshold').value} dBFS · baisse le seuil pour un bip faible`));
    el('lightThreshold').addEventListener('input',()=>text('lightThresholdLabel',`${el('lightThreshold').value} % · vise la lumière au centre du cadre`));
    el('manualMorse').addEventListener('input',()=>text('manualTranslation',translate(el('manualMorse').value)||'—'));
  }
  return {init,stop,translate,MorseDecoder,spectralFeatures,AcousticTracker};
})();
