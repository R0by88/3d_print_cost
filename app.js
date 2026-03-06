let printers = JSON.parse(localStorage.getItem("printers")) || [];
let filaments = JSON.parse(localStorage.getItem("filaments")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function savePrinters(){
localStorage.setItem("printers",JSON.stringify(printers));
}

function saveFilaments(){
localStorage.setItem("filaments",JSON.stringify(filaments));
}

function saveHistory(){
localStorage.setItem("history",JSON.stringify(history));
}



function newPrintPage(){

let html="";

html+=`<div class="card">`;

html+=`<label>Nome stampa</label>`;
html+=`<input id="printName">`;

html+=`</div>`;


html+=`<div class="card">`;

html+=`<label>Stampante</label>`;

html+=`<select id="printerSelect">`;

printers.forEach((p,i)=>{
html+=`<option value="${i}">${p.brand} ${p.model}</option>`;
});

html+=`</select>`;

html+=`</div>`;


html+=`<div class="card">`;

html+=`<label>Materiale usato (grammi)</label>`;
html+=`<input id="grams" type="number">`;

html+=`</div>`;


html+=`<div class="card">`;

html+=`<label>Tempo stampa</label>`;

html+=`<div class="timeRow">`;

html+=`<div><label>Ore</label><input id="hours" type="number"></div>`;
html+=`<div><label>Min</label><input id="minutes" type="number"></div>`;

html+=`</div>`;

html+=`</div>`;


html+=`<div class="card">`;

html+=`<label>Costo extra €</label>`;
html+=`<input id="extraCost" type="number" step="0.01">`;

html+=`</div>`;


html+=`<button onclick="savePrint()">Salva stampa</button>`;

document.getElementById("app").innerHTML=html;

}



function savePrint(){

let name=document.getElementById("printName").value;

let printerIndex=document.getElementById("printerSelect").value;

let grams=parseFloat(document.getElementById("grams").value)||0;

let hours=parseFloat(document.getElementById("hours").value)||0;

let minutes=parseFloat(document.getElementById("minutes").value)||0;

let extra=parseFloat(document.getElementById("extraCost").value)||0;

let printer=printers[printerIndex];

let time=(hours+(minutes/60));

let energyCost=time*printer.consumption*0.12;

let materialCost=(grams/1000)*20;

let total=(materialCost+energyCost+extra).toFixed(2);

history.push({
name,
printer:printer.brand+" "+printer.model,
grams,
hours,
minutes,
extra,
total
});

saveHistory();

alert("Stampa salvata");

}



function historyPage(){

let html="";

history.forEach(h=>{

html+=`<div class="card">`;

html+=`<b>${h.name}</b><br>`;
html+=`Stampante: ${h.printer}<br>`;
html+=`Materiale: ${h.grams} g<br>`;
html+=`Tempo: ${h.hours}h ${h.minutes}m<br>`;
html+=`Costo: € ${h.total}`;

html+=`</div>`;

});

document.getElementById("app").innerHTML=html;

}



function printersPage(){

let html="";

html+=`<div class="card">`;

html+=`<label>Marca</label>`;
html+=`<input id="brand">`;

html+=`<label>Modello</label>`;
html+=`<input id="model">`;

html+=`<label>Consumo kWh</label>`;
html+=`<input id="consumption" type="number">`;

html+=`<button onclick="addPrinter()">Aggiungi stampante</button>`;

html+=`</div>`;


printers.forEach(p=>{

html+=`<div class="card">`;

html+=`${p.brand} ${p.model}<br>`;
html+=`Consumo: ${p.consumption} kWh`;

html+=`</div>`;

});

document.getElementById("app").innerHTML=html;

}



function addPrinter(){

let brand=document.getElementById("brand").value;

let model=document.getElementById("model").value;

let consumption=parseFloat(document.getElementById("consumption").value);

printers.push({brand,model,consumption});

savePrinters();

printersPage();

}



function filamentsPage(){

let html="";

html+=`<div class="card">`;

html+=`<label>Marca</label>`;
html+=`<input id="fbrand">`;

html+=`<label>Tipo</label>`;
html+=`<input id="ftype">`;

html+=`<label>Colore</label>`;
html+=`<input id="fcolor">`;

html+=`<label>Prezzo €/kg</label>`;
html+=`<input id="fprice" type="number" step="0.01">`;

html+=`<button onclick="addFilament()">Aggiungi filamento</button>`;

html+=`</div>`;


filaments.forEach(f=>{

html+=`<div class="card">`;

html+=`${f.brand} - ${f.type} - ${f.color}<br>`;
html+=`€ ${f.price}/kg`;

html+=`</div>`;

});

document.getElementById("app").innerHTML=html;

}



function addFilament(){

let brand=document.getElementById("fbrand").value;

let type=document.getElementById("ftype").value;

let color=document.getElementById("fcolor").value;

let price=parseFloat(document.getElementById("fprice").value);

filaments.push({brand,type,color,price});

saveFilaments();

filamentsPage();

}
