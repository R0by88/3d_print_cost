let contatoreFilamenti=0
let maxFilamenti=10


function apriMenu(menu){

document.getElementById("menuPrincipale").classList.add("hidden")

document.getElementById(menu).classList.remove("hidden")

}


function tornaMenu(){

document.querySelectorAll(".container").forEach(el=>{

el.classList.add("hidden")

})

document.getElementById("menuPrincipale").classList.remove("hidden")

}



function aggiungiFilamento(){

if(contatoreFilamenti>=maxFilamenti) return

contatoreFilamenti++

let riga=document.createElement("div")

riga.className="filamentoRow"

riga.id="fil"+contatoreFilamenti

riga.innerHTML=`

<select>

<option>Marca</option>

</select>

<select>

<option>Tipo</option>

</select>

<select>

<option>Colore</option>

</select>

<input placeholder="grammi" type="number">

<button onclick="eliminaFilamento('fil${contatoreFilamenti}')">X</button>

`

document.getElementById("listaFilamenti").appendChild(riga)

}


function eliminaFilamento(id){

document.getElementById(id).remove()

contatoreFilamenti--

}
