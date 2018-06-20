<template>
	
	<div>
		<div class="ui card centered" v-show="matchSet">

			<div class="content">

				<div class="header">

					<div class="three ui buttons">
					  <button class="ui animated button large">
					  	<div class="visible content">{{challengers.chalengerOneName}}</div>
					  	<div class="hidden content">
					  		 <i class="trophy icon"></i> Winner
						  </div>
					  </button>
					  <div class="vs"></div>
					  <button class="ui animated button large">
					  	<div class="visible content">{{challengers.chalengerTwoName}}</div>
					  	<div class="hidden content">
						    <i class="trophy icon"></i> Winner
						  </div>
					  </button>
					</div>

				</div>

			</div>

		</div>

		<div class="ui card centered" v-for="(player, index) in leaderBoard" v-show="!matchSet">

			<div class="content">

				<div class="header">
					
					<div class="player-details" v-show="player !== editingPlayer">
					
						<h3 class="left floated">
							
							<i v-if="index == 0" class="ui icon trophy yellow"></i>
							<i v-if="index == 1" class="ui icon trophy grey"></i>
							<i v-if="index == 2" class="ui icon trophy brown"></i>
							<span class="player-name">{{player.playerName}}</span> - 
							<span class="player-score">{{player.playerScore}}</span>

						</h3>

					</div>
					
					<div class="ui form">
					
						<div class="player-update-inputs field" v-show="player == editingPlayer">
							
							<div class="fields">
							
								<div class="ui tiny input eleven wide field">
			  						<input type="text" placeholder="Name" v-model="playerName">
								</div>
								<div class="ui tiny input five wide field">
								  <input type="number" placeholder="Score" v-model.number="playerScore">
								</div>

							</div>

						</div>

					</div>

				</div>
				
			</div>

			<div class="extra content">
				
				<div class="player-actions">

					<a class="ui basic button mini left floated" href="#" v-show="player === editingPlayer" v-on:click="deletePlayer(player)">
						<i class="ui icon trash"></i>
						Delete
					</a>

					<div class="ui buttons mini right floated">

						<a class="ui button" href="#" v-show="player === editingPlayer" v-on:click="cancelPlayerEdits">
							<i class="ui icon times"></i>
							Cancel
						</a>

						<a class="ui button" href="#" v-show="player === editingPlayer" v-on:click="savePlayerEdits">
							<i class="ui icon save"></i>
							Save
						</a>

					</div>

					<a class="ui button mini left floated" href="#" v-show="player !== editingPlayer" v-on:click="editPlayer(player)">
						<i class="ui icon edit"></i>
						Edit
					</a>

					<a class="ui button mini right floated" href="#" v-show="player !== editingPlayer" v-on:click="challenge(player)">
						<i class="ui icon heart outline" v-show="player !== isChallenger"></i>
						<i class="ui icon heart red" v-show="player == isChallenger"></i>
						Challenge
					</a>

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

					<button class="ui negative primary button" v-on:click="closeForm">

						<i class="ui icon plus times circle"></i> Cancel

					</button>

					<button class="ui positive primary button" v-on:click="addPlayer">

						<i class="ui icon plus check circle"></i> Create

					</button>

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

 	database.ref('players').on('value', snapshot => console.log(snapshot.val()));

	export default {
		data() {
			return {
				players: [],
				playerName: '',
				playerScore: '',
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
				updatedPlayer.playerScore = snapshot.val().playerScore;

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
	
</style>