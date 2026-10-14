const KEY = "plm-data-v1";
const $ = id => document.getElementById(id);
const today = new Date();
const dateInput = d => { const x=new Date(d); return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,16); };
const dateOnly = d => { const x=new Date(d); return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,10); };
let data = load();
function fresh(){return {study:[],tasks:[],money:[],goals:[],reminded:[]};}
function load(){try{return {...fresh(),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return fresh()}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render();}
function uid(){return crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+Math.random().toString(16).slice(2)}
function money(n){return "৳"+Number(n||0).toLocaleString("en-BD",{maximumFractionDigits:2})}
function fmtDate(s){if(!s)return "No date set";const d=new Date(s);return isNaN(d) ? s : d.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:s.includes("T")?"2-digit":undefined,minute:s.includes("T")?"2-digit":undefined})}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function setView(v){document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(v+"View").classList.remove("hidden");document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.view===v));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
$("showAllTasks").onclick=()=>setView("tasks");
$("todayLabel").textContent=today.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
$("moneyDate").value=dateOnly(new Date());
function addReminderItem(title,category,due,notes=""){data.study.push({id:uid(),title,category,due,notes,done:false,created:Date.now()});save();}
$("quickForm").addEventListener("submit",e=>{e.preventDefault();const title=$("quickTitle").value.trim();if(!title)return;const cat=$("quickCategory").value,due=$("quickDue").value;if(cat==="task")data.tasks.push({id:uid(),title,due,priority:"Normal",done:false,created:Date.now()});else if(cat==="career")data.goals.push({id:uid(),title,due:due?due.slice(0,10):"",category:"Personal",done:false,created:Date.now()});else addReminderItem(title,"Study",due);if(cat!=="study")save();e.target.reset();render();});
$("studyForm").addEventListener("submit",e=>{e.preventDefault();addReminderItem($("studyTitle").value.trim(),$("studyType").value,$("studyDue").value,$("studyNotes").value.trim());e.target.reset();});
$("taskForm").addEventListener("submit",e=>{e.preventDefault();data.tasks.push({id:uid(),title:$("taskTitle").value.trim(),priority:$("taskPriority").value,due:$("taskDue").value,done:false,created:Date.now()});save();e.target.reset();});
$("goalForm").addEventListener("submit",e=>{e.preventDefault();data.goals.push({id:uid(),title:$("goalTitle").value.trim(),due:$("goalDue").value,category:$("goalCategory").value,done:false,created:Date.now()});save();e.target.reset();});
$("moneyForm").addEventListener("submit",e=>{e.preventDefault();data.money.unshift({id:uid(),type:$("moneyType").value,amount:Number($("moneyAmount").value),date:$("moneyDate").value,person:$("moneyPerson").value.trim(),details:$("moneyDetails").value.trim(),created:Date.now()});save();e.target.reset();$("moneyDate").value=dateOnly(new Date());});
function total(type){return data.money.filter(x=>x.type===type).reduce((s,x)=>s+Number(x.amount),0)}
function cashBalance(){return total("income")+total("borrowed")+total("repayment")-total("expense")-total("lent")-total("paidback")}
function itemCard(item,kind){const done=item.done;let meta=[];if(item.due)meta.push("Due: "+fmtDate(item.due));if(item.date)meta.push("Date: "+fmtDate(item.date));if(item.priority)meta.push("Priority: "+item.priority);if(item.notes)meta.push(item.notes);if(item.category)meta.push(item.category);return `<article class="item"><div class="item-main"><div class="item-title">${escapeHtml(item.title||"")}</div><div>${kind==="money"?`<span class="pill">${escapeHtml(item.type)}</span><span class="pill">${money(item.amount)}</span>`:`<span class="pill ${done?"done":""}">${done?"Completed":escapeHtml(item.category||item.priority||kind)}</span>`}</div><div class="meta">${escapeHtml(meta.join(" · "))}${item.person?"\\n"+escapeHtml(item.person):""}${item.details?"\\n"+escapeHtml(item.details):""}</div></div><div class="item-actions">${kind!=="money"?`<button class="mini" data-act="toggle" data-kind="${kind}" data-id="${item.id}">${done?"Undo":"Done"}</button>`:""}<button class="mini" data-act="delete" data-kind="${kind}" data-id="${item.id}">Delete</button></div></article>`}
function stack(id,items,kind,empty){$(id).innerHTML=items.length?items.map(x=>itemCard(x,kind)).join(""):`<div class="empty">${empty}</div>`}
function render(){const all=[...data.study,...data.tasks].filter(x=>!x.done);$("balance").textContent=money(cashBalance());$("openTasks").textContent=all.length+data.goals.filter(x=>!x.done).length;$("upcoming").textContent=[...data.study,...data.tasks].filter(x=>!x.done&&x.due).length;
$("incomeTotal").textContent=money(total("income")+total("borrowed")+total("repayment"));$("expenseTotal").textContent=money(total("expense")+total("lent")+total("paidback"));$("netTotal").textContent=money(cashBalance());
const upcoming=[...data.study.map(x=>({...x,_kind:"study"})),...data.tasks.map(x=>({...x,_kind:"tasks"}))].filter(x=>!x.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")).slice(0,5);
$("homeUpcoming").innerHTML=upcoming.length?upcoming.map(x=>itemCard(x,x._kind)).join(""):`<div class="empty">Nothing queued yet. Add a task or deadline above.</div>`;
stack("studyList",data.study.slice().sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")),"study","No study deadlines yet.");
stack("taskList",data.tasks.slice().sort((a,b)=>Number(a.done)-Number(b.done)||(a.due||"9999").localeCompare(b.due||"9999")),"tasks","No daily tasks yet.");
stack("moneyList",data.money,"money","No transactions yet.");
stack("goalList",data.goals,"goals","No career or personal goals yet.");
}
document.addEventListener("click",e=>{const b=e.target.closest("button[data-act]");if(!b)return;const {act,kind,id}=b.dataset;if(act==="toggle"){const arr=kind==="study"?data.study:kind==="tasks"?data.tasks:data.goals;const it=arr.find(x=>x.id===id);if(it)it.done=!it.done;}else if(act==="delete"){if(!confirm("Delete this record?"))return;const key=kind==="study"?"study":kind==="tasks"?"tasks":kind==="goals"?"goals":"money";data[key]=data[key].filter(x=>x.id!==id);}save();});
$("notifyBtn").addEventListener("click",async()=>{if(!("Notification"in window)){alert("This browser does not support notifications.");return;}try{const p=await Notification.requestPermission();alert(p==="granted"?"Notifications enabled. Keep this app open for in-app scheduled checks.":"Permission was not granted. You can still use the task list.");}catch{alert("Could not request notification permission in this browser.");}});
function checkDue(){if(!("Notification"in window)||Notification.permission!=="granted")return;const now=Date.now();[...data.study,...data.tasks].forEach(x=>{if(!x.done&&x.due){const due=new Date(x.due).getTime();if(due<=now&&due>now-60000&&!data.reminded.includes(x.id)){new Notification("Life Manager reminder",{body:x.title});data.reminded.push(x.id);localStorage.setItem(KEY,JSON.stringify(data));}}});}
setInterval(checkDue,20000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkDue();});
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="personal-life-manager-backup.json";a.click();URL.revokeObjectURL(a.href);};
$("importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const imported=JSON.parse(await f.text());if(!imported||!Array.isArray(imported.study)||!Array.isArray(imported.money))throw Error();if(!confirm("Import will replace the current records. Continue?"))return;data={...fresh(),...imported};save();alert("Backup imported.");}catch{alert("This backup file is not valid.");}e.target.value="";});
$("clearBtn").onclick=()=>{if(confirm("Permanently delete all records stored in this browser? Export a backup first if needed.")&&confirm("Final confirmation: delete all local data?")){data=fresh();save();}};
render();
if("serviceWorker"in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
