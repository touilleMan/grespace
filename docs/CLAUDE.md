# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Mars exploration themed game implemented as an interactive website.

The art style is inspired by:

- Ridley Scott's "The Martian"
- hard-SF aesthetic
- NASA Artemis program

## Sinopsis of the game

The year is 2035, the NASA has sent a manned mission to Mars.

However the mission has gone wrong and the crew is all dead but one that is now stranded on the planet.

Player work at the Houston Space Center and is tasked with helping the stranded astronaut to survive and find a way to return to Earth.

## Architecture

### Core Structure

- Mobile-first design with vertical layouts
- Single-page application (SPA) structure

## Pages

All pages has a small icon in the top right corner to open the About modal.

### About modal

This modal contains information about the project, including:

- Company name
- Company links
- Invitation to give a note on Google Maps with a link to the Google Maps page

### Welcome Page

Animated introduction with the Mars planet and its two satellites orbiting around it.

Name of the space mission is displayed (i.e. "Ares IV Mars exploration mission")

Latitude and longitude mission site is displayed (Lat: 4.8047°S, Lon: 222.6207°W)

A real time clock showing the current Mars time is displayed, along with a mission time counter starting at 149 days, 18 hours, and 53 minutes and 17 seconds.

A button to start the game is displayed with "PROCEED".

Clicking on the button fades out the welcome page, and fades in the video page.

### video page

A video player for the main Mars exploration video.

The page has buttons with icons at the bottom:

- One with a I/O icon to open the control console
- One with a flashlight icon to toggle on and off a light effect in the middle of the screen, simulation a small LED light.

### Control Page

The control page displays a text console with a nice scrolable output text with keyword coloration
The text input doesn't allow actual text to be entered, instead a selection of predefined commands is available to click on.
