<template>
	
	<div id="challenge-list">

		<div class="ui card centered" v-show="!selectingPlayers && !creatingPlayer">

			<div class="content">

				<div class="header">

					<h3>What kind of Player are you?</h3>

				</div>

			</div>

			<div class="extra content">

				<div class="ui form">

					<button class="ui button" v-on:click="createPlayer">
						Noob
					</button>

					<button class="ui button primary" v-on:click="selectPlayers">
						Returning Player
					</button>

				</div>

			</div>

		</div>


		<div class="ui card centered" v-show="challengerOne || challengerTwo">

			<div class="content">

				<div class="header">

					<h3>Challengers</h3>

				</div>

			</div>

			<div class="extra content">

				<button v-if="challengers.challengerOneRating > 50" class="ui animated button fluid large red" v-on:click="removeChallengerOne" v-show="challengerOne">

				  	<div class="visible content" v-if="challengers.challengerOneNickname">{{challengers.challengerOneNickname}}</div> 
			  		<div class="visible content" v-else>{{challengers.challengerOneName}}</div>

				  	<div class="hidden content">

				  		<i class="user times icon"></i> Remove

				  	</div>

			  	</button>

			  	<button v-else class="ui animated button fluid large" v-on:click="removeChallengerOne" v-show="challengerOne">

			  		<div class="visible content" v-if="challengers.challengerOneNickname">{{challengers.challengerOneNickname}}</div> 
			  		<div class="visible content" v-else>{{challengers.challengerOneName}}</div>

				  	<div class="hidden content">

				  		<i class="user times icon"></i> Remove

				  	</div>

			  	</button>

	  		<div class="vs"></div>
			  
		  		<button class="ui animated button fluid large" v-on:click="removeChallengerTwo" v-show="challengerTwo">
			  	
			  		<div class="visible content" v-if="challengers.challengerTwoNickname">{{challengers.challengerTwoNickname}}</div> 
			  		<div class="visible content" v-else>{{challengers.challengerTwoName}}</div>
			  	
			  		<div class="hidden content">
				    
				    	<i class="user times icon"></i> Remove

					</div>

		  		</button>

			</div>

			<button class="ui button green fluid large" v-show="matchSet">Start Game</button>

		</div>

		<div class="ui card centered" v-show="!creatingPlayer && selectingPlayers && !matchSet">
			
			<div class="content">
				
				<div class="header">
					
					<h3>Create Your Matchup</h3>

				</div>

			</div>

		</div>

		<div class="ui card centered" v-for="(player, index) in leaderBoard" v-show="!creatingPlayer && selectingPlayers && !matchSet && challengers.challengerOneName !== player.playerName && challengers.challengerTwoName !== player.playerName">

			<div class="content left aligned">

				<div class="header">
					
					<div class="player-details">

						<button class="ui button basic right labeled large icon" v-on:click.prevent="challenge(player)">
							
							<span class="player-name" v-if="player.playerNickname">{{player.playerNickname}}</span> 
							<span class="player-name" v-else>{{player.playerName}}</span> 
							
							<i class="ui icon user plus"></i>

						</button>

					</div>

				</div>
				
			</div>

			<div class="extra content left aligned">

				<div class="left floated">
				    <span class="ui green label" data-tooltip="Wins" data-position="bottom center">+ {{player.playerWins}}</span>
				    <span class="ui red label" data-tooltip="Losses" data-position="bottom center">- {{player.playerLosses}}</span>
				</div>

				<div class="right floated" data-tooltip="Winning Percentage = (Wins / Total Games)*100" data-position="bottom center">

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

		<button class="ui basic button icon" v-show="selectingPlayers && !creatingPlayer && !matchSet" v-on:click.prevent="createPlayer">

			<i class="ui icon plus circle"></i> Add Player

		</button>

		<div id="create-player" class="ui basic content center aligned segment" v-show="creatingPlayer && !matchSet">

			<div class="ui centered card">

				<div class="content">

					<div class="header">
						<h3>Enter your info to get started</h3>
					</div>

				</div>
							
				<div class="extra content">

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
				playerNickname: '',
				playerWins: '',
				playerLosses: '',
				playerGamesPlayed: '',
				playerRating: '',
				challengers: {
					'challengerOneName': '',
					'challengerOneRating': '',
					'challengerOneNickname': '',
					'challengerTwoName': '',
					'challengerTwoRating': '',
					'challengerTwoNickname': '',
				},
				isChallenger: false,
				challengerOne: null,
				challengerTwo: null,
				activePlayer: false,
				matchSet: null,
				isReady: false,
				selectingPlayers: false,
				creatingPlayer: false,
			}
		},
		methods: {
			// Pushes the name to Firebase and empties the field
			addPlayer(player) {
				playersRef.push({
					playerName: this.playerName,
					playerNickname: this.playerNickname,
					playerWins: 0,
					playerLosses: 0,
					playerGamesPlayed: 0,
					playerRating: 0,
				})
        		if(!this.challengerOne){
					this.challengerOne = player;
					this.$set(this.challengers, 'challengerOneName', this.playerName);
					this.$set(this.challengers, 'challengerOneNickname', this.playerNickname);
					this.$set(this.challengers, 'challengerOneRating', this.playerRating);
				} else if(!this.challengerTwo){
					this.challengerTwo = player;
					this.$set(this.challengers, 'challengerTwoName', this.playerName);
					this.$set(this.challengers, 'challengerTwoNickname', this.playerNickname);
					this.$set(this.challengers, 'challengerTwoRating', this.playerRating);
				}
				if (this.challengerOne && this.challengerTwo) {
					this.matchSet = true;
				}
				this.playerName = '';
        		this.playerNickname = '';
        		this.selectingPlayers = true;
        		this.creatingPlayer = false;
			},
			// Shows "Add Player" form
			createPlayer() {
				this.creatingPlayer = true;
			},
			// Hides "Add Player" form
			closeForm() {
				this.creatingPlayer = false;
			},
			selectPlayers() {
				this.selectingPlayers = true;
			},
			challenge(player) {
				// challengers.push({playerName: this.playerName, playerScore: this.playerScore})
				// this.isChallenger = player.playerName;
				if(!this.challengerOne){
					this.challengerOne = player;
					this.$set(this.challengers, 'challengerOneName', player.playerName);
					this.$set(this.challengers, 'challengerOneNickname', player.playerNickname);
					this.$set(this.challengers, 'challengerOneRating', player.playerRating);
				} else if(!this.challengerTwo){
					this.challengerTwo = player;
					this.$set(this.challengers, 'challengerTwoName', player.playerName);
					this.$set(this.challengers, 'challengerTwoNickname', player.playerNickname);
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
				this.creatingPlayer = false;
			},
			removeChallengerTwo(){
				this.matchSet = false;
				this.challengers.challengerTwoName = '';
				this.challengers.challengerTwoRating = '';
				this.challengerTwo = null;
				this.creatingPlayer = false;
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
    display: block;
    width: 100%;
}
.vs:before {
	content: "vs";
    text-align: center;
    border-radius: 500rem;
    background-color: #fff;
    text-shadow: none;
    width: 1.78571429em;
    height: 1.78571429em;
    line-height: 1.78571429em;
    color: rgba(0,0,0,.4);
    font-style: normal;
    font-weight: 700;
    box-shadow: 0 0 0 1px transparent inset;
    display: inline-block;
}
.ui.form .fields {
	margin: 0 -.5em 0em;
}
.player-details .button {
	width: 100%;
	text-align: left;
}
	
</style>