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

// ... tutte le funzioni filamenti, accessori e calcoli restano identiche alla versione precedente
// updateTotals(), updateSale(), updateProfit(), addFilamentRow(), addAccessory(), calcRow(), calcAccessoryRow()...
