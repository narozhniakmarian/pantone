# Pantone — System Zarządzania Wzornikami Pantone

Wewnętrzny system dla drukarni **Opolgraf S.A.** przeznaczony do ewidencji, wyszukiwania, pobierania oraz kontrolowania fizycznych wzorników Pantone.

## Funkcjonalności

- **Wyszukiwarka Pantonu:**
  - Wyszukiwanie po kodzie Pantone (obsługa numerów bez i z sufiksami: np. `208`, `208 C`, `116`).
  - Dokładny podgląd koloru (HEX) z dołączonej bazy Pantone.
  - Rejestracja pobrania wzornika na konkretną maszynę drukarską (Heidelberg CD-74, CD-102, SM-102, SX-102).
  - Zwrot wzornika z powrotem do magazynu z zachowaniem jego regału i półki.
  - Możliwość usunięcia wzornika bezpośrednio z poziomu wyszukiwarki.

- **Umiejscowienie Pantonu:**
  - Dodawanie nowych fizycznych próbek do bazy z automatycznym rozpoznawaniem i przypisywaniem koloru HEX.
  - Automatyczny zapis szkicu formularza w pamięci podręcznej w razie przerwania wprowadzania.
  - Powiadomienia toast o pomyślnym dodaniu lub błędach walidacji.

- **Usunięcie Pantonu:**
  - Wycofanie konkretnego egzemplarza z aktywnego stanu magazynowego wraz z potwierdzeniem i ostrzeżeniem, jeśli wzornik znajduje się w trakcie pracy na maszynie.

- **Persystencja danych:**
  - Wbudowany serwer API Nuxt Nitro zapisujący i odczytujący dane bezpośrednio z fizycznego pliku `pantone-inventory.json` na dysku.
  - Lokalna pamięć podręczna `localStorage` jako natychmiastowy backup.

- **Interfejs użytkownika:**
  - Nowoczesny, minimalistyczny styl przemysłowy (inspirowany systemem MES Opolgraf S.A. / Shadcn UI).
  - Obsługa motywu jasnego i ciemnego (Light / Dark mode).
  - Wektorowe ikony SVG (brak emoji).

## Wymagania

- Node.js (v20+ / v22+)
- pnpm / npm

## Uruchomienie projektu

```bash
cd pantone-app
pnpm install
pnpm run dev
```

Aplikacja uruchomi się lokalnie pod adresem: `http://localhost:3000`
