<?php


final class WPWordCloud {

	private $pluginName = 'wp-word-cloud';
	private $version = '2.0.0';

	private $error = NULL;

    public function __construct() {

		add_filter( 'get_word_cloud_instance', [ $this, 'get_instance' ] );

	}

    public function get_instance() {

		return $this; // return the object

    }


	/**
	 * Get global settings from settings page and 
	 * overwrite with individual settings from shortcode
	 * 
	 * @param {array} individual_settings Objects containing settings from shortcode
	 * 
	 */

	private function getSettings($individual_settings) {

		$global_settings = [];

		foreach (wp_word_cloud_get_global_settings() as $name => $value) {

			// if global setting is a public one
			// get it's name and the value, which user defines on settings page
			if ($value['hidden'] === FALSE) {
			
				$global_settings[$name] = get_option($name, $value['default']);

			// otherwise set this value to NULL
			} else {

				$global_settings[$name] = NULL;

			}

		}

		// overwrite global settings with given individual settings from shortcode
		$this->settings = shortcode_atts(

			($global_settings), ($individual_settings)
			
		);
		
		switch ($this->settings['text-transform']) {

			case 'uppercase':
				$this->settings['black-list'] = strtoupper($this->settings['black-list']);
				break;

			case 'lowercase':
				$this->settings['black-list'] = strtolower($this->settings['black-list']);
				break;

		}
		// check if required mandatory setting is given in shortcode
		// id needs to be unique, as you can use the shortcode multiple times
		if ($this->settings['id'] == NULL) {

			$this->error = 'No unique id given. Please use parameter `id`.';

		}

		$this->settings['plugin-path'] = plugin_dir_url( __DIR__ );

	}

	private function createDomData() {

		// put settings object into java script object and send it to frontend
		wp_localize_script( "word-cloud", "word_cloud_settings_".$this->settings['id'], $this->settings );

		// send canvas to frontend containing address of the object
		$result = "<div class='word-cloud-container' settings='word_cloud_settings_".$this->settings['id']."' id='word-cloud-container-".$this->settings['id']."'></div>";
		
		return $result;

	}
	
	private function enqueueDepencies() {

		wp_enqueue_style(
			$this->pluginName, 
			plugin_dir_url( __DIR__ ) . 'css/wpWordCloud.css', 
			array(), 
			$this->version, 
			'all' );

		wp_register_script(
			 'word-cloud-renderer',
			 plugin_dir_url( __DIR__ ) . 'lib/wordcloud2.js', 
			 array( 'jquery' )
		 );

		wp_enqueue_script(
			 'word-cloud-settings',
			 plugin_dir_url( __DIR__ ) . 'js/getWordCloudSettings.js',
			 array( 'word-cloud-renderer' )                     
		);

		wp_enqueue_script(
			 'word-cloud',
			 plugin_dir_url( __DIR__ ) . 'js/wpWordCloud.js',
			 array( 'word-cloud-settings' )                     
		);

		if ($this->settings['enable-ocr'] == 1) {

			wp_enqueue_script(
				'tesseract-library',
				plugin_dir_url( __DIR__ ) . 'lib/tesseract.min.js',
				array( 'jquery' )                     
		   );
   
		   wp_enqueue_script(
			'init-ocr',
			plugin_dir_url( __DIR__ ) . 'js/initOcr.js',
			array( 'word-cloud' )

	   		);

		}
	}

	private function countWords($text) {

		$list = [];
		
		$textArray = explode(' ', preg_replace('/\r|\n/', '', $text));

		$blackList = explode(' ', $this->settings['black-list']);

		foreach ($textArray as $word) {

			$cleanWord = preg_replace('/'.$this->settings['ignore-chars'].'/', '', $word);

			if ($this->settings['text-transform'] == 'uppercase') {

				$cleanWord = strtoupper($cleanWord);

			} else if ($this->settings['text-transform'] == 'lowercase') {

				$cleanWord = strtolower($cleanWord);
				
			}

			if (!isset($blackList[$cleanWord])) {

				if (strlen($cleanWord) >= $this->settings['min-word-length']) {

					if (!isset($list[$cleanWord])) {

						$list[$cleanWord] = 1;

					} else {

						$list[$cleanWord]++;

					}

				}

			}
		}

		return $list;

	}

	private function getDataFromSource($source) {

		switch ($this->settings['source-type']) {

			case 'custom-field':

				$this->settings['text'] = get_post_meta(get_the_ID(), $source, TRUE);

				break;
				
			case 'sql':

				// get text from data base using sql 
				global $wpdb;

				$wpdb->show_errors(); 

				$sql = $wpdb->prepare($source);
				
				$data = $wpdb->get_results($sql);

				foreach ($data as $row) {
						
					$wordList[] = [$row->word, $row->count];

				}

				$this->settings['data'] = $wordList;
	
				break;

			case 'url':

				$request = wp_remote_get($source);
				
				$this->settings['text'] = wp_remote_retrieve_body($request);

				break;

			case 'inline':
			default:

				$this->settings['text'] = $source;

				break;

		}

		// if text already contains counted word list,
		// pass it to list array
		// otherwise text will be counted on frontend side
		if ($this->settings['count-words'] != 1) {

			$this->settings['list'] = $this->settings['text'];

			$this->settings['text'] = NULL;

		} 

	}

    public function initWordCloud($individual_settings, $content = NULL) {

		$this->getSettings($individual_settings);

		$this->enqueueDepencies();

		$this->getDataFromSource($content);

		if ($this->error != NULL) {

			return '<p class="word-cloud-warning">'.$this->error.'</p>';

		}
		return $this->createDomData();

		
    }
}
