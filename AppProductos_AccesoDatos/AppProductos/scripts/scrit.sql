CREATE DATABASE productosdb;
USE productosdb;

CREATE TABLE IF NOT EXISTS Productos (
    Codigo INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion VARCHAR(255),
    Precio DECIMAL(10,2),
    Cantidad INT,
    Activo BOOLEAN
);

INSERT INTO Productos (Descripcion, Precio, Cantidad, Activo)
VALUES
('Producto 1', 100.50, 10, true),
('Producto 2', 200.75, 20, true),
('Producto 3', 300, 30, true);


