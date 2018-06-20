function Activate() {
  misty.PlayAudioClip("the_hustle.wav");
  misty.Debug("Starting Quiet Wander skill!!");
  misty.ChangeDisplayImage("Happy.jpg");
  misty.ChangeLED(100, 0, 255);
  misty.DriveTime(-100, 0, 4000);
  misty.ChangeLED(255, 255, 0);
  misty.DriveTime(100, 0, 4000);
  misty.DriveTime(0, 100, 4000);
  misty.DriveTime(0, -100, 4000);
  misty.ChangeDisplayImage("Confused.jpg");
  misty.MoveHead("Pitch", -5, 10);
  misty.DriveTime(0, 100, 1000);
  misty.MoveHead("Pitch", 5, 10);
  misty.DriveTime(0, -100, 1000);
  misty.ChangeDisplayImage("Happy.jpg");
  misty.ChangeLED(100, 0, 255);
  misty.DriveTime(0, 100, 8000);
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
