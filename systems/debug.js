/* 
* @file Debug SYSTEM
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer system used for debugging all aspects of the game (only useful to developers)
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["./jQuery", "./Crafty"], function(jQuery, Crafty) {
	return debug = {
		registerEvents: function(){ /* jQuery event handlers (for Debug) */
			// Give yourself points
			jQuery("#debug_window").on("click", ".score_submit", function (event){
				var player_id = this.value; // Button click = relevant to player
				jQuery.getJSON("systems/numbers_as_words.json", function(json) {
   					var player_number_as_word = json[player_id]; // so we can use database keys without numbers
   					scores.incrementScore(player_number_as_word);
				});
			});
	
			// Give everyone points
			jQuery("#debug_window").on("click", "#points_incrementer", function (event){
				jQuery.getJSON("systems/numbers_as_words.json", function(json) {
					jQuery.each(json, function(key, player_number_as_word) {
						console.log(player_number_as_word);
   						scores.incrementScore(player_number_as_word); // one, two, three, four, five, six, seven, eight
					});
				});
			});
		/* jQuery event handlers (for Debug) */ },
		initDebugger: function(){
			debug.pointsDebugger();
		},
		pointsDebugger: function(event){
			if (event != null){
				if(jQuery("#debug_toggle > span").hasClass("ui-icon-gear")){
					console.log("Hiding debugging UI");
					jQuery("#debug_toggle > span").removeClass("ui-icon-gear")
						.addClass("ui-icon-wrench");
				}
				else{
					console.log("Showing debugging UI");
					jQuery("#debug_toggle > span").removeClass("ui-icon-wrench")
						.addClass("ui-icon-gear");
				}
			}
			
			// Hide or show manual score incrementers
			jQuery(".score_submit").toggle();
			// Hide or show global manual score incrementer
			jQuery("#score_debug_panel").toggle();
			// Hide or show Developer hints
			jQuery(".devhint").toggle();
		}
	}
});