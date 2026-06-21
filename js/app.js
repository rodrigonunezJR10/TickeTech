// Archivo base para estudiantes.
// Objetivo: cargar djs desde JSON, mostrar un producto y validar formularios de forma básica.

let eventosDisponibles = [];


// 1. NAVEGACIÓN MODULAR: esto hace que la 
// pagina se vaya actualizando sin recargar, mostrando u ocultando secciones según el enlace clickeado.

// en palabras mas simples esto hace que al hacer click en un enlace del menú, se muestre la sección
//  correspondiente y se oculten las demás, sin necesidad de recargar toda la página.


const enlaces = document.querySelectorAll('nav a');
const paginas = document.querySelectorAll('.page');

enlaces.forEach(enlace => {
  enlace.addEventListener('click', (e) => {
    e.preventDefault();
    const paginaDestino = enlace.getAttribute('data-page');

    paginas.forEach(p => p.classList.remove('active'));

    const paginaActual = document.getElementById(paginaDestino);
    if (paginaActual) {
      paginaActual.classList.add('active');
    }
  });
});

// 2. FETCH ASÍNCRONO DE DATOS LOCALES Y CONTROL DE ERRORES

// esto carga el archivo JSON con la información de los eventos, lo convierte a un objeto JavaScript 
// y luego lo pasa a la función que se encarga de mostrar los eventos en pantalla. Si ocurre un error 
// durante la carga o el procesamiento del JSON, se captura y se muestra un mensaje de error en la consola.

// en otras palabras, esto hace que al cargar la página, se obtenga la información de los eventos desde
//  un archivo local y se muestre en la sección correspondiente, asegurando que cualquier problema con
//  el archivo JSON sea manejado de forma segura sin afectar la experiencia del usuario.


fetch('data/djs.json')
  .then(r => r.json())
  .then(datos => {
    eventosDisponibles = datos;
    mostrarEventos(datos); 
  })
  .catch(err => console.error("Error al inicializar la base de djs:", err));


// 3. RENDERIZACIÓN SEGURA DE TARJETAS


function mostrarEventos(lista) {
  const contenedor = document.getElementById('contenedor-djs');
  contenedor.textContent = ''; // Limpieza controlada y segura del espacio

  lista.forEach(evento => {
    // Generamos los componentes dinámicos directo en la memoria del navegador
    const card = document.createElement('div');
    card.className = 'producto-card';

    const sub = document.createElement('span');
    sub.className = 'categoria-badge';
    sub.textContent = evento.categoria; // Aquí se visualiza la rama del Techno

    const artista = document.createElement('h3');
    artista.textContent = evento.nombre;

    const desc = document.createElement('p');
    desc.textContent = evento.descripcion;

    const fecha = document.createElement('p');
    fecha.className = 'fecha-texto';
    fecha.textContent = `Fecha: ${evento.fecha}`;

    const precio = document.createElement('p');
    precio.className = 'precio-texto';
    precio.textContent = `Ticket: $${evento.precio}`;

    const stock = document.createElement('p');
    stock.className = 'stock-texto';
    stock.textContent = `Preventas Disponibles: ${evento.stock}`;

  
    // Entrada numérica de tickets
    const labelCant = document.createElement('label');
    labelCant.textContent = 'Cantidad de tickets: ';

    const inputCant = document.createElement('input');
    inputCant.type = 'number';
    inputCant.id = 'cantidad-' + evento.id;
    inputCant.value = 0;
    inputCant.min = 0;
    inputCant.max = evento.stock; // Define por hardware el límite configurado en el JSON
    inputCant.className = 'input-cantidad';

    // Escuchador en tiempo real: recalcula montos al presionar los controles numéricos
    inputCant.addEventListener('input', actualizarBoletaEventos);

    // Encadenamos los nodos hijos al nodo padre de forma segura
    card.appendChild(sub);
    card.appendChild(artista);
    card.appendChild(desc);
    card.appendChild(precio);
    card.appendChild(stock);
    card.appendChild(fecha);
    card.appendChild(labelCant);
    card.appendChild(inputCant);

    // Subimos la tarjeta terminada a la pantalla visual
    contenedor.appendChild(card);
  });
}


// 4. LOGICA DE CONTROL DE LA BOLETA 
// Esta función se encarga de actualizar el resumen 
// de compra cada vez que el usuario cambia la cantidad de tickets seleccionados.  

// en otras palabras, cada vez que el usuario ajusta la cantidad de tickets para 
// un evento, esta función recalcula el total a pagar y actualiza el resumen de compra 
// que se muestra en pantalla, asegurando que el usuario tenga una visión clara y 
// actualizada de su pedido antes de finalizar la compra.


function actualizarBoletaEventos() {
  let lineasPedido = [];
  let totalDinero = 0;

  eventosDisponibles.forEach(e => {
    const inputElement = document.getElementById('cantidad-' + e.id);
    if (inputElement) {
      const cantidadElegida = Number(inputElement.value);
      
      if (cantidadElegida > 0) {
        totalDinero += cantidadElegida * e.precio;
        lineasPedido.push(`${e.nombre} (x${cantidadElegida} Tickets)`);
      }
    }
  });

  // Estructura del string de la boleta (Corregido totalDinero)
  const stringBoleta = lineasPedido.length > 0 
    ? `${lineasPedido.join(', ')} | Total a Pagar: $${totalDinero}`
    : 'No has seleccionado entradas. | Total: $0';

  // Inyectamos el texto plano al párrafo visual y al campo oculto del email
  document.getElementById('resumenCompra').textContent = stringBoleta;
  document.getElementById('detalleProducto').value = stringBoleta;
}


// 5. VALIDACIÓN DEL FORMULARIO DE COMPRA
// aquí se valida que el usuario haya ingresado un nombre, un correo electrónico con formato correcto,
// y que haya seleccionado al menos un ticket sin exceder el stock disponible. Si alguna de estas 
// condiciones no se cumple, se muestra un mensaje de error junto al campo correspondiente y se 
// evita que el formulario se envíe hasta que el usuario corrija los errores.

// en otras palabras, esta función asegura que antes de enviar el formulario de compra, el usuario 
// haya proporcionado toda la información necesaria de forma correcta y haya seleccionado una cantidad
// válida de tickets, mejorando la experiencia del usuario y evitando errores en el proceso de compra.  


document.getElementById('formCompra').addEventListener('submit', function(e) {
  let hayError = false;

  // Limpieza inicial de alertas previas
  document.querySelectorAll('.error-text').forEach(span => span.textContent = '');

  const nombre = document.getElementById('nombreCompra').value.trim();
  const correo = document.getElementById('correoCompra').value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular estándar para correos

  if (nombre === "") {
    document.getElementById('error-nombreCompra').textContent = 'El nombre es requerido para emitir tus entradas.';
    hayError = true;
  }

  if (!regexEmail.test(correo)) {
    document.getElementById('error-correoCompra').textContent = 'Ingresa un formato de correo electrónico válido.';
    hayError = true;
  }

  // Validación de selección de tickets y control físico de stock
  let totalTicketsSeleccionados = 0;
  let stockExcedido = false;

  eventosDisponibles.forEach(ev => {
    const inputElement = document.getElementById('cantidad-' + ev.id);
    if (inputElement) {
      const cantidad = Number(inputElement.value);
      if (cantidad > 0) {
        totalTicketsSeleccionados += cantidad;
        if (cantidad > ev.stock) {
          stockExcedido = true;
        }
      }
    }
  });

  if (totalTicketsSeleccionados === 0) {
    document.getElementById('error-djs').textContent = 'Debes añadir al menos un ticket para procesar el pedido.';
    hayError = true;
  }

  if (stockExcedido) {
    document.getElementById('error-djs').textContent = 'Una o más selecciones exceden las preventas físicas disponibles.';
    hayError = true;
  }

  // Si existe un error latente, frenamos el envío automático
  if (hayError) {
    e.preventDefault();
  }
});


// 6. VALIDACIÓN DEL FORMULARIO DE CONTACTO
// esta función valida que el usuario haya ingresado un nombre, un correo electrónico con formato correcto,
// y que el mensaje tenga al menos 20 caracteres. Si alguna de estas condiciones no se cumple, se muestra un mensaje de error junto al campo correspondiente y se evita que el formulario se envíe hasta que el usuario corrija los errores.

// en otras palabras, esta función asegura que antes de enviar el formulario de contacto, el usuario 
// haya proporcionado toda la información necesaria de forma correcta y haya escrito un mensaje suficientemente detallado, mejorando la calidad de las consultas recibidas y 
// facilitando una respuesta adecuada por parte del equipo de soporte o booking.  
document.getElementById('formContacto').addEventListener('submit', function(e) {
  let hayError = false;

  document.querySelectorAll('.error-text').forEach(span => span.textContent = '');

  const nombre = document.getElementById('nombreContacto').value.trim();
  const correo = document.getElementById('correoContacto').value.trim();
  const mensaje = document.getElementById('mensajeContacto').value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nombre === "") {
    document.getElementById('error-nombreContacto').textContent = 'El nombre de contacto es obligatorio.';
    hayError = true;
  }

  if (!regexEmail.test(correo)) {
    document.getElementById('error-correoContacto').textContent = 'El correo ingresado no cuenta con la estructura correcta.';
    hayError = true;
  }

  if (mensaje.length < 20) {
    document.getElementById('error-mensajeContacto').textContent = 'El mensaje de booking debe tener un mínimo de 20 caracteres.';
    hayError = true;
  }

  if (hayError) {
    e.preventDefault();
  }
});


// ==========================================================================
// 7. REPRODUCTOR DE MÚSICA INTERACTIVO Y ARRASTRABLE (UNIFICADO)
// ==========================================================================
const musica = document.getElementById('musica-fondo');
const btnMusica = document.getElementById('btn-musica');

if (btnMusica && musica) {
    let mousePresionado = false;
    let despliegueX = 0, despliegueY = 0;
    let seArrastro = false; 

    // Detectar clic inicial y guardar posición
    btnMusica.addEventListener('mousedown', (e) => {
        mousePresionado = true;
        seArrastro = false; 
        despliegueX = e.clientX - btnMusica.offsetLeft;
        despliegueY = e.clientY - btnMusica.offsetTop;
        btnMusica.style.cursor = 'grabbing';
    });

    // Controlar el movimiento en pantalla
    document.addEventListener('mousemove', (e) => {
        if (!mousePresionado) return;
        e.preventDefault();
        seArrastro = true; 

        let nuevaX = e.clientX - despliegueX;
        let nuevaY = e.clientY - despliegueY;

        btnMusica.style.left = nuevaX + 'px';
        btnMusica.style.top = nuevaY + 'px';
        btnMusica.style.bottom = 'auto';
        btnMusica.style.right = 'auto';
    });

    // Soltar el mouse
    document.addEventListener('mouseup', () => {
        mousePresionado = false;
        if (btnMusica) btnMusica.style.cursor = 'pointer';
    });

    // Reproducir/Pausar música (Solo si el botón NO se arrastró)
    btnMusica.addEventListener('click', () => {
        if (seArrastro) return; 

        if (musica.paused) {
            musica.play()
                .then(() => {
                    btnMusica.textContent = '⏸ Pause';
                    btnMusica.classList.add('reproduciendo');
                })
                .catch(err => {
                    console.error("Error de reproducción:", err);
                });
        } else {
            musica.pause();
            btnMusica.textContent = '🎵 Play Adriatique';
            btnMusica.classList.remove('reproduciendo');
        }
    });
}