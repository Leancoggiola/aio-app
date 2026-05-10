import { Alert, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../core/auth";
import { AuthCard } from "../components/AuthCard";

import type { FC } from "react";
import { loginSchema } from "@aio-app/shared/auth";
import type { LoginPayload } from "@aio-app/shared/auth";

export const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginPayload>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: schemaResolver(loginSchema, { sync: true }),
  });

  const handleSubmit = async (values: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      const from = (location.state as { from?: string })?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={
        <>
          ¡Te damos la bienvenida a<br /> All in One!
        </>
      }
    >
      {error && (
        <Alert color="red" variant="light">
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Contraseña"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Button size="lg" type="submit" loading={loading}>
            Ingresar
          </Button>
        </Stack>
      </form>

      <Button onClick={() => navigate("/register")} variant="subtle">
        ¿No tienes cuenta? Regístrate aquí.
      </Button>
    </AuthCard>
  );
};
