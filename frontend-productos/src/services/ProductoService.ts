import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086/api/producto";

export interface Producto {
  codigo?: number;
  descripcion: string;
  precio: number;
  cantidad: number;
  activo: boolean;
}

export const getProductos = () => axios.get<Producto[]>(API_URL);
export const createProducto = (producto: Producto) => axios.post(API_URL, producto);
export const deleteProducto = (codigo: number) => axios.delete(`${API_URL}/${codigo}`);
export async function updateProducto(codigo: number, producto: Producto) {
  return await axios.put(`${API_URL}/${codigo}`, producto);
}
