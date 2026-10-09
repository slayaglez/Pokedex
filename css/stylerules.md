# Guía de Estilo CSS: Consola 8-Bits (Game Boy DMG)

Este documento define las reglas de diseño para expandir la interfaz manteniendo la estética retro de matriz verde. A ver si tocando la nostalgia consigo que me pongas ese 10 :)

### Paleta de Colores Nativas
* `--gameboy-oscuro`: #0f380f (Texto principal, bordes, sombras pesadas)
* `--gameboy-medio-oscuro`: #306230 (Fondos de botones, elementos activos)
* `--gameboy-medio-claro`: #8bac0f (Superficies secundarias, tarjetas)
* `--gameboy-claro`: #9bbc0f (Campos de entrada, fondos claros)
* `--pantalla-verde`: #c4cfa1 (El fondo general de la matriz de la pantalla)

### Reglas Estructurales Críticas
1. **Tipografía:** Usar siempre `var(--fuente-retro)`. Todo el texto debe transformarse a mayúsculas (`text-transform: uppercase`) para conservar el look de terminal antigua.
2. **Bordes y Contornos:** No utilizar `border-radius` (0px absoluto). Los bordes deben ser sólidos de `3px` o `4px`.
3. **Efecto Pixel-Art / Doble Borde:** El contenedor principal simula la pantalla usando sombras internas (`box-shadow: inset...`). Para replicar este efecto en paneles nuevos, combina capas de color intercaladas sin desenfoque (`blur: 0`).
4. **Interactividad:** Los elementos clickeables deben usar un desplazamiento posicional (`top: 4px`) combinado con una sombra inferior simulada que desaparece al activarse (`:active`) (Esto es lo q creo que le da todo el rollo gameboy).
