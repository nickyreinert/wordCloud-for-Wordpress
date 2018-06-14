(function( $ ) {
	'use strict';

	$(".wordCloud").each(function(index, element) {
		
		drawWordCloud(element);

	});


	
	function drawWordCloud(element) {
		
		var context = element.getContext('2d');
		
		var currentWordCloud = $(element).attr('id');
					
		var currentWcOptions = window["wc_options_"+currentWordCloud];
		
		var currentWcList = window["wc_wordList_"+currentWordCloud];
		
		currentWcOptions.color = function (word, weight, fontSize, radius, theta) {

		  var alpha = (weight / 100 );
		  return "rgba(0,0,0,"+alpha+")";

	  	};
		currentWcOptions.hover = window.drawBox;
	
		currentWcOptions.weightFactorFactor = (550 / currentWcList.length).toFixed(2);

		currentWcOptions.list = [];

		for (var i = 0; i < currentWcList.length; i++)
		{
			if (i == 0)
			{
				var max = parseInt(currentWcList[i].yValue);
			}

			currentWcOptions.list[i] = [currentWcList[i].xValue, parseInt((currentWcList[i].yValue / max) * 100)];

		}
	
		WordCloud($('#'+currentWcOptions['target-id'])[0], currentWcOptions);

	}
	
})( jQuery );



