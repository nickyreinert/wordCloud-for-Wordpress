<?php


 final class WordCloud
{
	private $xAxis = [];
	private $yAxis = [];
	private $maxValue = 0;
	private $pluginName = 'word-cloud';
	private $version = '1.0.0';

	private $error = NULL;


    public function __construct() {

		add_filter( 'get_word_cloud_instance', [ $this, 'get_instance' ] );

	}

    public function get_instance() {

		return $this; // return the object

    }

	private function getWordCloudOptions($options) {

		$this->options = shortcode_atts( array(
			'source'			=> 'custom-field', // TODO: add as source: SQL-query, file from media library
			'query' 			=> NULL,
			'source-id' 		=> 'word-cloud',
			'backgroundColor' 	=> '#ffffff',
			'gridSize'			=> 1,
			'fontFamily'		=> 'Arial,sans-serif',
			'fontWeight'		=> 'bold',
			'minRotation' 		=> 0,
			'maxRotation' 		=> 0,
			'weightFactor' 		=> 1,
			'shape' 			=> 'circle',
			'target-id'			=> NULL
		), $options );
		
		if ($this->options['target-id'] == NULL) {

			$this->error = '<p class="word-cloud--warning">Parameter "target-id" not given. This is required to address the canvas.</p>';

		}

	}

	private function getWordCloudFromSource() {

		$data = NULL;
		$wordList = array();
		
		switch ($this->options['source']) {

			default:
			case 'custom-field':

				$data = explode(PHP_EOL, get_post_meta(get_the_ID(), $this->options['source-id'], TRUE));

				if (sizeof($data) <= 1 AND $data[0] == '') {

					$this->error = '<p class="word-cloud--warning">Could not read data from custom-field `'.$this->options['source-id'].'`!</p>';

				}
				
				foreach ($data as $row) {
					
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

	private function prepareWordCloudOutput() {

		$result = NULL;
		$result .= "<div id='word-cloud-container'>";
			$result .= "<canvas style='width: 100%;' class='wordCloud' id='".$this->options['target-id']."' width='400px' height='400px'></canvas>";
			$result .= "<script type='text/javascript'>";
				$result .= "var wc_wordList = ".json_encode($this->wordList).";";
				$result .= "var wc_wordCloudOptions = ".json_encode($this->options).";";
			$result .= "</script>";
		$result .= "</div>";
		
		return $result;

	}
	
    public function renderWordsIntoCloud($options) {
		wp_enqueue_style( $this->pluginName, plugin_dir_url( __FILE__ ) . 'css/word-cloud.css', array(), $this->version, 'all' );

		wp_register_script(
			 'wordcloud-library',
			 plugin_dir_url( __FILE__ ) . '/js/wordcloud2.js', 
			 array( 'jquery' )
		 );

		wp_enqueue_script(
			 'word-cloud',
			 plugin_dir_url( __FILE__ ) . '/js/word-cloud.js',
			 array( 'wordcloud-library' )                     
		);
		 
		

		$this->getWordCloudOptions($options);

		$this->getWordCloudFromSource();

		if ($this->error != NULL) {

			return $this->error;
		}
		
		$result = $this->prepareWordCloudOutput();

		return $result;
    }
}
