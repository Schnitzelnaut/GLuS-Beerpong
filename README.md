# 🍺 GLuS BeerPong — PWA

Liga + Turnier in einer App, mit Berechtigungssystem.

## Erste Einrichtung
Beim ersten Öffnen wirst du gebeten, **Admin-** und **Editor-Passwörter** festzulegen.
- 👑 **Admin**: kann alles (Spieler verwalten, Einstellungen, Saison-Reset)
- ✏️ **Editor**: darf Spielergebnisse eintragen
- 👁️ **Viewer**: kann Tabellen, Vergleich und Archiv ansehen (Standard ohne Login)

⚠️ Die Passwörter sind nur ein Schutz vor versehentlichen Änderungen — sie sind im Quellcode der Datei sichtbar. Für eine Liga unter Freunden reicht das aber locker.

## Hosten
- **Netlify Drop:** https://app.netlify.com/drop — Ordner reinziehen, fertig.
- **GitHub Pages:** Repo erstellen, Dateien hochladen, Settings → Pages → Branch: main → Save.

## Auf dem Handy installieren
- iPhone (Safari): Teilen → "Zum Home-Bildschirm"
- Android (Chrome): Menü → "App installieren"

## Wichtig: Daten sind pro Browser
Liga-Daten werden im Browser unter `glus_liga_state` gespeichert. Wenn du
auf zwei Geräten auf die App zugreifst, hat jedes seinen eigenen Datenstand.
Wenn der Cache geleert wird gehen Daten verloren — exportiere ggf. deinen
localStorage-Inhalt regelmäßig wenn das wichtig ist.
