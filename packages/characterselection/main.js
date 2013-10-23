/* 
* @file Character Selection PACKAGE 
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer package used for selecting a character to play as
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["hgn!packages/characterselection/partial", "i18n!packages/characterselection/nls/strings", "./Config", "./Lang", "./jQuery", "./Crafty"], function(view, nls, Config, Lang, jQuery, Crafty) {
	return characterselection = {
			
		// Partial loading location	
		partial_block_element: 'characterselection_partial',
		
		// Translations
		trans: {},

		/* Load this package */
		init: function(){
			
			// Load translations
			characterselection.trans = Lang.getTrans(nls);
			
			// Load the package onto current web-page
			characterselection.loadDOM();
		},
		
		/* Append the HTML for this package to the DOM */
		loadDOM: function() {
			
			// Load up list of characters to choose from
			jQuery.getJSON("packages/characterselection/info/characters_advanced.json", function(data){
				
				// Append language strings to JSON data source
				data.trans = characterselection.trans;

				// Load view
				data.content_pack = Config.get('resources.directories.multimedia.root') + Config.get('content_pack.characters');
       			document.getElementById(characterselection.partial_block_element).innerHTML = view(data);
 				
 				jQuery(document).ready(function() {
 					// Setup UI
 					characterselection.selectionScreen();
 					// Setup UI handlers
 					characterselection.registerEvents();
 					console.log("Character Selection PACKAGE loaded");
				}); 
			});
		},
		
		/* Use a character identifier to get character id */
		getCharacterId: function(character) {

			// TODO: Find more efficient way to do this
			var character_id = "";
			
			// Set ASYNC AJAX to false
			jQuery.ajaxSetup({
				async: false
			});
			
			// Load up list of characters to choose from
			jQuery.getJSON("packages/characterselection/info/inverse.json", function(data){

				character_id = data[character];
			});
			
			// Set ASYNC AJAX back to true
			jQuery.ajaxSetup({
				async: true
			});
			
			return character_id;
		},
		
		/* Get information for a particular character */
		getCharacterById: function(character_id) {

			var character_info = {};
			var character_index = character_id - 1;
			
			// Set ASYNC AJAX to false
			jQuery.ajaxSetup({
				async: false
			});
			
			// Load up list of characters to choose from
			jQuery.getJSON("packages/characterselection/info/characters_advanced.json", function(data){

				character_info = data.characters[character_index];
			});
			
			// Set ASYNC AJAX back to true
			jQuery.ajaxSetup({
				async: true
			});
			
			return character_info;
		},
		
		// Deactivate package
		deactivate: function(){

			jQuery("#"+characterselection.partial_block_element).remove();
		},
		
		registerEvents: function(){ /* jQuery event handlers (for Character Selection) */
			
			// New character select method
			jQuery("#characterselection_partial").on("click", ".char_select", function(event) {

				var selected_char = jQuery('.item.active').data('slide-number');
				characterselection.selectCharacter(selected_char);
			});
		},
		
		registerSounds: function(){
			// TODO: Find appropriate sound and register then add case function to play
			//Crafty.audio.play("char_hover",1,0.2);
		},
		
		/* Produces the UI for character selection screen */
		selectionScreen: function(){
			jQuery('#myCarousel').carousel({
				interval: 5000
			});
 
			jQuery('#carousel-text').html(jQuery('#slide-content-1').html());
 
			// Handles the carousel thumbnails
			jQuery('[id^=carousel-selector-]').click( function(){
				var id_selector = jQuery(this).attr("id");
				var id = id_selector.substr(id_selector.length -1);
				var id = parseInt(id);
				jQuery('#myCarousel').carousel(id -1);
			});

			// When the carousel slides, auto update the text
			jQuery('#myCarousel').on('slid', function (e) {
				var id = jQuery('.item.active').data('slide-number');
				jQuery('#carousel-text').html(jQuery('#slide-content-'+id).html());
			});	
		},
		
		selectCharacter: function(selected_char) {
			var selected_element = jQuery('#slide-content-'+selected_char+' > .thumbnail > .caption > .char_select');
			
			// Cleanup old selections
			jQuery('.char_select')
				.removeClass("btn-success")
				.addClass("btn-primary")
				.html("<span>Select</span>");
		
			// Transform the button
			jQuery(selected_element)
				.removeClass("btn-primary")
				.addClass("btn-success")
				.html("<span>Selected</span>");
				
			// Transfer the stored value
			jQuery("#use_picked_char")
				.removeAttr('disabled')
				.val(jQuery(selected_element).val());
				
			// Update carousel
			jQuery('#carousel-text').html(jQuery('#slide-content-'+selected_char).html());
		},
		
		/* Get character image filename (with full directory path) based on character name and pose */
		getCharacterImage: function(character_name, pose) {
			
			if (pose === undefined) {
				pose = Config.get('resources.sprites.sprite_filename_suffix');
			} else {
				pose += ")_" + pose + ".png";
			}
			
			// Main image directory
			var image_dir = Config.get('resources.directories.multimedia.root') + Config.get('content_pack.characters') + "/images/";
			
			// Character images directory 
			var characters_sprites_dir = image_dir + "characters/";
			
			// Build filename based on character name and pose
			var character_sprite = characters_sprites_dir + Config.get('resources.sprites.sprite_filename_prefix') + character_name + pose;
			
			return character_sprite;
		}
	}
});