<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Scroll vers l'ancre si présente dans l'URL
		const hash = window.location.hash;
		if (hash) {
			setTimeout(() => {
				const element = document.querySelector(hash);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		}
	});
</script>

<svelte:head>
	<title>Conditions Générales d'Utilisation - PLACEMOI</title>
	<meta
		name="description"
		content="Conditions générales d'utilisation de la plateforme PLACEMOI pour la gestion de plans de table et placements d'invités pour vos événements."
	/>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto max-w-4xl px-4 pb-12 pt-24">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">
				Conditions Générales d'Utilisation
			</h1>
			<p class="text-lg text-gray-600">
				Plateforme PLACEMOI - Dernière mise à jour : {new Date().toLocaleDateString(
					'fr-FR',
				)}
			</p>
		</div>

		<!-- Table des matières -->
		<div class="mb-8 border-b border-gray-200 pb-8">
			<h2 class="mb-4 text-2xl font-semibold text-gray-900">
				Table des matières
			</h2>
			<nav class="space-y-2">
				<a
					href="#1"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>1. Objet et champ d'application</a
				>
				<a
					href="#2"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>2. Définitions</a
				>
				<a
					href="#3"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>3. Acceptation des conditions</a
				>
				<a
					href="#4"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>4. Description du service</a
				>
				<a
					href="#5"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>5. Inscription et compte utilisateur</a
				>
				<a
					href="#6"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>6. Tarification et facturation</a
				>
				<a
					href="#7"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>7. Commandes et paiements</a
				>
				<a
					href="#8"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>8. Responsabilités</a
				>
				<a
					href="#9"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>9. Propriété intellectuelle</a
				>
				<a
					href="#10"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>10. Protection des données personnelles</a
				>
				<a
					href="#11"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>11. Suspension et résiliation</a
				>
				<a
					href="#12"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>12. Support et assistance</a
				>
				<a
					href="#13"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>13. Disponibilité du service</a
				>
				<a
					href="#14"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>14. Modification des CGU</a
				>
				<a
					href="#15"
					class="block text-blue-600 transition-colors hover:text-blue-800"
					>15. Droit applicable et juridiction</a
				>
			</nav>
		</div>

		<!-- Contenu des CGU -->
		<div class="space-y-8">
			<!-- Article 1 -->
			<section id="1">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					1. Objet et champ d'application
				</h2>
				<div class="prose prose-gray max-w-none">
					<p>
						Les présentes Conditions Générales d'Utilisation (ci-après "CGU")
						régissent l'utilisation de la plateforme PLACEMOI (ci-après "la
						Plateforme"), accessible à l'adresse <strong>placemoi.com</strong>.
					</p>

					<p>
						PLACEMOI est une plateforme SaaS destinée à la gestion de plans de
						table et de placement d'invités pour des événements (mariages,
						réceptions, cérémonies, etc.).
					</p>

					<p>
						La Plateforme permet aux organisateurs d'événements (ci-après
						"Organisateurs") de créer des plans de table numériques, d'assigner
						des places aux invités et de partager un QR code ainsi qu'un lien
						partageable permettant aux invités de trouver leur place facilement.
					</p>
				</div>
			</section>

			<!-- Article 2 -->
			<section id="2">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					2. Définitions
				</h2>
				<div class="prose prose-gray max-w-none">
					<dl class="space-y-3">
						<dt class="font-semibold text-gray-900">Plateforme :</dt>
						<dd class="ml-4">
							Le service en ligne PLACEMOI accessible via le site web
							placemoi.com
						</dd>

						<dt class="font-semibold text-gray-900">Organisateur :</dt>
						<dd class="ml-4">
							Utilisateur de la Plateforme créant et gérant un ou plusieurs
							événements
						</dd>

						<dt class="font-semibold text-gray-900">Invité :</dt>
						<dd class="ml-4">
							Personne participant à un événement et ayant une place assignée
							sur le plan de table
						</dd>

						<dt class="font-semibold text-gray-900">Événement :</dt>
						<dd class="ml-4">
							Un mariage, une réception, une cérémonie ou tout autre
							rassemblement pour lequel un plan de table est créé sur la
							Plateforme
						</dd>

						<dt class="font-semibold text-gray-900">Plan de table :</dt>
						<dd class="ml-4">
							Configuration numérique des tables et des places assignées aux
							invités pour un événement
						</dd>

						<dt class="font-semibold text-gray-900">Compte :</dt>
						<dd class="ml-4">
							Espace personnel de l'organisateur sur la Plateforme
						</dd>
					</dl>
				</div>
			</section>

			<!-- Article 3 -->
			<section id="3">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					3. Acceptation des conditions
				</h2>
				<div class="prose prose-gray max-w-none">
					<p>
						L'utilisation de la Plateforme implique l'acceptation pleine et
						entière des présentes CGU.
					</p>

					<p>
						Ces conditions s'appliquent à tous les utilisateurs de la
						Plateforme, notamment les Organisateurs d'événements.
					</p>

					<p>
						En cas de non-respect de ces conditions, l'accès à la Plateforme
						peut être suspendu ou résilié sans préavis.
					</p>
				</div>
			</section>

			<!-- Article 4 -->
			<section id="4">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					4. Description du service
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						4.1 Services proposés
					</h3>
					<ul class="list-inside list-disc space-y-2">
						<li>Création et gestion de plans de table numériques</li>
						<li>Import de listes d'invités</li>
						<li>Assignment de places aux invités</li>
						<li>Génération de QR codes pour chaque événement</li>
						<li>Lien partageable pour l'accès au plan de table</li>
						<li>Interface de consultation pour les invités</li>
						<li>Interface d'administration pour les organisateurs</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						4.2 Fonctionnalités
					</h3>
					<ul class="list-inside list-disc space-y-2">
						<li>
							<strong>Pour les Organisateurs :</strong> Création d'événements, configuration
							des tables et places, import de listes d'invités, assignment de places,
							génération de QR codes et liens partageables
						</li>
						<li>
							<strong>Pour les Invités :</strong> Consultation du plan de table via
							QR code ou lien, recherche de leur place par nom
						</li>
					</ul>
				</div>
			</section>

			<!-- Article 5 -->
			<section id="5">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					5. Inscription et compte utilisateur
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						5.1 Création de compte
					</h3>
					<p>L'inscription sur la Plateforme est gratuite et nécessite :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Une adresse email valide</li>
						<li>Un mot de passe sécurisé</li>
						<li>L'acceptation des présentes CGU</li>
						<li>La confirmation de l'adresse email</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						5.2 Accès au service
					</h3>
					<p>
						L'utilisation de la Plateforme nécessite la création d'un compte
						gratuit. Pour créer un événement avec un plan de table,
						l'organisateur doit effectuer un paiement unique par événement.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						5.3 Sécurité du compte
					</h3>
					<p>
						L'utilisateur est responsable de la sécurité de son compte et
						s'engage à :
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Maintenir la confidentialité de ses identifiants</li>
						<li>Signaler toute utilisation non autorisée</li>
						<li>Utiliser des mots de passe sécurisés</li>
					</ul>
				</div>
			</section>

			<!-- Article 6 -->
			<section id="6">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					6. Tarification et facturation
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						6.1 Tarification
					</h3>
					<p>
						La création d'un événement avec plan de table sur la Plateforme est
						facturée au prix unique de <strong>24,99€ TTC par événement</strong
						>.
					</p>
					<p>
						Le compte sur la Plateforme est gratuit et permet de gérer plusieurs
						événements, chaque événement nécessitant un paiement unique de
						24,99€.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						6.2 Facturation
					</h3>
					<p>La facturation s'effectue :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Une fois par événement créé</li>
						<li>Via Stripe (carte bancaire)</li>
						<li>Prix TTC, toutes taxes comprises</li>
						<li>Facture disponible dans l'espace organisateur</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						6.3 Utilisateurs exemptés
					</h3>
					<p>
						Certains utilisateurs peuvent bénéficier d'un accès gratuit
						(administrateurs, partenaires) sur décision de PLACEMOI.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						6.4 Remboursements
					</h3>
					<p>
						Les remboursements ne sont pas autorisés sauf en cas d'erreur
						technique imputable à PLACEMOI ou d'obligation légale contraire.
					</p>
				</div>
			</section>

			<!-- Article 7 -->
			<section id="7">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					7. Commandes et paiements
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						7.1 Processus de paiement
					</h3>
					<p>Le paiement s'effectue lors de la création d'un événement :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>L'organisateur crée son compte (gratuit)</li>
						<li>
							L'organisateur crée un nouvel événement et configure son plan de
							table
						</li>
						<li>Paiement unique de 24,99€ via Stripe (3D Secure)</li>
						<li>Confirmation par email et accès à l'événement créé</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						7.2 Paiements
					</h3>
					<p>
						Les paiements sont traités par Stripe. Le paiement est effectué une
						fois par événement créé.
					</p>
					<p>
						<strong
							>PLACEMOI décline toute responsabilité concernant les transactions
							Stripe,</strong
						>
						y compris les échecs de paiement, les remboursements, les litiges de
						facturation ou tout problème lié aux services de paiement tiers.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						7.3 Sécurité des paiements
					</h3>
					<p>
						PLACEMOI utilise Stripe pour assurer la sécurité des transactions
						financières avec chiffrement SSL et conformité PCI DSS. Cependant,
						PLACEMOI ne peut garantir une sécurité absolue et décline toute
						responsabilité en cas de compromission des données financières.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						7.4 Annulations et remboursements
					</h3>
					<p>
						Les remboursements ne sont pas autorisés sauf en cas d'erreur
						technique imputable à PLACEMOI ou d'obligation légale contraire
						(voir article 6.4).
					</p>
				</div>
			</section>

			<!-- Article 8 -->
			<section id="8">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					8. Responsabilités
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						8.1 Responsabilité de PLACEMOI
					</h3>
					<p>PLACEMOI s'engage à :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Fournir un service technique fonctionnel</li>
						<li>Assurer la sécurité des données</li>
						<li>Maintenir la disponibilité de la Plateforme</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						8.2 Limitation de responsabilité
					</h3>
					<p>PLACEMOI décline toute responsabilité concernant :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>L'organisation et le bon déroulement des événements</li>
						<li>Les litiges entre organisateurs et invités</li>
						<li>
							Les erreurs ou omissions dans les informations fournies par les
							organisateurs
						</li>
						<li>Les dommages indirects ou perte de profits</li>
						<li>
							La disponibilité continue et l'exactitude des informations
							fournies par les organisateurs
						</li>
						<li>Les transactions financières et problèmes de paiement</li>
						<li>
							Les interruptions de service dues à des tiers (Stripe, Supabase,
							etc.)
						</li>
					</ul>

					<p class="mt-4 font-semibold text-gray-900">
						PLACEMOI ne garantit pas la disponibilité continue de la Plateforme
						(à l'exception des maintenances planifiées) et l'exactitude des
						informations fournies par les organisateurs.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						8.3 Force majeure
					</h3>
					<p>
						PLACEMOI ne peut être tenu responsable en cas de force majeure,
						notamment :
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Grèves, conflits sociaux, mouvements sociaux</li>
						<li>Catastrophes naturelles, intempéries exceptionnelles</li>
						<li>Cyberattaques, pannes informatiques majeures</li>
						<li>Décisions gouvernementales, restrictions administratives</li>
						<li>
							Pannes des fournisseurs tiers (Stripe, Supabase, hébergeurs)
						</li>
						<li>Tout événement imprévisible et insurmontable</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						8.4 Responsabilité des Organisateurs
					</h3>
					<p>Les organisateurs sont responsables de :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>L'exactitude des informations fournies sur leur événement</li>
						<li>L'exactitude des noms des invités et de leur placement</li>
						<li>La mise à jour du plan de table en cas de modifications</li>
						<li>La diffusion du QR code et du lien aux invités</li>
					</ul>
				</div>
			</section>

			<!-- Article 9 -->
			<section id="9">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					9. Propriété intellectuelle
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						9.1 Propriété de la Plateforme
					</h3>
					<p>
						PLACEMOI conserve tous les droits de propriété intellectuelle sur :
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Le code source et l'architecture technique</li>
						<li>L'interface utilisateur et le design</li>
						<li>Les marques et logos PLACEMOI</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						9.2 Contenu des Organisateurs
					</h3>
					<p>Les organisateurs conservent tous les droits sur :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Leurs données d'événements et plans de table</li>
						<li>Les noms des invités fournis</li>
						<li>Les informations relatives à leurs événements</li>
					</ul>
				</div>
			</section>

			<!-- Article 10 -->
			<section id="10">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					10. Protection des données personnelles
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						10.1 Données collectées
					</h3>
					<p>
						PLACEMOI collecte un minimum de données personnelles, conformément
						au principe de minimisation des données :
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>
							<strong>Pour les Organisateurs :</strong> Email, nom (pour la facturation)
						</li>
						<li>
							<strong>Pour les Invités :</strong> Uniquement le nom (fourni par l'organisateur
							pour l'assignation des places)
						</li>
						<li>
							<strong>Techniques :</strong> Données de session et cookies nécessaires
							au fonctionnement de la Plateforme
						</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						10.2 Finalités du traitement
					</h3>
					<p>Les données sont utilisées uniquement pour :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>
							Fournir les services de la Plateforme (gestion des plans de table)
						</li>
						<li>Traiter les paiements via Stripe</li>
						<li>
							Assurer la sécurité et le bon fonctionnement de la Plateforme
						</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						10.3 Durée de conservation
					</h3>
					<p>
						Les données personnelles sont conservées pendant 3 ans après la
						dernière activité de l'utilisateur, conformément aux obligations
						légales.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						10.4 Droits des utilisateurs
					</h3>
					<p>
						Conformément au RGPD, les utilisateurs disposent des droits suivants
						:
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Droit d'accès et de rectification</li>
						<li>Droit à l'effacement (sous réserve des obligations légales)</li>
						<li>Droit à la portabilité</li>
						<li>Droit d'opposition</li>
					</ul>
					<p>
						Pour exercer ces droits, contactez : <a
							href="mailto:contact@placemoi.com"
							class="text-blue-600 hover:text-blue-800">contact@placemoi.com</a
						>
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						10.5 Cookies et tracking
					</h3>
					<p>La Plateforme utilise :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Cookies de session pour l'authentification</li>
						<li>Aucun cookie publicitaire ou de tracking tiers</li>
					</ul>
				</div>
			</section>

			<!-- Article 11 -->
			<section id="11">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					11. Suspension et résiliation
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						11.1 Suspension de compte
					</h3>
					<p>Un compte peut être suspendu en cas de :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Violation des présentes CGU</li>
						<li>Tentative de fraude (paiements)</li>
						<li>Comportement inapproprié ou abusif</li>
					</ul>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						11.2 Résiliation
					</h3>
					<p>
						L'utilisateur peut résilier son compte à tout moment depuis son
						espace personnel.
					</p>
					<p>
						PLACEMOI peut résilier un compte avec un préavis de 30 jours, sauf
						en cas de violation grave des CGU.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						11.3 Conséquences de la résiliation
					</h3>
					<p>En cas de résiliation :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>L'accès à la Plateforme est immédiatement suspendu</li>
						<li>Les données sont conservées selon la durée légale</li>
						<li>Aucun remboursement n'est effectué</li>
					</ul>
				</div>
			</section>

			<!-- Article 12 -->
			<section id="12">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					12. Support et assistance
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						12.1 Support technique
					</h3>
					<p>PLACEMOI fournit un support technique aux organisateurs via :</p>
					<ul class="list-inside list-disc space-y-2">
						<li>
							Email : <a
								href="mailto:contact@placemoi.com"
								class="text-blue-600 hover:text-blue-800"
								>contact@placemoi.com</a
							>
						</li>
						<li>Délai de réponse maximum : 72 heures</li>
						<li>Support en français uniquement</li>
					</ul>
				</div>
			</section>

			<!-- Article 13 -->
			<section id="13">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					13. Disponibilité du service
				</h2>
				<div class="prose prose-gray max-w-none">
					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						13.1 Disponibilité
					</h3>
					<p>
						PLACEMOI s'efforce de maintenir la Plateforme disponible 24h/24,
						7j/7.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						13.2 Maintenance
					</h3>
					<p>
						Les maintenances programmées sont annoncées avec un préavis de 24
						heures minimum.
					</p>
					<p>
						Les maintenances d'urgence peuvent être effectuées sans préavis.
					</p>

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-900">
						13.3 Interruptions
					</h3>
					<p>
						PLACEMOI ne peut être tenu responsable des interruptions de service
						dues à :
					</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Maintenances nécessaires</li>
						<li>Pannes des fournisseurs tiers (Stripe, Supabase)</li>
						<li>Cas de force majeure (voir article 8.3)</li>
						<li>Cyberattaques ou problèmes de sécurité</li>
						<li>Décisions gouvernementales ou restrictions</li>
					</ul>
				</div>
			</section>

			<!-- Article 14 -->
			<section id="14">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					14. Modification des CGU
				</h2>
				<div class="prose prose-gray max-w-none">
					<p>
						PLACEMOI se réserve le droit de modifier les présentes CGU à tout
						moment.
					</p>

					<p>
						Les modifications importantes sont notifiées aux utilisateurs avec
						un préavis d'un mois minimum par email à l'adresse enregistrée.
					</p>

					<p class="font-semibold text-gray-900">
						L'utilisation continue de la Plateforme après notification vaut
						acceptation pleine et entière des nouvelles conditions.
					</p>

					<p>
						En cas de désaccord avec les modifications, l'utilisateur peut
						résilier son compte dans le délai de préavis. Aucun remboursement ne
						sera effectué pour les événements déjà payés, sauf en cas d'erreur
						technique imputable à PLACEMOI ou d'obligation légale contraire.
					</p>

					<p>
						Les modifications mineures (corrections typographiques,
						clarifications) peuvent être effectuées sans préavis et sont
						immédiatement applicables.
					</p>
				</div>
			</section>

			<!-- Article 15 -->
			<section id="15">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">
					15. Droit applicable et juridiction
				</h2>
				<div class="prose prose-gray max-w-none">
					<p>Les présentes CGU sont régies par le droit français.</p>

					<p>
						En cas de litige, les parties s'efforceront de trouver une solution
						amiable.
					</p>

					<p>
						À défaut d'accord amiable, les tribunaux français seront seuls
						compétents.
					</p>
				</div>
			</section>
		</div>
	</div>
</div>
