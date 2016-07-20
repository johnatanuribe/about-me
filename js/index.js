// SMOOTH SCROLLING SECTIONS
$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
           if (target.length) {
             $('html,body').animate({
                 scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});

//Type Moving

jQuery(document).ready(function($){
    //set animation timing
    var animationDelay = 2500,
        //loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        lettersDelay = 50,
        //type effect
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
        //clip effect 
        revealDuration = 600,
        revealAnimationDelay = 1500;
    
    initHeadline();
    

    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($('.cd-headline.letters').find('b'));
        //initialise headline animation
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function(){
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function(){
            var headline = $(this);
            
            if(headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
            } else if (headline.hasClass('clip')){
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type') ) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function(){
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            };

            //trigger animation
            setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        
        if($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting'); 
            setTimeout(function(){ 
                parentSpan.removeClass('selected'); 
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
        
        } else if($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
                switchWord($word, nextWord);
                showWord(nextWord);
            });

        } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
            setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

        } else {
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
                setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');
        
        if(!$letter.is(':last-child')) {
            setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
        } else if($bool) { 
            setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
        }

        if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        } 
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');
        
        if(!$letter.is(':last-child')) { 
            setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
        } else { 
            if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
            if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }
});



// svg path for target icon
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
// svg path for plane icon
var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";

AmCharts.makeChart("chartdiv", {
  type: "map",
  fontSize:20,
  balloon:{horizontalPadding:20, verticalPadding:15},
  dataProvider: {
    map: "worldLow",
    zoomLevel: 2,
    zoomLongitude: -50,
    zoomLatitude: 0,

    lines: [{
      id: "line1",
      arc: -0.85,
      alpha: 0.3,
      latitudes: [6.27053, 37.7749295],
      longitudes: [-75.57211999999998, -122.4194155]
    }, {
      id: "line2",
      alpha: 0,
      color: "#000000",
      latitudes: [6.27053, 37.7749295],
      longitudes: [-75.57211999999998, -122.4194155]
    }],
    images: [{
      svgPath: targetSVG,
      title: "Medellin",
      latitude: 6.27053,
      longitude: -75.57211999999998
    }, {
      svgPath: targetSVG,
      title: "San Francisco",
      latitude: 37.7749295,
      longitude: -122.4194155
    }, {
      svgPath: planeSVG,
      positionOnLine: 0,
      color: "#000000",
      alpha: 0.1,
      animateAlongLine: true,
      lineId: "line2",
      flipDirection: false,
      loop: true,
      scale: 0.03,
      positionScale: 1.3
    }, {
      svgPath: planeSVG,
      positionOnLine: 0,
      color: "#20335C",
      animateAlongLine: true,
      lineId: "line1",
      flipDirection: false,
      loop: true,
      scale: 0.03,
      positionScale: 1.8
    }]
  },

  areasSettings: {
    unlistedAreasColor: "#3CD3B6"
    
  },

  imagesSettings: {
    color: "#20335C",
    rollOverColor: "#20335C",
    selectedColor: "#00CCE6",
    pauseDuration: 0.2,
    animationDuration: 2.5,
    adjustAnimationSpeed: true
  },

  linesSettings: {
    color: "#585869",
    alpha: 0.4
  }
});


//MOUSE PARALLAX
// dependencies - gsap tweenlite + cssPlugin (23kb gzipped)

var layerOneSpeed = 1
var layerTwoSpeed = 2
var mouseSensitivity = 10

var xPos
var yPos 

var bg = document.querySelector("#bg");
bg.addEventListener("mousemove", parallax, false);

function parallax(e) {

   xPos = (e.pageX / mouseSensitivity);
   yPos = (e.pageY / mouseSensitivity);

    moveLayers ()
}

// no mouse on touch so lets use the accelerometer 
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(e) {

    var beta = e.beta;
    var gamma = e.gamma;
    var temp = 0;

    // take account of device orientation
    switch (window.orientation) {
      case -90:
        temp = -gamma;
        gamma = beta;
        beta = temp;
        break;
      case 90:
        temp = gamma;
        gamma = beta;
        beta = temp;
        break;
    }
    
     yPos = beta
     xPos = gamma

   moveLayers ()

  }, false);

}

function moveLayers () {
   TweenLite.to('.layer1', layerOneSpeed, {
      x: xPos,
      y: -yPos,
      ease: Power4.easeOut
    })

    TweenLite.to('.layer2', layerTwoSpeed, {
      x: -xPos,
      y: yPos,
      ease: Power4.easeOut
    })
}