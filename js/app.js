// ===== Referencias al DOM =====
const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const mensaje = document.querySelector("#mensaje");     // estados: error / cargando
const resultado = document.querySelector("#resultado"); // donde se pinta la tarjeta
const botonBuscar = formulario.querySelector("button");
const botonCargar = document.querySelector("#boton-cargar");
const cuadricula = document.querySelector("#cuadricula");
let pokemons = [];


// ===== API: pide el Pokémon y devuelve solo lo que usamos =====
const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  // 404 u otro fallo --> salta al catch del submit
  if (!respuesta.ok) {
    throw new Error("No se encontró ningún Pokémon.");
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

    // Limpiamos búsqueda y devolvemos foco
    inputBusqueda.value = "";
    inputBusqueda.focus();

    mostrarPokemon(pokemon);
    mensaje.textContent = "";
  } catch (error) {
    mensaje.textContent = error.message; // el throw de obtenerPokemon o fallo de red
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
  resultado.innerHTML = crearTarjeta(pokemon);
};

// Devuelve solo la tarjeta html con la info ya ready
function crearTarjeta(pokemon) {

  const tiposHTML = pokemon.tipos
      .map((tipo) => `<span class="pokemon__tipo">${tipo}</span>`)
      .join("");

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
    </article>
  `;

  return stringHtml;
}


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
function filtrarPokemons(texto) {
  return pokemons.filter((pokemon) => {
    return pokemon.nombre.includes(texto) || pokemon.id === Number(texto);
  });
}

// Filtra la cuadricula con lo que haya escrito en el buscador
function aplicarBusqueda() {
  const busqueda = inputBusqueda.value.trim().toLowerCase();

  resultado.innerHTML = "";
  mensaje.textContent = "";

  // Barra vacia: vuelven a salir todos
  if (!busqueda) {
    mostrarCuadricula(pokemons);
    return;
  }

  const lista = filtrarPokemons(busqueda);
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
    mostrarCuadricula(pokemons);
    mensaje.textContent = "Listo!";

  } catch (error) {
    mensaje.textContent = error.message;
  } finally {
    botonCargar.disabled = false;
  }
});