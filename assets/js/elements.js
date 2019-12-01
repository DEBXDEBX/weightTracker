class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");

    // // select forms
    this.myForm = document.querySelector("#myForm");
    this.settingsForm = document.querySelector("#settingsForm");

    // select svg
    this.mainSvg = document.querySelector("#mainSvg");
    this.leftSvg = document.querySelector("#leftSvg");

    // select form btns
    this.saveWeightBtn = document.querySelector("#weightAddBtn");
    this.cancelBtn = document.querySelector("#weightCancel");
    // // select textName and textArea
    this.weightText = document.querySelector("#weightInput");
    // // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
  } // End constructor
} // End Elements class
