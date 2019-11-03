# Henry.nz

This is a 2-part project, 
1. The mouse-stalking snake
2. A GitHub API based portfolio, automatically fetching and displaying all Repos.

## 1. Mouse-stalking snake

![MouseScreenshot](https://i.imgur.com/Oobdjf3.png)

Built using the P5.JS library, this just draws a series of circles following the mouse.

The difficult part of this was designing the trigonometry to make the circles follow whilst maintaining a constant speed.

It is pretty simple, It just uses the pythag theorem to calculate the hypotenuse of any given triangle between the current position and the mouse position.

The drawing and mouse-position is made easier by the P5 library. The canvas was made to cover 100% height and width. On the resize of the window, the canvas is redrawn to match the width and height again.

## 2. GitHub API Repo Portfolio

![RepoScreenshot](https://i.imgur.com/4QOBgpt.png)

Rather than building a portfolio from scratch, the more efficient method is just to take the README.md of each repo and display it nicely. It uses some nice JS and css to display the README's properly.

The GitHub API has some read limitations, the assumption is, hopefully someone will decide that they like my projects before they reload the page 10 times in 10 minutes.
