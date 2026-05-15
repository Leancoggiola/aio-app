import { FC } from "react";
import { Stack, Switch } from "@mantine/core";

import type { UserPreferences } from "@aio-app/shared/users";

interface PreferencesFormProps {
  preferences: UserPreferences;
  onUpdate: (data: { notifications?: boolean }) => Promise<unknown>;
}

export const PreferencesForm: FC<PreferencesFormProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <Stack gap="sm">
      <Switch
        label="Notifications"
        checked={preferences.notifications}
        onChange={(e) => onUpdate({ notifications: e.currentTarget.checked })}
      />
    </Stack>
  );
};
