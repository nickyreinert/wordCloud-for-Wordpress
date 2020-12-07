(function ($) {

	'use strict';

	// init
	// go through all word cloud containers
	// to receive word cloud settings 
	$(".word-cloud-container").each(function () {

		var wpWordCloudSettings = getWordCloudSettings(this);

		wpwc(wpWordCloudSettings, "Read settings");
		
		if (wpWordCloudSettings.data == null && wpWordCloudSettings.list == null) {

			wpwc(wpWordCloudSettings, "Error: No text found.");

			wpWordCloudSettings.data = 'Kein Text übermittelt. Bitte prüfe die Einstellungen im Backend.';

			wpWordCloudSettings.countWords = 0;

		}

		if (wpWordCloudSettings.list == null && wpWordCloudSettings.countWords != 1) {
		
			wpWordCloudSettings.countWords = 1;

			wpwc(wpWordCloudSettings, "%cAchtung: count-words ist nicht aktiviert und wird automatisch auf 1 gesetzt.", 1);
	
		}

		// add canvas and / or html
		$(this).append('<div class="word-cloud-controller"></div>');
		if (wpWordCloudSettings.style == 'html') {

			$(this).append('<div class="word-cloud" style="position: relative; height: '+wpWordCloudSettings.canvasHeight+'; width: '+wpWordCloudSettings.canvasWidth+';" id="word-cloud-html-'+wpWordCloudSettings.id+'"></div>');
			$(this).append('<canvas class="word-cloud" style="width: 100%; display: none;" height="'+wpWordCloudSettings.canvasHeight+'" width="'+wpWordCloudSettings.canvasWidth+'" id="word-cloud-'+wpWordCloudSettings.id+'"></canvas>');

		} else {

			$(this).append('<canvas class="word-cloud" style="width: 100%" height="'+wpWordCloudSettings.canvasHeight+'" width="'+wpWordCloudSettings.canvasWidth+'" id="word-cloud-'+wpWordCloudSettings.id+'"></canvas>');

		}

		wpwc(wpWordCloudSettings, "Added canvas");

		// add black list container
		// contains words clicked by user
		if (wpWordCloudSettings.enableCustomBlackList == 1) {

			wpwc(wpWordCloudSettings, "Added black list container");

			$(this).append('<p id="word-cloud-black-list-'+wpWordCloudSettings.id+'"></p>');
			$(this).append('<label for="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'">Ignore-Liste anwenden</label>');
			
		}
		if (wpWordCloudSettings.enableCustomBlackList == 1 || wpWordCloudSettings.enableBlackList == 1) {

			$(this).append('<input checked type="checkbox" class="activate-black-list" id="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'" name="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'">');

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

			wpwc(wpWordCloudSettings, "Counted words");

		}

		if (wpWordCloudSettings.debug == 1) {

			console.log({"WP WordCloud Words" : wpWordCloudSettings.list});

		}

		if (wpWordCloudSettings.enableFrontendEdit == 1 || wpWordCloudSettings.enableOcr == 1) {

			$(this).find('.word-cloud-controller').prepend('<button class="render-word-cloud" id="render-word-cloud-'+wpWordCloudSettings.id+'">Erstellen</button>');

			$(this).prepend('<textarea class="word-cloud-text" id="word-cloud-text-'+wpWordCloudSettings.id+'"></textarea>');

			$('#word-cloud-text-'+wpWordCloudSettings.id).text(wpWordCloudSettings.data);

			wpwc(wpWordCloudSettings, "Added edit field");
		
		} 


		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);

		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		if (wpWordCloudSettings.style == 'html') {
		
			WordCloud(
				[$('#word-cloud-' + wpWordCloudSettings.id)[0],
				$('#word-cloud-html-' + wpWordCloudSettings.id)[0]],
				wpWordCloudSettings);

		} else {
		
			WordCloud(
				$('#word-cloud-' + wpWordCloudSettings.id)[0],
				wpWordCloudSettings);
			
		}
	});

	$('.activate-black-list').click(function() {

		var wpWordCloudSettings = getWordCloudSettings($(this).parent()[0]);

		if (wpWordCloudSettings.persistentCustomBlackList == 0) {
			
			$('#word-cloud-black-list-' + wpWordCloudSettings.id).children().remove();

		} 

		wpWordCloudSettings.customBlackList = getCustomBlackList(wpWordCloudSettings);

		if (processedSettings.enableFrontendEdit == 1) {

			wpWordCloudSettings.data = $('#word-cloud-text-'+wpWordCloudSettings.id).val();

		}

		wpWordCloudSettings.list = countWords(wpWordCloudSettings);
		
		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);
		
		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		console.log(wpWordCloudSettings.list);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	})

	$('.render-word-cloud').click(function() {

		var wpWordCloudSettings = getWordCloudSettings($(this).parent().parent()[0]);

		if (wpWordCloudSettings.persistentCustomBlackList == 0) {
			
			$('#word-cloud-black-list-' + wpWordCloudSettings.id).children().remove();

		} 

		wpWordCloudSettings.customBlackList = getCustomBlackList(wpWordCloudSettings);

		wpWordCloudSettings.data = $('#word-cloud-text-'+wpWordCloudSettings.id).val();

		wpWordCloudSettings.list = countWords(wpWordCloudSettings);
		
		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);
		
		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		console.log(wpWordCloudSettings);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	});

	function addWordToBlackList(item, settings) {

		wpwc(settings, "User added word to ingore list.");

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

		if ($("#word-cloud-activate-black-list-"+settings.id).is(":checked")) {

			$('#word-cloud-black-list-' + settings.id).children().each(function(){

				var count = $(this).attr('count');
				var word = $(this).find('.black-list-word').html();
	
				blackList[word] = count;
	
			})
	
		} 

		return blackList;

	}

	function countWords(settings) {

		var cleanText = settings.data.replace(new RegExp(settings.ignoreChars, 'gim'), '');

		cleanText = (settings.textTransform == 'uppercase') 
			? cleanText.toUpperCase()
			: cleanText.toLowerCase();

		var textArray = cleanText.split(' ');

		settings.list = {};

		var purgedTextArray = [] 

		// first remove stopp words
		$.each(textArray, function(index, word) {
				
			if ((
				typeof(settings.customBlackList[word]) === 'undefined' &&
				!settings.blackList.includes(word)
				) ||
				!$("#word-cloud-activate-black-list-"+settings.id).is(":checked") 
 				
			) {

				purgedTextArray.push(word);

			}

		})

		var wordList = {};

		var wordCount = Object.keys(purgedTextArray).length;

		// second: count words
		$.each(purgedTextArray, function(index, word) {

			if (word.length >= settings.minWordLength) {

				if (word in wordList) {
					
					wordList[word]['abs'] += 1
					wordList[word]['rel'] = 100 * wordList[word]['abs']  / wordCount
					wordList[word]['wdf'] = Math.log2(wordList[word]['abs'] + 1) / Math.log2(wordCount)

				} else {

					wordList[word] = {
						'abs' : 1, 
						'rel' : 100 / wordCount,
						'wdf' : Math.log2(2) / Math.log2(wordCount)

					};

				}

			}


		});

		// third: send values to result

		$.each(wordList, function(index, word) {
			
			settings.list[index] = Math.round(word['abs']);

		})

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
		
			var alpha = weight / settings.maxWeight
			if (alpha < settings.minAlpha) {
				alpha = settings.minAlpha;
			}

			return "rgba(0,0,0," + alpha + ")";

		};

		settings.weightFactor = function (size) {

			return settings.sizeFactor;
			// return size * $('#word-cloud-'+settings.id).width() / (settings.sizeFactor * (settings.maxWeight / 15));
			
			// return Math.pow(size, 2.5) * $('#myWordCloud2').width() / 256;
		
		};

		// if user clicks a word, it will be removed from the list and added to 
		// an ignore list
		settings.click = function (item, dimension, event) {

			if ($("#word-cloud-activate-black-list-"+settings.id).is(":checked")) {

				addWordToBlackList(item, settings);

			}

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

	// log function
	function wpwc(wpWordCloudSettings, message, error = 0){

		if (wpWordCloudSettings.debug == 1) {

			console.log("[WP WordCloud] " + message);

		}

		if (error > 0) {

			console.warn("[WP WordCloud] " + message, 'color: red;');

		}

	}

})(jQuery);



