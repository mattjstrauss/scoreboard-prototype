<template>

	<div id="create-player" class="ui basic content center aligned segment">
		
		<button class="ui basic button icon" v-show="!isCreating" v-on:click.prevent="openForm">

			<i class="ui icon plus circle"></i> Add Player

		</button>

		<div class="ui centered card" v-show="isCreating">

			<div class="content">

				<div class="ui form">

					<div class="field">

						<label>Actual Name</label>
						<input type="text" placeholder="Name" v-model="playerName">

					</div>

					<div class="field">

						<label>Nickname</label>
						<input type="text" placeholder="Nickname" v-model="playerNickname">

					</div>

					<button class="ui negative primary button" v-on:click.prevent="closeForm">

						<i class="ui icon plus times circle"></i> Cancel

					</button>

					<button class="ui positive primary button" v-on:click.prevent="addPlayer">

						<i class="ui icon plus check circle"></i> Create

					</button>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	// import WelcomeCard from '@/components/WelcomeCard'
	
	const database = firebase.database();
	const playersRef = database.ref('players');

	export default {
		name: 'add-player',
		data() {
			return {
				players: [],
				playerName: '',
				playerNickname: '',
				playerWins: '',
				playerLosses: '',
				playerGamesPlayed: '',
				playerRating: '',
				isCreating: false,
				isChallenger: null,
				editingPlayer: null,
				challengers: {
					'chalengerOneName': '',
					'challengerTwoName': ''
				},
				challengerOne: null,
				challengerTwo: null,
				matchSet: null
			}
		},
		methods: {
			// Pushes the name to Firebase and empties the field
			addPlayer() {
				playersRef.push({
					playerName: this.playerName,
					playerNickname: this.playerNickname,
					playerWins: 0,
					playerLosses: 0,
					playerGamesPlayed: 0,
					playerRating: 0,
				})
        		this.playerName = '';
        		this.playerNickname = ''
			},
			// Shows "Add Player" form
			openForm() {
				this.isCreating = true;
			},
			// Hides "Add Player" form
			closeForm() {
				this.isCreating = false;
			},
			// Enables "Player Editing" abilities
			editPlayer(player) {
				this.editingPlayer = player;
				this.playerName = player.playerName;
				this.playerScore = player.playerScore;
			},
			// Cancels and removes "Player Editing" abilities
			cancelPlayerEdits() {
				this.editingPlayer = null;
				this.playerName = '';	
				this.playerScore = '';	
			},
			// Save and removes "Player Editing" abilities
			savePlayerEdits() {
				playersRef.child(this.editingPlayer.id).update({playerName: this.playerName, playerScore: Math.round(Number(this.playerScore))});
				this.cancelPlayerEdits();
			},
			// Deletes Player
			deletePlayer(player) {
				playersRef.child(player.id).remove();
				this.editingPlayer = false;	
			},
			challenge(player) {
				// challengers.push({playerName: this.playerName, playerScore: this.playerScore})
				this.isChallenger = player.playerName;
				if(!this.challengerOne){
					this.challengerOne = true;
					this.$set(this.challengers, 'chalengerOneName', player.playerName);
					console.log('Challenger One' + player.playerName);
				} else if(!this.challengerTwo){
					this.challengerTwo = true;
					this.$set(this.challengers, 'chalengerTwoName', player.playerName);
					this.matchSet = true;
					console.log('Challenger Two' + player.playerName);
				}
			}
		},
		created() {
			
			playersRef.on('child_added', snapshot => this.players.push({...snapshot.val(), id: snapshot.key}));

			playersRef.on('child_removed', snapshot => {

				const deletedPlayer = this.players.find(player => player.id === snapshot.key);

				const index = this.players.indexOf(deletedPlayer);

				this.players.splice(index, 1);

			});

			playersRef.on('child_changed', snapshot => {

				const updatedPlayer = this.players.find(player => player.id === snapshot.key);

				updatedPlayer.playerName = snapshot.val().playerName;
				updatedPlayer.playerNickname = snapshot.val().playerNickname;
				updatedPlayer.playerWins = snapshot.val().playerWins;
				updatedPlayer.playerLosses = snapshot.val().playerLosses;

			});
		},
		computed: {
		  leaderBoard: function () {
		    return _.orderBy(this.players, 'playerScore', 'desc')
		  }
		}
	}
	
</script>