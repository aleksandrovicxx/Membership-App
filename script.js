let buttonForCreateVaucher = document.getElementById('create-vaucher-button')
let jmbgInput = document.getElementById('input-jmbg')
let imeIPrezimeInput = document.getElementById('iip')
let regInput = document.getElementById('reg')
let selectElement = document.getElementById('location')
let box4 = document.getElementById('box4')
let presevo = db.collection('Presevo')
let elementForPrintVaucher = document.createElement('div')




// Create SET
buttonForCreateVaucher.addEventListener('click', ()=>{
    uniqueCodeFunc = () => {
       let date = new Date()
       let day = date.getDay()
       let month = date.getMonth()+1
       let year = date.getFullYear()
       let hours = date.getHours()
       let minutes = date.getMinutes()
       let milisekundes = date.getMilliseconds()
       
       return `${day}${month}${year}${hours}${minutes}${milisekundes}`;    
    }
    let divMsg = document.createElement('div')
    box4.appendChild(divMsg)
    let uniqueCode = uniqueCodeFunc()
    
    if(jmbgInput.value.length!=13){
        console.log('da');
        divMsg.innerHTML = 'PROVERI JMBG'
    } else if (regInput.value.length <7){
        divMsg.innerHTML = 'PROVERI REG.OZNAKU'
    } else {
        let selectedLocation = selectElement.options[selectElement.selectedIndex];
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
        
        db.collection(`${selectedLocation.value}`).doc(`${cust.jmbg}`)
        .set(cust)
        .then(() => {
            divMsg.innerHTML = `${imeIPrezimeInput.value} uspesno dodat u bazu`
            jmbgInput.value = ''
            imeIPrezimeInput.value = ''
            regInput.value = ''
            selectedLocation.value = ''
        })
        .catch((e)=>{
            console.log(`Desila se greska ${e}`);
        })
    }
})

    













/*                    ___
doc.set -> create        |
doc.get -> read           \ _ Vracaju nam promise.
doc.update -> update      /   Nakon ovih poziva 
doc.delete -> delete  ___|    lancaju se .then() i .catch()
*/