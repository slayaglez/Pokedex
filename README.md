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
Enlace al commit hasta el momento:
![Aquí]()

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
