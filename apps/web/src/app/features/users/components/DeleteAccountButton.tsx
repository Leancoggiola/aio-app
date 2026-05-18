import { FC, useState } from 'react';
import { Button, Modal, Stack, Text } from '@mantine/core';

interface DeleteAccountButtonProps {
  onDelete: () => Promise<void>;
}

export const DeleteAccountButton: FC<DeleteAccountButtonProps> = ({ onDelete }) => {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch {
      setLoading(false);
      setOpened(false);
    }
  };

  return (
    <>
      <Button color="red" variant="outline" onClick={() => setOpened(true)}>
        Eliminar cuenta
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Eliminar cuenta" centered>
        <Stack gap="md">
          <Text>
            ¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Se borrarán todos tus datos de
            forma permanente.
          </Text>
          <Button color="red" loading={loading} onClick={handleDelete} fullWidth>
            Sí, eliminar mi cuenta
          </Button>
          <Button variant="default" onClick={() => setOpened(false)} fullWidth>
            Cancelar
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
