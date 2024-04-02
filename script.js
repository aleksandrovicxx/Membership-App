let buttonForCreateVaucher = document.getElementById('create-vaucher-button')
let jmbgInput = document.getElementById('input-jmbg')
let imeIPrezimeInput = document.getElementById('iip')
let regInput = document.getElementById('reg')
let selectElement = document.getElementById('location')
let box4 = document.getElementById('box4')
let presevo = db.collection('Presevo')
let elementForPrintVaucher = document.createElement('div')
let buttonForAddPopust = document.getElementById('add-popust-button')
let buttonForCheckClientPopust = document.getElementById('check-client-popust')




buttonForCreateVaucher.addEventListener('click', ()=>{
    
    let location = document.querySelector("input[name='location']:checked").value
    
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
        let cust = {
            jmbg: jmbgInput.value,
            imeIPrezime: imeIPrezimeInput.value,
            regOznaka: regInput.value,
            lokacija: location,
            jedinstveniKod: uniqueCode,
            njegoveStranke: {
                regOznakaStranke: [],
                popust: 0,
            }
        }
        
        db.collection(`klijenti`).doc(`${cust.jmbg}`)
        .set(cust)
        .then(() => {
            divMsg.innerHTML = `${imeIPrezimeInput.value} dobio kod: ${uniqueCode} i smesten u bazu ${location}`
            jmbgInput.value = ''
            imeIPrezimeInput.value = ''
            regInput.value = ''
        })
        .catch((e)=>{
            console.log(`Desila se greska ${e}`);
        })
    }
})

buttonForAddPopust.addEventListener('click', () => {
    let unetKod = document.getElementById('input-for-code').value;
    let novaRegOznaka = document.getElementById('input-reg-new-customer').value;
    let divMsg = document.createElement('div');
    
    db.collection('klijenti')
    .where('jedinstveniKod', '==', unetKod)
    .get()
    .then(Snapshot => {
        if (Snapshot.empty) {
            divMsg.innerHTML = 'Kod ne postoji u bazi.';
            box4.appendChild(divMsg);
            return;
        }
        
        Snapshot.forEach(doc => {
            let popust = doc.data().njegoveStranke.popust || 0;
            let noviPopust = popust + 1;//<----OVDE DODAJEMO DODATNI POPUST UKOLIKO TREBA
            let regOznake = doc.data().njegoveStranke.regOznakaStranke || [];
            regOznake.push(novaRegOznaka);
            
            db.collection('klijenti')
            .doc(doc.id)
            .update({
                'njegoveStranke.popust': noviPopust,
                'njegoveStranke.regOznakaStranke': regOznake
            })
            .then(() => {
                divMsg.innerHTML = `USPESNO DODELJEN POPUST! <b><i>NAPRED MEGA TRADE!</b></i>.`;
                box4.appendChild(divMsg);
                document.getElementById('input-for-code').value = '';
                document.getElementById('input-reg-new-customer').value = '';
            })
            .catch(error => {
                console.error('Greška prilikom ažuriranja dokumenta:', error);
            });
        });
    })
    .catch(error => {
        divMsg.innerHTML = `Greška prilikom pretrage dokumenata: ${error}`;
        box4.appendChild(divMsg);
        console.log('ne');
    });
});


buttonForCheckClientPopust.addEventListener('click', () => {
    let inputForCheck = document.getElementById('input-for-check').value
    db.collection('klijenti')
    .where('jmbg', '==', inputForCheck)
    .get()
    .then(Snapshot =>{
        if (Snapshot.empty) {
            divMsg.innerHTML = 'Ne postoji klijent sa tim JMBG';
            box4.appendChild(divMsg);
            return;
        }
        Snapshot.forEach(doc =>{
            console.log(doc);
        })
    })



















/*                    ___
doc.set -> create        |
doc.get -> read           \ _ Vracaju nam promise.
doc.update -> update      /   Nakon ovih poziva 
doc.delete -> delete  ___|    lancaju se .then() i .catch()
*/