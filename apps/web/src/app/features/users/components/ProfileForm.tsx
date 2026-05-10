import { FC, useState } from "react";
import { TextInput, Button, Stack } from "@mantine/core";
import type { UserProfile } from "@aio-app/shared/users";

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: { name?: string; email?: string }) => Promise<unknown>;
}

export const ProfileForm: FC<ProfileFormProps> = ({ profile, onSubmit }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updates: Record<string, string> = {};
      if (name !== profile.name) updates.name = name;
      if (email !== profile.email) updates.email = email;
      if (Object.keys(updates).length > 0) {
        await onSubmit(updates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
          minLength={2}
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        {error && (
          <div style={{ color: "var(--mantine-color-red-6)", fontSize: 14 }}>
            {error}
          </div>
        )}
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};
