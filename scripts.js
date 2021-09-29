const cards = document.querySelectorAll('.cartas');
let haGirado = false;
let primeraCarta, segundaCarta;
let bloqueoTablero = false; //crea variable para lockear el juego para que no se pueda hacer click en mas de dos cartas a la vez
var puntos = 0;
var contador = 0;

function girarCarta(){
    if(bloqueoTablero) return; //si  esta activado no deja que la funcion siga
    if (this ===primeraCarta) return;  //no permite que se haga doble click en la misma carta

    this.classList.toggle('flip');

    if (!haGirado) {
        // first click
        haGirado = true;
        primeraCarta = this; 
        return;
    }
    // second click
    segundaCarta = this;

    //llama la funcion para verificar si son iguales
    comprobarMatch();
    
}

function comprobarMatch(){

    if (primeraCarta.dataset.framework === segundaCarta.dataset.framework) {
        // son iguales!!!
        desactivarCartas();
        puntos = puntos + 20;
        contador ++;
        // console.log(puntos);
        victory();
    }else{
        deshacerGiro();
        puntos = puntos -5;
    }

   
}

function desactivarCartas(){
    primeraCarta.removeEventListener('click', girarCarta);
    segundaCarta.removeEventListener('click',girarCarta);

    resetearTablero();
}

function deshacerGiro(){
    //activa el bloqueoTablero hasta que las cartas se vuelvan a girar
    bloqueoTablero = true;

    //no son iguales :(, hace falta quitar el flip, pero antes dejamos un tiempo para que se vea que no son iguales 
    setTimeout(() => {
        primeraCarta.classList.remove('flip');
        segundaCarta.classList.remove('flip');

        resetearTablero();
    }, 1000);
}

function resetearTablero(){
    //cambia el valor de las variables, por el destructuring assignment
    // destructuring assignment permite asignar valores a las variables del array
    [haGirado, bloqueoTablero] = [false, false]; 
    [primeraCarta, segundaCarta] = [null, null];
}

(function embarajar(){
    //funcion para generar un numero aleatorio para cada carta y que se distribuian aleatoriamente
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12 ); //genera el numero aleatorio
        card.style.order = randomPos;
    });
})(); //los parentesis antes y despues llaman la funcion imediatamente una vez que cree la pagina 

//llama la funcion de girar el card para cada card cuando se haga click
cards.forEach(card => card.addEventListener('click', girarCarta));

// funcion para checkear si has ganado
function victory(){
    setTimeout(() => {
        if (contador === 2) {
            //creamos el modal y ponemos las propriedades necesarias para que no se cierre cuando se clica afuera
            var elModal = new bootstrap.Modal(document.getElementById('modalWinner'),{backdrop: 'static', keyboard: false});
            elModal.show()  
            
            //imprimimos la puntuacion para la persona vea
            document.getElementById("puntuacion").innerHTML = puntos;
            
        }
    }, 200);
    
}
//funcion para volver a jugar
function restart(){
    location.reload();
    return false;
}

let win = [];

//funcion para guardar los datos en un json
function saveHistory(){
    let fecha = new Date().toLocaleDateString();
    const miNombre= document.getElementById("elNombre").value;
    var id = 1;
    let newWin= {id: id,nombre: miNombre, puntuacion: puntos, fecha_victoria: fecha};

    if (localStorage.getItem("victorys")===null) {
        
        win.push(newWin);
        const myJSON = JSON.stringify(win);
        localStorage.setItem("victorys", myJSON);
    } else {
        //get local storage and locate it on temporary variable
        let anadirPartido= JSON.parse(localStorage.getItem("victorys"));
        win = [...anadirPartido];
        //asignamos un id que se incrementa con el array
        id = win.length + 1;
        newWin= {id: id,nombre: miNombre, puntuacion: puntos, fecha_victoria: fecha};
        win.push(newWin);
        const myJSON = JSON.stringify(win);
        localStorage.setItem("victorys", myJSON);
    }

    
    // cambiamos de ventana a la pagina del historial
    window.location.href= "victory.html";  
}



//funcion para imprimir el html
function loadVictorys(){
    // recuperamos lo del localStorage
    let text = localStorage.getItem("victorys");
    let obj = JSON.parse(text);  
    //anadimos el html para la tabla
    let newHTMl = '';    
    //para cada elemento del array se imprime eso
    for (let index of obj) {
        newHTMl += '<tr><td>'+index.id+'</td><td>'+index.nombre+'</td><td>'+index.puntuacion+'</td><td>'+index.fecha_victoria+'</td></tr>';
    }
    document.getElementById('tablaPartidos').innerHTML = newHTMl;
   
}