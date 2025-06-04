import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Item = {
  name: string;
  amount: number;
};

type Config = {
  apiUrl: string;
};

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AppComponent implements OnInit {
  items: Item[] = [];

  name = '';
  amount = 1;
  updateName = '';
  updateAmount = 1;
  deleteName = '';

  defaultApiUrl = '';
  customApiUrl = '';
  manualApiInput = '';
  configError: string | null = null;

  constructor(private http: HttpClient) {}

  // Helper: entfernt alle Slashes am Ende der URL
  cleanUrl(url: string): string {
    return url.trim().replace(/\/+$/, '');
  }

  getCurrentApiUrl(): string {
    return this.cleanUrl(this.customApiUrl || this.defaultApiUrl);
  }

  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  async ngOnInit() {
    const defaultUrl = await this.loadConfig();
    const stored = localStorage.getItem('apiUrl');
    const url = stored ?? defaultUrl ?? '';

    this.customApiUrl = this.cleanUrl(url);
    this.manualApiInput = '';
    await this.loadItems(this.customApiUrl);
  }

  async loadConfig(): Promise<string> {
    try {
      const config = await this.http.get<Config>('assets/config.json').toPromise();
      let apiUrl = config?.apiUrl?.trim();

      if (!apiUrl) {
        const host = window.location.hostname;
        apiUrl = `https://${host.replace('-6001', '-5001')}`;
      }

      this.defaultApiUrl = this.cleanUrl(apiUrl);
      this.configError = null;
      return this.defaultApiUrl;
    } catch (err) {
      this.configError = 'Fehler beim Laden der Konfiguration';
      console.error(err);
      return '';
    }
  }

  async loadItems(url: string) {
    const cleanUrl = this.cleanUrl(url);
    try {
      const items = await this.http.get<Item[]>(`${cleanUrl}/items`).toPromise();
      this.items = items ?? [];
      this.configError = null;
    } catch (err) {
      this.items = [];
      this.configError = 'Fehler beim Laden der Items';
      console.error(err);
    }
  }

  async applyCustomUrl() {
    if (!this.manualApiInput.trim()) return;
    const cleanUrl = this.cleanUrl(this.manualApiInput);
    localStorage.setItem('apiUrl', cleanUrl);
    this.customApiUrl = cleanUrl;
    await this.loadItems(cleanUrl);
  }

  async resetUrl() {
    localStorage.removeItem('apiUrl');
    this.customApiUrl = this.defaultApiUrl;
    this.manualApiInput = '';
    await this.loadItems(this.defaultApiUrl);
  }

  async switchToBackend(port: string) {
    const host = window.location.hostname;
    const targetUrl = `https://${host.replace('-6001', `-${port}`)}`;
    const cleanUrl = this.cleanUrl(targetUrl);
    localStorage.setItem('apiUrl', cleanUrl);
    this.customApiUrl = cleanUrl;
    this.manualApiInput = '';
    await this.loadItems(cleanUrl);
  }

  async addItem() {
    const cleanUrl = this.getCurrentApiUrl();
    try {
      await this.http.post(`${cleanUrl}/items`, {
        name: this.name,
        amount: this.amount,
      }).toPromise();
      this.name = '';
      this.amount = 1;
      await this.loadItems(cleanUrl);
    } catch (err) {
      this.configError = 'Fehler beim Hinzufügen des Items';
      console.error(err);
    }
  }

  async updateItem() {
    const cleanUrl = this.getCurrentApiUrl();
    try {
      await this.http.put(`${cleanUrl}/items/${this.updateName}`, {
        amount: this.updateAmount,
      }).toPromise();
      this.updateName = '';
      this.updateAmount = 1;
      await this.loadItems(cleanUrl);
    } catch (err) {
      this.configError = 'Fehler beim Aktualisieren des Items';
      console.error(err);
    }
  }

  async deleteItem() {
    const cleanUrl = this.getCurrentApiUrl();
    try {
      await this.http.delete(`${cleanUrl}/items/${this.deleteName}`).toPromise();
      this.deleteName = '';
      await this.loadItems(cleanUrl);
    } catch (err) {
      this.configError = 'Fehler beim Löschen des Items';
      console.error(err);
    }
  }
}
