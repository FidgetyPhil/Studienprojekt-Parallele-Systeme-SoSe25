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

  getCurrentApiUrl(): string {
    return this.customApiUrl || this.defaultApiUrl;
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

    this.customApiUrl = url;
    this.manualApiInput = '';
    await this.loadItems(url);
  }

  async loadConfig(): Promise<string> {
    try {
      const config = await this.http.get<Config>('assets/config.json').toPromise();
      let apiUrl = config?.apiUrl?.trim();

      if (!apiUrl) {
        const host = window.location.hostname;
        apiUrl = `https://${host.replace('-6001', '-5001')}`;
      }

      this.defaultApiUrl = apiUrl;
      this.configError = null;
      return apiUrl;
    } catch (err) {
      this.configError = 'Fehler beim Laden der Konfiguration';
      console.error(err);
      return '';
    }
  }

  async loadItems(url: string) {
    try {
      const items = await this.http.get<Item[]>(`${url}/items`).toPromise();
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
    localStorage.setItem('apiUrl', this.manualApiInput);
    this.customApiUrl = this.manualApiInput;
    await this.loadItems(this.manualApiInput);
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
    localStorage.setItem('apiUrl', targetUrl);
    this.customApiUrl = targetUrl;
    this.manualApiInput = '';
    await this.loadItems(targetUrl);
  }

  async addItem() {
    try {
      await this.http.post(`${this.getCurrentApiUrl()}/items`, {
        name: this.name,
        amount: this.amount,
      }).toPromise();
      this.name = '';
      this.amount = 1;
      await this.loadItems(this.getCurrentApiUrl());
    } catch (err) {
      this.configError = 'Fehler beim Hinzufügen des Items';
      console.error(err);
    }
  }

  async updateItem() {
    try {
      await this.http.put(`${this.getCurrentApiUrl()}/items/${this.updateName}`, {
        amount: this.updateAmount,
      }).toPromise();
      this.updateName = '';
      this.updateAmount = 1;
      await this.loadItems(this.getCurrentApiUrl());
    } catch (err) {
      this.configError = 'Fehler beim Aktualisieren des Items';
      console.error(err);
    }
  }

  async deleteItem() {
    try {
      await this.http.delete(`${this.getCurrentApiUrl()}/items/${this.deleteName}`).toPromise();
      this.deleteName = '';
      await this.loadItems(this.getCurrentApiUrl());
    } catch (err) {
      this.configError = 'Fehler beim Löschen des Items';
      console.error(err);
    }
  }
}
