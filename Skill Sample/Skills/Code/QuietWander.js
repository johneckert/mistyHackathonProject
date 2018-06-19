function Activate() {
	misty.Debug("Starting Quiet Wander skill!!");
	misty.MoveHeadPosition(-1, 0, 0, 50);	

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
	
	misty.UnregisterEvent("CenterTOF");
	misty.UnregisterEvent("LeftTOF");
	misty.UnregisterEvent("RightTOF");
	misty.UnregisterEvent("BackTOF");
}

/* Callbacks */

function GetListOfAudioClips_Callback() {
	misty.Debug("Audio list callback called!");
	misty.ChangeDisplayImage("Happy.jpg");
	Drive();    	
}


function TimeOfFlight_Callback() {
	
	/*TODO if left or right sensor, or far enough away, could simply steer with wall instead of stopping*/
	var data = misty.GetEventData("FrontTOF");
	frontTOF = JSON.parse(data);
	
	/*
	misty.Debug("frontTOF: " + frontTOF);
	misty.Debug("frontTOF.PropertyTestResults: " + frontTOF.PropertyTestResults);
	misty.Debug("frontTOF.PropertyTestResults[0]: " + frontTOF.PropertyTestResults[0]);
	misty.Debug("frontTOF.PropertyTestResults[1]: " + frontTOF.PropertyTestResults[1]);
	misty.Debug("frontTOF.PropertyTestResults[0].PropertyValue: " + frontTOF.PropertyTestResults[0].PropertyValue);
	misty.Debug("frontTOF.PropertyTestResults[0].PropertyParent: " + frontTOF.PropertyTestResults[0].PropertyParent);
	misty.Debug("frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters: " + frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters);
	*/
	if (frontTOF !== undefined && frontTOF.PropertyTestResults[0] !== undefined && frontTOF.PropertyTestResults[0].PropertyParent != undefined && frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters < 0.6) {
		misty.Stop();
		misty.Debug("FRONT Time Of Flight triggered - Distance in meters = " + frontTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters + " - SensorPosition : " + frontTOF.PropertyTestResults[0].PropertyParent.SensorPosition);
		
		RegisterEvents(false);
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
	Drive();
		
}

function BackTimeOfFlight_Callback() {
	var data = misty.GetEventData("BackTOF")

	misty.Debug("back: " + data);

	var backTOF = JSON.parse(data);
	
	if (backTOF !== undefined && backTOF.PropertyTestResults[0] !== undefined && backTOF.PropertyTestResults[0].PropertyParent != undefined && backTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters < 0.6) {
		misty.Stop();
		misty.Debug("BACK Time Of Flight triggered - Distance in meters = " + backTOF.PropertyTestResults[0].PropertyParent.DistanceInMeters);		
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
	
	if (goingForward) {
		misty.UnregisterEvent("BackTOF");		
		misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
		misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.6, "double");
		misty.RegisterEvent("FrontTOF", "TimeOfFlight_Callback", "TimeOfFlight", 100);
	}
	else {		
		misty.UnregisterEvent("FrontTOF");

		misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
		misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.6, "double");
		misty.RegisterEvent("BackTOF", "BackTimeOfFlight_Callback", "TimeOfFlight", 100);
	}
}
