	
	var trace = function(str){ console.log(str); };
	
	var preload;
	
	var soundEffects_pedal;
	
	var weatherFX = false;
	
	
	$(document).ready( function(){ thisReady(); } );
	
	function thisReady()
	{
		sound_init(setup_step0);
	}
	
	function setup_step0()
	{
    	var css; 
    	
    	$("#soundOpt_loader")[0].addEventListener("webkitTransitionEnd", setup_step1, false);
		$("#soundOpt_loader")[0].addEventListener("transitionend", setup_step1, false);
		
		css = 	{
					"-webkit-transform" : "translateY(-200%)",
					"transform" 		: "translateY(-200%)",
					"opacity"			: "0"
				};
		
		
		$("#soundOpt_loader").css(css);
		
				
	}
	
	function setup_step1(event)
	{
		$("#soundOpt_loader")[0].removeEventListener("webkitTransitionEnd", setup_step1, false);
		$("#soundOpt_loader")[0].removeEventListener("transitionend", setup_step1, false);
		
		$("#soundOpt_loader_wrapper").remove();
		
		$("#soundOpt")[0].addEventListener("click", mainClick_init, false);
		$("#rabbit0")[0].addEventListener("click", test_rabbit, false);
		$("#crow0")[0].addEventListener("click", test_crow, false);
		$(".whaleSprite")[0].addEventListener("click", test_whale, false);
		
		
		$(".tree-sound").each(function(i, treeBlock)
		{
			var _id = $(treeBlock).attr("id");
			
			$("#" + _id)[0].addEventListener("click", test_trees, false);	
		});
		
		$("#soundOpt_prompt").css("opacity", "1");	
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
	
		seaTest();
	}
	
	function mainClick_remove(event)
	{
		$(".tween-soundOpt")[0].removeEventListener("webkitTransitionEnd", mainClick_remove, false);
		$(".tween-soundOpt")[0].removeEventListener("transitionend", mainClick_remove, false);
		
		$("#soundOpt").remove();		
	}
	
	/////////// SOUND
	
	function sound_init(callBack)
	{
		soundEffects_pedal = {};
		
		var soundTest_support = createjs.Sound.initializeDefaultPlugins();
		
		if(soundTest_support == false || soundTest_support == undefined || soundTest_support == null)
		{
			trace("NO_SOUND_SUPPORT");
			
			soundEffects_pedal = null;
			
			mainClick_init(null);
		}
		
		if(soundTest_support == true)
		{
            trace("SOUND_SUPPORT");
            
            soundEffects_pedal.main = {};
            
            if(callBack)
            {
	         	soundEffects_pedal.main.soundSetupCallBack = callBack;   
            }
            
            soundEffects_pedal.main.fileCount = 0;
            
            soundEffects_pedal.main.assetsPath = "_assets/_sound/";
            
		    soundEffects_pedal.main.manifest =	[
		                							{src:"bg_forest.ogg", id:"BGM_BG_FOREST"},
													{src:"bg_sea.ogg", id:"BGM_BG_SEA"},
													{src:"fx_splash.ogg", id:"BGM_FX_SPLASH"},
													{src:"fx_crow.ogg", id:"BGM_FX_CROW"},
													{src:"fx_squeak.ogg", id:"BGM_FX_RABBIT"},
													{src:"fx_moo.ogg", id:"BGM_FX_WHALE"},
													{src:"fx_trees.ogg", id:"BGM_FX_TREES"}
												];
            
			createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this)); // add an event listener for when load is completed
			createjs.Sound.registerManifest(soundEffects_pedal.main.manifest, soundEffects_pedal.main.assetsPath);
			
			soundEffects_pedal.main.playCountMax = 6;
			soundEffects_pedal.main.enterFrame_in = null;
			soundEffects_pedal.main.enterFrame_out = null;
			soundEffects_pedal.main.fadeValue = 0.01;	            
		}
	}
	
	function sound_loaded(event)
	{
		trace(event);
		
		soundEffects_pedal.main.fileCount ++;
		
		if(soundEffects_pedal.main.fileCount == soundEffects_pedal.main.manifest.length)
		{
			// setup();
			
			sound_refreshList();
			
			sound_list("level_bg_forest", {id: "BGM_BG_FOREST", loop: -1, volume: 1}, {paused:true, storeInstance: true, singleChannel: true});
			sound_list("level_bg_sea", {id: "BGM_BG_SEA", loop: -1, volume: 0}, {paused:true, storeInstance: true, singleChannel: true});
			
			sound_list("fx_splash", {id: "BGM_FX_SPLASH", loop: -1, volume: 0.05}, {paused:true, storeInstance: true, singleChannel: true});
			sound_list("fx_crow", {id: "BGM_FX_CROW", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: false});
			sound_list("fx_rabbit", {id: "BGM_FX_RABBIT", loop: 0, volume: 0.06}, {paused:true, storeInstance: true, singleChannel: false});
			sound_list("fx_whale", {id: "BGM_FX_WHALE", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: true});
			
			sound_list("fx_trees", {id: "BGM_FX_TREES", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: false});

			// SAFETY - FLUSH
			soundEffects_pedal.main.fileCount = 0;
			
			createjs.Sound.removeEventListener("fileload", createjs.proxy(sound_loaded, this));
			
			if(soundEffects_pedal.main.soundSetupCallBack)
			{
				soundEffects_pedal.main.soundSetupCallBack();	
			}
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
		
		soundEffects_pedal.soundList[soundRef].eventTimer = null;
		
		
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
			
			_SOUND.playCount = 0;
			
			if(_SOUND.options.paused)
			{
				instance.stop();
			}
			
			if(_SOUND.options.storeInstance)
			{
				_SOUND.instance = instance;
				
				_SOUND.instance.uniqueId = soundRef;
			
				_SOUND.instance.addEventListener("complete", sound_end);
			}			
		}		
	}
	
	function sound_play(soundRef, callBack)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		if(_SOUND != undefined)
		{
			if(_SOUND.instance.playState === "playFinished" || !_SOUND.options.singleChannel && _SOUND.playCount < soundEffects_pedal.main.playCountMax)
			{
				_SOUND.instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);
				
				_SOUND.instance.uniqueId = soundRef;
				
				if(callBack)
				{
					_SOUND.onEndCallBack = callBack;
				}
				
				_SOUND.playCount++;
				
				if(_SOUND.options.singleChannel || _SOUND.playCount >= soundEffects_pedal.main.playCountMax)
				{
					_SOUND.instance.addEventListener("complete", sound_end);	
				}				
			}
		}
	}
	
	function sound_end(event)
	{
		var _SOUND = soundEffects_pedal.soundList[event.target.uniqueId];
		
		trace("?????????????");
		trace(_SOUND);
		trace("?????????????");
		
		_SOUND.playCount = 0;
		
		_SOUND.instance.removeEventListener("complete", sound_end);
		
		if(_SOUND.onEndCallBack)
		{
			if(_SOUND.onEndCallBack.call_params)
			{
				_SOUND.onEndCallBack.call_funct.apply(this, _SOUND.onEndCallBack.call_params);
			}
			
			else
			{
				_SOUND.onEndCallBack.call_funct();
			}
			
			
			
			// _SOUND.onEndCallBack();
			
			delete _SOUND.onEndCallBack;
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
	
	function sound_fadeInit(soundRef, volTarget, fadeType, onEnd)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef]; 
		
		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			if(fadeType === "IN")
			{
				// sound_fadeInit("sound_name", 1, "IN", {call_funct: end_function, call_params: ["parameter0", 1, object2]});
				
				soundEffects_pedal.main.enterFrame_in = setInterval(sound_fadeRun, 20, _SOUND.instance, volTarget, fadeType, soundRef, onEnd);
			}
			
			if(fadeType === "OUT")
			{
				// sound_fadeInit("sound_name", 0, "OUT", {call_funct: end_function});
				
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
						// BASIC FUNCTION
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
				
				trace(vol);
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
	
	function sound_purge()
	{
		for(var soundOBJ in soundEffects_pedal.soundList)
		{
			sound_stop(soundEffects_pedal.soundList[soundOBJ].ref);
		}
		
		sound_refreshList();		
	}

	
	/////////// SOUND
	
	
	
	
	/////////// CLICKS
	
	function test_rabbit(event)
	{
		sound_play("fx_rabbit");
	}
	
	function test_crow(event)
	{
		char_faceChange("crow0", "map-enemy_40x40_head_default", "map-enemy_40x40_head_fear")
		
		sound_play("fx_crow", {call_funct: char_faceChange, call_params: ["crow0", "map-enemy_40x40_head_fear", "map-enemy_40x40_head_default"]});
	}
	
	function test_whale(event)
	{
		sound_play("fx_whale", {call_funct: whale_stageFX});
		
		if(!weatherFX)
		{
			weatherFX = true;
			
			$("#weather").css("opacity", "1");
		}
		
	}
	
	function test_trees(event)
	{
		trace("test_trees");
		
		sound_play("fx_trees");
	}
	
	/////////// CLICKS
	
	
	
	
	/////////// TESTS
	
	function seaTest()
	{
		var s = setTimeout(seaTestRun, 1.6 * 1000);
	}
	
	function seaTestRun()
	{
		var css_sea;
		
		css_sea = 	{	
						"-webkit-transform" : "translateY(0)",
						"transform" : "translateY(0)"
					};
		
		$(".tween-sea")[0].addEventListener("webkitTransitionEnd", seaTestRun0, false);
		$(".tween-sea")[0].addEventListener("transitionend", seaTestRun0, false);		
		
		$("#sea").css(css_sea);
		
		$(".waterEdge_fx").css("opacity", "1");
	
		sound_play("level_bg_sea");
		
		sound_fadeInit("level_bg_sea", 1, "IN");
	}
	
	function seaTestRun0(event)
	{
		trace("END");
		
		$(".tween-sea")[0].removeEventListener("webkitTransitionEnd", seaTestRun0, false);
		$(".tween-sea")[0].removeEventListener("transitionend", seaTestRun0, false);
		
		whale_test();		
		
		sound_fadeInit("level_bg_forest", 0, "OUT");
	}
	
	
	function whale_test()
	{
		trace("whale_test();");
		
		$("#whaleMain").addClass("tween-whaleSprite"); 
		$("#whaleMain .whaleSprite").addClass("tween-waterAmbience");
		
		$(".tween-whaleSprite")[0].addEventListener("webkitAnimationStart", whale_animationStart, false);
		$(".tween-whaleSprite")[0].addEventListener("animationstart", whale_animationStart, false);

		$(".tween-whaleSprite")[0].addEventListener("webkitAnimationEnd", whale_animationEnd, false);
		$(".tween-whaleSprite")[0].addEventListener("animationend", whale_animationEnd, false);
	}
	
	function whale_stageFX()
	{
		$("#weather").css("opacity", "0");
		
		$(".tween-Weather")[0].addEventListener("webkitTransitionEnd", whale_stageFX_end, false);
		$(".tween-Weather")[0].addEventListener("transitionend", whale_stageFX_end, false);
	}
	
	function whale_stageFX_end(event)
	{
		$(".tween-Weather")[0].removeEventListener("webkitTransitionEnd", whale_stageFX_end, false);
		$(".tween-Weather")[0].removeEventListener("transitionend", whale_stageFX_end, false);
	
		weatherFX = false;
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
		
		$("#whaleMain").addClass("tween-whaleSpriteSafety");
		$("#whaleMain").removeClass("tween-whaleSprite");
		$("#whaleMain .whaleSprite").removeClass("tween-waterAmbience");
		
		sound_fadeInit("fx_splash", 0, "OUT", {call_funct: whale_delay, call_params: [ Math.floor(Math.random() * 3) + 1 ]});
	}
	
	function whale_delay(s)
	{
		var wd = setTimeout(whale_test, s * 1000);
	}
	
	function char_faceChange(npc, class_r, class_a)
	{
		var classCheck;
		
		classCheck = $("#" + npc + " .map-enemy_40x40-head").attr("class").search(class_a);
		
		if(classCheck < 0)
		{
			trace("ACCESS");
			
			$("#" + npc + " .map-enemy_40x40-head").removeClass(class_r).addClass(class_a);
		}		
	}	
	
	/////////// TESTS
	
	