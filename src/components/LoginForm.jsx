import React from "react";
import { useForm } from "react-hook-form";
import "../App.css";

import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/token`;

const LoginForm = () => {

    const { login } = useAuth();
const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.user);
    formData.append("password", data.password);
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      // 2. Manejo de errores HTTP (ej: 401 Unauthorized, 404 Not Found)
      if (!response.ok) {
        // Si la respuesta no es 2xx, lanza un error
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Error al iniciar sesión. Verifica tus credenciales."
        );
      }

      // 3. Procesa la respuesta exitosa (código 200 OK)
      const result = await response.json();

      // 4. Extrae y almacena el JWT
      const jwtToken = result.access_token; // Asumiendo que el campo se llama 'token'

      login(jwtToken);

      // 🔥 Almacenamiento: Guarda el token (Recomendado: Local Storage o Cookies)
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      alert(`Fallo en el Login: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              // 4. Enlaza el input usando register de RHF
              {...register("username", { required: "El username es obligatorio" })}
            />
            {/* Muestra el error si existe */}
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          {/* Input de Contraseña */}
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              // 4. Enlaza el input usando register de RHF
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {/* Muestra el error si existe */}
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting} // Deshabilita mientras se envía
          >
            {isSubmitting ? "Cargando..." : "Entrar"}
          </button>

          <div className="links-secundarios">
            <a href="#">¿Olvidaste tu contraseña?</a>
            <span>|</span>
            <a href="#">Crear una cuenta</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
