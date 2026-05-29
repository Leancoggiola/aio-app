import { useState } from 'react';
import { Alert, Button, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { getErrorMessage, notifySuccess } from '@/shared/ui';

import type { FC } from 'react';

import { changePasswordSchema } from '@aio-app/shared/users';

interface PasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
}

export const PasswordForm: FC<PasswordFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: value => {
        const parsed = changePasswordSchema.safeParse({ newPassword: value });
        if (!parsed.success) {
          return parsed.error.issues[0]?.message ?? 'Contraseña inválida';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (value.length < 8) {
          return 'La contraseña debe tener al menos 8 caracteres';
        }
        if (value !== values.newPassword) {
          return 'Las contraseñas no coinciden';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values.newPassword);
      form.reset();
      notifySuccess('Contraseña actualizada correctamente');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar la contraseña'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
        <PasswordInput label="Nueva contraseña" key={form.key('newPassword')} {...form.getInputProps('newPassword')} />
        <PasswordInput
          label="Confirmar contraseña"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" loading={loading}>
          Cambiar contraseña
        </Button>
      </Stack>
    </form>
  );
};
