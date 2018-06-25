<template>

	<div id="app">
			
		<div class="ui card centered">

			<nav>
				<router-link to="/">
					<img src="./assets/logo.svg" class="logo">
				</router-link>

				<div class="ui three item menu">

					<router-link to="/challenge" class="item">Challenge</router-link>
					<router-link to="/player-list" class="item">Players</router-link>
					<router-link to="/current-match" class="item">Match</router-link>

				</div>

			</nav>

		</div>

		<!-- Places the components to the right "router" from router/index.js -->
		<router-view></router-view>

	</div>

</template>

<script>

	const config = {
		apiKey: "AIzaSyB8jDgVZt79C8VlwSlR_GX8ND6vEPJSOuk",
		authDomain: "scoreboard-prototype.firebaseapp.com",
		databaseURL: "https://scoreboard-prototype.firebaseio.com",
		projectId: "scoreboard-prototype",
		storageBucket: "scoreboard-prototype.appspot.com",
		messagingSenderId: "1054474587980"
	};

	firebase.initializeApp(config);

	export default {
		name: 'App'
	}

</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 20px 0 30px;
}
.logo {
    max-width: 265px;
    margin: 15px auto 0;
}
</style>
