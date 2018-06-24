<template>
	
		<div id="players">

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

						<a class="ui button mini left floated" href="#" v-show="player !== editingPlayer" v-on:click.prevent="editPlayer(player)">
							<i class="ui icon edit"></i>
							Edit
						</a>

						<a class="ui button mini right floated" href="#" v-show="player !== editingPlayer" v-on:click.prevent="challenge(player)">
							<i class="ui icon heart outline" v-show="player !== isChallenger"></i>
							<i class="ui icon heart red" v-show="player == isChallenger"></i>
							Challenge
						</a>

					</div>

				</div>

			</div>

		</div>

</template>

<script>

	export default {
		props: ['player']
	}

</script>

<style>
	
</style>