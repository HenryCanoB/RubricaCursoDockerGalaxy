"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Producto,
  getProductos,
  createProducto,
  deleteProducto,
  updateProducto,
} from "../services/ProductoService";

export default function Page() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState<Producto>({
    descripcion: "",
    precio: 0,
    cantidad: 0,
    activo: true,
  });
  const [editando, setEditando] = useState<boolean>(false);
  const [codigoEditando, setCodigoEditando] = useState<number | null>(null);

  const fetchProductos = async () => {
    const res = await getProductos();
    setProductos(res.data);
  };

  const validar = () => {
    if (!nuevo.descripcion.trim()) {
      Swal.fire("Campo requerido", "Debe ingresar una descripción", "warning");
      return false;
    }
    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validar()) return;

    const confirm = await Swal.fire({
      title: editando ? "¿Actualizar producto?" : "¿Guardar producto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    if (editando && codigoEditando !== null) {
      await updateProducto(codigoEditando, nuevo);
      Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
    } else {
      await createProducto(nuevo);
      Swal.fire("Guardado", "Producto registrado correctamente", "success");
    }

    setNuevo({ descripcion: "", precio: 0, cantidad: 0, activo: true });
    setEditando(false);
    setCodigoEditando(null);
    fetchProductos();
  };

  const handleDelete = async (codigo: number | undefined) => {
    if (!codigo) return;

    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    await deleteProducto(codigo);
    Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    fetchProductos();
  };

  const handleEdit = (producto: Producto) => {
    setNuevo(producto);
    setEditando(true);
    setCodigoEditando(producto.codigo ?? null);
  };

  const cancelarEdicion = () => {
    setNuevo({ descripcion: "", precio: 0, cantidad: 0, activo: true });
    setEditando(false);
    setCodigoEditando(null);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Gestión de Productos - Versión 2</h1>
      <div className="row">
        {/* Formulario */}
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-header">
              {editando ? "Editar Producto" : "Registrar Producto"}
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  className="form-control"
                  placeholder="Descripción"
                  value={nuevo.descripcion}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, descripcion: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  className="form-control"
                  placeholder="Precio"
                  type="number"
                  value={nuevo.precio}
                  onChange={(e) =>
                    setNuevo({
                      ...nuevo,
                      precio: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cantidad</label>
                <input
                  className="form-control"
                  placeholder="Cantidad"
                  type="number"
                  value={nuevo.cantidad}
                  onChange={(e) =>
                    setNuevo({
                      ...nuevo,
                      cantidad: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Activo</label>
                <select
                  className="form-select"
                  value={String(nuevo.activo)}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, activo: e.target.value === "true" })
                  }
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={handleAddOrUpdate}
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
                {editando && (
                  <button
                    className="btn btn-secondary"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listado */}
        <div className="col-md-7">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Código</th>
                <th className="text-center">Descripción</th>
                <th className="text-center">Precio</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td>
                  <td>{p.descripcion}</td>
                  <td className="text-end">S/ {p.precio.toFixed(2)}</td>
                  <td className="text-end">{p.cantidad}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${p.activo ? "bg-success" : "bg-danger"}`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.codigo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
