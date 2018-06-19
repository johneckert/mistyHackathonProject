function Activate() {
	misty.Debug("Starting Wander skill!!");
	misty.MoveHeadPosition(-1, 0, 0, 50);	
	misty.PlayAudioClip("UmmMmmUmm");

	misty.ChangeLED(255, 80, 0);/*Orange*/	
	misty.ChangeDisplayImage("Groggy.jpg");

	misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);	
	misty.ChangeLED(148, 0, 211);/*Purple*/
	
	misty.RandomPause(1000, 1500);
	misty.GetListOfAudioClips();  //Audio clips
}


function Deactivate() {
	misty.Stop();
	misty.StopMapping();   
	misty.ChangeLED(0, 0, 0);/*Off*/
	misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);	
	misty.ChangeDisplayImage("Content.jpg");
}

function GetRandomSound() {
	misty.Debug("Get random sound");
	misty.ChangeLED(30, 144, 255); /*Blue*/
	var callbackData = misty.GetCallbackData("GetListOfAudioClips_Callback");
	
	if (callbackData !== undefined && callbackData !== "") {
		
		var obj = JSON.parse(callbackData);
		if (obj.Result.length > 0) {
			var randomInt = Math.floor(Math.random() * obj.Result.length);
			return obj.Result[randomInt].Name;
		}
	}
	return "OooOooo";
}


/* Callbacks */

function GetListOfAudioClips_Callback() {
	misty.Debug("Audio list callback called!");
	misty.ChangeDisplayImage("Happy.jpg");
	Drive();    	
}


function TimeOfFlight_Callback() {
	
	/*TODO if left or right sensor, or far enough away, could simply steer with wall instead of stopping*/
	var data = misty.GetEventData("FrontTOF")

	var frontTOF = JSON.parse(data);

	if (frontTOF !== undefined && frontTOF.DistanceInMeters !== undefined && frontTOF.DistanceInMeters < 0.6) {
		misty.Stop();
		misty.Debug("FRONT Time Of Flight triggered - Distance in meters = " + frontTOF.DistanceInMeters + " - SensorPosition : " + frontTOF.SensorPosition);
		misty.Drive(-10, 0, 0, 1000);
		misty.Stop();

		if(Math.round(Math.random()) === 0)
		{
			misty.Drive(0, -40, 0, 1000);
		}
		else
		{
			misty.Drive(0, -20, 0, 1000);		
		}
	}
	/*misty.Stop();*/
	Drive();
		
}

function BackTimeOfFlight_Callback() {
	var data = misty.GetEventData("BackTOF")

	var backTOF = JSON.parse(data);
	
	if (backTOF !== undefined && backTOF.DistanceInMeters !== undefined &&  backTOF.DistanceInMeters < 0.6) {
		misty.Stop();
		misty.Debug("BACK Time Of Flight triggered - Distance in meters = " + backTOF.DistanceInMeters);		
		misty.Drive(10, 0, 0, 1500);
		if(Math.round(Math.random()) === 0)
		{
			misty.Drive(0, -30, 0, 2500);
		}
		else
		{
			misty.Drive(0, -20, 0, 1500);
		}
	}
	Drive();
}

/* Motions */
function Drive() {

	misty.Debug("Drive!");

	RegisterEvents(true);
	if(Math.round(Math.random()) === 0)
	{
		misty.Drive(20, 0, 0, 500);
		misty.Drive(30, 0, 0, 500);
		misty.Drive(40, 0, 0, 500);
		var sound = GetRandomSound();
		misty.PlayAudioClip(sound);
		misty.Drive(50, -10);
	
	}
	else
	{
		misty.Drive(10, 00, 0, 1000);
		misty.Drive(20, 0, 0, 1000);
		misty.Drive(20, 0, 0, 1000);
		misty.Drive(40, 10);
	}
}

/*Event reg method*/
function RegisterEvents(goingForward) {
	
	if(goingForward) {
		misty.RegisterStateEvent("FrontTOF", "TimeOfFlight_Callback", "FrontTOF", 100);
		misty.UnregisterEvent("BackTOF");
	}
	else {		
		misty.RegisterStateEvent("BackTOF", "BackTimeOfFlight_Callback", "BackTOF", 100);
		misty.UnregisterEvent("FrontTOF");
	}
}