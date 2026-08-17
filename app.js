const D=window.ISLAMIC_DATA;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const surahNames=["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
let currentAdhkarCat='الصباح',currentDuaCat='قرآنية';
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2400)}
function celebrate(message='أحسنت! تقبّل الله منك ✨'){const box=$('#celebration');if(!box)return;$('#celebrationMessage').textContent=message;box.querySelectorAll('.celebration-piece').forEach(x=>x.remove());const marks=['✦','★','۞','❤','✧'];for(let i=0;i<34;i++){const p=document.createElement('span');p.className='celebration-piece';p.textContent=marks[i%marks.length];p.style.setProperty('--x',`${Math.random()*100}%`);p.style.setProperty('--delay',`${Math.random()*.45}s`);p.style.setProperty('--drift',`${(Math.random()-.5)*180}px`);box.appendChild(p)}box.classList.add('show');setTimeout(()=>box.classList.remove('show'),2100)}
function esc(s){return String(s).replaceAll('\\','\\\\').replaceAll('"','&quot;').replaceAll("'","&#39;").replace(/\n/g,' ')}
function showPage(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));$('#sidebar').classList.remove('open');$('#overlay').classList.remove('show');window.scrollTo({top:0,behavior:'smooth'});if(id==='favorites')renderFavorites();if(id==='khatma')renderKhatma();if(id==='quran'&&!qState.ayahs.length)loadQuranPage(qState.page);if(id==='promised')renderPromised();if(id==='prophets')renderProphets();if(id==='islamicencyclopedia')renderEncyclopedia();if(id==='wisdom')renderWisdom()}
$$('#nav button').forEach(b=>b.onclick=()=>showPage(b.dataset.section));$$('[data-open]').forEach(b=>b.onclick=()=>showPage(b.dataset.open));
$('#menuBtn').onclick=()=>{$('#sidebar').classList.toggle('open');$('#overlay').classList.toggle('show')};$('#overlay').onclick=()=>{$('#sidebar').classList.remove('open');$('#overlay').classList.remove('show')};
function applyTheme(mode){
  const dark=mode==='dark';
  document.body.classList.toggle('dark',dark);
  localStorage.setItem('themeV12',dark?'dark':'light');
  const lightBtn=$('#themeLightBtn'),darkBtn=$('#themeDarkBtn');
  if(lightBtn)lightBtn.classList.toggle('active-theme',!dark);
  if(darkBtn)darkBtn.classList.toggle('active-theme',dark);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',dark?'#0b1512':'#0d5b45');
}
const savedTheme=localStorage.getItem('themeV12')||localStorage.getItem('themeV11')||localStorage.getItem('theme')||'light';
applyTheme(savedTheme);
if($('#themeLightBtn'))$('#themeLightBtn').onclick=()=>applyTheme('light');
if($('#themeDarkBtn'))$('#themeDarkBtn').onclick=()=>applyTheme('dark');
const dailyGo=$('[data-go="daily"]');if(dailyGo)dailyGo.onclick=()=>$('#daily').scrollIntoView({behavior:'smooth'});
if($('#homeSearchBtn'))$('#homeSearchBtn').onclick=()=>$('#globalSearchBtn').click();if($('#homeShareBtn'))$('#homeShareBtn').onclick=()=>$('#shareSite').click();

function daily(){const k=Math.floor(Date.now()/86400000),a=D.dailyAyahs[k%D.dailyAyahs.length],h=D.hadiths[k%D.hadiths.length],cats=Object.keys(D.adhkar),dcat=Object.keys(D.duas);$('#dailyAyah').textContent=a.t;$('#dailyAyahRef').textContent=a.r;$('#dailyDhikr').textContent=D.adhkar[cats[k%cats.length]][0][0];$('#dailyHadith').textContent=h[1];$('#dailyHadithRef').textContent=h[2];$('#dailyDua').textContent=D.duas[dcat[k%dcat.length]][0][0];$('#homeAdhkarCount').textContent=Object.values(D.adhkar).reduce((n,x)=>n+x.length,0);$('#homeHadithCount').textContent=D.hadiths.length}daily();

// -------------------- المصحف: صفحات + سور كاملة + أجزاء --------------------
$('#surahSelect').innerHTML=surahNames.map((n,i)=>`<option value="${i+1}">${i+1}. سورة ${n}</option>`).join('');
$('#juzSelect').innerHTML=Array.from({length:30},(_,i)=>`<option value="${i+1}">الجزء ${i+1}</option>`).join('');
const reciterBitrate={"ar.alafasy":128,"ar.husary":128,"ar.minshawi":128,"ar.hudhaify":128,"ar.sudais":192,"ar.abdulbasit":192,"ar.shuraim":128,"legacy.mustafa":128,"legacy.refat":128};
const legacySurahReciters={"legacy.mustafa":"https://server8.mp3quran.net/mustafa/","legacy.refat":"https://server14.mp3quran.net/refat/"};
const everyAyahReciters={"ar.sudais":"Abdurrahmaan_As-Sudais_192kbps","ar.abdulbasit":"Abdul_Basit_Murattal_192kbps","ar.shuraim":"Saood_ash-Shuraym_128kbps"};
function pad3(n){return String(Number(n)||0).padStart(3,'0')}
function ayahAudioSources(ayah,rec){const bit=reciterBitrate[rec]||128,sources=[];if(everyAyahReciters[rec]&&ayah?.surah?.number&&ayah?.numberInSurah)sources.push(`https://everyayah.com/data/${everyAyahReciters[rec]}/${pad3(ayah.surah.number)}${pad3(ayah.numberInSurah)}.mp3`);sources.push(`https://cdn.islamic.network/quran/audio/${bit}/${rec}/${ayah.number}.mp3`,`https://cdn.alislam.ru/quran/audio/${bit}/${rec}/${ayah.number}.mp3`);return sources}
const qState={mode:'page',page:Number(localStorage.lastQuranPage||1),juz:1,ayahs:[],surahs:[],audioCtx:null,audioSources:[],audioTimer:null,audioStarted:0,audioTotal:0,audioRanges:[],fallbackPlayer:null,currentSurah:1};
async function fetchJSON(url){const r=await fetch(url);if(!r.ok)throw Error('network');const j=await r.json();if(j.code&&j.code!==200)throw Error('api');return j}
function pageCacheKey(p){return `quranPage:v61:${p}`}
let fullQuranPromise=null;
async function getFullQuranAyahs(){
  if(fullQuranPromise)return fullQuranPromise;
  fullQuranPromise=(async()=>{
    const cached=sessionStorage.getItem('quranFull:v61');
    if(cached){try{return JSON.parse(cached)}catch{}}
    const j=await fetchJSON('https://api.alquran.cloud/v1/quran/quran-uthmani');
    const ayahs=[];
    (j.data?.surahs||[]).forEach(s=>{
      (s.ayahs||[]).forEach(a=>ayahs.push({...a,surah:{number:s.number,name:s.name,englishName:s.englishName,englishNameTranslation:s.englishNameTranslation,revelationType:s.revelationType}}));
    });
    try{sessionStorage.setItem('quranFull:v61',JSON.stringify(ayahs))}catch{}
    return ayahs;
  })();
  try{return await fullQuranPromise}catch(e){fullQuranPromise=null;throw e}
}
async function getPageData(p){
  const key=pageCacheKey(p),cached=sessionStorage.getItem(key);
  if(cached){try{return JSON.parse(cached)}catch{}}
  try{
    const j=await fetchJSON(`https://api.alquran.cloud/v1/page/${p}/quran-uthmani`);
    if(j?.data?.ayahs?.length){sessionStorage.setItem(key,JSON.stringify(j.data));return j.data}
  }catch{}
  const all=await getFullQuranAyahs(),ayahs=all.filter(a=>Number(a.page)===Number(p));
  if(!ayahs.length)throw new Error('page-empty');
  const data={number:Number(p),ayahs};
  try{sessionStorage.setItem(key,JSON.stringify(data))}catch{}
  return data;
}
async function getSurahAyahs(n){
  try{const j=await fetchJSON(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`);if(j?.data?.ayahs?.length)return j.data.ayahs.map(a=>({...a,surah:{number:j.data.number,name:j.data.name,englishName:j.data.englishName,englishNameTranslation:j.data.englishNameTranslation,revelationType:j.data.revelationType}}))}catch{}
  const all=await getFullQuranAyahs();return all.filter(a=>a.surah.number===Number(n));
}
async function getJuzAyahs(n){
  try{const j=await fetchJSON(`https://api.alquran.cloud/v1/juz/${n}/quran-uthmani`);if(j?.data?.ayahs?.length)return j.data.ayahs}catch{}
  const all=await getFullQuranAyahs();return all.filter(a=>Number(a.juz)===Number(n));
}
function stopSurahPlayer(){const p=$('#surahPlayer');if(!p)return;p.pause();p.removeAttribute('src');p.load()}
function setQuranMode(mode){qState.mode=mode;$$('.quran-mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));const cfg={page:['وضع الصفحات','التنقل الآن صفحة بصفحة'],surah:['وضع السورة الكاملة','السورة المختارة تظهر كاملة دون تقسيمها إلى صفحات'],juz:['وضع الجزء الكامل','الجزء المختار يظهر كاملًا ويمكن الانتقال بين الأجزاء']}[mode];$('#readingModeBadge').textContent=cfg[0];$('#readingModeHelp').textContent=cfg[1];$('#autoNextWrap').classList.toggle('hidden',mode!=='page');$('#mushafPage').classList.toggle('long-reading',mode!=='page');$('#mushafPage').classList.toggle('surah-reading',mode==='surah');$('#mushafPage').classList.toggle('juz-reading',mode==='juz');localStorage.quranBrowseMode=mode}
function renderMushafPage(ayahs){let html='',lastSurah=null;ayahs.forEach(a=>{if(a.surah.number!==lastSurah){lastSurah=a.surah.number;const rt=(a.surah.revelationType||'').toLowerCase(),type=rt.includes('meccan')?'مكية':rt.includes('medinan')?'مدنية':'';html+=`<div class="surah-banner">سُورَةُ ${surahNames[lastSurah-1]} ${type?`<small class="surah-inline-type">${type}</small>`:''}</div>`;if(a.numberInSurah===1&&lastSurah!==1&&lastSurah!==9)html+='<div class="basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>'}let text=a.text;if(a.numberInSurah===1&&lastSurah!==1&&lastSurah!==9)text=text.replace(/^بِسْمِ[^]+?الرَّحِيمِ\s*/,'');html+=`<span class="mushaf-ayah" role="button" tabindex="0" title="اضغط لعرض تفسير الآية" data-global="${a.number}" data-surah="${a.surah.number}" data-ayah="${a.numberInSurah}" data-rtype="${a.surah.revelationType||''}" data-page="${a.page||''}">${text} <span class="mushaf-ayah-mark">${a.numberInSurah}</span> </span>`});$('#mushafPage').innerHTML=`<p class="mushaf-text">${html}</p>`;bindTafsirAyahs(ayahs);updateSurahKnowledge(ayahs)}
function setNavDisabled(prevDisabled,nextDisabled){$('#prevPage').disabled=$('#prevPageBottom').disabled=prevDisabled;$('#nextPage').disabled=$('#nextPageBottom').disabled=nextDisabled}
async function loadQuranPage(page){page=Math.max(1,Math.min(604,Number(page)||1));stopPageAudio();stopSurahPlayer();setQuranMode('page');qState.page=page;localStorage.lastQuranPage=page;$('#pageJump').value=page;$('#mushafPageTitle').textContent=`الصفحة ${page}`;$('#pageNumberBottom').textContent=`صفحة ${page}`;$('#mushafMeta').textContent='جارٍ تحميل الصفحة...';$('#mushafPage').innerHTML='<div class="notice">جارٍ تحميل نص الصفحة...</div>';setNavDisabled(page===1,page===604);try{const data=await getPageData(page),ayahs=data.ayahs||[];qState.ayahs=ayahs;qState.surahs=[...new Set(ayahs.map(a=>a.surah.number))];qState.currentSurah=qState.surahs[0]||1;qState.juz=ayahs[0]?.juz||1;$('#surahSelect').value=qState.currentSurah;$('#juzSelect').value=qState.juz;const metaSurahs=qState.surahs.map(n=>`سورة ${surahNames[n-1]}`).join(' • ');$('#mushafMeta').textContent=`${metaSurahs} — الجزء ${qState.juz}`;renderMushafPage(ayahs);updateLastReadUI()}catch(e){$('#mushafPage').innerHTML='<div class="notice">تعذر تحميل صفحة المصحف الآن. تأكد من الإنترنت ثم أعد المحاولة.</div>';$('#mushafMeta').textContent='تعذر التحميل'}}
async function loadQuranSurah(n){n=Math.max(1,Math.min(114,Number(n)||1));stopPageAudio();stopSurahPlayer();setQuranMode('surah');qState.currentSurah=n;localStorage.lastQuranSurah=n;$('#surahSelect').value=n;$('#mushafPageTitle').textContent=`سورة ${surahNames[n-1]} كاملة`;$('#pageNumberBottom').textContent=`${n} / 114`;$('#mushafMeta').textContent='جارٍ تحميل السورة كاملة...';$('#mushafPage').innerHTML='<div class="notice">جارٍ تحميل السورة كاملة...</div>';setNavDisabled(n===1,n===114);try{const ayahs=await getSurahAyahs(n);qState.ayahs=ayahs;qState.surahs=[n];qState.page=ayahs[0]?.page||qState.page;qState.juz=ayahs[0]?.juz||1;$('#pageJump').value=qState.page;$('#juzSelect').value=qState.juz;$('#mushafMeta').textContent=`${ayahs.length} آية — تبدأ من صفحة ${ayahs[0]?.page||'—'} — الجزء ${qState.juz}`;renderMushafPage(ayahs)}catch(e){$('#mushafPage').innerHTML='<div class="notice">تعذر تحميل السورة كاملة الآن.</div>';$('#mushafMeta').textContent='تعذر التحميل'}}
async function loadQuranJuz(n){n=Math.max(1,Math.min(30,Number(n)||1));stopPageAudio();stopSurahPlayer();setQuranMode('juz');qState.juz=n;localStorage.lastQuranJuz=n;$('#juzSelect').value=n;$('#mushafPageTitle').textContent=`الجزء ${n} كاملًا`;$('#pageNumberBottom').textContent=`جزء ${n} / 30`;$('#mushafMeta').textContent='جارٍ تحميل الجزء كاملًا...';$('#mushafPage').innerHTML='<div class="notice">جارٍ تحميل الجزء كاملًا...</div>';setNavDisabled(n===1,n===30);try{const ayahs=await getJuzAyahs(n);qState.ayahs=ayahs;qState.surahs=[...new Set(ayahs.map(a=>a.surah.number))];qState.currentSurah=qState.surahs[0]||1;qState.page=ayahs[0]?.page||qState.page;$('#pageJump').value=qState.page;$('#surahSelect').value=qState.currentSurah;$('#mushafMeta').textContent=`${ayahs.length} آية — ${qState.surahs.map(x=>surahNames[x-1]).join(' • ')}`;renderMushafPage(ayahs)}catch(e){$('#mushafPage').innerHTML='<div class="notice">تعذر تحميل الجزء كاملًا الآن.</div>';$('#mushafMeta').textContent='تعذر التحميل'}}
function gotoQuran(delta){if(qState.mode==='surah')return loadQuranSurah(qState.currentSurah+delta);if(qState.mode==='juz')return loadQuranJuz(qState.juz+delta);return loadQuranPage(qState.page+delta)}
$('#prevPage').onclick=$('#prevPageBottom').onclick=()=>gotoQuran(-1);$('#nextPage').onclick=$('#nextPageBottom').onclick=()=>gotoQuran(1);
$('#goPage').onclick=()=>loadQuranPage($('#pageJump').value);$('#pageJump').onkeydown=e=>{if(e.key==='Enter')loadQuranPage(e.target.value)};
$('#surahSelect').onchange=e=>loadQuranSurah(e.target.value);$('#juzSelect').onchange=e=>loadQuranJuz(e.target.value);
$('#modePage').onclick=()=>loadQuranPage(qState.page);$('#modeSurah').onclick=()=>loadQuranSurah(qState.currentSurah);$('#modeJuz').onclick=()=>loadQuranJuz(qState.juz);
$('#savePage').onclick=()=>{const p=qState.ayahs[0]?.page||qState.page;localStorage.savedQuranPage=p;localStorage.lastQuranPage=p;renderKhatma();toast(`تم حفظ موضع القراءة عند الصفحة ${p}`)};
function playSurahContinuous(n=qState.currentSurah){
  stopPageAudio();
  const rec=$('#reciter').value,bit=reciterBitrate[rec]||128,player=$('#surahPlayer');
  const sources=legacySurahReciters[rec]
    ? [`${legacySurahReciters[rec]}${pad3(n)}.mp3`]
    : [
      `https://cdn.islamic.network/quran/audio-surah/${bit}/${rec}/${n}.mp3`,
      `https://cdn.alislam.ru/quran/audio-surah/${bit}/${rec}/${n}.mp3`
    ];
  let sourceIndex=0,finished=false;
  const cleanup=()=>{player.onerror=null;player.oncanplay=null;player.onplaying=null};
  const fallback=()=>{
    cleanup();
    if(finished)return;
    finished=true;
    $('#pageAudioStatus').textContent='تعذر ملف السورة المتصل؛ سيتم تشغيل الآيات بالتتابع.';
    toast('تم التحويل تلقائيًا إلى تشغيل الآيات');
    playAyahSequence();
  };
  const trySource=()=>{
    if(sourceIndex>=sources.length)return fallback();
    player.pause();
    player.src=sources[sourceIndex++];
    player.load();
    $('#pageAudioStatus').textContent=`جارٍ تجهيز سورة ${surahNames[n-1]} بصوت متصل...`;
    player.onerror=()=>setTimeout(trySource,120);
    player.oncanplay=()=>{
      if(finished)return;
      $('#pageAudioStatus').textContent=`تشغيل سورة ${surahNames[n-1]} كاملة بصوت متصل`;
      player.play().catch(()=>{if(sourceIndex<sources.length)trySource();else fallback()});
    };
    player.onplaying=()=>{finished=true;cleanup()};
  };
  trySource();
}
$('#playCurrentSurah').onclick=()=>playSurahContinuous(qState.currentSurah);
$('#reciter').onchange=()=>{stopPageAudio();stopSurahPlayer()};
function trimAudioBuffer(ctx,buffer){const sr=buffer.sampleRate,ch0=buffer.getChannelData(0),threshold=.0035;let start=0,end=ch0.length-1;while(start<end&&Math.abs(ch0[start])<threshold)start++;while(end>start&&Math.abs(ch0[end])<threshold)end--;const pad=Math.floor(sr*.025);start=Math.max(0,start-pad);end=Math.min(ch0.length-1,end+pad);const len=Math.max(1,end-start+1),out=ctx.createBuffer(buffer.numberOfChannels,len,sr);for(let c=0;c<buffer.numberOfChannels;c++)out.copyToChannel(buffer.getChannelData(c).slice(start,end+1),c);return out}
async function loadAyahBuffer(ctx,ayah,rec){let lastErr;for(const url of ayahAudioSources(ayah,rec)){try{const r=await fetch(url);if(!r.ok)throw Error('audio');const arr=await r.arrayBuffer();const decoded=await ctx.decodeAudioData(arr);return trimAudioBuffer(ctx,decoded)}catch(e){lastErr=e}}throw lastErr||Error('audio')}
function highlightAudioAyah(i){$$('.mushaf-ayah').forEach(x=>x.classList.remove('current-audio-ayah'));const el=$$('.mushaf-ayah')[i];if(el){el.classList.add('current-audio-ayah');if(qState.mode!=='page'&&i%5===0)el.scrollIntoView({behavior:'smooth',block:'center'})}}
async function playPageSeamless(){stopPageAudio();if(!qState.ayahs.length)return;const btn=$('#playPage');btn.disabled=true;$('#pageAudioStatus').textContent='جارٍ تجهيز تلاوة الصفحة لتعمل متصلة...';try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)throw Error('noctx');const ctx=new AudioCtx();qState.audioCtx=ctx;if(ctx.state==='suspended')await ctx.resume();const rec=$('#reciter').value,buffers=[];for(let i=0;i<qState.ayahs.length;i++){$('#pageAudioStatus').textContent=`تجهيز تلاوة الصفحة... ${i+1} من ${qState.ayahs.length}`;buffers.push(await loadAyahBuffer(ctx,qState.ayahs[i],rec))}let t=ctx.currentTime+.12,total=0;qState.audioSources=[];qState.audioRanges=[];buffers.forEach((buf,i)=>{const src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);src.start(t+total);qState.audioSources.push(src);qState.audioRanges.push([total,total+buf.duration,i]);total+=buf.duration});qState.audioStarted=ctx.currentTime+.12;qState.audioTotal=total;$('#pageAudioStatus').textContent=`تشغيل الصفحة ${qState.page} — تلاوة متصلة`;qState.audioTimer=setInterval(()=>{if(!qState.audioCtx)return;const elapsed=Math.max(0,qState.audioCtx.currentTime-qState.audioStarted),pct=Math.min(100,(elapsed/qState.audioTotal)*100);$('#pageAudioProgress').style.width=pct+'%';const range=qState.audioRanges.find(r=>elapsed>=r[0]&&elapsed<r[1]);if(range)highlightAudioAyah(range[2]);if(elapsed>=qState.audioTotal){stopPageAudio(false);$('#pageAudioStatus').textContent=`انتهت الصفحة ${qState.page}`;if($('#autoNextPage').checked&&qState.page<604){loadQuranPage(qState.page+1).then(()=>setTimeout(playPageSeamless,450))}}},180)}catch(e){$('#pageAudioStatus').textContent='تعذر تشغيل وضع الصفحة المتصل على هذا المتصفح. سيتم استخدام التشغيل المتتابع.';playAyahSequence()}finally{btn.disabled=false}}
function playAyahSequence(){stopPageAudio();const rec=$('#reciter').value;let i=0,sourceIndex=0,sources=[];const a=new Audio();qState.fallbackPlayer=a;const finish=()=>{qState.fallbackPlayer=null;$('#pageAudioStatus').textContent='انتهت التلاوة';if(qState.mode==='page'&&$('#autoNextPage').checked&&qState.page<604)loadQuranPage(qState.page+1)};const trySource=()=>{if(!sources.length||sourceIndex>=sources.length){i++;return next()}a.src=sources[sourceIndex++];a.load();a.play().catch(()=>{if(qState.fallbackPlayer===a)setTimeout(trySource,80)})};const next=()=>{if(i>=qState.ayahs.length)return finish();const ayah=qState.ayahs[i];highlightAudioAyah(i);$('#pageAudioStatus').textContent=qState.mode==='juz'?`تشغيل الجزء ${qState.juz} — الآية ${i+1} من ${qState.ayahs.length}`:`تشغيل الآية ${i+1} من ${qState.ayahs.length}`;sources=ayahAudioSources(ayah,rec);sourceIndex=0;trySource()};a.onended=()=>{i++;next()};a.onerror=()=>{if(qState.fallbackPlayer===a)setTimeout(trySource,80)};next()}
function stopPageAudio(reset=true){if(qState.audioTimer){clearInterval(qState.audioTimer);qState.audioTimer=null}qState.audioSources.forEach(s=>{try{s.stop()}catch{}});qState.audioSources=[];if(qState.audioCtx){try{qState.audioCtx.close()}catch{}qState.audioCtx=null}if(qState.fallbackPlayer){qState.fallbackPlayer.pause();qState.fallbackPlayer=null}$$('.mushaf-ayah').forEach(x=>x.classList.remove('current-audio-ayah'));if(reset){$('#pageAudioProgress').style.width='0%';$('#pageAudioStatus').textContent='تم إيقاف التلاوة.'}}
$('#playPage').onclick=()=>{if(qState.mode==='surah')return playSurahContinuous(qState.currentSurah);if(qState.mode==='juz')return playAyahSequence();playPageSeamless()};$('#stopPage').onclick=()=>{stopPageAudio();stopSurahPlayer()};
$('#quranSearchBtn').onclick=searchQuran;$('#quranSearch').onkeydown=e=>{if(e.key==='Enter')searchQuran()};async function searchQuran(){const q=$('#quranSearch').value.trim(),box=$('#quranSearchResults');if(q.length<2)return toast('اكتب كلمتين على الأقل للبحث');box.classList.remove('hidden');box.innerHTML='<div class="notice">جارٍ البحث في القرآن...</div>';try{const j=await fetchJSON(`https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/ar`),m=(j.data.matches||[]).slice(0,25);box.innerHTML=m.length?m.map(x=>`<button class="search-result" data-g="${x.number||x.ayah?.number||''}"><b>${surahNames[(x.surah?.number||1)-1]}: ${x.numberInSurah||x.ayah?.numberInSurah||''}</b><span>${x.text}</span><small>اضغط لفتح موضع الآية في المصحف</small></button>`).join(''):'<div class="notice">لا توجد نتائج.</div>';box.querySelectorAll('[data-g]').forEach(b=>b.onclick=async()=>{try{const aj=await fetchJSON(`https://api.alquran.cloud/v1/ayah/${b.dataset.g}/quran-uthmani`);loadQuranPage(aj.data.page)}catch{toast('تعذر فتح موضع الآية')}})}catch{box.innerHTML='<div class="notice">تعذر البحث الآن.</div>'}}
function updateLastReadUI(){
  const p=Math.max(1,Math.min(604,Number(localStorage.lastQuranPage||1)));
  const label=$('#lastReadLabel');
  if(label)label.textContent=`آخر قراءة: الصفحة ${p}`;
  const b=$('#continueReading');
  if(b)b.textContent=`متابعة الصفحة ${p}`;
  renderHomeKhatma();
}
function renderKhatma(){const p=Math.max(0,Math.min(604,Number(localStorage.savedQuranPage||localStorage.lastQuranPage||0))),pct=p?Math.round((p/604)*100):0,daily=Math.max(1,Number(localStorage.dailyPages||10));$('#khatmaCurrentPage').value=p||'';$('#dailyPages').value=daily;$('#khatmaPercent').textContent=pct+'%';$('#khatmaPages').textContent=`${p} من 604 صفحة`;$('#khatmaBar').style.width=pct+'%';const remaining=Math.max(0,604-p),days=Math.ceil(remaining/daily);$('#khatmaEstimate').textContent=remaining?`بمعدل ${daily} صفحات يوميًا، يتبقى تقريبًا ${days} يومًا لإتمام الختمة بإذن الله.`:'أتممت تسجيل صفحات الختمة. تقبل الله.';const start=p+1,end=Math.min(604,p+daily);$('#todayTarget').textContent=p<604?`${start} — ${end}`:'تمت الختمة';updateLastReadUI()}
function renderHomeKhatma(){const p=Math.max(0,Math.min(604,Number(localStorage.savedQuranPage||0))),pct=p?Math.round((p/604)*100):0;$('#homeKhatmaTitle').textContent=p?`وصلت إلى الصفحة ${p}`:'ابدأ ختمتك';$('#homeKhatmaText').textContent=p?`أنجزت ${pct}% من صفحات المصحف.`:'يمكنك حفظ آخر صفحة ومتابعة وردك يوميًا.';$('#homeKhatmaBar').style.width=pct+'%'}
$('#saveKhatma').onclick=()=>{const p=Math.max(1,Math.min(604,Number($('#khatmaCurrentPage').value)||1));localStorage.savedQuranPage=p;localStorage.lastQuranPage=p;renderKhatma();toast('تم حفظ تقدم الختمة');celebrate('تم حفظ تقدم الختمة، بارك الله في وردك 📖')};$('#saveDailyPages').onclick=()=>{localStorage.dailyPages=Math.max(1,Math.min(100,Number($('#dailyPages').value)||10));renderKhatma();toast('تم حفظ الورد اليومي')};$('#openKhatmaPage').onclick=()=>{showPage('quran');loadQuranPage(Number(localStorage.savedQuranPage||localStorage.lastQuranPage||1))};$('#resumeLastRead').onclick=$('#continueReading').onclick=()=>{showPage('quran');loadQuranPage(Number(localStorage.lastQuranPage||1))};renderKhatma();

// -------------------- الأذكار والأدعية والأحاديث --------------------
function buildTabs(container,obj,cb){const keys=Object.keys(obj);container.innerHTML=keys.map((k,i)=>`<button class="${i?'':'active'}" data-k="${k}">${k}</button>`).join('');container.querySelectorAll('button').forEach(b=>b.onclick=()=>{container.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');cb(b.dataset.k)});return keys[0]}
function renderAdhkar(cat){currentAdhkarCat=cat;const q=$('#adhkarSearch').value.trim(),list=$('#adhkarList');list.innerHTML='';D.adhkar[cat].forEach((z,i)=>{if(q&&!`${z[0]} ${z[2]}`.includes(q))return;let key=`dhikr:${cat}:${i}`,count=Number(localStorage[key]||0),art=document.createElement('article');art.innerHTML=`<div class="item-head"><span class="tag">${cat}</span><div class="item-actions"><button class="fav">☆</button><button class="shr">↗</button></div></div><p>${z[0]}</p><small class="source">${z[2]}</small><div class="counter-row"><small>التكرار: ${z[1]}</small><button class="counter-btn">${count>=z[1]?'✓ تم':count+' / '+z[1]}</button></div>`;const btn=art.querySelector('.counter-btn');btn.onclick=()=>{const wasDone=count>=z[1];count=Math.min(z[1],count+1);localStorage[key]=count;btn.textContent=count>=z[1]?'✓ تم':`${count} / ${z[1]}`;if(!wasDone&&count>=z[1])celebrate('أحسنت، أتممت هذا الذكر ✨')};art.querySelector('.fav').onclick=()=>favItem('ذكر',z[0],z[2]);art.querySelector('.shr').onclick=()=>shareText(`${z[0]}\n${z[2]}`);list.appendChild(art)});if(!list.children.length)list.innerHTML='<div class="notice">لا توجد نتائج في هذا القسم.</div>'}
let firstA=buildTabs($('#adhkarTabs'),D.adhkar,renderAdhkar);renderAdhkar(firstA);$('#adhkarSearch').oninput=()=>renderAdhkar(currentAdhkarCat);$('#resetAdhkarToday').onclick=()=>{D.adhkar[currentAdhkarCat].forEach((_,i)=>localStorage.removeItem(`dhikr:${currentAdhkarCat}:${i}`));renderAdhkar(currentAdhkarCat);toast('تم تصفير عدادات القسم')};
function renderDuas(cat){currentDuaCat=cat;const q=$('#duaSearch').value.trim(),list=$('#duaList');list.innerHTML='';D.duas[cat].forEach(d=>{if(q&&!`${d[0]} ${d[1]}`.includes(q))return;const a=document.createElement('article');a.innerHTML=`<div class="item-head"><span class="tag">${cat}</span><div class="item-actions"><button class="fav">☆</button><button class="shr">↗</button></div></div><p class="quran-text">${d[0]}</p><small class="source">${d[1]}</small>`;a.querySelector('.fav').onclick=()=>favItem('دعاء',d[0],d[1]);a.querySelector('.shr').onclick=()=>shareText(`${d[0]}\n${d[1]}`);list.appendChild(a)});if(!list.children.length)list.innerHTML='<div class="notice">لا توجد نتائج في هذا القسم.</div>'}
let firstD=buildTabs($('#duaTabs'),D.duas,renderDuas);renderDuas(firstD);$('#duaSearch').oninput=()=>renderDuas(currentDuaCat);
const hadithCats=[...new Set(D.hadiths.map(h=>h[0]))].sort();$('#hadithCategory').innerHTML='<option value="all">كل الموضوعات</option>'+hadithCats.map(c=>`<option>${c}</option>`).join('');function renderHadith(){let q=$('#hadithSearch').value.trim(),c=$('#hadithCategory').value,list=$('#hadithList');list.innerHTML='';D.hadiths.filter(h=>(c==='all'||h[0]===c)&&(!q||h.join(' ').includes(q))).forEach(h=>{const a=document.createElement('article');a.innerHTML=`<div class="item-head"><span class="tag">${h[0]}</span><div class="item-actions"><button class="fav">☆</button><button class="shr">↗</button></div></div><p>${h[1]}</p><small class="source">${h[2]}</small>`;a.querySelector('.fav').onclick=()=>favItem('حديث',h[1],h[2]);a.querySelector('.shr').onclick=()=>shareText(`${h[1]}\n${h[2]}`);list.appendChild(a)});if(!list.children.length)list.innerHTML='<div class="notice">لا توجد نتائج مطابقة.</div>'}renderHadith();$('#hadithSearch').oninput=renderHadith;$('#hadithCategory').onchange=renderHadith;

const ruqyah=[
['الفاتحة','بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ','سورة الفاتحة — ثبتت الرقية بها في الصحيح'],
['آية الكرسي',D.adhkar['الصباح'][0][0].replace('آية الكرسي: ',''),'البقرة: 255'],
['الإخلاص',D.adhkar['الصباح'][1][0],'سورة الإخلاص'],['الفلق',D.adhkar['الصباح'][2][0],'سورة الفلق'],['الناس',D.adhkar['الصباح'][3][0],'سورة الناس'],
['دعاء الشفاء','أَذْهِبِ البَأْسَ رَبَّ النَّاسِ، اشْفِ أَنْتَ الشَّافِي، لا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لا يُغَادِرُ سَقَمًا.','صحيح البخاري وصحيح مسلم'],
['الرقية النبوية','بِسْمِ اللهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللهُ يَشْفِيكَ، بِسْمِ اللهِ أَرْقِيكَ.','صحيح مسلم']
];$('#ruqyahList').innerHTML=ruqyah.map(x=>`<article><span class="tag">${x[0]}</span><p class="quran-text">${x[1]}</p><small class="source">${x[2]}</small></article>`).join('');

// -------------------- المفضلة والمشاركة والسبحة --------------------
function getFavs(){try{return JSON.parse(localStorage.favorites||'[]')}catch{return[]}}window.favItem=(type,text,ref)=>{let a=getFavs();if(!a.some(x=>x.text===text)){a.unshift({type,text,ref});localStorage.favorites=JSON.stringify(a);toast('تمت الإضافة للمفضلة')}else toast('موجود بالفعل في المفضلة')};function renderFavorites(){const a=getFavs(),l=$('#favoriteList');if(!a.length){l.innerHTML='<div class="notice">لم تحفظ أي محتوى بعد. اضغط ☆ بجوار أي ذكر أو دعاء أو حديث.</div>';return}l.innerHTML='';a.forEach((x,i)=>{const e=document.createElement('article');e.innerHTML=`<div class="item-head"><span class="tag">${x.type}</span><button class="remove">حذف</button></div><p>${x.text}</p><small class="source">${x.ref||''}</small>`;e.querySelector('.remove').onclick=()=>{a.splice(i,1);localStorage.favorites=JSON.stringify(a);renderFavorites()};l.appendChild(e)})}
window.shareText=async text=>{try{if(navigator.share)await navigator.share({title:'صدقة جارية على روح سامي كمال عبده مصطفي',text,url:location.href});else{await navigator.clipboard.writeText(text+'\n'+location.href);toast('تم نسخ النص والرابط')}}catch{}};$('#shareSite').onclick=$('#shareMemorial').onclick=()=>shareText('صدقة جارية على روح سامي كمال عبده مصطفي — قرآن بالصفحات وأذكار وأدعية وأحاديث ومواقيت الصلاة.');
let tas=Number(localStorage.tasbeeh||0);function paintTas(){$('#tasbeehCount').textContent=tas;localStorage.tasbeeh=tas}paintTas();$('#tasbeehTap').onclick=()=>{tas++;paintTas()};$('#minusTasbeeh').onclick=()=>{tas=Math.max(0,tas-1);paintTas()};$('#resetTasbeeh').onclick=()=>{tas=0;paintTas()};$('#tasbeehPhrase').onchange=()=>{tas=0;paintTas()};

// -------------------- الصلاة والقبلة --------------------
const pNames={Fajr:'الفجر',Sunrise:'الشروق',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'};let prayerCountdownTimer=null;
const egyptCities={
Cairo:[30.0444,31.2357],Giza:[30.0131,31.2089],Alexandria:[31.2001,29.9187],"Port Said":[31.2653,32.3019],Suez:[29.9668,32.5498],Ismailia:[30.5965,32.2715],Mansoura:[31.0409,31.3785],Tanta:[30.7865,31.0004],Zagazig:[30.5877,31.5020],Damanhur:[31.0341,30.4682],Damietta:[31.4165,31.8133],Fayoum:[29.3084,30.8428],"Beni Suef":[29.0661,31.0994],Minya:[28.0871,30.7618],Asyut:[27.1809,31.1837],Sohag:[26.5591,31.6957],Qena:[26.1551,32.7160],Luxor:[25.6872,32.6396],Aswan:[24.0889,32.8998],Hurghada:[27.2579,33.8116],"Sharm El Sheikh":[27.9158,34.3300],Arish:[31.1321,33.8033]
};
function parseTime(t){return String(t).split(' ')[0]}
function egyptClockDate(){const now=new Date(),p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now),g=k=>Number(p.find(x=>x.type===k)?.value||0);return new Date(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'))}
function updateNextPrayer(timings){if(prayerCountdownTimer)clearInterval(prayerCountdownTimer);const order=['Fajr','Dhuhr','Asr','Maghrib','Isha'];const tick=()=>{const now=egyptClockDate();let next=null,nextDate=null;for(const k of order){const [h,m]=parseTime(timings[k]).split(':').map(Number),d=new Date(now);d.setHours(h,m,0,0);if(d>now){next=k;nextDate=d;break}}if(!next){next='Fajr';const [h,m]=parseTime(timings.Fajr).split(':').map(Number);nextDate=new Date(now);nextDate.setDate(nextDate.getDate()+1);nextDate.setHours(h,m,0,0)}const ms=nextDate-now,hh=Math.floor(ms/3600000),mm=Math.floor((ms%3600000)/60000),ss=Math.floor((ms%60000)/1000);$('#nextPrayerName').textContent=pNames[next];$('#nextPrayerCountdown').textContent=`متبقي ${hh}س ${mm}د ${ss}ث بتوقيت مصر`;$('#homePrayerTitle').textContent=`الصلاة القادمة في مصر: ${pNames[next]}`;$('#homePrayerText').textContent=`متبقي ${hh} ساعة و${mm} دقيقة`};tick();prayerCountdownTimer=setInterval(tick,1000)}
function rad(x){return x*Math.PI/180}function deg(x){return x*180/Math.PI}function fixAngle(a){return ((a%360)+360)%360}function fixHour(a){return ((a%24)+24)%24}
function cairoOffset(date=new Date()){const p=new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date),g=k=>Number(p.find(x=>x.type===k)?.value||0),asUTC=Date.UTC(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'));return (asUTC-date.getTime())/3600000}
function julianDate(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPosition(jd){const D=jd-2451545.0,g=fixAngle(357.529+0.98560028*D),q=fixAngle(280.459+0.98564736*D),L=fixAngle(q+1.915*Math.sin(rad(g))+0.020*Math.sin(rad(2*g))),e=23.439-0.00000036*D,RA=fixHour(deg(Math.atan2(Math.cos(rad(e))*Math.sin(rad(L)),Math.cos(rad(L))))/15),eqt=q/15-RA,decl=deg(Math.asin(Math.sin(rad(e))*Math.sin(rad(L))));return{decl,eqt}}
function hourAngle(lat,decl,alt){const c=(Math.sin(rad(alt))-Math.sin(rad(lat))*Math.sin(rad(decl)))/(Math.cos(rad(lat))*Math.cos(rad(decl)));return deg(Math.acos(Math.max(-1,Math.min(1,c))))/15}
function fmtHour(h){h=fixHour(h);let hh=Math.floor(h),mm=Math.round((h-hh)*60);if(mm===60){hh=(hh+1)%24;mm=0}return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`}
function localEgyptPrayerTimes(lat,lon,date=new Date()){
 const ep=egyptClockDate(),y=ep.getFullYear(),m=ep.getMonth()+1,d=ep.getDate(),jd=julianDate(y,m,d)-lon/(15*24),s=sunPosition(jd),tz=cairoOffset(date),noon=12-s.eqt+(tz-lon/15),fajr=noon-hourAngle(lat,s.decl,-19.5),sunrise=noon-hourAngle(lat,s.decl,-0.833),maghrib=noon+hourAngle(lat,s.decl,-0.833),isha=noon+hourAngle(lat,s.decl,-17.5),asrAlt=-deg(Math.atan(1/(1+Math.tan(rad(Math.abs(lat-s.decl)))))),asr=noon+hourAngle(lat,s.decl,asrAlt);
 return{Fajr:fmtHour(fajr),Sunrise:fmtHour(sunrise),Dhuhr:fmtHour(noon),Asr:fmtHour(asr),Maghrib:fmtHour(maghrib),Isha:fmtHour(isha)}
}
function localHijri(){try{return new Intl.DateTimeFormat('ar-EG-u-ca-islamic-umalqura',{timeZone:'Africa/Cairo',day:'numeric',month:'long',year:'numeric'}).format(new Date()).replace('هـ','').trim()+' هـ'}catch{return '—'}}
function qiblaBearing(lat,lon){const kaLat=rad(21.422487),kaLon=rad(39.826206),pLat=rad(lat),dLon=kaLon-rad(lon);return fixAngle(deg(Math.atan2(Math.sin(dLon),Math.cos(pLat)*Math.tan(kaLat)-Math.sin(pLat)*Math.cos(dLon))))}
function updateHomePrayerStrip(t){if(!$('#homeNextPrayerName'))return;const now=egyptClockDate(),mins=now.getHours()*60+now.getMinutes(),keys=['Fajr','Dhuhr','Asr','Maghrib','Isha'];let next=keys.find(k=>{const [h,m]=parseTime(t[k]).split(':').map(Number);return h*60+m>mins})||'Fajr';const tm=parseTime(t[next]);$('#homeNextPrayerName').textContent=pNames[next];$('#homeNextPrayerTime').textContent=tm}
function paintPrayer(t,label,lat,lon,hijri,source){const hij=hijri||localHijri();$('#hijriDate').textContent=hij;$('#prayerStatus').textContent=`${label} — بتوقيت مصر — طريقة الهيئة المصرية العامة للمساحة${source==='local'?' (حساب احتياطي داخل الموقع)':''}`;$('#prayerGrid').innerHTML=Object.keys(pNames).map(k=>`<div class="prayer"><b>${pNames[k]}</b><span>${parseTime(t[k])}</span></div>`).join('');updateNextPrayer(t);const bearing=qiblaBearing(lat,lon);$('#qiblaBox').classList.remove('hidden');$('#qiblaDeg').textContent=`${bearing.toFixed(1)}° من الشمال`;$('#qiblaArrow').style.transform=`rotate(${bearing}deg)`;if($('#homeHijriDate'))$('#homeHijriDate').textContent=hij;if($('#homeQiblaDeg'))$('#homeQiblaDeg').textContent=`${bearing.toFixed(0)}°`;updateHomePrayerStrip(t)}
async function renderPrayer(city,label,coords){const [lat,lon]=coords;$('#prayerStatus').textContent='جارٍ تحميل مواقيت '+label+' بتوقيت مصر...';try{const url=`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${lat}&longitude=${lon}&method=5&school=0`,j=await fetchJSON(url),t=j.data.timings,h=`${j.data.date.hijri.day} ${j.data.date.hijri.month.ar} ${j.data.date.hijri.year} هـ`;paintPrayer(t,label,lat,lon,h,'api')}catch{const t=localEgyptPrayerTimes(lat,lon);paintPrayer(t,label,lat,lon,localHijri(),'local')}}
$('#cityPrayerBtn').onclick=()=>{const c=$('#egyptCity'),city=c.value,label=c.options[c.selectedIndex].text,coords=egyptCities[city]||egyptCities.Cairo;localStorage.egyptCity=city;renderPrayer(city,label,coords)};
$('#locateBtn').onclick=()=>{if(!navigator.geolocation)return $('#prayerStatus').textContent='المتصفح لا يدعم تحديد الموقع.';$('#prayerStatus').textContent='جارٍ تحديد موقعك داخل مصر...';navigator.geolocation.getCurrentPosition(pos=>{const{latitude,longitude}=pos.coords;if(latitude<21.5||latitude>32.2||longitude<24||longitude>37.2){$('#prayerStatus').textContent='موقعك الحالي خارج مصر. اختر مدينة مصرية من القائمة لعرض مواقيت مصر.';return}renderPrayer('location','موقعك داخل مصر',[latitude,longitude])},()=>$('#prayerStatus').textContent='تعذر الحصول على الموقع. اختر مدينة مصرية من القائمة.',{enableHighAccuracy:true,timeout:12000})};if(localStorage.egyptCity&&egyptCities[localStorage.egyptCity])$('#egyptCity').value=localStorage.egyptCity;setTimeout(()=>$('#cityPrayerBtn').click(),400);

// -------------------- فوائد / بحث / الصدقة --------------------
$('#benefitList').innerHTML=D.benefits.map((b,i)=>`<article><span class="tag">فائدة ${i+1}</span><p>${b}</p></article>`).join('');$('#duaForFather').onclick=()=>{localStorage.fatherDuas=Number(localStorage.fatherDuas||0)+1;$('#duaThanks').textContent='تقبّل الله دعاءك وجزاك خيرًا.';celebrate('جزاك الله خيرًا على الدعاء 🤲')};
function allSearchItems(){let a=[];Object.entries(D.adhkar).forEach(([c,v])=>v.forEach(x=>a.push(['ذكر — '+c,x[0],x[2]])));Object.entries(D.duas).forEach(([c,v])=>v.forEach(x=>a.push(['دعاء — '+c,x[0],x[1]])));D.hadiths.forEach(h=>a.push(['حديث — '+h[0],h[1],h[2]]));ruqyah.forEach(x=>a.push(['رقية — '+x[0],x[1],x[2]]));return a}const searchItems=allSearchItems();$('#globalSearchBtn').onclick=()=>{$('#searchModal').classList.remove('hidden');setTimeout(()=>$('#globalSearch').focus(),50)};$('#closeSearch').onclick=()=>$('#searchModal').classList.add('hidden');$('#searchModal').onclick=e=>{if(e.target.id==='searchModal')$('#searchModal').classList.add('hidden')};$('#globalSearch').oninput=e=>{let q=e.target.value.trim();$('#searchResults').innerHTML=q?searchItems.filter(x=>x.join(' ').includes(q)).slice(0,35).map(x=>`<article><span class="tag">${x[0]}</span><p>${x[1]}</p><small class="source">${x[2]}</small></article>`).join(''):'<div class="notice">اكتب كلمة للبحث في الأذكار والأدعية والأحاديث والرقية.</div>'};


updateLastReadUI();renderHomeKhatma();const savedMode=localStorage.quranBrowseMode||'page';if(savedMode==='surah')loadQuranSurah(Number(localStorage.lastQuranSurah||1));else if(savedMode==='juz')loadQuranJuz(Number(localStorage.lastQuranJuz||1));else loadQuranPage(qState.page);

// -------------------- V5: عرض المصحف / أسماء الله / أعمال اليوم --------------------
(function initMushafView(){
  const page=$('#mushafPage'), classic=$('#mushafClassic'), comfort=$('#mushafComfort');
  if(!page||!classic||!comfort)return;
  let mode=localStorage.mushafView||'classic', size=Number(localStorage.mushafFont||42);
  const apply=()=>{page.classList.toggle('comfort',mode==='comfort');classic.classList.toggle('active',mode==='classic');comfort.classList.toggle('active',mode==='comfort');page.style.setProperty('--mushaf-font',`${size}px`)};
  classic.onclick=()=>{mode='classic';localStorage.mushafView=mode;apply()};comfort.onclick=()=>{mode='comfort';localStorage.mushafView=mode;apply()};
  $('#fontUp').onclick=()=>{size=Math.min(56,size+2);localStorage.mushafFont=size;apply()};$('#fontDown').onclick=()=>{size=Math.max(28,size-2);localStorage.mushafFont=size;apply()};apply();
})();

const ASMA_FALLBACK=['الله','الرحمن','الرحيم','الملك','القدوس','السلام','المؤمن','المهيمن','العزيز','الجبار','المتكبر','الخالق','البارئ','المصور','الغفار','القهار','الوهاب','الرزاق','الفتاح','العليم','القابض','الباسط','الخافض','الرافع','المعز','المذل','السميع','البصير','الحكم','العدل','اللطيف','الخبير','الحليم','العظيم','الغفور','الشكور','العلي','الكبير','الحفيظ','المقيت','الحسيب','الجليل','الكريم','الرقيب','المجيب','الواسع','الحكيم','الودود','المجيد','الباعث','الشهيد','الحق','الوكيل','القوي','المتين','الولي','الحميد','المحصي','المبدئ','المعيد','المحيي','المميت','الحي','القيوم','الواجد','الماجد','الواحد','الأحد','الصمد','القادر','المقتدر','المقدم','المؤخر','الأول','الآخر','الظاهر','الباطن','الوالي','المتعالي','البر','التواب','المنتقم','العفو','الرؤوف','مالك الملك','ذو الجلال والإكرام','المقسط','الجامع','الغني','المغني','المانع','الضار','النافع','النور','الهادي','البديع','الباقي','الوارث','الرشيد','الصبور'];
let asmaItems=ASMA_FALLBACK.map((name,i)=>({name,number:i+1}));
function renderAsma(filter=''){const grid=$('#asmaGrid');if(!grid)return;const q=filter.trim();grid.innerHTML=asmaItems.filter(x=>!q||x.name.includes(q)||String(x.number)===q).map(x=>`<article class="asma-card"><small>${x.number}</small><b>${x.name}</b></article>`).join('')||'<div class="notice">لا توجد نتيجة مطابقة.</div>'}
renderAsma();if($('#asmaSearch'))$('#asmaSearch').oninput=e=>renderAsma(e.target.value);if($('#randomAsma'))$('#randomAsma').onclick=()=>{const x=asmaItems[Math.floor(Math.random()*asmaItems.length)],box=$('#asmaFeatured');box.classList.remove('hidden');box.innerHTML=`<small>اسم للتدبر اليوم</small><b>${x.name}</b><p>تأمل هذا الاسم، وادعُ الله به بما يناسب حاجتك مع تعظيمه وحسن الظن به.</p>`;box.scrollIntoView({behavior:'smooth',block:'center'})};

function dailyWorksState(){const today=new Date().toISOString().slice(0,10);let s={date:today,done:[]};try{s=JSON.parse(localStorage.dailyWorks||'{}')}catch{}if(s.date!==today)s={date:today,done:[]};return s}
function renderDailyWorks(){const list=$('#dailyWorksList');if(!list||!D.dailyWorks)return;const s=dailyWorksState();list.innerHTML='';D.dailyWorks.forEach((w,i)=>{const done=s.done.includes(i),el=document.createElement('label');el.className='daily-work'+(done?' done':'');el.innerHTML=`<input type="checkbox" ${done?'checked':''}><div><span>${w[0]}</span><small>${w[1]}</small></div>`;el.querySelector('input').onchange=e=>{const st=dailyWorksState(),justDone=e.target.checked&&!st.done.includes(i);if(justDone)st.done.push(i);if(!e.target.checked)st.done=st.done.filter(n=>n!==i);localStorage.dailyWorks=JSON.stringify(st);renderDailyWorks();renderHomeActivity();if(justDone)celebrate('أحسنت، أنجزت مهمة من أعمال اليوم ✓')};list.appendChild(el)});const n=s.done.length,total=D.dailyWorks.length,pct=Math.round(n/total*100);$('#dailyWorksPercent').textContent=pct+'%';$('#dailyWorksDone').textContent=`${n} / ${total}`;$('#dailyWorksBar').style.width=pct+'%'}
renderDailyWorks();if($('#resetDailyWorks'))$('#resetDailyWorks').onclick=()=>{localStorage.removeItem('dailyWorks');renderDailyWorks();renderHomeActivity();toast('تم بدء قائمة يوم جديد')};

// -------------------- V8: سؤال اليوم + نشاط اليوم --------------------
function cairoDateKey(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
function initDailyVisit(){const day=cairoDateKey(),k='siteVisit:'+day;if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,'1');localStorage.setItem(k,String(Number(localStorage.getItem(k)||0)+1))}}
function quizToday(){const items=window.ISLAMIC_QUIZ||[];if(!items.length)return null;const day=cairoDateKey(),seed=day.replaceAll('-','').split('').reduce((a,n)=>a+Number(n),0);return{item:items[seed%items.length],index:seed%items.length,day}}
function quizState(){try{return JSON.parse(localStorage.quizToday||'{}')}catch{return{}}}
function renderQuiz(){
  const q=quizToday();if(!q)return;
  const st=quizState(),done=st.day===q.day;
  if($('#quizCategory'))$('#quizCategory').textContent=q.item.c;
  if($('#homeQuizCategory'))$('#homeQuizCategory').textContent=q.item.c;
  if($('#quizQuestion'))$('#quizQuestion').textContent=q.item.q;
  if($('#homeQuizQuestion'))$('#homeQuizQuestion').textContent=q.item.q;
  if($('#homeQuizHint'))$('#homeQuizHint').textContent=`${q.item.c} — سؤال واحد جديد كل يوم`;
  const renderSet=(optionsSel,resultSel,stateSel)=>{
    const options=$(optionsSel);if(!options)return;
    options.innerHTML=q.item.o.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join('');
    const result=$(resultSel),state=$(stateSel);
    if(result)result.classList.toggle('hidden',!done);
    if(done){
      const ok=st.answer===q.item.a;
      if(result){result.className='quiz-result '+(ok?'correct':'wrong');result.innerHTML=`<b>${ok?'✓ إجابة صحيحة':'✕ الإجابة الصحيحة: '+q.item.o[q.item.a]}</b><p>${q.item.e}</p>`}
      $$(optionsSel+' .quiz-option').forEach(b=>{b.disabled=true;if(Number(b.dataset.i)===q.item.a)b.classList.add('correct');if(Number(b.dataset.i)===st.answer&&st.answer!==q.item.a)b.classList.add('wrong')});
      if(state)state.textContent='تمت الإجابة اليوم';
    }else{
      if(state)state.textContent='سؤال اليوم';
      $$(optionsSel+' .quiz-option').forEach(b=>b.onclick=()=>answerQuiz(Number(b.dataset.i),q));
    }
  };
  renderSet('#quizOptions','#quizResult','#quizDayState');
  renderSet('#homeQuizOptions','#homeQuizResult','#homeQuizDayState');
  renderHomeActivity();
}
function answerQuiz(answer,q=quizToday()){if(!q)return;localStorage.quizToday=JSON.stringify({day:q.day,answer,correct:answer===q.item.a});renderQuiz();if(answer===q.item.a)celebrate('إجابة صحيحة! أحسنت 🌟');else toast('محاولة طيبة — راجع الإجابة الصحيحة وواصل التعلم')}
function renderHomeActivity(){const day=cairoDateKey(),vis=Number(localStorage.getItem('siteVisit:'+day)||1),dw=dailyWorksState(),qs=quizState(),qt=quizToday();if($('#todayVisits'))$('#todayVisits').textContent=vis;if($('#todayTasksDone'))$('#todayTasksDone').textContent=dw.done.length;if($('#todayQuizStatus'))$('#todayQuizStatus').textContent=qt&&qs.day===qt.day?(qs.correct?'✓ صحيحة':'تمت الإجابة'):'لم يُجب'}
initDailyVisit();renderQuiz();renderHomeActivity();if($('#shareQuiz'))$('#shareQuiz').onclick=()=>{const q=quizToday();if(q)shareText(`سؤال اليوم الديني — ${q.item.c}\n${q.item.q}\n${q.item.o.map((x,i)=>`${i+1}) ${x}`).join('\n')}`)};


// V9 reference-skin sidebar share
if($('#sidebarShareBtn'))$('#sidebarShareBtn').onclick=()=>shareText('صدقة جارية على روح سامي كمال عبده مصطفي — قرآن وأذكار وأدعية وأحاديث ومواقيت الصلاة.');


// -------------------- التفسير وعلوم القرآن --------------------
const REVELATION_CONTEXTS={
  '2:144':'وردت الآية في سياق تحويل القبلة إلى المسجد الحرام بعد أن كان المسلمون يتوجهون إلى بيت المقدس. يدل السياق القرآني نفسه على هذا التحول.',
  '8:1':'نزل صدر سورة الأنفال في شأن الأنفال بعد بدر، وبيّن أن أمرها لله والرسول مع الدعوة إلى إصلاح ذات البين.',
  '9:118':'في قصة الثلاثة الذين خُلِّفوا عن غزوة تبوك حتى تاب الله عليهم؛ ومن أشهر من روى القصة كعب بن مالك رضي الله عنه في الصحيحين.',
  '24:11':'هذه بداية آيات حادثة الإفك، وقد جاءت براءة أم المؤمنين عائشة رضي الله عنها في سورة النور، وتفاصيل القصة مروية في الصحيحين.',
  '33:37':'الآية تذكر زيد بن حارثة رضي الله عنه وزواجه ثم زواج النبي ﷺ من زينب بنت جحش، وتبين حكمًا متعلقًا بأدعياء التبنّي.',
  '48:18':'وردت في بيعة الرضوان تحت الشجرة زمن الحديبية، وقد أثنى الله على المؤمنين الذين بايعوا النبي ﷺ.',
  '58:1':'افتتحت سورة المجادلة بذكر المرأة التي جاءت تجادل النبي ﷺ في زوجها وتشتكي إلى الله؛ والمشهور أنها خولة بنت ثعلبة رضي الله عنها.',
  '80:1':'افتتحت سورة عبس بالعتاب في قصة الأعمى الذي جاء يطلب العلم، والمشهور أنه عبد الله بن أم مكتوم رضي الله عنه.'
};
function surahTypeArabic(raw){raw=String(raw||'').toLowerCase();if(raw.includes('meccan')||raw==='makkah')return 'سورة مكية';if(raw.includes('medinan')||raw==='madinah')return 'سورة مدنية';return 'نوع السورة غير متاح الآن'}
function updateSurahKnowledge(ayahs){const box=$('#surahKnowledge');if(!box||!ayahs?.length)return;const seen=[];ayahs.forEach(a=>{if(!seen.some(x=>x.number===a.surah.number))seen.push(a.surah)});box.innerHTML=seen.map(s=>`<span class="surah-knowledge-chip"><b>سورة ${surahNames[s.number-1]}</b> · ${surahTypeArabic(s.revelationType)} · اضغط أي آية للتفسير</span>`).join('')}
function bindTafsirAyahs(ayahs){const byGlobal=new Map(ayahs.map(a=>[String(a.number),a]));$$('.mushaf-ayah').forEach(el=>{const open=()=>{const a=byGlobal.get(el.dataset.global);if(a)openTafsir(a)};el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}})}
async function openTafsir(a){const modal=$('#tafsirModal');if(!modal)return;$('#tafsirRef').textContent=`سورة ${surahNames[a.surah.number-1]} — الآية ${a.numberInSurah}`;$('#tafsirSurahType').textContent=surahTypeArabic(a.surah.revelationType);$('#tafsirAyahText').textContent=a.text;$('#tafsirText').textContent='جارٍ تحميل التفسير الميسر...';const key=`${a.surah.number}:${a.numberInSurah}`,ctx=REVELATION_CONTEXTS[key];$('#revelationContext').textContent=ctx||'لا يوجد في بيانات الموقع سبب أو موضع خاص موثق لهذه الآية. يُكتفى هنا ببيان كون السورة مكية أو مدنية، ولا ننسب سبب نزول بلا مصدر.';modal.classList.remove('hidden');try{const j=await fetchJSON(`https://api.alquran.cloud/v1/ayah/${key}/ar.muyassar`);const t=j?.data?.text;if(t)$('#tafsirText').textContent=t;else throw Error('no tafsir')}catch(e){$('#tafsirText').innerHTML='تعذر تحميل التفسير الآن. أعد المحاولة عند توفر الإنترنت. <small class="source">المصدر: التفسير الميسر عبر Al Quran Cloud.</small>'}}
if($('#closeTafsir'))$('#closeTafsir').onclick=()=>$('#tafsirModal').classList.add('hidden');if($('#tafsirModal'))$('#tafsirModal').onclick=e=>{if(e.target.id==='tafsirModal')e.currentTarget.classList.add('hidden')};

// -------------------- المبشرون بالجنة --------------------
const PROMISED_MEN=[
['أبو بكر الصديق','عبد الله بن أبي قحافة','أول الخلفاء الراشدين، وصاحب النبي ﷺ في الهجرة، ومن أسبق الناس إسلامًا وأعظمهم نصرةً له.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['عمر بن الخطاب','الفاروق','ثاني الخلفاء الراشدين، عُرف بالعدل والقوة في الحق، واتسعت الدولة الإسلامية في خلافته.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['عثمان بن عفان','ذو النورين','ثالث الخلفاء الراشدين، ومن كبار السابقين، جُمع الناس في خلافته على المصحف الإمام.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['علي بن أبي طالب','أبو الحسن','ابن عم النبي ﷺ وصهره ورابع الخلفاء الراشدين، من السابقين إلى الإسلام ومن كبار أهل العلم والشجاعة.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['طلحة بن عبيد الله','القرشي التيمي','من السابقين إلى الإسلام، وكان من المدافعين عن النبي ﷺ يوم أحد.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['الزبير بن العوام','حواري رسول الله ﷺ','من أوائل المسلمين وابن عمة النبي ﷺ، ووصفه النبي ﷺ بأنه حواريه.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['عبد الرحمن بن عوف','الزهري','من السابقين ومن أهل الشورى، عُرف بالتجارة والإنفاق والصدقة.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['سعد بن أبي وقاص','الزهري','من السابقين، وأحد أهل الشورى، وقائد من قادة الفتح، وكان مجاب الدعوة بإذن الله.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['سعيد بن زيد','العدوي','من السابقين إلى الإسلام، وهو راوي من روايات حديث العشرة المبشرين بالجنة.','حديث العشرة المبشرين بالجنة – سنن الترمذي'],
['أبو عبيدة عامر بن الجراح','أمين هذه الأمة','من السابقين، ووصفه النبي ﷺ بأمين هذه الأمة.','حديث العشرة المبشرين بالجنة – سنن الترمذي']
];
const PROMISED_WOMEN=[
['خديجة بنت خويلد رضي الله عنها','أم المؤمنين','أولى زوجات النبي ﷺ وأول من آمن به وواساه ونصره. بُشرت ببيت في الجنة لا صخب فيه ولا نصب.','صحيح البخاري وصحيح مسلم'],
['فاطمة الزهراء رضي الله عنها','بنت رسول الله ﷺ','من أحب أهل بيت النبي ﷺ إليه، وجاءت أحاديث صحيحة في فضلها وأنها سيدة نساء أهل الجنة.','صحيح البخاري وصحيح مسلم'],
['أم سليم رضي الله عنها','الرميصاء أم أنس','صحابية جليلة من الأنصار، ورد في الصحيح أن النبي ﷺ سمع أثر مشيها في الجنة في رؤياه.','صحيح البخاري وصحيح مسلم']
];
function bioCard(x){return `<article class="bio-card"><span class="tag">${x[1]}</span><h3>${x[0]}</h3><p>${x[2]}</p><small class="source">${x[3]}</small></article>`}
function renderPromised(){const m=$('#promisedMenGrid'),w=$('#promisedWomenGrid');if(m&&!m.dataset.done){m.innerHTML=PROMISED_MEN.map(bioCard).join('');m.dataset.done='1'}if(w&&!w.dataset.done){w.innerHTML=PROMISED_WOMEN.map(bioCard).join('');w.dataset.done='1'}}
renderPromised();

// -------------------- الأنبياء المذكورون في القرآن --------------------
const PROPHETS=[
['آدم عليه السلام','أبو البشر','لا يذكر القرآن قومًا أُرسل إليهم باسم مستقل','أول البشر، خلقه الله من طين وأسكنه الجنة ثم هبط إلى الأرض، وهو نبي مكرم.','البقرة 30–39، آل عمران 59'],
['إدريس عليه السلام','نبي صديق','لا يحدد القرآن قومه باسم مستقل','وصفه القرآن بالصدق والنبوة ورفع المكانة.','مريم 56–57، الأنبياء 85'],
['نوح عليه السلام','رسول إلى قومه','قوم نوح','لبث في قومه يدعوهم إلى التوحيد، ونجّاه الله ومن آمن معه في السفينة.','هود 25–49، نوح 1–28'],
['هود عليه السلام','نبي إلى عاد','عاد','دعا عادًا إلى عبادة الله وترك الاستكبار، فأهلك الله المكذبين بريح شديدة.','الأعراف 65–72، هود 50–60'],
['صالح عليه السلام','نبي إلى ثمود','ثمود','دعا ثمود إلى التوحيد، وكانت الناقة آية لهم، فعقرها المكذبون.','الأعراف 73–79، هود 61–68'],
['إبراهيم عليه السلام','خليل الرحمن','قومه وأبوه، ثم دعا في مواطن متعددة','إمام في التوحيد، ابتلاه الله فوفّى، وبنى الكعبة مع ابنه إسماعيل عليهما السلام.','الأنعام 74–83، البقرة 124–129'],
['لوط عليه السلام','رسول','قوم لوط','دعا قومه إلى الطهارة والتوحيد، فنجاه الله وأهله إلا امرأته من العذاب.','الأعراف 80–84، هود 77–83'],
['إسماعيل عليه السلام','رسول نبي','لا يسمي القرآن قومًا مستقلًا له','شارك إبراهيم في رفع قواعد الكعبة، ووصفه القرآن بصدق الوعد والمحافظة على الصلاة والزكاة.','البقرة 125–129، مريم 54–55'],
['إسحاق عليه السلام','نبي','لا يحدد القرآن قومه باسم مستقل','بشر الله به إبراهيم وسارة، ومن ذريته يعقوب والأنبياء من بني إسرائيل.','هود 71–73، الصافات 112–113'],
['يعقوب عليه السلام','إسرائيل','أهله وبنوه','نبي كريم وأبو الأسباط، ضرب القرآن بصبره وحسن ظنه بالله مثالًا في قصة يوسف.','البقرة 132–133، يوسف 83–100'],
['يوسف عليه السلام','الصديق','دعوة في مصر، ولا يسمي القرآن قومًا مستقلًا له','ابتلي ثم مكن الله له في مصر، ودعا إلى التوحيد في السجن وفي حياته.','سورة يوسف'],
['شعيب عليه السلام','نبي إلى مدين','مدين','دعا قومه إلى التوحيد والوفاء بالكيل والميزان وترك الفساد.','الأعراف 85–93، هود 84–95'],
['أيوب عليه السلام','نبي صابر','لا يحدد القرآن قومه باسم مستقل','ابتلاه الله فصبر ودعا ربه، فرد الله عليه عافيته وأهله.','الأنبياء 83–84، ص 41–44'],
['ذو الكفل عليه السلام','من الصابرين','لا يحدد القرآن قومه باسم مستقل','ذكره القرآن مع الصابرين والأخيار، ولا يسرد قصته تفصيلًا.','الأنبياء 85–86، ص 48'],
['موسى عليه السلام','كليم الله','فرعون وملؤه، وبنو إسرائيل','من أكثر الأنبياء ذكرًا في القرآن؛ أرسله الله إلى فرعون، وأنجى به بني إسرائيل.','طه، القصص، الأعراف وغيرها'],
['هارون عليه السلام','نبي ووزير لموسى','فرعون وملؤه، وبنو إسرائيل','أخ موسى ووزيره في الرسالة، شاركه دعوة فرعون ورعاية بني إسرائيل.','طه 29–36، الأعراف 142'],
['داود عليه السلام','نبي وملك','بنو إسرائيل','آتاه الله الزبور والحكمة والملك، وعلّمه صنعة الدروع، واشتهر بالعبادة والعدل.','ص 17–26، الأنبياء 78–80'],
['سليمان عليه السلام','نبي وملك','بنو إسرائيل، ودعا ملكة سبأ وقومها','ورث داود في الملك والنبوة، وسخر الله له الريح والجن وعلّمه منطق الطير.','النمل 15–44، سبأ 12–14'],
['إلياس عليه السلام','رسول','قوم يعبدون بعلًا','دعا قومه إلى تقوى الله وترك عبادة بعل.','الصافات 123–132'],
['اليسع عليه السلام','نبي من الأخيار','لا يحدد القرآن قومه باسم مستقل','ذكره القرآن ضمن الأنبياء الأخيار ولم يفصل قصته.','الأنعام 86، ص 48'],
['يونس عليه السلام','ذو النون','قوم يونس','خرج مغاضبًا فالتقمه الحوت ثم نجاه الله، وآمن قومه فنفعهم إيمانهم.','يونس 98، الصافات 139–148'],
['زكريا عليه السلام','نبي','بنو إسرائيل','دعا ربه أن يرزقه ذرية طيبة فوهبه الله يحيى، وكان قائمًا على محراب مريم.','آل عمران 37–41، مريم 2–15'],
['يحيى عليه السلام','نبي','بنو إسرائيل','آتاه الله الحكم صبيًا ووصفه بالبر والتقوى والطهارة.','مريم 7–15، آل عمران 39'],
['عيسى عليه السلام','المسيح ابن مريم','بنو إسرائيل','رسول من أولي العزم، أيده الله بالبينات، ودعا بني إسرائيل إلى عبادة الله وحده.','آل عمران 45–55، المائدة 110–120'],
['محمد ﷺ','خاتم النبيين','إلى الناس كافة','النبي والرسول الخاتم، أنزل الله عليه القرآن، وأرسله رحمة للعالمين.','الأحزاب 40، الأنبياء 107، سبأ 28']
];
function renderProphets(){const box=$('#prophetsGrid');if(!box)return;const q=($('#prophetSearch')?.value||'').trim();const rows=PROPHETS.filter(x=>!q||x.join(' ').includes(q));box.innerHTML=rows.map(x=>`<article class="bio-card prophet-card"><span class="tag">${x[1]}</span><h3>${x[0]}</h3><div class="prophet-people"><b>القوم/الجهة:</b> ${x[2]}</div><p>${x[3]}</p><small class="source">مواضع قرآنية: ${x[4]}</small></article>`).join('')||'<div class="notice">لا توجد نتائج مطابقة.</div>'}
if($('#prophetSearch'))$('#prophetSearch').oninput=renderProphets;if($('#clearProphetSearch'))$('#clearProphetSearch').onclick=()=>{$('#prophetSearch').value='';renderProphets()};renderProphets();


// ===== V18: الموسوعة الإسلامية + الحكم والمواعظ =====
const ISLAMIC_ENCYCLOPEDIA={
'القرآن الكريم':[
['عدد السور','114 سورة','منها سور مكية ومدنية، وترتيب المصحف يبدأ بالفاتحة وينتهي بالناس.'],
['عدد الأجزاء','30 جزءًا','ويقسم الجزء عادة إلى حزبين، فيكون مجموع الأحزاب 60 حزبًا.'],
['عدد صفحات مصحف المدينة الشائع','604 صفحات','قد يختلف عدد الصفحات باختلاف طبعة المصحف وحجمه.'],
['عدد الآيات','نحو 6236 آية بالعد الكوفي المشهور','تختلف أعداد الآيات قليلًا بين مدارس العد بسبب مواضع الفصل، لا بسبب اختلاف نص القرآن.'],
['سجدات التلاوة','المشهور 14 أو 15 موضعًا بحسب الخلاف الفقهي في العد','لذلك لا يعرض الموقع رقمًا واحدًا على أنه محل اتفاق.'],
['عدد الكلمات والحروف','توجد إحصاءات متعددة بحسب منهج العد','يختلف الرقم باختلاف عد الرسم والهمزات والبسملة وصور الكلمات، لذلك يلزم ذكر منهج العد مع أي رقم تفصيلي.'],
['أول ما نزل من الوحي','صدر سورة العلق: ﴿اقرأ باسم ربك الذي خلق﴾','ثبت في حديث بدء الوحي أن أول ما نزل على النبي ﷺ كان الآيات الأولى من سورة العلق.'],
['من آخر السور نزولًا','سورة النصر','ورد عن ابن عباس أنها آخر سورة كاملة نزلت، مع وجود خلاف في ترتيب بعض الآيات الأخيرة نزولًا.'],
['أطول سورة','سورة البقرة','وهي السورة الثانية في ترتيب المصحف.'],
['أقصر سورة','سورة الكوثر','ثلاث آيات.'],
['أطول آية','آية الدَّين — البقرة 282','تتناول توثيق الديون والكتابة والإشهاد.'],
['السورة التي لا تبدأ بالبسملة','سورة التوبة','تبدأ مباشرة بقوله تعالى: ﴿براءة من الله ورسوله﴾.'],
['سورة فيها بسملتان','سورة النمل','إحداهما في أول السورة، والأخرى في كتاب سليمان عليه السلام: ﴿إنه من سليمان وإنه بسم الله الرحمن الرحيم﴾.'],
['السورة المسماة باسم امرأة','سورة مريم','تحمل اسم مريم عليها السلام، وقد ورد اسمها صريحًا في القرآن.']
],
'أسماء السور ومعانيها':[
['الفاتحة','سميت بذلك لافتتاح المصحف بها','ومن أسمائها أم الكتاب وأم القرآن.'],
['البقرة','سميت لقصة بقرة بني إسرائيل','وردت القصة في الآيات 67–73.'],
['آل عمران','نسبة إلى أسرة عمران','وفيها قصة مريم وعيسى عليهما السلام.'],
['النساء','لكثرة ما فيها من أحكام تتعلق بالنساء والأسرة','وهي من السور المدنية.'],
['المائدة','سميت بالمائدة التي سأل الحواريون عيسى عليه السلام نزولها','ورد ذكرها في أواخر السورة.'],
['الأنفال','الأنفال هي الغنائم','وتتناول السورة جانبًا من أحداث بدر وأحكام الغنائم.'],
['الإسراء','سميت بحدث الإسراء','تبدأ بذكر إسراء النبي ﷺ من المسجد الحرام إلى المسجد الأقصى.'],
['الكهف','سميت بقصة أصحاب الكهف','وتضم كذلك قصة موسى مع العبد الصالح وذي القرنين.'],
['النور','ورد فيها قول الله تعالى: ﴿الله نور السماوات والأرض﴾','وتضم أحكامًا وآدابًا اجتماعية عظيمة.'],
['الفرقان','الفرقان من أسماء القرآن ومعناه ما يفرق بين الحق والباطل','وتبدأ السورة بتمجيد من نزّل الفرقان على عبده.'],
['يس','افتتحت بالحرفين يس','واشتهرت بهذا الاسم من افتتاحها.'],
['الرحمن','افتتحت باسم الله الرحمن','وتكرر فيها قوله تعالى: ﴿فبأي آلاء ربكما تكذبان﴾.'],
['الواقعة','سميت بالواقعة أي القيامة','وتصف أحوال الناس يوم القيامة.'],
['الملك','تبدأ بإثبات ملك الله وقدرته','ومن أسمائها المشهورة تبارك.']
],
'أعلام وقصص القرآن':[
['أصحاب الأخدود','مؤمنون ثبتوا على إيمانهم ففتنهم أصحاب الأخدود بالنار.','سورة البروج 4–10'],
['ذو القرنين','مَكَّن الله له في الأرض، وطاف في جهات منها وأقام سدًا في وجه يأجوج ومأجوج.','سورة الكهف 83–98'],
['العبد الصالح مع موسى','الرجل الذي لقيه موسى عليه السلام ليتعلم منه، والقرآن لم يذكر اسمه صراحة.','سورة الكهف 60–82؛ اشتهر في السنة والتفسير باسم الخضر'],
['لقمان الحكيم','آتاه الله الحكمة، ومن وصاياه لابنه التوحيد والصلاة والصبر والتواضع.','سورة لقمان 12–19'],
['أصحاب الكهف','فتية آمنوا بربهم فزادهم الله هدى، وآواهم إلى الكهف وحفظهم سنين طويلة.','سورة الكهف 9–26'],
['مؤمن آل فرعون','رجل مؤمن من آل فرعون كتم إيمانه ودافع عن موسى بالحجة والموعظة.','سورة غافر 28–45'],
['الرجل الذي جاء من أقصى المدينة','دعا قومه إلى اتباع المرسلين وأعلن إيمانه بهم.','سورة يس 20–27'],
['طالوت','ملك لبني إسرائيل اختاره الله لهم، وقاد المؤمنين في مواجهة جالوت.','سورة البقرة 246–251'],
['جالوت','قائد واجهه جيش طالوت، وقتله داود عليه السلام.','سورة البقرة 249–251'],
['قارون','كان من قوم موسى وبغى عليهم واغتر بماله، فخسف الله به وبداره الأرض.','سورة القصص 76–82'],
['السامري','أضل قومًا من بني إسرائيل بصنع العجل أثناء غياب موسى.','سورة طه 85–97'],
['أصحاب السبت','قوم ابتلوا في أمر الصيد يوم السبت فاعتدى بعضهم.','البقرة 65، الأعراف 163–166'],
['أصحاب الجنة','أصحاب بستان أقسموا ليصرمنه صباحًا دون أن يعطوا المساكين فابتلاهم الله.','سورة القلم 17–33'],
['أصحاب الفيل','جيش قصد الكعبة فأهلكه الله وجعل كيده في تضليل.','سورة الفيل']
],
'نساء في القرآن':[
['مريم عليها السلام','اصطفاها الله وطهرها، وذكر قصتها في آل عمران ومريم وغيرها.','آل عمران 42، سورة مريم'],
['امرأة فرعون','ضرب الله بها مثلًا للذين آمنوا ودعت ربها أن يبني لها بيتًا في الجنة.','التحريم 11'],
['أم موسى','أوحى الله إليها أن ترضع موسى ثم تلقيه في اليم إذا خافت عليه ووعدها برده إليها.','القصص 7–13'],
['أخت موسى','تتبعت خبر أخيها حتى عرفت أمه بمكانه.','القصص 11–12'],
['ملكة سبأ','ذكرت قصتها مع سليمان عليه السلام، وانتهت بإسلامها لله رب العالمين.','النمل 20–44'],
['امرأة العزيز','وردت قصتها في ابتلاء يوسف عليه السلام وعفته.','سورة يوسف 23–35'],
['المجادلة','امرأة اشتكت إلى الله شأن زوجها، فافتتحت سورة المجادلة بذكر سماع الله لقولها.','المجادلة 1–4']
],
'أمهات المؤمنين':[
['خديجة بنت خويلد رضي الله عنها','أول زوجات النبي ﷺ، وأول من آمن به، وساندته في بداية الدعوة.'],
['سودة بنت زمعة رضي الله عنها','من أمهات المؤمنين، تزوجها النبي ﷺ بعد وفاة خديجة.'],
['عائشة بنت أبي بكر رضي الله عنها','من أكثر الصحابة رواية للحديث، وعُرفت بالعلم والفقه.'],
['حفصة بنت عمر رضي الله عنها','ابنة عمر بن الخطاب، وكانت عندها الصحف التي جُمع فيها القرآن قبل نسخ مصاحف عثمان.'],
['زينب بنت خزيمة رضي الله عنها','عُرفت بلقب أم المساكين لكثرة برها وإطعامها.'],
['أم سلمة هند بنت أبي أمية رضي الله عنها','عُرفت برجاحة العقل، وكانت من المهاجرات.'],
['زينب بنت جحش رضي الله عنها','من أمهات المؤمنين، عُرفت بالصدقة والعمل بيدها.'],
['جويرية بنت الحارث رضي الله عنها','من بني المصطلق، وكان في زواجها خير وبركة على قومها.'],
['أم حبيبة رملة بنت أبي سفيان رضي الله عنها','هاجرت إلى الحبشة وثبتت على الإسلام.'],
['صفية بنت حيي رضي الله عنها','من أمهات المؤمنين، تزوجها النبي ﷺ بعد خيبر.'],
['ميمونة بنت الحارث رضي الله عنها','من أمهات المؤمنين، وكانت آخر امرأة تزوجها النبي ﷺ.']
],
'أسرة النبي ﷺ':[
['والده','عبد الله بن عبد المطلب','توفي قبل مولد النبي ﷺ على المشهور.'],
['والدته','آمنة بنت وهب','توفيت والنبي ﷺ صغير.'],
['جده','عبد المطلب','كفله بعد وفاة أمه، ثم انتقلت كفالته بعد وفاة جده إلى عمه أبي طالب.'],
['عمه أبو طالب','كفل النبي ﷺ ونصره عشائريًا في مكة، ولم يثبت دخوله في الإسلام.'],
['عمه حمزة رضي الله عنه','أسلم وصار من كبار المدافعين عن الإسلام، واستشهد يوم أحد.'],
['بناته','زينب، رقية، أم كلثوم، فاطمة رضي الله عنهن','وهن بناته المعروفات من خديجة رضي الله عنها.'],
['أبناؤه','القاسم وعبد الله وإبراهيم','توفوا صغارًا.'],
['فاطمة رضي الله عنها','أصغر بناته على المشهور، وزوج علي بن أبي طالب وأم الحسن والحسين.'],
['الحسن والحسين رضي الله عنهما','سبطا رسول الله ﷺ وابنا علي وفاطمة رضي الله عنهما.']
],
'السيرة النبوية الموسعة':[
['المولد','وُلد النبي محمد ﷺ في مكة في عام الفيل على المشهور.','اختلف أهل السيرة في التحديد الدقيق ليوم الميلاد؛ والمشهور أنه كان في ربيع الأول.'],
['والده','عبد الله بن عبد المطلب','توفي قبل مولد النبي ﷺ على المشهور، فنشأ يتيم الأب.'],
['والدته','آمنة بنت وهب','اعتنت به في طفولته، وتوفيت بالأبواء وهو في نحو السادسة من عمره.'],
['الرضاعة الأولى','تذكر كتب السيرة ثُويبة مولاة أبي لهب ضمن من أرضعنه ﷺ.','تُذكر هذه المعلومة في كتب السيرة، مع تفاوت الروايات في بعض تفاصيلها.'],
['حليمة السعدية','من أشهر مرضعات النبي ﷺ، وعاش مدة في بني سعد في البادية.','ارتبطت مرحلة رضاعته ونشأته الأولى باسم حليمة السعدية في كتب السيرة.'],
['كفالة الجد','كفله جده عبد المطلب بعد وفاة أمه.','ثم توفي جده والنبي ﷺ في نحو الثامنة.'],
['كفالة أبي طالب','انتقلت كفالته بعد وفاة جده إلى عمه أبي طالب.','ظل أبو طالب يحوطه وينصره عشائريًا في مكة.'],
['رعي الغنم','عمل النبي ﷺ في رعي الغنم في شبابه.','ثبت في صحيح البخاري أن الأنبياء رعوا الغنم، وذكر ﷺ أنه رعاها لأهل مكة.'],
['التجارة','اشتغل بالتجارة في شبابه وعُرف بالأمانة.','كانت التجارة من أعمال أهل مكة، واشتهر ﷺ بالصدق والأمانة قبل البعثة.'],
['الصادق الأمين','اشتهر بين قومه بالصدق والأمانة قبل النبوة.','ظهر أثر الثقة به في مواقف من سيرته قبل البعثة.'],
['حلف الفضول','شهد في شبابه حلفًا لنصرة المظلوم بمكة.','ورد عنه ﷺ بعد البعثة ثناء على معنى هذا الحلف ونصرة المظلوم.'],
['زواجه من خديجة','تزوج خديجة بنت خويلد رضي الله عنها قبل البعثة.','كانت أول زوجاته وأول من آمن به وساندته في بداية الوحي.'],
['وضع الحجر الأسود','شارك في حل نزاع قريش عند إعادة بناء الكعبة ووضع الحجر الأسود.','جعل الحجر في ثوب وطلب من زعماء القبائل رفعه، ثم وضعه بيده في موضعه.'],
['الخلوة في حراء','كان يحب الخلوة والتعبد في غار حراء قبل البعثة.','هناك بدأ نزول الوحي عليه ﷺ.'],
['بدء الوحي','نزل جبريل عليه السلام بأول سورة العلق: ﴿اقرأ باسم ربك الذي خلق﴾.','ثبت خبر بدء الوحي في الصحيح.'],
['عمره عند البعثة','بعثه الله وهو ابن أربعين سنة على المشهور.','بدأت الرسالة في مكة واستمرت الدعوة المكية نحو ثلاث عشرة سنة.'],
['أول من آمن','كانت خديجة رضي الله عنها أول من آمن به.','ثم دخل في الإسلام السابقون من أهل بيته وأصحابه.'],
['الدعوة السرية','بدأت الدعوة في مرحلة أولى بصورة محدودة بين الموثوق بهم.','ثم جاء الأمر بالجهر والإنذار العلني.'],
['دار الأرقم','كانت دار الأرقم من المواضع المشهورة لاجتماع المسلمين الأوائل وتعلمهم.','ترتبط بمرحلة بناء الجماعة المسلمة في مكة.'],
['الجهر بالدعوة','جهر النبي ﷺ بدعوة قريش إلى التوحيد.','واجه هو وأصحابه أذىً ومقاومة شديدة.'],
['الهجرة إلى الحبشة','هاجر عدد من الصحابة إلى الحبشة فرارًا بدينهم.','وجدوا عند النجاشي حمايةً وأمانًا.'],
['المقاطعة','حاصرت قريش بني هاشم وبني المطلب اجتماعيًا واقتصاديًا مدة.','كانت من مراحل الشدة في الدعوة المكية.'],
['عام الحزن','توفي أبو طالب وخديجة رضي الله عنها في فترة متقاربة.','كان ذلك من أشد الأعوام على النبي ﷺ.'],
['رحلة الطائف','خرج إلى الطائف يدعو أهلها بعد اشتداد الأذى في مكة.','قوبل بالأذى ثم عاد إلى مكة مستمرًا في الدعوة.'],
['الإسراء والمعراج','أسرى الله بعبده من المسجد الحرام إلى المسجد الأقصى.','ثبت أصل الإسراء في القرآن، والمعراج في السنة؛ ويختلف المؤرخون في تحديد تاريخه الدقيق.'],
['بيعة العقبة الأولى','بايع نفر من أهل يثرب النبي ﷺ على الإسلام والطاعة.','مهّدت البيعة لانتشار الإسلام في المدينة.'],
['مصعب بن عمير في المدينة','أرسل النبي ﷺ مصعبًا ليعلم أهل يثرب الإسلام والقرآن.','كان له أثر بارز في انتشار الإسلام قبل الهجرة.'],
['بيعة العقبة الثانية','بايع جمع أكبر من الأنصار النبي ﷺ على النصرة والحماية.','كانت من المقدمات المباشرة للهجرة.'],
['الهجرة إلى المدينة','هاجر النبي ﷺ مع أبي بكر رضي الله عنه من مكة إلى المدينة.','أشار القرآن إلى صحبة الغار في التوبة 40.'],
['غار ثور','مكث النبي ﷺ وأبو بكر مدة في غار ثور أثناء الهجرة.','ثم واصلا طريقهما إلى المدينة.'],
['قباء','وصل النبي ﷺ إلى قباء أولًا في منطقة المدينة.','ارتبطت هذه المرحلة ببناء مسجد قباء.'],
['المسجد النبوي','بنى النبي ﷺ المسجد في المدينة بعد الهجرة.','صار مركزًا للصلاة والتعليم وإدارة شؤون المجتمع.'],
['المؤاخاة','آخى بين المهاجرين والأنصار.','كان ذلك من وسائل بناء مجتمع متماسك بعد الهجرة.'],
['صحيفة المدينة','نظمت العلاقات بين جماعات المدينة في مرحلة مبكرة.','تعد من الوثائق البارزة في السيرة النبوية.'],
['تحويل القبلة','تحولت القبلة من جهة بيت المقدس إلى الكعبة.','البقرة 142–150.'],
['بدر','2 هـ','أول معركة كبرى مع قريش، وسماها القرآن يوم الفرقان.'],
['أحد','3 هـ','وقعت قرب جبل أحد، واستشهد فيها حمزة رضي الله عنه وعدد من الصحابة.'],
['الخندق','5 هـ','حُفر الخندق لحماية المدينة عند تجمع الأحزاب.'],
['الحديبية','6 هـ','عقد النبي ﷺ صلحًا مع قريش، وسمى القرآن نتيجته فتحًا مبينًا.'],
['خيبر','7 هـ','انتهت بفتح حصون خيبر.'],
['فتح مكة','8 هـ','دخل النبي ﷺ مكة فاتحًا، وأزال الأصنام من حول الكعبة.'],
['حنين','8 هـ','وقعت بعد فتح مكة في مواجهة هوازن وثقيف.'],
['تبوك','9 هـ','من آخر غزوات النبي ﷺ، ووقعت في زمن العسرة.'],
['حجة الوداع','10 هـ','حج النبي ﷺ بالمسلمين وعلّمهم المناسك وألقى خطبًا جامعة.'],
['مرضه الأخير','مرض النبي ﷺ في المدينة في أواخر حياته.','أمر أبا بكر رضي الله عنه أن يصلي بالناس أثناء اشتداد مرضه.'],
['وفاته ﷺ','توفي في المدينة سنة 11 هـ.','ثبت أن وفاته كانت يوم الاثنين، واختلف في تحديد اليوم من ربيع الأول.'],
['مكان دفنه','دُفن ﷺ في حجرة عائشة رضي الله عنها حيث توفي.','صار موضع الحجرة داخل نطاق المسجد النبوي بعد توسعات لاحقة.'],
['شمائله','كان رحيمًا متواضعًا كريمًا شجاعًا حسن المعاملة.','السيرة والسنة مليئتان بأمثلة رحمته وعدله وحسن خلقه.']
],
'الصحابة وخدمة الإسلام':[
['زيد بن حارثة رضي الله عنه','الصحابي الذي ورد اسمه صريحًا في القرآن.','الأحزاب 37'],
['أبو بكر الصديق رضي الله عنه','صاحب النبي ﷺ في الهجرة وأول الخلفاء الراشدين.','التوبة 40 تشير إلى صحبة الغار دون ذكر الاسم صراحة'],
['عمر بن الخطاب رضي الله عنه','ثاني الخلفاء الراشدين، وفي عهده اعتمد التأريخ الهجري.','عُرف بالعدل وقوة الإدارة'],
['عثمان بن عفان رضي الله عنه','ثالث الخلفاء الراشدين، وفي عهده نُسخت المصاحف وأُرسلت إلى الأمصار.','من السابقين إلى الإسلام'],
['علي بن أبي طالب رضي الله عنه','رابع الخلفاء الراشدين، وابن عم النبي ﷺ وزوج فاطمة رضي الله عنها.','من أوائل من أسلم'],
['زيد بن ثابت رضي الله عنه','من كتبة الوحي، وكان له دور بارز في جمع القرآن في الصحف.','عمل في الجمع زمن أبي بكر ثم في نسخ المصاحف زمن عثمان'],
['أبي بن كعب رضي الله عنه','من مشاهير قراء الصحابة ومن كتبة الوحي.','اشتهر بالقراءة والتعليم'],
['بلال بن رباح رضي الله عنه','من أشهر مؤذني النبي ﷺ في المدينة.','ثبتت أحاديث في أذانه مع ابن أم مكتوم'],
['عبد الله بن أم مكتوم رضي الله عنه','كان يؤذن أيضًا للنبي ﷺ في المدينة.','ورد ذكر أذانه في الصحيحين'],
['سلمان الفارسي رضي الله عنه','من كبار الصحابة، واشتهر بمشاركته في الخندق وفكرة حفره في السيرة.','من أهل فارس'],
['مصعب بن عمير رضي الله عنه','من أوائل سفراء الإسلام إلى المدينة قبل الهجرة.','علّم أهلها القرآن والإسلام']
],
'السيرة والغزوات':[
['بعثة النبي ﷺ','بدأ الوحي في مكة وهو في الأربعين من عمره على المشهور.','كان أول ما نزل صدر سورة العلق.'],
['الدعوة في مكة','استمرت نحو ثلاث عشرة سنة','ركزت على التوحيد والإيمان والصبر وبناء الجماعة المؤمنة.'],
['الهجرة إلى المدينة','هاجر النبي ﷺ وأصحابه من مكة إلى المدينة.','صارت الهجرة مبدأ التقويم الهجري لاحقًا في عهد عمر.'],
['غزوة بدر','2 هـ','أول معركة كبرى بين المسلمين وقريش، وسماها القرآن يوم الفرقان.'],
['غزوة أحد','3 هـ','وقعت قرب جبل أحد، وفي أحداثها دروس في الطاعة والثبات.'],
['غزوة الخندق (الأحزاب)','5 هـ','تحزبت قبائل ضد المدينة، وحُفر الخندق لحماية جهتها المكشوفة.'],
['صلح الحديبية','6 هـ','صلح بين المسلمين وقريش، ووصف القرآن نتيجته بالفتح المبين.'],
['غزوة خيبر','7 هـ','انتهت بفتح حصون خيبر.'],
['فتح مكة','8 هـ','دخل النبي ﷺ مكة فاتحًا، وحطم الأصنام حول الكعبة.'],
['غزوة حنين','8 هـ','وقعت بعد فتح مكة ضد هوازن وثقيف.'],
['حصار الطائف','8 هـ','جاء بعد حنين ثم عاد المسلمون دون فتحها في ذلك الوقت.'],
['غزوة تبوك','9 هـ','من آخر غزوات النبي ﷺ، وكانت في ظروف شديدة الحر والعسرة.'],
['حجة الوداع','10 هـ','حج النبي ﷺ بالناس وبيّن لهم كثيرًا من أحكام الحج ومبادئ عامة في خطبته.'],
['وفاة النبي ﷺ','11 هـ','توفي في المدينة بعد أن أدى الرسالة وبلّغ الأمانة.']
],
'الهجرة وبناء المجتمع':[
['غار ثور','اختبأ فيه النبي ﷺ وأبو بكر أثناء الهجرة قبل التوجه إلى المدينة.','وردت إشارة إلى صحبة الغار في التوبة 40.'],
['قباء','كان من أول منازل النبي ﷺ عند قدومه ناحية المدينة.','بُني فيه مسجد قباء.'],
['المؤاخاة','آخى النبي ﷺ بين المهاجرين والأنصار.','أسهمت في تقوية المجتمع الجديد.'],
['المهاجرون','المسلمون الذين هاجروا من مكة وغيرها نصرةً لدينهم.','أثنى القرآن على السابقين من المهاجرين والأنصار.'],
['الأنصار','أهل المدينة الذين آووا ونصروا المهاجرين والنبي ﷺ.','ورد الثناء عليهم في الحشر 9 والتوبة 100.'],
['صحيفة المدينة','نظمت العلاقات بين جماعات المدينة في المرحلة الأولى.','تعد من الوثائق المهمة في السيرة النبوية.'],
['تحويل القبلة','تحولت القبلة من جهة بيت المقدس إلى الكعبة.','البقرة 142–150.']
],
'المساجد والتاريخ':[
['المسجد الحرام','مكة المكرمة','أعظم المساجد، وفيه الكعبة قبلة المسلمين.'],
['المسجد النبوي','المدينة المنورة','بناه النبي ﷺ بعد الهجرة، وفيه حجرته الشريفة.'],
['المسجد الأقصى','القدس','مسرى النبي ﷺ وأولى القبلتين.'],
['مسجد قباء','المدينة المنورة','من أقدم مساجد الإسلام، وورد في القرآن الثناء على مسجد أسس على التقوى من أول يوم.'],
['المساجد الثلاثة','المسجد الحرام والمسجد النبوي والمسجد الأقصى','وردت السنة بخصوصية شد الرحال إلى هذه المساجد الثلاثة.'],
['الكعبة','البيت الحرام وقبلة المسلمين','رفع إبراهيم وإسماعيل عليهما السلام قواعد البيت كما في البقرة 127.'],
['مقام إبراهيم','من آيات البيت البينات','أمر القرآن باتخاذ مقام إبراهيم مصلى في البقرة 125.'],
['التقويم الهجري','اعتمد في خلافة عمر بن الخطاب رضي الله عنه','جُعلت هجرة النبي ﷺ مبدأً للتأريخ، والسنة الهجرية قمرية.'],
['جمع القرآن','جُمع في صحف في عهد أبي بكر، ثم نُسخت المصاحف وأُرسلت للأمصار في عهد عثمان رضي الله عنهما','كان ذلك حفظًا لاجتماع المسلمين على المصحف.']
],
'الخلفاء والفتوحات':[
['أبو بكر الصديق رضي الله عنه','11–13 هـ','ثبّت الدولة بعد وفاة النبي ﷺ وواجه حروب الردة، وبدأت في عهده تحركات الفتح خارج الجزيرة.'],
['عمر بن الخطاب رضي الله عنه','13–23 هـ','اتسعت الدولة في عهده، ودخلت مناطق واسعة من الشام والعراق ومصر تحت حكم المسلمين.'],
['عثمان بن عفان رضي الله عنه','23–35 هـ','استمرت الفتوحات واتسع النشاط البحري، وجمع المسلمين على المصاحف العثمانية.'],
['علي بن أبي طالب رضي الله عنه','35–40 هـ','واجه مرحلة داخلية شديدة الاضطراب وحافظ على أصول الخلافة والعدل بحسب اجتهاده.'],
['اليرموك','من المعارك الكبرى في فتح الشام','كانت نقطة فاصلة في مواجهة الدولة البيزنطية.'],
['القادسية','من المعارك الكبرى في فتح العراق','كانت من المحطات البارزة في مواجهة الدولة الساسانية.'],
['فتح مصر','تم في خلافة عمر بن الخطاب رضي الله عنه','قاد الجيوش عمرو بن العاص رضي الله عنه.'],
['عمرو بن العاص رضي الله عنه','من قادة الفتح الإسلامي','ارتبط اسمه بفتح مصر وتأسيس الفسطاط.'],
['خالد بن الوليد رضي الله عنه','قائد عسكري من كبار الصحابة','شارك في معارك كثيرة في الجزيرة والعراق والشام.'],
['أبو عبيدة بن الجراح رضي الله عنه','من كبار قادة الشام ومن العشرة المبشرين بالجنة.','اشتهر بالأمانة والزهد.']
]
};
const RELIGIOUS_WISDOM={
'من القرآن':[
['الصبر','﴿إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾','البقرة: 153'],
['الشكر','﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾','إبراهيم: 7'],
['التوكل','﴿وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ﴾','الطلاق: 3'],
['حسن القول','﴿وَقُولُوا لِلنَّاسِ حُسْنًا﴾','البقرة: 83'],
['الأمل','﴿لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾','الزمر: 53'],
['العدل','﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالإِحْسَانِ﴾','النحل: 90'],
['العفو','﴿وَلْيَعْفُوا وَلْيَصْفَحُوا﴾','النور: 22'],
['الاستعانة','﴿وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ﴾','البقرة: 45'],
['بر الوالدين','﴿وَبِالْوَالِدَيْنِ إِحْسَانًا﴾','الإسراء: 23'],
['المسارعة للخير','﴿فَاسْتَبِقُوا الْخَيْرَاتِ﴾','البقرة: 148']
],
'من السنة':[
['الرفق','«إن الرفق لا يكون في شيء إلا زانه»','صحيح مسلم'],
['الخير أو الصمت','«من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت»','صحيح البخاري وصحيح مسلم'],
['الرحمة','«الراحمون يرحمهم الرحمن»','سنن الترمذي — حديث حسن صحيح'],
['القوة النافعة','«المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير»','صحيح مسلم'],
['دوام العمل','«أحب الأعمال إلى الله أدومها وإن قل»','صحيح البخاري وصحيح مسلم'],
['الكلمة الطيبة','«والكلمة الطيبة صدقة»','صحيح البخاري وصحيح مسلم'],
['التيسير','«يسروا ولا تعسروا، وبشروا ولا تنفروا»','صحيح البخاري وصحيح مسلم'],
['المعروف','«لا تحقرن من المعروف شيئًا»','صحيح مسلم']
],
'من سير الأنبياء':[
['نوح عليه السلام','الثبات على الدعوة لا يُقاس بسرعة النتائج؛ فقد طال بلاؤه واستمر في البلاغ.','حكمة مستفادة من قصته في القرآن'],
['إبراهيم عليه السلام','اليقين بالله يجعل المؤمن ثابتًا أمام الابتلاء وضغط المجتمع.','حكمة مستفادة من سيرته في القرآن'],
['يوسف عليه السلام','العفة والصبر والإحسان قد تفتح بعد الشدة أبوابًا لم تكن في الحسبان.','حكمة مستفادة من سورة يوسف'],
['موسى عليه السلام','طلب العلم يحتاج تواضعًا وصبرًا، كما في رحلته إلى العبد الصالح.','حكمة مستفادة من سورة الكهف'],
['أيوب عليه السلام','البلاء لا يمنع حسن الظن بالله والدعاء والرجوع إليه.','حكمة مستفادة من سورة الأنبياء وص'],
['يونس عليه السلام','الرجوع إلى الله والاعتراف بالتقصير باب عظيم للفرج.','حكمة مستفادة من الأنبياء 87–88'],
['سليمان عليه السلام','النعمة تحتاج شكرًا ونسبة الفضل إلى الله لا إلى النفس.','حكمة مستفادة من النمل 40'],
['يعقوب عليه السلام','الحزن لا يناقض الصبر الجميل ولا يمنع الرجاء في الله.','حكمة مستفادة من سورة يوسف']
],
'من سير الصحابة':[
['أبو بكر الصديق رضي الله عنه','الصداقة الصادقة تظهر في ساعة الشدة، كما ظهرت صحبته للنبي ﷺ في الهجرة.','حكمة مستفادة من السيرة'],
['عمر بن الخطاب رضي الله عنه','القوة إذا اقترنت بالعدل والرقابة على النفس أصبحت حماية للضعيف لا أداة عليه.','حكمة مستفادة من سيرته'],
['عثمان بن عفان رضي الله عنه','الحياء لا يمنع المبادرة والعطاء، والمال إذا سُخّر للخير يتحول إلى أثر باق.','حكمة مستفادة من سيرته'],
['علي بن أبي طالب رضي الله عنه','العلم والشجاعة يحتاجان إلى تقوى حتى يكون أثرهما نافعًا.','حكمة مستفادة من سيرته'],
['بلال رضي الله عنه','الثبات على الإيمان يرفع صاحبه ولو كان المجتمع يزدري أصله أو حاله.','حكمة مستفادة من سيرته'],
['مصعب بن عمير رضي الله عنه','قد يترك الإنسان رفاهيته من أجل مبدأ يؤمن به، فيكون أثره في غيره أعظم من راحته الشخصية.','حكمة مستفادة من سيرته'],
['سلمان الفارسي رضي الله عنه','البحث الصادق عن الحق قد يكون رحلة طويلة، لكن الصدق يهدي صاحبه إلى مقصده.','حكمة مستفادة من سيرته'],
['أبو عبيدة رضي الله عنه','الأمانة ليست كلمة تقال، بل مسؤولية تظهر في المال والقيادة والقرار.','حكمة مستفادة من سيرته']
],
'من وصايا لقمان':[
['التوحيد','ابدأ إصلاح القلب بتعظيم حق الله وترك الشرك.','لقمان 13'],
['بر الوالدين','الشكر لله يقترن بالإحسان للوالدين مع بقاء الطاعة لله أولًا.','لقمان 14–15'],
['مراقبة الله','العمل الصغير لا يضيع، فالله يأتي به ويعلم مكانه.','لقمان 16'],
['الصلاة','إقامة الصلاة أساس عملي متكرر في تربية النفس.','لقمان 17'],
['الإصلاح','الأمر بالمعروف والنهي عن المنكر يحتاج علمًا وحكمة وصبرًا.','لقمان 17'],
['الصبر','الصبر على ما يصيب الإنسان من عزم الأمور.','لقمان 17'],
['التواضع','لا تصعّر خدك للناس ولا تمش في الأرض مرحًا، واقصد في مشيك واغضض من صوتك.','لقمان 18–19']
],
'حكم تربوية':[
['الإخلاص','قيمة العمل عند الله مرتبطة بصدق النية، فاجعل الخفاء موطنًا لعبادات لا يعلمها إلا الله.','حكمة تربوية'],
['الوقت','ما مضى لا يعود؛ فاجعل لك كل يوم نصيبًا من قرآن وذكر وعمل صالح.','حكمة تربوية'],
['اللسان','قبل أن تتكلم اسأل: هل في الكلام خير، وهل يحتاج أن يقال الآن؟','حكمة تربوية مستفادة من آداب السنة'],
['التواضع','كلما زاد علم الإنسان ازداد إدراكه لحاجته إلى التعلم.','حكمة تربوية'],
['الإحسان','لا تحتقر معروفًا صغيرًا؛ فقد يكون أثره في قلب إنسان أكبر مما تتصور.','حكمة تربوية'],
['العادة','العمل الصغير المستمر غالبًا أبقى أثرًا من اندفاع كبير ينقطع سريعًا.','حكمة تربوية'],
['الاختلاف','فرّق بين الاختلاف في الرأي والخصومة في القلب؛ فالأدب يحفظ الود.','حكمة تربوية'],
['المحاسبة','راجع يومك قبل نومك: ماذا أصلحت، وما الذي تحتاج أن تتوب منه أو تعالجه غدًا؟','حكمة تربوية'],
['الصحبة','اختر من يعينك على الطاعة والصدق لا من يزين لك الغفلة.','حكمة تربوية'],
['العلم والعمل','المعلومة التي لا تغيّر سلوكًا تبقى ناقصة الأثر؛ اجعل لكل علم ثمرة عملية.','حكمة تربوية']
]
};
const DAILY_KNOWLEDGE=[
['هل تعلم من السيرة؟','رعى النبي ﷺ الغنم في شبابه، وثبت عنه أن الأنبياء رعوا الغنم.','صحيح البخاري'],
['هل تعلم من السيرة؟','بدأ الوحي على النبي ﷺ في غار حراء بأول آيات سورة العلق.','صحيح البخاري — حديث بدء الوحي'],
['هل تعلم من السيرة؟','كان مصعب بن عمير رضي الله عنه من أوائل من أُرسل لتعليم أهل المدينة القرآن والإسلام قبل الهجرة.','كتب السيرة'],
['هل تعلم من السيرة؟','توفي النبي ﷺ في المدينة سنة 11 هـ، وثبت أن وفاته كانت يوم الاثنين.','صحيح البخاري وصحيح مسلم'],
['هل تعلم؟','زيد بن حارثة رضي الله عنه هو الصحابي الذي ورد اسمه صريحًا في القرآن.','الأحزاب 37'],
['هل تعلم؟','سورة النمل فيها بسملتان: في أول السورة وفي كتاب سليمان عليه السلام.','النمل 30'],
['هل تعلم؟','أطول آية في القرآن هي آية الدَّين في سورة البقرة.','البقرة 282'],
['هل تعلم؟','أصحاب الكهف كانوا فتية آمنوا بربهم فزادهم الله هدى.','الكهف 13'],
['هل تعلم؟','لقمان أوصى ابنه بالتوحيد والصلاة والصبر والتواضع.','لقمان 12–19'],
['هل تعلم؟','القرآن ذكر صحبة الغار في الهجرة في سورة التوبة.','التوبة 40'],
['هل تعلم؟','مسجد قباء من أقدم مساجد الإسلام، وورد الثناء على مسجد أسس على التقوى من أول يوم.','التوبة 108'],
['هل تعلم؟','تحولت قبلة المسلمين إلى الكعبة بأمر الله كما جاء في سورة البقرة.','البقرة 142–150'],
['هل تعلم؟','القرآن يضم 114 سورة و30 جزءًا.','ترتيب المصحف'],
['هل تعلم؟','سورة الكهف تجمع قصص الفتية وموسى مع العبد الصالح وذي القرنين.','سورة الكهف'],
['هل تعلم؟','سورة مريم تحمل اسم مريم عليها السلام، وذكرت قصتها وقصة عدد من الأنبياء.','سورة مريم'],
['هل تعلم؟','سورة النصر من آخر السور الكاملة نزولًا على قول قوي مروي عن ابن عباس.','سورة النصر']
];
let encyclopediaCat=Object.keys(ISLAMIC_ENCYCLOPEDIA)[0],wisdomCat=Object.keys(RELIGIOUS_WISDOM)[0];
function renderEncyclopedia(cat=encyclopediaCat){encyclopediaCat=cat;const tabs=$('#encyclopediaTabs'),grid=$('#encyclopediaGrid');if(!tabs||!grid)return;tabs.innerHTML=Object.keys(ISLAMIC_ENCYCLOPEDIA).map(k=>`<button class="${k===cat?'active':''}" data-enc="${k}">${k}</button>`).join('');tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>renderEncyclopedia(b.dataset.enc));grid.innerHTML=ISLAMIC_ENCYCLOPEDIA[cat].map(x=>`<article class="bio-card encyclopedia-card"><span class="tag">${cat}</span><h3>${x[0]}</h3><b class="ency-value">${x[1]}</b>${x[2]?`<p>${x[2]}</p>`:''}</article>`).join('')}
function renderWisdom(cat=wisdomCat){wisdomCat=cat;const tabs=$('#wisdomTabs'),grid=$('#wisdomGrid');if(!tabs||!grid)return;tabs.innerHTML=Object.keys(RELIGIOUS_WISDOM).map(k=>`<button class="${k===cat?'active':''}" data-wis="${k}">${k}</button>`).join('');tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>renderWisdom(b.dataset.wis));grid.innerHTML=RELIGIOUS_WISDOM[cat].map(x=>`<article class="wisdom-card"><span class="tag">${x[0]}</span><p>${x[1]}</p><small class="source">${x[2]}</small></article>`).join('')}
function renderDailyKnowledge(){const box=$('#dailyKnowledgeBox');if(!box)return;const d=new Date();const key=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);const item=DAILY_KNOWLEDGE[key%DAILY_KNOWLEDGE.length];$('#dailyKnowledgeTitle').textContent=item[0];$('#dailyKnowledgeText').textContent=item[1];$('#dailyKnowledgeSource').textContent=item[2]||''}
renderEncyclopedia();renderWisdom();renderDailyKnowledge();


// ==================== V20: رحلة المسلم اليومية (إضافات فقط) ====================
const V20_CHALLENGES=[
['استغفار اليوم','استغفر الله 33 مرة بنية صادقة.'],['الصلاة على النبي ﷺ','صلِّ على النبي ﷺ عشر مرات.'],['صلة رحم','تواصل اليوم مع قريب أو اسأل عن أحد من أهلك.'],['صدقة ولو قليلة','قدّم صدقة أو معروفًا ولو يسيرًا.'],['دعاء للوالدين','خصص دقيقة للدعاء لوالديك أحياءً وأمواتًا.'],['قراءة القرآن','اقرأ صفحتين على الأقل من كتاب الله.'],['حفظ اللسان','اجعل تحديك اليوم ترك الغيبة والكلمة المؤذية.']
];
const V20_GOOD_DEEDS=[
['كلمة طيبة','قل اليوم كلمة طيبة تشجع بها شخصًا أو تدخل السرور على قلبه.'],
['إزالة أذى','أزل شيئًا مؤذيًا من طريق الناس أو من مكان يستخدمه الآخرون.'],
['مساعدة شخص','قدّم مساعدة عملية لشخص يحتاجها ولو كانت بسيطة.'],
['صلة رحم','اسأل عن قريب لم تتواصل معه منذ مدة واطمئن عليه.'],
['صدقة خفية','تصدّق اليوم بما تستطيع، ولو بالقليل، واجعلها بينك وبين الله.'],
['إطعام أو سقاية','قدّم طعامًا أو ماءً لإنسان أو عامل أو محتاج.'],
['بر الوالدين','قدّم اليوم خدمة أو كلمة إحسان لوالديك، أو ادعُ لهما إن كانا متوفَّيين.'],
['إصلاح بين اثنين','إن استطعت، قرّب وجهات النظر أو ابدأ أنت بالسلام وإنهاء خصومة.'],
['الدعاء لمسلم بظهر الغيب','اختر شخصًا وادعُ له بخير دون أن تخبره.'],
['شكر صاحب فضل','اشكر شخصًا أحسن إليك أو كان له فضل عليك.']
];
const V20_PEOPLE=[
['أبو بكر الصديق رضي الله عنه','أول الخلفاء الراشدين وصاحب النبي ﷺ في الهجرة، عُرف بالصدق والثبات والبذل.','الدرس: الصدق والثبات وقت الشدة.'],
['عمر بن الخطاب رضي الله عنه','ثاني الخلفاء الراشدين، عُرف بالعدل والقوة في الحق وخدمة الرعية.','الدرس: العدل أمانة ومسؤولية.'],
['عثمان بن عفان رضي الله عنه','ثالث الخلفاء الراشدين، ذو النورين، ومن أشهر من بذل ماله في مصالح المسلمين.','الدرس: الحياء والبذل من أجل الخير.'],
['علي بن أبي طالب رضي الله عنه','رابع الخلفاء الراشدين، ابن عم النبي ﷺ وزوج فاطمة رضي الله عنها، عُرف بالشجاعة والعلم.','الدرس: اجمع بين العلم والعمل والشجاعة.'],
['مريم عليها السلام','اصطفاها الله وطهّرها، وذكر قصتها في القرآن مثالًا للعفة والعبادة والصبر.','الدرس: الثبات وحسن التوكل عند الابتلاء.'],
['لقمان الحكيم','ذكر القرآن وصاياه لابنه في التوحيد والصلاة والصبر والتواضع وحسن الخلق.','الدرس: التربية تبدأ بالعقيدة ثم العبادة والأخلاق.'],
['ذو القرنين','عبد صالح مكن الله له في الأرض، وسعى بالعدل وأقام السد حمايةً للمستضعفين.','الدرس: القوة نعمة إذا استعملت في العدل والإصلاح.']
];
const V20_REFLECTIONS=[
['وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ','الطلاق: 3','التوكل ليس ترك الأسباب؛ بل بذل السبب مع اعتماد القلب على الله.'],
['إِنَّ مَعَ الْعُسْرِ يُسْرًا','الشرح: 6','لا تجعل الشدة تغلق باب الرجاء؛ فمع العسر وعدٌ باليسر.'],
['وَقُولُوا لِلنَّاسِ حُسْنًا','البقرة: 83','الكلمة الطيبة عبادة وأثرها قد يبقى في قلب الإنسان طويلًا.'],
['لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ','إبراهيم: 7','درّب نفسك على ملاحظة النعم وشكر الله عليها قولًا وعملًا.'],
['إِنَّ اللَّهَ مَعَ الصَّابِرِينَ','البقرة: 153','الصبر عبادة واعية: ثبات على الطاعة وترك للمعصية واحتمال للابتلاء.'],
['وَبِالْوَالِدَيْنِ إِحْسَانًا','الإسراء: 23','الإحسان للوالدين ليس مناسبة؛ بل خلق يومي في القول والفعل والدعاء.']
];
function v20DayIndex(len){const k=cairoDateKey().replaceAll('-','').split('').reduce((a,n)=>a+Number(n),0);return k%len}
function v20Key(n){return `v20:${cairoDateKey()}:${n}`}
function v20Done(n){return localStorage.getItem(v20Key(n))==='1'}
function v20Set(n,val=true){if(val)localStorage.setItem(v20Key(n),'1');else localStorage.removeItem(v20Key(n))}
function v20JourneyState(){const q=quizToday(),qs=quizState();return[
 {id:'ayah',icon:'📖',title:'آية اليوم',done:v20Done('ayah'),action:()=>{document.querySelector('#daily')?.scrollIntoView({behavior:'smooth'});v20Set('ayah');renderV20()}},
 {id:'hadith',icon:'📜',title:'حديث اليوم',done:v20Done('hadith'),action:()=>{document.querySelector('#daily')?.scrollIntoView({behavior:'smooth'});v20Set('hadith');renderV20()}},
 {id:'dhikr',icon:'📿',title:'ذكر اليوم',done:v20Done('dhikr'),action:()=>{document.querySelector('#daily')?.scrollIntoView({behavior:'smooth'});v20Set('dhikr');renderV20()}},
 {id:'quiz',icon:'❓',title:'سؤال اليوم',done:!!(q&&qs.day===q.day),action:()=>document.querySelector('.home-quiz-live')?.scrollIntoView({behavior:'smooth'})},
 {id:'good',icon:'❤️',title:'عمل صالح',done:v20Done('good'),action:()=>document.querySelector('#v20GoodDeedCard')?.scrollIntoView({behavior:'smooth',block:'center'})}
]}
function v20UpdateStreak(allDone){const today=cairoDateKey();let st={last:'',count:0,best:0};try{st=JSON.parse(localStorage.v20Streak||'{}')}catch{};if(allDone&&st.last!==today){const d=new Date(today+'T12:00:00'),y=new Date(d);y.setDate(y.getDate()-1);const prev=y.toISOString().slice(0,10);st.count=st.last===prev?(Number(st.count)||0)+1:1;st.last=today;st.best=Math.max(Number(st.best)||0,st.count);localStorage.v20Streak=JSON.stringify(st)}return st}
function renderV20(){if(!$('#v20JourneySteps'))return;const steps=v20JourneyState(),done=steps.filter(x=>x.done).length;$('#v20JourneyScore').textContent=`${done}/5`;$('#v20JourneyBar').style.width=`${done*20}%`;$('#v20JourneySteps').innerHTML=steps.map(x=>`<button class="v20-step ${x.done?'done':''}" data-v20="${x.id}"><span>${x.done?'✓':x.icon}</span><b>${x.title}</b><small>${x.done?'تمت':'ابدأ'}</small></button>`).join('');$('#v20JourneySteps').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>steps[i].action());const st=v20UpdateStreak(done===5);$('#v20Streak').textContent=st.count||0;$('#v20JourneyMessage').textContent=done===5?'🌟 ما شاء الله — أتممت وردك اليومي. تقبّل الله منك.':`باقي ${5-done} من خطوات ورد اليوم.`;if(done===5&&!sessionStorage.v20Celebrated){sessionStorage.v20Celebrated='1';celebrate('ما شاء الله — أتممت وردك اليومي 🌟')}
 const ch=V20_CHALLENGES[v20DayIndex(V20_CHALLENGES.length)];$('#v20ChallengeTitle').textContent=ch[0];$('#v20ChallengeText').textContent=ch[1];$('#v20ChallengeDone').textContent=v20Done('challenge')?'✓ تم تحدي اليوم':'✓ أتممت التحدي';$('#v20ChallengeDone').disabled=v20Done('challenge');
 const goodChoices=V20_GOOD_DEEDS.filter(x=>x[0]!==ch[0]);const gd=goodChoices[(v20DayIndex(goodChoices.length)+3)%goodChoices.length];$('#v20GoodDeedTitle').textContent=gd[0];$('#v20GoodDeedText').textContent=gd[1];$('#v20GoodDeedDone').textContent=v20Done('good')?'✓ تم عمل اليوم':'✓ أتممت العمل';$('#v20GoodDeedDone').disabled=v20Done('good');
 const person=V20_PEOPLE[v20DayIndex(V20_PEOPLE.length)];$('#v20PersonName').textContent=person[0];$('#v20PersonText').textContent=person[1];$('#v20PersonLesson').textContent=person[2];const r=V20_REFLECTIONS[v20DayIndex(V20_REFLECTIONS.length)];$('#v20ReflectAyah').textContent=r[0];$('#v20ReflectRef').textContent=r[1];$('#v20ReflectLesson').textContent=r[2];renderV20Badges(done,st)}
function renderV20Badges(done,st){const page=Number(localStorage.lastQuranPage||1),duas=Number(localStorage.fatherDuas||0),qs=quizState(),q=quizToday();const badges=[['🌱','بداية طيبة',done>=1],['⭐','ورد كامل',done===5],['🔥','ثلاثة أيام',Number(st.count)>=3],['📖','قارئ مستمر',page>=10],['🤲','الدعاء للوالدين',duas>=1],['🧠','متعلم اليوم',!!(q&&qs.day===q.day)]];$('#v20Badges').innerHTML=badges.map(b=>`<div class="v20-badge ${b[2]?'earned':''}"><span>${b[0]}</span><b>${b[1]}</b><small>${b[2]?'تم الإنجاز':'لم يتحقق بعد'}</small></div>`).join('')}
if($('#v20ChallengeDone'))$('#v20ChallengeDone').onclick=()=>{v20Set('challenge');celebrate('أحسنت — أتممت تحدي اليوم ❤️');renderV20()};
if($('#v20GoodDeedDone'))$('#v20GoodDeedDone').onclick=()=>{v20Set('good');celebrate('تقبّل الله منك — أتممت عمل اليوم الصالح ❤️');renderV20()};
if($('#v20ResetToday'))$('#v20ResetToday').onclick=()=>{['ayah','hadith','dhikr','challenge','good'].forEach(x=>v20Set(x,false));sessionStorage.removeItem('v20Celebrated');renderV20();toast('تم بدء ورد اليوم من جديد')};
function v20Search(){const q=$('#v20SearchInput').value.trim(),box=$('#v20SearchResults');if(q.length<2)return toast('اكتب كلمتين على الأقل');let out=[];const add=(type,title,text,source='')=>{if((title+' '+text+' '+source).includes(q))out.push({type,title,text,source})};Object.entries(D.adhkar||{}).forEach(([c,a])=>a.forEach(x=>add('ذكر',c,x[0],x[2])));Object.entries(D.duas||{}).forEach(([c,a])=>a.forEach(x=>add('دعاء',c,x[0],x[1])));(D.hadiths||[]).forEach(x=>add('حديث',x[0],x[1],x[2]));Object.entries(window.ISLAMIC_ENCYCLOPEDIA||{}).forEach(([c,a])=>a.forEach(x=>add('الموسوعة',x[0],x[1]+' '+(x[2]||''),c)));Object.entries(window.RELIGIOUS_WISDOM||{}).forEach(([c,a])=>a.forEach(x=>add('حكمة',x[0],x[1],x[2]||c)));box.classList.remove('hidden');box.innerHTML=out.length?out.slice(0,40).map(x=>`<article><span class="tag">${x.type}</span><h4>${x.title}</h4><p>${x.text}</p><small>${x.source}</small></article>`).join(''):'<div class="notice">لا توجد نتائج داخل محتوى الموقع. جرّب كلمة أخرى.</div>'}
if($('#v20SearchBtn'))$('#v20SearchBtn').onclick=v20Search;if($('#v20SearchInput'))$('#v20SearchInput').onkeydown=e=>{if(e.key==='Enter')v20Search()};
// اجعل إتمام سؤال اليوم ينعكس فورًا على رحلة اليوم دون تغيير منطق السؤال الأصلي
const _v20AnswerQuiz=answerQuiz;answerQuiz=function(answer,q=quizToday()){_v20AnswerQuiz(answer,q);setTimeout(renderV20,0)};
renderV20();

// ===== V21: أدوات التفاعل اليومية — إضافات فقط =====
const V21_QUIZ=[
{c:'القرآن',q:'كم عدد سور القرآن الكريم؟',o:['110','112','114','120'],a:2,e:'القرآن الكريم يتكون من 114 سورة.'},
{c:'القرآن',q:'ما أطول سورة في القرآن؟',o:['آل عمران','البقرة','النساء','الأعراف'],a:1,e:'سورة البقرة هي أطول سور القرآن الكريم.'},
{c:'الأنبياء',q:'من النبي الذي ابتلعه الحوت؟',o:['يونس عليه السلام','أيوب عليه السلام','هود عليه السلام','صالح عليه السلام'],a:0,e:'هو نبي الله يونس عليه السلام.'},
{c:'السيرة',q:'إلى أي مدينة هاجر النبي ﷺ من مكة؟',o:['الطائف','المدينة المنورة','القدس','بدر'],a:1,e:'هاجر النبي ﷺ إلى المدينة المنورة.'},
{c:'الصحابة',q:'من أول الخلفاء الراشدين؟',o:['عمر بن الخطاب','علي بن أبي طالب','أبو بكر الصديق','عثمان بن عفان'],a:2,e:'أبو بكر الصديق رضي الله عنه هو أول الخلفاء الراشدين.'},
{c:'القرآن',q:'أي سورة تسمى أم الكتاب؟',o:['الفاتحة','الإخلاص','يس','الملك'],a:0,e:'سورة الفاتحة من أسمائها أم الكتاب.'},
{c:'الأنبياء',q:'من النبي الذي صنع السفينة بأمر الله؟',o:['إبراهيم','نوح','موسى','داود'],a:1,e:'نوح عليه السلام صنع السفينة بأمر الله.'},
{c:'السيرة',q:'ما اسم الغار الذي اختبأ فيه النبي ﷺ وأبو بكر أثناء الهجرة؟',o:['حراء','ثور','أحد','الرحمة'],a:1,e:'مكثا في غار ثور في طريق الهجرة.'},
{c:'القرآن',q:'في أي سورة توجد آية الكرسي؟',o:['آل عمران','البقرة','النساء','المائدة'],a:1,e:'آية الكرسي هي الآية 255 من سورة البقرة.'},
{c:'العبادات',q:'كم عدد الصلوات المفروضة في اليوم والليلة؟',o:['3','4','5','6'],a:2,e:'فرض الله خمس صلوات في اليوم والليلة.'},
{c:'الصحابة',q:'من الصحابي المذكور باسمه صراحة في القرآن؟',o:['زيد بن حارثة','أبو بكر','عمر','بلال'],a:0,e:'ذُكر زيد بن حارثة رضي الله عنه باسمه في سورة الأحزاب.'},
{c:'الأنبياء',q:'من النبي الذي كلّمه الله تكليمًا؟',o:['موسى','يوسف','يونس','زكريا'],a:0,e:'قال تعالى عن موسى عليه السلام: وكلم الله موسى تكليمًا.'}
];
let v21Quiz={items:[],i:0,score:0,answered:false};
function v21StartQuiz(n){const day=cairoDateKey().replaceAll('-','');const seed=[...day].reduce((a,x)=>a+Number(x),0);const arr=[...V21_QUIZ].sort((a,b)=>((V21_QUIZ.indexOf(a)+seed*7)%13)-((V21_QUIZ.indexOf(b)+seed*7)%13));v21Quiz={items:arr.slice(0,Math.min(n,arr.length)),i:0,score:0,answered:false};$('#v21QuizFinal').classList.add('hidden');$('#v21QuizStart5').classList.add('hidden');$('#v21QuizStart10').classList.add('hidden');v21RenderQuiz()}
function v21RenderQuiz(){const x=v21Quiz.items[v21Quiz.i];if(!x)return;$('#v21QuizCat').textContent=x.c;$('#v21QuizProgress').textContent=`${v21Quiz.i+1} / ${v21Quiz.items.length}`;$('#v21QuizQ').textContent=x.q;$('#v21QuizFeedback').className='quiz-result hidden';$('#v21QuizNext').classList.add('hidden');$('#v21QuizOptions').innerHTML=x.o.map((o,i)=>`<button class="quiz-option" data-v21ans="${i}">${o}</button>`).join('');$$('[data-v21ans]').forEach(b=>b.onclick=()=>v21Answer(Number(b.dataset.v21ans)))}
function v21Answer(a){if(v21Quiz.answered)return;v21Quiz.answered=true;const x=v21Quiz.items[v21Quiz.i],ok=a===x.a;if(ok)v21Quiz.score++;$$('[data-v21ans]').forEach(b=>{b.disabled=true;if(Number(b.dataset.v21ans)===x.a)b.classList.add('correct');if(Number(b.dataset.v21ans)===a&&!ok)b.classList.add('wrong')});const f=$('#v21QuizFeedback');f.className='quiz-result '+(ok?'correct':'wrong');f.innerHTML=`<b>${ok?'✓ إجابة صحيحة':'✕ الإجابة الصحيحة: '+x.o[x.a]}</b><p>${x.e}</p>`;$('#v21QuizNext').textContent=v21Quiz.i===v21Quiz.items.length-1?'عرض النتيجة':'السؤال التالي';$('#v21QuizNext').classList.remove('hidden');if(ok)celebrate('أحسنت — إجابة صحيحة 🌟')}
function v21NextQuiz(){if(v21Quiz.i<v21Quiz.items.length-1){v21Quiz.i++;v21Quiz.answered=false;v21RenderQuiz();return}const pct=Math.round(v21Quiz.score/v21Quiz.items.length*100);const f=$('#v21QuizFinal');f.classList.remove('hidden');f.innerHTML=`<span class="tag">نتيجتك</span><p><b>${v21Quiz.score}/${v21Quiz.items.length}</b></p><h3>${pct>=80?'ما شاء الله — ممتاز 🌟':pct>=60?'أحسنت — واصل التعلم 👍':'بداية طيبة — راجع الإجابات وحاول مرة أخرى'}</h3>`;$('#v21QuizOptions').innerHTML='';$('#v21QuizFeedback').classList.add('hidden');$('#v21QuizNext').classList.add('hidden');$('#v21QuizQ').textContent='اكتملت المسابقة';$('#v21QuizStart5').classList.remove('hidden');$('#v21QuizStart10').classList.remove('hidden');localStorage.v21BestQuiz=Math.max(Number(localStorage.v21BestQuiz||0),pct)}
if($('#v21QuizStart5'))$('#v21QuizStart5').onclick=()=>v21StartQuiz(5);if($('#v21QuizStart10'))$('#v21QuizStart10').onclick=()=>v21StartQuiz(10);if($('#v21QuizNext'))$('#v21QuizNext').onclick=v21NextQuiz;

const V21_DUA_TOPICS={
'الوالدان':['الوالدين','الأب','الأم'],'المتوفى':['المتوفى','الميت','الوفاة'],'الهم والفرج':['الهم','الفرج','الكرب'],'الرزق':['الرزق','الكفاية','الدين'],'التوبة والمغفرة':['التوبة','المغفرة','الاستغفار'],'الشفاء والعافية':['الشفاء','العافية','المرض'],'الذرية والأسرة':['الذرية','الأسرة','الأهل'],'الهداية والعلم':['الهداية','العلم','الثبات'],'السفر':['السفر'],'الخوف والحفظ':['الخوف','الحفظ','الشر']};
function v21RenderDuaTopics(){if(!$('#v21DuaTopics'))return;$('#v21DuaTopics').innerHTML=Object.keys(V21_DUA_TOPICS).map(k=>`<button data-duatopic="${k}">${k}</button>`).join('');$$('[data-duatopic]').forEach(b=>b.onclick=()=>v21FindDua(b.dataset.duatopic))}
function v21FindDua(topic){const terms=V21_DUA_TOPICS[topic],out=[];Object.entries(D.duas||{}).forEach(([cat,a])=>a.forEach(x=>{const txt=(cat+' '+x.join(' '));if(terms.some(t=>txt.includes(t)))out.push({cat,text:x[0],src:x[1]||''})}));$('#v21DuaResults').innerHTML=out.length?out.slice(0,12).map(x=>`<article><span class="tag">${x.cat}</span><p>${x.text}</p><small>${x.src}</small><button class="ghost" onclick="shareText(${JSON.stringify('دعاء — '+topic+'\n'+x.text)})">مشاركة</button></article>`).join(''):`<div class="notice">لم أجد دعاءً مطابقًا داخل محتوى الموقع لهذا التصنيف.</div>`}
v21RenderDuaTopics();

function v21GoalDay(){return cairoDateKey()}function v21Goals(){let x={day:v21GoalDay(),ist:0,sal:0,quran:0,targets:{ist:100,sal:100,quran:5}};try{const y=JSON.parse(localStorage.v21Goals||'{}');if(y.day===x.day)x={...x,...y,targets:{...x.targets,...(y.targets||{})}}}catch{}return x}function v21SaveGoals(g){localStorage.v21Goals=JSON.stringify(g);v21RenderGoals()}
function v21RenderGoals(){if(!$('#goalIstValue'))return;const g=v21Goals();[['ist','Ist'],['sal','Sal'],['quran','Quran']].forEach(([k,id])=>{$('#goal'+id+'Value').textContent=g[k];$('#goal'+id+'Target').textContent=g.targets[k];$('#goal'+id+'Bar').style.width=Math.min(100,g[k]/g.targets[k]*100)+'%'});const done=['ist','sal','quran'].filter(k=>g[k]>=g.targets[k]).length;if($('#v21GoalsSummary'))$('#v21GoalsSummary').textContent=`${done}/3 أهداف مكتملة اليوم`}
$$('[data-goal]').forEach(b=>b.onclick=()=>{const g=v21Goals(),k=b.dataset.goal;g[k]+=Number(b.dataset.add||1);v21SaveGoals(g);if(g[k]===g.targets[k])celebrate('ما شاء الله — أتممت أحد أهدافك اليومية 🎯')});$$('[data-goal-target]').forEach(b=>b.onclick=()=>{const g=v21Goals(),k=b.dataset.goalTarget,v=Number(prompt('اكتب الهدف اليومي الجديد',g.targets[k]));if(v>0){g.targets[k]=Math.min(10000,v);v21SaveGoals(g)}});if($('#v21ResetGoals'))$('#v21ResetGoals').onclick=()=>{const g=v21Goals();g.ist=g.sal=g.quran=0;v21SaveGoals(g);toast('تم تصفير تقدم أهداف اليوم')};v21RenderGoals();

function v21RenderResume(){if(!$('#v21ResumeText'))return;const p=Number(localStorage.lastQuranPage||localStorage.savedQuranPage||1);$('#v21ResumeText').textContent=p>1?`آخر صفحة قرأتها: ${p}`:'ابدأ من الصفحة الأولى أو من موضع تختاره';$('#v21ResumeBtn').onclick=()=>{showPage('quran');loadQuranPage(p)}}v21RenderResume();
function v21ApplyElder(){document.body.classList.toggle('elder-mode',localStorage.v21Elder==='1');if($('#v21ElderToggle'))$('#v21ElderToggle').textContent=localStorage.v21Elder==='1'?'🔠 الحجم العادي':'🔠 وضع كبار السن'}if($('#v21ElderToggle'))$('#v21ElderToggle').onclick=()=>{localStorage.v21Elder=localStorage.v21Elder==='1'?'0':'1';v21ApplyElder()};v21ApplyElder();

// فتح الأقسام مباشرة من رابط القسم
function v22OpenHashSection(){const id=location.hash.replace('#','');if(id&&document.getElementById(id)?.classList.contains('page'))showPage(id)}
window.addEventListener('hashchange',v22OpenHashSection);setTimeout(v22OpenHashSection,50);
