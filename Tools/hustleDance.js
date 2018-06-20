$("#setup").submit(async function(e) {
  e.preventDefault();
  var ip = "192.168.1.41";

  if (!ip) {
    alert("Please enter a valid IP or name");
    return;
  }
  await RunMe(ip);
});

async function RunMe(ip) {
  console.log("running");
  // execute danceHustle 4 times
  for (let i = 0; i < 4; i++) {
    danceHustle();
  }

  var lightClient = new LightClient(ip, 10000);
  // choreographic sequence for hustle dance
  function danceHustle() {
    let timeoutId;
    // Start Dance (Hustle)
    // STEP 1: 4 count backward
    moveBackwards(4);
    // STEP 2: 4 count forward
    timeoutId = window.setTimeout(() => moveForwards(4), 5000);
    // STEP 3: spin left 4 count
    timeoutId = window.setTimeout(() => turnLeft(4), 10000);
    // TODO: add a function or step to *clap*
    // STEP 4: spin right 4 count
    timeoutId = window.setTimeout(() => turnRight(4), 15000);
    // 	STEP 5B: Turn left and head down 1 count
    timeoutId = window.setTimeout(() => discoLeft(1), 20000);
    // 	STEP 5A: Turn right 90deg and head up 1 countt
    timeoutId = window.setTimeout(() => discoRight(1), 22000);
    // STEP 6: Spin 8 Counts land facing 90 to left. maybe flash led colors while spinnig.
    timeoutId = window.setTimeout(() => turnLeft(8), 24000);
    // End Dance (Hustle)

    // *clap*
    // STEP 5: REPEAT FOR 8 COUNTS:
  }

  // REPEAT DANCE 4 MORE TIMES
  function moveBackwards(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":-3,"AngularVelocity":0,"TimeMS":${duration}}`,
      function(data) {
        console.log("moveBackwards", JSON.stringify(data));
      }
    );
  }
  // moveBackwards function with additional parameters
  function moveBackwards(lv = 0, av = 0, count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":${lv},"AngularVelocity":${av},"TimeMS:"${duration}}`,
      function(data) {
        console.log("moveBackwards", JSON.stringify(data));
      }
    );
  }

  function moveForwards(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":3,"AngularVelocity":0,"TimeMS":${duration}}`,
      function(data) {
        console.log("moveForwards", JSON.stringify(data));
      }
    );
  }
  function turnRight(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":3,"AngularVelocity":10,"TimeMS":${duration}}`,
      function(data) {
        console.log("turnRight", JSON.stringify(data));
      }
    );
  }
  function turnLeft(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":3,"AngularVelocity":-10,"TimeMS":${duration}}`,
      function(data) {
        console.log("turnLeft", JSON.stringify(data));
      }
    );
  }
  function discoRight(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":3,"AngularVelocity":10,"TimeMS":${duration}}`,
      function(data) {
        console.log("turnRight", JSON.stringify(data));
      }
    );
    lightClient.PostCommand(
      "beta/head/move",
      `{"Pitch":-10, "Velocity":10}`,
      function(data) {
        console.log("headUp", JSON.stringify(data));
      }
    );
  }
  function discoLeft(count) {
    const duration = 1000 * count;
    lightClient.PostCommand(
      "drive/time",
      `{"LinearVelocity":3,"AngularVelocity":-10,"TimeMS":${duration}}`,
      function(data) {
        console.log("turnLeft", JSON.stringify(data));
      }
    );
    lightClient.PostCommand(
      "beta/head/move",
      `{"Pitch":10, "Velocity":10}`,
      function(data) {
        console.log("headDown", JSON.stringify(data));
      }
    );
  }

  function stop() {
    console.log("stopping");
    lightClient.PostCommand("drive/stop", {}, function(data) {
      console.log("stop", JSON.stringify(data));
    });
  }
  // TODO: create function to change expression
  // pass in the filename as an argument. ex: changeExpression('Content.jpg')
  function changeExpression(expression) {
    lightClient.PostCommand(
      "images/change",
      `{"FileName": ${expression}`,
      function(data) {
        console.log("changeExpresion", JSON.stringify(data));
      }
    );
  }

  // TODO: create function to change LED colors
  function changeColors() {
    lightClient.PostCommand("");
  }
}
