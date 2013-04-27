/* 
* @file Maps SYSTEM
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer system used for loading maps (certain levels of game modes)
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["./jQuery", "./Crafty"], function(jQuery, Crafty) {
	return {
		generateWorld: function(){
			// Sprite Map for charachters
			// TODO: Extract in-use content pack from config
			var contentpack = "default";
			
			/* Turn on to enable proto floor (useful for debugging)
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/flooring/proto_floor.png", {
   				floor_tile: [0, 0]
			}); */
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/flooring/default_floor.png", {
   				floor_tile: [0, 0]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_back.png", {
   				wall_back_tile: [0, 0]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/invisible_wall.png", {
   				invisible_wall: [0, 0]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_left.png", {
   				wall_left_tile: [0, 0]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_right.png", {
   				wall_right_tile: [0, 0]
			});
			Crafty.sprite(256, "multimedia/"+contentpack+"-contentpack/images/textures/doors/doorless.png", {
   				doorless: [0, 0]
			});
			Crafty.sprite(24, "multimedia/"+contentpack+"-contentpack/images/textures/walls/proto_wall_front.png", {
   				wall_front_tile: [0, 0]
			});
	
			var map_size_x = resolution_width;
			var map_size_y = resolution_height;
			var flooring_size_per_unit_x = 24;
			var flooring_size_per_unit_y = 24;
			var vert_wall_offset = 4;
			
			for (i_x = 0; i_x < (map_size_x / flooring_size_per_unit_x); i_x++){
			
				// Draw the back walls
				Crafty.e("2D, DOM, wall_left, wall_back_tile").attr({x: i_x * flooring_size_per_unit_x, y: 0, z: 2, w: 24, h: 256});
				// .. and make back wall limits
				Crafty.e("2D, DOM, wall_left, solid, invisible_wall").attr({x: i_x * flooring_size_per_unit_x, y: flooring_size_per_unit_y, z: 2, w: 24, h: 24});
				
				for (i_y = 0; i_y < (map_size_y / flooring_size_per_unit_y); i_y++){
					/* Map (draw 24x24 tile to file 480x480 space (4000 tiles) */
					// Draw the floors
					Crafty.e("2D, DOM, wall_left, floor_tile").attr({x: i_x * flooring_size_per_unit_x, y: i_y * flooring_size_per_unit_y, z: 1});
					// Draw the side walls
					if(i_x == 0){
						Crafty.e("2D, DOM, wall_left, solid, wall_left_tile").attr({y: (i_y * flooring_size_per_unit_y) + vert_wall_offset, x: 0, z: 2, w: 24, h: 256});
					}
					if(i_x == 53){
						Crafty.e("2D, DOM, wall_left, solid, wall_right_tile").attr({y: (i_y * flooring_size_per_unit_y) + vert_wall_offset, x: (52 * flooring_size_per_unit_x) + 10, z: 2, w: 24, h: 256});
					}
				}
				
				// Draw back walls
				Crafty.e("2D, DOM, wall_left, solid, wall_front_tile").attr({x: i_x * flooring_size_per_unit_x, y: (i_y * flooring_size_per_unit_y) - 4, z: 3, w: 24, h: 4});
			}
			/* Spawn point */
			Crafty.e("2D, DOM, wall_left, doorless")
					.attr({x: 35, y: 0, z: 4});
			
			/* Decorations */
			var background_layer = 4; // TODO: Move this repeated variable into config
			
			// Weapons
			Crafty.e("2D, DOM, wall_left, gun1")
				.attr({x: 1050, y: 220, z: background_layer, rotation: -55});
			Crafty.e("2D, DOM, wall_left, gun2")
					.attr({x: 1170, y: 100, z: background_layer, rotation: 45});

			// Bunch of sharp swords (hurts when you step on them
			Crafty.e("2D, DOM, wall_left, katana, Tween, Text")
					.attr({x: 55, y: 625, z: 2, rotation: -55});
			Crafty.e("2D, DOM, wall_left, katana, Tween, Text")
					.attr({x: 120, y: 540, z: 3, rotation: 10});
			Crafty.e("2D, DOM, wall_left, katana, Tween, Text")
					.attr({x: 250, y: 600, z: 4, rotation: 100});
			Crafty.e("2D, DOM, wall_left, katana, Tween, Text")
					.attr({x: 155, y: 760, z: 5, rotation: 210});
		}
	}
});