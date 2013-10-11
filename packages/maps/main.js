/* 
* @file Maps PACKAGE
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer package used for loading maps (certain levels of game modes)
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["hgn!packages/maps/partial", "./jQuery", "./Crafty", "./Config", "./init.PKG"], function(view, jQuery, Crafty, Config, init) {
	return maps = {
		
		layers: 1,
		
		// Partial loading location	
		partial_block_element: 'maps_partial',
	
		/* Load the package */
		init: function() {

			maps.loadDOM();
			console.log("Maps PACKAGE loaded");
		},
		
		/* Show map selection (based on a slightly modified design of this bootsnipp: http://bootsnipp.com/snipps/crowdfunding-grid) */
		loadDOM: function() {
			
			// Load up list of maps to choose from
			jQuery.getJSON("packages/maps/data.json", function(data){
			
				// Load view
				document.getElementById(maps.partial_block_element).innerHTML = view(data);
				
				// Register events
				maps.registerEvents();
			});
		},
		
		/* Register jQuery event handlers */
		registerEvents: function() {
			
			// Mouse over animation for map selection
			jQuery("#"+maps.partial_block_element).on("mouseover", ".map_select", function(event) {

				var enabled = !jQuery(this).hasClass("disabled");
				if (enabled) {
					jQuery(this).addClass("btn-success");
				}
				else {
					jQuery(this).children("span").html("Not available");
				}
			});

			// Mouse leave animation for map selection
			jQuery("#"+maps.partial_block_element).on("mouseleave", ".map_select", function(event) {

				var enabled = !jQuery(this).hasClass("disabled");
				if (enabled) {
					jQuery(this).removeClass("btn-success");
				}
				else {
					jQuery(this).children("span").html("Select map");
				}
			});
			
			// Map has been choosen
			jQuery("#"+maps.partial_block_element).on("click", ".map_select", function(event) {

				var map = jQuery(this).val();
				var enabled = !jQuery(this).hasClass("disabled");
				
				// Map is enabled, will now load
				if (enabled) {
					console.log("Map has been choosen: "+map);
				}
			});
		},
			
		generateWorld: function() {

			var render_engine = init.getRenderEngine(); // TODO: In future get init to set in config, then pull from config instead
		
			// Sprite Map for charachters
			var contentpack = Config.get('game.content_pack', 'default');
			
			/* Comment in to enable proto floor (useful for debugging) */
			/*Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/flooring/proto_floor.png", {
   				protofloor_tile: [0, 0]
			});*/
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/flooring/default_floor.png", {
   				floor_tile: [0, 0]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_back.png", {
   				wall_back_tile: [0, 0, 24, 256]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/invisible_wall.png", {
   				invisible_wall: [0, 0]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_left.png", {
   				wall_left_tile: [0, 0, 24, 256]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_right.png", {
   				wall_right_tile: [0, 0, 24, 256]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/doors/doorless.png", {
   				doorless: [0, 0, 128, 256]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/materials/wood.png", {
   				wood: [0, 0, 128, 256]
			});
			Crafty.sprite(1, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_front.png", {
   				wall_front_tile: [0, 0, 24, 4]
			});
	
			var resolution = Config.get('game.resolution');
			var map_size_x = resolution.width;
			var map_size_y = resolution.height;
			var flooring_size_per_unit_x = 24;
			var flooring_size_per_unit_y = 24;
			var vert_wall_offset = 4;
			
			/* Primary layers */
			for (i_x = 0; i_x < (map_size_x / flooring_size_per_unit_x); i_x++){
				// Draw the back walls 
				Crafty.e("2D, "+render_engine+", wall_left, wall_back_tile").attr({x: i_x * flooring_size_per_unit_x, y: 0, z: (maps.layers) });
				// .. and windows 
				if(i_x > 7 && i_x < 51){
					Crafty.e("2D, "+render_engine+", wall_left, small_window").attr({x: i_x * flooring_size_per_unit_x, y: 4, z: (maps.layers) });
				}
				else{
					Crafty.e("2D, "+render_engine+", wall_left, top_border").attr({x: i_x * flooring_size_per_unit_x, y: 4, z: (maps.layers) });
				}
				
				// .. and make back wall limits
				Crafty.e("2D, "+render_engine+", wall_left, solid, invisible_wall").attr({x: i_x * flooring_size_per_unit_x, y: flooring_size_per_unit_y, z: (maps.layers), w: 24, h: 24});
				
				for (i_y = 0; i_y < (map_size_y / flooring_size_per_unit_y); i_y++){
					/* Map (draw 24x24 tile to file 480x480 space (4000 tiles) */
					// Draw the floors
					Crafty.e("2D, "+render_engine+", wall_left, floor_tile").attr({x: i_x * flooring_size_per_unit_x, y: i_y * flooring_size_per_unit_y, z: (maps.layers - 1) });
					// Draw the side walls
					if(i_x == 0){
						Crafty.e("2D, "+render_engine+", wall_left, solid, wall_left_tile").attr({y: (i_y * flooring_size_per_unit_y) + vert_wall_offset, x: 0, z: (maps.layers), w: 24, h: 256});
					}
					if(i_x == 53){
						Crafty.e("2D, "+render_engine+", wall_left, solid, wall_right_tile").attr({y: (i_y * flooring_size_per_unit_y) + vert_wall_offset, x: (52 * flooring_size_per_unit_x) + 8, z: (maps.layers), w: 24, h: 256});
					}
				}
				
				// Draw back walls
				Crafty.e("2D, "+render_engine+", wall_left, solid, wall_front_tile").attr({x: i_x * flooring_size_per_unit_x, y: (i_y * flooring_size_per_unit_y) - 4, z: (maps.layers + 1), w: 24, h: 4});
			}
			
			/* Secondary layers */
			maps.layers += 2;
			
			// Spawn point
			Crafty.e("2D, "+render_engine+", wall_left, doorless")
				.attr({x: 35, y: 0, z: (maps.layers) });
			// ..with Baricades 
			// TODO: Make baricades a game mechanic, and get rid of this preset
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:20, z: (maps.layers), rotation: 10});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 40, y:40, z: (maps.layers), rotation: -10});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:60, z: (maps.layers), rotation: 15});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:85, z: (maps.layers) });
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 41, y:107, z: (maps.layers) });
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 48, y:128, z: (maps.layers), rotation: 16});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 48, y:137, z: (maps.layers), rotation: -16});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:145, z: (maps.layers), rotation: 10});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 40, y:165, z: (maps.layers), rotation: -10});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:185, z: (maps.layers), rotation: 15});
			Crafty.e("2D, "+render_engine+", wall_left, wood")
				.attr({x: 45, y:210, z: (maps.layers) });
			
			// DECORATIONS
			// Weapons
			Crafty.e("2D, "+render_engine+", wall_left, gun1")
				.attr({x: 1050, y: 220, z: (maps.layers) , rotation: -55});
			Crafty.e("2D, "+render_engine+", gun2")
				.attr({x: 1170, y: 100, z: (maps.layers), rotation: 45});
			// Random mags
			Crafty.e("2D, "+render_engine+", mag")
				.attr({x: 1220, y: 270, z: (maps.layers + 1), rotation: 45});
			Crafty.e("2D, "+render_engine+", mag")
				.attr({x: 1240, y: 260, z: (maps.layers + 1), rotation: 80});

			// Bunch of sharp swords (hurts when you step on them)
			Crafty.e("2D, "+render_engine+", wall_left, katana, Tween")
					.attr({x: 55, y: 625, z: (maps.layers - 2), rotation: -55});
			Crafty.e("2D, "+render_engine+", wall_left, katana, Tween")
					.attr({x: 120, y: 540, z: (maps.layers - 1), rotation: 10});
			Crafty.e("2D, "+render_engine+", wall_left, katana, Tween")
					.attr({x: 250, y: 600, z: (maps.layers), rotation: 100});
			Crafty.e("2D, "+render_engine+", wall_left, katana, Tween")
					.attr({x: 155, y: 760, z: (maps.layers + 1), rotation: 210});
					
			// Tools
			Crafty.e("2D, "+render_engine+", axe")
					.attr({x: 345, y: 215, z: (maps.layers + 1), rotation: 26});
		}
	}
});