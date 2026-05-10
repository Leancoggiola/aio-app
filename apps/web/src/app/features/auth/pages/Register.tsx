import { Alert, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../core/auth";
import { AuthCard } from "../components/AuthCard";

import type { FC } from "react";
import { registerSchema } from "@aio-app/shared/auth";
import type { RegisterPayload } from "@aio-app/shared/auth";

export const Register: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterPayload>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: schemaResolver(registerSchema, { sync: true }),
  });

  const handleSubmit = async ({ name, email, password }: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      const from = (location.state as { from?: string })?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={
        <>
          Crea tu cuenta en
          <br /> All in One
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
            label="Nombre"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
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
            Registrarse
          </Button>
        </Stack>
      </form>

      <Button onClick={() => navigate("/login")} variant="subtle">
        ¿Ya tienes cuenta? Inicia sesión aquí.
      </Button>
    </AuthCard>
  );
};
