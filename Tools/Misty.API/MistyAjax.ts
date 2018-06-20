/// <reference types="jquery" />

namespace misty.apiClient {
	type GetCallback = (data: any) => any;

	export class MistyAjax {
		private _ipAddress: string;
		private _port: string;
		private _timeout = 30000;

		public HasValidIp() {
			return this._ipAddress != null && this._ipAddress.trim() != "";
		}

		constructor(ipAddress: string, port: string) {

			if (ipAddress && port) {
				this._ipAddress = ipAddress.toString();
				this._port = port.toString();
			} else {
				this._Error2Console("Null port or ip address submitted");
			}
		}

		set timeout(theTimeout: number) {
			this._timeout = theTimeout
		}
		
		public GetCommand(command: string, successCallback: GetCallback, version: string = null): void {

			let newUri = "http://" + this._ipAddress + ":" + this._port + "/api/" + (version ? version + "/" : "") + command;
			let theClass = this;

			$.ajax({
				type: "GET",
				url: newUri,
				dataType: "json",
				async: true,
				timeout: this._timeout
			})
				.done(function (data) {
				
					if (data[0].status === "Error") {
						// the web call was successfull, but returned an error.  Display Error.
						theClass._Error2Console(data[0].errorMessage);
					} else if (successCallback) {
						// no errors and there is a callback function.
						successCallback(data);
					}
				})
				.fail(function (request, status, err: any) {
					// There was an error with the call.  Display error messages.
					theClass._Error2Console("===  GET - error  ===", "GetCommand");
					theClass._Error2Console(request);
					theClass._Error2Console(status);
					theClass._Error2Console(err);
					successCallback(JSON.stringify(err));
					theClass._Error2Console("===  GET - error  ===", "GetCommand");
				});
		}

		public PostCommand(command: string, theData: string, successCallback: GetCallback, version: string = null) {
			let newUri = "http://" + this._ipAddress + ":" + this._port + "/api/" + (version ? version+"/" : "") + command;

			let theClass = this;

			$.ajax({
				type: "POST",
				url: newUri,
				data: theData,
				dataType: "json",
				async: true,
				timeout: this._timeout
			})
				.done(function (data) {

					if (data.status === "Error") {
						// the web call was successfull, but returned an error.  Display Error.
						theClass._Error2Console(data[0].errorMessage);
					} else if (successCallback) {
						// no errors and there is a successCallback function.
						successCallback(data);
					}
				})
				.fail(function (request, status, err: any) {
					// There was an error with the call.  Display error messages.
					theClass._Error2Console("===  POST - error  ===", "PostCommand");
					theClass._Error2Console(request);
					theClass._Error2Console(status);
					theClass._Error2Console(err);
					successCallback(JSON.stringify(err));
					theClass._Error2Console("===  POST - error  ===", "PostCommand");
				});

			// do other code here first.
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