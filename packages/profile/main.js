/**
 * @file Profile PACKAGE
 * @author Wade Penistone (Truemedia)
 * @overview Core Regeneration Primer package which allows displaying and setting of information specific to a user
 * @copyright Wade Penistone 2014
 * @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
 * Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
 * Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
 */
define([
	"stache!./views/partial", "i18n!./nls/strings", "Config", "Lang", "Package", "Session", "Bootstrap", "Backbone", "KO"
], function(template, nls, Config, Lang, Package, Session, jQuery, Backbone, ko) {
	/** 
     * Profile package
     * @namespace profile
     */
	return profile = {
		
		// Translations
		trans: {},
			
		/* Load this package */
		init: function()
		{	
			// Register package
			Package.register('profile');
	 		
	 		// Load translations
			this.trans = Lang.getTrans(nls);
		},
		
		/* Autoloading hook */
        load: function(element, options)
        {	
        	// Load the package onto current web-page
	    	this.init();
			new this.view({el: element});
        },

        /* Data collection */
	    collection: Backbone.Collection.extend({
	        url: 'packages/profile/data.json',
	        parse: function(data) { return data; }
	    }),

		 /* Append the HTML for this package to the DOM */
	    view: Backbone.View.extend({
	        initialize: function()
	        {
	            this.collection = new profile.collection({model: Backbone.Model.extend()});
	            this.render();
	        },
	        render: function()
	        {
	            // Load package stored data
	        	var self = this;
	            this.collection.fetch().done( function() {
	            		
	            	// Compose data for view
	            	var data = {
	            		items: self.collection.toJSON(),
	            		trans: profile.trans,
	            		content_pack: Config.get('resources.directories.multimedia.root') + Config.get('content_pack.characters'),
	            		session: JSON.stringify({
	            			character: Session.get('character'),
	            			map: Session.get('map')
	            		})
	            	};
	    				
	            	// Render content
	            	self.$el.html( template(data) );

	            	// Register view model
	            	ko.applyBindings(new profile.ViewModel(), this.el);
	            });
	        }
	    }),
		
		/* ViewModel for this package */
		ViewModel: function()
		{
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
		loginAsGuest: function()
		{
			var guestname = "Guest";
			var digits = 8;
			for (var i=0; i<=digits; i++) {
				guestname += Math.floor((Math.random()*10)+1);
			}
			return(guestname);
		},

		/* Return username from input (this will validate user in future) */
		loginAsUser: function(username)
		{
			return(username);
		}
	}
});