<template>
	
	<div id="current-match" class="ui container">

		<div v-for="match in currentMatch">

		 	<div v-if="match.matchStatus == true">
					
				<div class="rack ui card centered">

					<div class="content header">

						<h2 v-if="!gameFinished">Game On!</h2>

						<h2 v-else>Winner: {{ currentWinner }}</h2>

					</div>

					<div class="content">

						<div v-for="row in rack" class="row">

							<div v-for="ball in row.balls" v-on:click="shotMade(ball)" :class="['ball ' + ' ' + ball.color + ' ' + ball.style, ball.active ? 'active' : 'inactive', !ball.active, ]">
									
								<span class="number">{{ball.number}}</span>

							</div>

						</div>
						
					</div>

					<div class="extra content">
						<h5 v-if="!gameFinished">Select Your Winner</h5>
						<h4 v-else>Congratulations</h4>
					</div>

					<div class="ui buttons two" v-if="!gameFinished">

						<div class="ui left bottom attached button" v-on:click="challengerOneWin(currentMatch)">
						
							<h4>{{ match.challengerOne.playerName }}</h4>
						
						</div>

						<div class="ui right bottom attached button" v-on:click="challengerTwoWin(currentMatch)">
						
							<h4>{{ match.challengerTwo.playerName }}</h4>
						
						</div>

					</div>

					<div class="ui buttons" v-else>

						<div class="ui bottom attached button blue" v-on:click="saveScores(currentMatch)">
						
							<h4>Save Your Scores</h4>
						
						</div>

					</div>

				</div>

			</div>

			<div class="no-match" v-if="gameFinished">
				<h3>There are no matches</h3>
			</div>

		</div>

	</div>
	
</template>

<script>

	const database = firebase.database();
	const playersRef = database.ref('players');
	const matchesRef = database.ref('matches');

	export default {
		name: 'current-match',
		data() {
			return {
				playerOneScore: 0,
				playerTwoScore: 0,
				currentMatch: [],
				currentWinner: '',
				players: [],
				playerName: '',
				gameFinished: false,
				rack: [{
					balls: [
						{
							number: '1',
							color: 'yellow',
							style: 'solid',
							active: true,
						}
					]
				}, {
					balls: [
						{
							number: '2',
							color: 'blue',
							style: 'solid',
							active: true,
						}, {
							number: '14',
							color: 'green',
							style: 'striped',
							active: true,
						}
					]
				}, {
					balls: [
						{
							number: '3',
							color: 'red',
							style: 'solid',
							active: true,
						}, {
							number: '8',
							color: 'black',
							style: 'solid',
							active: true,
						},
						{
							number: '12',
							color: 'purple',
							style: 'striped',
							active: true,
						}
					]
				}, {
					balls: [
						{
							number: '4',
							color: 'purple',
							style: 'striped',
							active: true,
						}, {
							number: '10',
							color: 'blue',
							style: 'striped',
							active: true,
						}, {
							number: '7',
							color: 'maroon',
							style: 'solid',
							active: true,
						}, {
							number: '15',
							color: 'maroon',
							style: 'striped',
							active: true,
						}
					]
				}, {
					balls: [
						{
							number: '13',
							color: 'orange',
							style: 'striped',
							active: true,
						}, {
							number: '9',
							color: 'yellow',
							style: 'striped',
							active: true,
						}, {
							number: '5',
							color: 'orange',
							style: 'solid',
							active: true,
						}, {
							number: '11',
							color: 'red',
							style: 'striped',
							active: true,
						}, {
							number: '6',
							color: 'green',
							style: 'striped',
							active: true,
						}
					]
				}],
			}
		},
		methods: {
			// Pushes the name to Firebase and empties the field
			shotMade(ball){
				ball.active = !ball.active;
				console.log(this.currentMatch[0]);
			},
			challengerOneWin(currentMatch) {
				// this.editingPlayer = match.challengerOne;
				// this.playerName = match.challengerOne.playerName;
				// this.playerNickname = match.challengerOne.playerNickname;
				// this.playerWins = match.challengerOne.playerWins;
				// this.playerLosses = match.challengerOne.playerLosses;
				console.log(currentMatch[0].challengerOne);
				this.currentWinner = currentMatch[0].challengerOne.playerName;
				this.gameFinished = true;
			},
			challengerTwoWin(currentMatch) {
				// this.editingPlayer = match.challengerTwo;
				// this.playerName = match.challengerTwo.playerName;
				// this.playerNickname = match.challengerTwo.playerNickname;
				// this.playerWins = match.challengerTwo.playerWins;
				// this.playerLosses = match.challengerTwo.playerLosses;
				console.log(currentMatch[0].challengerTwo);
				this.currentWinner = currentMatch[0].challengerTwo.playerName;
				this.gameFinished = true;
			},
			// Save and removes "Player Editing" abilities
			savePlayerEdits() {
				playersRef.child(this.editingPlayer.id).update({
					playerName: this.playerName,
					playerNickname: this.playerNickname,
					playerWins: Math.round(Number(this.playerWins)),
					playerLosses: Math.round(Number(this.playerLosses)),
					playerGamesPlayed: Math.round(Number(this.playerWins)) + Math.round(Number(this.playerLosses)),
				});
			},
			saveScores(currentMatch) {

				currentMatch[0].matchStatus = false;

				// matchesRef.on('child_changed', snapshot => {

				// 	const updatedMatch = this.matches.find(matches => currentMatch[0].id === snapshot.key);

				// 	updatedMatch.matchStatus = snapshot.val().matchStatus;

				// });

				matchesRef.child(this.currentMatch[0].id).update({
					matchStatus: false,
				});
				console.log(matchesRef);

				// matchesRef.child(this.currentMatch[0].id).update({
				// 	matchStatus: false,
				// });

			}
		},
		created() {

			matchesRef.on('child_added', snapshot => this.currentMatch.push({...snapshot.val(), id: snapshot.key}));

			console.log(matchesRef)

			// playersRef.on('child_removed', snapshot => {

			// 	const deletedPlayer = this.players.find(player => player.id === snapshot.key);

			// 	const index = this.players.indexOf(deletedPlayer);

			// 	this.players.splice(index, 1);

			// });

			matchesRef.on('child_changed', snapshot => {

				const updatedMatch = this.match.find(matches => match.id === snapshot.key);

				updatedMatch.matchStatus = false;

			});
		},

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
	.row {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: -7px 0;
	}
	.rack {
		text-align: center;
		padding: 20px;
	}
	.ball {
		width: 50px;
		height: 50px;
		display: inline-block;
		position: relative;
		overflow: hidden;
		border-radius: 100%;
		border: 3px solid black;
		transition: .3s ease all;
	}
	.ball.inactive {
		filter: grayscale(1);
		opacity: .3;
	}
	.number {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #ffffff;
		width: 20px;
		height: 20px;
		border-radius: 100%;
		font-weight: bold;
		line-height: 20px;
		font-size: 12px;
	}
	.striped:after,
	.striped:before {
		background: white;
		position: absolute;
		height: 10px;
		width: 100%;
		left: 0;
		content: "";
		display: block;
	}
	.striped:before {
		top: 0;
	}
	.striped:after {
		bottom: 0;
	}
	.yellow {
		background: #ede972;
	}
	.green {
		background: #99ad35;
	}
	.purple {
		background: #7f5377;
	}
	.blue {
		background: #7abfe4;
	}
	.orange {
		background: #e8b334;
	}
	.black {
		background: #302e2e;
	}
	.red {
		background: #f15a61;
	}
	.maroon {
		background: #9f2a2a;
	}
	.ui.right.attached.button,
	.ui.left.attached.button {
		text-align: center !important;
	}
</style>