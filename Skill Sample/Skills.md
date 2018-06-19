# Running Skills Directly on Misty
Misty has the ability to run javaScript locally on the robot. There are some temporary limitations when doing this, but the primary things to note are:

- JavaScript running on the robot *is not* able to interact with external data (no cloud calls)
- Skills running on the robot must be triggered to start/stop from an external request (more info below)



To Get started with your first skill, you'll need to begin with a meta file (Example `wander.json` can be found in this folder) which gives Misty a list of assets needed for the skill, and the code for your skill (example `Wander.js`) You'll then need to create a similarly name javaScript file that defines the execution logic. 

To start the execution of your skill, you just need to run 

**NOTE** You'll have to manually upload each sound and image file you'll be using in your skill using the API Explorer (Can be found at api-explorer.mistyrobotics.com or in this repo  /Useful Tools)

----

### General Skill Structure

All skills currently consist of two files.  A meta json file, named the same name as the skill, with a .json extension, and a JavaScript code file with a .js extension.

**Meta File**

The meta file contains information about the skill that is pertinent to how it runs.  .

An example meta file looks like this:

```json
{
  "Name": "Wander",
  "UniqueId" : "2b46b067-7f8a-4452-8b59-2a73f539760d",
  "Capabilities": ["display", "locomotion", "tof", “speaker”, “led”],
  "ManualOnlySkill": false,
  "Language":"javascript",
  "BroadcastDebug" : true
}
```

**Code File**

Currently the code requires an Activate() function and a Deactivate() function.  The Activate() function is called upon skill start and kicks off the skill.  The Deactivate function is called if a skill is cancelled.

A user may also create other methods, event and callback handlers as needed.

Single line comments are allowed using //, and multi-line comments are also allowed using /* comment */.

**Commands**

To use the misty commands, you can simply write the following line in your code, replacing the command and adding required parameters.

`misty.<COMMAND>(parameters);`

So, for example, to start driving, you would call this command with the appropriate linear and angular velocities.

`misty.Drive(50, 10);`

All of the Action and Get commands also allow a user to pass in a pre-pause value and a post-pause value, to add an optional delay before the command is run or after.  A common example of its use with the Drive command could be as follows.

```
misty.Drive(50, 10, 500, 1000);
misty.Stop();
```

These two commands would wait 500 milliseconds, start the robot driving and then pause execution for 1000 milliseconds (this would pause the skill execution but not the driving itself).  The Stop command would then be run, stopping the robot.

Some of the commands also cause callbacks to happen, or are slightly different depending on their need and will be discussed in the appropriate sections below.

In the following sections, fields designated within brackets are optional.  So Drive will be represented as:

`misty.Drive([double linearVelocity, double angularVelocity, [int prePause], [int postPause]);`

Note though, if you want to use postPause in the above example, you must place a value in any preceding optional arguments.

For more information about the purposes of the commands in this document, please refer to the [API documentation.](docs.mistyrobotics.com)

**Action Commands**

Action commands are commands that tell the robot to do something, but do not expect a response callback.  

```javascript
misty.CancelFaceTraining([int prePause], [int postPause]);

misty.ChangeDisplayImage(string fIleName, [int prePause], [int postPause]);

misty.ChangeEyes(double valence, double arousal, valence dominance, [int prePause], [int postPause]);

misty.ChangeLED(int red, int green, int blue, [int prePause], [int postPause]);

misty.ClearLearnedFaceById(string faceId, [int prePause], [int postPause]);

misty.ClearLearnedFaces(string faceId, [int prePause], [int postPause]);

misty.Drive(double linearVelocity, double angularVelocity, [int prePause], [int postPause]);

misty.DriveTime(double linearVelocity, double angularVelocity, int driveTime, [int prePause], [int postPause]);

misty.FollowPath(string pathString, [int prePause], [int postPause]);

misty.LocomotionTrack(double leftTrackSpeed, double rightTrackSpeed, [int prePause], [int postPause]);

misty.MoveArm(string arm, double position, double velocity, [int prePause], [int postPause]);

misty.MoveHead(double pitch, double roll, double yaw, [int prePause], [int postPause]);

misty.PlayAudioClip(string fIleName, [int prePause], [int postPause]);

misty.RevertDisplay([int prePause], [int postPause]);

misty.SlamReset([int prePause], [int postPause]);

misty.SlamSensorReboot([int prePause], [int postPause]);

misty.StartFaceDetection([int prePause], [int postPause]);

misty.StartFaceRecognition([int prePause], [int postPause]);

misty.StartFaceTraining(string faceId, [int prePause], [int postPause]);

misty.StartMapping([int prePause], [int postPause]);

misty.StartSlamRecording([int prePause], [int postPause]);

misty.StartTracking([int prePause], [int postPause]);

misty.Stop([int prePause], [int postPause]);

misty.StopActionPlan([int prePause], [int postPause]);

misty.StopFaceDetection([int prePause], [int postPause]);

misty.StopFaceRecognition([int prePause], [int postPause]);

misty.StopFaceTraining([int prePause], [int postPause]);

misty.StopMapping([int prePause], [int postPause]);

misty.StopSlamRecording([int prePause], [int postPause]);

misty.StopTracking([int prePause], [int postPause]);
```


**Get Commands**

Get commands are commands that return data via a callback method.

All commands here callback to the user implemented callback method of the name <COMMAND>_Callback() so a user should create a callback method to handle the data.

At the current time, the data is not passed into the method and must be retrieved when the callback is triggered using the misty.GetCallbackData command, using the name of the callback as the parameter.

An example use of the callbacks to get the audio list is as follows:

```javascript
function Activate() {
	misty.GetListOfAudioClips();
}



function GetListOfAudioClips_Callback() {
var callbackData = misty.GetCallbackData("GetListOfAudioClips_Callback");
if (callbackData) {
		var obj = JSON.parse(callbackData);
		if (obj.Result.length > 0) {
			var randomInt = Math.floor(Math.random() * obj.Result.length);
			misty.PlayAudioClip(obj.Result[randomInt].Name);
		}
	}

}
```

```
misty.GetBatteryLevel([int prePause], [int postPause]);

misty.GetDeviceInformation([int prePause], [int postPause]);

misty.GetHelp([int prePause], [int postPause]);

misty.GetLearnedFaces([int prePause], [int postPause]);

misty.GetListOfAudioClips([int prePause], [int postPause]);

misty.GetListOfAudioFiles([int prePause], [int postPause]);

misty.GetListOfImages([int prePause], [int postPause]);

misty.GetMap([int prePause], [int postPause]);

misty.GetPath([int prePause], [int postPause]);

misty.GetRawMap([int prePause], [int postPause]);

misty.GetSlamStatus([int prePause], [int postPause]);

misty.GetStringSensorValues([int prePause], [int postPause]);
```


**Callback Data Commands**

Events and Get commands return their data via callbacks and a user must implement a callback method if they wish to be informed when that data is ready.

Get callbacks are automatically set as the <COMMAND>_Callback, so the callback function for GetDeviceInformation is GetDeviceInformation_Callback.

Event Callback functions names are chosen by the user at event creation time.

Callbacks do not automatically populate their callback functions with the callback data, instead, if a user wishes to use that data, they must use the appropriate  command to retrieve that data for use and then parse it as needed.  This data does persist across event triggering,, so you may request the callback data as needed.

```javascript
misty.GetCallbackData(string callbackName);

misty.GetEventData(string eventName);
```

**Event Commands**

A user can register for events using a structure that is similar to websocket registration.

When an event is triggered, it currently unregisters the event to prevent more event commands from overriding the first call, which can become an issue with fast triggering events. This will probably become an option soon, but currently a user can simply re-register the event if desired  in the event callback function.

Creating an event requires calls to multiple commands for proper creation.  A user should create one or more property comparison tests and also add any return property fields they may need.

```javascript
misty.UnregisterEvent(string eventName);

misty.RegisterEvent(string eventName, string callbackMethod, string messageType, int debounce);

misty.AddPropertyTest()

misty.AddReturnProperty()

Timed Event Commands
```

A user can create a timed event, to callback to the skill after a certain period of time.  For now, that event is triggered once and removed, but a user can immediately re-register as needed in the callback.  The automatic unregistration of this event will be an option soon.

misty.RegisterTimerEvent(string eventName, string callbackMethod, callbackTimeInMs);

**User Triggered Events**

A user can create a user triggered event, to callback to the skill when an specific API command is called.  For now, that event is triggered once and removed, but a user can immediately re-register as needed in the callback.  The automatic unregistration of this event will be an option soon.

A user can register the event as follows:

`misty.RegisterUserEvent(string eventName, string callbackMethod);`

They may trigger this event by calling to the endpoint as a POST call:

`api/alpha/sdk/skills/event`

With a json body similar to:

```json
 {
 	"Skill": "MySkillName",
 	"EventName": "UserEventName",
 	"Payload": { "mydata": "two" }
 }
```

Where the Skill and EventName are required and must match the skill to call and the event name you used in that skill.  You should place any payload data you wish to send to the skill in the Payload field.

**State Data Commands**

At the current time, there are no global variables that work across called instances of the skill.  To use persistent data a user must use a misty command to set or get that data from the robot.
Currently, this data is not automatically deleted and may also be used across multiple skills if desired.

```javascript
misty.Set(string key, string value);

misty.Get(string key);

misty.Remove(string key);

misty.Keys();
```


**Helper Commands**

There are currently a few helper commands a user can use to help with their 
Misty skill development

```
misty.Pause(int delay);

misty.RandomPause(int minimumDelay, int maimumDelay)

misty.Debug(string debugInfo);
```


A skill must have BroadcaseDebug set to true in their meta file in order for Debug statements to be broadcast over websockets.  See the Skill Debugging section for more information.

**Skill Debugging**

The [SkillDebugger.html](/Tools) page has some capabilities to help a user run and test their code.  

Once a robot has started, you can select to Listen to the Skill Debugger, and if your skill is designated to Broadcast debug statements, all exceptions and calls to misty.Debug will be sent to the websocket listener.  

Each debug statement delays exceution by around 100 miliseconds to account for the websocket publishing limitations.  If you remove (or set to false) the BroadcastDebug setting, this information will not be broadcast and the delays will be removed.

You can also load or unload an individual skill, reload all the skills, get the skill list, cancel a skill, and force the robot to run a skill from this page.

At the current time, it is recommended that you convert your debug output to a string before publishing as follows:

`misty.Debug("Additional Results Data : " + JSON.stringify(obj.AdditionalResults));`
	
**Skill Examples**

Currently, reading the event information is a bit cumbersome, so below are some examples of basic skills that use and process events.

For a full skill sample, look a the wander skill in this directory

*User Event Driven Skill*

```
/*An example of using the user event capability.*/

function Activate() {
	misty.Debug("Starting User Event skill!!");	
	misty.ChangeLED(255, 80, 0);/*Orange*/	
	misty.ChangeDisplayImage("Groggy.jpg");
	misty.RegisterUserEvent("UserEvent", "User_Callback");
}

function Deactivate() {
	misty.Stop();
	misty.ChangeLED(0, 0, 0);/*Off*/
	misty.ChangeDisplayImage("Content.jpg");
}

function User_Callback() {
	misty.ChangeDisplayImage("Angry.jpg");
	var callbackData = misty.GetEventData("UserEvent");
	

if (callbackData !== undefined && callbackData !== "") {
	misty.Debug(callbackData);
}
else {
	misty.Debug("Empty user callback data");
}

misty.Pause(3000);
misty.ChangeDisplayImage("Content.jpg");
misty.RegisterUserEvent("UserEvent", "User_Callback"); 

}
```


*Timed Event Skill*

```
/*An example of using the timed event capability.*/

function Activate() {
	misty.Debug("Starting Timed Event skill!!");
	

misty.ChangeLED(255, 80, 0);/*Orange*/	
misty.ChangeDisplayImage("Groggy.jpg");

misty.RegisterTimerEvent("TimerEvent", "Timer_Callback", 5000);  

}

function Deactivate() {
	misty.Stop();
	misty.ChangeLED(0, 0, 0);/*Off*/
	misty.ChangeDisplayImage("Content.jpg");
}

function Timer_Callback() {
	misty.ChangeDisplayImage("Angry.jpg");
	var callbackData = misty.GetEventData("TimerEvent");
	

if (callbackData !== undefined && callbackData !== "") {
	misty.Debug(JSON.stringify(callbackData));
}
else {
	misty.Debug("Empty timer callback data");
}

misty.Pause(3000);
misty.ChangeDisplayImage("Content.jpg");
misty.RegisterTimerEvent("TimerEvent", "Timer_Callback", 5000);

}
```

*Face Recognition Skill*

```javascript
/* Basic skill to do something when it sees a known face */

function Activate() {
	misty.Debug("Starting Face Rec");
	misty.StartFaceRecognition();

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.AddPropertyTest("FaceRec", "PersonName", "!==", "unknown person", "string");
misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);

}

function FaceRec_Callback() {
	misty.Debug("Face rec callback");
	var obj = JSON.parse(misty.GetEventData("FaceRec"));
	

misty.Debug(JSON.stringify(obj));

if (obj !== undefined && obj.PropertyTestResults[0] !== undefined && obj.PropertyTestResults[0].PropertyParent != undefined && obj.PropertyTestResults[0].PropertyParent.PersonName != undefined && obj.PropertyTestResults[0].PropertyParent.PersonName != "unknown person") {
	misty.Debug("Person Name: " + obj.PropertyTestResults[0].PropertyParent.PersonName);
	switch (obj.PropertyTestResults[0].PropertyParent.PersonName.toLowerCase()) {
		case "joe":
			RespondToFace("Happy.jpg", "004-WhaooooO.wav");
			break;			
		case "mary":
			RespondToFace("Happy.jpg","003-UmmMmmUmm.wav);
			break;
	}
}

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.AddPropertyTest("FaceRec", "PersonName", "!==", "unknown person", "string");
misty.RegisterEvent("FaceRec", "FaceRec_Callback", "FaceRecognition", 100);

misty.Debug("Exiting Face rec callback");

}

function RespondToFace(img, snd) {
	misty.ChangeDisplayImage(img);
	misty.PlayAudioClip(snd);
	misty.Pause(3000);
	ResetDisplay();
	misty.Pause(3000);
}

function ResetDisplay() {
	misty.ChangeDisplayImage("Content.jpg");
}

function Deactivate() {  
	misty.StopFaceRecognition();
	misty.UnregisterEvent("FaceRec");
}
```



----

## Loading a skill onto Misty

To load your skill onto misty, you will have to log into the Device Portal and manually upload the files needed for your skill. Just follow these steps:

1. Navigate to `http://IPAddress:8080/` where `IPAddress` is the IP address of your robot
   1. DevicePortalLogin.png
2. u: `administrator` p: `p@ssw0rd`
3. Navigate to `Apps/File explorer` in the browser
   1. ![File Explorer](/Assets/FileExplorer.png)
4. In the file explorer, navigate to `User Folders\Music\SDKAssets\Misty\Skills`
   1. ![Skills Directory](/Assets/FileExplorer_Skills.png)
5. Upload your js file to the `Code` directory.
6. Upload you manifest .json file to the `Meta` directory. 
7. *NOTE* Make sure you have uploaded all needed sound and image assets to the robot using the api explorer. 

## Contained in this Folder

- api-explorer.zip: Contains all files hosted at api-explorer.mistyrobotics.com
- SkillDebugger.html: A useful page for testing skills
- exerciseRobot.html: run through all functionality to ensure robot is working as expected. 
- Skill File Template (wander)
- Skill Meta File Template (wander.json)
