var fs = require('fs')
//MENSAJES ver si txt o json
class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        
    }

    async listarAll() {
        try {
            const mensajes = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(mensajes);
        } catch (error) {
            console.error("No hay nada en el archivo");
            return [];
        }
    }

    async guardar(mensaje) {
        let result = await this.listarAll();
        result.push(mensaje);
        fs.writeFileSync(this.ruta, JSON.stringify(result,null,2));
    }

    async actualizar(elem, id) {
        
    }

    async borrar(id) {
        
    }

    async borrarAll() {
        
    }
}

module.exports = ContenedorArchivo