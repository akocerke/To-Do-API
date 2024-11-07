# To-Do API Dokumentation

## Überblick

Die To-Do API ermöglicht es Benutzern, ihre Aufgaben zu verwalten. Die API bietet Endpunkte zur Benutzerregistrierung, -anmeldung und für die Verwaltung von To-Do-Aufgaben (Erstellen, Abrufen, Aktualisieren, Löschen).


---
## Basis-URL

Die API ist unter folgender Basis-URL erreichbar:

```
http://localhost:5050/todo-api
```

- **Port:** 5050
- **Basis-Pfad:** `/todo-api`

Alle API-Endpunkte sind unter `/todo-api` verfügbar, z. B.:

- Benutzer registrieren (POST `/todo-api/signup`)
- Benutzer anmelden (POST `/todo-api/login`)
- Alle Aufgaben anzeigen (GET `/todo-api/todos/all`)

---

## Verwendung des **AppRouter** mit Middleware

Die API nutzt **Middleware** und den **AppRouter**, um sicherzustellen, dass alle Routen unter dem Pfad `/todo-api` zugänglich sind und die Middleware für Authentifizierung und andere Operationen ausgeführt wird.


### Bedeutung der Middleware

1. **Authentifizierung:** Die Middleware prüft, ob ein gültiges JWT-Token im Header der Anfrage übermittelt wird, bevor auf die geschützten Endpunkte zugegriffen werden kann.
2. **Routenstruktur:** Alle Routen wie `/signup`, `/login`, und `/todos` sind unter `/todo-api` verfügbar und verwenden die `authenticateMiddleware`, um sicherzustellen, dass die Benutzer angemeldet sind (mit gültigem Token).

---

## Authentifizierung

Die API verwendet **JWT (JSON Web Tokens)** zur Authentifizierung. Um auf geschützte Routen zugreifen zu können, müssen Benutzer einen gültigen Token mit jeder Anfrage senden.

---

## Endpunkte

### Auth-API

#### 1. **Benutzer registrieren (POST /signup)**

- **URL:** `/todo-api/auth/signup`
- **Methode:** POST
- **Body:** 
  ```json
  {
    "username": "maxmustermann",
    "email": "max@example.com",
    "password": "password123"
  }
  ```
- **Antwort:** 
  - Erfolgreich: `201 Created` mit Benutzerinformationen
  - Fehler: `400 Bad Request` bei fehlerhaften Eingaben

#### 2. **Benutzer anmelden (POST /login)**

- **URL:** `/todo-api/auth/login`
- **Methode:** POST
- **Body:** 
  ```json
  {
    "email": "max@example.com",
    "password": "password123"
  }
  ```
- **Antwort:** 
  - Erfolgreich: `200 OK` mit JWT-Token
  - Fehler: `401 Unauthorized` bei falschen Anmeldedaten

#### 3. **Benutzer abmelden (POST /logout)**

- **URL:** `/todo-api/auth/logout`
- **Methode:** POST
- **Header:** Authorization: `Bearer <JWT-Token>`
- **Antwort:** 
  - Erfolgreich: `200 OK` mit Logout-Bestätigung
  - Fehler: `401 Unauthorized` bei fehlerhaften Token

---
### Benutzer API

**Hinweis:** Diese API wird derzeit vervollständigt. In Zukunft wird sie Funktionen zur Benutzerverwaltung wie sein Profil abzurufen, seinen Benutzernamen und seine E-Mail zu ändern sowie sein Passwort zu aktualisieren.

---

## **To-Do API**

Die API ermöglicht die Verwaltung von Aufgaben für authentifizierte Benutzer. Alle Anfragen erfordern ein gültiges JWT-Token für die Authentifizierung. 

### 1. **Alle Aufgaben anzeigen (GET /todos/all)**

- **URL:** `/todo-api/todos/all`
- **Methode:** GET
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Antwort:**
  - **Erfolgreich (200 OK):** Eine Liste der To-Dos des Benutzers.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.
  - **Fehler (404 Not Found):** Wenn keine To-Dos für den Benutzer gefunden werden.

---

### 2. **Wichtige Aufgaben anzeigen (GET /todos/important)**

- **URL:** `/todo-api/todos/important`
- **Methode:** GET
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Antwort:**
  - **Erfolgreich (200 OK):** Eine Liste der wichtigen To-Dos des Benutzers.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.
  - **Fehler (404 Not Found):** Wenn keine wichtigen To-Dos für den Benutzer gefunden werden.

---

### 3. **Neue Aufgabe erstellen (POST /todos/create)**

- **URL:** `/todo-api/todos/create`
- **Methode:** POST
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "title": "Neue Aufgabe",
    "description": "Beschreibung der Aufgabe",
    "status": "offen",  // optional
    "is_important": false,  // optional, Standard ist false
    "due_date": "2024-11-11T12:00:00Z"  // Erforderlich, im richtigen Datumsformat
  }
  ```
- **Antwort:**
  - **Erfolgreich (201 Created):** Bestätigung, dass das To-Do erfolgreich erstellt wurde.
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder die Eingabe ungültig ist.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.

---

### 4. **Aufgabe aktualisieren (PUT /todos/update)**

- **URL:** `/todo-api/todos/update`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1,  // ID der Aufgabe
    "title": "Aktualisierter Titel",  // optional
    "description": "Aktualisierte Beschreibung",  // optional
    "status": "abgeschlossen",  // optional
    "is_important": true  // optional
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass die Aufgabe erfolgreich aktualisiert wurde.
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder ungültig sind.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat.

---

### 5. **Status einer Aufgabe ändern (PUT /todos/status)**

- **URL:** `/todo-api/todos/status`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1,  // ID der Aufgabe
    "status": "abgeschlossen"  // Der neue Status (offen, in Bearbeitung, abgeschlossen)
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass der Status der Aufgabe erfolgreich geändert wurde.
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder ungültig sind.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat.

---

### 6. **Aufgabe löschen (DELETE /todos/delete)**

- **URL:** `/todo-api/todos/delete`
- **Methode:** DELETE
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1  // ID der Aufgabe, die gelöscht werden soll
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass die Aufgabe erfolgreich gelöscht wurde.
  - **Fehler (400 Bad Request):** Wenn die To-Do-ID fehlt oder ungültig ist.
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist.
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat.

---

### **Wichtige Hinweise zur Middleware**

- Die **Middleware** stellt sicher, dass **alle** Anfragen an die geschützten Endpunkte (wie z.B- `/todos/all`, etc.) durch eine Authentifizierung überprüft werden. Wenn das Token ungültig oder abwesend ist, wird der Zugriff mit einem **401 Unauthorized** Fehler abgelehnt.
- Der **AppRouter** sorgt dafür, dass diese Middleware für alle API-Routen unter `/todo-api` angewendet wird.

---
