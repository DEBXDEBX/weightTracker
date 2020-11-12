class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");
    // select forms
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
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
  } // End constructor
} // End Elements class
