# WP WordCloud
A plugin for Wordpress to display cloud words on post and pages. The supported sources are:

1. a list of counted words provided in the backend area or
2. a text field on the frontend, where the visitor can paste text, that will be counted.

You can paste text to the textfield on the frontend or take a picture with your device. Using the Tesseract-Library the text on the image will be recognized (OCR) and words will be counted.

## The shortcode
The shortcode to activate the word cloud is [wp-word-cloud]. You can put multiple word clouds to a page / post, but you always have to provide an unique id. 

## The settings
The plugin comes with a couple of default settings. You can edit those settings in the backend:

wordCloud/wp-admin/options-general.php?page=wp-word-cloud

If you pass the setting name to the shortcode, you can overwrite the setting for each implementation, e.g:

The global default setting min-word-length is 2. If you want to add a word cloud the minimum word length is 5, you use the shortcode like that:

[wp-word-cloud id="my-word-cloud" min-word-length=5]

The following settings are currently supported: 

### source (parameter)
Define the source of the word cloud. Valid parameters are:
1. edit-field - an edit field on the frontend
2. custom-field - a custom field in the backend
3. sql - a database table

### source-definition (string)
If source=custom-field, this points the unique Id of the custom field. If source=sql, this value contains the SQL query. 

### count-words (boolean)
If the source does contain a raw text, set this parameter to 1 to count the words. 

*This does not work if OCR is enabled*

### enable-ocr (boolean)
If you enable this, your site visitor can use the devices camera to take a picture of a document. The text on the document will be recognized with OCR and used for the word cloud. 

*this only works when source=edit-field*

### ocr-hint-fadeout (integer)
How long will the OCR hint message be displayed (in milliseconds).

### ocr-hint (boolean)
The text that will be display over the video stream to tell the visitor, how he triggers the OCR process.

### min-word-length (boolean)
If you want the script to count the words, this defines the minimum lenght of words. If a word has less chars, it will be ignored.

### min-word-occurence (boolean)
What is the threshold at which the word will be visible in the word cloud. 

### black-list (string)
A list of words, separated with a space, that will be ignored when you choose to count words. 

### enable-black-list (boolean)
Use the above mentioned black list.

### enable-custom-black-list (boolean)
Allow the visitor on the frontend to click words to remove them. 

### persistent-custom-black-list (boolean)
If enabled, the custom black list will not be removed if the user pastes new content to the text area.

### ignore-chars (regular expression)
A list of chars to ignore, when counting words of a text.

### grid-size (integer)
Margin between words.

### font-family (string)
CSS-like definition of the font-family. 


This plugin allows you to use shortcodes in pages and posts to create word clouds based on a list of counted words or a given text. The words will be rendered into a canvas. Based on their occurrences the size and color changes. This plugin is based on the great wordList2-library by timdream: https://github.com/timdream/wordcloud2.js

The wordlist you provide to this plugin contains a simple list with two columns: The first column is the word, the second column contains the occurence of this word.

# Usage and installation

Download the source and unzip it into a folder inside your wp-content/plugin-folder. Use the shortcode [word-cloud] to add the word cloud to your page or post. The shortcode requires at least one parameter "target-id". This is a unique identifert, used as the CSS-id to address the canvas object for rendering.

Those are the optional parameters:

	source  			  => custom-field (inside the page / post), sql or edit-field (on frontend)
	'query' 			  => if source = query,this is your query 
	'source-id' 		=> the name of the custom page / post field, where you put the word list
	'backgroundColor' => background color of the canvas in hex or rgba
	'gridSize'			=> space between words
	'fontFamily'		=> used font family, e.g. Arial,sans-serif
	'minSize'		 	=> minimal font size to print the words
	'fontWeight'		=> used font weight, e.g. bold
	'minRotation' 		=> level of minimum rotation, set to 0 if no rotation is required
	'maxRotation' 		=> same, but for maximum rotation
	'sizeFactor' 		=> weighing factor, the higher, the bigger the words
	'drawOutOfBound'	=> draw word even if it will not fit onto the canvas
	'shuffle'			=> shuffle word position everytime you render the cloud
	'canvas-width'		=> widht of the canvas, e.g. 1000px	
	'canvas-height'		=> heifht of the canvas, e.g. 400px
	'ellipticity'		=> value between 0 (flat) to 1 (elliptic)
	'demo-data'			=> add lorem ipsum to the frontend edit filed (only works with source=edit-field)
	'textTransform'		=> convert words to uppercase, lowercase or null - do not change them
	'persistentBlackList'	=> keep the blacklist when re-rendering
	'min-word-length'	=> skip word not longer than this value
	'min-word-occurence' => skip words with less occurences
	'ignore-chars' => regex to ignore chars when counting words
	'min-alpha' 		=> minimum alpha value when creating gradient for less important words
	'shape' 			=> 'shape of the final cloud, e.g. circle, diamond, square
	'target-id'			=> mandatory parameter for unique identification of every word cloud

For a detailled documentation of the word cloud render parameters see: https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md

# Source selection

If your source is a fixed list of words and values (source="custom-field"), you have to give the name of the containg custom field in "source-id". There you need to provide a simple, comma separated list like this:

Foobar,5
Hello,2
World,4
Test,10


If your source shall come from the SQL-database your wordpress installation is running on, you have to provide the SQL-query with the parameter "query", e.g.:

query="SELECT word, SUM(count) AS count FROM database.table GROUP BY word ORDER BY count DESC LIMIT 0,50"

See a working demo - in German only - on https://www.nickyreinert.de/wordpress-plugin-um-eine-word-cloud-mit-beliebigen-woertern-darzustellen/
