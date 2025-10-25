import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { useForm } from "react-hook-form";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { PRODUCTOS_ENDPOINT, PROVEEDORES_ENDPOINT } from "../../utils/routes";
import Modal from "../Modal";

const AgregarProducto = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [producto, setProducto] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  /* Carga inicial de proveedores para mostrar en el Select */
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await fetchAuthenticated(PROVEEDORES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar Proveedores");
        }

        const data = await response.json();
        setSuppliers(data);
      } catch (err) {
        setError(`No se pudieron cargar los Proveedores: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, [navigate]);

  /* Funcion on submit con logica para armar el contenido del producto a enviar */
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      /* Armado de request con POST y definiendo header de tipo JSON, distinto al caso de Login */
      const response = await fetchAuthenticated(PRODUCTOS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.detail || "Fallo al agregar el producto");
      }

      const jsonData = await response.json();

      /* Guardamos el resultado en el state de producto para poder usarlo en el modal */
      setProducto(jsonData);

      /* Marcamos como open el Modal */
      setIsModalOpen(true);

      /* Usamos la funcion reset de react-hook-form para limpiar los campos y poder agregar nuevos productos */
      reset();
    } catch (err) {
      setError(`No se pudo agregar el producto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="content-container">
          <div className="content-report-box">
            <div>
              <h1 style={{ margin: 0 }}>Agregar Producto</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {/* Formulario con campos requeridos para Producto */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del Producto"
                  {...register("nombre", {
                    required: "El nombre del prodcuto es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <p className="error-message">{errors.nombre.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="descripcion">Descripción del Producto</label>
                <input
                  type="text"
                  id="descripcion"
                  placeholder="Descripcion del Producto"
                  {...register("descripcion", {
                    required: "La descripcion del prodcuto es obligatoria",
                  })}
                />
                {errors.descripcion && (
                  <p className="error-message">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="categoria">Categoría del Producto</label>
                <input
                  type="text"
                  id="categoria"
                  placeholder="Categoría del Producto"
                  {...register("categoria", {
                    required: "La categoría del prodcuto es obligatoria",
                  })}
                />
                {errors.categoria && (
                  <p className="error-message">{errors.categoria.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="precioCompra">Precio de Compra</label>
                <input
                  type="number"
                  id="precioCompra"
                  placeholder="Precio de Compra del Producto"
                  {...register("precioCompra", {
                    required: "El Precio de Compra del prodcuto es obligatorio",
                    valueAsNumber: true,
                  })}
                />
                {errors.precioCompra && (
                  <p className="error-message">{errors.precioCompra.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="precioVenta">Precio de Venta</label>
                <input
                  type="number"
                  id="precioVenta"
                  placeholder="Precio de Venta del Producto"
                  {...register("precioVenta", {
                    required: "El Precio de Venta del prodcuto es obligatorio",
                    valueAsNumber: true,
                  })}
                />
                {errors.precioVenta && (
                  <p className="error-message">{errors.precioVenta.message}</p>
                )}
              </div>

              {loading ? (
                <p className="simple-text">Cargando Proveedores...</p>
              ) : error && suppliers.length === 0 ? (
                <p style={{ color: "#e74c3c" }}>{error}</p>
              ) : (
                <div className="input-group" style={{ marginBottom: "30px" }}>
                  <label htmlFor="password">Proveedor del Producto</label>
                  <select
                    id="id_proveedor"
                    {...register("id_proveedor", {
                      required: "El proveedor del producto es obligatorio",
                      valueAsNumber: true,
                    })}
                    className="custom-select"
                    disabled={suppliers.length === 0}
                  >
                    <option value={""}>---</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.nombre} ({supplier.ciudad.nombre})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cargando..." : "Agregar Producto"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para mostrar resultado exitoso en caso de haberse agregado el producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Producto agregado correctamente"
        actionButtonText="Ir a Productos"
        onAction={() => navigate("/productos")}
      >
        {producto ? (
          <div>
            <p>
              <strong>ID Producto:</strong> {producto?.id}
            </p>
            <p>
              <strong>Nombre:</strong> {producto?.nombre}
            </p>
            <p>
              <strong>Categoria:</strong> {producto?.categoria}
            </p>
            <p>
              <strong>Precio de Venta:</strong> {producto?.precioVenta}
            </p>
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </Modal>
    </>
  );
};

export default AgregarProducto;
