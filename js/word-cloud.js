(function ($) {
	'use strict';

	// global var holds word counts for every registered word cloud
	var wordCounts = {};

	// go through all canvas elements to receive word cloud settings and
	// render word cloud
	$(".wordCloud").each(function (index, element) {

		var currentWcSettings = getWordCloudSettings(element);

		// if text comes from edit field, don't render word cloud yet
		if (currentWcSettings.source != 'edit-field') {

			// get word list
			currentWcSettings.list = prepareWordList(window["wc_wordList_" + currentWcSettings.id]);

			// render word cloud
			renderWordCloud(currentWcSettings);

		// otherwise add textarea and button to trigger rendering manually
		} else {

			currentWcSettings.text = window["wc_text_" + currentWcSettings.id];

			$(element).parent().prepend("<textarea></textarea>");

			// if the backend send (demo) text, add it to the textarea
			if (currentWcSettings.text != "") {

				$(element).parent().find('textarea').val(currentWcSettings.text);
		
			}

			$(element).parent().prepend("<button class='render-word-cloud'>Render</button>");

		}

	});

	$(".render-word-cloud").click(function (e) {

		var currentWcSettings = getWordCloudSettings($(this).parent().find('canvas'));

		currentWcSettings.list = countWords(			
			$(this).parent().find('textarea').val(), 
			currentWcSettings);

		renderWordCloud(currentWcSettings);

	});

	function countWords(text, settings) {

		var textArray = text.split(' ');
		var wordCount = {};

		// first count the words
		$.each(textArray, function(index, word){

			var cleanWord = word.replace(new RegExp('['+settings['punctuation-chars']+']'), '');

			if (cleanWord.length >= settings['min-word-length']) {

				if (cleanWord in wordCount) {
					
					wordCount[cleanWord] = wordCount[cleanWord] + 1;

				} else {

					wordCount[cleanWord] = 1;
 
				}

			}

		});

		wordCounts[settings.id] = wordCount;

		return prepareWordList(wordCount, settings);;

	}

	/**
	 * Actually render the word cloud based on word count
	 * 
	 * @param {object} wcSettings Object contains settings and word list with word count
	 * 
	 */
	function renderWordCloud(wcSettings) {

		wcSettings.weightFactorFactor = (550 / wcSettings.list.length).toFixed(2);

		WordCloud($('#' + wcSettings['target-id'])[0], wcSettings);

	}

	function getWordCloudSettings(element) {

		// TODO: Remove
		// var context = element.getContext('2d');

		var currentWcId = $(element).attr('id');

		var currentWcSettings = window["wc_options_" + currentWcId];

		currentWcSettings.id = currentWcId;

		// pass function to color option, based on the weight of the word 
		currentWcSettings.color = function (word, weight, fontSize, radius, theta) {

			var alpha = 1;// / 100);
			return "rgba(0,0,0," + alpha + ")";

		};

		currentWcSettings.weightFactor = function (size) {
		
			return Math.pow(size, 3) * $('#myWordCloud2').width() / 512;
		
		};

		// if user clicks a word, it will be removed from the list and added to 
		// an ignore list
		currentWcSettings.click = function (item, dimension, event) {

			delete wordCounts[currentWcSettings.id][item[0]];
			
			currentWcSettings.list = prepareWordList(wordCounts[currentWcSettings.id], currentWcSettings);

			renderWordCloud(currentWcSettings);

		};

		currentWcSettings.hover = window.drawBox;

		return currentWcSettings;

	}


	// prepare word list for rendering:
	// 0: Object { xValue: "Foobar", yValue: "5" }
	// 1: Object { xValue: "Welt", yValue: "2" }
	// 2: Object { xValue: "Test", yValue: "10" }

	function prepareWordList(wordCount, settings) {

		var preparedWordList = [];

		$.each(wordCount, function(word, count){

			if (count >= settings['min-word-occurence']) {

				preparedWordList.push([word, count]);

			}

		});

		return preparedWordList;

	}

})(jQuery);



