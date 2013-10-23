/* 
* @file Profile PACKAGE
* @author Wade Penistone (Truemedia)
* @overview FIRST TEST PACKAGE IMPLEMENTING Hogan + JSON + Mustache templating
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["hgn!packages/profile/partial", "i18n!packages/profile/nls/strings", "./Config", "./Lang", "jQuery", "KO", "./characterselection.PKG"], function(view, nls, Config, Lang, jQuery, ko) {
	return profile = {
			
		// Partial loading location	
		partial_block_element: 'profile_partial',
		
		// Translations
		trans: {},
			
		/* Load this package */
		init: function(characterselected) {
	 		
	 		// Load translations
			profile.trans = Lang.getTrans(nls);
			
			// Load the package onto current web-page
			profile.loadDOM(characterselected);
		},
		
		/* Append the HTML for this package to the DOM */
		loadDOM: function(characterselected) {
			
			// Get data
			jQuery.getJSON("packages/profile/data.json", function(data){
				
				// Append content pack
				data.content_pack = Config.get('resources.directories.multimedia.root') + Config.get('content_pack.characters');

				// Get character info
				var character_id = characterselection.getCharacterId(characterselected);
				data.character = characterselection.getCharacterById(character_id);
				
				// Append language strings to JSON data source
				data.trans = profile.trans;
			
				// Load view
       			document.getElementById(profile.partial_block_element).innerHTML = view(data);
       			
       			// Bind ViewModel collection
       			profile.registerBindings();
			});
		},

		/* Register ViewModel with DOM elements */
		registerBindings: function() {

			ko.applyBindings(new profile.ViewModel(), document.getElementById(profile.partial_block_element));
		},
		
		/* ViewModel for this package */
		ViewModel: function() {

			this.loggedin = ko.observable(false);
			this.username = ko.observable("");
			this.loginAsUser = function(){
				// Login
				this.loggedin(true);
				// TODO: Make this the authentication entry point and cut-off
				this.username(profile.loginAsUser(this.username()));
			};
			this.loginAsGuest = function(){
				// Login
				this.loggedin(true);
				// Create a guest username, and use
				this.username(profile.loginAsGuest());
			};
		},

		/* Return username as Guest with random 8 digit number appended */
		loginAsGuest: function() {

			var guestname = "Guest";
			var digits = 8;
			for (var i=0; i<=digits; i++) {
				guestname += Math.floor((Math.random()*10)+1);
			}
			return(guestname);
		},

		/* Return username from input (this will validate user in future) */
		loginAsUser: function(username) {

			return(username);
		}
	}
});