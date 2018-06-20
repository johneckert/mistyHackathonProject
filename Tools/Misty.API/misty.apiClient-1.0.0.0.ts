/// <reference="jquery" />


namespace misty.apiClient {

	class constants {
		public static robotInformation = "/robot";
	}

	export class mistyRobot {

		private _rootUrl: string;
		private _softwareVersion: string;
		private _firmwareVersion: string;
		private _sensors: sensor[];

		public get softwareVersion(): string {
			return this._softwareVersion;

		}

		public get firmwareVersion(): string {
			return this._firmwareVersion;
		}

		public get sensors(): sensor[] {
			return this._sensors;
		}

		constructor(rootUrl: string, softwareVersion: string, firmwareVersion: string, sensors: sensor[]) {
			this._rootUrl = rootUrl;
			this._softwareVersion = softwareVersion;
			this._firmwareVersion = firmwareVersion;
			this._sensors = sensors;
		}

		public static connect(url: string): mistyRobot {

			let robo: mistyRobot = undefined;

			$.getJSON(url + constants.robotInformation, (data: any, textStatus: string, jqXHR: JQueryXHR) => {

				let jsonData = data;
				let count: number = data.sensors.length;
				let sensors: sensor[] = new Array(count);

				for (let i = 0; i < count; i++) {
					let item: sensor = new sensor();

					item.id = data.sensors[i].id;
					item.name = data.sensors[i].name;

					sensors[i] = item;
				}

				robo = new mistyRobot(url, data.softwareVersion, data.firmwareVersion, sensors);

			}).fail(function () {
				// TODO: Need error handling strategy
			});

			return robo;
		}
	};

	export class sensor {

		public id: string;
		public name: string;
	}
};