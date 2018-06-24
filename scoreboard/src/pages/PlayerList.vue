<template>
	
	<div id="player-list">

		<div class="ui card centered" v-for="(player, index) in leaderBoard" v-show="!matchSet">

			<span class="ui right corner label">
        		<i v-if="index == 0" class="ui icon trophy yellow"></i>
				<i v-if="index == 1" class="ui icon trophy grey"></i>
				<i v-if="index == 2" class="ui icon trophy brown"></i>
      		</span>

			<div class="content left aligned">

				<div class="player-details" v-show="player !== editingPlayer">

					<div class="header">
						
						<h3>
							
							<span class="player-name" v-if="player.playerNickname">{{player.playerNickname}}</span> 
							<span class="player-name" v-else>{{player.playerName}}</span> 

						</h3>

					</div>

					<div class="meta"  v-if="player.playerNickname">{{player.playerName}}</div>

				</div>
					
				<div class="ui form equal width form left aligned" v-show="player == editingPlayer">
				
					<div class="player-update-inputs">
						
						<div class="field">
							
							<label>Actual Name</label>
		  					<input type="text" placeholder="Name" v-model="playerName">

						</div>

						<div class="field">
							
							<label>Nickname</label>
		  					<input type="text" placeholder="Nickname" v-model="playerNickname">

						</div>

						<div class="fields">
						
							<div class="ui tiny field">
								<label>Wins</label>
							  <input type="number" placeholder="Wins" v-model.number="playerWins">
							</div>

							<div class="ui tiny field">
								<label>Losses</label>
		  						<input type="text" placeholder="Losses" v-model="playerLosses">
							</div>

						</div>

					</div>

				</div>
				
			</div>

			<div class="extra content left aligned">
				
				<div class="player-actions">

					<a class="ui basic button mini left floated" href="#" v-show="player === editingPlayer" v-on:click.prevent="deletePlayer(player)">
						<i class="ui icon trash"></i>
						Delete
					</a>

					<div class="ui buttons mini right floated">

						<a class="ui button" href="#" v-show="player === editingPlayer" v-on:click.prevent="cancelPlayerEdits">
							<i class="ui icon times"></i>
							Cancel
						</a>

						<a class="ui button" href="#" v-show="player === editingPlayer" v-on:click.prevent="savePlayerEdits">
							<i class="ui icon save"></i>
							Save
						</a>

					</div>

					<div v-show="player !== editingPlayer">

						<div class="left floated">
						    <span class="ui green label" data-tooltip="Wins">+ {{player.playerWins}}</span>
						    <span class="ui red label" data-tooltip="Losses">- {{player.playerLosses}}</span>
						</div>

						<a class="ui button mini right floated" href="#" v-on:click.prevent="editPlayer(player)">
							<i class="ui icon edit"></i>
							Edit
						</a>

					</div>

					<!-- <a class="ui button mini right floated" href="#" v-show="player !== editingPlayer" v-on:click.prevent="challenge(player)">
						<i class="ui icon heart outline" v-show="player !== isChallenger"></i>
						<i class="ui icon heart red" v-show="player == isChallenger"></i>
						Challenge
					</a> -->

				</div>

			</div>

		</div>

	</div>
	
</template>

<script>

	const database = firebase.database();
	const playersRef = database.ref('players');

	export default {
		name: 'player-list',
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
				playersRef.push({playerName: this.playerName, playerScore: 0})
        		this.playerName = ''
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
				this.playerNickname = player.playerNickname;
				this.playerWins = player.playerWins;
				this.playerLosses = player.playerLosses;
			},
			// Cancels and removes "Player Editing" abilities
			cancelPlayerEdits() {
				this.editingPlayer = null;
				this.playerName = '';
				this.playerNickname = '';
				this.playerWins = '';
				this.playerLosses = '';
			},
			// Save and removes "Player Editing" abilities
			savePlayerEdits() {
				playersRef.child(this.editingPlayer.id).update({
					playerName: this.playerName,
					playerNickname: this.playerNickname,
					playerWins: Math.round(Number(this.playerWins)),
					playerLosses: Math.round(Number(this.playerLosses)),
					playerGamesPlayed: Math.round(Number(this.playerWins)) + Math.round(Number(this.playerLosses)),
					playerRating: Math.round(Math.round(Number(this.playerWins)) / (Math.round(Number(this.playerWins)) + Math.round(Number(this.playerLosses))) * 100)
				});
				this.cancelPlayerEdits();
			},
			// Deletes Player
			deletePlayer(player) {
				playersRef.child(player.id).remove();
				this.editingPlayer = false;	
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

<style>
.vs {
	position: relative;
    width: .3em;
    z-index: 3;
    font-size: 1rem;
}
.vs:before {
	content: "vs";
    position: absolute;
    text-align: center;
    border-radius: 500rem;
    top: 50%;
    left: 50%;
    background-color: #fff;
    text-shadow: none;
    margin-top: -.89285714em;
    margin-left: -.89285714em;
    width: 1.78571429em;
    height: 1.78571429em;
    line-height: 1.78571429em;
    color: rgba(0,0,0,.4);
    font-style: normal;
    font-weight: 700;
    -webkit-box-shadow: 0 0 0 1px transparent inset;
    box-shadow: 0 0 0 1px transparent inset;
}
.ui.form .fields {
	margin: 0 -.5em 0em;
}
	
</style>