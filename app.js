// NUOVA STAMPA
function newPrintPage(){
    filamentCount=0;
    accessoryCount=0;

    let html=` 
<h2>Nuova Stampa</h2>

<!-- Nome stampa -->
<div>
    <label>Nome Stampa</label>
    <input id="printName" style="width:calc(100% - 12px);text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
</div>

<!-- Stampante -->
<div>
    <h3>Stampante</h3>
    <select id="printerSelect" style="width:calc(100% - 12px)"></select>
    <label>Consumo (W/h)</label>
    <input id="printerPower" readonly maxlength="4" style="width:70px;">
</div>

<!-- Stampa -->
<div>
    <h3>Stampa</h3>
    <div class="tempo">
        <label>Tempo stampa</label>
        <input id="hours" type="number" placeholder="Ore" oninput="updateTotals()" style="width:60px;text-align:center;">
        <span>:</span>
        <input id="minutes" type="number" placeholder="Min" oninput="updateTotals()" style="width:60px;text-align:center;">
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
