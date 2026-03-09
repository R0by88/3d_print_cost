const energyPrice = 0.12;

let printers = [
    {marca:"Bambulab", modello:"A1 Mini", consumo:150},
    {marca:"Prusa", modello:"MK4", consumo:170}
];

let filaments = [
    {marca:"Bambulab", tipo:"PLA Basic", colore:"Bianco", prezzo:20},
    {marca:"Bambulab", tipo:"PLA Basic", colore:"Nero", prezzo:20},
    {marca:"Sunlu", tipo:"PLA+", colore:"Rosso", prezzo:18}
];

let filamentCount=0;
let accessoryCount=0;
const maxFilaments=10;
const maxAccessories=10;

// DASHBOARD NAV
function showTab(tab){
    let content=document.getElementById("content");
    content.innerHTML="";
    if(tab=="nuova") newPrintPage();
    if(tab=="stampanti") content.innerHTML="<h2>Database Stampanti</h2>";
    if(tab=="filamenti") content.innerHTML="<h2>Database Filamenti</h2>";
    if(tab=="storico") content.innerHTML="<h2>Storico</h2>";
}

// NUOVA STAMPA
function newPrintPage(){
    filamentCount=0;
    accessoryCount=0;

    let html=`
<h2>Nuova Stampa</h2>

<!-- Nome stampa -->
<div>
<label>Nome Stampa</label>
<input id="printName" style="width:100%;text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
</div>

<!-- Stampante -->
<div>
<h3>Stampante</h3>
<select id="printerSelect"></select>
<label>Consumo (W/h)</label>
<input id="printerPower" readonly maxlength="4">
</div>

<!-- Stampa -->
<div>
<h3>Stampa</h3>
<div class="tempo">
<label>Tempo stampa</label>
<input id="hours" type="number" placeholder="Ore" oninput="updateTotals()">
<span>:</span>
<input id="minutes" type="number" placeholder="Min" oninput="updateTotals()">
</div>

<h4>Filamenti</h4>
<table id="filamentTable">
<tr>
<th>Marca</th>
<th>Tipo</th>
<th>Colore</th>
<th>€/g</th>
<th>g</th>
<th>Totale</th>
<th></th>
</tr>
</table>
<button class="addBtn" onclick="addFilamentRow()">+</button>
</div>

<!-- Accessori -->
<div>
<h3>Accessori</h3>
<table id="accessoryTable">
<tr>
<th>Nome</th>
<th>Prezzo €</th>
<th>Quantità</th>
<th>Totale €</th>
<th></th>
</tr>
</table>
<button class="addBtn" onclick="addAccessory()">+</button>
</div>

<!-- Riepilogo -->
<div>
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
</div>
`;

document.getElementById("content").innerHTML=html;

loadPrinters();
addFilamentRow();
}

// STAMPANTI
function loadPrinters(){
    let sel=document.getElementById("printerSelect");
    sel.innerHTML="";
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
    let p=printers[document.getElementById("printerSelect").value];
    document.getElementById("printerPower").value=p.consumo;
    updateTotals();
}

// FILAMENTI
function addFilamentRow(){
    if(filamentCount>=maxFilaments) return;
    filamentCount++;
    let table=document.getElementById("filamentTable");
    let row=table.insertRow();
    row.classList.add("filamentoRow");
    row.innerHTML=`
<td><select class="filamentoMarca"></select></td>
<td><select class="filamentoTipo"></select></td>
<td><select class="filamentoColore"></select></td>
<td class="filamentoCosto"></td>
<td><input type="number" class="filamentoGrammi" max="9999" oninput="calcRow(this.parentElement.parentElement)"></td>
<td class="filamentoTotal"></td>
<td><button class="removeBtn" onclick="removeRow(this)">X</button></td>
`;
    loadMarche(row);
}

function removeRow(btn){
    btn.parentElement.parentElement.remove();
    updateTotals();
}

function loadMarche(row){
    let marche=[...new Set(filaments.map(f=>f.marca))];
    let sel=row.querySelector(".filamentoMarca");
    sel.innerHTML="";
    marche.forEach(m=>{
        let o=document.createElement("option");
        o.text=m;
        sel.add(o);
    });
    sel.onchange=()=>loadTipi(row);
    loadTipi(row);
}

function loadTipi(row){
    let marca=row.querySelector(".filamentoMarca").value;
    let tipi=[...new Set(filaments.filter(f=>f.marca==marca).map(f=>f.tipo))];
    let sel=row.querySelector(".filamentoTipo");
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
    let marca=row.querySelector(".filamentoMarca").value;
    let tipo=row.querySelector(".filamentoTipo").value;
    let colori=filaments.filter(f=>f.marca==marca && f.tipo==tipo);
    let sel=row.querySelector(".filamentoColore");
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
    let marca=row.querySelector(".filamentoMarca").value;
    let tipo=row.querySelector(".filamentoTipo").value;
    let colore=row.querySelector(".filamentoColore").value;
    let f=filaments.find(x=>x.marca==marca && x.tipo==tipo && x.colore==colore);
    let price=Math.ceil((f.prezzo/1000)*1000)/1000;
    row.querySelector(".filamentoCosto").innerText=price.toFixed(3);
}

function calcRow(row){
    let g=row.querySelector(".filamentoGrammi").value||0;
    let p=row.querySelector(".filamentoCosto").innerText||0;
    let total=g*p;
    row.querySelector(".filamentoTotal").innerText=total.toFixed(2);
    updateTotals();
}

// ACCESSORI
function addAccessory(){
    if(accessoryCount>=maxAccessories) return;
    accessoryCount++;
    let table=document.getElementById("accessoryTable");
    let row=table.insertRow();
    row.innerHTML=`
<td><input class="accessoryName"></td>
<td><input type="number" class="accessoryPrice" oninput="calcAccessoryRow(this.parentElement.parentElement)"></td>
<td><input type="number" class="accessoryQty" oninput="calcAccessoryRow(this.parentElement.parentElement)"></td>
<td class="accessoryTotal"></td>
<td><button class="removeBtn" onclick="removeRow(this)">X</button></td>
`;
}

function calcAccessoryRow(row){
    let price=row.querySelector(".accessoryPrice").value||0;
    let qty=row.querySelector(".accessoryQty").value||0;
    let total=price*qty;
    row.querySelector(".accessoryTotal").innerText=total.toFixed(2);
    updateTotals();
}

// TOTALI
function updateTotals(){
    let mat=0;
    document.querySelectorAll("#filamentTable .filamentoRow").forEach(r=>{
        let c=r.querySelector(".filamentoTotal");
        if(c) mat+=Number(c.innerText||0);
    });
    document.getElementById("matCost").innerText=mat.toFixed(2);

    let acc=0;
    document.querySelectorAll(".accessoryTotal").forEach(a=>acc+=Number(a.innerText||0));
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
    let cost=Number(document.getElementById("totalCost").innerText);
    let profit=sale-cost;
    document.getElementById("profit").value=profit.toFixed(2);
}

// AVVIO
showTab("nuova");
