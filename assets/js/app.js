// Configuración de tu aplicación Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCHQcZdMPJ77F7FRPYeeCcdoZ_f-11zSm0",
    authDomain: "proyecto-savemultimedia.firebaseapp.com",
    projectId: "proyecto-savemultimedia",
    storageBucket: "proyecto-savemultimedia.appspot.com",
    messagingSenderId: "432042943275",
    appId: "1:432042943275:web:06ecb9ded7d6de3c381b6e"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// También puedes usar Firestore para interactuar con la base de datos
const db = firebase.firestore();
const storage = firebase.storage();

// Evento para manejar el envío del formulario
$(document).ready(function () {
    $('.send').click(function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del botón de enviar
        guardarDocumento(); // Llamar a la función para guardar el documento
    });

    $('.buscar_button').click(function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del botón
        var expediente = $('#documentos_busqueda').val().trim();
        // Limpiar los resultados anteriores
        $('.nombre_doc').text('');
        $('.expediente_doc').text('');
        $('.ubicacion_doc').text('');
        // Realizar la búsqueda del documento por el número de expediente
        buscarDocumentoPorExpediente(expediente);
    });


});

// Función para guardar el documento en Firebase
function guardarDocumento() {
    var nombre = $('#doc_Nombre').val();
    var expediente = $('#doc_Expediente').val();
    var ubicacion = $('#doc_Ubicacion').val();

    // Comprobar que los campos no estén vacíos
    if (nombre && expediente && ubicacion) {
        // Verificar si ya existe un documento con el mismo nombre y expediente
        verificarDocumentoExistente(nombre, expediente)
            .then(function () {
                // Si no existe un documento con el mismo nombre y expediente, guardar el nuevo documento
                db.collection('documentos').add({
                    nombre: nombre,
                    expediente: expediente,
                    ubicacion: ubicacion,
                }).then(function () {
                    // Limpiar el formulario después de guardar los datos
                    $('#doc_Nombre').val('');
                    $('#doc_Expediente').val('');
                    $('#doc_Ubicacion').val('');

                    // Notificar al usuario que se guardó el documento
                    alert('Documento guardado correctamente');
                }).catch(function (error) {
                    console.error('Error al guardar el documento: ', error);
                    alert('Ocurrió un error al intentar guardar el documento');
                });
            })
            .catch(function (error) {
                // Si ya existe un documento con el mismo nombre y expediente, mostrar un mensaje de error
                console.error('Error al verificar el documento existente: ', error);
                alert('No se puede guardar el documento. Ya existe un documento con el mismo nombre y expediente.');
            });
    } else {
        alert('Por favor, complete todos los campos del formulario');
    }
}

// Función para verificar si ya existe un documento con el mismo nombre y expediente
function verificarDocumentoExistente(nombre, expediente) {
    return new Promise(function (resolve, reject) {
        // Consultar la base de datos para ver si existe un documento con el mismo nombre y expediente
        db.collection('documentos').where('nombre', '==', nombre).where('expediente', '==', expediente).get()
            .then(function (querySnapshot) {
                if (!querySnapshot.empty) {
                    // Si existe un documento con el mismo nombre y expediente, rechazar la promesa
                    reject('Ya existe un documento con el mismo nombre y expediente');
                } else {
                    // Si no existe un documento con el mismo nombre y expediente, resolver la promesa
                    resolve();
                }
            })
            .catch(function (error) {
                // Manejar cualquier error de la consulta
                reject(error);
            });
    });
}

// Función para buscar el documento por el número de expediente
function buscarDocumentoPorExpediente(expediente) {
    if (expediente) {
        // Realizar la consulta a Firestore para buscar el documento por expediente
        db.collection('documentos').where('expediente', '==', expediente).get()
            .then(function (querySnapshot) {
                let encontrados = false; // Variable para determinar si se encontraron resultados
                querySnapshot.forEach(function (doc) {
                    encontrados = true; // Se encontró al menos un documento
                    // Mostrar los resultados encontrados en los elementos HTML
                    $('.nombre_doc').text('Nombre del documento: ' + '\n\n' + doc.data().nombre);
                    $('.expediente_doc').text('Número de expediente: ' + '\n\n' + doc.data().expediente);
                    $('.ubicacion_doc').text('Ubicación del documento: ' + '\n\n' + doc.data().ubicacion);
                });
                // Si no se encontraron resultados, mostrar un alert
                if (!encontrados) {
                    alert('No se encontraron expedientes con el número proporcionado.');
                }
            })
            .catch(function (error) {
                console.error('Error al buscar el documento por expediente: ', error);
                alert('Ocurrió un error al buscar el documento');
            });
    } else {
        // Limpiar los resultados si no se proporciona un número de expediente
        $('.nombre_doc').text('');
        $('.expediente_doc').text('');
        $('.ubicacion_doc').text('');
        // Mostrar un alert para indicar que se debe proporcionar un número de expediente
        alert('Por favor, introduce un número de expediente para buscar el documento.');
    }
}
