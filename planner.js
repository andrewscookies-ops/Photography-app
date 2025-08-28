
// ===== Hardening =====
(function(){
  function showError(msg){
    try{
      var bar=document.getElementById('errorBar');
      var span=document.getElementById('errorMsg');
      if(bar&&span){ span.textContent=String(msg); bar.style.display='block'; }
    }catch(e){}
  }
  window.onerror = function(message){ try{console.error(message);}catch(e){} showError(message||'Unknown script error'); return false; };
  window.onunhandledrejection = function(e){ showError((e && (e.reason||e.message)) || 'Unhandled promise rejection'); };

  // localStorage safe wrappers
  var _memStore = {};
  function lsAvailable(){
    try{ var k='__ep_test__'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; }catch(e){ return false; }
  }
  var HAS_LS = lsAvailable();
  window.ep_lsGet = function(key){ try{ return HAS_LS ? localStorage.getItem(key) : (_memStore[key]||null); }catch(e){ return _memStore[key]||null; } };
  window.ep_lsSet = function(key,val){ try{ if(HAS_LS){ localStorage.setItem(key,val); } else { _memStore[key]=val; } }catch(e){ _memStore[key]=val; } };

  // Safe download helper
  window.ep_download = function(filename, text, mime){
    try{
      var blob = new Blob([text], {type: mime||'text/plain'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); }catch(e){} a.remove(); }, 800);
    }catch(e){
      showError('Download blocked. A copyable text box was appended.');
      var ta = document.createElement('textarea');
      ta.style.width='100%'; ta.style.height='220px'; ta.value=text;
      document.body.appendChild(ta); ta.focus(); ta.select();
    }
  };

  // file:// notice
  try{ if(String(location.protocol)==='file:'){ var fb=document.getElementById('fileBar'); if(fb) fb.style.display='block'; } }catch(e){}

  window.__ep_showError = showError;
})();

function closeModal(id){document.getElementById(id).style.display='none';}
function openModal(id){document.getElementById(id).style.display='flex';}

// ---- Built-in data with default kit lens per camera ----
var cameras=[
  {name:"Nikon F100",mount:"nikon_f",max_shutter_den:8000, kit_lens:"Nikon 28-80mm f/3.5-5.6"},
  {name:"Nikon FE2",mount:"nikon_f",max_shutter_den:4000, kit_lens:"Nikon 50mm f/1.8"},
  {name:"Canon AE-1",mount:"canon_fd",max_shutter_den:1000, kit_lens:"Canon 50mm f/1.8"},
  {name:"Pentax K1000",mount:"pentax_k",max_shutter_den:1000, kit_lens:"Pentax 50mm f/2"},
  {name:"Minolta X-700",mount:"minolta_sr",max_shutter_den:1000, kit_lens:"Minolta 50mm f/1.7"},
  {name:"Olympus OM-1",mount:"olympus_om",max_shutter_den:1000, kit_lens:"Olympus 50mm f/1.8"}
];
var lenses=[
  // Nikon F
  {name:"Nikon 50mm f/1.8",mount:"nikon_f",type:"prime",focal_mm:50,max_aperture:1.8,min_aperture:16},
  {name:"Nikon 28mm f/2.8",mount:"nikon_f",type:"prime",focal_mm:28,max_aperture:2.8,min_aperture:22},
  {name:"Nikon 85mm f/1.8",mount:"nikon_f",type:"prime",focal_mm:85,max_aperture:1.8,min_aperture:22},
  {name:"Nikon 70-210mm f/4",mount:"nikon_f",type:"zoom",focal_min_mm:70,focal_max_mm:210,max_aperture_wide:4,min_aperture:32},
  {name:"Nikon 24-50mm f/3.3-4.5",mount:"nikon_f",type:"zoom",focal_min_mm:24,focal_max_mm:50,max_aperture_wide:3.3,max_aperture_tele:4.5,min_aperture:22},
  {name:"Nikon 70-200mm f/2.8",mount:"nikon_f",type:"zoom",focal_min_mm:70,focal_max_mm:200,max_aperture_wide:2.8,max_aperture_tele:2.8,min_aperture:22},
  {name:"Nikon 28-80mm f/3.5-5.6",mount:"nikon_f",type:"zoom",focal_min_mm:28,focal_max_mm:80,max_aperture_wide:3.5,max_aperture_tele:5.6,min_aperture:22},
  // Canon FD
  {name:"Canon 50mm f/1.8",mount:"canon_fd",type:"prime",focal_mm:50,max_aperture:1.8,min_aperture:16},
  {name:"Canon 28mm f/2.8",mount:"canon_fd",type:"prime",focal_mm:28,max_aperture:2.8,min_aperture:22},
  {name:"Canon 85mm f/1.8",mount:"canon_fd",type:"prime",focal_mm:85,max_aperture:1.8,min_aperture:22},
  {name:"Canon 70-210mm f/4",mount:"canon_fd",type:"zoom",focal_min_mm:70,focal_max_mm:210,max_aperture_wide:4,min_aperture:32},
  // Pentax K
  {name:"Pentax 50mm f/2",mount:"pentax_k",type:"prime",focal_mm:50,max_aperture:2.0,min_aperture:16},
  {name:"Pentax 50mm f/1.8",mount:"pentax_k",type:"prime",focal_mm:50,max_aperture:1.8,min_aperture:16},
  {name:"Pentax 28mm f/2.8",mount:"pentax_k",type:"prime",focal_mm:28,max_aperture:2.8,min_aperture:22},
  // Minolta SR
  {name:"Minolta 50mm f/1.7",mount:"minolta_sr",type:"prime",focal_mm:50,max_aperture:1.7,min_aperture:16},
  {name:"Minolta 28mm f/2.8",mount:"minolta_sr",type:"prime",focal_mm:28,max_aperture:2.8,min_aperture:22},
  {name:"Minolta 85mm f/1.7",mount:"minolta_sr",type:"prime",focal_mm:85,max_aperture:1.7,min_aperture:22},
  // Olympus OM
  {name:"Olympus 50mm f/1.8",mount:"olympus_om",type:"prime",focal_mm:50,max_aperture:1.8,min_aperture:16},
  {name:"Olympus 28mm f/2.8",mount:"olympus_om",type:"prime",focal_mm:28,max_aperture:2.8,min_aperture:22},
  {name:"Olympus 85mm f/2",mount:"olympus_om",type:"prime",focal_mm:85,max_aperture:2.0,min_aperture:22}
];
var films=[
  {name:"Kodak Portra 400",box_iso:400,push_limit:2,pull_limit:1},
  {name:"Kodak Tri-X 400",box_iso:400,push_limit:3,pull_limit:1},
  {name:"Fujifilm Superia 200",box_iso:200,push_limit:2,pull_limit:1},
  {name:"Ilford HP5+ 400",box_iso:400,push_limit:3,pull_limit:1},
  {name:"Cinestill 800T",box_iso:800,push_limit:1,pull_limit:0}
];

// ---- Math helpers ----
var K=12.5;
function luxToEV(lux){ return Math.log2((lux*K)/2.5); }
function evToLux(ev){ return Math.pow(2, ev) * (2.5 / K); }
var shuttersThird=[30,25,20,15,13,10,8,6,5,4,3.2,2.5,2,1.6,1.3,1,0.8,0.6,0.5,0.4,1/3,1/4,1/5,1/6,1/8,1/10,1/13,1/15,1/20,1/25,1/30,1/40,1/50,1/60,1/80,1/100,1/125,1/160,1/200,1/250,1/320,1/400,1/500,1/640,1/800,1/1000,1/1250,1/1600,1/2000,1/2500,1/3200,1/4000,1/5000,1/6400,1/8000];
function nearestShutterThird(t){ var best=shuttersThird[0], d=Math.abs(shuttersThird[0]-t); for(var i=0;i<shuttersThird.length;i++){ var s=shuttersThird[i]; var dd=Math.abs(s-t); if(dd<d){d=dd; best=s;} } return best; }
function fmtSh(s){ return s>=1 ? (Math.round(s)+'s') : ('1/'+Math.round(1/s)); }
function requiredShutter(ev100, iso, N){ var rhs=Math.pow(2, ev100 + Math.log2(iso/100)); return (N*N)/rhs; }
function handholdLimit(focal){ return 1/Math.max(1, focal); }
function lensApertureAtFocal(lens, focal){
  if(lens.type==='prime') return {minA:lens.max_aperture, maxA:lens.min_aperture};
  var t=(focal-lens.focal_min_mm)/(lens.focal_max_mm-lens.focal_min_mm);
  var maxWide=lens.max_aperture_wide; var maxTele=(lens.max_aperture_tele||lens.max_aperture_wide);
  var clamped = Math.max(0, Math.min(1, isFinite(t)?t:0));
  var maxA = maxWide + clamped*(maxTele-maxWide);
  return {minA:maxA, maxA:lens.min_aperture};
}

// Light slider descriptors per integer EV
var EV_DESC = {
  "-4":"Starlight","-3":"Moonless night","-2":"Dim candles","-1":"Candlelight","0":"Bright candles",
  "1":"Night street","2":"Dim indoor lamp","3":"Bright indoor lamp","4":"Bright room","5":"Window light",
  "6":"Deep shade, dusk","7":"Cloudy shade","8":"Open shade","9":"Cloudy daylight","10":"Overcast daylight",
  "11":"Hazy sun","12":"Open shade, sunny","13":"Clear daylight","14":"Bright clear daylight","15":"Strong sun / beach","16":"Snow / beach noon"
};

// EV notches
function buildEVNotches(){
  var wrap=document.getElementById('evNotches'); if(!wrap) return;
  wrap.innerHTML='';
  var minEV=-4, maxEV=16;
  for(var ev=minEV; ev<=maxEV; ev++){
    var pct=((ev-minEV)/(maxEV-minEV))*100;
    var notch=document.createElement('div'); notch.className='ev-notch'+((ev%2===0)?' big':''); notch.style.left=pct+'%'; wrap.appendChild(notch);
    var hit=document.createElement('div'); hit.className='ev-hit'; hit.style.left=pct+'%'; hit.setAttribute('data-ev', ev);
    (function(evv){
      hit.addEventListener('mouseover', function(){ showEVBadge(evv); });
      hit.addEventListener('mouseout', function(){ showEVBadge(null); });
      hit.addEventListener('touchstart', function(e){ e.preventDefault(); showEVBadge(evv); });
      hit.addEventListener('click', function(){ document.getElementById('evSlider').value=evv; document.getElementById('evInput').value=evv.toFixed(1); document.getElementById('luxInput').value=Math.round(evToLux(evv)); recalc(); });
    })(ev);
    wrap.appendChild(hit);
  }
}
function showEVBadge(ev){
  var wrap=document.getElementById('evNotches'); if(!wrap) return;
  var old=wrap.querySelectorAll('.ev-label-badge'); for(var i=0;i<old.length;i++){ old[i].remove(); }
  if(ev===null || ev===undefined) return;
  var minEV=-4, maxEV=16; var pct=((ev-minEV)/(maxEV-minEV))*100;
  var badge=document.createElement('div'); badge.className='ev-label-badge'; var label=EV_DESC[String(Math.round(ev))]||('EV '+Math.round(ev));
  badge.textContent=label; badge.style.left=pct+'%'; wrap.appendChild(badge);
}

var intent='neutral';
function recommend(ev, film, lens, focal, camera){
  var iso=film.box_iso;
  var apRange=lensApertureAtFocal(lens,focal);
  var N=apRange.minA;
  if(intent==='deep') N=Math.min(Math.max(11,apRange.minA),apRange.maxA);
  if(intent==='shallow') N=apRange.minA;
  if(intent==='lowgrain') iso=Math.min(200,iso);
  if(intent==='highgrain') iso=Math.max(1600,iso);
  var t=requiredShutter(ev,iso,N);
  if(intent==='freeze'&&t>1/500){ if(N>apRange.minA){N=apRange.minA;t=requiredShutter(ev,iso,N);} while(t>1/500&&iso<1600){iso*=2;t=requiredShutter(ev,iso,N);} }
  if(intent==='blur'&&t<1/30){ if(N<apRange.maxA){N=Math.min(apRange.maxA,N*2);t=requiredShutter(ev,iso,N);} while(t<1/30&&iso>100){iso/=2;t=requiredShutter(ev,iso,N);} }
  var tMin=1/camera.max_shutter_den;
  var warning="", ndAdvice="";
  if(t<tMin){ var stopsNeeded=Math.ceil(Math.log2(tMin/t)); var nd=Math.pow(2,stopsNeeded); warning="Current data exceeds camera capability."; ndAdvice="Use ND"+nd+" ("+stopsNeeded+" stops) or lower ISO / stop down."; t=tMin; }
  var hh=handholdLimit(focal); var hhWarn=""; if(t>hh) hhWarn="Handheld risk. Use ≥ "+fmtSh(hh)+" or a tripod.";
  var pushStops=Math.log2(iso/film.box_iso); var pp=""; if(Math.abs(pushStops)>=0.25){ var dir=pushStops>0?"push":"pull"; var limit=pushStops>0?(film.push_limit||0):(film.pull_limit||0); var absStops=Math.abs(pushStops).toFixed(1); var over=Math.abs(pushStops)>(limit||0)?" (beyond lab limit)":""; var def = pushStops>0 ? "Underexpose in camera, develop longer." : "Overexpose in camera, develop shorter."; pp=dir+" ~"+absStops+" stops"+over+" — "+def; }
  var warns=[warning,ndAdvice,hhWarn,pp].filter(function(x){return x;}).join(" • ");
  return {iso:Math.round(iso), N:parseFloat(N.toFixed(1)), t:nearestShutterThird(t), warns:warns};
}
function buildCompactAlternatives(ev, film, lens, focal, camera, main){
  var apRange=lensApertureAtFocal(lens,focal);
  var isos=[film.box_iso/2, film.box_iso, film.box_iso*2, 800, 1600].filter(function(v){return v>=50&&v<=3200;});
  var rows=[];
  for(var i=0;i<isos.length;i++){
    var iso=Math.round(isos[i]);
    var apertures=[main.N/2, main.N, main.N*2, apRange.minA, apRange.maxA].map(function(x){return Math.min(Math.max(x, apRange.minA), apRange.maxA);});
    var seenA={}; var uniq=[]; for(var j=0;j<apertures.length;j++){ var key=apertures[j].toFixed(1); if(!seenA[key]){ seenA[key]=1; uniq.push(parseFloat(key)); } }
    for(var k=0;k<uniq.length;k++){ var N=uniq[k]; var t=requiredShutter(ev,iso,N); var tMin=1/camera.max_shutter_den; if(t<tMin) continue; rows.push({iso:iso,N:parseFloat(N.toFixed(1)),t:nearestShutterThird(t)}); }
  }
  rows.sort(function(a,b){
    if(intent==='shallow') return a.N-b.N;
    if(intent==='deep') return b.N-a.N;
    if(intent==='freeze') return (1/b.t)-(1/a.t);
    if(intent==='blur') return (1/a.t)-(1/b.t);
    if(intent==='lowgrain') return a.iso-b.iso;
    if(intent==='highgrain') return b.iso-a.iso;
    return Math.abs(1/a.t-1/main.t)-Math.abs(1/b.t-1/main.t);
  });
  var out=[]; var set={}; for(var r=0;r<rows.length;r++){ var key=rows[r].iso+'-'+rows[r].N+'-'+rows[r].t; if(!set[key]){ out.push(rows[r]); set[key]=1; } if(out.length>=5) break; } return out;
}
function buildFullAlternatives(ev, film, lens, focal, camera){
  var apRange=lensApertureAtFocal(lens,focal);
  var isos=[100,200,400,800,1600].filter(function(v){return v>=50&&v<=3200;});
  var Ns=[];
  var cur=apRange.minA; while(cur<=apRange.maxA+1e-9){ Ns.push(parseFloat(cur.toFixed(1))); cur*=Math.SQRT2; }
  var rows=[];
  for(var i=0;i<isos.length;i++){
    for(var j=0;j<Ns.length;j++){
      var N=Ns[j]; var t=requiredShutter(ev,isos[i],N); var tMin=1/camera.max_shutter_den; if(t<tMin) continue; rows.push({iso:isos[i],N:parseFloat(N.toFixed(1)),t:nearestShutterThird(t)});
    }
  }
  rows.sort(function(a,b){ if(a.iso!==b.iso) return a.iso-b.iso; if(a.N!==b.N) return a.N-b.N; return a.t-b.t; });
  return rows;
}
function refreshCameras(){ var sel=document.getElementById('cameraSelect'); sel.innerHTML=cameras.map(function(c){return '<option value=\"'+c.name+'\">'+c.name+'</option>';}).join(''); }
function refreshFilms(){ var sel=document.getElementById('filmSelect'); sel.innerHTML=films.map(function(f){return '<option value=\"'+f.name+'\">'+f.name+'</option>';}).join(''); }
function refreshLenses(){
  var camName=document.getElementById('cameraSelect').value;
  var sel=document.getElementById('lensSelect'); var note=document.getElementById('kitNote');
  if(!camName){ sel.innerHTML=''; note.textContent=''; return; }
  var cam=null; for(var i=0;i<cameras.length;i++){ if(cameras[i].name===camName){ cam=cameras[i]; break; } }
  var list=lenses.filter(function(l){return l.mount===cam.mount;});
  sel.innerHTML=list.map(function(l){return '<option value=\"'+l.name+'\">'+l.name+'</option>';}).join('');
  var idx=-1; for(var j=0;j<list.length;j++){ if(list[j].name===cam.kit_lens){ idx=j; break; } }
  if(idx<0) idx=0; sel.selectedIndex=idx; note.textContent = cam.kit_lens ? ('Kit: '+cam.kit_lens) : '';
  var lens=list[idx]; if(lens){ document.getElementById('focalInput').value=(lens.type==='prime')?lens.focal_mm:Math.round((lens.focal_min_mm+lens.focal_max_mm)/2); }
}
function recalc(){
  var camName=document.getElementById('cameraSelect').value;
  var lensName=document.getElementById('lensSelect').value;
  var filmName=document.getElementById('filmSelect').value;
  var output=document.getElementById('output');
  var warn=document.getElementById('warning');
  if(!camName || !lensName || !filmName){ output.textContent="Select camera, lens, and film."; warn.textContent=""; return; }
  var camera=null; for(var ci=0;ci<cameras.length;ci++){ if(cameras[ci].name===camName){ camera=cameras[ci]; break; } }
  var lens=null; for(var li=0;li<lenses.length;li++){ if(lenses[li].name===lensName){ lens=lenses[li]; break; } }
  var film=null; for(var fi=0;fi<films.length;fi++){ if(films[fi].name===filmName){ film=films[fi]; break; } }
  var focal=parseFloat(document.getElementById('focalInput').value)||50;
  var ev=parseFloat(document.getElementById('evInput').value)||12;
  var rec=recommend(ev,film,lens,focal,camera);
  output.textContent='ISO '+rec.iso+' • f/'+rec.N.toFixed(1)+' • '+fmtSh(rec.t);
  warn.textContent=rec.warns;
  var comp=buildCompactAlternatives(ev,film,lens,focal,camera,rec);
  var tb=document.querySelector('#altTable tbody'); tb.innerHTML="";
  for(var i=0;i<comp.length;i++){ var r=comp[i]; var tr=document.createElement('tr'); if(r.iso===rec.iso && r.N===rec.N && r.t===rec.t) tr.className='recommended'; tr.innerHTML='<td>'+r.iso+'</td><td>f/'+r.N.toFixed(1)+'</td><td>'+fmtSh(r.t)+'</td>'; tb.appendChild(tr); }
  // full alt
  var full=buildFullAlternatives(ev,film,lens,focal,camera);
  var tb2=document.querySelector('#altTableFull tbody'); tb2.innerHTML="";
  for(var k=0;k<full.length;k++){ var u=full[k]; var tr2=document.createElement('tr'); tr2.innerHTML='<td>'+u.iso+'</td><td>f/'+u.N.toFixed(1)+'</td><td>'+fmtSh(u.t)+'</td>'; tb2.appendChild(tr2); }
  updateDOF(); updateMotion(); updateBracket(); updateReciprocity(); updatePushPull(); renderLog();
}

// Advanced
function calcDOF(N, focal_mm, dist_m, coc_mm){
  var f = focal_mm; var s = dist_m*1000; var H = (f*f)/(N*coc_mm) + f;
  var near = (H*s)/(H + (s - f)); var far = (H*s)/(H - (s - f));
  var near_m = near/1000; var far_m = (H <= (s - f)) ? Infinity : far/1000;
  var total = (far_m===Infinity) ? Infinity : (far_m - near_m);
  return {H_m: H/1000, near_m:near_m, far_m:far_m, total_m:total};
}
function updateDOF(){
  var lensName = document.getElementById('lensSelect').value;
  var lens=null; for(var i=0;i<lenses.length;i++){ if(lenses[i].name===lensName){ lens=lenses[i]; break; } }
  if(!lens) return;
  var focal = (lens.type==='prime') ? lens.focal_mm : (parseFloat(document.getElementById('focalInput').value)||50);
  var outTxt = document.getElementById('output').textContent || '';
  var parts = outTxt.split('•'); var nStr = parts.length>1 ? parts[1] : ''; nStr = nStr.replace('f/','').trim();
  var N = parseFloat(nStr) || lens.max_aperture;
  var dist = parseFloat(document.getElementById('dofDist').value)||3;
  var coc = parseFloat(document.getElementById('dofCoC').value)||0.03;
  var d=calcDOF(N, focal, dist, coc);
  function fmt(x){ return x===Infinity ? '∞' : (x<1? (Math.round(x*100)/100)+' m' : (Math.round(x*10)/10)+' m'); }
  document.getElementById('dofOut').textContent = 'H≈ '+fmt(d.H_m)+' • Near≈ '+fmt(d.near_m)+' • Far≈ '+fmt(d.far_m)+' • DOF≈ '+(d.total_m===Infinity?'∞':(Math.round(d.total_m*10)/10+' m'));
}
function updateMotion(){
  var v = parseFloat(document.getElementById('motSpeed').value)||1.4;
  var d = parseFloat(document.getElementById('motDist').value)||10;
  var dir = document.getElementById('motDir').value;
  var omega = (dir==='across') ? (v/d) : (v/d)*0.3;
  var a_freeze = 0.001; var t_freeze = a_freeze / Math.max(omega, 1e-6);
  var a_pan = 0.02; var t_pan = a_pan / Math.max(omega, 1e-6);
  function fmt(t){ return t>=1 ? (t.toFixed(1)+'s') : ('1/'+Math.round(1/t)); }
  document.getElementById('motOut').textContent = 'Freeze ≈ '+fmt(t_freeze)+' • Pan ≈ '+fmt(t_pan);
}
function evStepValue(stepStr){ if(stepStr==='1/3') return 1/3; if(stepStr==='1/2') return 1/2; return 1; }
function updateBracket(){
  var span = parseFloat(document.getElementById('brSpan').value)||1;
  var step = evStepValue(document.getElementById('brStep').value);
  var param = document.getElementById('brParam').value;
  var offsets = []; for(var e=-span; e<=span+1e-9; e+=step){ offsets.push(parseFloat(e.toFixed(3))); }
  var camName=document.getElementById('cameraSelect').value;
  var camera=null; for(var ci=0;ci<cameras.length;ci++){ if(cameras[ci].name===camName){ camera=cameras[ci]; break; } }
  var lensName=document.getElementById('lensSelect').value;
  var lens=null; for(var li=0;li<lenses.length;li++){ if(lenses[li].name===lensName){ lens=lenses[li]; break; } }
  var filmName=document.getElementById('filmSelect').value;
  var film=null; for(var fi=0;fi<films.length;fi++){ if(films[fi].name===filmName){ film=films[fi]; break; } }
  var focal=parseFloat(document.getElementById('focalInput').value)||50;
  var ev=parseFloat(document.getElementById('evInput').value)||12;
  var base = recommend(ev, film, lens, focal, camera);
  var tMin = 1/camera.max_shutter_den;
  var rows = []; var warn = '';
  for(var i=0;i<offsets.length;i++){
    var off=offsets[i]; var iso=base.iso, N=base.N, t=base.t;
    if(param==='shutter'){ t = nearestShutterThird(t * Math.pow(2, off)); }
    if(param==='aperture'){ N = parseFloat((N * Math.pow(Math.SQRT2, off)).toFixed(1)); }
    if(param==='iso'){ iso = Math.round(iso * Math.pow(2, off)); }
    var feasible = (param==='shutter') ? (t >= tMin) : true;
    if(param==='aperture'){ var ap = lensApertureAtFocal(lens, focal); if(N<ap.minA||N>ap.maxA) warn='Some f-stops out of lens range.'; }
    rows.push({off:off, iso:iso, N:N, t:t, feasible:feasible});
  }
  function fmtShLocal(s){ return s>=1? (Math.round(s)+'s') : ('1/'+Math.round(1/s)); }
  var seq = rows.map(function(r){ return (r.off>=0?'+':'')+r.off+'EV → ISO '+r.iso+', f/'+r.N.toFixed(1)+', '+fmtShLocal(r.t)+(r.feasible?'':' (X shutter too fast)'); }).join(' • ');
  var capWarn = rows.some(function(r){return !r.feasible;}) ? ' Some frames exceed camera max. Consider ND or vary aperture/ISO.' : '';
  document.getElementById('brOut').textContent = seq + capWarn + (warn?' '+warn:'');
}
var RECIP_TABLE = {
  "Kodak Tri-X 400": function(t){ return t<1? t : Math.pow(t,1.26); },
  "Ilford HP5+ 400": function(t){ return t<1? t : Math.pow(t,1.3); },
  "Kodak Portra 400": function(t){ return t<1? t : Math.pow(t,1.2); },
  "Cinestill 800T": function(t){ return t<1? t : Math.pow(t,1.15); },
  "Fujifilm Superia 200": function(t){ return t<1? t : Math.pow(t,1.25); }
};
function updateReciprocity(){
  var camName=document.getElementById('cameraSelect').value;
  var camera=null; for(var ci=0;ci<cameras.length;ci++){ if(cameras[ci].name===camName){ camera=cameras[ci]; break; } }
  var lensName=document.getElementById('lensSelect').value;
  var lens=null; for(var li=0;li<lenses.length;li++){ if(lenses[li].name===lensName){ lens=lenses[li]; break; } }
  var filmName=document.getElementById('filmSelect').value;
  var film=null; for(var fi=0;fi<films.length;fi++){ if(films[fi].name===filmName){ film=films[fi]; break; } }
  var focal=parseFloat(document.getElementById('focalInput').value)||50;
  var ev=parseFloat(document.getElementById('evInput').value)||12;
  var base = recommend(ev, film, lens, focal, camera);
  var t = base.t;
  if(t < 1){ document.getElementById('recipOut').textContent = 'Not needed below 1s.'; return; }
  var f = RECIP_TABLE[film.name]; var tCorr = f ? f(t) : Math.pow(t,1.25);
  function fmt(x){ return x>=1? (x.toFixed(1)+'s') : ('1/'+Math.round(1/x)); }
  document.getElementById('recipOut').textContent = 'Meter '+fmt(t)+' → expose ~'+fmt(tCorr)+' (approx).';
}
// Push/Pull
function updatePushPull(){
  var filmName=document.getElementById('filmSelect').value;
  var film=null; for(var fi=0;fi<films.length;fi++){ if(films[fi].name===filmName){ film=films[fi]; break; } }
  if(!film){ document.getElementById('ppOut').textContent='—'; return; }
  var stops=parseFloat(document.getElementById('ppStops').value)||0;
  var meterISO = Math.round(film.box_iso*Math.pow(2,stops));
  var action = stops>0?('Push +'+stops+' stops'):(stops<0?('Pull '+stops+' stops'):'No change');
  var def = stops>0? 'Underexpose in camera, develop longer.' : (stops<0? 'Overexpose in camera, develop shorter.' : '');
  var over = stops>film.push_limit || (-stops)>film.pull_limit;
  if(over) def += (def? ' ':'') + 'Beyond common lab limits.';
  document.getElementById('ppOut').textContent = 'Meter at ISO '+meterISO+'. '+action+'. '+def;
}

// Exposure Log
function loadLog(){ try{ return JSON.parse(ep_lsGet('ep.log')||'[]'); }catch(e){ return []; } }
function saveLog(arr){ ep_lsSet('ep.log', JSON.stringify(arr)); }
function renderLog(){
  var tbody=document.querySelector('#logTable tbody'); if(!tbody) return; tbody.innerHTML='';
  var log=loadLog();
  for(var i=0;i<log.length;i++){
    var row=log[i];
    var tr=document.createElement('tr');
    tr.innerHTML = '<td>'+row.time+'</td><td>'+row.camera+'</td><td>'+row.lens+'</td><td>'+row.film+'</td><td>'+row.iso+'</td><td>f/'+row.N+'</td><td>'+row.t+'</td><td>'+row.ev+'</td><td>'+(row.notes||'')+'</td>';
    tbody.appendChild(tr);
  }
}
function addLogEntry(){
  var time = new Date().toISOString().replace('T',' ').slice(0,19);
  var camName=document.getElementById('cameraSelect').value;
  var lensName=document.getElementById('lensSelect').value;
  var filmName=document.getElementById('filmSelect').value;
  var out=document.getElementById('output').textContent;
  var parts = out.split('•').map(function(s){return s.trim();});
  var iso=parseInt(parts[0].replace('ISO','').trim())||'';
  var N=(parts[1]||'').replace('f/','').trim();
  var t=parts[2]||'';
  var ev=document.getElementById('evInput').value;
  var notes='';
  var log=loadLog();
  log.unshift({time:time, camera:camName, lens:lensName, film:filmName, iso:iso, N:N, t:t, ev:ev, notes:notes});
  saveLog(log); renderLog();
}
function exportCSV(){
  var log=loadLog();
  var header=['time','camera','lens','film','iso','f','t','ev','notes'];
  var rows=[header.join(',')];
  for(var i=0;i<log.length;i++){
    var r=log[i];
    rows.push([r.time,r.camera,r.lens,r.film,r.iso,r.N,r.t,r.ev,'"'+String(r.notes||'').replace('"','""')+'"'].join(','));
  }
  ep_download('exposure_log.csv', rows.join('\\n'), 'text/csv');
}
function exportJSON(){
  var log=loadLog();
  ep_download('exposure_log.json', JSON.stringify(log,null,2), 'application/json');
}
function clearLog(){ saveLog([]); renderLog(); }

// UI wiring
function initApp(){
  // show app
  document.getElementById('appRoot').style.display='block';
  // build EV notches after layout
  setTimeout(buildEVNotches, 0);
  window.addEventListener('resize', buildEVNotches);

  // settings modal
  document.getElementById('settingsBtn').onclick=function(){openModal('settingsModal');};
  document.getElementById('settingsExportBtn').onclick=function(){
    var data={cameras:cameras,lenses:lenses,films:films};
    ep_download('exposure_planner_data.json', JSON.stringify(data,null,2), 'application/json');
  };
  document.getElementById('settingsImportBtn').onclick=function(){ document.getElementById('settingsImportFile').click(); };
  document.getElementById('settingsImportFile').onchange=function(e){
    var f=e.target.files[0]; if(!f) return;
    var r=new FileReader();
    r.onload=function(){ try{ var data=JSON.parse(r.result); cameras=data.cameras||cameras; lenses=data.lenses||lenses; films=data.films||films; location.reload(); }catch(err){ alert('Invalid JSON'); } };
    r.readAsText(f);
  };

  // populate lists
  refreshCameras();
  refreshFilms();
  refreshLenses();

  // EV defaults and listeners
  document.getElementById('evSlider').value=15;
  document.getElementById('evInput').value=15;
  document.getElementById('luxInput').value=Math.round(evToLux(15));
  document.getElementById('evSlider').addEventListener('input', function(){
    var ev=parseFloat(document.getElementById('evSlider').value);
    document.getElementById('evInput').value=ev.toFixed(1);
    document.getElementById('luxInput').value=Math.round(evToLux(ev));
    showEVBadge(ev);
    recalc();
  });
  document.getElementById('evInput').addEventListener('input', function(){
    var ev=parseFloat(document.getElementById('evInput').value)||0;
    document.getElementById('evSlider').value=ev;
    document.getElementById('luxInput').value=Math.round(evToLux(ev));
    showEVBadge(ev);
    recalc();
  });
  document.getElementById('luxInput').addEventListener('input', function(){
    var lx=parseFloat(document.getElementById('luxInput').value)||0;
    var ev=luxToEV(lx);
    document.getElementById('evSlider').value=ev;
    document.getElementById('evInput').value=ev.toFixed(1);
    showEVBadge(ev);
    recalc();
  });

  // intents
  var btns=document.querySelectorAll('.intentBtn');
  for(var i=0;i<btns.length;i++){
    btns[i].addEventListener('click', function(e){
      intent=e.target.getAttribute('data-intent')||'neutral';
      recalc();
    });
  }

  // gear listeners
  document.getElementById('cameraSelect').addEventListener('change', function(){ refreshLenses(); recalc(); });
  document.getElementById('lensSelect').addEventListener('change', function(){ recalc(); });
  document.getElementById('filmSelect').addEventListener('change', function(){ recalc(); });
  document.getElementById('focalInput').addEventListener('input', function(){ recalc(); });

  // outputs toggles
  document.getElementById('toggleFull').addEventListener('click', function(e){
    var box=document.getElementById('fullAlt');
    var open=box.style.display!=='none';
    box.style.display=open?'none':'block';
    e.target.textContent=open?'Show All Alternatives':'Hide Alternatives';
  });

  // advanced toggle
  (function wireAdvancedToggle(){
    var btn=document.getElementById('advancedToggle');
    var drawer=document.getElementById('advancedDrawer');
    var setLabel=function(){ btn.textContent = (drawer.style.display==='none' || drawer.style.display==='') ? 'Open Advanced' : 'Close Advanced'; };
    btn.addEventListener('click', function(){
      drawer.style.display = (drawer.style.display==='none' || drawer.style.display==='') ? 'block' : 'none';
      setLabel();
    });
    setLabel();
  })();

  // advanced events
  document.getElementById('dofDist').addEventListener('input', updateDOF);
  document.getElementById('dofCoC').addEventListener('input', updateDOF);
  document.getElementById('motSpeed').addEventListener('input', updateMotion);
  document.getElementById('motDist').addEventListener('input', updateMotion);
  document.getElementById('motDir').addEventListener('input', updateMotion);
  document.getElementById('brSpan').addEventListener('input', updateBracket);
  document.getElementById('brStep').addEventListener('input', updateBracket);
  document.getElementById('brParam').addEventListener('input', updateBracket);
  document.getElementById('ppStops').addEventListener('input', updatePushPull);
  document.getElementById('logAdd').addEventListener('click', addLogEntry);
  document.getElementById('logExportCSV').addEventListener('click', exportCSV);
  document.getElementById('logExportJSON').addEventListener('click', exportJSON);
  document.getElementById('logClear').addEventListener('click', clearLog);

  // initial compute
  showEVBadge(15);
  recalc();
}

// Defensive hard-init loop to ensure selects populate even in Edge preview
(function(){
  function selectsPopulated(){
    try{
      var cs=document.getElementById('cameraSelect');
      var ls=document.getElementById('lensSelect');
      var fs=document.getElementById('filmSelect');
      return cs && ls && fs && cs.options.length>0 && ls.options.length>0 && fs.options.length>0;
    }catch(e){ return false; }
  }
  function tryPopulate(){ try{ initApp(); }catch(e){ if(window.__ep_showError) __ep_showError(e.message||e); } }
  var tries=0;
  function loop(){ if(selectsPopulated()) return; tryPopulate(); if(selectsPopulated()) return; tries++; if(tries<40){ setTimeout(loop,100);} }
  if(document.readyState==='complete'||document.readyState==='interactive'){ setTimeout(loop,0); } else { document.addEventListener('DOMContentLoaded', function(){ setTimeout(loop,0); }); }
  window.addEventListener('load', function(){ setTimeout(loop, 0); });
})();
