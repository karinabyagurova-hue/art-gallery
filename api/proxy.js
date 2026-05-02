<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arya's Art Gallery</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#faf9f7;color:#1a1a1a;padding:1.5rem;max-width:900px;margin:0 auto}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:12px}
h1{font-size:22px;font-weight:500}
.btn{padding:8px 16px;background:#1a1a1a;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer}
.btn:hover{background:#333}
.btn-outline{background:#fff;color:#1a1a1a;border:1px solid #ddd}
.btn-outline:hover{background:#f0f0f0}
.btn-refresh{background:#fff;color:#1a1a1a;border:1px solid #ddd;padding:8px 12px;border-radius:8px;font-size:14px;cursor:pointer}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:1.5rem}
.stat{background:#fff;border:1px solid #eee;border-radius:8px;padding:1rem;text-align:center}
.stat-num{font-size:24px;font-weight:500}
.stat-label{font-size:13px;color:#666;margin-top:4px}
.controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1.5rem}
input[type=text],select,input[type=date]{padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none}
input[type=text]{flex:1;min-width:160px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
.card{background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
.card-img{width:100%;aspect-ratio:4/3;object-fit:cover;background:#f5f5f5;display:block}
.card-img-placeholder{width:100%;aspect-ratio:4/3;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:32px}
.card-body{padding:1rem;display:flex;flex-direction:column;gap:6px;flex:1}
.card-name{font-size:15px;font-weight:500}
.card-date{font-size:13px;color:#888}
.badge{display:inline-block;font-size:11px;padding:3px 10px;border-radius:20px;background:#f0f0f0;color:#555;border:1px solid #e0e0e0;width:fit-content}
.card-notes{font-size:13px;color:#666;line-height:1.5}
.empty{text-align:center;color:#999;padding:3rem;font-size:15px}
.loading{text-align:center;padding:3rem;color:#999}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem}
.modal{background:#fff;border-radius:16px;padding:1.5rem;width:100%;max-width:500px;max-height:92vh;overflow-y:auto}
.modal h2{font-size:18px;font-weight:500;margin-bottom:1.25rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:13px;color:#666;margin-bottom:6px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;outline:none}
.form-group textarea{resize:vertical;min-height:70px}
.photo-upload{border:2px dashed #ddd;border-radius:8px;padding:1.5rem;text-align:center;cursor:pointer}
.photo-upload:hover{border-color:#aaa}
.photo-upload input{display:none}
.form-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:1.25rem}
.hidden{display:none}
.success-msg{background:#f0faf4;color:#1a7a4a;padding:.75rem;border-radius:8px;font-size:14px;margin-top:.75rem;text-align:center}
.error-msg{background:#fdf0f0;color:#c0392b;padding:.75rem;border-radius:8px;font-size:14px;margin-top:.75rem;text-align:center}

/* Crop tool */
.crop-container{position:relative;width:100%;background:#000;border-radius:8px;overflow:hidden;touch-action:none;margin-top:.75rem}
.crop-container canvas{display:block;width:100%;height:auto}
.crop-overlay{position:absolute;inset:0;pointer-events:none}
.crop-box{position:absolute;border:2px solid #fff;box-shadow:0 0 0 9999px rgba(0,0,0,0.5);cursor:move}
.crop-handle{position:absolute;width:22px;height:22px;background:#fff;border-radius:50%;transform:translate(-50%,-50%);pointer-events:all;cursor:pointer}
.crop-actions{display:flex;gap:8px;margin-top:.5rem}
.crop-actions button{flex:1;padding:8px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:13px;cursor:pointer}
.crop-actions button.primary{background:#1a1a1a;color:#fff;border:none}
.preview-thumb{width:100%;border-radius:8px;margin-top:.5rem;display:block}
</style>
</head>
<body>

<div class="header">
  <h1>🎨 Arya's art gallery</h1>
  <div style="display:flex;gap:8px">
    <button class="btn-refresh" onclick="load()">↻ Refresh</button>
    <button class="btn" onclick="openModal()">+ Add artwork</button>
  </div>
</div>

<div class="stats">
  <div class="stat"><div class="stat-num" id="total">—</div><div class="stat-label">Total artworks</div></div>
  <div class="stat"><div class="stat-num" id="mat-count">—</div><div class="stat-label">Materials used</div></div>
  <div class="stat"><div class="stat-num" id="latest">—</div><div class="stat-label">Latest entry</div></div>
</div>

<div class="controls">
  <input type="text" id="search" placeholder="Search by name or notes…" oninput="render()">
  <select id="filter-mat" onchange="render()"><option value="">All materials</option></select>
  <select id="sort" onchange="render()">
    <option value="desc">Newest first</option>
    <option value="asc">Oldest first</option>
    <option value="az">A → Z</option>
  </select>
</div>

<div id="gallery" class="loading">Loading artwork…</div>

<!-- Modal -->
<div class="overlay hidden" id="overlay">
  <div class="modal">
    <h2>Add new artwork</h2>
    <div class="form-group">
      <label>Project name</label>
      <input type="text" id="f-name" placeholder="e.g. Rainbow butterfly">
    </div>
    <div class="form-group">
      <label>Date created</label>
      <input type="date" id="f-date">
    </div>
    <div class="form-group">
      <label>Materials used</label>
      <select id="f-material">
        <option value="">Select material…</option>
        <option>acrylic</option>
        <option>pencil</option>
        <option>felt pen</option>
        <option>pen</option>
        <option>watercolor</option>
        <option>paper</option>
        <option>clay</option>
        <option>other</option>
      </select>
    </div>
    <div class="form-group">
      <label>Notes (optional)</label>
      <textarea id="f-notes" placeholder="e.g. Made at art class, theme was animals…"></textarea>
    </div>

    <!-- Photo section -->
    <div class="form-group">
      <label>Photo</label>
      <div id="upload-area">
        <div class="photo-upload" onclick="document.getElementById('f-photo').click()">
          📷 Tap to take a photo or choose from gallery
          <input type="file" id="f-photo" accept="image/*,image/heic,image/heif" onchange="onPhotoSelected(this)">
        </div>
      </div>

      <!-- Crop tool (hidden until photo selected) -->
      <div id="crop-area" class="hidden">
        <div class="crop-container" id="crop-container">
          <canvas id="crop-canvas"></canvas>
          <div id="crop-box" class="crop-box">
            <div class="crop-handle" id="h-tl" style="top:0;left:0"></div>
            <div class="crop-handle" id="h-tr" style="top:0;left:100%"></div>
            <div class="crop-handle" id="h-bl" style="top:100%;left:0"></div>
            <div class="crop-handle" id="h-br" style="top:100%;left:100%"></div>
          </div>
        </div>
        <div class="crop-actions">
          <button onclick="resetPhoto()">↩ Change photo</button>
          <button class="primary" onclick="applyCrop()">✓ Use this crop</button>
        </div>
      </div>

      <!-- Preview after crop -->
      <div id="preview-area" class="hidden">
        <img id="preview-img" class="preview-thumb">
        <div class="crop-actions">
          <button onclick="resetPhoto()">↩ Change photo</button>
          <button onclick="reCrop()">✂ Re-crop</button>
        </div>
      </div>
    </div>

    <div id="form-msg"></div>
    <div class="form-actions">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn" id="submit-btn" onclick="submitArtwork()">Save artwork</button>
    </div>
  </div>
</div>

<script>
const API = '/api/proxy';
let all = [];
let croppedBase64 = null, photoName = 'artwork.jpg', photoMime = 'image/jpeg';

// ── Gallery ──────────────────────────────────────────────
function getVal(row,...keys){
  for(const k of keys){
    const f=Object.keys(row).find(rk=>rk.replace(/"/g,'').trim().toLowerCase()===k.toLowerCase());
    if(f&&row[f])return row[f];
  }return '';
}
function fmtDate(d){
  if(!d)return '';
  const dt=new Date(d);
  if(isNaN(dt))return d;
  return dt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
}
function getDriveThumb(url){
  if(!url)return null;
  const m=url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if(m)return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w400`;
  if(url.includes('thumbnail'))return url;
  return null;
}
async function load(){
  const el=document.getElementById('gallery');
  el.className='loading'; el.textContent='Loading artwork…';
  try{
    const res=await fetch(API);
    const data=await res.json();
    all=data.map(r=>({
      name:getVal(r,"Project Name (what's it called?)",'project name','name'),
      date:getVal(r,'Date Created','date created','date'),
      material:getVal(r,'Materials Used','materials used','material'),
      notes:getVal(r,'Notes','notes'),
      photo:getVal(r,'Photo URL','photo url','photo of artwork','Photo of Artwork','photo')||''
    })).filter(r=>r.name||r.date);
    updateStats(); populateMaterials(); render();
  }catch(e){
    el.innerHTML=`<div class="empty">Could not load. Try refreshing.<br><small>${e.message}</small></div>`;
  }
}
function updateStats(){
  document.getElementById('total').textContent=all.length;
  const mats=new Set(all.map(r=>r.material).filter(Boolean));
  document.getElementById('mat-count').textContent=mats.size;
  const dates=all.map(r=>r.date).filter(Boolean).sort();
  document.getElementById('latest').textContent=dates.length?fmtDate(dates[dates.length-1]):'—';
}
function populateMaterials(){
  const sel=document.getElementById('filter-mat');
  sel.innerHTML='<option value="">All materials</option>';
  [...new Set(all.map(r=>r.material).filter(Boolean))].sort()
    .forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;sel.appendChild(o);});
}
function render(){
  const q=document.getElementById('search').value.toLowerCase();
  const mat=document.getElementById('filter-mat').value;
  const sort=document.getElementById('sort').value;
  let rows=all.filter(r=>{
    const mq=!q||r.name.toLowerCase().includes(q)||r.notes.toLowerCase().includes(q);
    return mq&&(!mat||r.material===mat);
  });
  if(sort==='asc')rows.sort((a,b)=>a.date.localeCompare(b.date));
  else if(sort==='desc')rows.sort((a,b)=>b.date.localeCompare(a.date));
  else rows.sort((a,b)=>a.name.localeCompare(b.name));
  const el=document.getElementById('gallery');
  if(!rows.length){el.className='empty';el.textContent='No artworks found.';return;}
  el.className='grid';
  el.innerHTML=rows.map(r=>{
    const thumb=getDriveThumb(r.photo);
    return `<div class="card">
      ${thumb?`<img class="card-img" src="${esc(thumb)}" alt="${esc(r.name)}" onerror="this.outerHTML='<div class=card-img-placeholder>🎨</div>'">`
             :`<div class="card-img-placeholder">🎨</div>`}
      <div class="card-body">
        <div class="card-name">${esc(r.name)}</div>
        <div class="card-date">${fmtDate(r.date)}</div>
        ${r.material?`<span class="badge">${esc(r.material)}</span>`:''}
        ${r.notes?`<div class="card-notes">${esc(r.notes)}</div>`:''}
      </div></div>`;
  }).join('');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── Modal ────────────────────────────────────────────────
function openModal(){
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('f-date').value=new Date().toISOString().split('T')[0];
}
function closeModal(){
  document.getElementById('overlay').classList.add('hidden');
  resetPhoto();
  ['f-name','f-notes'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-material').value='';
  document.getElementById('form-msg').innerHTML='';
}

// ── Photo / Crop ─────────────────────────────────────────
let origImage=null, cropImg=null;
let box={x:10,y:10,w:80,h:80}; // percent
let dragging=null, dragStart=null, boxStart=null;

function onPhotoSelected(input){
  const file=input.files[0]; if(!file)return;
  photoName=file.name; photoMime='image/jpeg';
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{ origImage=img; showCrop(); };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function showCrop(){
  document.getElementById('upload-area').classList.add('hidden');
  document.getElementById('preview-area').classList.add('hidden');
  document.getElementById('crop-area').classList.remove('hidden');
  const canvas=document.getElementById('crop-canvas');
  const maxW=Math.min(origImage.width,600);
  const scale=maxW/origImage.width;
  canvas.width=origImage.width*scale;
  canvas.height=origImage.height*scale;
  cropImg={w:canvas.width,h:canvas.height,scale};
  box={x:5,y:5,w:90,h:90};
  drawCropCanvas();
  setupCropEvents();
}

function drawCropCanvas(){
  const canvas=document.getElementById('crop-canvas');
  const ctx=canvas.getContext('2d');
  ctx.drawImage(origImage,0,0,canvas.width,canvas.height);
  // darken outside
  ctx.fillStyle='rgba(0,0,0,0.45)';
  const bx=box.x/100*canvas.width, by=box.y/100*canvas.height;
  const bw=box.w/100*canvas.width, bh=box.h/100*canvas.height;
  ctx.fillRect(0,0,canvas.width,by);
  ctx.fillRect(0,by+bh,canvas.width,canvas.height-(by+bh));
  ctx.fillRect(0,by,bx,bh);
  ctx.fillRect(bx+bw,by,canvas.width-(bx+bw),bh);
  // border
  ctx.strokeStyle='#fff'; ctx.lineWidth=2;
  ctx.strokeRect(bx,by,bw,bh);
  // handles
  const handles=[[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]];
  handles.forEach(([hx,hy])=>{
    ctx.beginPath(); ctx.arc(hx,hy,8,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.fill();
  });
}

function getCanvasPos(e, canvas){
  const r=canvas.getBoundingClientRect();
  const clientX=e.touches?e.touches[0].clientX:e.clientX;
  const clientY=e.touches?e.touches[0].clientY:e.clientY;
  return {
    x:(clientX-r.left)/r.width*100,
    y:(clientY-r.top)/r.height*100
  };
}

function setupCropEvents(){
  const canvas=document.getElementById('crop-canvas');
  const onStart=e=>{
    e.preventDefault();
    const pos=getCanvasPos(e,canvas);
    const bx=box.x,by=box.y,bw=box.w,bh=box.h;
    const near=(px,py,tx,ty)=>Math.abs(px-tx)<8&&Math.abs(py-ty)<8;
    if(near(pos.x,pos.y,bx,by)) dragging='tl';
    else if(near(pos.x,pos.y,bx+bw,by)) dragging='tr';
    else if(near(pos.x,pos.y,bx,by+bh)) dragging='bl';
    else if(near(pos.x,pos.y,bx+bw,by+bh)) dragging='br';
    else if(pos.x>bx&&pos.x<bx+bw&&pos.y>by&&pos.y<by+bh){
      dragging='move';
      dragStart={x:pos.x,y:pos.y};
      boxStart={...box};
    }
  };
  const onMove=e=>{
    if(!dragging)return; e.preventDefault();
    const pos=getCanvasPos(e,canvas);
    if(dragging==='tl'){box.w+=box.x-pos.x;box.h+=box.y-pos.y;box.x=pos.x;box.y=pos.y;}
    else if(dragging==='tr'){box.w=pos.x-box.x;box.h+=box.y-pos.y;box.y=pos.y;}
    else if(dragging==='bl'){box.w+=box.x-pos.x;box.x=pos.x;box.h=pos.y-box.y;}
    else if(dragging==='br'){box.w=pos.x-box.x;box.h=pos.y-box.y;}
    else if(dragging==='move'){
      box.x=Math.max(0,Math.min(100-boxStart.w,boxStart.x+(pos.x-dragStart.x)));
      box.y=Math.max(0,Math.min(100-boxStart.h,boxStart.y+(pos.y-dragStart.y)));
    }
    box.w=Math.max(10,Math.min(100-box.x,box.w));
    box.h=Math.max(10,Math.min(100-box.y,box.h));
    drawCropCanvas();
  };
  const onEnd=()=>{ dragging=null; };
  canvas.addEventListener('mousedown',onStart);
  canvas.addEventListener('mousemove',onMove);
  canvas.addEventListener('mouseup',onEnd);
  canvas.addEventListener('touchstart',onStart,{passive:false});
  canvas.addEventListener('touchmove',onMove,{passive:false});
  canvas.addEventListener('touchend',onEnd);
}

function applyCrop(){
  const offscreen=document.createElement('canvas');
  const sx=box.x/100*origImage.width;
  const sy=box.y/100*origImage.height;
  const sw=box.w/100*origImage.width;
  const sh=box.h/100*origImage.height;
  offscreen.width=sw; offscreen.height=sh;
  offscreen.getContext('2d').drawImage(origImage,sx,sy,sw,sh,0,0,sw,sh);
  // Resize to max 1200px wide to reduce upload size
  const maxW=1200;
  const finalCanvas=document.createElement('canvas');
  const scale=Math.min(1,maxW/sw);
  finalCanvas.width=sw*scale; finalCanvas.height=sh*scale;
  finalCanvas.getContext('2d').drawImage(offscreen,0,0,finalCanvas.width,finalCanvas.height);
  croppedBase64=finalCanvas.toDataURL('image/jpeg',0.82).split(',')[1];
  const preview=document.getElementById('preview-img');
  preview.src='data:image/jpeg;base64,'+croppedBase64;
  document.getElementById('crop-area').classList.add('hidden');
  document.getElementById('preview-area').classList.remove('hidden');
}

function reCrop(){ showCrop(); croppedBase64=null; }

function resetPhoto(){
  croppedBase64=null; origImage=null;
  document.getElementById('f-photo').value='';
  document.getElementById('upload-area').classList.remove('hidden');
  document.getElementById('crop-area').classList.add('hidden');
  document.getElementById('preview-area').classList.add('hidden');
}

// ── Submit ───────────────────────────────────────────────
async function submitArtwork(){
  const name=document.getElementById('f-name').value.trim();
  const date=document.getElementById('f-date').value;
  const material=document.getElementById('f-material').value;
  const notes=document.getElementById('f-notes').value.trim();
  const msg=document.getElementById('form-msg');
  if(!name){msg.innerHTML='<div class="error-msg">Please enter a project name.</div>';return;}
  const btn=document.getElementById('submit-btn');
  btn.textContent='Saving…'; btn.disabled=true; msg.innerHTML='';
  try{
    const payload={name,date,material,notes};
    if(croppedBase64){payload.photoData=croppedBase64;payload.photoName=photoName;payload.photoMime='image/jpeg';}
    const res=await fetch(API,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const result=await res.json();
    if(result.success){
      msg.innerHTML='<div class="success-msg">Artwork saved! 🎨</div>';
      setTimeout(()=>{closeModal();load();},1500);
    }else{
      msg.innerHTML=`<div class="error-msg">Error: ${result.error||'Unknown error'}</div>`;
    }
  }catch(e){
    msg.innerHTML=`<div class="error-msg">Failed to save: ${e.message}</div>`;
  }
  btn.textContent='Save artwork'; btn.disabled=false;
}

load();
</script>
</body>
</html>
