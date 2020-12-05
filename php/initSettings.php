<?php

    add_action( 'admin_init', 'wp_word_cloud_register_settings' );
    add_action('admin_menu', 'wp_word_cloud_register_options_page');

    /**
	 * Return object of global settings, default values and
	 * and description
     * 
	 */

    function wp_word_cloud_get_global_settings() {

        return [
			'source-type'		=> ['default' => 'url',                 'valid' => ['inline', 'url', 'sql', 'custom-field', 'id', 'tags'], 'hidden' => false, 'description' => 'Woher kommt die Liste gezählter Wörter? Möglich sind url, inline, sql, post oder page id sowie custom-field'],
			'count-words'	    => ['default' => false,                 'valid' => 'bool',   'hidden' => false, 'description' => 'Enthält die Quelle Text und müssen die Wörter erst gezählt werden?'],
            'enable-frontend-edit' => ['default' => 0,                  'valid' => 'bool','hidden' => false, 'description' => 'Zeigt im Frontend ein Textfeld an, damit der Besucher die WordCloud selber bearbeiten kann.'],
			'enable-ocr'        => ['default' => 0,                     'valid' => 'bool','hidden' => false, 'description' => 'Ermögliche das Hinzufügen von Texten direkt von der Kamera des Gerätes.'],
			'style'	=> ['default' => 'canvas',                          'valid' => ['canvas', 'html'], 'hidden' => false, 'description' => 'Du kannst eine WordCloud als Canvas (also Bild) oder mit HTML-Tags erstellen.'],
			'ocr-language'      => ['default' => 'deu',                 'hidden' => false, 'description' => 'Eine Liste unterstützter Sprachen und ihr Kürzel findest du hier: https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016. Du kannst mehrere Sprache mit Plus getrennt angeben (deu+eng).'],
			'ocr-local-libraries' => ['default' => 0,                   'valid' => 'bool', 'hidden' => false, 'description' => 'Du kannst alle benötigten JavaScript-Dateien auch von deinem Server aus anbieten (siehe dazu die Doku).'],
			'max-image-size'    => ['default' => '1024',                'hidden' => false, 'description' => 'Die maximale Höhe bzw. Breite des Bildes (je nachdem, was überschritten wird).'],
			'min-word-length'	=> ['default' => 2,                     'hidden' => false, 'description' => 'Wie lange muss ein Wort mindestens sein, um gezählt zu werden?'],
			'min-word-occurence'=> ['default' => 2,                     'hidden' => false, 'description' => 'Wie oft muss ein Wort mindestens vorkommen, um in der Word Cloud gezeichnet zu werden?'],
			'black-list'     	=> ['default' => 'der die das',         'valid' => 'text','hidden' => false, 'description' => 'Wörter (z.B. Funktionswörter), die beim Zählen ignoriert werden sollen. Die Wörter werden hier mit Leerzeichen getrennt angegeben.'],
			'enable-black-list'	=> ['default' => 1,                     'valid' => 'bool','hidden' => false, 'description' => 'Nutze die Blacklist.'],
			'enable-custom-black-list'	=> ['default' => 1,             'valid' => 'bool', 'hidden' => false, 'description' => 'Soll der Nutzer Wörter per Klick aus der Wortcloud entfernen können?'],
			'persistent-custom-black-list'	=> ['default' => 1,         'valid' => 'bool','hidden' => false, 'description' => 'Bleibt die benutzerdefinierte Blacklist erhalten, wenn der Nutzer einen neuen Text hinzufügt?'],
			'ignore-chars'		=> ['default' => '\(\)\[\]\,\.;',       'hidden' => false, 'description' => 'Regulärer Ausdruck um bestimmte Zeichen beim Zählen von Wörtern zu ignorieren.'],
			'text-transform'	=> ['default' => 'uppercase',           'valid' => ['uppercase', 'lowercase', 'none'], 'hidden' => false, 'description' => 'Sollen alle Wörter groß- oder kleingeschrieben werden?'],
			
            'min-alpha'			=> ['default' => 0.1,                   'hidden' => false, 'description' => 'Der Mindestwert für die Transparenz der Wörter. Setze den Wert auf 1 für gar keine Transparenz.'],
            'size-factor'		=> ['default' => 100,                    'hidden' => false, 'description' => 'Mit diesem Wert kannst du die Größe der Wörter beeinflussen. Je kleiner der Wert, desto größer die Wörter in der WordCloud.'],

            'canvas-width'		=> ['default' => '1024px',              'hidden' => false, 'description' => 'Lege die Breite des Canvas fest.'],
			'canvas-height'		=> ['default' => '800px',               'hidden' => false, 'description' => 'Lege die Höhe des Canvas fest.'],

            'background-color'	=> ['default' => 'rgba(255,255,255,0)', 'hidden' => false, 'description' => 'Der Hintergrund des Canvas. Nutze entweder die rgba() oder Hex-Angabe.'],
            'grid-size'			=> ['default' => 1,                     'hidden' => false, 'description' => 'Hiermit kannst du die Abstände zwischen den Wörtern erhöhen.'],
			'font-family'		=> ['default' => 'Arial, sans-serif',   'hidden' => false, 'description' => 'Die CSS-Angabe für die verwendete Schriftart.'],
			'min-size'			=> ['default' => 1,                     'hidden' => false, 'description' => 'Wie groß muss ein Wort sein, um in der WordCloud angezeigt zu werden?'],
			'font-weight'		=> ['default' => 'bold',                'hidden' => false, 'description' => 'Das Gewicht der Wörter (bold, normal oder z.B. als Ziffer: 100)'],
			'min-rotation'		=> ['default' => 0,                     'hidden' => false, 'description' => 'Um wieviel Rad sollen die Wörter mindestens gedreht werden?'],
			'max-rotation'		=> ['default' => 0,                     'hidden' => false, 'description' => 'Um wieviel Rad sollen die Wörter höchstens gedreht werden?'],
			'rotate-ratio'		=> ['default' => 0,                     'hidden' => false, 'description' => 'Mit welcher Wahrscheinlichkeit sollen Wörter gedreht werden? (1 - alle, 0 - keine Wörter werden gedreht)'],
			'shape'				=> ['default' => 'circle',              'valid' => ['circle', 'cardioid', 'diamond', 'triangle', 'pentagon', 'star', 'square', 'triangle-forward'], 'hidden' => false, 'description' => 'Welche Form soll die WordCloud haben?'],
			'draw-out-of-bound'	=> ['default' => 1,                     'valid' => 'bool','hidden' => false, 'description' => 'Sollen auch Wörter dargestellt werden, die nicht mehr auf die Zeichenfläche passen?'],
			'shrink-to-fit'	    => ['default' => 0,                     'valid' => 'bool','hidden' => false, 'description' => 'Verkleinere das Wort, damit es auf die Zeichenfläche passt?'],
			'shuffle'			=> ['default' => 1,                     'valid' => 'bool','hidden' => false, 'description' => 'Soll die Position der Wörter bei jedem Durchlauf neu durchgemischt werden?'],
			'ellipticity'		=> ['default' => 1,                     'hidden' => false, 'description' => 'Wie elliptisch soll die WordCloud sein (0 - flach, 1 - kreisförmig)'],
			'clear-canvas'		=> ['default' => 1,                     'valid' => 'bool','hidden' => false, 'description' => 'Soll die Zeichenfläche vor jedem Durchlauf neu gezeichnet werden?'],
			'debug'     		=> ['default' => 0,                     'valid' => 'bool','hidden' => false, 'description' => 'Wenn du Probleme mit dem Plugin hast, kannst du hier die Ausgabe von zusätzlichen Informationen in der Konsole des Browsers aktivieren.'],
			
            'id'				=> ['default' => "1",                   'hidden' => true, 'description' => 'Id die für die Word Cloud verwendet wird. Muss auf Seitenebene eindeutig sein.'],
			'list'				=> ['default' => [],                    'hidden' => true, 'description' => 'Enthält die Liste gezählter Wörter.'],
			'data'				=> ['default' => NULL,                  'hidden' => true, 'description' => 'Text oder gezählte Wörter.']
			
        ];
        
    }

    function wp_word_cloud_register_settings() {
    

        foreach (wp_word_cloud_get_global_settings() as $name => $value) {

            add_option($name, $value['default']);
            register_setting( 'wp_word_cloud_settings', $name);

        }

    
    }    

    function wp_word_cloud_register_options_page() {

        add_options_page('WP Word-Cloud', 'WP Word-Cloud', 'manage_options', 'wp-word-cloud', 'wp_word_cloud_options_page');
    
    }

    function wp_word_cloud_options_page() {
            // TODO: Pretify Settings Page
            ?>
              <div>
              <?php screen_icon(); ?>
              <h2>WP Word-Cloud</h2>
              <p>Hier kannst du die Standardeinstellungen anpassen. Die Standard-Einstellungen können überschrieben werden, wenn du den Parameter direkt im Shortcode übergibst.
                  Zum Beispiel: [wp-word-cloud source-type="url"][/wp-word-cloud] 
              </p>
              <form method="post" action="options.php">
              <?php settings_fields( 'wp_word_cloud_settings' ); ?>
              <h3>Einstellungen</h3>
              <table>
              <?php
                    foreach (wp_word_cloud_get_global_settings() as $name => $value) {
                        echo '<tr><td>'.is_bool(get_option($name)).'</td></tr>';

                        if ($value['hidden'] === FALSE) {

                            echo '<tr valign="top"><td scope="row">';
                                echo '<label for="'.$name.'">'.$name.'</label>';
                            echo '</td><td>';

                            // add select input if it's a limited option
                            if (is_array($value['valid'])) {

                                echo '<select name="'.$name.'" size=1>';
                                foreach ($value['valid'] as $key => $option) {
                                    
                                    echo '<option value="'.$option.'" '.selected(get_option($name), $option).'>'.$option.'</option>';

                                }
                                echo '</select>';

                            } else if ($value['valid'] == 'text') {

                                echo '<textarea id="'.$name.'" name="'.$name.'">'.get_option($name).'</textarea>';

                            // add checkbox if it is a true/false option
                            } else if ($value['valid'] == 'bool') {

                                echo '<input type="checkbox" id="'.$name.'" value=1 name="'.$name.'" '.checked(1, get_option($name), false).'>';

                            } else {

                                echo '<input type="text" id="'.$name.'" name="'.$name.'" value="'.esc_attr(get_option($name)).'"';
                            
                            }

                            echo '</td><td>';
                            echo $value['description'];
                            echo '</td></tr>';

                        }  
                        
                    }
              ?>
              </table>
              <?php  submit_button(); ?>
              </form>
              </div>
         <?php
    }

    

