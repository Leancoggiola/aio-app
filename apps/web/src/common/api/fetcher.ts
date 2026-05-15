export class ApiError extends Error {
  status: number;
  info: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    throw new ApiError(
      (info as Record<string, string>).message || res.statusText,
      res.status,
      info,
    );
  }

  return res.json();
};
