import { FC, useState } from "react";
import { Button, Modal, Stack, Text } from "@mantine/core";

interface DeleteAccountButtonProps {
  onDelete: () => Promise<void>;
}

export const DeleteAccountButton: FC<DeleteAccountButtonProps> = ({
  onDelete,
}) => {
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
        Delete Account
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Account"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete your account? This action cannot be
            undone. All your data will be permanently removed.
          </Text>
          <Button
            color="red"
            loading={loading}
            onClick={handleDelete}
            fullWidth
          >
            Yes, delete my account
          </Button>
          <Button variant="default" onClick={() => setOpened(false)} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
