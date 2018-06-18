<template>

	<div id="app">
		
		<img src="./assets/logo.svg" class="logo">

		<create-player></create-player>

	</div>

</template>

<script>

	// var config = {
	// 	apiKey: "AIzaSyB8jDgVZt79C8VlwSlR_GX8ND6vEPJSOuk",
	// 	authDomain: "scoreboard-prototype.firebaseapp.com",
	// 	databaseURL: "https://scoreboard-prototype.firebaseio.com",
	// 	projectId: "scoreboard-prototype",
	// 	storageBucket: "scoreboard-prototype.appspot.com",
	// 	messagingSenderId: "1054474587980"
	// };
	// firebase.initializeApp(config);

	// const database = firebase.database();

	// database.ref('players').on('value', function(snapshot){

		//console.log(snapshot.val());
		
	// });


	import WelcomeCard from './components/WelcomeCard';
	// import PlayerList from './components/PlayerList';
	import CreatePlayer from './components/CreatePlayer';

	export default {
		name: 'App',
		components: {
			WelcomeCard,
			// PlayerList,
			CreatePlayer
		},
		data() {
			return {
				intro: [{
					title: "Get Ready to Party",
					instructions: "Start a New Game or checkount the leaderboard."
				}],
				leaderboard: [{
					title: "Leaderboard",
				}]
			}
		}
	}

</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.logo {
	max-width: 200px;
    margin: 0 auto;
}
</style>
