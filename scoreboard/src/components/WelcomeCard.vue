<template>

	<div id="welcome-card">

		<div class="ui card centered">

			<div class="content">

				<h1>{{ welcome.title }}</h1>
				<p>{{ welcome.message }}</p>
				
			</div>

		</div>

	</div>
	
</template>

<script>

	export default {
		props: ['welcome']
	}

</script>

<style>
	
</style>