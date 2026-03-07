function apriTab(id){

document.querySelectorAll(".tab").forEach(t=>t.style.display="none")

document.getElementById(id).style.display="block"

}

function riempiMenu(){

let s=document.getElementById("stampante")

stampanti.forEach(x=>{

let o=document.createElement("option")

o.value=x.MODELLO
o.text=x.MARCA+" "+x.MODELLO

s.appendChild(o)

})

let f=document.getElementById("filamento")

filamenti.forEach(x=>{

let o=document.createElement("option")

o.value=x.COLORE
o.text=x.MARCA+" "+x.TIPO+" "+x.COLORE

f.appendChild(o)

})

}

function salva(){

let dati={

sheet:"storico",

nome:document.getElementById("nome").value,
stampante:document.getElementById("stampante").value

}

salvaStorico(dati)

alert("Salvato")

}
