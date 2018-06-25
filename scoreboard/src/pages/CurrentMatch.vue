<template>
	
	<div id="current-match" class="ui container">

		<div v-for="match in currentMatch">

		 	<div v-if="match.matchStatus == true">
					
				<div class="rack ui card centered">

					<div class="content header">

						<h2>Game On!</h2>

					</div>

					<div class="content">

						<div v-for="row in rack" class="row">

							<div v-for="ball in row.balls" v-on:click="shotMade(ball)" :class="['ball ' + ' ' + ball.color + ' ' + ball.style, ball.active ? 'active' : 'inactive', !ball.active, ]">
									
								<span class="number">{{ball.number}}</span>

							</div>

						</div>
						
					</div>

					<div class="extra content">
						<h5>Select Your Winner</h5>
					</div>

					<div v-for="(challenger, index) in match.matchChallengers">

						<div class="ui bottom attached button">
						
							<h4>{{ challenger.playerName }}</h4>
						
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
		name: 'current-match',
		data() {
			return {
				playerOneScore: 0,
				playerTwoScore: 0,
				currentMatch: [],
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
				rack: [{
					balls: [
						{
							number: '1',
							color: 'yellow',
							style: 'solid',
							active: true,
							player: '',
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
							player: '',
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
				ball.active = !ball.active
				

			},
		},
		created() {

			matchesRef.on('child_added', snapshot => this.currentMatch.push({...snapshot.val(), id: snapshot.key}));

			// playersRef.on('child_removed', snapshot => {

			// 	const deletedPlayer = this.players.find(player => player.id === snapshot.key);

			// 	const index = this.players.indexOf(deletedPlayer);

			// 	this.players.splice(index, 1);

			// });

			matchesRef.on('child_changed', snapshot => {

				const updatedMatch = this.currentMatch.find(match => player.id === snapshot.key);

				updatedMatch.matchStatus = snapshot.val().matchStatus;

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
</style>