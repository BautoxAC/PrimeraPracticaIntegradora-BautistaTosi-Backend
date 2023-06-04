# Explicación

Este proyecto es un API básica que sigue las consignas de la 1erPreEntrega del proyecto final de CoderHouse del curso de Backend.Esta Api maneja objetos de javascript que recibe y los persiste en archivos de tipo JSON y los devuelve mediante endpoints y sus router creados con Express estos endpoits se encuentran documentados en el link de Postman. Además, en el endponit /realtimeproducts renderizado con handlebars donde hay una lista de productos traida del archivo de products.json tiene además un boton para eliminar el producto y un formulario que agrega un producto por vez y necesita todos los datos; y estos cambios se hacen instanteneamente con socket.io. Luego hay otra ruta que es /products que a traves de postman se puede cambiar la lista pero no se actualiza inmediatamente por la falta de socket.io.
## Rutas
/realtimeproducts con socket

/products sin socket
## Dependencias

Este proyecto utiliza las dependencias de Express para hacer un servidor local, Multer para la subida de imagenes a la carpeta public y uuid para la creación de ids de productos y carritos.

Documentación de las Dependecias:
1. Express: [https://expressjs.com/es/]
2. Multer: [https://github.com/expressjs/multer#readme]
3. uuid: [https://github.com/uuidjs/uuid#readme]
4. socket.io: [https://socket.io/docs/v4/]
5. express-handlebars: [https://www.npmjs.com/package/express-handlebars]

### `npm start`

Inicia el Servidor en [http://localhost:8080]

### Link de postman

[https://documenter.getpostman.com/view/27127572/2s93eYTrfS]