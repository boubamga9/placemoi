<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUp } from 'lucide-svelte';

	let showButton = false;

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	function handleScroll() {
		showButton = window.scrollY > 300;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if showButton}
	<button
		on:click={scrollToTop}
		class="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
		style="background-color: #D4A574;"
		on:mouseover={(e) => (e.currentTarget.style.backgroundColor = '#C49863')}
		on:mouseout={(e) => (e.currentTarget.style.backgroundColor = '#D4A574')}
		aria-label="Retour en haut de la page"
	>
		<ArrowUp class="h-6 w-6 text-white" />
	</button>
{/if}

