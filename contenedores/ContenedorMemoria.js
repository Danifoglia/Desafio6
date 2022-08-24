// CONTENEDOR DE PRODUCTOS

class ContenedorMemoria {
    constructor() {
        this.productos = []
        this.id = 1
    
    }

    listar(id) {
        const products = this.listarAll();
        const lastElement = products[products.length - 1];
        const productById = products.find(p => p.id == id);
        if (lastElement >= productById) {
        return productById;
        } else {
            throw new Error;
        }
    }

    listarAll() {
        return this.productos;
    }

    guardar(prod) {
        //POST
        try {
            this.productos.push({...prod,id: this.id++});
        } catch (error) {
            console.error("No se pudo guardar",error);
            return [];
        }
    }

    actualizar(prod, id) {
        //PUT
        const products = this.listarAll();
        let lastElement = products[products.length - 1];
        let productById = products.find(p => p.id == id);
        if (lastElement >= productById) {
            productById.title = prod.title;
            productById.price = prod.price;
            productById.thumbnail = prod.thumbnail;
            } else {
                throw new Error;
            }
    }

    borrar(id) {
        //DELETE
        const products = this.listarAll();
        const lastElement = products[products.length - 1];
        let productById = products.find(p => p.id == id);
        if (lastElement >= productById) {
            const position = products.indexOf(productById);
            products.splice(position, 1);
            } else {
                throw new Error;
            }
        
    }
}

module.exports = ContenedorMemoria