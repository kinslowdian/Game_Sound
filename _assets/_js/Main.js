	
	var trace = function(str){ console.log(str); };
	
	var preload;
	
	var soundEffects_pedal;
	
	
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
	
		seaTest();
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
		soundEffects_pedal = {};
		
		if(!createjs.Sound.initializeDefaultPlugins())
		{
			trace("NO_SOUND_SUPPORT");
			
			soundEffects_pedal = null;
			
			mainClick_init(null);
		}
		
		else
		{
            soundEffects_pedal.main = {};
            
            soundEffects_pedal.main.fileCount = 0;
            
            soundEffects_pedal.main.assetsPath = "_assets/_sound/";
            
		    soundEffects_pedal.main.manifest =	[
		                							{src:"bg_forest.mp3", id:"BGM_BG_FOREST"},
		                							{src:"bg_sea.mp3", id:"BGM_BG_SEA"},
													{src:"fx_splash.mp3", id:"BGM_FX_SPLASH"},
													{src:"bgm_tune.mp3", id:"BGM_TUNE"}
												];
            
			createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this)); // add an event listener for when load is completed
			createjs.Sound.registerManifest(soundEffects_pedal.main.manifest, soundEffects_pedal.main.assetsPath);
			
			soundEffects_pedal.main.enterFrame_in = null;
			soundEffects_pedal.main.enterFrame_out = null;
			soundEffects_pedal.main.fadeValue = 0.01;	            
		}
	}
	
	function sound_loaded(event)
	{
		soundEffects_pedal.main.fileCount ++;
		
		if(soundEffects_pedal.main.fileCount == soundEffects_pedal.main.manifest.length)
		{
			setup();
			
			sound_refreshList();
			
			sound_list("level_bg_forest", {id: "BGM_BG_FOREST", loop: -1, volume: 1}, {paused:true, storeInstance: true});
			sound_list("level_bg_sea", {id: "BGM_BG_SEA", loop: -1, volume: 0}, {paused:true, storeInstance: true});
			sound_list("fx_splash", {id: "BGM_FX_SPLASH", loop: -1, volume: 0.08}, {paused:true, storeInstance: true});

			// SAFETY - FLUSH
			soundEffects_pedal.main.fileCount = 0;
		}		
	}
	
	function sound_refreshList()
	{
		soundEffects_pedal.soundList = {};
	}
    
	function sound_list(soundRef, soundSettings, soundOptions)
	{
		soundEffects_pedal.soundList[soundRef] = {};
		
		soundEffects_pedal.soundList[soundRef].ref = soundRef;
		
		soundEffects_pedal.soundList[soundRef].instance = null;
		
		soundEffects_pedal.soundList[soundRef].settings = {};
		soundEffects_pedal.soundList[soundRef].settings = soundSettings;
		
		soundEffects_pedal.soundList[soundRef].options = {};
		soundEffects_pedal.soundList[soundRef].options = soundOptions;
		
		soundEffects_pedal.soundList[soundRef].exists = false;
		
		sound_run(soundRef);		
	}
    
	function sound_run(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
		
		var instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);
		
		if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED)
		{
			_SOUND.exists = false;
			
			return;
		}
		
		else
		{
			_SOUND.exists = true;
			
			if(_SOUND.options.paused)
			{
				instance.stop();
			}
			
			if(_SOUND.options.storeInstance)
			{
				_SOUND.instance = instance;
			}
		}
		
		instance.addEventListener("complete", function(instance)
		{
			
		});			
	}
	
	function sound_play(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		trace(_SOUND);
		
		if(_SOUND != undefined)
		{
			_SOUND.instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);
		}
	}
	
	function sound_stop(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			_SOUND.instance.stop();	
		}
	}
	
	function sound_volume(soundRef, soundVolume)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			_SOUND.instance.setVolume(soundVolume);
		}
	}
	
	function sound_purge()
	{
		for(var soundOBJ in soundEffects_pedal.soundList)
		{
			sound_stop(soundEffects_pedal.soundList[soundOBJ].ref);
		}
		
		sound_refreshList();		
	}

	
	/////////// SOUND
	
	function whale_test()
	{
		trace("whale_test();");
		
		$("#whaleMain").addClass("tween-whaleSprite"); 
		$("#whaleMain .whaleSprite").addClass("tween-waterAmbience");
		
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
		$(".tween-whaleSprite")[0].removeEventListener("webkitAnimationStart", whale_animationStart, false);
		$(".tween-whaleSprite")[0].removeEventListener("animationstart", whale_animationStart, false);
		
		
		$("#whaleMain").removeClass("tween-whaleSpriteSafety");
		
		sound_play("fx_splash");
	}
	
	function whale_animationEnd(event)
	{
		var exitFrame;
		
		var soundTest;
		
		// trace(event);
		
		$("#whaleMain").addClass("tween-whaleSpriteSafety");
		$("#whaleMain").removeClass("tween-whaleSprite");
		$("#whaleMain .whaleSprite").removeClass("tween-waterAmbience");
		
		
		sound_stop("fx_splash");
		
		
		exitFrame = setTimeout(whale_test, 1.5 * 1000);
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
		sound_refreshList();
		
		sound_list("level_tune", {id: "BGM_TUNE", loop: -1, volume: 1}, {paused:false, storeInstance: true});
		sound_list("quick", {id: "BGM_FX_SPLASH", loop: -1, volume: 0.05}, {paused:false, storeInstance: true});
	}
	
	function seaTest()
	{
		var s = setTimeout(seaTestRun, 2000);
	}
	
	function seaTestRun()
	{
		var css_sea;
		
		css_sea = 	{	
						"-webkit-transform" : "translateY(0)",
						"transform" : "translateY(0)"
					};
		
		// $("#sea").css("height", "100%");
		
		$("#sea").css(css_sea);
		
		$(".waterEdge_fx").css("opacity", "1");
	
		$("#sea .tween-sea")[0].addEventListener("webkitTransitionEnd", seaTestRun0, false);
		$("#sea .tween-sea")[0].addEventListener("transitionend", seaTestRun0, false);
	
	
		sound_play("level_bg_sea");
		
		sound_fadeInit("level_bg_sea", 1, "IN", {call_funct: test_done, call_params: ["OH", "MY", "GOD"]});
	}
	
	function seaTestRun0(event)
	{
		$("#sea .tween-sea")[0].removeEventListener("webkitTransitionEnd", seaTestRun0, false);
		$("#sea .tween-sea")[0].removeEventListener("transitionend", seaTestRun0, false);
	
		sound_fadeInit("level_bg_forest", 0, "OUT", {call_funct: test_basic});
	}
	
	function sound_fadeInit(soundRef, volTarget, fadeType, onEnd)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef]; 
		
		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			if(fadeType === "IN")
			{
				soundEffects_pedal.main.enterFrame_in = setInterval(sound_fadeRun, 20, _SOUND.instance, volTarget, fadeType, soundRef, onEnd);
			}
			
			if(fadeType === "OUT")
			{
				soundEffects_pedal.main.enterFrame_out = setInterval(sound_fadeRun, 20, _SOUND.instance, volTarget, fadeType, soundRef, onEnd);
			}			
		}
	}
	
	function sound_fadeRun(soundInstance, volTarget, fadeType, soundRef, onEnd)
	{
		var vol = soundInstance.getVolume();
		
		//// IN
		
		if(fadeType === "IN")
		{
			if(vol < volTarget)
			{
				soundInstance.setVolume(vol += soundEffects_pedal.main.fadeValue);
			}
				
			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_in);
					
				soundInstance.setVolume(volTarget);
				
				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);	
					}
					
					else
					{
						onEnd.call_funct();	
					}
				}
			}
		}		
		
		
		//// OUT
		
		if(fadeType === "OUT")
		{
				
			if(vol > volTarget)
			{
				soundInstance.setVolume(vol -= soundEffects_pedal.main.fadeValue);
			}
				
			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_out);
					
				soundInstance.setVolume(volTarget);
					
				sound_stop(soundRef);
				
				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);	
					}
					
					else
					{
						onEnd.call_funct();	
					}
				}
			}
		}		
	}
	
	function test_done(x, y, z)
	{
		trace("test_done(); " + x + " " + y + " " + z); 
	}
	
	function test_basic()
	{
		trace("BASIC!!!!!!!!!!!!!!!!!!!!!!!!!");
	}
	
	