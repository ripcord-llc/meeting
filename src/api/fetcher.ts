export async function fetcher<T>(key: string): Promise<T> {
  const resp = await fetch(key, {
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
