<template>
	
	<div id="challenge-list">

		<div class="ui card centered">
			<div class="content">
				<div class="header">
					<h3>What kind of Player are you?</h3>
					<div class="ui form">

						<button class="ui button tiny">
							New Player
						</button>

						<button class="ui button primary tiny">
							Returning Player
						</button>

					</div>
				</div>
			</div>
		</div>

		<div class="ui card centered" v-show="challengerOne || challengerTwo">

			<div class="content">

				<div class="header">

					<div class="three ui buttons">

						<button v-if="challengers.challengerOneRating > 50" class="ui animated button large red" v-on:click="removeChallengerOne" v-show="challengerOne">

						  	<div class="visible content">{{challengers.challengerOneName}}</div>

						  	<div class="hidden content">

						  		<i class="cancel icon"></i> Remove

						  	</div>

					  	</button>

					  	<button v-else class="ui animated button large" v-on:click="removeChallengerOne" v-show="challengerOne">

					  		<div class="visible content">{{challengers.challengerOneName}}</div>

						  	<div class="hidden content">

						  		<i class="cancel icon"></i> Remove

						  	</div>

					  	</button>

				  		<div class="vs"></div>
					  
				  		<button class="ui animated button large" v-on:click="removeChallengerTwo" v-show="challengerTwo">
					  	
					  		<div class="visible content">{{challengers.challengerTwoName}}</div>
					  	
					  		<div class="hidden content">
						    
						    	<i class="cancel icon"></i> Remove

							</div>

				  		</button>

					</div>

				</div>

			</div>

			<div class="extra content" v-show="matchSet">

				<button class="ui button green fluid large">Start Game</button>
			</div>

		</div>

		<div class="ui card centered" v-for="(player, index) in leaderBoard" v-show="!matchSet && challengers.challengerOneName !== player.playerName && challengers.challengerTwoName !== player.playerName">

			<div class="content left aligned">

				<div class="header">
					
					<div class="player-details">

						<button class="ui button basic right labeled large icon" v-on:click.prevent="challenge(player)">
							
							<span class="player-name">{{player.playerName}}</span>
							<i class="ui icon toggle on green" v-show="challengers.challengerOneName == player.playerName || challengers.challengerTwoName == player.playerName"></i>
							<i class="ui icon plus square outline"></i>

						</button>

					</div>

				</div>
				
			</div>

			<div class="extra content left aligned">

				<div class="left floated">
				    <span class="ui green label" data-tooltip="Wins">+ {{player.playerWins}}</span>
				    <span class="ui red label" data-tooltip="Losses">- {{player.playerLosses}}</span>
				</div>

				<div class="right floated" data-tooltip="Winning Percentage = (Wins / Total Games)*100">

					Difficulty: 

					<span class="ui red label" v-if="player.playerRating > 80">
						
						{{player.playerRating}}%

					</span>

					<span class="ui orange label" v-else-if="player.playerRating > 60">
						
						{{player.playerRating}}%
						
					</span>

					<span class="ui yellow label" v-else-if="player.playerRating > 40">
						
						{{player.playerRating}}%

					</span>

					<span class="ui olive label" v-else-if="player.playerRating > 20">
						
						{{player.playerRating}}%

					</span>

					<span class="ui green label" v-else>

						{{player.playerRating}}%

					</span>

				</div>

			</div>

		</div>

	</div>
	
</template>

<script>

	const database = firebase.database();
	const playersRef = database.ref('players');

	export default {
		name: 'challenge-list',
		data() {
			return {
				players: [],
				playerName: '',
				playerNickName: '',
				playerWins: '',
				playerLosses: '',
				playerGamesPlayed: '',
				playerRating: '',
				challengers: {
					'challengerOneName': '',
					'challengerOneRating': '',
					'challengerTwoName': '',
					'challengerTwoRating': '',
				},
				isChallenger: false,
				challengerOne: null,
				challengerTwo: null,
				activePlayer: false,
				matchSet: null,
				isReady: false
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
			challenge(player) {
				// challengers.push({playerName: this.playerName, playerScore: this.playerScore})
				// this.isChallenger = player.playerName;
				if(!this.challengerOne){
					this.challengerOne = player;
					this.$set(this.challengers, 'challengerOneName', player.playerName);
					this.$set(this.challengers, 'challengerOneRating', player.playerRating);
				} else if(!this.challengerTwo){
					this.challengerTwo = player;
					this.$set(this.challengers, 'challengerTwoName', player.playerName);
					this.$set(this.challengers, 'challengerTwoRating', player.playerRating);
				}
				if (this.challengerOne && this.challengerTwo) {
					this.matchSet = true;
				}
			},
			removeChallengerOne(){
				this.matchSet = false;
				this.challengers.challengerOneName = '';
				this.challengers.challengerOneRating = '';
				this.challengerOne = null;
			},
			removeChallengerTwo(){
				this.matchSet = false;
				this.challengers.challengerTwoName = '';
				this.challengers.challengerTwoRating = '';
				this.challengerTwo = null;
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
		    return _.orderBy(this.players, 'playerName', 'asc')
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
.player-details .button {
	width: 100%;
	text-align: left;
}
	
</style>