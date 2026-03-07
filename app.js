// prezzo energia €/kWh
const energyPrice = 0.12;

// DATABASE DI TEST (poi arriveranno da Google Sheets)

let printers = [
{marca:"Bambulab", modello:"A1 Mini", consumo:150},
{marca:"Prusa", modello:"MK4", consumo:170}
];

let filaments = [
{marca:"Bambulab", tipo:"PLA Basic", colore:"Bianco", prezzo:20},
{marca:"Bambulab", tipo:"PLA Basic", colore:"Nero", prezzo:20},
{marca:"Sunlu", tipo:"PLA+", colore:"Rosso", prezzo:18}
];

// CONTATORI
let filamentCount=0;
let accessoryCount=0;

const maxFilaments=10;
const maxAccessories=10;


// DASHBOARD NAV

function showTab(tab){

let content=document.getElementById("content");
content.innerHTML="";

if(tab=="nuova") newPrintPage();

if(tab=="stampanti")
content.innerHTML="<h2>Database Stampanti</h2>";

if(tab=="filamenti")
content.innerHTML="<h2>Database Filamenti</h2>";

if(tab=="storico")
content.innerHTML="<h2>Storico</h2>";

}


// PAGINA NUOVA STAMPA

function newPrintPage(){

filamentCount=0;
accessoryCount=0;

let html=`

<h2>Nuova Stampa</h2>

<label>Nome stampa</label>
<input id="printName">

<label>Stampante</label>
<select id="printerSelect"></select>

<label>Consumo stampante (W/h)</label>
<input id="printerPower" readonly>

<h3>Filamenti</h3>

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

<div style="display:flex;gap:10px">

<input id="hours" type="number" placeholder="Ore" style="width:60px" oninput="updateTotals()">

<span>:</span>

<input id="minutes" type="number" placeholder="Min" style="width:60px" oninput="updateTotals()">

</div>


<h3>Accessori</h3>

<table id="accessoryTable">
<tr>
<th>Nome</th>
<th>Costo €</th>
<th></th>
</tr>
</table>

<button onclick="addAccessory()">+ Accessorio</button>


<h3>Riepilogo</h3>

Materiale: <span id="matCost">0</span> €<br>
Energia: <span id="energyCost">0</span> €<br>
Accessori: <span id="accCost">0</span> €<br>

<h3>Totale costi: <span id="totalCost">0</span> €</h3>


<h3>Vendita</h3>

Ricarico % <input id="ricarico" type="number" oninput="updateSale()">

IVA % <input id="iva" type="number" oninput="updateSale()">

Prezzo vendita € <input id="salePrice" type="number" oninput="updateProfit()">

Guadagno € <input id="profit" readonly>

`;

document.getElementById("content").innerHTML=html;

loadPrinters();

addFilamentRow();

}


// STAMPANTI

function loadPrinters(){

let sel=document.getElementById("printerSelect");

printers.forEach((p,i)=>{

let o=document.createElement("option");
o.value=i;
o.text=p.marca+" "+p.modello;

sel.add(o);

});

sel.onchange=updatePrinterPower;

updatePrinterPower();

}

function updatePrinterPower(){

let p=printers[
document.getElementById("printerSelect").value
];

document.getElementById("printerPower").value=p.consumo;

updateTotals();

}


// FILAMENTI

function addFilamentRow(){

if(filamentCount>=maxFilaments) return;

filamentCount++;

let table=document.getElementById("filamentTable");

let row=table.insertRow();

row.innerHTML=`

<td><select class="marca"></select></td>
<td><select class="tipo"></select></td>
<td><select class="colore"></select></td>
<td class="prezzo"></td>
<td><input type="number" class="grammi"></td>
<td class="costo"></td>
<td><button onclick="removeRow(this)">X</button></td>

`;

loadMarche(row);

}


function removeRow(btn){

btn.parentElement.parentElement.remove();

updateTotals();

}


// CASCATE FILAMENTI

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

filaments
.filter(f=>f.marca==marca)
.map(f=>f.tipo)

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

x=>x.marca==marca &&
x.tipo==tipo &&
x.colore==colore

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


// ACCESSORI

function addAccessory(){

if(accessoryCount>=maxAccessories) return;

accessoryCount++;

let table=document.getElementById("accessoryTable");

let row=table.insertRow();

row.innerHTML=`

<td><input class="accName"></td>
<td><input type="number" class="accPrice"></td>
<td><button onclick="removeRow(this)">X</button></td>

`;

row.querySelector(".accPrice").oninput=updateTotals;

}


// TOTALI

function updateTotals(){

let mat=0;

document.querySelectorAll("#filamentTable tr").forEach((r,i)=>{

if(i==0) return;

let c=r.querySelector(".costo");

if(c) mat+=Number(c.innerText||0);

});

document.getElementById("matCost").innerText=mat.toFixed(2);


let acc=0;

document.querySelectorAll(".accPrice").forEach(a=>{

acc+=Number(a.value||0);

});

document.getElementById("accCost").innerText=acc.toFixed(2);


let hours=document.getElementById("hours").value||0;
let min=document.getElementById("minutes").value||0;

let h=Number(hours)+Number(min)/60;

let power=document.getElementById("printerPower").value;

let energy=(power/1000)*h*energyPrice;

document.getElementById("energyCost").innerText=energy.toFixed(2);


let total=mat+acc+energy;

document.getElementById("totalCost").innerText=total.toFixed(2);

updateSale();

}


// CALCOLO VENDITA

function updateSale(){

let cost=Number(document.getElementById("totalCost").innerText);

let ricarico=document.getElementById("ricarico").value||0;

let iva=document.getElementById("iva").value||0;

let price=cost*(1+ricarico/100);

price=price*(1+iva/100);

document.getElementById("salePrice").value=price.toFixed(2);

updateProfit();

}


function updateProfit(){

let sale=document.getElementById("salePrice").value||0;

let cost=document.getElementById("totalCost").innerText;

let profit=sale-cost;

document.getElementById("profit").value=profit.toFixed(2);

}


// AVVIO

showTab("nuova");
