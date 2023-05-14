// ver todos:  Veo toda la mercadería que no está borrada, esta función se invoca al cargar la página
const todos = () => {
  // cambio el título a Agregar y ver Mercadería
  let titulo = document.querySelector("#titMercaderia");
  titulo.innerHTML = "Agregar y ver mercadería";

  // tengo que habilitar la forma de ingreso de datos
  let edicion = document.querySelector(".forma"); // uso querySelector con un id para identificar las formas de texto
  edicion.style.display = "block";

  // tengo que volver a habilitar el boton Guardar, el boton Inicio y el papelera
  let guardar = document.querySelector("#botonGuardar"); // uso querySelector con un id para identificar al boton "#botonGuardar"
  let inicio = document.querySelector("#botonInicio"); // uso querySelector con un id para identificar al boton "#botonInicio"
  let papelera = document.querySelector("#botonPapelera"); // uso querySelector con un id para identificar al boton "#botonPapelera"

  guardar.classList.remove("disabled"); // habilito la funcion del boton "#botonGuardar" sacando la clase deshabilitado
  inicio.classList.remove("disabled"); // habilito la funcion del boton "#botonInicio" eliminando la clase deshabilitado
  papelera.classList.remove("disabled"); // habilito la funcion del boton "#botonPapelera" eliminando la clase deshabilitado

  // debo restaurar los th a los textos originales de los botones borrar y editar.
  let borrar = document.querySelector("#borrar"); // uso querySelector con un id para identificar al th borrar
  let editar = document.querySelector("#editar"); // uso querySelector con un id para identificar al th editar
  borrar.innerHTML = "Borrar"; // cambio el texto Borrar por Reciclar
  editar.innerHTML = "Editar"; // cambio el texto Editar por Eliminar

  // leer documentos
  let tabla = document.getElementById("tabla"); // guardo en tabla la identificación de la tabla en el HTML
  // usamos onSnapshot para que se actualice en tiempo real
  // la pantalla con los cambios en la base
  db.collection("mercaderia")
    .orderBy("nombre") // asi ordeno por apellido, agregando orderBy('campo')
    .onSnapshot((querySnapshot) => {
      tabla.innerHTML = ""; // limpio la tabla ante cada cambio
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        // poblamos la tabla agregando a cada fila una fila nueva hasta terminar con todos los datos
        if (doc.data().borrar == "N") {
          // mostramos aquellos campos donde borrar es igual a N
          tabla.innerHTML += `<tr>
          <td>${doc.data().codigo}</td>
          <td>${doc.data().nombre}</td>
          <td>${doc.data().envase}</td>
          <td>${doc.data().cantidad}</td>
          <td>${doc.data().especie}</td>
          <td>${doc.data().calidad}</td>
          <td>${doc.data().fecha}</td>
          <td><button class="btn btn-warning bi bi-trash" style="font-size: 10px" onClick="borrar('${
            doc.id // tengo que pasar a la función el parámetro id
          }')"></td>
          <td><button class="btn btn-dark bi bi-pen" style="font-size: 10px" onClick="editar('${
            doc.id // tengo que pasar TODOS los datos a la función para poder editarlos
          }','${doc.data().nombre}','${doc.data().envase}','${
            doc.data().cantidad
          }','${doc.data().especie}','${doc.data().calidad}')"></td> 
          </tr>`;
        }
      });
    });
};

// agregar mercaderia
const guardar = () => {
  // si el campo nombre es nulo no dejamos agregar la mercaderia
  let nombre = document.getElementById("nombre").value;
  if (nombre.length != 0) {
    // Cuando estoy en Guardar tengo que deshabilitar el boton Menu Inicio, Ver Todos y Papelera
    let inicio = document.querySelector("#botonInicio"); // uso querySelector con un id para identificar al boton "#botonInicio"
    let todos = document.querySelector("#botonTodos"); // uso querySelector con un id para identificar al boton "#botonGuardar"
    let papelera = document.querySelector("#botonPapelera"); // uso querySelector con un id para identificar al boton "#botonPapelera"
    inicio.classList.add("disabled"); // deshabilito la funcion del boton "#botonInicio" agregando la clase deshabilitado
    todos.classList.add("disabled"); // deshabilito la funcion del boton "#botonTodos" agregando la clase deshabilitado
    papelera.classList.add("disabled"); // deshabilito la funcion del boton "#botonPapelera" agregando la clase deshabilitado

    // capturo los textos de los campos input
    let codigo = generateId(); // genero un código aleatorio como id para el usuario
    let envase = document.getElementById("envase").value;
    let cantidad = document.getElementById("cantidad").value;
    let especie = document.getElementById("especie").value;
    let calidad = document.getElementById("calidad").value;
    let fecha = getDate(); // guardo la fecha del día donde se cargó la mercadería
    let borrar = "N"; // cuando agrego mercadería no está borrada

    db.collection("mercaderia") // "mercadería" es el nombre de la colección
      .add({
        // agrego los documentos
        codigo: codigo,
        nombre: nombre,
        envase: envase,
        cantidad: cantidad,
        especie: especie,
        calidad: calidad,
        fecha: fecha,
        borrar: borrar,
      })
      .then((docRef) => {
        inicio.classList.remove("disabled"); // habilito la funcion del boton "#botonInicio" eliminando la clase deshabilitado
        todos.classList.remove("disabled"); // habilito la funcion del boton "#botonTodos" eliminando la clase deshabilitado
        papelera.classList.remove("disabled"); // habilito la funcion del boton "#botonPapelera" eliminando la clase deshabilitado

        console.log("Document written with ID: ", docRef.id); // Limpio los campos luego de ingresar los nombres
        let nombre = (document.getElementById("nombre").value = "");
        let envase = (document.getElementById("envase").value = "");
        let cantidad = (document.getElementById("cantidad").value = "");
        let especie = (document.getElementById("especie").value = "");
        let calidad = (document.getElementById("calidad").value = "");
        // si se pudo agregar la mercadería mando un mensaje
        Toastify({
          text: "La mercaderia se agregó correctamente",
          duration: 3000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: (type = "green"),
          },
        }).showToast();
      })
      .catch((error) => {
        inicio.classList.remove("disabled"); // habilito la funcion del boton "#botonInicio" eliminando la clase deshabilitado
        todos.classList.remove("disabled"); // habilito la funcion del boton "#botonTodos" eliminando la clase deshabilitado
        papelera.classList.remove("disabled"); // habilito la funcion del boton "#botonPapelera" eliminando la clase deshabilitado
        console.error("Error adding document: ", error);
      });
  } else {
    // si el nombre es nulo mando un mensaje por Toastify avisando
    Toastify({
      text: "El nombre no puede ser nulo!",
      duration: 3000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: (type = "red"),
      },
    }).showToast();
  }
};

// Eliminar mercaderia de la papelera de reciclaje
const eliminar = (id) => {
  db.collection("mercaderia")
    .doc(id) // borro el documento cuyo id le pase para borrar
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      Toastify({
        text: "La mercaderia se eliminó de la papelera",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: (type = "red"),
        },
      }).showToast();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};

// borrar mercadería, solo debo editar el campo "borrar" y cambiar el "N" por "S"
const borrar = (id) => {
  db.collection("mercaderia")
    .doc(id)
    .update({
      borrar: "S",
    })
    .then(() => {
      console.log("Document changed borrar to S!");
      Toastify({
        text: "La mercaderia se envió a la papelera",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "Yellow",
          color: "Black",
        },
      }).showToast();
    })
    .catch((error) => {
      console.error("Error changing borrar from N to S", error);
    });
};

// reciclar mercaderia, solo debo editar el campo "borrar" y cambiar el "S" por "N"
const reciclar = (id) => {
  db.collection("mercaderia")
    .doc(id)
    .update({
      borrar: "N",
    })
    .then(() => {
      console.log("Document changed borrar to N!");
      Toastify({
        text: "La mercaderia se recicló de la papelera",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: (type = "green"),
        },
      }).showToast();
    })
    .catch((error) => {
      console.error("Error changing borrar from S to N", error);
    });
};

// editar mercaderia
// tengo que pasar todas las variables a editar como parámetros
const editar = (id, nombre, envase, cantidad, especie, calidad) => {
  // cambio el título de Agregar por Editar
  let titulo = document.querySelector("#titMercaderia");
  titulo.innerHTML = "Editar Mercadería";

  // Cuando estoy en Editar tengo que deshabilitar el boton Menu Inicio, Ver Todos y Papelera
  let inicio = document.querySelector("#botonInicio"); // uso querySelector con un id para identificar al boton "#botonInicio"
  let todos = document.querySelector("#botonTodos"); // uso querySelector con un id para identificar al boton "#botonGuardar"
  let papelera = document.querySelector("#botonPapelera"); // uso querySelector con un id para identificar al boton "#botonPapelera"
  inicio.classList.add("disabled"); // deshabilito la funcion del boton "#botonInicio" agregando la clase deshabilitado
  todos.classList.add("disabled"); // deshabilito la funcion del boton "#botonTodos" agregando la clase deshabilitado
  papelera.classList.add("disabled"); // deshabilito la funcion del boton "#botonPapelera" agregando la clase deshabilitado

  // asi llenamos los campos de input con los datos de la fila que estamos editando
  // console.log(id);
  document.getElementById("nombre").value = nombre;
  document.getElementById("envase").value = envase;
  document.getElementById("cantidad").value = cantidad;
  document.getElementById("especie").value = especie;
  document.getElementById("calidad").value = calidad;

  let boton = document.getElementById("botonGuardar"); // quiero ubicar el boton par cambiarle el nombre durante la edicion
  boton.innerHTML = "Guardar cambios"; // cambio el texto del boton cuando edito
  boton.onclick = () => {
    // creo una función que edita los datos
    let editar = db.collection("mercaderia").doc(id);
    // guardo los datos que el usuario pone en la edición
    let nombre = document.getElementById("nombre").value;
    //  No permito que en la edición el nombre quede nulo
    if (nombre.length == 0) {
      Toastify({
        text: "El nombre no puede ser nulo!",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: (type = "red"),
        },
      }).showToast();
      return;
    }
    let envase = document.getElementById("envase").value;
    let cantidad = document.getElementById("cantidad").value;
    let especie = document.getElementById("especie").value;
    let calidad = document.getElementById("calidad").value;
    return editar
      .update({
        // cuales son los campos para hacer el update
        nombre: nombre,
        envase: envase,
        cantidad: cantidad,
        especie: especie,
        calidad: calidad,
      })
      .then(() => {
        console.log("Document successfully updated!");
        Toastify({
          text: "La mercaderia se editó correctamente",
          duration: 3000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: (type = "green"),
          },
        }).showToast();
        inicio.classList.remove("disabled"); // habilito la funcion del boton "#botonInicio" eliminando la clase deshabilitado
        todos.classList.remove("disabled"); // habilito la funcion del boton "#botonTodos" eliminando la clase deshabilitado
        papelera.classList.remove("disabled"); // habilito la funcion del boton "#botonPapelera" eliminando la clase deshabilitado
        boton.innerHTML = "Guardar"; // vuelvo a cambiar el texto por guardar

        let nombre = (document.getElementById("nombre").value = ""); // Limpio los campos luego de ingresar los nombres
        let envase = (document.getElementById("envase").value = "");
        let cantidad = (document.getElementById("cantidad").value = "");
        let especie = (document.getElementById("especie").value = "");
        let calidad = (document.getElementById("calidad").value = "");
        //Espero 2 segundos y recargo la página para evitar que agregar sobre escriba si agrego luego de editar
        // asi puedo mostrar el mensaje de edición
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        // recargo la página para evitar que agregar sobre escriba si agrego luego de editar
        // window.location.reload(); // actualización:  No es necesario recargar
        console.error("Error updating document: ", error);
      });
  };
};

// función que me permite reciclar un elemento borrado
const papelera = () => {
  // cambio el título de Agregar Mercadería por Papelera de Reciclaje
  let titulo = document.querySelector("#titMercaderia");
  titulo.innerHTML = "Papelera de Reciclaje";

  // Cuando estoy en la papelera tengo que deshabilitar el boton Guardar, el boton Inicio y el papelera
  let guardar = document.querySelector("#botonGuardar"); // uso querySelector con un id para identificar al boton "#botonGuardar"
  let inicio = document.querySelector("#botonInicio"); // uso querySelector con un id para identificar al boton "#botonInicio"
  let papelera = document.querySelector("#botonPapelera"); // uso querySelector con un id para identificar al boton "#botonPapelera"
  guardar.classList.add("disabled"); // deshabilito la funcion del boton "#botonGuardar" agregando la clase deshabilitado
  inicio.classList.add("disabled"); // deshabilito la funcion del boton "#botonInicio" agregando la clase deshabilitado
  papelera.classList.add("disabled"); // deshabilito la funcion del boton "#botonPapelera" agregando la clase deshabilitado

  // cuando estoy en la papelera debo ocultar las formas de ingreso y edicion de mercadería
  let edicion = document.querySelector(".forma");
  edicion.style.display = "none";

  // tengo que cambiar el texto de la columna de Editar por Reciclar y de Borrar por Eliminar
  let borrar = document.querySelector("#borrar"); // uso querySelector con un id para identificar al th borrar
  let editar = document.querySelector("#editar"); // uso querySelector con un id para identificar al th editar
  borrar.innerHTML = "Reciclar"; // cambio el texto Borrar por Reciclar
  editar.innerHTML = "Eliminar"; // cambio el texto Editar por Eliminar

  db.collection("mercaderia")
    .orderBy("nombre") // asi ordeno por apellido, agregando orderBy('campo')
    .onSnapshot((querySnapshot) => {
      tabla.innerHTML = ""; // limpio la tabla ante cada cambio
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        // console.log(doc.data().borrar);
        if (doc.data().borrar == "S") {
          // mostramos aquellos campos donde borrar es igual a S
          // poblamos la tabla agregando a cada fila una fila nueva hasta terminar con todos los datos
          tabla.innerHTML += `<tr>
          <td>${doc.data().codigo}</td>
          <td>${doc.data().nombre}</td>
          <td>${doc.data().envase}</td>
          <td>${doc.data().cantidad}</td>
          <td>${doc.data().especie}</td>
          <td>${doc.data().calidad}</td>
          <td>${doc.data().fecha}</td>
            <td><button class="btn btn-success bi bi-recycle" onClick="reciclar('${
              doc.id // tengo que pasar a la función el parámetro id
            }')"></td>
            <td><button class="btn btn-danger bi bi-x-circle" onClick="eliminar('${
              doc.id // tengo que pasar a la función el parámetro id
            }')"></td>
      </tr>`;
        }
      });
    });
};

// función para obtener la fecha de hoy
const getDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  return today;
};

// función para generar un codigo único
function generateId() {
  // Alphanumeric characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  let autoId = "ME-";
  for (let i = 0; i < 4; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return autoId;
}
