export type Config = {
  apiUrl: string;
};

// Lädt config.json und ermittelt ggf. dynamische URL für Codespaces
export async function fetchConfig(): Promise<Config> {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('Konfiguration konnte nicht geladen werden');
  }

  const loaded = await response.json();

  if (!loaded.apiUrl || loaded.apiUrl.trim() === '') {
    const host = window.location.hostname;
    const backendHost = host.replace('-6000', '-5000');
    loaded.apiUrl = `https://${backendHost}`;
  }

  return loaded;
}
