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
		data(){
			return {
				welcome: {
					title: "Welcome To My Little Pool Playing Do-Dad Score Keeper Thingy",
					message: "Thanks for checking me out!"
				}
			}
		}
	}
	
</script>