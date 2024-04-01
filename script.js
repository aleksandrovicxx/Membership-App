let buttonForCreateVaucher = document.getElementById('create-vaucher-button')
let jmbgInput = document.getElementById('input-jmbg')
let imeIPrezimeInput = document.getElementById('iip')
let regInput = document.getElementById('reg')
let selectElement = document.getElementById('location')
let box4 = document.getElementById('box4')
let uniqueCode = 2
let presevo = db.collection('Presevo')
let elementForPrintVaucher = document.createElement('div')




// Create SET
buttonForCreateVaucher.addEventListener('click', ()=>{
    let selectedLocation = selectElement.options[selectElement.selectedIndex];
    uniqueCode++
    let cust = {
        jmbg: jmbgInput.value,
        imeIPrezime: imeIPrezimeInput.value,
        regOznaka: regInput.value,
        lokacija: selectedLocation.value,
        jedinstveniKod: uniqueCode,
        njegoveStranke: {
            regOznakaStranke: {},
        }
    }
    
    db.collection('Presevo').doc(`${cust.jmbg}`)
    .set(cust)
    .then(() => {
        let divMsg = document.createElement('div')
        divMsg.innerHTML = `${imeIPrezimeInput.value} uspesno dodat u bazu`
        box4.appendChild(divMsg)
        jmbgInput.value = ''
        imeIPrezimeInput.value = ''
        regInput.value = ''
        selectedLocation.value = ''
    })
    .catch((e)=>{
        console.log(`Desila se greska ${e}`);
    })
})













/*                    ___
doc.set -> create        |
doc.get -> read           \ _ Vracaju nam promise.
doc.update -> update      /   Nakon ovih poziva 
doc.delete -> delete  ___|    lancaju se .then() i .catch()
*/