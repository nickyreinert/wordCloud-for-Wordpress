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

	private function getSettings($individual_settings) {

		// get default value aka global value from settings page
		$global_settings = [];

		foreach (wp_word_cloud_get_global_settings() as $name => $value) {

			if ($value['hidden'] === FALSE) {
			
				$global_settings[$name] = get_option($name, $value['default']);

			} else {

				$global_settings[$name] = 'secret';

			}
		}

		// overwrite global settings with given individual settings in post / page
		$this->settings = shortcode_atts(

			($global_settings), ($individual_settings)
			
		);
		
		if ($this->settings['id'] == NULL) {

			$this->error = 'No unique id given. Please use parameter `id`.';

		}

	}

	private function getWordList() {

		$data = NULL;
		$wordList = array();
		
		switch ($this->options['source']) {

			
			/**
			 * Edit field in frontend 
			 * @since    1.1.0
			 */
			// we dont need to extract the word list from somewhere
			// calculation will be done at frontend
			case 'edit-field':
				
				break;

			case 'custom-field':

				$customFieldId = $this->options['source-id'];

				$customFieldContentArray = explode(PHP_EOL, get_post_meta(get_the_ID(), $customFieldId, TRUE));

				if (sizeof($customFieldContentArray) <= 1 AND $customFieldContentArray[0] == '') {

					$this->error = '<p class="word-cloud--warning">Could not read data from custom-field `'.$this->options['custom-field-name'].'`!</p>';

				}
				
				foreach ($customFieldContentArray as $row) {
					
					$wordCount = explode(",", $row);
					
					$wordList[] = array('xValue' => trim($wordCount[0], "\r\n "), 'yValue' => trim($wordCount[1], "\r\n "));
					
				}

				break;
				
			case 'sql':
			
				global $wpdb;

				$wpdb->show_errors(); 

				$sql = $wpdb->prepare($this->options['query']);
				
				$data = $wpdb->get_results($sql);
				
				foreach ($data as $row) {
						
					$wordList[] = array('xValue' => trim($row->word, "\r\n "), 'yValue' => trim($row->count, "\r\n "));

				}
	
				break;
		}

		$this->wordList = $wordList;
		
	}

	private function createDomData() {

		// send three things to the frontend
		// - settings (settings from short code)
		// - words (contains words and occurences)
		// - text (contains raw text, currently only for demo purposes)

		// $result = "<foobar></foobar><script type='text/javascript'>".
		// 	"wp_word_cloud_data.".$this->settings['id'].".settings = ".json_encode($this->settings).";".PHP_EOL.
		// 	"wp_word_cloud_data.".$this->settings['id'].".words = ".json_encode($this->words).";".PHP_EOL.
		// "</script>";

		// put settings into java script object and send it to frontend
		wp_localize_script( "word-cloud", "word_cloud_settings_".$this->settings['id'], $this->settings );

		// send canvas to frontend containing address of the object
		$result = "<canvas class='word-cloud' settings='word_cloud_settings_".$this->settings['id']."' id='word-cloud-".$this->settings['id']."'></canvas>".PHP_EOL;

		// $result .= "<canvas style='width: 100%;' class='wordCloud' id='".$this->options['target-id']."' width='".$this->options['canvas-width']."' height='".$this->options['canvas-height']."'></canvas>".PHP_EOL;

		// $result .= "<div id='".$this->options['target-id']."-container' class='wordCloud-container'>".PHP_EOL;
		
		// $result .= "var wc_wordList_".$this->options['target-id']." = ".json_encode($this->wordList).";".PHP_EOL;
		// $result .= "var wc_options_".$this->options['target-id']." = ".json_encode($this->options).";".PHP_EOL;

		// if ($this->options['demo-data'] == TRUE) {

		// 	$result .= "var wc_text_".$this->options['target-id']." = ".json_encode($this->demoData).";";

		// }

		// $result .= "</script>";
		// $result .= "</div>";
		
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

    public function initWordCloud($individual_settings, $content = NULL) {

		// load required javascript and css files
		$this->enqueueDepencies();

		// individual_settings come from short code
		$this->getSettings($individual_settings);

		$this->getWordList();

		if ($this->error != NULL) {

			return $this->error;

		}
		
		$result = $this->createDomData();

		return $result;

    }
}
