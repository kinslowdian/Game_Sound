	
	var trace = function(str){ console.log(str); };
	
	var preload;
	
	var effects_pedal;
	
	
	$(document).ready( function(){ thisReady(); } );
	
	function thisReady()
	{
		sound_init();
	}
	
	function setup()
	{
		$("#soundOpt")[0].addEventListener("click", mainClick_init, false);
		$("#rabbit0")[0].addEventListener("click", test_rabbit, false);
		$("#crow0")[0].addEventListener("click", test_crow, false);
		$(".whaleSprite")[0].addEventListener("click", test_whale, false);
    
		$("#soundOpt h1").css("opacity", "1");		
	}
	
	function mainClick_init(event)
	{
		$("#soundOpt")[0].removeEventListener("click", mainClick_init, false);
		
		$("#soundOpt").css("pointer-events", "none");
		
		$(".tween-soundOpt")[0].addEventListener("webkitTransitionEnd", mainClick_remove, false);
		$(".tween-soundOpt")[0].addEventListener("transitionend", mainClick_remove, false);
	
		$("#soundOpt").css("opacity", "0");
		
		/////// HACK FOR iOS
		createjs.WebAudioPlugin.playEmptySound();
		/////// HACK FOR iOS
		
		
		sound_play("level_bg_forest");
		
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
								{src:"fx_splash.mp3", id:"BGM_FX_SPLASH"},
								{src:"bgm_tune.mp3", id:"BGM_TUNE"}
							];			
		
			createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this)); // add an event listener for when load is completed
			createjs.Sound.registerManifest(manifest, assetsPath);
		}
	}
	
    function sound_loaded(event) 
    {
		setup();
		
		sound_list();
    }
    
    function sound_list()
    {
		effects_pedal = {};
		
		effects_pedal.level_bg_forest = sound_run({id: "BGM_BG_FOREST", loop: -1, volume: 1, uniqueId: "LEVEL_BG_FOREST"}, true, true);
		
		effects_pedal.fx_splash = sound_run({id: "BGM_FX_SPLASH", loop: 0, volume: 1, uniqueId: "WHALE_SPLASH"}, true, true);	    
    }
    
	function sound_run(target, paused, returnInstance)
	{
		//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
		
		var instance = createjs.Sound.play(target.id, createjs.Sound.INTERRUPT_NONE, 0, 0, target.loop, target.volume);
		
		if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED)
		{
			return;
		}
		
		else
		{
			if(paused)
			{
				instance.stop();	
			}
			
			if(target.uniqueId)
			{
				instance.uniqueId = target.uniqueId;
			}
			
			if(returnInstance)
			{
				return instance;
			}
		}
		
		instance.addEventListener("complete", function(instance)
		{
			
		});		
	}
	
	function sound_volume(soundID, newVolume)
	{
		if(effects_pedal[soundID])
		{
			effects_pedal[soundID].setVolume(newVolume);	
		}
	}
	
	function sound_play(soundID)
	{
		if(effects_pedal[soundID])
		{
			effects_pedal[soundID].play();	
		}
	}
	
	function sound_stop(soundID)
	{
		if(effects_pedal[soundID])
		{
			effects_pedal[soundID].stop();	
		}
	}
	
	function sound_purge()
	{
		trace("sound_purge();");
		
		for(var soundOBJ in effects_pedal)
		{
			effects_pedal[soundOBJ].stop();
		}
		
		effects_pedal = {};
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
		
		var soundTest;
		
		// trace(event);
		
		$("#whaleMain").addClass("tween-whaleSpriteSafety");
		$("#whaleMain").removeClass("tween-whaleSprite");
		$("#whaleMain .whaleSprite").removeClass("tween-waterAmbience");
		
		exitFrame = setTimeout(function()
		{ 
			$("#whaleMain").addClass("tween-whaleSprite"); 
			$("#whaleMain .whaleSprite").addClass("tween-waterAmbience");
		
		}, 20);
		
		sound_play("fx_splash");
	}
	
	function test_rabbit(event)
	{
		trace("test_rabbit();");
		
		sound_volume("level_bg_forest", 0.2);
	}
	
	function test_crow(event)
	{
		trace("test_crow();");
		
		sound_stop("level_bg_forest");
	}
	
	function test_whale(event)
	{
		trace("test_whale();");
		
		sound_purge();
		
		new_sound();
	}
	
	function new_sound()
	{
		effects_pedal = {};
		
		effects_pedal.level_tune = sound_run({id: "BGM_TUNE", loop: -1, volume: 1, uniqueId: "LEVEL_BGM"}, false, true);		
	}