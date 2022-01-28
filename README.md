# Henry.nz

This is a 2-part project,

1. The mouse-stalking snake
2. A GitHub API based portfolio, automatically fetching and displaying all Repos.

## 1. Mouse-stalking snake

![The snake just follows your mouse](https://imgur.com/HlxGUok.jpg)

Built using the P5.JS library, this just draws a series of circles following the mouse.

The difficult part of this was designing the trigonometry to make the circles follow whilst maintaining a constant speed.

It is pretty simple, It just uses the pythag theorem to calculate the hypotenuse of any given triangle between the current position and the mouse position.

The drawing and mouse-position is made easier by the P5 library. The canvas was made to cover 100% height and width. On the resize of the window, the canvas is redrawn to match the width and height again.

When the mouse leaves the canvas, it enters its auto-mode. It randomly selects a new target and moves towards it. If it gets too close to an edge, it will stop moving in that direction. It also has an auto-centering algorithm where it will prioritise movements which bring it back to the center. I spent some time balancing the auto-centering with the random moving so it moves around the whole screen but never stays in one corner too long.

## 2. GitHub API Repo Portfolio

![Love this little CSS rotate animation](https://i.imgur.com/smgc6mq.gif)

Rather than building a portfolio from scratch, the more efficient method is just to take the README.md of each repo and display it nicely. It uses some nice JS and css to display the README's properly.

The GitHub API has some read limitations, to get around this, I have a Node script which I can run locally, it reads the github api for all my projects, and saves them to a firestore database as a form of intermediary.
