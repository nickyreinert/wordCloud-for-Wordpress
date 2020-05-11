<?php


 final class WordCloud
{
	private $pluginName = 'word-cloud';
	private $version = '1.1.0';
	private $demoData = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

	Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   
	
	Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   
	
	Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer';

	private $error = NULL;

    public function __construct() {

		add_filter( 'get_word_cloud_instance', [ $this, 'get_instance' ] );

	}

    public function get_instance() {

		return $this; // return the object

    }

	private function getOptions($options) {

		$this->options = shortcode_atts( array(
			'source'			=> 'custom-field', // TODO: file from media library
			'query' 			=> NULL,
			'source-id' 		=> 'word-cloud', // name of the custom field that hold's word count list
			'backgroundColor' 	=> '#ffffff',
			'gridSize'			=> 1,
			'fontFamily'		=> 'Arial,sans-serif',
			'minSize'			=> 1,
			'fontWeight'		=> 'bold',
			'minRotation' 		=> 0,
			'maxRotation' 		=> 0,
			'sizeFactor' 		=> 40,
			'shape' 			=> 'circle',
			'drawOutOfBound' 	=> 0,
			'shuffle' 			=> 1,
			'canvas-width' 		=> '1024px',
			'canvas-height' 	=> '800px',
			'ellipticity' 		=> 1,
			'demo-data'			=> 0,
			'clearCanvas'		=> true,
			'backgroundColor'	=> 'rgba(255,255,255,0)',
			'min-word-length'	=> 2, // minimal length of word in chars
			'min-word-occurence'=> 2, // minimal occurence of word otherwise it will be ignored
			'ignore-chars' 		=> '()[],.;', // will be removed before counting words
			'min-alpha' 		=> 0.1, // minimum alpha value to gradient words that have a lower weight, set to 1 to disable gradient
			'target-id'			=> NULL // unique id of the word cloud container
		), $options );
		
		if ($this->options['target-id'] == NULL) {

			$this->error = '<p class="word-cloud--warning">Parameter "target-id" not given. This is required to address the canvas.</p>';

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

					$this->error = '<p class="word-cloud--warning">Could not read data from custom-field `'.$this->options['source-id'].'`!</p>';

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

	private function getDomData() {

		$result = NULL;
		$result .= "<div id='".$this->options['target-id']."-container' class='wordCloud-container'>".PHP_EOL;
		$result .= "<canvas style='width: 100%;' class='wordCloud' id='".$this->options['target-id']."' width='".$this->options['canvas-width']."' height='".$this->options['canvas-height']."'></canvas>".PHP_EOL;
		$result .= "<script type='text/javascript'>".PHP_EOL;
		$result .= "var wc_wordList_".$this->options['target-id']." = ".json_encode($this->wordList).";".PHP_EOL;
		$result .= "var wc_options_".$this->options['target-id']." = ".json_encode($this->options).";".PHP_EOL;

		if ($this->options['demo-data'] == TRUE) {

			$result .= "var wc_text_".$this->options['target-id']." = ".json_encode($this->demoData).";";

		}

		$result .= "</script>";
		$result .= "</div>";
		
		return $result;

	}
	
	private function enqueueDepencies() {


		wp_enqueue_style(
			$this->pluginName, 
			plugin_dir_url( __FILE__ ) . 'css/word-cloud.css', 
			array(), 
			$this->version, 
			'all' );

		wp_register_script(
			 'wordcloud-library',
			 plugin_dir_url( __FILE__ ) . 'js/wordcloud2.js', 
			 array( 'jquery' )
		 );

		wp_enqueue_script(
			 'word-cloud',
			 plugin_dir_url( __FILE__ ) . 'js/word-cloud.js',
			 array( 'wordcloud-library' )                     
		);


	}

    public function initWordCloud($options) {

		// load required javascript and css files
		$this->enqueueDepencies();

		// get options from shortcode parameters
		$this->getOptions($options);

		$this->getWordList();

		if ($this->error != NULL) {

			return $this->error;

		}
		
		$result = $this->getDomData();

		return $result;

    }
}
