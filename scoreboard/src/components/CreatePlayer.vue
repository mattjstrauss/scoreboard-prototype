<template>
	
	<div>
		
		<div class="ui card centered" v-for="player in leaderBoard">

			<div class="content">

				<div class="header">

					<h4>{{player.playerName}} - {{player.playerScore}}</h4>

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

	<div id="create-player" class="ui basic content center aligned segment">
		
		<button class="ui basic button icon" v-show="!isCreating" v-on:click="openForm">

			<i class="ui icon plus circle"></i> Add Player

		</button>

		<div class="ui centered card" v-show="isCreating">
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Name</label>
						<input type="text" placeholder="Name" v-model="playerName">
					</div>
					<div class="ui two button attached buttons">
						<button class="ui positive basic button" v-on:click="addPlayer">
							<i class="ui icon plus check circle"></i> Create
						</button>
						<button class="ui negative basic button" v-on:click="closeForm">
							<i class="ui icon plus times circle"></i> Cancel
						</button>
					</div>
				</div>
			</div>
		</div>

	</div>
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

	const database = firebase.database();
 	const playersRef = database.ref('players');

 	database.ref('players').on('value', function(snapshot){
 		console.log(snapshot.val());
 	});

	export default {
		data() {
			return {
				players: [],
				playerName: '',
				isCreating: false,
			}
		},
		methods: {
			addPlayer() {
				playersRef.push({playerName: this.playerName, playerScore: 0})
        		this.playerName = ''
			},
			openForm() {
				this.isCreating = true;
			},
			closeForm() {
				this.isCreating = false;
			}
		},
		created() {
			playersRef.on('child_added', snapshot => this.players.push(snapshot.val()));
		},
		computed: {
		  leaderBoard: function () {
		    return _.orderBy(this.players, 'playerScore', 'desc')
		  }
		}
	}

</script>

<style>
	
</style>