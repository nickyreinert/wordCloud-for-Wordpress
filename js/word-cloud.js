(function ($) {
	'use strict';

	// global var holds word counts for every registered word cloud
	var wordCounts = {};

	// go through all canvas elements to receive word cloud settings and
	// render word cloud
	$(".wordCloud").each(function (index, element) {

		var currentWcSettings = getWcSettings(element);

		// add black list
		$(element).parent().append("<p id='black-list-"+currentWcSettings.id+"'></p>");

		// add hover element, hidden on init
		$(element).parent().append("<div class='word-details' id='word-details-"+currentWcSettings.id+"'>foobar</div>");
		
		// if text comes from backend render word cloud
		if (currentWcSettings.source != 'edit-field') {

			// get word list
			currentWcSettings.list = prepareWordList(window["wc_wordList_" + currentWcSettings.id]);

			currentWcSettings.maxWeight = getMaxWeight(currentWcSettings);

			currentWcSettings = setWcCallbacks(currentWcSettings);

			// render word cloud
			renderWordCloud(currentWcSettings);

		// otherwise add textarea and button to trigger rendering manually
		} else {

			$(element).parent().prepend("<button class='render-word-cloud'>Erstellen</button>");

			$(element).parent().prepend("<textarea></textarea>");

			currentWcSettings.text = window["wc_text_" + currentWcSettings.id];

			// if the backend send (demo) text, add it to the textarea
			if (currentWcSettings.text != "") {

				$(element).parent().find('textarea').val(currentWcSettings.text);
		
				var blackList = getBlackList(currentWcSettings.id);
	
				currentWcSettings.list = countWords(			
					$(this).parent().find('textarea').val(), 
					currentWcSettings,
					blackList);
		
				currentWcSettings.maxWeight = getMaxWeight(currentWcSettings);

				currentWcSettings = setWcCallbacks(currentWcSettings);

				renderWordCloud(currentWcSettings);
				
			}

		}


	});


	// add trigger so user can remove words from black list
	$(document).on("click", "span.black-list-item" , function() {

		removeWordFromBlackList($(this));

	});

	$('.render-word-cloud').click(function () {

		var currentWcSettings = getWcSettings($(this).parent().find('canvas'));

		var blackList = getBlackList(currentWcSettings.id);

		currentWcSettings.list = countWords(			
			$(this).parent().find('textarea').val(), 
			currentWcSettings,
			blackList);

		renderWordCloud(currentWcSettings);

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

		var currentWcId = $(element).attr('id');

		var currentWcSettings = window["wc_options_" + currentWcId];

		currentWcSettings.id = currentWcId;

		return currentWcSettings;

	}

	function addWordToBlackList(item, currentWcSettings) {

		// save current word count to add it to black list
		var wordCount = wordCounts[currentWcSettings.id][item[0]];

		// remove word from raw list
		delete wordCounts[currentWcSettings.id][item[0]];
		
		// prepare raw list to make it ready for word cloud renderer
		currentWcSettings.list = prepareWordList(wordCounts[currentWcSettings.id], currentWcSettings);

		// add word to black list below the word cloud
		$('#black-list-'+currentWcSettings.id).append('<span count='+wordCount+' class="black-list-item"><span class="black-list-word">' + item[0] + '</span><span class="black-list-word-removal">&#x2A2F;</span></span>');

		// render word cloud again
		renderWordCloud(currentWcSettings);

	}

	function removeWordFromBlackList(item) {

		// if user clicks on word below word cloud canvas
		// it will be removed from black list

		var currentWcSettings = getWcSettings($(item).parent().parent().find('canvas'));

		// remove word from raw list
		wordCounts[currentWcSettings.id][$(item).find('.black-list-word').text()] = parseInt($(item).attr('count'));

		currentWcSettings.list = prepareWordList(wordCounts[currentWcSettings.id], currentWcSettings);

		$(item).remove();

		renderWordCloud(currentWcSettings);

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



