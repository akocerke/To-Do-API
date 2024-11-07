# **To-Do API Dokumentation**

## **Überblick**

Die To-Do API ermöglicht es Benutzern, ihre Aufgaben zu verwalten. Die API bietet Endpunkte zur Benutzerregistrierung, -anmeldung und für die Verwaltung von To-Do-Aufgaben (Erstellen, Abrufen, Aktualisieren, Löschen).

---

## **Basis-URL**

Die API ist unter folgender Basis-URL erreichbar:

```
http://localhost:5050/todo-api
```

- **Port:** 5050
- **Basis-Pfad:** `/todo-api`

Alle API-Endpunkte sind unter `/todo-api` verfügbar, z. B.:

- Benutzer registrieren (POST `/todo-api/auth/signup`)
- Benutzer anmelden (POST `/todo-api/auth/login`)
- Alle Aufgaben anzeigen (GET `/todo-api/todos/all`)

---

## **Verwendung des AppRouter mit Middleware**

Die API nutzt **Middleware** und den **AppRouter**, um sicherzustellen, dass alle Routen unter dem Pfad `/todo-api` zugänglich sind und die Middleware für Authentifizierung und andere Operationen ausgeführt wird.

### **Bedeutung der Middleware**

1. **Authentifizierung:** Die Middleware prüft, ob ein gültiges JWT-Token im Header der Anfrage übermittelt wird, bevor auf die geschützten Endpunkte zugegriffen werden kann.
2. **Routenstruktur:** Alle Routen wie `/auth/signup`, `/auth/login`, und `/todos` sind unter `/todo-api` verfügbar und verwenden die `authenticateMiddleware`, um sicherzustellen, dass die Benutzer angemeldet sind (mit gültigem Token).

---

## **Authentifizierung**

Die API verwendet **JWT (JSON Web Tokens)** zur Authentifizierung. Um auf geschützte Routen zugreifen zu können, müssen Benutzer einen gültigen Token mit jeder Anfrage senden.

---

## **Endpunkte**

### **Auth-API**

#### 1. **Benutzer registrieren (POST /auth/signup)**

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
  - **Erfolgreich:** `201 Created` mit Benutzerinformationen
  - **Fehler:** `400 Bad Request` bei fehlerhaften Eingaben


#### 2. **Benutzer anmelden (POST /auth/login)**

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
  - **Erfolgreich (200 OK):** Bei erfolgreichem Login wird ein **JWT-Token** im Antwort-Body zurückgegeben.
  - **Fehler (401 Unauthorized):** Bei falschen Anmeldedaten wird ein Fehler mit **401 Unauthorized** zurückgegeben.

  ##### **JWT-Token im Header verwenden**

  Nach einem erfolgreichen Login erhalten Benutzer ein **JWT-Token**. Dieses Token muss in den folgenden Anfragen an geschützte Endpunkte über den **Authorization-Header** übermittelt werden.

  - **Header:**
    ```
    Authorization: Bearer <JWT-Token>
    ```

  Das Token wird zur Authentifizierung genutzt und ermöglicht den Zugriff auf alle Endpunkte, die eine Anmeldung erfordern (z.B. `/todos/all`, `/users/profile` usw.).



#### 3. **Benutzer abmelden (POST /auth/logout)**

- **URL:** `/todo-api/auth/logout`
- **Methode:** POST
- **Header:** 
  ```
  Authorization: Bearer <JWT-Token>
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bei erfolgreichem Logout wird eine Bestätigung zurückgegeben.
  - **Fehler (401 Unauthorized):** Wenn das Token ungültig oder nicht vorhanden ist, wird ein Fehler mit **401 Unauthorized** zurückgegeben.


- Der **Authorization-Header** muss das **JWT-Token** enthalten, das nach der Anmeldung erhalten wurde, um die Abmeldung des Benutzers zu ermöglichen. Nach einem erfolgreichen Logout wird das Token ungültig und der Benutzer muss sich erneut anmelden, um ein neues Token zu erhalten.

---

## **Benutzer API**

#### 1. **Benutzerdaten abrufen (GET /users/profile)**

- **URL:** `/todo-api/users/profile`
- **Methode:** GET
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Antwort:**
  - **Erfolgreich (200 OK):** Benutzerprofilinformationen
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist

---

#### 2. **Benutzernamen ändern (PUT /users/username)**

- **URL:** `/todo-api/users/username`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "newUsername": "neuerBenutzername"
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung der Änderung des Benutzernamens
  - **Fehler (400 Bad Request):** Wenn der Benutzername ungültig ist
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist

---

#### 3. **E-Mail-Adresse ändern (PUT /users/email)**

- **URL:** `/todo-api/users/email`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "newEmail": "neue.email@example.com"
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung der Änderung der E-Mail-Adresse
  - **Fehler (400 Bad Request):** Wenn die E-Mail-Adresse ungültig ist
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist

---

#### 4. **Passwort ändern (PUT /users/password)**

- **URL:** `/todo-api/users/password`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "oldPassword": "altesPasswort",
    "newPassword": "neuesPasswort123",
    "confirmPassword": "neuesPasswort123"
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung der Änderung des Passworts
  - **Fehler (400 Bad Request):** Wenn das alte Passwort falsch ist oder das neue Passwort ungültig ist
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist

---

## **To-Do API**

Die API ermöglicht die Verwaltung von Aufgaben für authentifizierte Benutzer. Alle Anfragen erfordern ein gültiges JWT-Token für die Authentifizierung.

#### 1. **Alle Aufgaben anzeigen (GET /todos/all)**

- **URL:** `/todo-api/todos/all`
- **Methode:** GET
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Antwort:**
  - **Erfolgreich (200 OK):** Eine Liste der To-Dos des Benutzers
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist
  - **Fehler (404 Not Found):** Wenn keine To-Dos für den Benutzer gefunden werden

---

#### 2. **Wichtige Aufgaben anzeigen (GET /todos/important)**

- **URL:** `/todo-api/todos/important`
- **Methode:** GET
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Antwort:**
  - **Erfolgreich (200 OK):** Eine Liste der wichtigen To-Dos des Benutzers
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist
  - **Fehler (404 Not Found):** Wenn keine wichtigen To-Dos für den Benutzer gefunden werden

---

#### 3. **Neue Aufgabe erstellen (POST /todos/create)**

- **URL:** `/todo-api/todos/create`
- **Methode:** POST
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "title": "Neue Aufgabe",
    "description": "Beschreibung der Aufgabe",
    "status": "offen",
    "is_important": false,
    "due_date": "2024-11-11T12:00:00Z"
  }
  ```
- **Antwort:**
  - **Erfolgreich (201 Created):** Bestätigung, dass das To-Do erfolgreich erstellt wurde
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder die Eingabe ungültig ist
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist

---

#### 4. **Aufgabe aktualisieren (PUT /todos/update)**

- **URL:** `/todo-api/todos/update`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1,
    "title": "Aktualisierter Titel",
    "description": "Aktualisierte Beschreibung",
    "status": "abgeschlossen",
    "is_important": true
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass die Aufgabe erfolgreich aktualisiert wurde
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder ungültig sind
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat

---

#### 5. **Status einer Aufgabe ändern (PUT /todos/status)**

- **URL:** `/todo-api/todos/status`
- **Methode:** PUT
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1,
    "status": "abgeschlossen"
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass der Status der Aufgabe erfolgreich geändert wurde
  - **Fehler (400 Bad Request):** Wenn erforderliche Felder fehlen oder ungültig sind
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat

---

#### 6. **Aufgabe löschen (DELETE /todos/delete)**

- **URL:** `/todo-api/todos/delete`
- **Methode:** DELETE
- **Header:** `Authorization: Bearer <JWT-Token>`
- **Body (JSON):**
  ```json
  {
    "todoId": 1
  }
  ```
- **Antwort:**
  - **Erfolgreich (200 OK):** Bestätigung, dass die Aufgabe erfolgreich gelöscht wurde
  - **Fehler (400 Bad Request):** Wenn die To-Do-ID fehlt oder ungültig ist
  - **Fehler (401 Unauthorized):** Wenn das Token fehlt oder ungültig ist
  - **Fehler (404 Not Found):** Wenn die To-Do nicht gefunden wurde oder der Benutzer keine Berechtigung hat

## **Mögliche Erweiterungen und Implementierungen**

In zukünftigen Versionen der API könnten folgende Erweiterungen und Funktionen hinzugefügt werden:

1. **Passwort-Wiederherstellung:**
   - Implementierung eines Endpunkts zur Passwort-Wiederherstellung.
   - Der Benutzer kann eine E-Mail-Adresse eingeben, um einen Link für die Zurücksetzung des Passworts zu erhalten.
   - Ein sicherer Mechanismus zur Verifizierung der E-Mail-Adresse und zur Generierung eines einmalig gültigen Reset-Tokens, das für die Passwortänderung verwendet werden kann.

2. **Zwei-Faktor-Authentifizierung (2FA):**
   - Einführung der Zwei-Faktor-Authentifizierung (2FA) für zusätzliche Sicherheit bei der Anmeldung.
   - Der Benutzer kann eine Authentifikator-App (z.B. Google Authenticator) verwenden oder eine Telefonnummer für SMS-basierte 2FA hinzufügen.
   - Der Benutzer muss sowohl sein Passwort als auch den 2FA-Code eingeben, um Zugang zu erhalten.

