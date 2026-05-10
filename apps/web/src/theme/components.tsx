import { Paper, PasswordInput, TextInput } from "@mantine/core";

export const ComponentsOverride = {
  Paper: Paper.extend({
    defaultProps: { p: "lg", withBorder: true, bd: "gray.1" },
  }),

  // Inputs
  PasswordInput: PasswordInput.extend({ defaultProps: { size: "md" } }),
  TextInput: TextInput.extend({ defaultProps: { size: "md" } }),
};
