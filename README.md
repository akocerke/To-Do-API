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

### Benutzer-API

#### 1. **Benutzer registrieren (POST /signup)**

- **URL:** `/todo-api/signup`
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

- **URL:** `/todo-api/login`
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

- **URL:** `/todo-api/logout`
- **Methode:** POST
- **Header:** Authorization: `Bearer <JWT-Token>`
- **Antwort:** 
  - Erfolgreich: `200 OK` mit Logout-Bestätigung
  - Fehler: `401 Unauthorized` bei fehlerhaften Token

---

### To-Do API

#### 1. **Alle Aufgaben anzeigen (GET /todos/all)**

- **URL:** `/todo-api/todos/all`
- **Methode:** GET
- **Header:** Authorization: `Bearer <JWT-Token>`
- **Antwort:** 
  - Erfolgreich: `200 OK` mit Liste der Aufgaben
  - Fehler: `401 Unauthorized` bei fehlendem oder ungültigem Token

---

### Wichtige Hinweise zur Middleware

- Die **Middleware** stellt sicher, dass **alle** Anfragen an die geschützten Endpunkte (wie z.B- `/todos/all`, etc.) durch eine Authentifizierung überprüft werden. Wenn das Token ungültig oder abwesend ist, wird der Zugriff mit einem **401 Unauthorized** Fehler abgelehnt.
- Der **AppRouter** sorgt dafür, dass diese Middleware für alle API-Routen unter `/todo-api` angewendet wird.
