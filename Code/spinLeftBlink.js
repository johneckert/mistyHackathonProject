function Activate() {
  misty.Debug('Start Spin Left');
  //spinleft
  misty.Drive(0, -20, 1000);
  misty.Debug('Start Blink');
  //spinright
  misty.Drive(30, 10, 1000);
}

function Deactivate() {
  misty.Stop();
  misty.StopMapping();
  misty.ChangeLED(0, 0, 0); /*Off*/
  misty.MoveHeadPosition(-5, 0, 0, 40, 0, 1000);
  misty.ChangeDisplayImage('Content.jpg');

  misty.UnregisterEvent('CenterTOF');
  misty.UnregisterEvent('LeftTOF');
  misty.UnregisterEvent('RightTOF');
  misty.UnregisterEvent('BackTOF');
}

//callbacks
