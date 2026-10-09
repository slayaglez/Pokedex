// ===== Referencias al DOM =====
const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const mensaje = document.querySelector("#mensaje");     // estados: error / cargando
const resultado = document.querySelector("#resultado"); // donde se pinta la tarjeta
const filtroTipo = document.querySelector("#filtro-tipo");
const botonBuscar = formulario.querySelector("button");
const botonCargar = document.querySelector("#boton-cargar");
const cuadricula = document.querySelector("#cuadricula");
const detalles = document.querySelector("#detalles");
const detallesContenido = document.querySelector("#detalles-contenido");
const botonCerrar = document.querySelector("#boton-cerrar");
let pokemons = [];
let pokemonBuscado = null; // el que esta en la tarjeta grande

// Nombres de las estadisticas tal como vienen de la API y como los mostramos
const nombresEstadisticas = {
  "hp": "Salud",
  "attack": "Ataque",
  "defense": "Defensa",
  "special-attack": "Ataque esp.",
  "special-defense": "Defensa esp.",
  "speed": "Velocidad",
};


// ===== API: pide el Pokémon y devuelve solo lo que usamos =====
const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  // 404: ese Pokemon no existe, no es un fallo
  if (respuesta.status === 404) {
    return null;
  }

  // Cualquier otro fallo de la API salta al catch de quien llama
  if (!respuesta.ok) {
    throw new Error("Respuesta incorrecta de la API");
  }

  const datos = await respuesta.json();

  // Aplanamos la respuesta de la API a un objeto propio
  return new Pokemon(datos);
};


// ===== Flujo principal: envío del formulario =====
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // evita recargar la página

  // Si ya tenemos los 151 filtramos sin llamar a la API
  if (pokemons.length > 0) {
    aplicarBusqueda();
    return;
  }

  const busqueda = inputBusqueda.value.trim().toLowerCase();

  // Validación: input vacío
  if (!busqueda) {
    mensaje.textContent = "Introduce un nombre o número";
    resultado.innerHTML = "";
    return;
  }

  // Estado de carga
  botonBuscar.disabled = true;
  mensaje.textContent = "Cargando...";
  resultado.innerHTML = "";

  try {
    const pokemon = await obtenerPokemon(busqueda);

    if (pokemon === null) {
      mensaje.textContent = "No se encontró ningún Pokémon.";
      return;
    }

    // Limpiamos búsqueda y devolvemos foco
    inputBusqueda.value = "";
    inputBusqueda.focus();

    mostrarPokemon(pokemon);
    mensaje.textContent = "";
  } catch (error) {
    // Fallo de red o de la API: mensaje nuestro, el tecnico va a la consola
    console.error(error);
    mensaje.textContent = "No se pudo conectar con la PokéAPI. Inténtalo de nuevo.";
  } finally {
    botonBuscar.disabled = false;
}
});


// ===== Helpers de presentación =====

// 7 → "007"
const formatearId = (id) => {
  return String(id).padStart(3, "0");
};

// Solo muestra la tarjeta
const mostrarPokemon = (pokemon) => {
  pokemonBuscado = pokemon;
  resultado.innerHTML = crearTarjeta(pokemon);
};

// Array de tipos a etiquetas, cada una con la clase de su color
function crearTipos(tipos) {
  return tipos
      .map((tipo) => `<span class="pokemon__tipo pokemon__tipo--${tipo}">${tipo}</span>`)
      .join("");
}

// Devuelve solo la tarjeta html con la info ya ready
function crearTarjeta(pokemon) {

  const tiposHTML = crearTipos(pokemon.tipos);

  const stringHtml = `
    <article class="pokemon">
      <p class="pokemon__numero">N.º ${formatearId(pokemon.id)}</p>

      <img
        class="pokemon__imagen pokemon__imagen--frente"
        src="${pokemon.imagen}"
        alt="Imagen de ${pokemon.nombre} de frente"
      >
      
      <img
        class="pokemon__imagen pokemon__imagen--espalda"
        src="${pokemon.imagenEspalda}"
        alt="Imagen de ${pokemon.nombre} de espaldas todo tímido"
      >

      <h2 class="pokemon__nombre">${pokemon.nombre}</h2>

      <div class="pokemon__datos">
        <p><strong>Altura</strong><br>${pokemon.alturaEnMetros()} m</p>
        <p><strong>Peso</strong><br>${pokemon.pesoEnKilos()} kg</p>
      </div>

      <div class="pokemon__tipos">
        ${tiposHTML}
      </div>

      <button class="boton pokemon__boton" type="button" data-id="${pokemon.id}">Ver detalles</button>
    </article>
  `;

  return stringHtml;
}

// Rellena el panel de detalles con un pokemon y lo abre
function abrirDetalles(pokemon) {
  const estadisticasHTML = pokemon.estadisticas
      .map((estadistica) => `
        <li class="detalles__estadistica">
          <span>${nombresEstadisticas[estadistica.nombre]}</span>
          <strong>${estadistica.valor}</strong>
        </li>
      `)
      .join("");

  detallesContenido.innerHTML = `
    <p class="pokemon__numero">N.º ${formatearId(pokemon.id)}</p>

    <img
      class="pokemon__imagen detalles__imagen"
      src="${pokemon.imagen}"
      alt="Imagen de ${pokemon.nombre} de frente"
    >

    <h2 class="pokemon__nombre">${pokemon.nombre}</h2>

    <div class="pokemon__tipos">
      ${crearTipos(pokemon.tipos)}
    </div>

    <div class="pokemon__datos">
      <p><strong>Altura</strong><br>${pokemon.alturaEnMetros()} m</p>
      <p><strong>Peso</strong><br>${pokemon.pesoEnKilos()} kg</p>
      <p><strong>Exp. base</strong><br>${pokemon.experiencia}</p>
    </div>

    <h3 class="detalles__titulo">Habilidades</h3>
    <p class="detalles__habilidades">${pokemon.habilidades.join(", ")}</p>

    <h3 class="detalles__titulo">Estadísticas base</h3>
    <ul class="detalles__estadisticas">
      ${estadisticasHTML}
    </ul>
  `;

  detalles.showModal();
}

// Boton "Ver detalles" de las tarjetas de la cuadricula
cuadricula.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("pokemon__boton")) {
    const id = Number(evento.target.dataset.id);
    const pokemon = pokemons.find((pokemon) => pokemon.id === id);

    abrirDetalles(pokemon);
  }
});

// Boton "Ver detalles" de la tarjeta grande del buscador
resultado.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("pokemon__boton")) {
    abrirDetalles(pokemonBuscado);
  }
});

botonCerrar.addEventListener("click", () => {
  detalles.close();
});


const cargarPokemons = async () => {
  const promesas = [];

  for (let i = 1; i <= 151; i++) {
    promesas.push(obtenerPokemon(i));
  }

  pokemons = await Promise.all(promesas);
}

function mostrarCuadricula(lista) {
  const pokemonHTML = lista
      .map((pokemon) => crearTarjeta(pokemon))
      .join("");

  cuadricula.innerHTML = pokemonHTML;
}

// Devuelve los pokemon cargados que coinciden por nombre o por id
function filtrarPokemons(texto, tipo) {
  return pokemons.filter((pokemon) => {
    const coincideTexto = texto === "" || pokemon.nombre.includes(texto) || pokemon.id === Number(texto);
    const coincideTipo = tipo === "" || pokemon.tipos.includes(tipo);

    return coincideTexto && coincideTipo;
  });
}

// Rellena el selector con los tipos que tienen los pokemon cargados
function rellenarTipos() {
  const tipos = [];

  pokemons.forEach((pokemon) => {
    pokemon.tipos.forEach((tipo) => {
      if (!tipos.includes(tipo)) {
        tipos.push(tipo);
      }
    });
  });

  tipos.sort();

  const opcionesHTML = tipos
      .map((tipo) => `<option value="${tipo}">${tipo}</option>`)
      .join("");

  filtroTipo.innerHTML = `<option value="">Todos</option>` + opcionesHTML;
  filtroTipo.disabled = false;
}

// Filtra la cuadricula con el texto del buscador y el tipo elegido
function aplicarBusqueda() {
  const busqueda = inputBusqueda.value.trim().toLowerCase();
  const tipo = filtroTipo.value;

  resultado.innerHTML = "";
  mensaje.textContent = "";

  // Con la barra vacia y el tipo en "Todos" salen los 151
  const lista = filtrarPokemons(busqueda, tipo);
  mostrarCuadricula(lista);

  if (lista.length === 0) {
    mensaje.textContent = "Ningún Pokémon coincide con la búsqueda";
  }

  // Si solo queda uno lo mostramos tambien en grande
  if (lista.length === 1) {
    mostrarPokemon(lista[0]);
  }
}

// Filtra mientras se escribe, solo si ya se cargaron
inputBusqueda.addEventListener("input", () => {
  if (pokemons.length > 0) {
    aplicarBusqueda();
  }
});

// Filtra al cambiar el tipo en el selector
filtroTipo.addEventListener("change", () => {
  aplicarBusqueda();
});

// === Para cargar la cuadrícula ===
botonCargar.addEventListener("click", async (evento) => {

  // Estado de carga
  botonCargar.disabled = true;
  mensaje.textContent = "Separando Pokémon de sus familias...";

  try {
    await cargarPokemons();

    // Empezamos con el buscador limpio y los 151 a la vista
    inputBusqueda.value = "";
    resultado.innerHTML = "";
    rellenarTipos();
    mostrarCuadricula(pokemons);
    mensaje.textContent = "Listo!";

  } catch (error) {
    console.error(error);
    mensaje.textContent = "No se pudieron cargar los Pokémon. Pulsa el botón para reintentarlo.";
  } finally {
    botonCargar.disabled = false;
  }
});