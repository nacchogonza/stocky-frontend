import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { useForm } from "react-hook-form";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { CIUDADES_ENDPOINT, CLIENTES_ENDPOINT } from "../../utils/routes";
import Modal from "../Modal";

const AgregarCliente = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [cliente, setCliente] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  /* Carga inicial de ciudades para mostrar en el Select */
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetchAuthenticated(CIUDADES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar ciudades");
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(`No se pudieron cargar las ciudades: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [navigate]);

  /* Funcion on submit con logica para armar el contenido del cliente a enviar */
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      /* Armado de request con POST y definiendo header de tipo JSON, distinto al caso de Login */
      const response = await fetchAuthenticated(CLIENTES_ENDPOINT, {
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
        throw new Error(errorBody.detail || "Fallo al agregar el cliente");
      }

      const jsonData = await response.json();

      /* Guardamos el resultado en el state de cliente para poder usarlo en el modal */
      setCliente(jsonData);

      /* Marcamos como open el Modal */
      setIsModalOpen(true);

      /* Usamos la funcion reset de react-hook-form para limpiar los campos y poder agregar nuevos clientes */
      reset();
    } catch (err) {
      setError(`No se pudo agregar el cliente: ${err.message}`);
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
              <h1 style={{ margin: 0 }}>Agregar Cliente</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {/* Formulario con campos requeridos para Cliente */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <label htmlFor="nombre">Nombre del Cliente</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del Cliente"
                  {...register("nombre", {
                    required: "El nombre del cliente es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <p className="error-message">{errors.nombre.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="telefono">Telefono del Cliente</label>
                <input
                  type="tel"
                  id="telefono"
                  placeholder="Telefono del Cliente"
                  {...register("telefono", {
                    required: "El telefono del cliente es obligatorio",
                  })}
                />
                {errors.telefono && (
                  <p className="error-message">{errors.telefono.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email del Cliente</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email del Cliente"
                  {...register("email", {
                    required: "El Email del cliente es obligatorio",
                  })}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="precioCompra">Dirección del Cliente</label>
                <input
                  type="text"
                  id="direccion"
                  placeholder="Dirección del Cliente"
                  {...register("direccion", {
                    required: "La Dirección del cliente es obligatoria",
                  })}
                />
                {errors.direccion && (
                  <p className="error-message">{errors.direccion.message}</p>
                )}
              </div>

              {loading ? (
                <p className="simple-text">Cargando Ciudades...</p>
              ) : error && cities.length === 0 ? (
                <p style={{ color: "#e74c3c" }}>{error}</p>
              ) : (
                <div className="input-group" style={{ marginBottom: "30px" }}>
                  <label htmlFor="id_ciudad">Ciudad</label>
                  <select
                    id="id_ciudad"
                    {...register("id_ciudad", {
                      required: "La ciudad del Cliente es obligatoria",
                    })}
                    className="custom-select"
                    disabled={cities.length === 0}
                  >
                    <option value={""}>---</option>
                    {cities.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre} ({ciudad.nombre})
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
                {isSubmitting ? "Cargando..." : "Agregar Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para mostrar resultado exitoso en caso de haberse agregado el cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cliente agregado correctamente"
        actionButtonText="Ir a Clientes"
        onAction={() => navigate("/clientes")}
      >
        {cliente ? (
          <div>
            <p>
              <strong>ID Cliente:</strong> {cliente?.id}
            </p>
            <p>
              <strong>Nombre:</strong> {cliente?.nombre}
            </p>
            <p>
              <strong>Telefono:</strong> {cliente?.telefono}
            </p>
            <p>
              <strong>Email:</strong> {cliente?.email}
            </p>
            <p>
              <strong>Dirección:</strong> {cliente?.direccion}
            </p>
            <p>
              <strong>Ciudad:</strong> {cliente?.ciudad?.nombre}
            </p>
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </Modal>
    </>
  );
};

export default AgregarCliente;
