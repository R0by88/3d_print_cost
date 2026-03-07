const API = "https://script.google.com/macros/s/AKfycbxRJZtJk6JWsn-WRpJOtIj4DyoqOEcJ4Mo3l8F-zaZjB3Fguz7DbfiC6ghbha2-bmUM/exec"


async function caricaStampanti(){

const res = await fetch(API + "?sheet=stampanti")
const data = await res.json()

const select = document.getElementById("stampante")

data.forEach(s=>{
let option = document.createElement("option")
option.value = s.MODELLO
option.text = s.MARCA + " " + s.MODELLO
select.appendChild(option)
})

}

async function salva(){

let dati = {

sheet:"storico",

nome:document.getElementById("nome").value,
stampante:document.getElementById("stampante").value,
tempo:document.getElementById("tempo").value,
filamento:document.getElementById("filamento").value,
accessori:document.getElementById("accessori").value,
pezzi:document.getElementById("pezzi").value

}

await fetch(API,{
method:"POST",
body:JSON.stringify(dati)
})

alert("Stampa salvata!")

}

caricaStampanti()
