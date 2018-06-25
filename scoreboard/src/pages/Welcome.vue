<template>
	
	<div>

		<welcome-card v-bind:welcome="welcome"></welcome-card>

	</div>

</template>

<script>

	import WelcomeCard from '@/components/WelcomeCard'
	
	export default {
		name: 'welcome',
		components: { 
			WelcomeCard
		},
		data() {
			return {
				welcome: {
					title: 'Welcome To VueBall',
					message: 'My sad excuse for my attempt to breakdown this concept in every way I can think of.'
				}
			}
		}
	}
	
</script>

<style>
	

</style>