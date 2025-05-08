import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig = { apiUrl: '' };

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return firstValueFrom(this.http.get<AppConfig>('assets/config.json'))
      .then((loadedConfig: AppConfig) => {
        if (!loadedConfig.apiUrl || loadedConfig.apiUrl.trim() === '') {
          const host = window.location.hostname;
          loadedConfig.apiUrl = `https://${host.replace('-4200', '-8080')}`;
        }
        this.config = loadedConfig;
      });
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}