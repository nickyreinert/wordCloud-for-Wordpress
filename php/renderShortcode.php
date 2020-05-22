<?php


final class WPWordCloud {

	private $pluginName = 'word-cloud';
	private $version = '2.0.0';
	private $demoData = 'Lorem Ipsum';

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
			plugin_dir_url( __DIR__ ) . 'css/word-cloud.css', 
			array(), 
			$this->version, 
			'all' );

		wp_register_script(
			 'wordcloud-library',
			 plugin_dir_url( __DIR__ ) . 'js/wordcloud2.js', 
			 array( 'jquery' )
		 );

		wp_enqueue_script(
			 'word-cloud',
			 plugin_dir_url( __DIR__ ) . 'js/word-cloud.js',
			 array( 'wordcloud-library' )                     
		);

	}

	private function countWords($words) {

		return $words;

	}

	private function getDataFromSource() {

		// if user wants to use demo text
		// move demo text to actual text property

		if ($this->settings['use-demo-text'] == TRUE) {

			if ($this->settings['count-words'] == TRUE) {

				$this->settings['words'] = $this->countWords($this->settings['demo-text']);

			} else {

				$this->settings['text'] = $this->settings['demo-text'];

			}

			// save space
			$this->settings['demo-text'] = NULL;

		// otherwise get text from given source
		} else {

			switch ($this->settings['source']) {

				case 'edit-field':
					// get text from text field on frontend
					// only listing this for further reference
					// nothing to do here
					break;
	
				case 'custom-field':
					// get text from custom field on page / post
					$customFieldId = $this->settings['source-definition'];
	
					$customFieldContent = get_post_meta(get_the_ID(), $customFieldId, TRUE);

					if ($this->settings['count-words'] == 1) {

						$this->settings['words'] = $this->countWords($customFieldContent);

					} else {

						$this->settings['words'] = $customFieldContent;

					}

					break;
					
				case 'sql':

					// get text from data base using sql 
					global $wpdb;
	
					$wpdb->show_errors(); 
	
					$sql = $wpdb->prepare($this->settings['query']);
					
					$data = $wpdb->get_results($sql);

					foreach ($data as $row) {
							
						$wordList[] = [$row->word, $row->count];
	
					}
		
					break;
			}

		}

	}

    public function initWordCloud($individual_settings, $content = NULL) {

		$this->getSettings($individual_settings);

		$this->enqueueDepencies();

		$this->getDataFromSource();

		if ($this->error != NULL) {

			return '<p class="word-cloud-warning">'.$this->error.'</p>';

		}

		return $this->createDomData();

    }
}
