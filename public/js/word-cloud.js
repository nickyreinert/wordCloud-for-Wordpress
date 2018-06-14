(function( $ ) {
	'use strict';

	$(".wordCloud").each(function(index, element) {
		
		drawWordCloud(element);

	});


	
	function drawWordCloud(element) {

		var context = element.getContext('2d');
		var currentWordCloud = $(element).attr('id');
					
		wc_wordCloudOptions.color = function (word, weight, fontSize, radius, theta) {

		  var alpha = (weight / 100 );
		  return "rgba(0,0,0,"+alpha+")";

	  	};
		wc_wordCloudOptions.hover = window.drawBox;
	
		wc_wordCloudOptions.weightFactorFactor = (550 / wc_wordList.length).toFixed(2);

		wc_wordCloudOptions.list = [];

		for (var i = 0; i < wc_wordList.length; i++)
		{
			if (i == 0)
			{
				var max = parseInt(wc_wordList[i].yValue);
			}

			wc_wordCloudOptions.list[i] = [wc_wordList[i].xValue, parseInt((wc_wordList[i].yValue / max) * 100)];

		}
	
		WordCloud($('#'+wc_wordCloudOptions['target-id'])[0], wc_wordCloudOptions);

	}
	
})( jQuery );



