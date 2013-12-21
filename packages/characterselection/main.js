/* 
* @file Character Selection PACKAGE 
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer package used for selecting a character to play as
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define([
	"stache!./views/partial", "i18n!./nls/strings", "App", "Config", "Lang", "Package", "Session", "jQuery", "Backbone"
], function(template, nls, App, Config, Lang, Package, Session, jQuery, Backbone) {
	return characterselection = {
		
		// Translations
		trans: {},

		/* Initial load-up procedure if first time package is loaded */
		init: function(){
			
			// Register package
			Package.register('characterselection');
			
			// Load translations
			this.trans = Lang.getTrans(nls);
		},
		
		/* Autoloading hook */
        load: function(element, options) {
        	
        	// Load the package onto current web-page
	    	this.init();
			new this.view({el: element});
        },

        /* Autoloader terminate method */
        unload: function() {

        },
        
        /* Data collection */
	    collection: Backbone.Collection.extend({

	        model: Backbone.Model.extend(),
	        url: 'packages/characterselection/info/characters_advanced.json',
	        parse: function(data) { return data.characters; }
	    }),
	    
	    /* Append the HTML for this package to the DOM */
	    view: Backbone.View.extend({
	        	
	        initialize: function() {
	            	
	            this.collection = new characterselection.collection();
	            this.render();
	        },

	        render: function() {

	            // Load package stored data
	        	var self = this;
	            this.collection.fetch().done( function() {
	            		
	            	// Compose data for view
	            	var data = {
	            		items: self.collection.toJSON(),
	            		trans: characterselection.trans,
	            		content_pack: Config.get('resources.directories.multimedia.root') + Config.get('content_pack.characters')
	            	}
	    				
	            	// Render content
	            	self.$el.html( template(data) );
	            	self.afterRender();
	            });
	        },
	        afterRender: function() {
	        	characterselection.selectionScreen();
	        	characterselection.registerEvents();
	        }
	    }),
		
		/* Get all characters and all their associated data */
		getCharacters: function() {
			
			// Set ASYNC AJAX to false
			jQuery.ajaxSetup({
				async: false
			});
			
			// Load up list of characters to choose from
			jQuery.getJSON("packages/characterselection/info/characters_advanced.json", function(data){
				characters = data.characters;
			});
			
			// Set ASYNC AJAX back to true
			jQuery.ajaxSetup({
				async: true
			});
			
			// Send back character data
			return characters;
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
		deactivate: function() {

			jQuery("[data-package='characterselection']").remove();
		},
		
		registerEvents: function() { /* jQuery event handlers (for Character Selection) */
			
			// New character select method
			jQuery("[data-package='characterselection']").on("click", ".char_select", function(event) {

				var element = $(this);
				characterselection.selectCharacter(element);
			});
			
			// CHARACTER SELECTION EVENT
			jQuery("[data-package='characterselection']").on("click", ".start_session", function(event){

				// Specific character chosen
				if (jQuery(this).attr("id") == "use_picked_char") {
					console.log("Using players choosen character: "+this.value);
					Session.put('character', this.value);
				}
				
				// Choose a random character for the player
				else {
					console.log("Using random character");
					jQuery.getJSON("packages/characterselection/info/characters_advanced.json", function(all_characters_info) {
						number_of_chars = all_characters_info.characters.length - 1;
						var random_char_id = Math.floor((Math.random()*number_of_chars)+1);
						var random_char_name = all_characters_info.characters[random_char_id].identifierReference;
						Session.put('character', random_char_name);
					});
				}
				
				// Deactivate selection screen
				characterselection.deactivate();
				
				// Activate next step
			});
		},
		
		/* Produces the UI for character selection screen */
		selectionScreen: function() {
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
		
		selectCharacter: function(element) {
			
			// Cleanup old selections
			jQuery('.char_select')
				.removeClass("btn-success")
				.addClass("btn-primary")
				.html("<span>Select</span>");
		
			// Transform the button
			jQuery(element)
				.removeClass("btn-primary")
				.addClass("btn-success")
				.html("<span>Selected</span>");
				
			// Transfer the stored value
			jQuery("#use_picked_char")
				.removeAttr('disabled')
				.val(jQuery(element).val());
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