function Activate() {
  for (var i = 0; i <= 1; i++) {
    misty.PlayAudioClip("the_hustle.wav");
    misty.Debug("Starting Quiet Wander skill!!");
    misty.ChangeDisplayImage("Happy.jpg");
    misty.ChangeLED(3, 0, 255, 100, 0);
    misty.DriveTime(-1, 0, 2000, 0);
    misty.ChangeLED(255, 255, 0, 2100, 0);
    misty.DriveTime(1, 0, 2000, 00, 100);
    misty.DriveTime(0, 5, 2000, 2100, 0);
    misty.DriveTime(0, -5, 2000, 2100, 0);
    misty.ChangeDisplayImage("Confused.jpg", 2100, 0);
    misty.MoveHead("Pitch", -5, 10, 100, 0);
    misty.DriveTime(0, 5, 500, 100, 0);
    misty.MoveHead("Pitch", 5, 10, 600, 0);
    misty.DriveTime(0, -5, 500, 100, 0);
    misty.ChangeDisplayImage("Happy.jpg", 100, 0);
    misty.ChangeLED(100, 0, 255, 100, 0);
    misty.DriveTime(0, 5, 4000, 100);
  }
}

function Deactivate() {
  misty.Stop();
  misty.StopMapping();
  misty.ChangeLED(0, 0, 0); /*Off*/
  misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);
  misty.ChangeDisplayImage("Content.jpg");

  misty.UnregisterEvent("CenterTOF");
  misty.UnregisterEvent("LeftTOF");
  misty.UnregisterEvent("RightTOF");
  misty.UnregisterEvent("BackTOF");
}
