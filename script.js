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
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let milisekundes = date.getMilliseconds()
        return `${day}${month}${year}${hours}${minutes}${milisekundes}`;    
    }
    let uniqueCode = uniqueCodeFunc()
    
    if(jmbgInput.value.length!=13){
        alert('PROVERI JMBG')
    } else if (regInput.value.length <7){
        alert('PROVERI REG.OZNAKU')
    } else {

        var printWindow = window.open(`printPage.html?imeIPrezime=${imeIPrezimeInput.value}&uniqueCode=${uniqueCode}`)
        printWindow.onload = function () {
            printWindow.print(  )
        }
        
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
            alert(`${imeIPrezimeInput.value} dobio kod: ${uniqueCode} i smesten u bazu ${location}`) 
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
            alert('Kod ne postoji u bazi.');
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
                alert(`USPESNO DODELJEN POPUST! NAPRED MEGA TRADE!`);
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
        alert(`Greška prilikom pretrage dokumenata: ${error}`);
        box4.appendChild(divMsg);
        console.log('ne');
    });
});


buttonForCheckClientPopust.addEventListener('click', () => {
    let divMsg = document.createElement('div');
    let ximg = document.createElement('img')
    ximg.classList.add('x')
    ximg.src = 'media/x.png'
    let inputForCheck = document.getElementById('input-for-check').value
    db.collection('klijenti')
    .where('jmbg', '==', inputForCheck)
    .get()
    .then(Snapshot =>{
        if (Snapshot.empty) {
            alert('Ne postoji klijent sa tim JMBG');
            box4.appendChild(divMsg);
            return;
        }
        Snapshot.forEach(doc =>{
            let njegovPopust = (doc.data().njegoveStranke.popust);
            divMsg.innerHTML = `Popust koji je ostvario ${doc.data().imeIPrezime} je <b>${njegovPopust}%</b> <br> Popust je dobio od: ${doc.data().njegoveStranke.regOznakaStranke}`
            divMsg.appendChild(ximg)
            box4.appendChild(divMsg)
            divMsg.addEventListener('click', () =>{
                divMsg.remove()
            })
            document.getElementById('input-for-check').value = ''
        })
    })
})













