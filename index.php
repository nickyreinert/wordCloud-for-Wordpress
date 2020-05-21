<?php

/**
 * @link              https://www.nickyreinert.de
 * @since             1.0.0
 * @package           wp-word-cloud
 *
 * @wordpress-plugin
 * Plugin Name:       WP Word-Cloud
 * Plugin URI:        https://www.nickyreinert.de/word-cloud
 * Description:       Draw a word cloud from custom words
 * Version:           1.1.0
 * Author:            Nicky Reinert
 * Author URI:        https://www.nickyreinert.de
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-word-cloud
 * Domain Path:       /languages
 */

// if this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Adding the shortcode
 * @since    1.0.0
 */

	require_once('php/renderShortcode.php');

	require_once('php/initSettings.php');
	
	add_shortcode('wp-word-cloud',[new WPWordCloud, 'initWordCloud']);


/**
*	log function to send debug information to browser console
*
*/

function debug_wp_word_cloud($message = NULL, $priority = 1 ){

	// on settings page, debug level will be defined
	// MAX_DEBUG_PRIORITY = 0 - no messages at all
	// MAX_DEBUG_PRIORITY = 1 - errors & warnings only
	// MAX_DEBUG_PRIORITY = 2 - every piece of information

	if ($priority >= 1) {

		$message = json_encode($message, JSON_PRETTY_PRINT);

		echo "<script>console.log('WORDCLOUD|DEBUG: ' + ".$message.");</script>";

	}
}
