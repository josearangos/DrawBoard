
// Nota: Una linea es la diferencia de dos coordenadas
// un incio  y un fin por lo tanto se manejan dos coordenas

var flagLine = false, //usada para determinar si se realizo un punto o una linea a mano alzada
        previousX = 0,// pocision anterior en x
        currentX = 0,// pocision actual en X
        previousY = 0,// pocision anterior en y
        currentY = 0,// pocision actual en y
        pointFlag = false;//usada para indicar que se realizo un punto

var canvas = document.getElementById("myCanvas");// capturamos el canvas del DOM
var context = canvas.getContext("2d");//retorna un contexto de dibujo en el lienzo, o null si el identificador del contexto no está soportado.

//Matriculamos el canvas como escuchador de los siguientes eventos 
// necesarion para capturar las coordendas del dibujo en el canvas
canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
}, false);

//
function findxy(res, e) {
    if (res == 'down') {
        previousX = currentX;// avanzamos ya que se va ha realizar una lineas
        previousY = currentY;
        currentX = e.clientX - canvas.offsetLeft;//diferencia entre la cordenado de inicio y fin DE X
        currentY = e.clientY - canvas.offsetTop;//diferencia entre la cordenado de inicio y fin DE Y

        flagLine = true;//significa que se realizara una linea y no un punto
        pointFlag = true;
        if (pointFlag) {
            pointFlag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flagLine = false;// significa que se esta fuera del canvas o arriba de este
    }
    if (res == 'move') {// si hay movimiento y no es un punto se procede a pintar en el canvas
        if (flagLine) {
            previousX = currentX;
            previousY = currentY;
            currentX = e.clientX - canvas.offsetLeft;//offsetLeft devuelve la posición izquierda (en píxeles)
            currentY = e.clientY - canvas.offsetTop;//offsetTop devuelve la posición superior (en píxeles)
            defineImage();//se consturye parte del dibujo para luego pintarlo en el canvas
        }
    }
}


function defineImage(evt) {//se capturan los datos del pincel, su tamaño y color

    var brushColor = document.brushForm.brushColor; // captura el color del pincel
    var brushSize = document.brushForm.brushSize;// captura el tamaño del pincel

    var json = JSON.stringify({ // se crea el JSON enviado para se dibujado
        "brushColor": brushColor.value,
        "brushSize": brushSize.value,
        "coords": {
            "previousX": previousX,
            "previousY": previousY,
            "currentX": currentX,
            "currentY": currentY
        }
    });
    drawImage(json);
    sendText(json);// se envia igualmente a todos los peers para que estos vean el dibujo
}


function drawImage(image) {// se dibuja en el canvas         
    console.log("dibujando Imagen en el canvas");
    var json = JSON.parse(image);// se parcea el objeto para poder obtener la informacion que tiene
    context.beginPath();//Comienza una ruta o restablece la ruta actual para el dibujo
    context.moveTo(json.coords.previousX, json.coords.previousY);
    context.lineTo(json.coords.currentX, json.coords.currentY);
    context.strokeStyle = json.brushColor;//se le indica al contexto el color del pincel
    context.arc(json.coords.currentX, json.coords.currentY, json.brushSize, 0, Math.PI * 2, false);
    context.linewidth = json.brushSize;// se le indica al contexto el tamaño del pincel
    context.stroke();// se dibuja el camino entre las coordena anterior y actual
    context.closePath();//Crea una ruta desde el punto actual hasta el punto de partida
}


function Fremove() {
    // Generamos una alerta de advetencia indicando que se borrara el contenido del tablero
    swal({
        title: "Esta seguro?",
        text: "Si eliminas el contenido del tablero no lo volvera a ver :)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            swal("Se ha eliminado el contenido del tablero", {
                icon: "success",
            });
            // luego de emitir el mensaje, si el usuario desea continuar 
            // se limpia el contexto del canvas con la funcion restore();
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.restore();
            

        } else {
            swal("No se elimino el contenido del tablero !!!");
        }
    });
}
// funcion que guarda la imagen 
function Fsave() {   
    var imageToSave = document.getElementById("btnsave");// se activa cuando el evento click sea activado 
        imageToSave.addEventListener("click", function () {  //   atraves del boton btnsave   
        var date = canvas.toDataURL("image/png",0.1);// se define la ruta,tipo y calidad de la image
        date = date.replace("image/png", "image/octet-stream");
        document.location.href = date;// se lanza la imagen para que esta se descarge automaticamente
    }, false);
    // Nota: La primera vez que se ejecuta esta funcion , toma unos segundos en responder, 
    // luego la descarga se realiza de manera inmmediata ya que parte de la imagen se encuentra en la cache 
    // del navegador
}






