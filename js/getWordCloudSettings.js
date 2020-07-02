function getWordCloudSettings(element) {

    // transfer settings to word cloud object
    // the shortcode does not allowe camel case, but the
    // word cloud library has camel case settings
    // that's why manually need to transfer settings from the backend
    // to the word cloud library setting object

    var settings = window[element.getAttribute('settings')];

    var processedSettings = {};
    
    // get array from object
    if (settings['list'] != null) {
    
        processedSettings.list = [];

        for (var key in settings['list']) {

            if (settings['list'].hasOwnProperty(key)) {

                processedSettings.list.push([key, settings['list'][key]]);

            }

        }

    }

    processedSettings.backgroundColor 	= settings['background-color'];
    processedSettings.gridSize 			= settings['grid-size'];
    processedSettings.fontFamily 		= settings['font-family'];
    processedSettings.minSize 			= settings['min-size'];
    processedSettings.fontWeight 		= settings['font-weight'];
    processedSettings.minRotation 		= parseFloat(settings['min-rotation']);
    processedSettings.maxRotation 		= parseFloat(settings['max-rotation']);
    processedSettings.rotateRatio 		= parseFloat(settings['rotate-ratio']);
    processedSettings.shape 			= settings['shape'];
    processedSettings.drawOutOfBound 	= settings['draw-out-of-bound'];
    processedSettings.shrinkToFit   	= settings['shrink-to-fit'];
    processedSettings.shuffle 			= settings['shuffle'];
    processedSettings.ellipticity 		= settings['ellipticity'];
    processedSettings.clearCanvas 		= settings['clear-canvas'];

    // own settings
    processedSettings.id 				= settings['id'];
    processedSettings.sourceType 		= settings['source-type'];
    processedSettings.data 		    	= settings['data'];
    processedSettings.enableFrontendEdit = settings['enable-frontend-edit'];
    processedSettings.canvasWidth 		= settings['canvas-width'];
    processedSettings.canvasHeight 		= settings['canvas-height'];
    processedSettings.minAlpha 			= settings['min-alpha'];
    
    processedSettings.textTransform 	= settings['text-transform'];

    processedSettings.countWords 		= settings['count-words'];
    processedSettings.ignoreChars 		= settings['ignore-chars'];
    processedSettings.minWordLength 	= settings['min-word-length'];
    processedSettings.minWordOccurence 	= settings['min-word-occurence'];

    processedSettings.enableBlackList 	= settings['enable-black-list'];

    if (processedSettings.enableBlackList  == 1) {
        
        processedSettings.blackList		= settings['black-list'].split(' ');

    } else {

        processedSettings.blackList 	= '';

    }
    
    processedSettings.enableCustomBlackList 	= settings['enable-custom-black-list'];
    if (processedSettings.enableCustomBlackList == 1) {

        processedSettings.customBlackList 	= {};

    }
    processedSettings.persistentCustomBlackList = settings['persistent-custom-black-list'];
    
    processedSettings.sizeFactor 		= parseInt(settings['size-factor']);

    processedSettings.enableOcr 	    = settings['enable-ocr'];
    processedSettings.ocrLanguage       = settings['ocr-language'];
    processedSettings.ocrLocalLibraries = settings['ocr-local-libraries'];    
    
    processedSettings.debug 	        = settings['debug'];

    processedSettings.pluginPath 	    = settings['plugin-path'];

    if (processedSettings.debug == 1) {
        
        console.log("[WP WordCloud] Init `" + processedSettings.id + "` -----------------");
        console.log({"WP WordCloud Settings" : processedSettings});

    }

    return processedSettings;

}