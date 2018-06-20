/// <reference types="jquery" />
/// <reference path="MistyAjax.ts" />

namespace misty.apiClient {
	type GetCallback = (data: any) => any;

	export class MistyAPI {
		private _mistyAjax: MistyAjax;

		constructor(mistyAjax: MistyAjax) {

			this._mistyAjax = mistyAjax;
		}

		// === Audio Commands === //
		////////////////////////////
		

		public GetListOfAudioClips(theCallback: GetCallback): void {
			this.GetAjaxCommand("audio/clips", theCallback);
		}

		//Play an audio clip that has been uploaded to Misty.
		//    audioName - String - Name given to Audio Clip on file
		public PlayAudioClip(audioName: string, theCallback: GetCallback): void {
			let payload = {
				AssetId: audioName
			};

			this.PostAjaxCommand("audio/play", payload, theCallback);
		}

		public DeleteAudioClip(audioName: string, theCallback: GetCallback): void {
			let payload = {
				FileName: audioName
			};

			this.PostAjaxCommand("audio/delete", payload, theCallback, "beta");
		}

		//Save an audio file to Misty.
		//    FileName - String  - Name of audio file uploaded to Misty with file extention (Accepts all audio format types)
		//    audioData           - String  - Series of numbers that represent audio data in bytes
		//    immediatelyApply    - Boolean - True or False used to indicate whether audio file will be immediately updated to audio list.
		public SaveAudioAssetToRobot(FileName: string, audioData: any, immediatelyApply: boolean, overwriteExistingFile: boolean, theCallback: GetCallback): void {
			let dataString: string;

			if (typeof audioData === 'string') {
				dataString = audioData;
			} else {
				dataString = audioData.toString();
			}

			let payload = {
				FileName: FileName,
				DataAsByteArrayString: dataString,
				ImmediatelyApply: immediatelyApply,
				OverwriteExisting: overwriteExistingFile
			};

			this.PostAjaxCommand("audio ", payload, theCallback);
		}

		public GetListOfAudioFiles(theCallback: GetCallback): void {
			this.GetAjaxCommand("audio", theCallback);
		}
		
		public GetHelp(theCallback: GetCallback): void {
			this.GetAjaxCommand("info/help", theCallback);
		}

		public GetHelpAboutCommand(commandString: string, theCallback: GetCallback): void {
			let payload = {
				Command: commandString
			};

			this.GetAjaxCommand("info/help?command="+ commandString, theCallback);
		}

		public GetBatteryLevel(theCallback: GetCallback): void {
			this.GetAjaxCommand("info/battery", theCallback);
		}

		public GetDeviceInformation(theCallback: GetCallback): void {
			this.GetAjaxCommand("info/device", theCallback);
		}

		public GetLogInformation(theCallback: GetCallback): void {
			this.GetAjaxCommand("info/logs", theCallback);
		}

		public ChangeEyes(mood: IMood, theCallback: GetCallback): void {
			this.ChangeDisplayImage(mood.filename, theCallback);
		}

		public ConnectWiFi(networkName: string, password: string, theCallback: GetCallback): void {
			let payload = {
				NetworkName: networkName,
				Password: password
			};

			this.PostAjaxCommand("wifi", payload, theCallback);
		}

		// === Move Commands === //
		////////////////////////////

		public DriveTime(motion: Motion, duration: number, theCallback: GetCallback): void {
			this.DriveTimeByValue(motion.linear, motion.angular, duration, theCallback, motion.degrees);
		}

		public DriveTimeByValue(linear: number, angular: number, duration: number, theCallback: GetCallback, degrees?: number): void {
			let payload = {
				LinearVelocity: linear,
				AngularVelocity: angular,
				TimeMS: duration,
				Degrees: degrees
			};

			this.PostAjaxCommand("drive/time", payload, theCallback);
		}

		public DriveToLocation(locationX: number, locationY: number, theCallback: GetCallback): void {
			let payload = {
				X: locationX,
				Y: locationY
			};
			//TODO Update Robot and this call to not use ActionPlan naming
			this.PostAjaxCommand("drive/location", payload, theCallback);
		}

		public LocomotionTrack(left: number, right: number, theCallback: GetCallback): void {
			let payload = {
				LeftTrackSpeed: left,
				RightTrackSpeed: right,
			};

			this.PostAjaxCommand("drive/track", payload, theCallback);
		}

		public Drive(linear: number, angular: number, theCallback: GetCallback): void {
			let payload = {
				LinearVelocity: linear,
				AngularVelocity: angular,
			};

			this.PostAjaxCommand("drive", payload, theCallback);
		}

		public MoveArm(whichSide: string, position: number, velocity: number, theCallback: GetCallback): void {
			let payload = {
				Arm: whichSide,
				Position: position,
				Velocity: velocity
			};

			this.PostAjaxCommand("arms/move", payload, theCallback);
		}

		public MoveHead(pitch: number, roll: number, yaw: number, velocity: number, theCallback: GetCallback): void {
			let payload = {
				Pitch: pitch,
				Roll: roll,
				Yaw: yaw,
				Velocity: velocity
			};

			this.PostAjaxCommand("head/move", payload, theCallback, "beta");
		}

		public SetHeadPosition(axis: string, position: number, velocity: number, theCallback: GetCallback): void {
			let payload = {
				Axis: axis,
				Position: position,
				Velocity: velocity
			};

			this.PostAjaxCommand("head/position", payload, theCallback, "beta");
		}

		// === SLAM Commands === //
		////////////////////////////

		public StartMapping(theCallback?: GetCallback): void {
			this.PostAjaxCommand("slam/map/start", {}, theCallback, 'alpha');
		}

		public StopMapping(theCallback?: GetCallback): void {
			this.PostAjaxCommand("slam/map/stop", {}, theCallback, 'alpha');
		}

		public StartTracking(theCallback?: GetCallback): void {
			this.PostAjaxCommand("slam/track/start", {}, theCallback, 'alpha');
		}

		public StopTracking(theCallback: GetCallback): void {
			this.PostAjaxCommand("slam/track/stop", {}, theCallback, 'alpha');
		}

		public StartRecording(theCallback?: GetCallback): void {
			this.PostAjaxCommand("slam/record/start", {}, theCallback, "alpha");
		}

		public StopRecording(theCallback: GetCallback): void {
			this.PostAjaxCommand("slam/record/stop", {}, theCallback, "alpha");
		}

		public GetMap(theCallback?: GetCallback): void {
			this.GetAjaxCommand("slam/map/smooth", theCallback, "alpha");
		}

		public GetRawMap(theCallback?: GetCallback): void {
			this.GetAjaxCommand("slam/map/raw", theCallback, 'alpha');
		}

		public GetPath(locationX: number, locationY: number, theCallback: GetCallback): void {
			let payload = {
				X: locationX,
				Y: locationY
			};

			this.GetAjaxCommand("slam/path", theCallback, 'alpha');
		}

		public FollowPath(path: string, theCallback: GetCallback): void {
			//TODO Update to take an array of points vs asking them to enter path manually
			let payload = {
				Path: path
			};
			//TODO Update Robot and this call to not use ActionPlan naming
			this.PostAjaxCommand("drive/path", payload, theCallback, 'alpha');
		}

		public FollowPathOther(locationX: number, locationY: number, theCallback: GetCallback): void {
			let payload = {
				Destination: "(" + locationX + "," + locationY + ")"
			};

			this.PostAjaxCommand("drive/path", payload, theCallback, 'alpha');
		}

		public GetStatus(theCallback: GetCallback): void {
			this.GetAjaxCommand("slam/status", theCallback, 'alpha');
		}

		public StopRobot(theCallback: GetCallback): void {
			this.PostAjaxCommand("drive/stop", {}, theCallback);
		}

		public ResetMapping(theCallback: GetCallback): void {
			this.PostAjaxCommand("slam/reset", {}, theCallback, 'alpha');
		}

		// === Face Commands === //
		////////////////////////////

		public StartFaceDetection(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/detection/start", {}, theCallback, 'beta');
		}

		public StopFaceDetection(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/detection/stop", {}, theCallback, 'beta');
		}

		public StartFaceRecognition(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/recognition/start", {}, theCallback, 'beta');
		}

		public StopFaceRecognition(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/recognition/stop", {}, theCallback, 'beta');
		}

		public StartFaceTraining(faceID: string, theCallback: GetCallback): void {
			let payload = {
				FaceID: faceID
			}
			this.PostAjaxCommand("faces/training/start", payload, theCallback, 'beta');
		}

		public StopFaceTraining(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/training/cancel", {}, theCallback, 'beta');
		}

		public ClearLearnedFaces(theCallback: GetCallback): void {
			this.PostAjaxCommand("faces/clearall", {}, theCallback, 'beta');
		}

		public GetLearnedFaces(theCallback: GetCallback): void {
			this.GetAjaxCommand("faces", theCallback, 'beta');
		}
		
		
		// === Image Commands === //
		////////////////////////////


		public ChangeDisplayImage(FileName: string, theCallback: GetCallback): void {
			let payload = {
				FileName: FileName
			};

			this.PostAjaxCommand("images/change", payload, theCallback);
		}


		public DeleteImage(FileName: string, theCallback: GetCallback): void {
			let payload = {
				FileName: FileName
			};

			this.PostAjaxCommand("images/delete", payload, theCallback);
		}

	
		public SaveImageAssetToRobot(FileName: string, imageData: any, imageWidth: number, imageHeight: number, immediatelyApply: boolean, overwriteExistingFile: boolean, theCallback: GetCallback): void {
			let dataString: string;

			if (typeof imageData === 'string') {
				dataString = imageData;
			} else {
				dataString = imageData.toString();
			}

			let payload = {
				FileName: FileName,
				DataAsByteArrayString: dataString,
				Width: imageWidth,
				Height: imageHeight,
				ImmediatelyApply: immediatelyApply,
				OverwriteExisting: overwriteExistingFile
			};

			this.PostAjaxCommand("images", payload, theCallback);
		}

		public GetListOfImages(theCallback: GetCallback): void {
			this.GetAjaxCommand("images", theCallback);
		}
		

		public RevertDisplay(theCallback: GetCallback): void {
			this.PostAjaxCommand("images/revert", {}, theCallback);
		}

		// === General Commands === //
		//////////////////////////////

		public ChangeLED(color: Color, theCallback: GetCallback): void {
			this.ChangeLEDByValue(color.red, color.green, color.blue, theCallback);
		}

		public ChangeLEDByValue(red: number, green: number, blue: number, theCallback: GetCallback): void {
			let payload = {
				Red: red,
				Green: green,
				Blue: blue
			};

			this.PostAjaxCommand("led/change", payload, theCallback);
		}

		public PerformSystemUpdate(theCallback: GetCallback): void {
			this.PostAjaxCommand("system/update", {}, theCallback, "alpha");
		}

		public GetStoreUpdateAvailable(theCallback: GetCallback): void {
			this.GetAjaxCommand("info/updates", theCallback, "alpha");
		}

		// === Private Methods === //
		/////////////////////////////
		
		private GetAjaxCommand(command: string, theCallback: GetCallback, version: string = null) {
			this._mistyAjax.GetCommand(command, theCallback, version);
		}

		private PostAjaxCommand(command: string, theData: any, theCallback: GetCallback, version: string = null) {
			this._mistyAjax.PostCommand(command, JSON.stringify(theData), theCallback, version);
		}

		private _Error2Console(message: any, methodName: string = '') {
			if (typeof message === 'string') {
				console.error(this.constructor.name + " - " + methodName + " - " + message);
			} else {
				console.error(message);
			}
		}
	}
}