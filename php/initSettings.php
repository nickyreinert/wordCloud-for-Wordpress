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
			'source'			=> ['default' => 'edit-field',          'hidden' => false, 'description' => 'Woher kommt die Liste gezählter Wörter? Möglich sind edit-field, sql und custom-field'],
			'source-definition'	=> ['default' => NULL,                  'hidden' => false, 'description' => 'Enthält je nach Quelle entweder eine SQL-Abfrage den Namen eines custom fields.'],
			'count-words'	    => ['default' => 0,                     'hidden' => false, 'description' => 'Enthält die Quelle Text und müssen die Wörter erst gezählt werden?'],
			'min-word-length'	=> ['default' => 2,                     'hidden' => false, 'description' => 'Wie lange muss ein Wort mindestens sein, um gezählt zu werden?'],
			'min-word-occurence'=> ['default' => 2,                     'hidden' => false, 'description' => 'Wie oft muss ein Wort mindestens vorkommen, um in der Word Cloud gezeichnet zu werden?'],
			'black-list'     	=> ['default' => 'der die das',         'hidden' => false, 'description' => 'Wörter (z.B. Funktionswörter), die beim Zählen ignoriert werden sollen. Die Wörter werden hier mit Leerzeichen getrennt angegeben.'],
			'enable-black-list'	=> ['default' => 1,                     'hidden' => false, 'description' => 'Nutze die Blacklist.'],
			'custom-black-list'	=> ['default' => 1,                     'hidden' => false, 'description' => 'Soll der Nutzer Wörter per Klick aus der Wortcloud entfernen können?'],
			'persistent-custom-black-list'	=> ['default' => 1,         'hidden' => false, 'description' => 'Bleibt die benutzerdefinierte Blacklist erhalten, wenn der Nutzer einen neuen Text hinzufügt?'],
			'ignore-chars'		=> ['default' => '\(\)\[\]\,\.;',       'hidden' => false, 'description' => 'Regulärer Ausdruck um bestimmte Zeichen beim Zählen von Wörtern zu ignorieren.'],
			'background-color'	=> ['default' => 'rgba(255,255,255,0)', 'hidden' => false, 'description' => NULL],
			'grid-size'			=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'font-family'		=> ['default' => 'Arial, sans-serif',   'hidden' => false, 'description' => NULL],
			'min-size'			=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'font-weight'		=> ['default' => 'bold',                'hidden' => false, 'description' => NULL],
			'min-rotation'		=> ['default' => 0,                     'hidden' => false, 'description' => NULL],
			'max-rotation'		=> ['default' => 0,                     'hidden' => false, 'description' => NULL],
			'size-factor'		=> ['default' => 40,                    'hidden' => false, 'description' => NULL],
			'shape'				=> ['default' => 'circle',              'hidden' => false, 'description' => NULL],
			'draw-out-of-bound'	=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'shuffle'			=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'canvas-width'		=> ['default' => '1024px',              'hidden' => false, 'description' => NULL],
			'canvas-height'		=> ['default' => '800px',               'hidden' => false, 'description' => NULL],
			'ellipticity'		=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'use-demo-text'		=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'demo-text'		    => ['default' => 'Lorem Ipsum ',        'hidden' => false, 'description' => NULL],
			'text-transform'	=> ['default' => 'uppercase',           'hidden' => false, 'description' => NULL],
			'clear-canvas'		=> ['default' => 1,                     'hidden' => false, 'description' => NULL],
			'min-alpha'			=> ['default' => 0.1,                   'hidden' => false, 'description' => NULL],
			'id'				=> ['default' => "1",                   'hidden' => true, 'description' => 'Id die für die Word Cloud verwendet wird. Muss auf Seitenebene eindeutig sein.']
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
              <h2>Wordpress Word-Cloud</h2>
              <form method="post" action="options.php">
              <?php settings_fields( 'wp_word_cloud_settings' ); ?>
              <h3>Einstellungen</h3>
              <table>
              <?php
                    foreach (wp_word_cloud_get_global_settings() as $name => $value) {

                        if ($value['hidden'] === FALSE) {

                            echo '<tr valign="top"><th scope="row">';
                                echo '<label for="'.$name.'">'.$name.'</label>';
                            echo '</th><td>';
                                echo '<input type="text" id="'.$name.'" name="'.$name.'" value="'.get_option($name).'"';
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

    

