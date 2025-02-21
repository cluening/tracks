class TrackList {
  tracklist = [];

  // Add a new piece of track
  add(track) {
    this.tracklist.push(track);

    return(track.cursor);
  }

  // Draw the whole track list into the given context
  draw(ctx) {
    for (let track of this.tracklist){
      track.draw(ctx);
      track.drawPorts(ctx);
    }
  }
}
