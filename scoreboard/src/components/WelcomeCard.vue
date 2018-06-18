<template>

	<div id="welcome-screen">

		<div class="ui card centered">

			<div class="content">

				<h1>{{intro.title}}</h1>

				<div class="meta">

					<p>{{intro.instructions}}</p>

				</div>
				
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