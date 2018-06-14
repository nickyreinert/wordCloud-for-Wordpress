# wordCloud-for-Wordpress
Simple plugin to display cloud of words in Wordpress


This is a plugin for Wordpress to display a list of words. Based on it's given occurences they will be displayed with different font sizes. This plugin is based on the great wordList2-repository by timdream: https://github.com/timdream/wordcloud2.js

The wordlist you provide to this plugin contains a simple list with two columns: The first column is the word, the second column contains the occurence of this word.

This plugin will *not* count words!

# Usage and installation

Download the source and unzip it into a folder inside your wp-content/plugin-folder. Use the shortcode [word-cloud] to add the word cloud to your page or post. The shortcode requires at least one parameter "target-id". This is a unique identifert, used as the CSS-id to address the canvas object for rendering.

Those are the optional parameters:

      source  			  => can be custom-field or sql, see paragraph below
			'query' 			  => the query, if your source is sql
			'source-id' 		=> the name of the custom page / post field, where you put the word list
			'backgroundColor' => background color in hex value, e.g. #ffffff
			'gridSize'			=> size of the grid
			'fontFamily'		=> used font family, e.g. Arial,sans-serif
			'fontWeight'		=> used font weight, e.g. bold
			'minRotation' 		=> level of minimum rotation, set to 0 if no rotation is required
			'maxRotation' 		=> same, but for maximum rotation
			'weightFactor' 		=> weighing factor, e.g. 1
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
