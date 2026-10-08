// ===== Referencias al DOM =====
const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const mensaje = document.querySelector("#mensaje");     // estados: error / cargando
const resultado = document.querySelector("#resultado"); // donde se pinta la tarjeta
const botonBuscar = formulario.querySelector("button");


// ===== API: pide el Pokémon y devuelve solo lo que usamos =====
const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  // 404 u otro fallo --> salta al catch del submit
  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado");
  }

  const datos = await respuesta.json();

  // Aplanamos la respuesta de la API a un objeto propio
  return {
    id: datos.id,
    nombre: datos.name,
    imagen: datos.sprites.front_default,
    //imagen: datos.sprites.front_shiny,
    altura: datos.height,  // en decimetros
    peso: datos.weight,    // en hectogramos
    tipos: datos.types.map(({ type }) => type.name), // ["fuego", "volador"]
  };
};


// ===== Flujo principal: envío del formulario =====
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // evita recargar la página

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

// Pinta la tarjeta del Pokémon en #resultado
const mostrarPokemon = (pokemon) => {
  // Array de tipos → string de <span>s
  const tiposHTML = pokemon.tipos
    .map((tipo) => `<span class="tipo">${tipo}</span>`)
    .join("");

  // /10 para pasar dm → m y hg → kg
  resultado.innerHTML = `
    <article class="pokemon">
      <p class="pokemon__numero">N.º ${formatearId(pokemon.id)}</p>

      <img
        class="pokemon__imagen"
        src="${pokemon.imagen}"
        alt="Imagen de ${pokemon.nombre}"
      >

      <h2 class="pokemon__nombre">${pokemon.nombre}</h2>

      <div class="pokemon__datos">
        <p><strong>Altura</strong><br>${pokemon.altura / 10} m</p>
        <p><strong>Peso</strong><br>${pokemon.peso / 10} kg</p>
      </div>

      <div class="pokemon__tipos">
        ${tiposHTML}
      </div>
    </article>
  `;
};