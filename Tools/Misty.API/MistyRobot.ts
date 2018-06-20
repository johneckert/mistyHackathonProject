/// <reference types="jquery" />
/// <reference path="MistyAjax.ts" />
/// <reference path="MistyAPI.ts" />
/// <reference path="MistyWebSocket.ts" />

namespace misty.apiClient {

	export interface IMood {
		filename: string;
	}

	export var Mood: { [id: number]: IMood } = {
		1: { filename: "Angry.jpg" },
		2: { filename: "Concerned.jpg" },
		3: { filename: "Confused.jpg" },
		4: { filename: "Content.jpg" },
		5: { filename: "Groggy.jpg" },
		6: { filename: "Happy.jpg" },
		7: { filename: "Love.jpg" },
		8: { filename: "Sad.jpg" }
	}

	export class Color {
		public red: number;
		public green: number;
		public blue: number;
		public params: object;

		constructor(params: Object) {
			this.params = params;
			this.red = params["red"];
			this.green = params["green"];
			this.blue = params["blue"];
		}
	}

	export class Motion {
		public linear: number;
		public angular: number;
		public degrees: number;
		public params: object;

		constructor(params: Object) {
			this.params = params;
			this.degrees = params["degrees"];
			this.angular = params["angular"];
			this.linear = params["linear"];
		}
	}

	export var motions: { [id: string]: Motion; } = {};
	motions["left"] = new Motion({ linear: 30.0, angular: 10.0 });
	motions["right"] = new Motion({ linear: 30.0,  angular: -10.0 });
	motions["forward"] = new Motion({ linear: 30.0, angular: 0 });
	motions["backward"] = new Motion({ linear: -30.0,  angular: 0.0 });
	motions["stop"] = new Motion({ linear: 0.0, angular: 0 });
	motions["spin right"] = new Motion({ linear: 0.0, angular: -20.0 });
	motions["spin left"] = new Motion({ linear: 0.0, angular: 20.0 });


	export var colors: { [id: string]: Color; } = {};
	colors["Blue LED"] = new Color({ red: 30, green: 144, blue: 255 });
	colors["Gold LED"] = new Color({ red: 218, green: 165, blue: 20 });
	colors["Green LED"] = new Color({ red: 0, green: 255, blue: 10 });
	colors["LED Off"] = new Color({ red: 0, green: 0, blue: 0 });
	colors["Orange LED"] = new Color({ red: 255, green: 80, blue: 0 });
	colors["Pink LED"] = new Color({ red: 255, green: 105, blue: 180 });
	colors["Purple LED"] = new Color({ red: 148, green: 0, blue: 211 });
	colors["Red LED"] = new Color({ red: 255, green: 0, blue: 0 });
	colors["Silver LED"] = new Color({ red: 169, green: 169, blue: 169 });
	colors["White LED"] = new Color({ red: 255, green: 255, blue: 255 });
	colors["Yellow LED"] = new Color({ red: 255, green: 255, blue: 0 });
	colors["Random LED"] = new Color({ red: 1, green: 1, blue: 1 });

	export var moods: { [id: string]: IMood; } = {};
	moods["Angry Eyes"] = Mood[1];
	moods["Concerned Eyes"] = Mood[2];
	moods["Confused Eyes"] = Mood[3];
	moods["Content Eyes"] = Mood[4];
	moods["Groggy Eyes"] = Mood[5];
	moods["Happy Eyes"] = Mood[6];
	moods["Loving Eyes"] = Mood[7];
	moods["Sad Eyes"] = Mood[8];
	moods["Unamused Eyes"] = Mood[9];


	type GetCallback = (data: any) => any;
	type EventCallback = (data: any) => any;
	type commandCallback = (scope: object, command: EventCallback) => any;

	export class MistyRobot {
		private _MistyAPI: MistyAPI;
		private _MistyWebSocket: MistyWebSocket;
		private _Address: string;
		private _Port: string;
		private _isExploring: boolean = false;

		get GetAddress(): string {
			return this._Address;
		}
		get GetPort(): string {
			return this._Port;
		}

		get IsWebsocketConnected(): boolean {
			return this._MistyWebSocket.IsConnected();
		}

		constructor(theAddress: string, thePort: string) {
			this._Address = theAddress;
			this._Port = thePort;
			this._MistyWebSocket = new MistyWebSocket(theAddress, thePort);
			this._MistyAPI = new MistyAPI(new MistyAjax(theAddress, thePort));
		}

		// === SetUpWebsocket === //
		///////////////////////////
		
		public Connect() {
			this._MistyWebSocket.Connect(function (event) {
			//	alert("Connected to websockets");
			});
		}

		public Subscribe(eventTriggerType: string, eventName: string, eventID: string, debounce: number, property: string, inequality: string, value: string, msgType: string, eventCallback: EventCallback): any {
			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}

			this._MistyWebSocket.SubscribeToData(eventTriggerType, eventName, eventID, debounce, property, inequality, value, msgType, eventCallback);
		}

		public ChangeEyes(input: string, callback?: GetCallback) {
			var mood: IMood;
			mood = input === "Random Eyes" ? Mood[Math.floor(Math.random() *9)] : moods[input];
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.ChangeEyes(mood, ensuredCallback);
		}

		// === Updates === //
		/////////////////////

		public GetStoreUpdateAvailable(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetStoreUpdateAvailable(ensuredCallback);
		}

		public PerformSystemUpdate(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.PerformSystemUpdate(ensuredCallback);
		}

		// === Audio === //
		///////////////////

		public SaveAudioAssetToRobot(FileName: string, audioData: any, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.SaveAudioAssetToRobot(FileName, audioData, false, true, ensuredCallback);
		}

		public PlayAudioClip(AudioClipId: string, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.PlayAudioClip(AudioClipId, ensuredCallback);
		}

		public DeleteAudioClip(AudioClipId: string, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DeleteAudioClip(AudioClipId, ensuredCallback);
		}

		public GetListOfAudioClips(callback: GetCallback): void {
			this._MistyAPI.GetListOfAudioClips(callback);
		}

		public GetBatteryLevel(callback: GetCallback): void {
			this._MistyAPI.GetBatteryLevel(callback);
		}

		public GetDeviceInformation(callback: GetCallback): void {
			this._MistyAPI.GetDeviceInformation(callback);
		}

		public GetLogInformation(callback: GetCallback): void {
			this._MistyAPI.GetLogInformation(callback);
		}

		public GetListOfAudioFiles(callback: GetCallback): void {
			this._MistyAPI.GetListOfAudioFiles(callback);
		}

		// === Images === //
		////////////////////

		public ChangeDisplayImage(FileName: string, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.ChangeDisplayImage(FileName, ensuredCallback);
		}

		public DeleteImage(FileName: string, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DeleteImage(FileName, ensuredCallback);
		}
		
		public SaveImageAssetToRobot(FileName: string, imageData: any, imageWidth: number, imageHeight: number, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.SaveImageAssetToRobot(FileName, imageData, imageWidth, imageHeight, false, true, ensuredCallback);
		}

		public GetListOfImages(callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetListOfImages(ensuredCallback);
		}

		// === SLAM === //
		//////////////////

		public IsMappingReady(eventCallback: GetCallback): void {
			let that = this;
			this.GetStatus(function (data) {
				that._IsSlamReady(data, that, that._ReadyToMap, eventCallback);
			});
		}

		public StartMapping(eventCallback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(eventCallback);
			this._MistyAPI.StartMapping(ensuredCallback);
		}

		public StartTracking(eventCallback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(eventCallback);
			this._MistyAPI.StartTracking(ensuredCallback);
		}

		public StartRecording(eventCallback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(eventCallback);
			this._MistyAPI.StartRecording(ensuredCallback);
		}

		public IsTrackingReady(eventCallback: GetCallback): void {
			let that = this;
			this.GetStatus(function (data) {
				that._IsSlamReady(data, that, that._ReadyToTrack, eventCallback)
			});
		}

		private _IsSlamReady(data, that, slamCommand: commandCallback, eventCallback: EventCallback): boolean {
			let ensuredCallback: GetCallback = this._EnsureCallback(eventCallback);

			if (data === null || data[0] == null || data[0].result === null || data[0].result.sensorStatus !== "Ready") {
				console.log("Slam sensor is not ready. Try SlamReset command.");
				return false;
			}

			slamCommand(that, ensuredCallback);
			return true;
		}

		private _ReadyToMap(that, ensuredCallback) {
			that._MistyAPI.StartMapping(function (ensuredCallback) {
				that.Subscribe("SelfState", "StartMapping", "1", 1, "Position.X", ">=", "0", "ApiEventRegistration", ensuredCallback);
			});
		}

		private _ReadyToTrack(that, ensuredCallback) {
			that._MistyAPI.StartTracking(function (ensuredCallback) {
				that.Subscribe("SelfState", "StartTracking", "1", 1, "Position.X", ">=", "0", "ApiEventRegistration", ensuredCallback);
			});
		}

		public StopMapping(callback?: GetCallback): void {
			if (this._isExploring) {
				console.log("You are not mapping.")
				return;
			}
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StopMapping(ensuredCallback);
		}

		public GetMap(callback: GetCallback): void {
			if (this._isExploring) {
				this.StopMapping(function (data) {
					this._isExploring = false;
					let ensuredCallback: GetCallback = this._EnsureCallback(callback);
					this._MistyAPI.GetMap(ensuredCallback);
				});
			}
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetMap(ensuredCallback);
		}

		public GetRawMap(callback: GetCallback): void {
			if (this._isExploring) {
				this.StopMapping(function (data) {
					this._isExploring = false;
					let ensuredCallback: GetCallback = this._EnsureCallback(callback);
					this._MistyAPI.GetMap(ensuredCallback);
				});
			}
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetRawMap(ensuredCallback);
		}

		public GetPath(x: number, y: number, callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetPath(x, y, ensuredCallback);
		}

		public FollowToPoint(locationX: number, locationY: number, callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			let path: string = "(" + locationX + "," + locationY + ")";
			this._MistyAPI.FollowPath(path, ensuredCallback);
		}

		public FollowPath(path: string, callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.FollowPath(path, ensuredCallback);
		}

		public DriveToLocation(x: number, y: number, callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DriveToLocation(x, y, ensuredCallback);
		}

		public GetStatus(callback: GetCallback): any {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetStatus(ensuredCallback);
		}

		public ResetMapping(callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.ResetMapping(ensuredCallback);
		}

		public StopTracking(callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StopTracking(ensuredCallback);
		}

		public StopRecording(callback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StopRecording(ensuredCallback);
		}

		public SubscribeToYPose(callback?: GetCallback, debounce?: number) {
			if (!debounce || debounce < 100) {
				debounce = 100;
			}
			this.SubscribeToNamedObjectWithFilter("PoseSubscriptionY", "SelfState", 1000, "Position.Y", "exists", 0, "Position.Y", function (data) {
				callback(data);
			});
		}

		public SubscribeToXPose(callback?: GetCallback, debounce?: number) {
			if (!debounce || debounce < 100) {
				debounce = 100;
		}
			this.SubscribeToNamedObjectWithFilter("PoseSubscriptionX", "SelfState", 1000, "Position.X", "exists", 0, "Position.X", function (data) {
				callback(data);
			});
		}

		public SubscribeToBattery(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}

			this._MistyWebSocket.RegisterForObjectWithFilter("BatteryCharge", "BatteryCharge", 3000, null, null, null, null, function (data) {
				callback(data);
			});
		};

		public SubscribeToTimeOfFlightFront(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			this._MistyWebSocket.RegisterForObjectWithFilter("CenterTimeOfFlight", "TimeOfFlight", 3000, "SensorPosition", "=", "Center", null, function (data) {
				callback(data);
			});
		};

		public SubscribeToTimeOfFlightRight(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			this._MistyWebSocket.RegisterForObjectWithFilter("RightTimeOfFlight", "TimeOfFlight", 3000, "SensorPosition", "=", "Right", null, function (data) {
				callback(data);
			});
		};

		public SubscribeToTimeOfFlightLeft(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			this._MistyWebSocket.RegisterForObjectWithFilter("LeftTimeOfFlight", "TimeOfFlight", 3000, "SensorPosition", "=", "Left", null, function (data) {
				callback(data);
			});
		};

		public SubscribeToTimeOfFlightBack(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			this._MistyWebSocket.RegisterForObjectWithFilter("BackTimeOfFlight", "TimeOfFlight", 3000, "SensorPosition", "=", "Back", null, function (data) {
				callback(data);
			});
		};

		public UnsubscribeFromTimeOfFlightFront(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("CenterTimeOfFlight");
			callback("Unsubscribed from Time of Flight");
		}

		public UnsubscribeFromTimeOfFlightRight(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("RightTimeOfFlight");
			callback("Unsubscribed from Time of Flight");
		}

		public UnsubscribeFromTimeOfFlightLeft(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("LeftTimeOfFlight");
			callback("Unsubscribed from Time of Flight");
		}

		public UnsubscribeFromTimeOfFlightBack(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("BackTimeOfFlight");
			callback("Unsubscribed from Time of Flight");
		}

		public UnsubscribeFromBatteryCharge(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("BatteryCharge");
			callback("Unsubscribed from Battery Charge");
		}

		public UnsubscribeFromPose(callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject("PoseSubscriptionX");
			this._MistyWebSocket.UnsubscribeFromObject("PoseSubscriptionY");
			callback("Unsubscribed from pose");
		}

		public UnsubscribeFromApiEvent(eventTriggerType: string, eventName : string, eventId : string, callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromEvent(eventTriggerType, eventName, eventId);
		}
		
		public SubscribeToNamedObjectWithFilter(eventName: string, namedObject: string, debounceMs: number, property: string, inequality: string, value: any, returnProperty: string, callback?: GetCallback) {
			let that = this;
			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			console.log("Calling to subscribe to " + namedObject);
			this._MistyWebSocket.RegisterForObjectWithFilter(eventName, namedObject, debounceMs, property, inequality, value, returnProperty, function (data) {
				callback(data);
			});
		};

		public SubscribeToNamedObject(namedObject: string, debounceMs: number, callback?: GetCallback) {
			let that = this;
			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}
			console.log("Calling to subscribe to " + namedObject);
			this._MistyWebSocket.RegisterForObject(namedObject, debounceMs, function (data) {
				callback(data);
			});
		};
		
		public UnsubscribeFromNamedObject(eventName: string, callback?: GetCallback) {
			this._MistyWebSocket.UnsubscribeFromObject(eventName);
			callback("Unsubscribed from " + eventName);
		}

		// === Locomotion === //
		////////////////////////

		public DriveTime(id, duration, callback?: GetCallback) {
			var motion: Motion = motions[id];
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DriveTime(motion, duration, ensuredCallback);
		}

		public DriveTimeByValue(linear: number, angular: number, duration: number, callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DriveTimeByValue(linear, angular, duration, ensuredCallback);
		}

		public TurnRobot(angular: number, degree: number, duration: number, callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.DriveTimeByValue(0, angular, duration, ensuredCallback, degree);
		}

		public StopRobot(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StopRobot(ensuredCallback);
		}

		public LocomotionTrack(left: number, right: number, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.LocomotionTrack(left, right, ensuredCallback);
		}

		public Drive(linear: number, angular: number, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.Drive(linear, angular, ensuredCallback);
		}


		// === Move Arm === //
		//////////////////////

		public MoveLeftArmSlow(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Left", position0To10, 2, callback);
		}

		public MoveLeftArmMedium(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Left", position0To10, 5, callback);
		}

		public MoveLeftArmFast(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Left", position0To10, 8, callback);
		}

		public MoveRightArmSlow(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Right", position0To10, 2, callback);
		}

		public MoveRightArmMedium(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Right", position0To10, 5, callback);
		}

		public MoveRightArmFast(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Right", position0To10, 8, callback);
		}

		public MoveBothArmsSlow(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Right", position0To10, 2, callback);
			this.MoveArm("Left", position0To10, 2, callback);
		}

		public MoveBothArmsMedium(position0To10: number, callback?: GetCallback): void {
			this.MoveArm("Right", position0To10, 5, callback);
			this.MoveArm("Left", position0To10, 5, callback);
		}

		public MoveBothArmsFast(leftArmPosition0To10: number, rightArmPosition0To10: number, callback?: GetCallback): void {
			this.MoveArm("Left", leftArmPosition0To10, 10, callback);
			this.MoveArm("Right", rightArmPosition0To10, 10, callback);
		}

		public MoveArm(leftOrRight: string, position0To10: number, speed0To10: number, callback?: GetCallback): void {
			if (leftOrRight !== "Left" && leftOrRight !== "Right") {
				callback({ Status: "Error", ErrorMessage: 'LeftOrRight value must be "Left" or "Right".' });
				return;
			}
			if (speed0To10 < 0) {
				speed0To10 = 0;
			} else if (speed0To10 > 10) {
				speed0To10 = 10;
			}
			if (position0To10 < 0) {
				position0To10 = 0;
			} else if (position0To10 > 10) {
				position0To10 = 10;
			}

			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.MoveArm(leftOrRight, position0To10, speed0To10, ensuredCallback);
		}

		// === Move Head === //
		///////////////////////

		public CenterHead(callback?: GetCallback): void {
			this.MoveHead(0, 0, 0, 8, callback);
		}

		public HeadLookUp(callback?: GetCallback): void {
			this.MoveHead(3, 0, 0, 6, callback);
		}

		public HeadLookDown(callback?: GetCallback): void {
			this.MoveHead(-3, 0, 0, 6, callback);
		}

		public HeadLookRight(callback?: GetCallback): void {
			this.MoveHead(0, 0, 3, 6, callback);
		}

		public HeadLookLeft(callback?: GetCallback): void {
			this.MoveHead(0, 0, -3, 6, callback);
		}

		public HeadTiltRight(callback?: GetCallback): void {
			this.MoveHead(0, 3, 0, 6, callback);
		}

		public HeadTileLeft(callback?: GetCallback): void {
			this.MoveHead(0, -3, 0, 6, callback);
		}
		
		public SetHeadToPosition(axis: string, position: number, velocity: number, theCallback: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(theCallback);
			this._MistyAPI.SetHeadPosition(axis, position, velocity, ensuredCallback);
		}

		public MoveHead(pitch: number, roll: number, yaw: number, speed0To10: number, callback?: GetCallback): void {
			if (speed0To10 < 0) {
				speed0To10 = 0;
			}
			else if (speed0To10 > 10) {
				speed0To10 = 10;
			}
			if (pitch < -5) {
				pitch = -5;
			}
			else if (pitch > 5) {
				pitch = 5;
			}
			if (roll < -5) {
				roll = -5;
			}
			else if (roll > 5) {
				roll = 5;
			}
			if (yaw < -5) {
				yaw = -5;
			}
			else if (yaw > 5) {
				yaw = 5;
			}

			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.MoveHead(pitch, roll, yaw, speed0To10, ensuredCallback);
		}

		// === General === //
		/////////////////////

		public ChangeLED(colorId: string, callback?: GetCallback): void {
			if (colorId in colors) {
				var color: Color;
				if (colorId == "Random LED") {
					color = new Color({ red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255 });
				}
				else {
					color = colors[colorId];
				}

				let ensuredCallback: GetCallback = this._EnsureCallback(callback);
				this._MistyAPI.ChangeLED(color, ensuredCallback);
			}
			else {
				console.log("Invalid color id");
			}
		}

		public ChangeLEDByValue(red: number, green: number, blue: number, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.ChangeLEDByValue(red, green, blue, ensuredCallback);
		}
		
		public ConnectToWiFi(NetworkName: string, Password: string, callback?: GetCallback): void {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.ConnectWiFi(NetworkName, Password, ensuredCallback);
		}

		public GetHelp(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.GetHelp(ensuredCallback);
		}

		// === Face === //
		//////////////////

		public StartFaceTraining(faceID?: string, callback?: GetCallback): void {
			if (faceID) {
				this._MistyAPI.StartFaceTraining(faceID, this._EnsureCallback(callback));
			} else {
				this._MistyAPI.StartFaceTraining(this._RandomAlphaNumericString(25), callback);
			}
		}

		public StopFaceTraining(callback?: GetCallback): void {
			this._MistyAPI.StopFaceTraining(this._EnsureCallback(callback));
		}

		public ClearLearnedFaces(callback?: GetCallback): void {
			this._MistyAPI.ClearLearnedFaces(this._EnsureCallback(callback));
		}

		public GetLearnedFaces(callback?: GetCallback): void {
			this._MistyAPI.GetLearnedFaces(this._EnsureCallback(callback));
		}

		public RunFaceDetectionProcess(callback?: GetCallback) {
			let that = this;

			this.SubscribeToNamedObjectWithFilter("FaceDetection", "FaceDetection", 500, null, null, null, null, function (data) {
				callback(data);
			});

			this.StartFaceDetection(function () {
				//alert("Returned from StartFaceDetection API call");
			})
		}

		public RunFaceRecognitionProcess(callback?: GetCallback) {
			let that = this;

			if (!this._MistyWebSocket.IsConnected) {
				console.log("You need to open a websocket connection first");
				return;
			}

			this.StartFaceRecognition(function () {
				//alert("Returned from StartFaceRecognition API call");
			});

			this.SubscribeToNamedObjectWithFilter("FaceRecognition", "FaceRecognition", 500, null, null, null, null, function (data) {
				callback(data);
			});
			
		}
		
		// === Face Methods === //
		//////////////////////////
		
		public StartFaceDetection(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StartFaceDetection(ensuredCallback);
		}

		public StopFaceDetection(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this.UnsubscribeFromNamedObject("FaceDetection", function () { console.log("Unsubscribed from Face Detection"); });
			this._MistyAPI.StopFaceDetection(ensuredCallback);
		}

		public StartFaceRecognition(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this._MistyAPI.StartFaceRecognition(ensuredCallback);
		}

		public StopFaceRecognition(callback?: GetCallback) {
			let ensuredCallback: GetCallback = this._EnsureCallback(callback);
			this.UnsubscribeFromNamedObject("FaceRecognition", function () { console.log("Unsubscribed from Face Recognition"); });
			this._MistyAPI.StopFaceRecognition(ensuredCallback);
		}

		// === Private Methods === //
		/////////////////////////////

		private _Error2Console(message: any, methodName: string = ''): void {
			if (typeof message === 'string') {
				console.error(this.constructor.name + " - " + methodName + " - " + message);
			} else {
				console.error(message);
			}
		}

		private _EnsureCallback(callback?: GetCallback): GetCallback {
			if (callback) {
				return callback;
			} else {
				return function (data) { console.log(data); };
			}
		}

		private _RandomAlphaNumericString(length: number): string {
			let result = '';
			let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
			for (let i = length; i > 0; i--) {
				result += chars[Math.floor(Math.random() * chars.length)];
			}
			return result;
		}
	}
}