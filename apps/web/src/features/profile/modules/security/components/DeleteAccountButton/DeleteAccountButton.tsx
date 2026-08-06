import { FC, useState } from 'react';
import { Button } from '@mantine/core';

import { confirm } from '@/shared/ui';

interface DeleteAccountButtonProps {
  onDelete: () => Promise<void>;
}

export const DeleteAccountButton: FC<DeleteAccountButtonProps> = ({ onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const confirmed = await confirm({
      title: 'Eliminar cuenta',
      description:
        '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Se borrarán todos tus datos de forma permanente.',
      confirmLabel: 'Sí, eliminar mi cuenta',
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button color="destructive" variant="outline" loading={loading} onClick={handleClick}>
      Eliminar cuenta
    </Button>
  );
};
