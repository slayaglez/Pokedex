# Pokedex
Una Pokedex, nacida de un proyecto para la asignatura PGL de 1º DAM.

## 1. Punto de partida
Empezamos con el proyecto "Mini-pokedex" como base, un programa en JS que se conecta a una API para traer y tratar información básica del mundo Pokemon. Esta información se representa en navegador con HTML y CSS.

El árbol hasta ahora tiene la siguiente pinta:
```bash
.
├── assets
│   ├── img
│   └── sound
├── css
│   └── style.css
├── index.html
├── js
│   └── app.js
└── README.md

6 directories, 4 files
```

<br>

Aquí hay un ejemplo de su funcionamiento, tras buscar el número 77 este es el resultado. (Shinny porque se pedía una modificación de la mini-Pokedex y la dejé así).

![img](assets/img/cap1.png)

<br>

Aquí por otro lado tenemos un ejemplo de un error controlado cuando el pokemon que se inserta no existe.

![img](assets/img/cap2.png)

### Funcionalidades
Hasta ahora la mini-Pokedex hace una única llamada a la API y recibe la información de un solo Pokémon, el que se especifique en el buscador ya sea por nombre o por número.

La información que recibe se filtra y se dispone en pantalla con HTML y CSS en la tarjeta que se ve en la imagen.

Cuenta con manejo de errores como mensajes específicos para cuando el pokemon no existe o mensajes de "cargando" mientras se espera la respuesta de la API (también se bloquea el botón de Buscar hasta recibir la respuesta).

### Check-Point!
> Para ir viendo cada commit hecho en el proyecto iré poniendo estos checkpoints, para ir al commit en github haz click en el dibujo.

<a href="https://github.com/slayaglez/Pokedex/commit/4ee8bfbbe5a2972640afbce027bb45806157af1e"><img src="assets/img/checkpoint.png" style="height:100px"></a>


## 2. Rediseño y nueva estructura
Antes de traer los 151 Pokémon he preparado la página para que estén cómodos y tengan sitio. De momento solo he tocado el HTML y el CSS, el JS sigue haciendo lo mismo que en el punto de partida.

Lo primero fue cambiarle la cara a la mini-Pokedex, con una estética de Game Boy antigua: cuatro tonos de verde, bordes rectos sin redondear y todo el texto en mayúsculas. Las reglas que sigo están apuntadas en `css/stylerules.md` para no salirme del estilo según vaya añadiendo cosas. (Empezó siendo un .md donde guardaba los hexadecimales que me gustaban pero lo dejé así)

![img](assets/img/newStyle.png)

<br>

Después reorganicé la página en tres bloques, uno debajo de otro:

- El panel del buscador, que se queda en el centro como estaba y sigue mostrando dentro la tarjeta del Pokémon buscado.
- Un botón nuevo para cargar los 151 Pokémon.
- La cuadrícula donde aparecerán las tarjetas, directamente sobre el fondo oscuro.

![img](assets/img/finalNewStyle.png)

El árbol ahora tiene la siguiente pinta:
```bash
.
├── assets
│   ├── img
│   └── sound
├── css
│   ├── style.css
│   └── stylerules.md
├── index.html
├── js
│   └── app.js
└── README.md

6 directories, 5 files
```

### Cambios en el HTML
El `<main>` ahora tiene la clase `pagina` y envuelve los tres bloques. El panel de antes es ahora un `<div class="contenedor">` y debajo van el botón y la cuadrícula que se rellenará en el próximo paso:

```html
<button id="boton-cargar" class="boton boton--cargar" type="button">Invocar Pokémon!</button>

<section id="cuadricula" class="cuadricula"></section>
```

El botón lleva `type="button"` para que no envíe el formulario del buscador. La sección `#cuadricula` está vacía porque las tarjetas las meterá el JS, igual que ya hace con `#resultado`.

El título ha dejado de ser texto y ahora es una imagen dentro del `<h1>`, con su `alt` para que se siga leyendo como título aunque la imagen no cargue.

### Cambios en el CSS
Para colocar los tres bloques en columna y centrados uso flex en `.pagina`:

```css
.pagina {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
```

La cuadrícula se hace con grid. Con esta línea caben tantas columnas como entren en la pantalla, con un mínimo de 130px cada una, así que se debería adaptar solo al móvil y al ordenador:

(Hacerlo responsive debería sumar puntos...)
```css
grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
```

Probé también con `auto-fit`, pero cuando hay pocas tarjetas las estira hasta ocupar todo el ancho y quedan enormes. Con `auto-fill` mantienen su tamaño.

La tarjeta del Pokémon usa las mismas clases en el buscador y en la cuadrícula. Para que en la cuadrícula salga más pequeña hay unas reglas que solo se aplican ahí dentro, por ejemplo:

```css
.cuadricula .pokemon__imagen {
  width: 110px;
  height: 110px;
  padding: 4px;
}
```

Así el JS genera siempre el mismo HTML y el tamaño depende de dónde se meta la tarjeta. Además reciclamos código para no dañar el medioambiente como nos enseñan en sostenibilidad.

Los dos botones comparten ahora la clase `.boton`, que antes era un selector solo para el botón de buscar. También le añadí un estilo para cuando esté deshabilitado, que hará falta mientras se cargan los datos.

Por último el logo tiene una animación para que parezca que flota. Sube 6px y vuelve a bajar, y con `steps(3)` lo hace a saltitos en vez de suave, que pega más con el estilo retro:

```css
.titulo__imagen {
  animation: flotar 2s infinite steps(3);
}

@keyframes flotar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
```
(Perdí casi 3 horas con el CSS en lugar de programar de verdad, espero que la modificación sea facilita)

### Problemas encontrados
Al sacar las tarjetas del panel y ponerlas sobre el fondo oscuro dejaron de verse los bordes, porque eran del mismo verde que el fondo. Lo solucioné cambiando el borde de las tarjetas de la cuadrícula y del botón de cargar a un tono más claro.

Por poner algo.
### Pendiente
El botón de cargar todavía no hace nada y la cuadrícula está vacía. Lo siguiente es el JS que pide los 151 Pokémon a la API y los pinta en `#cuadricula`.

### Check-Point!

<a href="estomereceundiez"><img src="assets/img/checkpoint.png" style="height:100px"></a>


## ANEXO
### **Preguntas respondidas durante el seguimiento de la práctica Mini-Pokedex.**

- **¿Por qué escuchamos el evento submit del formulario?**

Para escuchar en todo momento si el formulario se envió o no y actuar en consecuencia

<hr>

- **¿Qué ocurriría si eliminamos evento.preventDefault()?**

Que la página se recargaría, reiniciando el programa que se ejecuta en el cliente (navegador).

<hr>

- **¿Para qué utilizamos trim() y toLowerCase()?**

Normalizamos la cadena para poder trabajar con ella (sin espacios y en minúsculas).

<hr>

- **¿Por qué obtenerPokemon() está declarada con async?**

Porque cualquier llamada a una API debe ser declarada de forma asíncrona para no detener la ejecución del resto del código esperando su respuesta.

<hr>

- **¿Qué devuelve fetch()?**

Devuelve una promesa o ticket con el resultado de hacer la petición a la API.

<hr>

- **¿Para qué se utiliza await?**

Para detener la ejecución de la función donde esté y así dejar paso al resto del código mientras se espera una respuesta.

<hr>

- **¿Por qué debemos comprobar respuesta.ok?**

Porque await puede devolver una respuesta inválida.

<hr>

- **¿Qué hace respuesta.json()?**

Convierte la respuesta a un formato JSON que guardamos en "datos"

<hr>

- **¿Por qué no devolvemos directamente todos los datos recibidos?**

Porque hay datos que no necesitamos y harían la ejecución más pesada.

<hr>

- **¿Qué resultado produce map() al transformar los tipos?**

Una lista de los nombres de los tipos del pokemon (String).

<hr>

- **¿Por qué utilizamos join("") después de map()?**

Porque map() devuelve un array y con join() lo convertimos en una sola cadena de texto.

<hr>

- **¿Qué diferencia existe entre try y catch?**

try intenta una acción o instrucción, si falla se ejecutará el catch

<hr>

- **¿Por qué hemos separado obtenerPokemon() y mostrarPokemon()?**

Porque son dos funciones diferentes que hacen cosas diferentes. Además hasta no recibir una respuesta de la API en obtenerPokemon no deberíamos mostrar nada, se llama división de responsabilidades.

<hr>

- **¿Qué función cumple formatearId()?**

Rellenar con 0 por la izquierda hasta los tres dígitos.

<hr>

- **¿Qué habría que modificar para mostrar varios Pokémon simultáneamente?**

Se me ocurre editar la búsqueda para que con la misma que se trae un pokemon se los traiga a todos y seguir haciendo una sola llamada a la API. Edit: mirando la API te puedes traer todo con `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
