(function ($) {
	'use strict';

	// init
	// go through all word cloud containers
	// to receive word cloud settings 
	$(".word-cloud-container").each(function () {

		var wpWordCloudSettings = getWordCloudSettings(this);

		if (wpWordCloudSettings.data == null) {

			wpWordCloudSettings.data = 'Kein Text übermittelt. Bitte prüfe die Einstellungen im Backend.';

			wpWordCloudSettings.countWords = 1;

		}

		// add canvas
		$(this).append('<div class="word-cloud-controller"></div>');
		$(this).append('<canvas class="word-cloud" style="width: 100%" height="'+wpWordCloudSettings.canvasHeight+'" width="'+wpWordCloudSettings.canvasWidth+'" id="word-cloud-'+wpWordCloudSettings.id+'"></canvas>');

		// add black list container
		// contains words clicked by user
		if (wpWordCloudSettings.enableCustomBlackList == 1) {

			$(this).append('<p id="word-cloud-black-list-'+wpWordCloudSettings.id+'"></p>');

		}

		// add hover container
		// hiden on init
		$(this).append('<div class="word-cloud-tooltip" id="word-cloud-tooltip-'+wpWordCloudSettings.id+'"></div>');

		// force tooltop to disappear when mouse cursor leaves canvas
		$('#word-cloud-' + wpWordCloudSettings.id).mouseleave(function(){
			
			$('#word-cloud-tooltip-' + wpWordCloudSettings.id).hide();

		})
		
		if (wpWordCloudSettings.countWords == 1) {

			wpWordCloudSettings.list = countWords(wpWordCloudSettings);

		} else {

			wpWordCloudSettings.list = wpWordCloudSettings.data;

		}

		if (wpWordCloudSettings.enableFrontendEdit == 1) {

			$(this).find('.word-cloud-controller').prepend('<button class="render-word-cloud" id="render-word-cloud-'+wpWordCloudSettings.id+'">Erstellen</button>');

			$(this).prepend('<textarea class="word-cloud-text" id="word-cloud-text-'+wpWordCloudSettings.id+'"></textarea>');

			$('#word-cloud-text-'+wpWordCloudSettings.id).text(wpWordCloudSettings.data);

		} 


		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);

		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);


		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	});

	$('.render-word-cloud').click(function() {

		var wpWordCloudSettings = getWordCloudSettings($(this).parent().parent()[0]);

		if (wpWordCloudSettings.persistentCustomBlackList == 0) {
			
			$('#word-cloud-black-list-' + wpWordCloudSettings.id).children().remove();

		} 

		wpWordCloudSettings.text = $('#word-cloud-text-'+wpWordCloudSettings.id).val();

		wpWordCloudSettings.customBlackList = getCustomBlackList(wpWordCloudSettings);

		wpWordCloudSettings.list = countWords(wpWordCloudSettings);
		
		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);
		
		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		console.log(wpWordCloudSettings);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	});

	function addWordToBlackList(item, settings) {

		// add word to black list below the word cloud
		$('#word-cloud-black-list-'+settings.id).append('<span count='+item[1]+' class="black-list-item"><span class="black-list-word">' + item[0] + '</span><span class="black-list-word-removal">&#x2A2F;</span></span>');

		settings.customBlackList = getCustomBlackList(settings);
		
		settings.list = countWords(settings);

		settings.maxWeight = getMaxWeight(settings);
		
		settings = setWcCallbacks(settings);

		WordCloud($('#word-cloud-' + settings.id)[0], settings);

	}

	// add trigger so user can remove words from black list
	$(document).on("click", "span.black-list-item" , function() {

		// if user clicks on word below word cloud canvas
		// it will be removed from black list

		var settings = getWordCloudSettings($(this).parent().parent()[0]);

		$(this).remove();

		settings.customBlackList = getCustomBlackList(settings);
		
		settings.list = countWords(settings);

		settings.maxWeight = getMaxWeight(settings);
		
		settings = setWcCallbacks(settings);

		WordCloud($('#word-cloud-' + settings.id)[0], settings);

	});

	function getCustomBlackList(settings) {

		var blackList = {};

		$('#word-cloud-black-list-' + settings.id).children().each(function(){

			var count = $(this).attr('count');
			var word = $(this).find('.black-list-word').html();

			blackList[word] = count;

		})
		
		return blackList;

	}

	function countWords(settings) {

		var textArray = settings.data.split(' ');
		settings.list = {};

		// first count the words
		$.each(textArray, function(index, word){

			var cleanWord = word.replace(new RegExp('['+settings.ignoreChars+']'), '');
			
			if (settings.textTransform == 'uppercase') {

				cleanWord = cleanWord.toUpperCase();

			} else if (settings.textTransform == 'lowercase') {

				cleanWord = cleanWord.toLowerCase();

			}

			if (typeof(settings.customBlackList[cleanWord]) === 'undefined' && 
				!settings.blackList.includes(cleanWord) 
			) {

				if (cleanWord.length >= settings.minWordLength) {

					if (cleanWord in settings.list) {
						
						settings.list[cleanWord] = settings.list[cleanWord] + 1;

					} else {

						settings.list[cleanWord] = 1;
	
					}

				}

			}

		});

		return prepareWordList(settings);

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
					(1 - settings.minAlpha) - (
						(weight - settings.minWordOccurence) / 
						(settings.maxWeight - settings.minWordOccurence))
					
				)) / 10;

			return "rgba(0,0,0," + alpha + ")";

		};

		settings.weightFactor = function (size) {

			return size * $('#word-cloud-'+settings.id).width() / (settings.sizeFactor * (settings.maxWeight / 15));
			
			// return Math.pow(size, 2.5) * $('#myWordCloud2').width() / 256;
		
		};

		// if user clicks a word, it will be removed from the list and added to 
		// an ignore list
		settings.click = function (item, dimension, event) {

			addWordToBlackList(item, settings);

		};

		settings.hover = function (item, dimension, event) {

			if (item != undefined) {

				$('#word-cloud-tooltip-' + settings.id).text(item[1]);

				$('#word-cloud-tooltip-' + settings.id).toggle();

				$('#word-cloud-tooltip-' + settings.id).css({left: event.pageX - 10 - $('#word-details-' + settings.id).width(), top: event.pageY - $('#word-cloud-tooltip-' + settings.id).height()});
	
			}

		};

		return settings

	}

	function prepareWordList(settings) {

		var preparedWordList = [];

		$.each(settings.list, function(word, count){

			if (count >= settings.minWordOccurence) {

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



