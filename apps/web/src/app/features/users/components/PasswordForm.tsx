import { FC, useState } from "react";
import { PasswordInput, Button, Stack } from "@mantine/core";

interface PasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
}

export const PasswordForm: FC<PasswordFormProps> = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          required
          minLength={8}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required
          minLength={8}
        />
        {error && (
          <div style={{ color: "var(--mantine-color-red-6)", fontSize: 14 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: "var(--mantine-color-green-6)", fontSize: 14 }}>
            Password updated successfully
          </div>
        )}
        <Button type="submit" loading={loading}>
          Change Password
        </Button>
      </Stack>
    </form>
  );
};
