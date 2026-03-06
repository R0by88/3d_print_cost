let filaments = JSON.parse(localStorage.getItem("filaments")) || [];
let printers = JSON.parse(localStorage.getItem("printers")) || [];
let prints = JSON.parse(localStorage.getItem("prints")) || [];

const energyPrice = 0.12;

function saveDB(){

localStorage.setItem("filaments", JSON.stringify(filaments));
localStorage.setItem("printers", JSON.stringify(printers));
localStorage.setItem("prints", JSON.stringify(prints));

}

function showMenu(){

document.getElementById("menu").style.display="block";
document.getElementById("content").innerHTML="";

}

function showPage(page){

document.getElementById("menu").style.display="none";

if(page=="new") newPrintPage();
if(page=="history") historyPage();
if(page=="filaments") filamentPage();
if(page=="printers") printerPage();

}

function backButton(){

return `<button class="back" onclick="showMenu()">← Indietro</button>`;

}

/* FILAMENTI */

function filamentPage(){

let html=backButton()+`

<h2>Database Filamenti</h2>

Marca<input id="fMarca">
Tipo<input id="fTipo">
Colore<input id="fColore">
Prezzo €/kg<input id="fPrezzo" type="number">

<button onclick="addFilament()">Aggiungi</button>

<table>
<tr>
<th>Marca</th>
<th>Tipo</th>
<th>Colore</th>
<th>€/kg</th>
</tr>`;

filaments.forEach(f=>{
html+=`<tr>
<td>${f.marca}</td>
<td>${f.tipo}</td>
<td>${f.colore}</td>
<td>${f.prezzo}</td>
</tr>`;
});

html+=`</table>`;

document.getElementById("content").innerHTML=html;

}

function addFilament(){

filaments.push({

marca:fMarca.value,
tipo:fTipo.value,
colore:fColore.value,
prezzo:Number(fPrezzo.value)

});

saveDB();
filamentPage();

}

/* STAMPANTI */

function printerPage(){

let html=backButton()+`

<h2>Database Stampanti</h2>

Marca<input id="pMarca">
Modello<input id="pModello">
Consumo kWh<input id="pConsumo" type="number">

<button onclick="addPrinter()">Aggiungi</button>

<table>
<tr>
<th>Marca</th>
<th>Modello</th>
<th>kWh</th>
</tr>`;

printers.forEach(p=>{
html+=`<tr>
<td>${p.marca}</td>
<td>${p.modello}</td>
<td>${p.consumo}</td>
</tr>`;
});

html+=`</table>`;

document.getElementById("content").innerHTML=html;

}

function addPrinter(){

printers.push({

marca:pMarca.value,
modello:pModello.value,
consumo:Number(pConsumo.value)

});

saveDB();
printerPage();

}

/* NUOVA STAMPA */

function newPrintPage(){

let html=backButton()+`

<h2>Nuova Stampa</h2>

Nome stampa<input id="printName">

Stampante<select id="printerSelect"></select>

<table id="filamentTable">
<tr>
<th>Marca</th>
<th>Tipo</th>
<th>Colore</th>
<th>€/g</th>
<th>g</th>
<th>€</th>
<th></th>
</tr>
</table>

<button onclick="addFilamentRow()">+ Filamento</button>

<h3>Tempo stampa</h3>

<div class="timeRow">

Ore <input id="hours" type="number" max="99">

Min <input id="minutes" type="number" max="59">

</div>

<div class="totalBox">

Materiale: <span id="matCost">0</span> €<br>
Energia: <span id="energyCost">0</span> €<br>

<h3>Totale: <span id="totalCost">0</span> €</h3>

</div>

<button onclick="savePrint()">Salva stampa</button>
`;

document.getElementById("content").innerHTML=html;

loadPrinters();
addFilamentRow();

}

function loadPrinters(){

let sel=document.getElementById("printerSelect");

printers.forEach((p,i)=>{

let o=document.createElement("option");
o.value=i;
o.text=p.marca+" "+p.modello;

sel.add(o);

});

}

function addFilamentRow(){

let table=document.getElementById("filamentTable");

if(table.rows.length>10) return;

let row=table.insertRow();

row.innerHTML=`

<td><select class="marca"></select></td>
<td><select class="tipo"></select></td>
<td><select class="colore"></select></td>
<td class="prezzo"></td>
<td><input type="number" class="grammi"></td>
<td class="costo"></td>
<td><button class="deleteBtn" onclick="deleteRow(this)">X</button></td>
`;

loadMarche(row);

}

function deleteRow(btn){

btn.parentElement.parentElement.remove();
updateTotals();

}

/* resto codice identico al tuo */

function loadMarche(row){

let marche=[...new Set(filaments.map(f=>f.marca))];

let sel=row.querySelector(".marca");

marche.forEach(m=>{
let o=document.createElement("option");
o.text=m;
sel.add(o);
});

sel.onchange=()=>loadTipi(row);
loadTipi(row);

}

function loadTipi(row){

let marca=row.querySelector(".marca").value;

let tipi=[...new Set(
filaments.filter(f=>f.marca==marca).map(f=>f.tipo)
)];

let sel=row.querySelector(".tipo");
sel.innerHTML="";

tipi.forEach(t=>{
let o=document.createElement("option");
o.text=t;
sel.add(o);
});

sel.onchange=()=>loadColori(row);
loadColori(row);

}

function loadColori(row){

let marca=row.querySelector(".marca").value;
let tipo=row.querySelector(".tipo").value;

let colori=filaments.filter(
f=>f.marca==marca && f.tipo==tipo
);

let sel=row.querySelector(".colore");
sel.innerHTML="";

colori.forEach(c=>{
let o=document.createElement("option");
o.text=c.colore;
sel.add(o);
});

sel.onchange=()=>updatePrice(row);
updatePrice(row);

}

function updatePrice(row){

let marca=row.querySelector(".marca").value;
let tipo=row.querySelector(".tipo").value;
let colore=row.querySelector(".colore").value;

let f=filaments.find(
x=>x.marca==marca && x.tipo==tipo && x.colore==colore
);

let price=Math.ceil((f.prezzo/1000)*1000)/1000;

row.querySelector(".prezzo").innerText=price;

row.querySelector(".grammi").oninput=()=>calcRow(row);

}

function calcRow(row){

let g=row.querySelector(".grammi").value;
let p=row.querySelector(".prezzo").innerText;

let cost=g*p;

row.querySelector(".costo").innerText=cost.toFixed(2);

updateTotals();

}

function updateTotals(){

let rows=document.querySelectorAll("#filamentTable tr");

let mat=0;

rows.forEach((r,i)=>{
if(i==0) return;
let c=r.querySelector(".costo");
if(c) mat+=Number(c.innerText||0);
});

document.getElementById("matCost").innerText=mat.toFixed(2);

let hours=document.getElementById("hours").value||0;
let min=document.getElementById("minutes").value||0;

let h=Number(hours)+Number(min)/60;

let printer=printers[
document.getElementById("printerSelect").value
];

let energy=h*printer.consumo*energyPrice;

document.getElementById("energyCost").innerText=energy.toFixed(2);

document.getElementById("totalCost").innerText=(mat+energy).toFixed(2);

}

function savePrint(){

let name=document.getElementById("printName").value;

let total=document.getElementById("totalCost").innerText;

prints.push({

name:name,
date:new Date().toLocaleDateString(),
total:total

});

saveDB();

alert("Stampa salvata");

}

function historyPage(){

let html=backButton()+`

<h2>Storico Stampe</h2>

<table>
<tr>
<th>Data</th>
<th>Nome</th>
<th>Costo</th>
</tr>`;

prints.forEach(p=>{
html+=`<tr>
<td>${p.date}</td>
<td>${p.name}</td>
<td>${p.total} €</td>
</tr>`;
});

html+=`</table>`;

document.getElementById("content").innerHTML=html;

}
