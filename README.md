# wordCloud-for-Wordpress
A plugin for wordpress to display cloud words in pages and posts.


This plugin allowsy you to use shortcodes in pages and posts to create word clouds based on a list of counted words or a given text. The words will be rendered into a canvas. Based on their occurrences the size and color changes. This plugin is based on the great wordList2-library by timdream: https://github.com/timdream/wordcloud2.js

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
