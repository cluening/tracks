# Tracks!

A Lego train layout design tool, heavily inspired by Matthew D. Bates' Track Designer (https://www.diesel-dave.com/lego/train_depot/td.htm).

I've always loved the simple aesthetic of Track Designer's design, but it hasn't been updated since the late 1990s, and it is slowly getting harder to run on modern computers.  So, here's a reimplementation of some of my favorite parts of it in a platform-neutral format.

Original Train Depot Track Kit bitmaps used in accordance with their terms and conditions. (https://www.diesel-dave.com/lego/train_depot/trackkit.htm#tnc)


## Usage

Just want to draw a layout?  Go for it: https://www.wirelesscouch.net/tracks/

Want to run your own copy?  Start out by cloning this repository.

This is a self-contained javascript application, but it needs a web server to serve it up.  You can put it on any ol' web server, or start a local one with python:
```
cd tracks
python -m http.server -b 127.0.0.1 8080
```

With that running, just point your browser at http://localhost:8080/ and start building a layout!


## Parts Library Updates

While the original Track Designer had an extensive library of train-related pieces and sets, I've only included the standard 9 volt track pieces this parts library.  They work plenty well for modern plastic track too, and maybe I'll expand the parts library over time.

Javascript can read JSON really easily, but humans can write YAML more easily.  So, the parts library's metadata is stored in YAML format.  After making changes, converting it to JSON is easy using the `yq` command:
```
yq -p yaml -o json parts.yaml
```
