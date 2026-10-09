class Pokemon {
    constructor(datos) {
        this.id = datos.id;
        this.nombre = datos.name;
        this.imagen = datos.sprites.front_default;
        this.imagenEspalda = datos.sprites.back_default;
        this.imagenShiny = datos.sprites.front_shiny;
        this.imagenEspaldaShiny = datos.sprites.back_shiny;
        this.altura = datos.height;
        this.peso = datos.weight;
        this.tipos = datos.types.map(({ type }) => type.name);
        this.experiencia = datos.base_experience;
        this.habilidades = datos.abilities.map(({ ability }) => ability.name);
        this.estadisticas = datos.stats.map((dato) => {
            return { nombre: dato.stat.name, valor: dato.base_stat };
        });
    }

    alturaEnMetros() {
        return this.altura / 10;
    }

    pesoEnKilos() {
        return this.peso / 10;
    }
}