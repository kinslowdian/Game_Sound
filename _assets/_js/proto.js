
Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)

createjs.Sound.play(target.id, createjs.Sound.INTERRUPT_NONE, 0, 0, target.loop, 1);


	soundEffects_pedal = {};
	
	
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
	
	
	
	soundEffects_pedal.soundList = {};
	
	soundEffects_pedal.soundList["test"] = {};
		
	soundEffects_pedal.soundList["test"].ref = "test";
	soundEffects_pedal.soundList["test"].options = {};
	
	build("level_bg_forest", {id: "BGM_BG_FOREST", loop: -1, volume: 1}, {paused:true, storeInstance: true});
	
	
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
	
	
	function sound_list(soundRef, soundOptions, soundSettings)
	{
		soundEffects_pedal.soundList[soundRef] = {};
		
		soundEffects_pedal.soundList[soundRef].ref = soundRef;
		
		soundEffects_pedal.soundList[soundRef].instance = null;
		
		soundEffects_pedal.soundList[soundRef].options = {};
		soundEffects_pedal.soundList[soundRef].options = soundOptions;
		
		soundEffects_pedal.soundList[soundRef].settings = {};
		soundEffects_pedal.soundList[soundRef].settings = soundSettings;
		
		soundEffects_pedal.soundList[soundRef].exists = false;
		
		sound_run(soundRef);		
	}
	
	function sound_run(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
		
		var instance = createjs.Sound.play(_SOUND.options.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.options.loop, _SOUND.options.volume);
		
		if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED)
		{
			_SOUND.exists = false;
			
			return;
		}
		
		else
		{
			_SOUND.exists = true;
			
			if(_SOUND.settings.paused)
			{
				instance.stop();
			}
			
			if(_SOUND.settings.storeInstance)
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
		
		if(_SOUND.exists && _SOUND.instance)
		{
			_SOUND.instance.play(_SOUND.options.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.options.loop, _SOUND.options.volume);
		}
	}
	
	function sound_stop(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		if(_SOUND.exists && _SOUND.instance)
		{
			_SOUND.instance.stop();	
		}
	}
	
	function sound_volume(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		
		if(_SOUND.exists && _SOUND.instance)
		{
			_SOUND.instance.setVolume(newVolume);
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

	
	
	
	