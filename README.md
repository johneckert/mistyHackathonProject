# New York Developer Week Hackathon
The New York Developer Week Hackathon challenge. Includes instructions and sample code to get started. 

## The Misty Robotics Challenge
We want you to create a skill utilizing the Misty I robot that satisfies the following criteria:


- Takes advantage of the physical nature of a robot. 

  - Please **do not**  build something that could done with a smartphone.

- Utilizes data from an external data source

- Executes code locally on the robot

  

### You’ll have access to the following capabilities:

- Facial Detection

- Facial Recognition

- Customizable screen

- Customizable sounds

- RGB chest LED

- General locomotion

- Time-of-Flight Distance data (collision avoidance)

- Limited Map Generation (Currently in Alpha)



## Example of a great deliverable

*“Did you get my PR?”* - We write a lot of code at Misty Robotics and have Pull Requests all the time. This skill will watch for Pull Requests from a repository, figure out who needs to review the code before it can be merged, then Misty will roam the office until she recognizes someone who can approve and merge the PR. 



### We would break down the code into the following components

#### Computer Client

  - Can write in any language that can interact with REST commands         
  - Can interact with external data sources
  - Can subscribe to a websocket from the robot that streams:
    - Face Detection Events
    - Face Recognition Events
    - ToF Data
    - etc

#### Robot Skill

  - This will run on the robot
  - Can be triggered to run via REST endpoint
  - Can **NOT** retrieve data from external source (temporary limitation)



## This is the Extremely Helpful Section

Here is some sample code for a basic [Computer Client](/Computer%20Client%20Sample)

Here is some sample code for [creating skills](/Skill%20Sample)

Here is some documentation on how to [upload skills](/Skill%20Sample/Skills.md) to Misty

Here are some useful [enpoint examples](https://documenter.getpostman.com/view/3743818/RWEgpdTW)

All our the documentation can be found at [docs.mistyrobotics.com](https://docs.mistyrobotics.com/)



# Prize Scoring Method 

- Creativity - 50pts
- Usefulness - 40pts
- External Integration - 30pts
- Level of polish - 20pts
- Good use of robot - 20pts
- The ‘X’ Factor - 10pts
- Grace :)

*Negative points will be given if:*

- Deliverable *Could* be implemented with just a smartphone: -20pts