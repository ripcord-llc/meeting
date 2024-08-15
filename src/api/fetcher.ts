const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.ripcord.io";

export async function fetcher<T>(key: string): Promise<T> {
  const resp = await fetch(BASE_URL + key, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const json = await resp.json();

  if (!resp.ok) {
    throw new Error(json?.message || resp.statusText);
  }

  return json;
}

export async function post<T>(
  path: string,
  body: Record<string, any>
): Promise<T> {
  const resp = await fetch(BASE_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await resp.json();

  if (!resp.ok) {
    throw new Error(json?.message || resp.statusText);
  }

  return json;
}
