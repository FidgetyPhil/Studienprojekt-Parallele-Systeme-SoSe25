export type Config = {
  apiUrl: string;
};

let config: Config | null = null;

export async function loadConfig(): Promise<void> {
  const response = await fetch('/config.json');
  if (!response.ok) throw new Error('Config konnte nicht geladen werden');
  const loaded = await response.json();

  // Dynamische API-URL für GitHub Codespaces: Port 5000 → 8080 ersetzen
  if (!loaded.apiUrl || loaded.apiUrl.trim() === '') {
    const host = window.location.hostname;
    const backendHost = host.replace('-5000', '-8080');
    loaded.apiUrl = `https://${backendHost}`;
  }

  config = loaded;
}

export function getConfig(): Config {
  if (!config) throw new Error('Config ist nicht geladen');
  return config;
}