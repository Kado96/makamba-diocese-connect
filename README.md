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

## 🏗️ Architecture Technique : Synchronisation (Modèle Réutilisable)

Ce projet utilise une architecture de synchronisation "One-Way" (Local -> Prod) très efficace pour les petits et moyens projets. Voici comment la reproduire ailleurs.

### 1. L'Interrupteur de Base de Données (`.env`)
Dans le fichier `settings.py`, nous utilisons une condition basée sur une variable d'environnement :
- **`USE_LOCAL_SQLITE=True`** : Django utilise `db.sqlite3`. C'est **obligatoire** en développement pour éviter l'erreur `MaxClientsInSessionMode` de Supabase (limite de connexions atteintes).
- **`DATABASE_URL=...`** (et `USE_LOCAL_SQLITE=False`) : Utilisé uniquement par le serveur en production ou par le script de synchronisation.

**Pourquoi cette approche ?**
Les offres gratuites/standard de Supabase limitent le nombre de clients connectés simultanément. En travaillant sur **SQLite** localement, vous ne consommez aucune de ces connexions précieuses, vous travaillez plus vite (pas de latence réseau), et vous ne risquez pas de casser les données en ligne par erreur.

### 2. Le Script `sync_local_to_prod.py`
Ce script est le "cerveau" de l'opération. Il gère la synchronisation bidirectionnelle de la manière suivante :

1.  **Double Connexion** : Il ouvre deux connexions simultanées :
    *   `default` : La base SQLite locale (Source).
    *   `prod` : La base Supabase distante (Destination).
2.  **Composants Synchronisés** :
    *   👤 **Sécurité** : Utilisateurs et Profils (Comptes).
    *   ⚙️ **Configuration** : Paramètres du site (Textes, Logos, Couleurs).
    *   ⛪ **Église** : Paroisses, Ministères et leurs activités.
    *   📖 **Enseignement** : Sermons et leurs catégories.
    *   📰 **Communication** : Annonces, Articles et Témoignages.
    *   📄 **Contenu Web** : Timeline, Valeurs, Vision, Équipe et Présentation du Diocèse.
3.  **Vérification d'Existence** : Pour chaque élément :
    *   Il regarde si l'**ID** existe déjà en production.
    *   **Si OUI** ➔ Il met à jour l'élément (`UPDATE`).
    *   **Si NON** ➔ Il crée l'élément avec le même ID (`CREATE`).
4.  **Ordre des Dépendances** : Le script traite d'abord les tables "parents" (ex: Catégories) avant les tables "enfants" (ex: Sermons) pour éviter les erreurs de clés étrangères.

### 3. Gestion de la Pagination (DRF) dans le Frontend
Par défaut, Django REST Framework pagine les résultats. En production, l'API renvoie `{ "results": [...] }` au lieu d'une simple liste `[...]`.
- **Règle** : Toujours utiliser la vérification suivante lors du `fetch` :
  ```javascript
  const data = response.data.results || response.data;
  ```
- Cela garantit que votre code `.map()` ou `.filter()` ne plantera pas si la structure change.

### 4. Accessibilité et Autofill (Formulaires)
Pour que les navigateurs (Chrome, Safari, etc.) puissent remplir automatiquement les mots de passe et les emails, et pour garantir une bonne accessibilité (Lighthouse) :
- **ID Unique** : Chaque `Input` doit avoir un `id` correspondant au `htmlFor` de son `Label`.
- **Attribut Name** : Indispensable pour que le navigateur comprenne ce que contient le champ (ex: `name="email"`).
- **Auto-complete** : Toujours spécifier le type (ex: `autoComplete="current-password"` ou `"username"`).

**Exemple de structure parfaite :**
```tsx
<Label htmlFor="user-email">Email</Label>
<Input 
  id="user-email" 
  name="email" 
  type="email" 
  autoComplete="email" 
/>
```

### 5. Pourquoi c'est mieux que `dumpdata` ?
- **Pas d'écrasement total** : Contrairement à `loaddata`, ce script ne supprime rien en production. Il fusionne les données.
- **Sécurité** : Si une erreur survient au milieu, la transaction `transaction.atomic` annule tout pour éviter une base de données corrompue.
- **Liberté** : Vous pouvez modifier un texte en local et l'envoyer en production en 2 secondes sans toucher au code.

---
© 2026 Diocèse de Makamba - Église Anglicane du Burundi.
