#!/bin/bash

# script for auto-deploying code to my github.io
# arg $1 must be in quotes and will be the commit message

cd ~/Code/Games/singleplayer/RecycleClicker

cp ./index.html ~/Code/BenEskildsen.github.io/RecycleClicker/
cp ./README ~/Code/BenEskildsen.github.io/RecycleClicker/
cp ./TODO ~/Code/BenEskildsen.github.io/RecycleClicker/
cp ./time.log ~/Code/BenEskildsen.github.io/RecycleClicker/
cp ./favicon.png ~/Code/BenEskildsen.github.io/RecycleClicker/

cp -rf css/ ~/Code/BenEskildsen.github.io/RecycleClicker/css
cp -rf js/ ~/Code/BenEskildsen.github.io/RecycleClicker/js
cp -rf bin/ ~/Code/BenEskildsen.github.io/RecycleClicker/bin

# might as well just commit everything
git add --all
git commit -m "$1"

git push


cd ~/Code/BenEskildsen.github.io

git add --all
git commit -m "$1"

git push
