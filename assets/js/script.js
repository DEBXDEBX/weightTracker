"use strict";
// webPreferences: true sets up the require in the script js file electron version 5.0.0 and above
// mainWindow = new BrowserWindow({
//   webPreferences: {
//     nodeIntegration: true
//   }
// });   index.js
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");
const electron = require("electron");
const { ipcRenderer } = electron;

//Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const clickAudio = document.querySelector("#clickAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const tabAudio = document.querySelector("#tabAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
// D3 variables
let width = 600;
let height = 400;
let barPadding = 10;
let numBars = 12;
let barWidth = width / numBars - barPadding;
let svgDiv = document.querySelector("#svgDiv");
let tooltip = d3.select("body").append("div").classed("tooltip", true);
let padding = 30;
//Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);

// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
// this is for the fontSize
let root = document.querySelector(":root");
// auto load check box
let checkBox = document.querySelector("#autoLoad");
// temp hold for array
let settingsArrayContainer;

//The start of program exicution.
window.onload = function () {
  startUp();
};

//startUp
function startUp() {
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "weightTracker") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
    var x = document.querySelector("#autoLoad").checked;
    if (x === true) {
      if (settings.filePathArray) {
        autoLoadYearObjects(settings.filePathArray);
      }
    }
  }
}
//*************************************************** */
// Helper functions
//*************************************************** */
function pushFileSettingsContainer(filePath) {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  settingsArrayContainer.forEach((element) => {
    if (element === filePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    warningNameTakenAudio.play();
    display.showAlert("That file is already loaded", "error");
    return;
  }

  // add it too tempHOld
  settingsArrayContainer.push(filePath);
}
function drawD3() {
  svgDiv.style.display = "flex";

  // document.querySelector("#mainSvg").innerHTML = "";
  el.mainSvg.innerHTML = "";

  d3.select(el.mainSvg)
    .attr("width", width)
    .attr("height", height)
    .selectAll("rect")
    .data(arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", function (d) {
      return d.weight;
    })
    .attr("y", function (d) {
      return height - d.weight;
    })
    .attr("x", function (d, i) {
      return (barWidth + barPadding) * i;
    })
    .attr("fill", "#0af30a")
    .on("mousemove", function (d) {
      tooltip
        .style("opacity", 1)
        .style("left", d3.event.x - tooltip.node().offsetWidth / 2 + "px")
        .style(
          "top",
          d3.event.y + 25 + "px"
        ).html(`<h5>${arrayOfYearObjs[yearIndex].name}</h5><h5>${d.name}</h5>
               <h5>${d.weight.toFixed(1)} LB</h5>`);
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  // add title
  d3.select(el.mainSvg)
    .append("text")
    .attr("x", width / 2)
    .attr("y", padding)
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .style("font-size", "1.5rem")
    .style("font-weight", "900")
    .text(arrayOfYearObjs[yearIndex].name);

  // left svg
  if (yearIndex === 0) {
    // do fake stuff
    // document.querySelector("#leftSvg").innerHTML = "";
    el.leftSvg.innerHTML = "";
    //fake array
    let fakeArrayOfMonthObjects = [];
    // create the 12 months
    let January = new MonthObject("January", 10);
    fakeArrayOfMonthObjects.push(January);
    let February = new MonthObject("February", 15);
    fakeArrayOfMonthObjects.push(February);
    let March = new MonthObject("March", 20);
    fakeArrayOfMonthObjects.push(March);
    let April = new MonthObject("April", 25);
    fakeArrayOfMonthObjects.push(April);
    let May = new MonthObject("May", 30);
    fakeArrayOfMonthObjects.push(May);
    let June = new MonthObject("June", 35);
    fakeArrayOfMonthObjects.push(June);
    let July = new MonthObject("July", 40);
    fakeArrayOfMonthObjects.push(July);
    let August = new MonthObject("August", 45);
    fakeArrayOfMonthObjects.push(August);
    let September = new MonthObject("September", 50);
    fakeArrayOfMonthObjects.push(September);
    let October = new MonthObject("October", 55);
    fakeArrayOfMonthObjects.push(October);
    let November = new MonthObject("November", 60);
    fakeArrayOfMonthObjects.push(November);
    let December = new MonthObject("December", 65);
    fakeArrayOfMonthObjects.push(December);
    // next part draw fake graph with no real data
    el.leftSvg.innerHTML = "";
    d3.select(el.leftSvg)
      .attr("width", width)
      .attr("height", height)
      .selectAll("rect")
      .data(fakeArrayOfMonthObjects)
      .enter()
      .append("rect")
      .attr("width", barWidth)
      .attr("height", function (d) {
        return d.weight;
      })
      .attr("y", function (d) {
        return height - d.weight;
      })
      .attr("x", function (d, i) {
        return (barWidth + barPadding) * i;
      })
      .attr("fill", "#aba3f2")
      .on("mousemove", function (d) {
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.x - tooltip.node().offsetWidth / 2 + "px")
          .style("top", d3.event.y + 25 + "px").html(`<h5>${d.name}</h5>
                 <h5>${d.weight.toFixed(1)} LB</h5>`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  } else {
    // Draw previous year on the left side
    el.leftSvg.innerHTML = "";
    d3.select(el.leftSvg)
      .attr("width", width)
      .attr("height", height)
      .selectAll("rect")
      .data(arrayOfYearObjs[yearIndex - 1].arrayOfMonthObjects)
      .enter()
      .append("rect")
      .attr("width", barWidth)
      .attr("height", function (d) {
        return d.weight;
      })
      .attr("y", function (d) {
        return height - d.weight;
      })
      .attr("x", function (d, i) {
        return (barWidth + barPadding) * i;
      })
      .attr("fill", "#aba3f2")
      .on("mousemove", function (d) {
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.x - tooltip.node().offsetWidth / 2 + "px")
          .style(
            "top",
            d3.event.y + 25 + "px"
          ).html(`<h5>${arrayOfYearObjs[yearIndex - 1].name}</h5><h5>${d.name}</h5>
                 <h5>${d.weight.toFixed(1)} LB</h5>`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // add title
    d3.select(el.leftSvg)
      .append("text")
      .attr("x", width / 2)
      .attr("y", padding)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .style("font-size", "1.5rem")
      .style("font-weight", "900")
      .text(arrayOfYearObjs[yearIndex - 1].name);
  }
} //End function drawD3()

// Sort an array by it's name
function sortArrayByName(array) {
  array.sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be eimagePathual
    return 0;
  }); //End sort function
}
// get the value of the selected radio button
function getRadioValue(form, name) {
  var val;
  // get list of radio buttons with specified name
  var radios = form.elements[name];
  // loop through list of radio buttons
  for (var i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}

function mapOutKey(key, array) {
  const newArray = array.map(function (item) {
    return item[key];
  });
  return newArray;
}
function autoLoadYearObjects(array) {
  array.forEach(function (item) {
    readFileContents(item);
  });
}

function readFileContents(filepath) {
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file.";
      let msgType = "error";
      display.showAlert(message, msgType);
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data";
        let msgType = "error";
        display.showAlert(message, msgType);
        return;
      }

      if (data) {
        if (data.fileType === "ElectronWeightTracker2019September") {
          // set filepath: This is in case you moved your file
          data.fileNamePath = filepath;

          // check if the fileNamePath already exists if it does alert and return
          // make a variable to return
          let isTaken = false;
          arrayOfYearObjs.forEach((element) => {
            if (element.fileNamePath === data.fileNamePath) {
              isTaken = true;
            }
          });
          if (isTaken) {
            display.showAlert("That file is already loaded", "error");
            // redisplay
            // get the names for all the years
            // and then send them to the Display
            display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
            return;
          }
          // create a yearObj object
          let newYearObject = new YearObject(
            data.name,
            data.fileNamePath,
            data.arrayOfMonthObjects
          );
          // push the file cab obj into the array of file cabinets
          arrayOfYearObjs.push(newYearObject);
          sortArrayByName(arrayOfYearObjs);
          // write the file cab object to disk
          newYearObject.writeYearToHardDisk(fs);
          // redisplay
          // get the names for all the years
          // and then send them to the Display
          display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
          return;
        } else {
          let message =
            "This is not a valid ElectronWeightTracker2019September file";
          let msgType = "error";
          display.showAlert(message, msgType);
        }
      }
    }
  });
}
function loadUpSettingsForm() {
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "weightTracker") {
    // set check box
    if (settings.autoLoad) {
      // check the box
      checkBox.checked = true;
    } else {
      // uncheck the box
      checkBox.checked = false;
    }

    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        document.querySelector("#x-small").checked = true;
        break;
      case "small":
        document.querySelector("#small").checked = true;
        break;
      case "normal":
        document.querySelector("#normal").checked = true;
        break;
      case "large":
        document.querySelector("#large").checked = true;
        break;
      case "x-large":
        document.querySelector("#x-large").checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()

function applySettings(settings) {
  if (settings.autoLoad === true) {
    document.querySelector("#autoLoad").checked = true;
  }

  switch (settings.fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
} // End
//************************************************ */
// IPC
//************************************************ */

// listen for index.js to show settings form
ipcRenderer.on("SettingsForm:show", (event) => {
  loadUpSettingsForm();
  display.displayNone(svgDiv);
  display.showSettingsForm();
});

// listen for inedex.js to send data
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); // End ipcRenderer.on("Display:showAlert"

// listen for inedex.js to send data
ipcRenderer.on("year:add", (event, dataObj) => {
  if (dataObj.name === "") {
    display.showAlert("You did not enter a name for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display

    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }

  if (isNaN(Number(dataObj.name))) {
    display.showAlert("You did not enter a number for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display

    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    display.showAlert("You clicked cancel", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display

    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach((element) => {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    display.showAlert("That file is already loaded", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display

    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(dataObj.name, dataObj.fileNamePath);
  // create the 12 months
  let January = new MonthObject("January");
  newYear.arrayOfMonthObjects.push(January);
  let February = new MonthObject("February");
  newYear.arrayOfMonthObjects.push(February);
  let March = new MonthObject("March");
  newYear.arrayOfMonthObjects.push(March);
  let April = new MonthObject("April");
  newYear.arrayOfMonthObjects.push(April);
  let May = new MonthObject("May");
  newYear.arrayOfMonthObjects.push(May);
  let June = new MonthObject("June");
  newYear.arrayOfMonthObjects.push(June);
  let July = new MonthObject("July");
  newYear.arrayOfMonthObjects.push(July);
  let August = new MonthObject("August");
  newYear.arrayOfMonthObjects.push(August);
  let September = new MonthObject("September");
  newYear.arrayOfMonthObjects.push(September);
  let October = new MonthObject("October");
  newYear.arrayOfMonthObjects.push(October);
  let November = new MonthObject("November");
  newYear.arrayOfMonthObjects.push(November);
  let December = new MonthObject("December");
  newYear.arrayOfMonthObjects.push(December);
  // push the year obj into the array of year objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);

  // redisplay
  // get the names for all the years
  // and then send them to the Display

  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
});
// End ipcRenderer.on("year:add"********************

// listen for index.js to change font size
ipcRenderer.on("FontSize:change", (event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
}); // End ipcRenderer.on("FontSize:change"

// listen for inedex.js to send data
ipcRenderer.on("yearObj:load", (event, data) => {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach((element) => {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    display.showAlert("That file is already loaded", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display

    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(
    data.name,
    data.fileNamePath,
    data.arrayOfMonthObjects
  );
  // push the year obj into the array of year Objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);
  // redisplayss
  // get the names for all the years
  // and then send them to the Display

  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});
//End ipcRenderer.on("year:load"*****************************
// ***********************************************************

//*************************************************** */

el.yearList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("year")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".year");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function () {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "year";
        }
        el[i].className = "year active";
      };
    }
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);

    // Bug fix
    if (isNaN(index)) {
      //when you click out side of te tab
      // if it's not a number return
      return;
    }
    yearIndex = index;
    tabAudio.play();
    display.displayBlock(this.leftSvg);
    display.displayBlock(this.mainSvg);
    // get the array of months and send it to display
    display.paintMonthTabs(arrayOfYearObjs[yearIndex].arrayOfMonthObjects);
    drawD3();
    return;
  } // End code to set the active class
}); // End el.yearList.addEventListener()

el.monthList.addEventListener("click", (e) => {
  // this is for clicking on the month list
  if (!e.target.classList.contains("month")) {
    return;
  }
  // event delegation
  if (e.target.classList.contains("month")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".month");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function () {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "month";
        }
        el[i].className = "month active";
      };
    }
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    monthIndex = index;

    // Bug fix
    if (isNaN(monthIndex)) {
      //when you click out side of te tab
      // if it's not a number return
      return;
    }
    clickAudio.play();
    this.myForm.reset();
    display.hideMyForm();
    display.showMyForm();
    document.querySelector("#weightInput").focus();
    return;
  } // End code to set the active class
});

// form btn
el.saveWeightBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (isNaN(Number(el.weightText.value))) {
    display.showAlert("You did not enter a number for the Weight!", "error");
    el.myForm.reset();
    return;
  }

  let weight = el.weightText.value.trim();
  if (!weight) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a weight!", "error");
    return;
  }
  weight = Number(weight);

  // set weight
  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].weight = weight;
  addAudio.play();
  // save
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs);
  el.myForm.reset();
  display.hideMyForm();
  // get the array of months and send it to display
  display.paintMonthTabs(arrayOfYearObjs[yearIndex].arrayOfMonthObjects);
  drawD3();
});
// form btn
el.cancelBtn.addEventListener("click", (e) => {
  cancelAudio.play();
  el.myForm.reset();
  display.hideMyForm();
  // get rid of active class
  let activeTabList = document.getElementsByClassName("month active");
  if (activeTabList) {
    let newArray = Array.from(activeTabList);
    for (let item of newArray) {
      item.classList.remove("active");
    }
  }
});

// ***********************************************************
// settings
// *************************************************************
// when You click on save settings Btn
document.querySelector("#settingsSave").addEventListener("click", (e) => {
  e.preventDefault();

  // get form data to create a settings object

  // fontsize radio code
  let fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  let settingsStorage = new SettingsStorage();
  let settingsObj = new SettingsObj();
  // set the object values

  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  let y = document.querySelector("#autoLoad").checked;
  if (y === true) {
    settingsObj.autoLoad = true;
  } else {
    settingsObj.autoLoad = false;
  }
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // clear two arrays
    // setting the length to Zero emptys the array
    arrayOfYearObjs.length = 0;
    settingsArrayContainer.length = 0;
    display.displayNone(el.settingsForm);
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.displayNone(el.settingsForm);
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
}); // End

// when You click on settings form cancel Btn
document.querySelector("#settingsCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  // hide form
  display.displayNone(el.settingsForm);
  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});

// when You click on settings form factory reset btn
document.querySelector("#factoryReset").addEventListener("click", (e) => {
  btnAudio.play();
  let settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// When You click on settings form add path to autoload Btn
document.querySelector("#settingsAddPath").addEventListener("click", (e) => {
  e.preventDefault();

  // this is for extsions
  let myOptions = {
    filters: [
      {
        name: "Custom File Type",
        extensions: ["deb"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  };

  dialog.showOpenDialog(null, myOptions, (fileNames) => {
    if (fileNames === undefined || fileNames.length === 0) {
      display.showAlert("No file selected", "error");
    } else {
      // got file name

      for (let filePath of fileNames) {
        pushFileSettingsContainer(filePath);
      }

      addImageAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  });
});

// when You click on x to delete a file path
document.querySelector("#autoLoadList").addEventListener("click", (e) => {
  e.preventDefault();
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    // this gets the data I embedded into the html
    let dataIndex = e.target.parentElement.parentElement.dataset.index;
    let deleteIndex = parseInt(dataIndex);
    // delete path
    settingsArrayContainer.splice(deleteIndex, 1);
    warningSelectAudio.play();
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
  }
});
