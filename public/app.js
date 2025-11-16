const container=document.getElementById('map-chart');
let isGeoReady=false;
let isLeafletReady=false;
let leafletMap=null;
const leafletMarkers={};
const alertPulses={};
const points=[
{name:'武昌·南湖A仓',value:[114.333,30.508]},
{name:'武昌·水果湖超市',value:[114.356,30.538]},
{name:'武昌·洪山广场配送',value:[114.343,30.517]},
{name:'武昌·中南路生鲜',value:[114.344,30.531]},
{name:'武昌·珞珈山工厂',value:[114.362,30.545]},
{name:'武昌·中华路市场',value:[114.315,30.563]},
{name:'武昌·和平大道A仓',value:[114.381,30.561]},
{name:'武昌·友谊大道B仓',value:[114.394,30.586]},
{name:'武昌·东湖路超市',value:[114.385,30.551]},
{name:'武昌·团结大道配送',value:[114.426,30.592]},
{name:'武昌·武珞路C仓',value:[114.333,30.540]},
{name:'武昌·石牌岭D厂',value:[114.333,30.523]},
{name:'武昌·白沙洲集散',value:[114.310,30.495]},
{name:'武昌·司门口菜市',value:[114.318,30.557]},
{name:'武昌·昙华林生鲜',value:[114.326,30.557]},
{name:'武昌·街道口中转',value:[114.357,30.520]},
{name:'武昌·虎泉冷链站',value:[114.372,30.519]},
{name:'武昌·丁字桥仓储',value:[114.338,30.512]},
{name:'武昌·阅马场超市',value:[114.322,30.550]},
{name:'武昌·徐东配送中心',value:[114.397,30.593]},
{name:'武昌·杨园A仓',value:[114.404,30.600]},
{name:'武昌·东亭B仓',value:[114.390,30.585]},
{name:'武昌·粮道街C店',value:[114.332,30.548]},
{name:'武昌·首义路D店',value:[114.323,30.533]}
];
function showTraceFor(name){
const traceModal=document.getElementById('trace-modal');
const traceContent=document.getElementById('trace-content');
traceContent.innerHTML=`<h3>[${name}] - 批次 [XG1088] 溯源信息</h3>
<div class="timeline">
 <div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content">步骤 4 [商超]：2025-11-16 09:00 上架</div></div>
 <div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content">步骤 3 [物流]：2025-11-15 14:00 冷链运输 (温度: 5°C)</div></div>
 <div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content">步骤 2 [工厂]：2025-11-15 08:00 加工灭菌</div></div>
 <div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-content">步骤 1 [牧场]：2025-11-14 10:00 原奶采集</div></div>
 </div>`;
traceModal.classList.add('visible');
traceModal.classList.add('active');
}
function init(){
 leafletMap=L.map('map-chart').setView([30.55,114.35],12);
 const gaode=L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=7&x={x}&y={y}&z={z}',{attribution:'© 高德地图',maxZoom:18,subdomains:['1','2','3','4'],tileSize:512,zoomOffset:-1}).addTo(leafletMap);
 let fallbackDone=false;
 gaode.on('tileerror',()=>{
  if(fallbackDone)return;
  fallbackDone=true;
  leafletMap.removeLayer(gaode);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',detectRetina:true}).addTo(leafletMap);
  if(typeof addEvent==='function'){addEvent('高德底图加载失败，切换备用底图(OSM)')}
 });
 function adjustToLand(v){const lng=v[0],lat=v[1];if(lng>=114.375&&lng<=114.43&&lat>=30.545&&lat<=30.6){return[lng-0.02,lat-0.005]}if(lng>=114.33&&lng<=114.365&&lat>=30.495&&lat<=30.535){return[lng-0.01,lat+0.01]}return v}
 points.forEach(p=>{
  const adj=adjustToLand(p.value);
 const m=L.circleMarker([adj[1],adj[0]],{color:'#0a192f',fillColor:'#64ffda',radius:7,fillOpacity:1,opacity:1,weight:2,className:'marker-safe'}).addTo(leafletMap);
  m.bindTooltip(p.name);
  leafletMarkers[p.name]=m;
  m.on('click',()=>showTraceFor(p.name));
 });
 isLeafletReady=true;
 if(typeof addEvent==='function'){addEvent('已启用高德地图底图')}
}
init();
window.addEventListener('resize',()=>{if(isLeafletReady){leafletMap && leafletMap.invalidateSize()}});
function fitToDistrict(){
 const ms=Object.values(leafletMarkers);
 if(!ms.length){return}
 const latlngs=ms.map(m=>m.getLatLng());
 if(latlngs.length<5){
  const bounds=L.latLngBounds(latlngs);
  leafletMap && leafletMap.fitBounds(bounds,{padding:[12,12]});
  return
 }
 const lats=latlngs.map(ll=>ll.lat).slice().sort((a,b)=>a-b);
 const lngs=latlngs.map(ll=>ll.lng).slice().sort((a,b)=>a-b);
 const t=Math.max(1,Math.floor(lats.length*0.15));
 const minLat=lats[t];
 const maxLat=lats[lats.length-1-t];
 const minLng=lngs[t];
 const maxLng=lngs[lngs.length-1-t];
 const bounds=L.latLngBounds([minLat,minLng],[maxLat,maxLng]);
 const adjusted=L.latLngBounds(
  [bounds.getSouth()-0.001,bounds.getWest()-0.001],
  [bounds.getNorth()+0.001,bounds.getEast()+0.001]
 );
 leafletMap && leafletMap.fitBounds(adjusted,{padding:[10,10]});
}
const fitBtn=document.getElementById('fit-btn');
if(fitBtn){fitBtn.addEventListener('click',()=>{if(isLeafletReady)fitToDistrict()})}
function setPointAlert(target){
 const targets=new Set(Array.isArray(target)?target:[target]);
 if(isLeafletReady){
 targets.forEach(n=>{const m=leafletMarkers[n];if(m){m.setStyle({color:'#f97583',fillColor:'#f97583'});m.setRadius(10);if(!alertPulses[n]){const latlng=m.getLatLng();const pulse=L.circle(latlng,{radius:120,weight:2,opacity:.8,className:'alert-pulse'}).addTo(leafletMap);alertPulses[n]=pulse}}});
 }
}
function prependRiskLog(text){
 const log=document.querySelector('.event-log');
 const ul=document.getElementById('event-list');
 if(typeof addEvent==='function'){addEvent(text||"[一级风险]：AI 哨兵检测到 '上海A仓' 关联批次 [XG1088] 出现严重冷链断链风险。",'high-risk-alert');return}
 const div=document.createElement('div');
 div.className='event-item high-risk-alert';
 const msg=document.createElement('div');
 msg.textContent=text||"[一级风险]：AI 哨兵检测到 '上海A仓' 关联批次 [XG1088] 出现严重冷链断链风险。";
 const time=document.createElement('span');
 time.className='event-time';
 time.textContent=new Date().toLocaleString();
 div.appendChild(msg);
 div.appendChild(time);
 log.insertBefore(div,ul);
}
function showAIDecision(cases){
 const aiModal=document.getElementById('ai-modal');
 const aiContent=document.getElementById('ai-content');
 let ul=aiContent.querySelector('ul.trace-list');
 if(!ul){
  aiContent.innerHTML=`<h3>AI 智能决策方案</h3><ul class="trace-list"></ul>`;
  ul=aiContent.querySelector('ul.trace-list');
 }
 cases.forEach(c=>{
  const li=document.createElement('li');
  li.innerHTML=`<strong>${c.level}·${c.type}</strong> 批次 [${c.batch}] (${c.name}) —— ${c.decision}`;
  ul.appendChild(li);
 });
 aiModal.classList.add('visible');
 aiModal.classList.add('active');
 if(typeof addEvent==='function'){cases.forEach(c=>{addEvent(`已下发处置指令：${c.decision}`)})}
}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function chooseRandom(arr){return arr[randomInt(0,arr.length-1)]}
function chooseDistinctPoints(k){const indices=new Set();while(indices.size<k){indices.add(randomInt(0,points.length-1))}return Array.from(indices).map(i=>points[i])}
function generateBatch(){return 'XG'+String(randomInt(1000,9999))}
function generateCase(name){
 const types=['冷链断链','微生物超标','标签疑似篡改','过期风险','温度异常波动','异物风险','供应商黑名单'];
 const levels=['一级','一级','二级','三级'];
 const type=chooseRandom(types);
 const level=chooseRandom(levels);
 const batch=generateBatch();
 const decisions=[
 `立即通知 '${name}' 封存批次 [${batch}]；派单近端监管员核查；通知下游拦截`,
 `抽检复核并提升冷链监控等级；对批次 [${batch}] 开启链路追踪`,
 `暂停出库并复核标签；同步上链存证与录像留存`
 ];
 return {name,type,level,batch,decision:chooseRandom(decisions)}
}
function simulateAlert(){
 const count=randomInt(1,3);
 const selected=chooseDistinctPoints(count);
 setPointAlert(selected.map(s=>s.name));
 fitToDistrict();
 const cases=selected.map(s=>generateCase(s.name));
 cases.forEach(c=>{const msg=`[${c.level}风险]：AI 哨兵检测到 '${c.name}' 关联批次 [${c.batch}] 出现${c.type}风险。`;prependRiskLog(msg)});
 const delay=randomInt(800,1500);
 setTimeout(()=>{showAIDecision(cases)},delay);
}
const originalBtn=document.getElementById('simulate-btn');
const clonedBtn=originalBtn.cloneNode(true);
originalBtn.parentNode.replaceChild(clonedBtn,originalBtn);
clonedBtn.addEventListener('click',simulateAlert);