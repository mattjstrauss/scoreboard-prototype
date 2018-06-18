<template>

	<div id="player-list">

		<div class="ui card centered" v-for="player in players">

			<div class="content">

				<div class="header">

					<h4>{{player.name}} - {{player.score}}</h4>

				</div>
				
			</div>

			<div class="extra content">
				
				<div class="right floated player-actions">
					
						<i class="ui icon edit"></i>
						Edit
					
						<i class="ui icon trash"></i>
						Delete

				</div>

			</div>

		</div>

	</div>
	
</template>

<script>

	export default {
		props: ['players']
	}

</script>

<style>
	
</style>