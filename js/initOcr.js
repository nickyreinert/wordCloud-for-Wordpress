(function ($) {
    // thanks to  https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
    // for tutorial on how to take pictures with built in camera

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    var streaming = false;  // current status of camera stream
    var video = null;
    var canvas = null;
    var photo = null;

    $(".word-cloud-container").each(function () {

      var wpWordCloudSettings = getWordCloudSettings(this);
          
      // if ocr is enable, add button and overlay
      // user can take a picture of a document, which will be converted to text
      // and then counted and rendered 
      if (wpWordCloudSettings.enableOcr == 1) {

          // on mobile browser use media capture API 
          // which provides a better handling 
          // see https://w3c.github.io/html-media-capture/
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

          addMobileDeviceCaptureButton(this, wpWordCloudSettings);

        } else {

          addLocalDeviceCaptureButton(this, wpWordCloudSettings);

        }

        addLoader(wpWordCloudSettings);

      } 

    });

    function addLocalDeviceCaptureButton(target, wpWordCloudSettings) {

      $(target).find('.word-cloud-controller').prepend(
        '<button class="text-from-image" id="word-cloud-text-from-image-'+wpWordCloudSettings.id+'">Photo</button>');

      $(target).append(
          '<div class="text-from-image-container" id="text-from-image-container-'+wpWordCloudSettings.id+'"></div>');
  
      $('.text-from-image').click(function () {

        showCaptureControls(wpWordCloudSettings);
        
        startCapture(wpWordCloudSettings);
            
      });
  
    }

    function addLoader(wpWordCloudSettings) {
      
      var videoCaptureContainer =  $('#text-from-image-container-'+wpWordCloudSettings.id);

      $(videoCaptureContainer).parent().append('<div class="ocr-loader-container"><div class="ocr-loader"></div></div>');


    }

    function addMobileDeviceCaptureButton(target, wpWordCloudSettings) {
      
      $(target).find('.word-cloud-controller').prepend(
        '<input id="word-cloud-text-from-image-mobile-'+wpWordCloudSettings.id+'" type="file" accept="image/*" capture="camera">');

      var input = document.getElementById('word-cloud-text-from-image-mobile-'+wpWordCloudSettings.id);

      input.addEventListener('change', function(){
        var file = input.files[0];
        takePictureMobile(file, wpWordCloudSettings);
      }, false);

    }

    function removeCaptureControls(wpWordCloudSettings) {
        var videoCaptureContainer =  $('#text-from-image-container-'+wpWordCloudSettings.id);

        $(videoCaptureContainer).hide();
        $(videoCaptureContainer).children().remove();

    }

    function showCaptureControls(wpWordCloudSettings) {

        var videoCaptureContainer =  $('#text-from-image-container-'+wpWordCloudSettings.id);
        $(videoCaptureContainer).show();
        
        $(videoCaptureContainer)
            // add camera controls to ui
            // hide on init, otherwise you see this ugly gray box
            // until user confirms camera usage
            .append(
            '<div style="display: none;" class="ocr-camera-container">'+
            '<div class="ocr-hint">'+wpWordCloudSettings.ocrHint+'</div>'+
            
            '<video id="video-input-'+wpWordCloudSettings.id+'">Video stream not available.</video>'+
              '<canvas id="temp-canvas-'+wpWordCloudSettings.id+'"></canvas>'+
              '<img id="image-output-'+wpWordCloudSettings.id+'" alt="The screen capture will appear in this box. Click the image to re-capture" />'+
              '<div class="ocr-camera-controls">'+
                '<button class="close-ocr" id="close-ocr-'+wpWordCloudSettings.id+'">X</button>'+
                '<select class="device-selector" id="device-selector-'+wpWordCloudSettings.id+'"></select>'+
              '</div>'+
              '</div>'
            );

            $('#close-ocr-'+wpWordCloudSettings.id).on('click', function(){

              $(videoCaptureContainer).hide();
              $(videoCaptureContainer).empty();

              if (window.stream) {
                window.stream.getTracks().forEach(track => {
                  track.stop();
                });
              }

            })

    } 

    function startCapture(wpWordCloudSettings) {

        var videoCaptureContainer =  $('#text-from-image-container-'+wpWordCloudSettings.id);

        video = document.getElementById('video-input-'+wpWordCloudSettings.id);
        canvas = document.getElementById('temp-canvas-'+wpWordCloudSettings.id);
        image = document.getElementById('image-output-'+wpWordCloudSettings.id);
        deviceSelector = document.getElementById('device-selector-'+wpWordCloudSettings.id);

        // different camera selected
        deviceSelector.addEventListener('change', function(){

          if (window.stream) {
            window.stream.getTracks().forEach(track => {
              track.stop();
            });
          }

          if (this.value === '') {

            constraints = {
              audio: false,
              video: {        
                width: { ideal: 4096 },
                height: { ideal: 2160 },
                facingMode : 'environment'}
            };
    
          } else {
            
            constraints = {
              audio: false,
              video: {
                width: { ideal: 4096 },
                height: { ideal: 2160 },
                deviceId : {exact: this.value }
              }
            };
  
          }

          navigator.mediaDevices.getUserMedia(constraints)
          .then(function(stream) {
            window.stream = stream; // make stream available to console
            video.srcObject = stream;
            video.play();
          })
          .catch(function(e) {

            console.log("Could not start video stream from your camera: " + e.message, e.name);

          });

        });

        // get available devices
        navigator.mediaDevices.enumerateDevices()
          .then(function(deviceInfos){

            for (let i = 0; i !== deviceInfos.length; ++i) {

              if (deviceInfos[i].kind === 'videoinput') {
                
                const option = document.createElement('option');
                option.value = deviceInfos[i].deviceId;
                option.text = deviceInfos[i].label || `Camera ${deviceSelector.length + 1}`;
                deviceSelector.appendChild(option);


              } 
            
            }

          })
          .catch(function(e){

            console.log('Could not read supported devices: ', e.message, e.name);
            removeCaptureControls(wpWordCloudSettings);

          });

        constraints = {
            audio: false,
            video: {
              width: { ideal: 4096 },
              height: { ideal: 2160 },
              deviceId : {exact: this.value }}
        };


        // If you get `TypeError: navigator.mediaDevices is undefined`
        // serve your page via HTTPS, otherwise access will be blocked
        navigator.mediaDevices.getUserMedia(constraints)
          .then(function(stream) {
            window.stream = stream; // make stream available to console
            video.srcObject = stream;
            video.play();
          })
          .catch(function(e) {

            console.log("Could not start video stream from your camera: " + e.message, e.name);
            removeCaptureControls(wpWordCloudSettings);

          });
    
          video.addEventListener('canplay', function(ev){

            // actually show controls only 
            // if user confirms video stream
            $(videoCaptureContainer).find('div.ocr-camera-container').show();
            $('.ocr-hint').fadeOut(parseInt(wpWordCloudSettings.ocrHintFadeout));

            // if not already streaming, init streaming settings
            if (!streaming) {
              height = video.videoHeight / (video.videoWidth/width);
      
              // Firefox currently has a bug where the height can't be read from
              // the video, so we will make assumptions if this happens.
      
              if (isNaN(height)) {
                height = width / (4/3);
              }
      
              video.setAttribute('width', width);
              video.setAttribute('height', height);
              canvas.setAttribute('width', width);
              canvas.setAttribute('height', height);
              streaming = true;
            
            }
        }, false);
    
        video.addEventListener('click', function(event){
          
          takepicture(wpWordCloudSettings);
          
          event.preventDefault();

        }, false);

        image.addEventListener('click', function(event){
          
          $(video).show();

          $('.ocr-loader-container').hide();

        })
    
        clearImage();
      
      }
    
      // Fill the photo with an indication that none has been
      // captured.
    
      function clearImage() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        var data = canvas.toDataURL('image/png');
        image.setAttribute('src', data);

      }
    
      // Capture a photo by fetching the current contents of the video
      // and drawing it into a canvas, then converting that to a PNG
      // format data URL. By drawing it on an offscreen canvas and then
      // drawing that to the screen, we can change its size and/or apply
      // other changes before drawing it.
    
  function takepicture(wpWordCloudSettings) {
        
        var context = canvas.getContext('2d');

        if (width && height) {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
    
          var data = canvas.toDataURL('image/png');
          image.setAttribute('src', data);
          $(video).hide();

          ocrText(data, wpWordCloudSettings);
        
        } else {
                    
          clearImage();

        }

  };

  function takePictureMobile(file, wpWordCloudSettings) {

    var reader = new FileReader();
    
    reader.onload = function (e) {
      var data = e.target.result;

      ocrText(data, wpWordCloudSettings);

    };
 
    reader.readAsDataURL(file);
    
  }


  function ocrText(data, wpWordCloudSettings) {

    var videoCaptureContainer =  $('#text-from-image-container-'+wpWordCloudSettings.id);

    // now, as we have the document as an image,
    // pass it to tesseract and ocr' it
    const { createWorker } = Tesseract;

    const worker = createWorker({
      workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
      logger: m => document.getElementById('word-cloud-text-'+wpWordCloudSettings.id).textContent = m
    });

    $('.ocr-loader-container').show();

    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(data);

      document.getElementById('word-cloud-text-'+wpWordCloudSettings.id).textContent = text;

      await worker.terminate();

      $('.ocr-loader-container').hide();

      $(videoCaptureContainer).hide();
      $(videoCaptureContainer).empty();

      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }

    })();

  }

})(jQuery);
