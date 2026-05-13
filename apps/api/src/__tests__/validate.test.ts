import { describe, it, expect, vi } from "vitest";
import { validate } from "../common/validate";
import { z } from "zod";
import type { Request, Response } from "express";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    query: {},
    params: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

describe("validate middleware", () => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
  });

  it("should pass and parse valid body", () => {
    const req = mockReq({ body: { email: "test@test.com", name: "John" } });
    const next = vi.fn();

    validate(schema)(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ email: "test@test.com", name: "John" });
  });

  it("should strip unknown fields from body", () => {
    const req = mockReq({
      body: { email: "test@test.com", name: "John", extra: "field" },
    });
    const next = vi.fn();

    validate(schema)(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).not.toHaveProperty("extra");
  });

  it("should call next with error on invalid body", () => {
    const req = mockReq({ body: { email: "invalid", name: "" } });
    const next = vi.fn();

    validate(schema)(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "Error de validación",
      }),
    );
  });

  it("should validate query params when target is query", () => {
    const querySchema = z.object({ page: z.coerce.number().min(1) });
    const req = mockReq({
      query: { page: "3" } as unknown as Request["query"],
    });
    const next = vi.fn();

    validate(querySchema, "query")(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query).toEqual({ page: 3 });
  });

  it("should validate params when target is params", () => {
    const paramsSchema = z.object({ id: z.string().min(1) });
    const req = mockReq({
      params: { id: "abc123" } as unknown as Request["params"],
    });
    const next = vi.fn();

    validate(paramsSchema, "params")(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.params).toEqual({ id: "abc123" });
  });
});
