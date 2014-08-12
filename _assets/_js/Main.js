	
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
													{src:"fx_splash.mp3", id:"BGM_FX_SPLASH"},
													{src:"bgm_tune.mp3", id:"BGM_TUNE"}
												];
            
			createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this)); // add an event listener for when load is completed
			createjs.Sound.registerManifest(soundEffects_pedal.main.manifest, soundEffects_pedal.main.assetsPath);	            
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
			sound_list("fx_splash", {id: "BGM_FX_SPLASH", loop: 0, volume: 1}, {paused:true, storeInstance: true});

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
		
/*
		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			// _SOUND.instance.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);
		
			// _SOUND.instance.play();
		
			_SOUND.instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);
		}
*/
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
		// soundEffects_pedal = {};
		
		// soundEffects_pedal.level_tune = sound_run({id: "BGM_TUNE", loop: -1, volume: 1, uniqueId: "LEVEL_BGM"}, false, true);
		
		// sound_list(true, "level_tune", {target: {id: "BGM_TUNE", loop:-1, volume: 1, uniqueId: "LEVEL_BGM"}, paused: false, returnInstance: true});		
		
		sound_refreshList();
		
		sound_list("level_tune", {id: "BGM_TUNE", loop: -1, volume: 1}, {paused:false, storeInstance: true});
		sound_list("quick", {id: "BGM_FX_SPLASH", loop: -1, volume: 1}, {paused:false, storeInstance: true});
	}