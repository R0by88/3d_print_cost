function calcola(){

let stampante=document.getElementById("stampante").value
let filamento=document.getElementById("filamento").value

let tempo=parseFloat(document.getElementById("tempo").value)
let grammi=parseFloat(document.getElementById("grammi").value)
let accessori=parseFloat(document.getElementById("accessori").value)

let s=stampanti.find(x=>x.MODELLO==stampante)
let f=filamenti.find(x=>x.COLORE==filamento)

let consumo=s["CONSUMO (W/H)"]

let costoEnergia=(consumo/1000)*tempo*0.12

let costoFilamento=grammi*f["PREZZO (E/GR)"]

let totale=costoEnergia+costoFilamento+accessori

let iva=totale*0.22

let ricarico=totale*0.5

let vendita=totale+iva+ricarico

document.getElementById("risultato").innerHTML=

`
Energia: ${costoEnergia.toFixed(2)} €

Filamento: ${costoFilamento.toFixed(2)} €

Totale: ${totale.toFixed(2)} €

Prezzo vendita: ${vendita.toFixed(2)} €
`

}
