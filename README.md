# WP WordCloud
A plugin for Wordpress to display cloud words wherever you want from different sources.

## What is a word cloud?
A word cloud visualizes occurences of words from a text. It counts the words and places them on a canvas. Based on the occurence of each word it calculates the size of the word. 

## Supported sources
You can configure several sources:
* inline: text is provided within the shortcode
* url: text comes from another server
* id: an id that points to a post or page
* sql: a query to the database WordPress is using
* custom-field: a custom field within your post / page
* edit-field: a text field on the frontend of your post / page
* image: an image the visitor of your website takes

# Installation

## Download

On command line either use git or wget to download the files into this just created folder

mkdir /htdocs/wp-content/plugins/WP-Word-Cloud
cd /htdocs/wp-content/plugins/WP-Word-Cloud
git clone https://github.com/nickyreinert/wordCloud-for-Wordpress.git .
or
cd /htdocs/wp-content/plugins/WP-Word-Cloud
wget https://github.com/nickyreinert/wordCloud-for-Wordpress/archive/wordCloud-for-wordPress-2.zip --no-check-certificate
unzip wordCloud-for-wordPress-2.zip -d WP-Word-Cloud

Or using your PC and a FTP client:

* download the archive https://github.com/nickyreinert/wordCloud-for-Wordpress/archive/wordCloud-for-wordPress-2.zip
* extract the archive and rename the folder to WP-Word-Cloud
* upload the folder WP-Word-Cloud to the plugin folder of your WordPress installation

## Activate

Navigate to the plugins section of your WordPress installation, search for the Plugin named "WP Word-Cloud" and press "activate".

# Usage
This plugin adds the shortcut [ wp-word-cloud ] to your WordPress site. The shortcode requires two mandatory information:
* an id, that uniquely addresses the word cloud (you can have multiple WordClouds on a single page)
* the definition, where the text for the word cloud comes from

When you first download and activate the plugin, it comes with a couple of default settings that should work out-of-the-box with this implementation:

[wp-word-cloud id="my-first-word-cloud"]https://de.wikipedia.org/wiki/Schlagwortwolke[/wp-word-cloud]

If you are using Gutenberg, you need to add a Shortcode-Block to use shortcodes. Otherwise you can just paste the shortcode into your editor. 

Of course there are a lot of settings to define how the WordCloud looks. Every setting has a default value, that you can edit in the settings area named "WP Word Cloud": wordCloud/wp-admin/options-general.php?page=wp-word-cloud. 

Every default value is valid in your entire website. If you want to change one of those global default values, you simply overwrite it by adding it to your shortcode. If you want to draw your WordCloud like a circle, you provide the shape-setting:

[wp-word-cloud id="my-first-word-cloud" shape="circle"]https://de.wikipedia.org/wiki/Schlagwortwolke[/wp-word-cloud]


# Settings
The plugin comes with a couple of default settings. You can edit those settings in the backend:

## source-type
The source-type defines, where your text comes from. Supported source-types are:
#### inline
The text is provided within the shortcode: 
[wp-word-cloud id="my-first-word-cloud" source-type="inline"]Lorem Ipsum[/wp-word-cloud]

### url
The text comes from a remote server, identified by an URL:
[wp-word-cloud id="my-first-word-cloud" source-type="url"]https://de.wikipedia.org/wiki/Schlagwortwolke[/wp-word-cloud]

### id
The text comes from a post or page of your website, identified by an id:
[wp-word-cloud id="my-first-word-cloud" source-type="id"]42[/wp-word-cloud]

### sql
(This feature is still experimental)
The text comes from a table of your database. You have to provide the SQL. This only works, if the table is stored in the same database where WordPress is installed to. 
[wp-word-cloud id="my-first-word-cloud" source-type="sql"]SELECT * FROM a_table[/wp-word-cloud]

### custom-field
The text comes from a custom field, identified by an id.
[wp-word-cloud id="my-first-word-cloud" source-type="custom-field"]a_custom_field[/wp-word-cloud]

## count-words
If you provide a text, the words needs to be counted first. Set this value to 1 to count words. If you use the OCR feature, words will always be counted. You can also provide a list of counted words.

[wp-word-cloud id="my-first-word-cloud" source-type="custom-field" count-words=1]a_custom_field[/wp-word-cloud]

### enable-frontend-edit
If you enable this, a text field will be added to the frontend. The text field will contain the data you provided with the shortcode configuration and the visitor of the website can edit the text. 

[wp-word-cloud id="my-first-word-cloud" source-type="custom-field" enable-frontend-edit=1]a_custom_field[/wp-word-cloud]

### enable-ocr
If you enable this, your site visitor can use the devices camera to take a picture of a document. The text on the document will be recognized with OCR and the words will be counted. 

*requires enable-frontend-edit=1*

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
