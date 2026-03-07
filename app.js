// Funzione per mostrare la scheda selezionata
function showTab(tab){
    let content=document.getElementById('content');
    content.innerHTML=''; // reset contenuto

    if(tab=='nuova'){
        content.innerHTML=`
            <h2>Nuova Stampa</h2>
            <label>Nome Stampa</label><input id="nomeStampa">
            <label>Stampante</label><select id="stampante"></select>
            <label>Tempo stampa</label>
            <div class="tempo">
                <input id="ore" type="number" placeholder="HH" max="99">
                <span>:</span>
                <input id="minuti" type="number" placeholder="MM" max="59">
            </div>
            <h3>Filamenti</h3>
            <div id="listaFilamenti"></div>
            <button onclick="aggiungiFilamento()">+ Aggiungi Filamento</button>
        `;
    }

    if(tab=='stampanti'){
        content.innerHTML=`
            <h2>Database Stampanti</h2>
            <div id="stampantiTable"></div>
        `;
    }

    if(tab=='filamenti'){
        content.innerHTML=`
            <h2>Database Filamenti</h2>
            <div id="filamentiTable"></div>
        `;
    }

    if(tab=='storico'){
        content.innerHTML=`
            <h2>Storico Stampe</h2>
            <div id="storicoTable"></div>
        `;
    }
}

// gestione filamenti (solo struttura base)
let contatoreFilamenti=0;
const maxFilamenti=10;

function aggiungiFilamento(){
    if(contatoreFilamenti>=maxFilamenti) return;
    contatoreFilamenti++;

    let div=document.createElement('div');
    div.className='filamentoRow';
    div.id='fil'+contatoreFilamenti;
    div.innerHTML=`
        <select><option>Marca</option></select>
        <select><option>Tipo</option></select>
        <select><option>Colore</option></select>
        <input type="number" placeholder="Grammi">
        <button onclick="eliminaFilamento('${div.id}')">X</button>
    `;

    document.getElementById('listaFilamenti').appendChild(div);
}

function eliminaFilamento(id){
    let elem=document.getElementById(id);
    if(elem){
        elem.remove();
        contatoreFilamenti--;
    }
}

// inizializzazione scheda Nuova Stampa al caricamento
showTab('nuova');
