---
title: "The Retroactive Inventor: How to Teach Algorithms"
author: Aaron Goidel
slug: the-retroactive-inventor-how-to-teach-algorithms
date: "2020-10-27 16:40:46"
wcount: 492
---

[![Link to the video](http://img.youtube.com/vi/X8jsijhllIA/0.jpg)](http://www.youtube.com/watch?v=X8jsijhllIA "Link to the video")

In this video presentation, YouTuber [3Blue1Brown](https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw) breaks down the computer science behind error detection in an approachable way.

# What is the Video About?

In order to explain error detection, the presenter walks viewers through the algorithms behind [Hamming Codes](https://www.wikiwand.com/en/Hamming_code). This includes a brief history of the method, examples of why it's important, and walkthrough of how the Hamming algorithm works.

I could never do as good a job as the video at explaining these concepts&mdash;not to mention it's way out of the scope of this post&mdash;so, if you're interested, I'd recommend watching the video itself. What we're really interested in is...

# The Presentation

Let's breakdown _how_ this topic is being conveyed. We will see how the presenter makes concepts approachable through his choices of medium and structure.

## Breaking Down the Format

The talk includes simple animations of the concepts at work accompanied by explanation from the presenter. 3Blue1Brown takes the form of an invisible narrator; though, sometimes he appears as an anthropomorphized `pi`. In removing himself from the content, 3Blue1Brown places emphasis on the material, not on himself.

The content is well explained, with the animations providing clear interpretations of the complex mathematical concepts. By putting a minimal number of words on screen, and instead focusing on supplemental animations, the presenter provides an effective multimedia presentation. The animations highlight a concrete form of what is being explained and do not distract from the content. Together, the explanation and graphics create a captivating presentation, good for auditory and visual learners alike.

## Video Structure and Flow

The presentation starts off with a real-world example of where error correction is useful. 3Blue1Brown hooks the audience by presenting the question: how can DVD a be read accurately when scratched? He illustrates how the naive approach, storing 3 copies of a file, takes far too much space to be effective. He then draws the viewer in by contrasting the 66% memory cost of this method with the 3.5% cost of the Hamming method.

Next, instead of following this claim with a barrage of mathematics, the presenter breaks down the solution's history and builds up the algorithm in deliberate, discrete steps. These include the concept of a "parity bit," using those to make masks, using those to isolate a problem bit, then finally to scaling the problem up to arbitrarily large messages. This approach is what makes this presentation so effective. The video is structured in such a way that the viewer _feels_ like a **"retroactive inventor"** of the algorithm.

This problem-solution structure builds an intuition for how this algorithm works. This is far more effective than simply stating the problem and the solution.

Though the video is engaging, it leaves something to be desired in terms of a **call to action**. It seems as though the only reason provided to actually learn these concepts is for "educational purposes." I would have liked to see more inscentive for different groups to take interest, beyond just curious computer science students.
