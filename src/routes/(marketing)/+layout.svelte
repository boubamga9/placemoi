<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import MenuIcon from 'virtual:icons/lucide/menu';
	import XIcon from 'virtual:icons/lucide/x';
	import '../../app.css';

	const menuItems: Record<string, string> = {
		'/': 'Accueil',
		'/#faq': 'FAQ',
		'/contact': 'Contact',
	};

	const mobileMenuItems = Object.entries(menuItems).filter(([href]) => href !== '/#faq');

	let menuOpen = false;

	// Get current year dynamically
	const currentYear = new Date().getFullYear();
	onNavigate((_) => {
		menuOpen = false;
	});

	export let data;

	let isAuthenticated: boolean;
	let primaryCtaHref: string;
	let primaryCtaLabel: string;

	$: isAuthenticated = Boolean(data?.session);
	$: primaryCtaHref = isAuthenticated ? '/events' : '/auth';
	$: primaryCtaLabel = isAuthenticated ? 'Mon espace' : 'Commencer';
</script>

<!-- Navbar integrated in Hero section with transparent background -->
<header
	class="marketing-section absolute top-0 z-10 w-full py-4"
	style="background-color: transparent;"
>
	<div class="container flex items-center justify-between">
		<!-- Logo à gauche -->
		<div class="flex justify-start">
			<Button
				variant="ghost"
				class="flex w-fit flex-nowrap items-center gap-3 text-xl transition-colors duration-200 hover:bg-white/20"
				href="/"
			>
				<img
					src="/images/logo_text.svg"
					alt="Logo Pattyly"
					class="h-[70px] w-[124px] object-contain transition-transform duration-200 hover:scale-105"
				/>
			</Button>
		</div>

		<!-- Navigation centrée (cachée sur mobile) -->
		<nav class="absolute left-1/2 hidden -translate-x-1/2 transform lg:block">
			<ul class="flex items-center gap-8 text-lg font-bold">
				{#each Object.entries(menuItems) as [href, text]}
					<li>
						<Button
							variant="ghost"
							{href}
							class="text-base text-foreground transition-colors duration-200 hover:bg-white/20 hover:text-white"
							style="color: #333; font-size: 18px;"
						>
							{text}
						</Button>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Boutons à droite -->
		<div class="flex items-center gap-4">
			<!-- Boutons desktop -->
			<div class="hidden lg:flex lg:gap-4">
				<Button
					href={primaryCtaHref}
					class="rounded-xl text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
					style="width: 140px; height: 48px; background-color: #D4A574;"
				>
					{primaryCtaLabel}
				</Button>
			</div>

			<!-- Bouton mobile -->
			<div class="lg:hidden">
				<Drawer.Root bind:open={menuOpen}>
					<Drawer.Trigger asChild let:builder>
						<Button variant="ghost" size="icon" builders={[builder]}>
							<span class="sr-only">Menu</span>
							<MenuIcon />
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="flex justify-end py-0">
							<Drawer.Close asChild let:builder>
								<Button variant="ghost" size="icon" builders={[builder]}>
									<span class="sr-only">Close</span>
									<XIcon />
								</Button>
							</Drawer.Close>
						</Drawer.Header>
						<nav class="[&_ul]:flex [&_ul]:flex-col [&_ul]:p-2">
							<ul>
								{#each mobileMenuItems as [href, text]}
									<li>
										<Button
											{href}
											variant="ghost"
											class="w-full py-6 text-base"
											on:click={() => (menuOpen = false)}
										>
											{text}
										</Button>
									</li>
								{/each}
							</ul>
							<Separator />
							<ul class="">
								<li>
									<Button
										href={primaryCtaHref}
										variant="ghost"
										class="w-full py-6 text-base"
										on:click={() => (menuOpen = false)}
									>
										{isAuthenticated ? 'Mon espace' : 'Créer mon événement'}
									</Button>
								</li>
							</ul>
						</nav>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		</div>
	</div>
</header>

<main class="marketing-section">
	<slot />
</main>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<footer
	class="border-t py-12"
	style="background-color: #2C3E50; border-color: #3A4E66;"
>
	<div class="container flex flex-col gap-8">
		<!-- Top section: Logo + Links -->
		<div class="flex flex-col flex-wrap gap-8 lg:flex-row lg:justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<img
					src="/images/logo_text.svg"
					alt="Logo PLACEMOI"
					class="h-12 w-auto brightness-0 invert"
				/>
			</div>

			<!-- Links Grid -->
			<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:gap-12">
				<!-- Légal -->
				<div class="flex flex-col gap-3">
					<h3
						class="text-sm font-semibold uppercase tracking-wider text-white/90"
					>
						Légal
					</h3>
					<nav class="flex flex-col gap-2">
						<a
							href="/cgu"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							CGU
						</a>
						<a
							href="/legal"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							Mentions légales
						</a>
						<a
							href="/privacy"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							Confidentialité
						</a>
					</nav>
				</div>

				<!-- Contact -->
				<div class="flex flex-col gap-3">
					<h3
						class="text-sm font-semibold uppercase tracking-wider text-white/90"
					>
						Contact
					</h3>
					<nav class="flex flex-col gap-2">
						<a
							href="/contact"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							Nous contacter
						</a>
					</nav>
				</div>

				<!-- Réseaux sociaux -->
				<div class="flex flex-col gap-3">
					<h3
						class="text-sm font-semibold uppercase tracking-wider text-white/90"
					>
						Suivez-nous
					</h3>
					<nav class="flex flex-col gap-2">
						<a
							href="https://www.instagram.com/placemoi"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							Instagram
						</a>
						<a
							href="https://www.tiktok.com/@placemoi.com"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-white/70 transition-colors hover:text-white/90"
						>
							TikTok
						</a>
					</nav>
				</div>
			</div>
		</div>

		<!-- Bottom section: Copyright -->
		<div class="border-t pt-8" style="border-color: #3A4E66;">
			<p class="text-center text-sm text-white/60">
				© {currentYear} PLACEMOI. Tous droits réservés.
			</p>
		</div>
	</div>
</footer>

<style>
	:root {
		scroll-behavior: smooth;
	}
</style>
