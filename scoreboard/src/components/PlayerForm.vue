<template>

	<div id="player-form">
		
		
  		<input v-model="message">
  		<input v-model="score">
  		<p>{{ message }} - {{ score }}</p>

	</div>
	
</template>

<script>

	export default {
		name: 'PlayerForm',
		props: [ 'message', 'score'] 
	}
	
</script>

<style>
	
</style>