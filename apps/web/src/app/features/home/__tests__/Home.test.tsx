import { MantineProvider } from "@mantine/core";
import { describe, expect, it } from "vitest";

import { HomePage } from "../Home";

import { render, screen } from "@testing-library/react";

function renderWithProviders(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("HomePage", () => {
  it("renders the button", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });
});
