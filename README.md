# ⛪ Makamba Diocese Connect

Application complète pour la gestion et la communication du **Diocèse de Makamba (Burundi)**, comprenant un backend Django performant et un frontend React moderne et multilingue.

## 🚀 Structure du Projet

- **Backend** : Django REST Framework, PostgreSQL (**Supabase**) en production, SQLite en développement local.
- **Frontend** : React, Vite, Tailwind CSS, TypeScript, Framer Motion (animations).
- **Langues supportées** : Français (FR), Kirundi (RN), Anglais (EN), Kiswahili (SW).

---

## 🛠️ Workflow de Développement : Local vers Production

Le projet est configuré pour séparer strictement le développement (local) de la production (Supabase).

### Étape 1 : Développement Local (SQLite)
Travaillez en toute sécurité sur votre machine sans impacter le site en ligne.

1. Vérifiez que votre fichier `backend/.env` contient :
   ```env
   DATABASE_URL=votre_url_supabase_ou_sqlite
   DEBUG=True
   ```
   *Note : Si vous voulez forcer SQLite en local, assurez-vous que `DATABASE_URL` n'est pas défini ou pointe vers un fichier .sqlite3.*

2. **Migrations de structure** : Si vous modifiez `models.py` (ex: ajout d'un champ), générez les migrations :
   ```powershell
   cd backend
   .\venv\Scripts\activate
   python manage.py makemigrations
   python manage.py migrate
   ```

### Étape 2 : Déploiement et Synchronisation

Quand vos modifications sont prêtes à être publiées :

**A. Envoyer le Code (Déploiement Render)** :
Envoyez votre code sur GitHub. Le site web se mettra à jour automatiquement sur Render.
```powershell
git add .
git commit -m "Description de vos changements"
git push
```

**B. Synchroniser les Données (Supabase)** :
Pour envoyer vos nouveaux articles, paroisses ou sermons de votre PC vers le site en ligne, utilisez le script de synchronisation depuis le dossier `backend/` :
```powershell
.\venv\Scripts\activate
python sync_local_to_prod.py
```
*Le script compare votre base locale et Supabase pour mettre à jour les données sans créer de doublons.*

---

## 💻 Installation Rapide

### Backend (Python)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React/Vite)
```powershell
cd frontend
npm install
npm run dev
```
*Le frontend sera accessible sur `http://localhost:8080`.*

---

## ⚙️ Administration et Maintenance

- **Accès Admin** : `/admin/login` sur le frontend ou `/admin` sur le backend.
- **Initialisation** : Pour réinitialiser les données de base (noms de sections, langues), lancez :
  ```powershell
  python populate_defaults.py
  ```
- **Images** : Le projet utilise un proxy d'image pour supporter les liens Google Drive sans erreurs de sécurité (CORS).

## 📝 Notes de Sécurité
- Le fichier `db.sqlite3` et les fichiers `.env` sont exclus de Git pour protéger vos données et accès.
- Les accès API sont protégés par des tokens **JWT**.
- En production (Render/Supabase), les fichiers statiques sont servis via **WhiteNoise**.

---
© 2026 Diocèse de Makamba - Église Anglicane du Burundi.
