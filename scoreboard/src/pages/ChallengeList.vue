<template>
	
	<div id="challenge-list">

		<div :class="['column', {'match-set': matchSet}]">

			<div class="ui card centered" v-show="matchSet">
				
				<div class="content">
					
					<div class="header">
						
						<h2>Click 'Start Game' To Begin You Game</h2>

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


				  	<button :class="'ui animated button fluid large ' + [challengers.challengerOneRating < 55 ? 'blue-button' : challengers.challengerOneRating < 60 ? 'green-button' : challengers.challengerOneRating < 70 ? 'olive-button' : challengers.challengerOneRating < 80 ? 'yellow-button' : challengers.challengerOneRating < 90 ? 'orange-button' : challengers.challengerOneRating <= 100 ? 'red-button' : 'blue-button']" v-on:click="removeChallengerOne" v-show="challengerOne">

				  		<div class="visible content" v-if="challengers.challengerOneNickname">{{challengers.challengerOneNickname}}</div> 
				  		<div class="visible content" v-else>{{challengers.challengerOneName}}</div>

					  	<div class="hidden content">

					  		<i class="user times icon"></i> Remove

					  	</div>

				  	</button>

		  		<div class="vs"></div>
				  
			  		<button :class="'ui animated button fluid large ' + [challengers.challengerTwoRating < 55 ? 'blue-button' : challengers.challengerTwoRating < 60 ? 'green-button' : challengers.challengerTwoRating < 70 ? 'olive-button' : challengers.challengerTwoRating < 80 ? 'yellow-button' : challengers.challengerTwoRating < 90 ? 'orange-button' : challengers.challengerTwoRating <= 100 ? 'red-button' : 'blue-button']" v-on:click="removeChallengerTwo" v-show="challengerTwo">
				  	
				  		<div class="visible content" v-if="challengers.challengerTwoNickname">{{challengers.challengerTwoNickname}}</div> 
				  		<div class="visible content" v-else>{{challengers.challengerTwoName}}</div>
				  	
				  		<div class="hidden content">
					    
					    	<i class="user times icon"></i> Remove

						</div>

			  		</button>

				</div>

				<button class="item ui button large" v-show="matchSet" v-on:click="acceptChallenge">Start Game</button>

			</div>

		</div>
		
		<div class="column" v-show="!matchSet">

			<div class="ui centered card" v-show="!selectingPlayers && !creatingPlayer">

				<div class="content">

					<div class="header">

						<h3>What would you like to do?</h3>

					</div>

				</div>

				<div class="extra content">

					<div class="ui form">

						<button class="ui button medium" v-on:click="createPlayer">
							Add Player
						</button>

						<button class="ui button medium" v-on:click="selectPlayers">
							Select Player
						</button>

					</div>

				</div>

			</div>

			<div class="ui card centered" v-show="!creatingPlayer && selectingPlayers && !matchSet">
				
				<div class="content">
					
					<div class="header">
						
						<h2>Create Your Matchup</h2>

					</div>

				</div>

			</div>

			<button class="ui basic button icon" v-show="selectingPlayers && !creatingPlayer && !matchSet" v-on:click.prevent="createPlayer">

				<i class="ui icon plus circle"></i> Create Player

			</button>

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

					<div class="right floated">

						Difficulty: 

						<span :class="'ui label ' + [player.playerRating < 55 ? 'blue' : player.playerRating < 60 ? 'green' : player.playerRating < 70 ? 'olive' : player.playerRating < 80 ? 'yellow' : player.playerRating < 90 ? 'orange' : player.playerRating <= 100 ? 'red' : 'blue']" data-tooltip="Level of Difficulty based on 'Success Rating'" data-position="bottom center">{{player.playerRating}}%</span>

					</div>

				</div>

			</div>

			<div id="create-player" v-show="creatingPlayer && !matchSet">

				<div class="ui card centered">

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

							<span class="error-message" v-show="creatingPlayerError">You at least need some kind of name</span>

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

	</div>
	
</template>

<script>

	const database = firebase.database();
	const playersRef = database.ref('players');
	const matchesRef = database.ref('matches');

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
				creatingPlayerError: false,
			}
		},
		methods: {
			// Pushes the name to Firebase and empties the field
			addPlayer(player) {

				if ( !this.playerName && !this.playerNickname) {

					this.creatingPlayerError = true;

				} else {

					playersRef.push({
						playerName: this.playerName,
						playerNickname: this.playerNickname,
						playerWins: 0,
						playerLosses: 0,
						playerGamesPlayed: 0,
						playerRating: 100,
					})
	    //     		if(!this.challengerOne){
					// 	this.challengerOne = player;
					// 	this.$set(this.challengers, 'challengerOneName', this.playerName);
					// 	this.$set(this.challengers, 'challengerOneNickname', this.playerNickname);
					// 	this.$set(this.challengers, 'challengerOneRating', this.playerRating);
					// } else if(!this.challengerTwo){
					// 	this.challengerTwo = player;
					// 	this.$set(this.challengers, 'challengerTwoName', this.playerName);
					// 	this.$set(this.challengers, 'challengerTwoNickname', this.playerNickname);
					// 	this.$set(this.challengers, 'challengerTwoRating', this.playerRating);
					// }
					// if (this.challengerOne && this.challengerTwo) {
					// 	this.matchSet = true;
					// }
					this.playerName = '';
	        		this.playerNickname = '';
	        		this.selectingPlayers = true;
	        		this.creatingPlayer = false;
	        		this.creatingPlayerError = false;

	        	}
			},
			acceptChallenge(player){
				matchesRef.push({
					challengerOne: this.challengerOne,
					challengerTwo: this.challengerTwo,
					matchWinner: '',
					matchLooser: '',
					matchStatus: true,
					playerOneScore: 0,
					playerTwoScore: 0,
					totalScore: 0,
				});
				let vm = this
    			setTimeout(function () {
      				vm.$router.push('/current-match')
    			}, 50)
			},
			// Shows "Add Player" form
			createPlayer() {
				this.creatingPlayer = true;
			},
			// Hides "Add Player" form
			closeForm() {
				this.creatingPlayer = false;
				this.creatingPlayerError = false;
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
.column.match-set {
	margin: 0 auto;
}
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
.ui[class*="right labeled"].icon.button {
	padding-left: 1em !important;
}
.error-message {
	box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent;
	background-color: #fff6f6;
    color: #9f3a38;
    display: block;
    margin: 5px 0 10px;
    padding: 10px;
    border-radius: .28571429rem;
}
.ui.label.olive,
.olive-button {
	background: #b5cc18 !important;
	color: white !important;
}
.ui.label.green,
.green-button {
	background: #21ba45 !important;
	color: white !important;
}
.ui.label.yellow,
.yellow-button {
	background: #fbbd08 !important;
	color: white !important;
}
.ui.label.blue,
.blue-button {
	background: #2185d0 !important;
	color: white !important;
}
.ui.label.red,
.red-button {
	background: #db2828 !important;
	color: white !important;
}
.ui.label.orange,
.orange-button {
	background: #f2711c !important;
	color: white !important;
}	
</style>