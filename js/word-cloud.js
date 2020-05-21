(function ($) {
	'use strict';

	// object contains word cloud data

	// go through all canvas elements to receive word cloud settings and
	// render word cloud
	$(".word-cloud").each(function (index, element) {

		// var wordCloudSettings = getWcSettings(element);
		var wordCloudSettings = window[$(element).attr('settings')];

		console.log(wordCloudSettings);
		// add black list
		$(element).parent().append("<p id='black-list-"+wordCloudSettings.id+"'></p>");

		// add hover element, hidden on init
		$(element).parent().append("<div class='word-details' id='word-details-"+wordCloudSettings.id+"'>foobar</div>");
		
		// if text comes from backend render word cloud
		if (wordCloudSettings.source != 'edit-field') {

			// get word list
			wordCloudSettings.list = prepareWordList(window["wc_wordList_" + wordCloudSettings.id]);

			wordCloudSettings.maxWeight = getMaxWeight(wordCloudSettings);

			wordCloudSettings = setWcCallbacks(wordCloudSettings);

			// render word cloud
			renderWordCloud(wordCloudSettings);

		// otherwise add textarea and button to trigger rendering manually
		} else {

			$(element).parent().prepend("<button class='render-word-cloud'>Erstellen</button>");

			$(element).parent().prepend("<textarea></textarea>");

			wordCloudSettings.text = window["wc_text_" + wordCloudSettings.id];

			// if the backend send (demo) text, add it to the textarea
			if (wordCloudSettings.text != "") {

				$(element).parent().find('textarea').val(wordCloudSettings.text);
		
				var blackList = getBlackList(wordCloudSettings.id);
	
				wordCloudSettings.list = countWords(			
					$(this).parent().find('textarea').val(), 
					wordCloudSettings,
					blackList);
		
				wordCloudSettings.maxWeight = getMaxWeight(wordCloudSettings);

				wordCloudSettings = setWcCallbacks(wordCloudSettings);

				renderWordCloud(wordCloudSettings);
				
			}

		}


	});

	// add trigger so user can remove words from black list
	$(document).on("click", "span.black-list-item" , function() {

		removeWordFromBlackList($(this));

	});

	$('.render-word-cloud').click(function () {

		var wordCloudSettings = getWcSettings($(this).parent().find('canvas'));

		if (wordCloudSettings['persistentBlackList'] == 0) {
			
			$('#black-list-' + wordCloudSettings.id).children().remove();

		} 

		var blackList = getBlackList(wordCloudSettings.id);

		wordCloudSettings.list = countWords(			
			$(this).parent().find('textarea').val(), 
			wordCloudSettings,
			blackList);

		renderWordCloud(wordCloudSettings);

	});

	function getBlackList(id) {

		var blackList = {};

		$('#black-list-' + id).children().each(function(){

			var count = $(this).attr('count');
			var word = $(this).find('.black-list-word').html();

			blackList[word] = count;

		})
		
		return blackList;

	}

	function countWords(text, settings, blackList) {

		var textArray = text.split(' ');
		var wordCount = {};


		// first count the words
		$.each(textArray, function(index, word){

			var cleanWord = word.replace(new RegExp('['+settings['ignore-chars']+']'), '');
			
			if (settings['textTransform'] == 'uppercase') {

				cleanWord = cleanWord.toUpperCase();

			} else if (settings['textTransform'] == 'lowercase') {


				cleanWord = cleanWord.toLowerCase();

			}

			if (typeof(blackList[cleanWord]) === 'undefined') {

				if (cleanWord.length >= settings['min-word-length']) {

					if (cleanWord in wordCount) {
						
						wordCount[cleanWord] = wordCount[cleanWord] + 1;

					} else {

						wordCount[cleanWord] = 1;
	
					}

				}

			}

		});
		
		wordCounts[settings.id] = wordCount;

		return prepareWordList(wordCount, settings);

	}

	/**
	 * Actually render the word cloud based on word count
	 * 
	 * @param {object} wcSettings Object contains settings and word list with word count
	 * 
	 */
	function renderWordCloud(wcSettings) {

		wcSettings.maxWeight = getMaxWeight(wcSettings);

		wcSettings = setWcCallbacks(wcSettings);

		WordCloud($('#' + wcSettings['target-id'])[0], wcSettings);

	}

	function getMaxWeight(settings) {

		var maxWeight = 0;

		$.each(settings.list, function(index, wordCount){
		
			if (wordCount[1] > maxWeight) {
			
				maxWeight = wordCount[1];

			} 
		});

		return maxWeight;
		
	}

	function setWcCallbacks(settings) {

		// pass function to color option, based on the weight of the word 
		settings.color = function (word, weight, fontSize, radius, theta) {
		
			// have fun ;)
			var alpha = 1 - Math.round(10 * 
				(
					(1 - settings['min-alpha']) - (
						(weight - settings['min-word-occurence']) / 
						(settings.maxWeight - settings['min-word-occurence']))
					
				)) / 10;

			return "rgba(0,0,0," + alpha + ")";

		};

		settings.weightFactor = function (size) {
		
			return size * $('#'+settings['target-id']).width() / settings.sizeFactor;
			// return Math.pow(size, 2.5) * $('#myWordCloud2').width() / 256;
		
		};

			// if user clicks a word, it will be removed from the list and added to 
		// an ignore list
		settings.click = function (item, dimension, event) {

			addWordToBlackList(item, settings);

		};

		settings.hover = function (item, dimension, event) {

			if (item != undefined) {

				$('#word-details-' + settings.id).text(item[1]);

				$('#word-details-' + settings.id).toggle();

				$('#word-details-' + settings.id).css({left: event.pageX - 10 - $('#word-details-' + settings.id).width(), top: event.pageY - $('#word-details-' + settings.id).height()});
	
			}

		};

		return settings

	}

	function getWcSettings(element) {

		var wordCloudSetting = $(element).attr('id');

		var wordCloudSettings = window["wc_options_" + wordCloudSetting];

		wordCloudSettings.id = wordCloudSetting;

		return wordCloudSettings;

	}

	function addWordToBlackList(item, wordCloudSettings) {

		// save current word count to add it to black list
		var wordCount = wordCounts[wordCloudSettings.id][item[0]];

		// remove word from raw list
		delete wordCounts[wordCloudSettings.id][item[0]];
		
		// prepare raw list to make it ready for word cloud renderer
		wordCloudSettings.list = prepareWordList(wordCounts[wordCloudSettings.id], wordCloudSettings);

		// add word to black list below the word cloud
		$('#black-list-'+wordCloudSettings.id).append('<span count='+wordCount+' class="black-list-item"><span class="black-list-word">' + item[0] + '</span><span class="black-list-word-removal">&#x2A2F;</span></span>');

		// render word cloud again
		renderWordCloud(wordCloudSettings);

	}

	function removeWordFromBlackList(item) {

		// if user clicks on word below word cloud canvas
		// it will be removed from black list

		var wordCloudSettings = getWcSettings($(item).parent().parent().find('canvas'));

		// remove word from raw list
		wordCounts[wordCloudSettings.id][$(item).find('.black-list-word').text()] = parseInt($(item).attr('count'));

		wordCloudSettings.list = prepareWordList(wordCounts[wordCloudSettings.id], wordCloudSettings);

		$(item).remove();

		renderWordCloud(wordCloudSettings);

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
		
		// in order to start with the most important word in the center, sort the array
		// thanks to https://stackoverflow.com/a/5200010
		preparedWordList.sort(function(a, b) {
    			a = a[1];
    			b = b[1];

    			return a > b ? -1 : (a < b ? 1 : 0);
		});

		return preparedWordList;

	}

})(jQuery);



