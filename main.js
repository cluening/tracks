let partslibrary = Object();
const layout = new TrackList();
const partslist = [];
const partskeytable = {};
let cursor = new Cursor();


function onCanvasClick(event) {
  cursor = cursor.handleCanvasClick(event.offsetX, event.offsetY);
  window.requestAnimationFrame(updateScreen);
}


function onCanvasDoubleClick(event) {
  console.log("Double double!");
  cursor = cursor.handleCanvasDoubleClick(event.offsetX, event.offsetY);
  window.requestAnimationFrame(updateScreen);
}


function onButtonClick(event) {
  const part = event.currentTarget.getAttribute("data-part");
  const geometry = event.currentTarget.getAttribute("data-geometry");

  cursor = cursor.handleButtonClick(part, geometry);
  adjustCanvas();

  window.requestAnimationFrame(updateScreen);
}


// FIXME: this currently makes it all the way to the end on _any_ keypress, meaning, for example, it will scroll the cursor back into view if you just press and release the shift key.  It needs some way to tell if the key that was pressed actually did anything.
function onKeyDown(event) {
  // console.log(event.code);
  let modifier;

  // Prevent the window from scrolling on arrow presses
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
  }

  // Record any modifier keys being held.  I'm only going to care about one modifier at a time.
  if (event.altKey) {
    modifier = "Alt";
  } else if (event.ctrlKey) {
    modifier = "Control";
  } else if (event.metaKey) {
    modifier = "Meta";
  } else if (event.shiftKey) {
    modifier = "Shift";
  } else {
    modifier = "None";
  }

  cursor = cursor.handleKeyPress(event.code, modifier);
  adjustCanvas();

  window.requestAnimationFrame(updateScreen);
}


function adjustCanvas() {
  const canvas = document.getElementById("layout");
  const canvaswrapper = document.getElementById("layoutwrapper");
  const layoutpadding = 32;

  // Expand and shift the canvas down or to the right if the layout grows
  // beyond the top or left bounds
  let xadd = 0;
  let yadd = 0;
  if (cursor.x < 0 + layoutpadding) {
    xadd = (0 - cursor.x) + layoutpadding;
  }
  if (cursor.y < 0 + layoutpadding) {
    yadd = (0 - cursor.y) + layoutpadding;
  }

  cursor.x += xadd;
  cursor.y += yadd;
  if (xadd != 0 || yadd != 0) {
    for (const piece of layout.tracklist) {
      piece.location.x += xadd;
      piece.location.y += yadd;
      for (const port of piece.ports) {
        port.x += xadd;
        port.y += yadd;
      }
      for (const corner of piece.bounds) {
        corner.x += xadd;
        corner.y += yadd;
      }
    }
  }

  canvas.width += xadd;
  canvas.height += yadd;

  // Extend the canvas down or to the right if the layout grows beyond those
  // bounds
  if (cursor.x > canvas.width - layoutpadding) {
    canvas.width = cursor.x + layoutpadding;
  }
  if (cursor.y > canvas.height - layoutpadding) {
    canvas.height = cursor.y + layoutpadding;
  }

  // If the cursor is off the screen, scroll it back into view
  viewportx0 = canvaswrapper.scrollLeft;
  viewporty0 = canvaswrapper.scrollTop;
  viewportx1 = canvaswrapper.clientWidth + canvaswrapper.scrollLeft;
  viewporty1 = canvaswrapper.clientHeight + canvaswrapper.scrollTop;

  if (cursor.x < viewportx0 + layoutpadding) {
    canvaswrapper.scrollBy(cursor.x - (viewportx0 + layoutpadding), 0);
  }
  if (cursor.y < viewporty0 + layoutpadding) {
    canvaswrapper.scrollBy(0, cursor.y - (viewporty0 + layoutpadding));
  }
  if (cursor.x > viewportx1 - layoutpadding) {
    canvaswrapper.scrollBy(cursor.x - (viewportx1 - layoutpadding), 0);
  }
  if (cursor.y > viewporty1 - layoutpadding) {
    canvaswrapper.scrollBy(0, cursor.y - (viewporty1 - layoutpadding));
  }
}


async function onLoad() {
  const canvas = document.getElementById("layout");
  const canvaswrapper = document.getElementById("layoutwrapper");

  canvas.width = canvaswrapper.clientWidth;
  canvas.height = canvaswrapper.clientHeight;
  canvas.focus();

  console.log("Loading!");

  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("click", onCanvasClick);
  // Double clicks aren't finished yet, so this is disabled for now
  // canvas.addEventListener("dblclick", onCanvasDoubleClick);

  partslibrary = await loadPartsLibrary();
  buildToolbar();

  cursor.x = 100;
  cursor.y = 100;
  cursor.angle = 0;

  // console.log("-------- Adding new straight piece --------");
  // let newpiece = new TrackPiece("straight", "straight", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new left curved piece --------");
  // newpiece = new TrackPiece("curve", "left", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new right curved piece --------");
  // newpiece = new TrackPiece("curve", "right", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);

  // console.log("-------- Adding new left switch piece --------");
  // newpiece = new TrackPiece("leftpoint", "rightjoin", cursor);
  // console.log("Location:");
  // console.log(newpiece.location);
  // console.log("Angle:");
  // console.log(newpiece.angle);
  // console.log("Ports:");
  // console.log(newpiece.ports);
  // console.log("Active port:");
  // console.log(newpiece.activeport);
  // console.log("Cursor:");
  // console.log(newpiece.cursor);
  // cursor = newpiece.cursor;
  // newpiece.drawPorts(ctx);


  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("32087", "crossing", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2865", "straight", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "right", cursor));
  // cursor = tracklist.add(new TrackPiece("2867", "left", cursor));

  // tracklist.draw(ctx);
  // cursor.draw(ctx);
  window.requestAnimationFrame(updateScreen);
}


async function loadImages(imagepaths) {
  const promises = Object();
  const images = Object();

  for (const angle in imagepaths) {
    let url = imagepaths[angle];
    //console.log("Loading: " + angle);
    promises[angle] = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = () => reject("Failed to load image from " + url);
    });
  }

  for (const angle in imagepaths) {
    images[angle] = await promises[angle];
  }

  return(images);
}


async function loadImage(imagepath) {
  //const promise = Object();
  //const image = Object();

  let url = imagepath;
  //console.log("Loading: " + angle);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject("Failed to load image from " + url);
  });

  const image = await promise;

  return(image);
}


async function loadPartsLibrary() {
  const url = "partslibrary/parts.json";
  let partslibrary;

  try {
    const response = await fetch(url, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    partslibrary = await response.json();
    //console.log(partslibrary);

    for (const partname in partslibrary) {
      //console.log("Partname: " + partname);
      //partslibrary[partname]["images"] = await loadImages(partslibrary[partname].imagepaths);
      for (const angle in partslibrary[partname].images) {
        partslibrary[partname].images[angle].image = await loadImage("partslibrary/" + partslibrary[partname].images[angle].path)
      }
    }

  } catch (error) {
    console.error(error.message);
  }

  return(partslibrary);
}


function buildToolbar() {
  const toolbar = document.getElementById("toolbarwrapper");
  for (const part in partslibrary) {
    // console.log("Configuring " + part);
    for (const geometry in partslibrary[part].geometry) {
      const keypress = partslibrary[part].geometry[geometry].keypress;
      const keymodifier = partslibrary[part].geometry[geometry].keymodifier;

      // Create a button for this part
      const newbutton = document.createElement("button");
      let tooltipstring = "";
      // newbutton.innerText = part + ": " + geometry;
      newbutton.setAttribute("class", "toolbarbutton");
      newbutton.setAttribute("id", "button-" + part + "-" + geometry);
      if (keymodifier != undefined && keymodifier != "None"){
        tooltipstring = partslibrary[part].geometry[geometry].keymodifier + "-";
      }
      if (keypress != undefined){
        tooltipstring += partslibrary[part].geometry[geometry].keypress;
        newbutton.setAttribute("title", tooltipstring);
      }
      newbutton.style.order = partslibrary[part].geometry[geometry].button.index;
      newbutton.setAttribute("data-part", part);
      newbutton.setAttribute("data-geometry", geometry);
      newbutton.addEventListener("click", onButtonClick);

      const newimage = document.createElement("img");
      newimage.setAttribute("src", "partslibrary/" + partslibrary[part].geometry[geometry].button.path);
      newbutton.appendChild(newimage);

      toolbar.appendChild(newbutton);

      // Create a key table entry for this part
      if (keypress != undefined && keymodifier != undefined) {
        if (partskeytable["Key" + keypress] == undefined) {
          partskeytable["Key" + keypress] = {};
        }
        partskeytable["Key" + keypress][keymodifier] = { part: part, geometry: geometry };
      }
    }
  }
}


function updateScreen(time) {
  drawCanvas();
  updateStatusBar();
}


function drawCanvas() {
  const canvas = document.getElementById("layout");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  layout.draw(ctx);
  cursor.draw(ctx);
}


function updateStatusBar() {
  const piececount = layout.tracklist.length;
  const piececountspan = document.getElementById("piececount");

  piececountspan.innerHTML = piececount;
}


// Export the current layout
function exportLayout(filename) {
  console.log("Downloading a file");

  const blob = layout.createExportBlob();

  const link = document.createElement("a");
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const downloadclickevent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  link.dispatchEvent(downloadclickevent);

  window.URL.revokeObjectURL(link.href);
  link.remove();
}


// Force a click on the hidden file selection input element
function displayFileSelect(event) {
  console.log("Selecting a file to import!");

  fileselector = document.getElementById("fileselector");
  fileselector.click();
}


// Display the export dialog
function displayExportDialog(event) {
  const exportdialog = document.getElementById("exportdialog");
  
  exportdialog.returnValue = "";
  exportdialog.showModal();
}


// Import a layout from a previously-exported file
// FIXME: I should pop up a dialog confirming they want to clear the current layout, and then do that clearing before loading the new one
async function importLayout(event) {
  console.log("Actually importing a layout!");

  let layoutimport;

  try {
    layoutimport = JSON.parse(await loadLayout(document.getElementById("fileselector").files[0]));
  } catch (exception) {
    displayInfoDialog("Error", "Could not parse imported file");
    return;
  }

  // First add all of the pieces, without connections
  // FIXME: I should probably do some sanity checking as I load these
  //  - is the part in the library?
  //  - are all of the things defined?
  for (const piece of layoutimport.piecelist) {
    cursor = new Cursor();
    cursor.x = piece.location.x;
    cursor.y = piece.location.y;
    cursor.angle = piece.angle;

    cursor = layout.add(new TrackPiece(piece.type, piece.geometry, cursor), false);
    adjustCanvas();
  }

  // Go back and make all of the connections
  for (const importpiecenum in layoutimport.piecelist) {
    const importpiece = layoutimport.piecelist[importpiecenum];
    for (importportnum in importpiece.ports) {
      const port = importpiece.ports[importportnum];
      if (port.connectedpiece == -1) {
        continue;
      }
      console.log(port);
      // FIXME: catch if otherpiece comes back undefined
      const otherpiece = layout.tracklist[port.connectedpiece];
      // FIXME: catch if x or y come back undefined
      const x = layout.tracklist[importpiecenum].ports[importportnum].x;
      const y = layout.tracklist[importpiecenum].ports[importportnum].y;
      const otherportnum = otherpiece.getClosestPort(x, y);
      layout.tracklist[importpiecenum].connectPiece(importportnum, otherpiece, otherportnum);
    }
  }

  window.requestAnimationFrame(updateScreen);
}


// Load a file and extract its text
async function loadLayout(layoutfile) {
  // FIXME: catch errors if the file can't be read
  const promise = new Promise((resolve, reject) => {
    const filereader = new FileReader();
    filereader.onload = () => resolve(filereader.result);
    filereader.onerror = () => reject("Failed to load layout");
    filereader.readAsText(layoutfile);
  });

  const layoutfilecontent = await promise;

  return(layoutfilecontent);
}


function exportDialogClosed(event) {
  console.log("Dialog was closed!");

  const exportdialog = document.getElementById("exportdialog");
  console.log(exportdialog.returnValue);

  if (exportdialog.returnValue == "export") {
    const filename = document.getElementById("exportfilename").value + ".tracks";
    exportLayout(filename);
  }

}


function displayInfoDialog(title, body) {
  const infodialog = document.getElementById("infodialog");
  const dialogtitle = infodialog.querySelector(".dialogtitle");
  const dialogbody = infodialog.querySelector(".dialogbody");

  dialogtitle.innerHTML = title;
  dialogbody.innerHTML = body;

  infodialog.showModal();
}
