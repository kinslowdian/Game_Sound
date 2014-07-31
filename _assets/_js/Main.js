	
	var trace = function(str){ console.log(str); };
	
	var preload;
	
	
	$(document).ready( function(){ thisReady(); } );
	
	function thisReady()
	{
		sound_init();
		
		$("#soundOpt")[0].addEventListener("click", mainClick_init, false);
	}
	
	function mainClick_init(event)
	{
		$("#soundOpt")[0].removeEventListener("click", mainClick_init, false);
		
		$("#soundOpt").css("pointer-events", "none");
		
		$(".tween-soundOpt")[0].addEventListener("webkitTransitionEnd", mainClick_remove, false);
		$(".tween-soundOpt")[0].addEventListener("transitionend", mainClick_remove, false);
	
		$("#soundOpt").css("opacity", "0");
		
		sound_play({id: "BGM_BG_FOREST", loop: Infinity, volume: 1});
		
		whale_test();
	}
	
	function mainClick_remove(event)
	{
		$(".tween-soundOpt")[0].removeEventListener("webkitTransitionEnd", mainClick_remove, false);
		$(".tween-soundOpt")[0].removeEventListener("transitionend", mainClick_remove, false);
		
		$("#soundOpt").remove();		
	}
	
	/////////// SOUND
	
	function sound_init()
	{
		if(!createjs.Sound.initializeDefaultPlugins())
		{
			trace("NO_SOUND_SUPPORT");
			
			mainClick_init(null);
		}
		
		else
		{
            var assetsPath = "_assets/_sound/";
            
            var manifest =	[
                				{src:"bg_forest.mp3", id:"BGM_BG_FOREST"},
								{src:"fx_splash.mp3", id:"BGM_FX_SPLASH"}
							];			
		
			createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this)); // add an event listener for when load is completed
			createjs.Sound.registerManifest(manifest, assetsPath);
		}
	}
	
    function sound_loaded(event) 
    {

    }
    
    function sound_play(target) 
    {
        //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
            
		var instance = createjs.Sound.play(target.id, createjs.Sound.INTERRUPT_NONE, 0, 0, target.loop, target.volume);
            
        if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED) 
        { 
         	return; 
        }
		 
		instance.addEventListener ("complete", function(instance) 
		{
		 
		});
	}
	
	/////////// SOUND
	
	function whale_test()
	{
		trace("whale_test();");
		
		$(".tween-whaleSprite")[0].addEventListener("webkitAnimationStart", whale_animationStart, false);
		$(".tween-whaleSprite")[0].addEventListener("animationstart", whale_animationStart, false);

		$(".tween-whaleSprite")[0].addEventListener("webkitAnimationEnd", whale_animationEnd, false);
		$(".tween-whaleSprite")[0].addEventListener("animationend", whale_animationEnd, false);
		
		// TO CATCH ENTER_FRAME OF ANIMATION
		// $(".tween-whaleSprite")[0].addEventListener("webkitAnimationIteration", whale_animationEnd, false);
		// $(".tween-whaleSprite")[0].addEventListener("animationiteration", whale_animationEnd, false);
	}
	
	function whale_animationStart(event)
	{
		$("#whaleMain").removeClass("tween-whaleSpriteSafety");
	}
	
	function whale_animationEnd(event)
	{
		var exitFrame;
		
		trace(event);
		
		$("#whaleMain").addClass("tween-whaleSpriteSafety");
		$("#whaleMain").removeClass("tween-whaleSprite");
		$("#whaleMain .whaleSprite").removeClass("tween-waterAmbience");
		
		exitFrame = setTimeout(function()
		{ 
			$("#whaleMain").addClass("tween-whaleSprite"); 
			$("#whaleMain .whaleSprite").addClass("tween-waterAmbience");
		
		}, 20);
		
		sound_play({id: "BGM_FX_SPLASH", loop: 0, volume: 1});
	}