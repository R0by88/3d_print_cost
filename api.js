const API="https://script.google.com/macros/s/AKfycbxRJZtJk6JWsn-WRpJOtIj4DyoqOEcJ4Mo3l8F-zaZjB3Fguz7DbfiC6ghbha2-bmUM/exec"

let stampanti=[]
let filamenti=[]

async function caricaDatabase(){

let s=await fetch(API+"?sheet=stampanti")
stampanti=await s.json()

let f=await fetch(API+"?sheet=filamenti")
filamenti=await f.json()

riempiMenu()

}

async function salvaStorico(dati){

await fetch(API,{

method:"POST",
body:JSON.stringify(dati)

})

}

caricaDatabase()
