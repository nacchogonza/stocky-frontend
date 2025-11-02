import React from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import logoStocky from "../assets/logo_gemini_3.png";

import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { LOGIN_ENDPOINT } from "../utils/routes";
import LoaderSecondary from "./LoaderSecondary";

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
    formData.append("username", data.username);
    formData.append("password", data.password);
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Error al iniciar sesión. Verifica tus credenciales."
        );
      }

      const result = await response.json();

      const jwtToken = result.access_token;

      login(jwtToken);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      alert(`Fallo en el Login: ${error.message}`);
    }
  };

  return (
    <div className="content-container">
      <div className="login-box">
        <img src={logoStocky} className="logo-login" />
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              {...register("username", {
                required: "El username es obligatorio",
              })}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <LoaderSecondary /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
