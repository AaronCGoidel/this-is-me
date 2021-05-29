---
title: Cookie
slug: cookie
subtitle: The world's smartest, most dynamic cookbook
cover: cookie.webp
tags: ReactNative, Graph Theory
links: github.com/UpperMountain/dynamic-cookbook
---

# What's this?

Cookie is the world's smartest cookbook. Having realized that all online cookbooks seem to have no more functionality than a standard print book, I set out to create a cookbook that was smart and dynamic in order to help home cooks in the kitchen.

## Motivations

I love this project since it was a fun way to merge my passions for cooking and computer science. I relish opportunities to use CS as a tool to further my other interests.

# How it works

Cookie is a TypeScript ReactNative app with leverages graph theory to dynamically merge, adapt, and schedule the steps in any number of recipes. This allows us to build new highly efficient recipes out of smaller ones. Cookie ensures you never repeat steps and by paying attention to user feedback, knows when you're actively cooking, vs when actions are happening passively so it serves you the right steps.

## Preference

The Cookie algorithm also allows us to take personal preference into account. Don't have a stand mixer? We will swap out the mixer-related steps for instructions for making the same recipe with a bowl and whisk. Even better, the rest of the recipe is updated accordingly to account for the added time those new steps add.

## Merging

Cookie's dynamic merging lets us collate recipes into one. Want to make `x` main course, `y` side, and `z` appetizer? Cookie will merge the recipes so you get one shopping list, one time estimate, one equpment list, and---most importantly---one set of instructions that is freshly optimized. For instance, if two recipes contain a step to chop carrots, Cookie will merge those into one. No repeated work means less time cooking and more time living your life.

## Scheduling

Further, Cookie's intelligent scheduling knows which steps are active and which are passive, only giving you new tasks to perform when you're not actively engaged. It won't tell you to chop an onion if you're in the middle of peeling carrots, but will if you have just put water to boil. It's even smart enough to not give you an active task if you have something you'll need to take out of the oven very soon.