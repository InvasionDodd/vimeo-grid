(function( $ ){

  $.fn.vimeoGrid = function(options) {
    
    return this.each(function() {
      
      var settings = {
        vimeoUsername : 'calango'
      };
      
      if ( options ) { 
        $.extend( settings, options );
      }
      
      var apiEndpoint = 'http://vimeo.com/api/v2/';
      var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json'
      var oEmbedCallback = 'switchVideo';
      var vimeoUsername = settings.vimeoUsername;
      var vidObArray;
      var usingSquare = true;

      var numAccross = 0;
      var spaceX = 0;
      var spaceY = 0;
      var colInc = 0;
      var rowInc = 0;
      var totalSquareAmount = 0;
      var div = 0;
      var imageLoadInt = 0;
      var curVidId = 0;
      var allLoaded = false;
      var vidObArray = [];
      var vidData;
      
      $('#exceptions').css({opacity : 0.0});
  	  
  	  if($(window).width() > 1110){
  	    $('#videoThumbContainer').css({'width' : '100%'});
  	    $('body').css({'overflow' : 'hidden'});
  	  }else{
  	    $('#videoThumbContainer').css({'width' : '1110px'});
  	    $('body').css({'overflow' : 'auto'});
  	  }
  	  
  	  $('#videoViewOverlay').css({'width' : $(window).width() + 'px', 'height' : $(window).height() + 'px'});
  	  
      loadVimeoStream();
      
      function loadVimeoStream(){
    	  $.getJSON(apiEndpoint + vimeoUsername + '/videos.json?callback=?', function(data){
    	    vidData = data;
      	  createVidLayout();
    	  });
    	}

    	function findClosestEven(num){
    		if (num%2 != 0){
    			findClosestEven(num + 1);
    		}else{
    			totalSquareAmount = num;
    		}
    	}
    	
    	function findClosestSquare(num){
    	  if(Math.sqrt(num)%1 != 0){
    	    findClosestSquare(num + 1)
    	  }else{
    	    totalSquareAmount = num;
    	  }
    	}
    	  
    	function createVidLayout(){  
    	  allLoaded = true;
    	  imageLoadInt = 0;
    	  vidObArray = [];
    	  
    	  $('#videoThumbContainer').html('');
    	  
    		for(var i = 0; i<vidData.length; i++){
    		  vidObArray.push(vidData[i]);
    		}
    		
    		var num = vidObArray.length;
    		
    		if(Math.sqrt(num)%1 != 0){
    	    findClosestSquare(num + 1)
    	  }else{
    	    totalSquareAmount = num;
    	  }
    	  
    	  if(totalSquareAmount - vidObArray.length > 1){
    	    if(num%2 != 0){
      			findClosestEven(num);
      		}else{
      			totalSquareAmount = num;
      		}
      		usingSquare = false;
    	  }
    		
    		$('#exceptions').hide();
    		
    		createGrid();
    		
    	}

    	function createGrid(){
    	  colInc = 0;
    		rowInc = 0;
        div = Math.ceil(Math.sqrt(totalSquareAmount));
    		numAccross = div-1;
    		spaceX = Math.round($(window).width()/div);
    		if(usingSquare == false){
    		  spaceY = Math.round($(window).height()/(totalSquareAmount / div));
    		}else{
    		  spaceY = Math.round($(window).height()/div);
    		}

    		for (var i = 0; i < totalSquareAmount; i++) {
    		  if(i < vidObArray.length){
    		    var html = '<div class="vidThumb" id="vidThumb_' + vidObArray[i].id + '"></div>';
    		  }else{
    		    var html = '<div class="vidThumb" id="vidThumb' + (i + 1) + '"></div>';
    		  }
    			

    			$('#videoThumbContainer').append(html);
          
          if(i < vidObArray.length){
    			  $('#vidThumb_' + vidObArray[i].id).css({'position' : 'absolute', 'width' : spaceX + 'px', 'height' : spaceY + 'px', 'left' : (colInc * spaceX) + 'px', 'top' : (rowInc * spaceY) + 'px'});
  			  }else{
  			    $('#vidThumb' + (i + 1)).css({'position' : 'absolute', 'width' : spaceX + 'px', 'height' : spaceY + 'px', 'left' : (colInc * spaceX) + 'px', 'top' : (rowInc * spaceY) + 'px'});
  			  }

    			if(colInc == numAccross){
    				colInc = 0;
    			 	rowInc++;
    			}else{
    				colInc++;
    			}
    			
    		}
    		
    		if($.address.value() != "/"){
    		  curVidId = $.address.value();
    	    openVideo();
    	  }

    		loadImagesInOrder();

    	}

    	function loadImagesInOrder(){
    	  console.log(vidObArray[imageLoadInt]);
    		loadImage(vidObArray[imageLoadInt].thumbnail_large);
    	}

    	function loadImage(imUrl){

    		var img = new Image();

    		$(img).load(function(){
          
    			$('#vidThumb_' + vidObArray[imageLoadInt].id).hide();
    			
    			$('#vidThumb_' + vidObArray[imageLoadInt].id).html('');

    			var img_prop = 1;
    			var tw = 0;
    			var th = 0;
    			var tx = 0;
    			var ty = 0;
    			
    			if(spaceY/spaceX > this.height/this.width) {
            img_prop = this.width/this.height;
          	th = spaceY;
          	tw = spaceY * img_prop;
          	ty = ((spaceY/2)-(th/2));
          	tx = ((spaceX/2)-(tw/2));
          }else if(spaceY/spaceX <= this.height/this.width){
          	img_prop = this.height/ this.width;
          	tw = spaceX;
          	th = spaceX * img_prop;
          	ty = ((spaceY/2)-(th/2));
          	tx = ((spaceX/2)-(tw/2));
          }

    		 	$(this).css({'z-index' : '500', 'position' : 'absolute', 'width' : tw + 'px', 'height' : th + 'px', 'margin-left' : tx + 'px', 'margin-top' : ty + 'px'});
    		 	
    		 	$('#vidThumb_' + vidObArray[imageLoadInt].id).append(this);
    		 	
    		 	$('#vidThumb_' + vidObArray[imageLoadInt].id).append('<div class="videoInfoBlock" style="z-index:600;position:absolute;width:' + spaceX + 'px;height:' + spaceY + 'px;"><div class="videoInfoBack" style="position:absolute;width:' + spaceX + 'px;height:' + spaceY + 'px;" ></div><div class="videoInfoText"><div class="videoTitle">' + vidObArray[imageLoadInt].title + '</div><div class="viewVideoButton" style="top:' + (spaceY - 30) + 'px;">PLAY →</div></div></div>');
    		 	
    		 	$('#vidThumb_' + vidObArray[imageLoadInt].id).fadeIn('slow');
    		 	
    		 	addThumbMouseEvents();
    		 	
    		 	if(imageLoadInt + 1 < vidObArray.length){
    		 	  imageLoadInt++;
    		 	  loadImage(vidObArray[imageLoadInt].thumbnail_large);
    		 	}

    		}).error(function () {

    		}).attr('src', imUrl);
    	}
    	
    	function addThumbMouseEvents(){
    	  $('.vidThumb').unbind();
    	  $('.vidThumb').bind('mouseenter', vidThumbOver);
      	$('.vidThumb').bind('mouseleave', vidThumbOut);
      	$('.vidThumb').bind('click', vidThumbClick);
      	$('#videoViewOverlay').bind('click', vidOverlayClick);
    	}
    	
    	function vidThumbOver(e){
    	  $(this).find('.videoInfoBlock').stop().animate({opacity:  1.00}, 300);
    	}
    	
    	function vidThumbOut(e){
    	  $(this).find('.videoInfoBlock').stop().animate({opacity:  0.00}, 1000);
    	}
    	
    	function vidThumbClick(e){
    	  curVidId = $(this).attr('id').substr(9, $(this).attr('id').length);
    	  $.address.value(curVidId);
  	  }
  	  
  	  function openVideo(){
  	    
  	    if(curVidId.substr(0, 1) == "/"){
  	      curVidId = curVidId.substr(1, curVidId.length);
  	    }
  	    
    	  $('#videoViewOverlay').show();
    	  $('#videoViewOverlay').css({opacity : 0.0});
    	  $('#videoViewOverlay').stop().animate({opacity:  0.80}, 300);
    	  
    	  $('#videoBox').show();
    	  $('#videoBox').css({opacity : 0.0});
    	  $('#videoBox').stop().delay(300).animate({opacity:  1.00}, 300);
    	  
    	  var vidHtml = '<iframe src="http://player.vimeo.com/video/' + curVidId + '" width="800" height="450" frameborder="0"></iframe>';
    	  $('#videoBox').html(vidHtml);
    	  $('#videoBox').css({'left' : ($(window).width()/2) - 400 + 'px', 'top' : (($(window).height()/2) - 250) + 'px'});
    	}
    	
    	$.address.change(function(event) {
    	  if(allLoaded == true){
    	    var ad = event.value;
      	  if(ad != "/"){
      	    openVideo();
      	  }else{
      	    closeVideo();
      	  }
    	  }
  	  });
    	
    	function vidOverlayClick(e){
    	   $.address.value('/');
    	}
    	
    	function closeVideo(){
    	  $('#videoViewOverlay').stop().animate({opacity:  0.00}, 300);
    	  setTimeout(function(){$('#videoViewOverlay').hide()}, 300);
    	  
    	  $('#videoBox').stop().animate({opacity:  0.00}, 300);
    	  setTimeout(function(){$('#videoBox').hide();$('#videoBox').html('');}, 300);
    	}
    	
    	$(window).resize(function(){
    
    	  if($(window).width() > 1110){
    	    $('#videoThumbContainer').css({'width' : '100%'});
    	    $('body').css({'overflow' : 'hidden'});
    	  }else{
    	    $('#videoThumbContainer').css({'width' : '1110px'});
    	    $('body').css({'overflow' : 'auto'});
    	  }
    	  
    	  $('#videoViewOverlay').css({'width' : $(window).width() + 'px', 'height' : $(window).height() + 'px'});
    	  
    	  $('#videoBox').css({'left' : ($(window).width()/2) - 400 + 'px', 'top' : (($(window).height()/2) - 250) + 'px'});
    	  
    	  createVidLayout();
    	  
  	  });
    });
  };
})( jQuery );
