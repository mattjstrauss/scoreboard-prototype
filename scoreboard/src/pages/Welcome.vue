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
					title: "I'm Learning Vue",
					message: "Thanks for checking me out!"
				}
			}
		}
	}
	
</script>