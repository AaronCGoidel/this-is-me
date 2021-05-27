---
title: Simulating Galaxies
slug: galaxies
subtitle: An n-body simulation illustrating the formation of galaxies
cover: /galaxy.png
tags: C, OpenGL, algorithms
links: github.com/AaronCGoidel/n-body
---

# What's this?

This is a physics simulation I made for a UofT coding competition. Since the competition was co-sponsored by the physics club, I wanted to give my entry a physics-y/space theme. So, I decided to create an n-body simulation capable of simulating enough particles to illustrate the formation of galaxies after the Big Bang. I'm happy to say that I went on to win the competition.

It was fun to write the simulation and learn about how physics simulations are written in general. This was really an exercise in optimizing code. I wanted to squeeze as much performance out of this program as I could. In the end, I was able to simulate over 100,000 particles on my laptop in realtime.

# How it's made.

For my fellow nerds out there, let's talk a little about how this was made.

The simulation is written in pure C, with graphics in OpenGL. I implmented Barnes-Hut approximation to simulate particles interacting through their gravitational fields without needing to calculate n^2 interactions.

Further, I took advantage of optimizations such as multithreading, pointer arithmetic, and fast inverse square root approximation to make this simulation as powerful as I could.