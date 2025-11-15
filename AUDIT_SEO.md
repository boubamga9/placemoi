# 🔍 AUDIT SEO & Mots-clés - PLACEMOI

**Date de l'audit :** Janvier 2025  
**Auditeur :** Analyse automatisée du codebase

---

## 📊 RÉSUMÉ EXÉCUTIF

### Points forts ✅
- Structure sémantique correcte (H1, H2, H3)
- Données structurées Schema.org présentes (Product, FAQPage, AboutPage)
- Meta descriptions présentes sur toutes les pages
- Contenu riche et pertinent
- URLs propres et lisibles
- Support de multiples types d'événements (mariage, anniversaire, baptême, conférences, séminaires)

### Points à améliorer ⚠️
- Meta keywords limités (6 mots-clés seulement sur la page d'accueil)
- Incohérence de nom de marque (Pattyly vs PLACEMOI)
- Absence de sitemap.xml
- Alt text des images à optimiser
- Manque de mots-clés long-tail dans le contenu
- URL og:url pointe vers "seatly.com" (ancien nom ?)
- **AUDIT TROP CENTRÉ SUR LE MARIAGE** : L'application supporte aussi anniversaires, baptêmes, conférences, séminaires, galas

---

## 1. META TAGS & ON-PAGE SEO

### 1.1 Page d'accueil (`/`)

**Titre actuel :**
```html
PLACEMOI - Gérer le placement de vos invités en toute simplicité
```

**Analyse :**
- ✅ Contient le nom de la marque
- ✅ Contient un mot-clé principal ("placement de vos invités")
- ⚠️ Manque "plan de table" et "mariage"
- ⚠️ Longueur : 67 caractères (optimal : 50-60)

**Suggestion :**
```
PLACEMOI - Plan de table événement en ligne | QR code + Placement invités
```

**Note :** Utiliser "événement" plutôt que "mariage" pour couvrir tous les types (mariage, anniversaire, baptême, conférence, séminaire, gala)

---

**Meta description actuelle :**
```
Organisez vos événements sans stress. Vos invités trouvent leur table en tapant leur nom. QR code + lien partageable. Simple et efficace.
```

**Analyse :**
- ✅ Longueur : 127 caractères (optimal : 120-160)
- ✅ Contient des mots-clés ("événements", "table", "QR code")
- ⚠️ Manque "mariage", "plan de table"
- ⚠️ Manque un appel à l'action clair

**Suggestion :**
```
Créez votre plan de table événement en ligne en 5 minutes. Mariage, anniversaire, conférence, séminaire. QR code + lien partageable. Vos invités trouvent leur place en 3 secondes. À partir de 49,99€ par événement.
```

---

**Meta keywords actuels :**
```
placement mariage, table invités, mariage, QR code, plan de table, organisation événement
```

**Analyse :**
- ⚠️ Seulement 6 mots-clés (trop limité)
- ⚠️ Manque des variantes importantes
- ⚠️ Pas de mots-clés long-tail

**Suggestion :**
```
plan de table événement, plan de table mariage, plan de table anniversaire, plan de table baptême, plan de table conférence, plan de table séminaire, placement invités, QR code événement, QR code mariage, gestion invités, plan de table en ligne, organisation événement, liste invités, page invités, album photo collaboratif, collecte photos événement, logiciel plan de table, application plan de table, plan de table personnalisé, placement invités mariage, placement invités anniversaire, plan de table gala
```

---

**Open Graph :**
- ✅ `og:title` présent
- ✅ `og:description` présent
- ✅ `og:type` = "website"
- ❌ **PROBLÈME CRITIQUE** : `og:url` = "https://seatly.com" (ancien nom ?)
- ⚠️ `og:image` = "/images/logo_text.svg" (devrait être une image JPG/PNG optimisée)

---

### 1.2 Page Tarifs (`/pricing`)

**Titre actuel :**
```
PLACEMOI - Tarifs et fonctionnalités
```

**Analyse :**
- ⚠️ Trop générique
- ⚠️ Manque de mots-clés ciblés

**Suggestion :**
```
Tarifs plan de table événement | PLACEMOI - À partir de 49,99€ par événement
```

---

**Meta description actuelle :**
```
Découvrez les plans Placemoi : placement des invités, personnalisation de la page, collecte de photos et album collaboratif. Choisissez l'offre adaptée à votre événement.
```

**Analyse :**
- ✅ Bonne longueur (147 caractères)
- ✅ Contient des fonctionnalités
- ⚠️ Manque les prix dans la description

**Suggestion :**
```
Plan Placement 49,99€ | Plan Placement + Photos 99,99€. QR code, page personnalisée, collecte photos. Pour mariages, anniversaires, conférences, séminaires. Paiement unique par événement, sans abonnement.
```

---

**Meta keywords actuels :**
```
placemoi tarifs, plan de table mariage prix, QR code invités, collecte photo mariage
```

**Analyse :**
- ✅ Bon début
- ⚠️ Peut être enrichi

**Suggestion :**
```
tarif plan de table mariage, prix placement invités, coût QR code mariage, tarif collecte photos mariage, prix album photo collaboratif, plan de table pas cher
```

---

**Données structurées :**
- ✅ Schema.org Product présent
- ✅ Schema.org Offer présent
- ✅ Bien implémenté

---

### 1.3 Page À propos (`/about`)

**Titre actuel :**
```
PLACEMOI - À propos
```

**Analyse :**
- ⚠️ Trop générique
- ⚠️ Manque de mots-clés

**Suggestion :**
```
À propos de PLACEMOI - Notre histoire | Plan de table événement en ligne
```

---

**Meta description actuelle :**
```
PlaceMoi est né d'un défi : rendre un plan de table élégant et facile pour tous les invités. Découvrez comment l'idée a grandi pour devenir une solution complète pour vos événements.
```

**Analyse :**
- ✅ Bonne longueur (147 caractères)
- ✅ Raconte une histoire
- ⚠️ Manque de mots-clés SEO

**Suggestion :**
```
Découvrez l'histoire de PLACEMOI : née d'un plan de table ingérable, notre plateforme aide les organisateurs d'événements (mariages, anniversaires, conférences, séminaires) à offrir une expérience fluide et moderne à leurs invités.
```

---

**Données structurées :**
- ✅ Schema.org AboutPage présent
- ✅ Bien implémenté

---

### 1.4 Page FAQ (`/faq`)

**Titre actuel :**
```
PLACEMOI - FAQ
```

**Analyse :**
- ⚠️ Trop court
- ⚠️ Manque de mots-clés

**Suggestion :**
```
FAQ Plan de table événement | Questions fréquentes - PLACEMOI
```

---

**Meta description actuelle :**
```
Toutes les réponses sur Placemoi : fonctionnement, expérience invités, collecte de photos, tarifs et support. Préparez votre événement en toute confiance.
```

**Analyse :**
- ✅ Bonne longueur (142 caractères)
- ✅ Liste les sujets couverts
- ⚠️ Manque "plan de table mariage"

**Suggestion :**
```
FAQ complète sur le plan de table événement : fonctionnement, QR code, collecte photos, tarifs. Pour mariages, anniversaires, conférences, séminaires. Toutes les réponses pour organiser votre événement sereinement.
```

---

**Données structurées :**
- ✅ Schema.org FAQPage présent
- ✅ Toutes les questions/réponses structurées
- ✅ Excellent travail !

---

### 1.5 Page Contact (`/contact`)

**Titre actuel :**
```
PLACEMOI - Contact
```

**Analyse :**
- ⚠️ Trop générique

**Suggestion :**
```
Contact PLACEMOI | Support plan de table événement
```

---

**Meta description actuelle :**
```
Contactez l'équipe PLACEMOI pour toute question sur notre solution de placement d'invités pour vos événements.
```

**Analyse :**
- ✅ Longueur correcte (95 caractères)
- ⚠️ Manque de mots-clés spécifiques

**Suggestion :**
```
Contactez l'équipe PLACEMOI pour toute question sur votre plan de table événement. Mariage, anniversaire, conférence, séminaire. Support réactif sous 24h. Aide à la personnalisation et au QR code.
```

---

**Meta keywords actuels :**
```
contact, support, aide, événements, placement d'invités
```

**Analyse :**
- ⚠️ Trop génériques
- ⚠️ Manque de spécificité

**Suggestion :**
```
contact placemoi, support plan de table, aide organisation événement, assistance QR code, support plan de table mariage, support plan de table conférence
```

---

### 1.6 Pages légales (`/cgu`, `/privacy`)

**Analyse :**
- ✅ Titres présents
- ✅ Meta descriptions présentes
- ⚠️ Pas de meta keywords (normal pour les pages légales)
- ✅ Contenu complet et structuré

---

## 2. STRUCTURE SÉMANTIQUE (H1, H2, H3)

### 2.1 Page d'accueil

**H1 :**
```
Organisez le placement de vos invités en quelques minutes.
```

**Analyse :**
- ✅ Présent
- ✅ Contient un mot-clé principal
- ⚠️ Manque "plan de table" et "mariage"

**Suggestion :**
```
Organisez votre plan de table événement en quelques minutes
```

**Note :** "Événement" couvre tous les types (mariage, anniversaire, baptême, conférence, séminaire, gala)

---

**H2 présents :**
- ✅ "Organiser le placement de vos invités c'est facile maintenant."
- ✅ "Vos invités trouvent leur place en un seul geste"
- ✅ "Vos invités partagent leurs souvenirs depuis le même QR code"
- ✅ "Choisissez l'offre qui correspond à votre événement"
- ✅ "Questions fréquentes"

**Analyse :**
- ✅ Bonne hiérarchie
- ⚠️ Manque de mots-clés dans certains H2

---

### 2.2 Autres pages

**Analyse générale :**
- ✅ Toutes les pages ont un H1
- ✅ Hiérarchie H1 > H2 > H3 respectée
- ⚠️ Certains H2 pourraient être plus optimisés SEO

---

## 3. CONTENU & MOTS-CLÉS

### 3.1 Mots-clés présents dans le contenu

**Page d'accueil :**
- ✅ "placement de vos invités"
- ✅ "QR code"
- ✅ "lien partageable"
- ✅ "plan de table" (dans le CTA)
- ⚠️ "mariage" apparaît peu
- ⚠️ Manque "plan de table mariage" comme phrase complète

---

**Page tarifs :**
- ✅ "plan de table"
- ✅ "QR code"
- ✅ "collecte de photos"
- ✅ "album collaboratif"
- ⚠️ "mariage" manque

---

**Page FAQ :**
- ✅ "plan de table"
- ✅ "invités"
- ✅ "QR code"
- ✅ "mariage" (dans certaines réponses)
- ✅ Bonne variété de mots-clés

---

### 3.2 Mots-clés manquants (à ajouter)

**Priorité haute (mots-clés génériques) :**
- "plan de table événement" (phrase complète - couvre tous les types)
- "plan de table en ligne"
- "placement invités"
- "QR code événement"
- "gestion invités"
- "organisation événement en ligne"

**Priorité haute (mots-clés spécifiques par type d'événement) :**
- "plan de table mariage"
- "plan de table anniversaire"
- "plan de table baptême"
- "plan de table conférence"
- "plan de table séminaire"
- "plan de table gala"
- "placement invités mariage"
- "placement invités anniversaire"
- "QR code mariage"
- "QR code conférence"

**Priorité moyenne :**
- "logiciel plan de table"
- "application plan de table"
- "album photo collaboratif"
- "collecte photos événement"
- "plan de table personnalisé"
- "gestion plan de table"
- "tableau placement invités"

**Priorité basse :**
- "organisation mariage"
- "organisation anniversaire"
- "organisation conférence"
- "organisation séminaire"
- "plan de table entreprise"
- "plan de table réception"

---

## 4. IMAGES & ALT TEXT

### 4.1 Images analysées

**Logo :**
```html
alt="Logo Pattyly"  <!-- ❌ Incohérence : devrait être "Logo PLACEMOI" -->
alt="Logo PLACEMOI" <!-- ✅ Correct -->
```

**Images hero :**
```html
alt="Interface de gestion des événements"  <!-- ⚠️ Peut être plus spécifique -->
```

**Suggestion :**
```html
alt="Interface PLACEMOI - Plan de table événement avec QR code pour mariages, anniversaires, conférences"
```

---

### 4.2 Images sans alt text

**À vérifier :**
- Images dans les sections (pain-points, benefits, photo-sharing)
- Images de fond (si utilisées)
- Icônes (si décoratives, alt="" est correct)

---

## 5. DONNÉES STRUCTURÉES (SCHEMA.ORG)

### 5.1 Présentes ✅

- ✅ **Product** (page pricing)
- ✅ **Offer** (page pricing)
- ✅ **FAQPage** (page FAQ)
- ✅ **AboutPage** (page about)

### 5.2 Manquantes ⚠️

- ⚠️ **Organization** (pour la page d'accueil)
- ⚠️ **WebSite** (pour la page d'accueil)
- ⚠️ **BreadcrumbList** (pour la navigation)

---

## 6. URLS & NAVIGATION

### 6.1 Structure des URLs

**Analyse :**
- ✅ URLs propres et lisibles
- ✅ Pas de paramètres inutiles
- ✅ Structure logique

**URLs actuelles :**
- `/` ✅
- `/pricing` ✅
- `/about` ✅
- `/faq` ✅
- `/contact` ✅
- `/cgu` ✅
- `/privacy` ✅

**Suggestion d'amélioration (optionnel) :**
- `/plan-de-table-mariage` (page dédiée)
- `/qr-code-mariage` (page dédiée)

---

### 6.2 Liens internes

**Analyse :**
- ✅ Bon maillage interne
- ✅ Liens vers FAQ, pricing, contact
- ⚠️ Manque de liens contextuels dans le contenu

**Suggestion :**
- Ajouter des liens vers `/pricing` depuis les mentions de prix
- Ajouter des liens vers `/faq` depuis les questions dans le contenu

---

## 7. ROBOTS.TXT & SITEMAP

### 7.1 Robots.txt

**Contenu actuel :**
```
User-agent: *
Disallow:
```

**Analyse :**
- ✅ Autorise tous les robots
- ⚠️ Manque la référence au sitemap

**Suggestion :**
```
User-agent: *
Allow: /

Sitemap: https://placemoi.com/sitemap.xml
```

---

### 7.2 Sitemap.xml

**Statut :**
- ❌ **ABSENT**

**Action requise :**
- Créer un sitemap.xml avec toutes les pages importantes
- Inclure : /, /pricing, /about, /faq, /contact
- Exclure : /cgu, /privacy (optionnel, selon stratégie)

---

## 8. PROBLÈMES CRITIQUES À CORRIGER

### 🔴 Priorité CRITIQUE

1. **Incohérence de nom de marque**
   - Logo alt text : "Logo Pattyly" au lieu de "Logo PLACEMOI"
   - Fichier : `src/routes/(marketing)/+layout.svelte` ligne 54

2. **URL Open Graph incorrecte**
   - `og:url` = "https://seatly.com" (ancien nom ?)
   - Fichier : `src/routes/(marketing)/+page.svelte` ligne 33

3. **Sitemap.xml manquant**
   - Créer un sitemap.xml pour améliorer l'indexation

---

### 🟡 Priorité HAUTE

4. **Meta keywords limités**
   - Seulement 6 mots-clés sur la page d'accueil
   - Enrichir avec 15-20 mots-clés pertinents

5. **Titres de pages à optimiser**
   - Ajouter "plan de table mariage" dans les titres
   - Raccourcir certains titres

6. **Alt text des images**
   - Remplacer "Logo Pattyly" par "Logo PLACEMOI"
   - Enrichir les alt text avec des mots-clés

---

### 🟢 Priorité MOYENNE

7. **Mots-clés dans le contenu**
   - Ajouter "plan de table mariage" comme phrase complète
   - Varier les expressions ("placement invités", "gestion invités", etc.)

8. **Données structurées supplémentaires**
   - Ajouter Schema.org Organization
   - Ajouter Schema.org WebSite

9. **Liens internes contextuels**
   - Ajouter des liens vers /pricing depuis les mentions de prix
   - Ajouter des liens vers /faq depuis les questions

---

## 9. RECOMMANDATIONS PAR PAGE

### Page d'accueil (`/`)

**Actions immédiates :**
1. Corriger `og:url` : "https://seatly.com" → "https://placemoi.com"
2. Enrichir meta keywords (6 → 15-20) incluant tous les types d'événements
3. Optimiser le H1 : utiliser "plan de table événement" (générique)
4. Corriger alt text logo : "Logo Pattyly" → "Logo PLACEMOI"

**Actions à moyen terme :**
5. Ajouter Schema.org Organization
6. Ajouter Schema.org WebSite
7. Enrichir le contenu avec "plan de table événement" + mentionner explicitement les types supportés (mariage, anniversaire, baptême, conférence, séminaire, gala)

---

### Page Tarifs (`/pricing`)

**Actions immédiates :**
1. Optimiser le titre : utiliser "plan de table événement" + mentionner les types
2. Enrichir meta keywords (inclure tous les types d'événements)
3. Ajouter les prix dans la meta description + mentionner les types d'événements

**Actions à moyen terme :**
4. Ajouter des liens internes vers /faq depuis les questions de prix
5. Varier les expressions ("placement invités", "gestion invités")
6. Mentionner explicitement : "Pour mariages, anniversaires, conférences, séminaires, galas"

---

### Page FAQ (`/faq`)

**Actions immédiates :**
1. Optimiser le titre : utiliser "plan de table événement" + mentionner les types
2. Enrichir meta keywords (inclure tous les types d'événements)

**Actions à moyen terme :**
3. Ajouter des liens internes vers /pricing depuis les mentions de prix
4. Ajouter des liens vers /contact depuis les questions de support
5. Ajouter des sections FAQ spécifiques par type d'événement (optionnel)

---

### Page Contact (`/contact`)

**Actions immédiates :**
1. Optimiser le titre : utiliser "plan de table événement" + mentionner les types
2. Enrichir meta keywords (inclure tous les types d'événements)
3. Optimiser la meta description avec des mots-clés + mentionner les types d'événements

---

### Page À propos (`/about`)

**Actions immédiates :**
1. Optimiser le titre : utiliser "plan de table événement" + mentionner les types
2. Enrichir la meta description avec des mots-clés + mentionner les types d'événements supportés

---

## 10. CHECKLIST D'AMÉLIORATION

### Phase 1 : Corrections critiques (1-2 jours)
- [ ] Corriger "Logo Pattyly" → "Logo PLACEMOI"
- [ ] Corriger `og:url` : "seatly.com" → "placemoi.com"
- [ ] Créer sitemap.xml
- [ ] Mettre à jour robots.txt avec référence au sitemap

### Phase 2 : Optimisations on-page (3-5 jours)
- [ ] Optimiser tous les titres de pages (utiliser "événement" + variantes par type)
- [ ] Enrichir toutes les meta descriptions (mentionner les différents types d'événements)
- [ ] Enrichir toutes les meta keywords (15-20 par page, inclure tous les types d'événements)
- [ ] Optimiser tous les H1 avec "plan de table événement" (générique) + variantes spécifiques
- [ ] Enrichir les alt text des images (mentionner les différents types d'événements)

### Phase 3 : Contenu & structure (1 semaine)
- [ ] Ajouter "plan de table événement" (générique) dans le contenu
- [ ] Ajouter des variantes par type : "plan de table mariage", "plan de table anniversaire", "plan de table conférence", etc.
- [ ] Mentionner explicitement les types d'événements supportés (mariage, anniversaire, baptême, conférence, séminaire, gala)
- [ ] Varier les expressions de mots-clés
- [ ] Ajouter Schema.org Organization
- [ ] Ajouter Schema.org WebSite
- [ ] Ajouter des liens internes contextuels

### Phase 4 : Monitoring (continu)
- [ ] Suivre les positions dans Google Search Console
- [ ] Analyser les mots-clés qui amènent du trafic
- [ ] Ajuster la stratégie selon les résultats

---

## 11. MÉTRIQUES À SUIVRE

### KPIs SEO recommandés

1. **Visibilité**
   - Position moyenne dans Google
   - Nombre de mots-clés positionnés
   - Impressions dans Google Search Console

2. **Trafic**
   - Visiteurs organiques
   - Taux de clic (CTR)
   - Pages vues par session

3. **Conversions**
   - Taux de conversion depuis le SEO
   - Coût par acquisition (CPA) organique
   - Revenus générés par le SEO

---

## 12. STRATÉGIE MOTS-CLÉS PAR TYPE D'ÉVÉNEMENT

### 12.1 Mots-clés génériques (priorité haute)
Ces mots-clés couvrent tous les types d'événements :
- "plan de table événement"
- "plan de table en ligne"
- "placement invités"
- "QR code événement"
- "gestion invités"
- "organisation événement en ligne"
- "logiciel plan de table"
- "application plan de table"

### 12.2 Mots-clés spécifiques par type

**Mariage :**
- "plan de table mariage"
- "placement invités mariage"
- "QR code mariage"
- "organisation mariage"
- "plan de table mariage en ligne"

**Anniversaire :**
- "plan de table anniversaire"
- "placement invités anniversaire"
- "organisation anniversaire"
- "plan de table anniversaire en ligne"

**Baptême :**
- "plan de table baptême"
- "placement invités baptême"
- "organisation baptême"

**Conférence / Séminaire :**
- "plan de table conférence"
- "plan de table séminaire"
- "placement invités conférence"
- "QR code conférence"
- "organisation conférence"
- "plan de table entreprise"

**Gala / Réception :**
- "plan de table gala"
- "plan de table réception"
- "placement invités gala"

### 12.3 Recommandation de contenu

**Page d'accueil :**
- Utiliser "plan de table événement" comme terme principal
- Mentionner explicitement : "Pour mariages, anniversaires, baptêmes, conférences, séminaires, galas"
- Varier avec des exemples concrets dans le contenu

**Pages spécifiques (optionnel - à créer) :**
- `/plan-de-table-mariage` (page dédiée)
- `/plan-de-table-conference` (page dédiée)
- `/plan-de-table-anniversaire` (page dédiée)

---

## 13. OUTILS RECOMMANDÉS

### Outils gratuits
- Google Search Console
- Google Analytics
- Google Keyword Planner
- PageSpeed Insights

### Outils payants (optionnel)
- Ahrefs / SEMrush (analyse de mots-clés)
- Screaming Frog (audit technique)
- Hotjar (analyse comportementale)

---

## 📝 NOTES FINALES

Cet audit identifie **3 problèmes critiques**, **6 optimisations prioritaires** et **plusieurs améliorations à moyen terme**.

**Impact estimé :**
- Corrections critiques : +10-15% de visibilité
- Optimisations on-page : +20-30% de trafic organique
- Améliorations contenu : +15-25% de conversions

**Temps estimé pour implémentation complète :** 2-3 semaines

---

**Prochaines étapes recommandées :**
1. Corriger les 3 problèmes critiques (1-2 jours)
2. Implémenter les optimisations on-page (3-5 jours)
3. Enrichir le contenu progressivement (1-2 semaines)
4. Monitorer les résultats et ajuster

---

*Audit réalisé le : Janvier 2025*  
*Prochaine révision recommandée : Dans 3 mois*

