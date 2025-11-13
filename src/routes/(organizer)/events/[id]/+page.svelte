<script lang="ts">
	import { browser } from '$app/environment';
	import type { Database } from '$lib/database/database.types';
	import { goto } from '$app/navigation';
	import LoaderCircle from '~icons/lucide/loader-circle';
	import QRCode from 'qrcode';
	import { formatEventTypeFr } from '$lib/i18n/event-type';
	import { QR_CODE_DEFAULTS } from '$lib/utils/qr-code-config';

	type Event = Database['public']['Tables']['events']['Row'];

	export let data: {
		event: Event;
		guestsCount: number;
		hasPayment: boolean;
		stripePrices: {
			placement: string;
			placementPhotos: string | null;
		};
		activePlan: 'placement' | 'placement_photos' | null;
	};

	let qrCodeDataUrl: string | null = null;
	let qrCodeColor = QR_CODE_DEFAULTS.color.dark; // Default color
	let qrCodeBackgroundColor = QR_CODE_DEFAULTS.color.light; // Default background color
	let qrCodeErrorLevel = QR_CODE_DEFAULTS.errorCorrectionLevel; // Error correction level (L, M, Q, H)
	let qrCodeMargin = QR_CODE_DEFAULTS.margin; // Margin around QR code
	let qrCodeSize = QR_CODE_DEFAULTS.width; // QR code size
	let copied = false; // Copy feedback state

	// Generate the public search URL
	$: publicUrl = browser
		? data.event.slug
			? `${window.location.origin}/${data.event.slug}`
			: `${window.location.origin}/${data.event.id}`
		: '';

	// Generate QR code when slug is available
	$: if (browser && data.event.slug && data.hasPayment) {
		generateQRCode();
	}

	async function generateQRCode() {
		if (!publicUrl) return;

		try {
			// Generate as SVG (vector format - no pixelation at any size)
			const svgString = await QRCode.toString(publicUrl, {
				type: 'svg',
				width: qrCodeSize,
				margin: qrCodeMargin,
				errorCorrectionLevel: qrCodeErrorLevel as 'L' | 'M' | 'Q' | 'H',
				color: {
					dark: qrCodeColor,
					light: qrCodeBackgroundColor,
				},
			});
			// Convert SVG to data URL for display
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(svgBlob);
			qrCodeDataUrl = url;
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	function changeQrColor(color: string) {
		qrCodeColor = color;
		if (browser && publicUrl) {
			generateQRCode();
		}
	}

	async function downloadQrCodeSvg() {
		if (!publicUrl) return;

		try {
			// Generate SVG string for download (vector format - no pixelation)
			const svgString = await QRCode.toString(publicUrl, {
				type: 'svg',
				width: qrCodeSize,
				margin: qrCodeMargin,
				errorCorrectionLevel: qrCodeErrorLevel as 'L' | 'M' | 'Q' | 'H',
				color: {
					dark: qrCodeColor,
					light: qrCodeBackgroundColor,
				},
			});
			// Create and download SVG file
			const blob = new Blob([svgString], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.download = `qr-code-${data.event.slug}.svg`;
			link.href = url;
			link.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading QR code SVG:', error);
		}
	}

	async function downloadQrCodePng() {
		if (!publicUrl) return;

		try {
			// Generate PNG for download (raster format - high resolution)
			const pngDataUrl = await QRCode.toDataURL(publicUrl, {
				width: qrCodeSize * 4, // High resolution (2048px) for better quality
				margin: qrCodeMargin,
				errorCorrectionLevel: qrCodeErrorLevel as 'L' | 'M' | 'Q' | 'H',
				color: {
					dark: qrCodeColor,
					light: qrCodeBackgroundColor,
				},
			});
			// Create and download PNG file
			const link = document.createElement('a');
			link.download = `qr-code-${data.event.slug}.png`;
			link.href = pngDataUrl;
			link.click();
		} catch (error) {
			console.error('Error downloading QR code PNG:', error);
		}
	}

	async function copyPublicUrl() {
		if (!publicUrl) return;

		try {
			await navigator.clipboard.writeText(publicUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Generate checkout URLs (only before any plan is activated)
	$: canStartPlan = !data.hasPayment;
	$: placementCheckoutUrl =
		canStartPlan && data.stripePrices.placement
			? `/checkout/${data.stripePrices.placement}?eventId=${data.event.id}`
			: null;
	$: placementPhotosCheckoutUrl =
		canStartPlan && data.stripePrices.placementPhotos
			? `/checkout/${data.stripePrices.placementPhotos}?eventId=${data.event.id}`
			: null;

	$: isPlacementActive = data.activePlan === 'placement';
	$: isPlacementPhotosActive = data.activePlan === 'placement_photos';
	$: placementCardStyle = `border-color: #D4A57433;${
		isPlacementActive || isPlacementPhotosActive
			? ' background-color: #FFF9F4;'
			: ''
	}`;
	$: placementPhotosCardStyle = `border-color: #D4A574;${
		isPlacementPhotosActive ? ' background-color: #FFF9F4;' : ''
	}`;
</script>

<svelte:head>
	<title>{data.event.event_name} - PLACEMOI</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
	<!-- Back button -->
	<div class="mb-6">
		<button
			class="text-base font-medium transition-colors"
			style="color: #D4A574;"
			on:click={() => goto('/events')}
			on:mouseover={(e) => (e.currentTarget.style.color = '#C49863')}
			on:mouseout={(e) => (e.currentTarget.style.color = '#D4A574')}
			on:focus={(e) => (e.currentTarget.style.color = '#C49863')}
			on:blur={(e) => (e.currentTarget.style.color = '#D4A574')}
		>
			← Retour à mes événements
		</button>
	</div>

	<!-- Header -->
	<div class="mb-8">
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<h1
				class="text-3xl font-normal leading-[120%] tracking-tight lg:text-4xl"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				{data.event.event_name}
			</h1>
			<span
				class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize"
				style="background-color: #F5E6D3; color: #2C3E50;"
			>
				{formatEventTypeFr(data.event.event_type)}
			</span>
		</div>
		{#if data.event.event_date}
			<p class="text-base" style="color: #2C3E50; opacity: 0.8;">
				{new Date(data.event.event_date).toLocaleDateString('fr-FR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			</p>
		{/if}
	</div>

	<!-- Configurations section -->
	<div class="mb-12">
		<h2
			class="mb-6 text-2xl font-medium"
			style="color: #2C3E50; font-family: 'Playfair Display', serif;"
		>
			Configurations
		</h2>

		<!-- Guests section -->
		<div
			class="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
		>
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full"
						style="background-color: #F5E6D3;"
					>
						<svg
							class="h-6 w-6"
							style="color: #D4A574;"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-medium" style="color: #2C3E50;">
							Liste d'invités
						</h3>
						<p class="text-sm" style="color: #2C3E50; opacity: 0.7;">
							{data.guestsCount}
							{data.guestsCount === 1 ? 'invité' : 'invités'}
						</p>
					</div>
				</div>
				<button
					class="w-full rounded-xl px-6 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md sm:w-auto"
					style="background-color: #D4A574; border: none;"
					on:click={() => goto(`/events/${data.event.id}/list`)}
				>
					Voir la liste
				</button>
			</div>
		</div>

		<!-- Customization section -->
		<div
			class="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
		>
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full"
						style="background-color: #F5E6D3;"
					>
						<svg
							class="h-6 w-6"
							style="color: #D4A574;"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-medium" style="color: #2C3E50;">
							Personnalisation
						</h3>
						<p class="text-sm" style="color: #2C3E50; opacity: 0.7;">
							Couleurs et apparence
						</p>
					</div>
				</div>
				<button
					class="w-full rounded-xl px-6 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md sm:w-auto"
					style="background-color: #D4A574; border: none;"
					on:click={() => goto(`/events/${data.event.id}/customize`)}
				>
					Personnaliser
				</button>
			</div>
		</div>

		<!-- Preview section -->
		<div
			class="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
		>
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full"
						style="background-color: #F5E6D3;"
					>
						<svg
							class="h-6 w-6"
							style="color: #D4A574;"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-medium" style="color: #2C3E50;">Aperçu</h3>
						<p class="text-sm" style="color: #2C3E50; opacity: 0.7;">
							Voir la page de recherche
						</p>
					</div>
				</div>
				<button
					class="w-full rounded-xl px-6 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md sm:w-auto"
					style="background-color: #D4A574; border: none;"
					on:click={() => goto(`/events/${data.event.id}/preview`)}
				>
					Voir l'aperçu
				</button>
			</div>
		</div>

		<div id="plans" class="mb-12 scroll-mt-24 space-y-6">
			<p class="text-center text-base" style="color: #2C3E50; opacity: 0.8;">
				Choisissez votre formule ou passez au plan supérieur pour débloquer la
				collecte de photos.
			</p>
			<div class="grid gap-6 md:grid-cols-2">
				<div
					class="rounded-2xl border p-6 text-center shadow-sm"
					style={placementCardStyle}
				>
					<h3 class="text-lg font-semibold" style="color: #2C3E50;">
						Placement
					</h3>
					<p class="mt-2 text-sm" style="color: #2C3E50; opacity: 0.7;">
						Page invitée personnalisée, QR code et lien partageable.
					</p>
					<p class="mt-4 text-2xl font-bold" style="color: #2C3E50;">49,99€</p>
					{#if data.hasPayment}
						{#if isPlacementPhotosActive}
							<p
								class="mt-4 text-sm font-semibold"
								style="color: #2C3E50; opacity: 0.85;"
							>
								Inclus dans votre plan actuel.
							</p>
						{:else if isPlacementActive}
							<p
								class="mt-4 inline-flex w-full justify-center rounded-xl border border-[#2C3E50] px-6 py-3 text-sm font-semibold"
								style="color: #2C3E50; background-color: white;"
							>
								Plan activé
							</p>
						{:else}
							<p
								class="mt-4 text-sm font-medium"
								style="color: #2C3E50; opacity: 0.75;"
							>
								Un plan a déjà été réglé pour cet événement. Contactez-nous si
								vous avez besoin d'aide.
							</p>
						{/if}
					{:else if placementCheckoutUrl}
						<a
							href={placementCheckoutUrl}
							class="mt-4 inline-flex w-full justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03]"
							style="background-color: #2C3E50; border: none;"
						>
							Activer le QR code
						</a>
					{:else}
						<p
							class="mt-4 text-sm font-medium"
							style="color: #2C3E50; opacity: 0.7;"
						>
							Configuration Stripe manquante.
						</p>
					{/if}
				</div>

				<div
					class="rounded-2xl border-2 p-6 text-center shadow-lg"
					style={placementPhotosCardStyle}
				>
					<h3 class="text-lg font-semibold" style="color: #2C3E50;">
						Placement + Photos
					</h3>
					<p class="mt-2 text-sm" style="color: #2C3E50; opacity: 0.7;">
						Ajoutez la collecte de photos invités (QR code + album).
					</p>
					<p class="mt-4 text-2xl font-bold" style="color: #2C3E50;">99,99€</p>
					{#if data.hasPayment}
						{#if isPlacementPhotosActive}
							<p
								class="mt-4 inline-flex w-full justify-center rounded-xl border border-[#D4A574] px-6 py-3 text-sm font-semibold"
								style="color: #D4A574; background-color: white;"
							>
								Plan activé
							</p>
						{:else}
							<p
								class="mt-4 text-sm font-medium"
								style="color: #2C3E50; opacity: 0.75;"
							>
								Un plan a déjà été réglé (mise à niveau impossible après
								paiement).
							</p>
						{/if}
					{:else if placementPhotosCheckoutUrl}
						<a
							href={placementPhotosCheckoutUrl}
							class="mt-4 inline-flex w-full justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03]"
							style="background-color: #D4A574; border: none;"
						>
							Activer le QR + photos
						</a>
					{:else}
						<p
							class="mt-4 text-sm font-medium"
							style="color: #2C3E50; opacity: 0.7;"
						>
							Configurez l'ID Stripe du plan photos pour proposer cette offre.
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- QR Code section -->
	{#if data.hasPayment}
		<div class="mb-12">
			<h2
				class="mb-6 text-2xl font-medium"
				style="color: #2C3E50; font-family: 'Playfair Display', serif;"
			>
				QR Code
			</h2>
			<div
				class="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
			>
				<div class="flex flex-col gap-6">
					<!-- Title section -->
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full"
							style="background-color: #F5E6D3;"
						>
							<svg
								class="h-6 w-6"
								style="color: #D4A574;"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-medium" style="color: #2C3E50;">
								Code QR
							</h3>
							<p class="text-sm" style="color: #2C3E50; opacity: 0.7;">
								QR code en SVG - Utilisable à n'importe quelle taille d'affiche
								sans pixellisation
							</p>
						</div>
					</div>
					{#if data.event.slug}
						<!-- QR Code and public URL available -->
						<div class="flex flex-col gap-4">
							{#if qrCodeDataUrl}
								<div class="flex flex-col gap-4 sm:flex-row sm:items-start">
									<!-- QR Code image -->
									<div class="flex-shrink-0">
										<img
											src={qrCodeDataUrl}
											alt="QR Code"
											class="h-48 w-48 rounded-lg border-2 border-neutral-200"
										/>
									</div>

									<!-- Customization controls -->
									<div class="flex flex-col gap-3">
										<div
											class="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-gray-50 p-3"
										>
											<!-- Color picker -->
											<div class="flex items-center gap-2">
												<span class="text-sm" style="color: #2C3E50;"
													>Couleur QR:</span
												>
												<input
													type="color"
													value={qrCodeColor}
													on:input={(e) => changeQrColor(e.currentTarget.value)}
													class="h-8 w-16 cursor-pointer rounded border border-neutral-300"
												/>
											</div>

											<!-- Background color -->
											<div class="flex items-center gap-2">
												<span class="text-sm" style="color: #2C3E50;"
													>Fond:</span
												>
												<input
													type="color"
													value={qrCodeBackgroundColor}
													on:input={(e) => {
														qrCodeBackgroundColor = e.currentTarget.value;
														if (browser && publicUrl) {
															generateQRCode();
														}
													}}
													class="h-8 w-16 cursor-pointer rounded border border-neutral-300"
												/>
											</div>
										</div>

										<!-- Download buttons -->
										<div class="flex flex-col gap-2">
											<button
												type="button"
												on:click={downloadQrCodeSvg}
												class="w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
												title="Format vectoriel - Idéal pour l'impression en grande taille"
											>
												Télécharger en SVG
											</button>
											<button
												type="button"
												on:click={downloadQrCodePng}
												class="w-full rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
												title="Format image haute résolution (2048px)"
											>
												Télécharger en PNG
											</button>
										</div>
									</div>
								</div>

								<!-- Public URL - Full width below -->
								<div class="flex flex-col gap-2">
									<p class="text-sm" style="color: #2C3E50; opacity: 0.7;">
										Lien public
									</p>
									<div class="flex flex-col gap-2 sm:flex-row">
										<div
											class="flex-1 break-all rounded-lg border border-neutral-300 bg-gray-50 px-3 py-2 text-sm"
											style="color: #2C3E50;"
										>
											{publicUrl}
										</div>
										<button
											on:click={copyPublicUrl}
											style="background-color: #D4A574; border: none;"
										>
											{copied ? '✓ Copié !' : 'Copier'}
										</button>
									</div>
								</div>
							{:else}
								<div class="flex items-center gap-2">
									<LoaderCircle
										class="h-5 w-5 animate-spin"
										style="color: #D4A574;"
									/>
									<span class="text-sm" style="color: #2C3E50; opacity: 0.7;">
										Génération en cours...
									</span>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Payment done but QR code not yet generated -->
						<div class="flex items-center gap-2">
							<LoaderCircle
								class="h-5 w-5 animate-spin"
								style="color: #D4A574;"
							/>
							<span class="text-sm" style="color: #2C3E50; opacity: 0.7;">
								Génération en cours...
							</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
