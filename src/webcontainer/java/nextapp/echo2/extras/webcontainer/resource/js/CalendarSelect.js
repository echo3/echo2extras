/* 
 * This file is part of the Echo2 Extras Project.
 * Copyright (C) 2005-2006 NextApp, Inc.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

ExtrasCalendarSelect = function(elementId, containerElementId, year, month, selectedDay) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.enabled = true;

    this.firstDayOfMonth = 4;
    this.daysInPreviousMonth = 29;
    this.daysInMonth = 31;
    this.month = month;
    this.selectedDay = selectedDay;
    this.year = year;
    
    this.foreground = ExtrasCalendarSelect.DEFAULT_FOREGROUND;
    this.background = ExtrasCalendarSelect.DEFAULT_BACKGROUND;
    this.border = ExtrasCalendarSelect.DEFAULT_BORDER;
    
    this.dayOfWeekNameAbbreviationLength = 1;
    this.dayOfWeekNames = ExtrasCalendarSelect.DEFAULT_DAY_OF_WEEK_NAMES;
    this.monthNames = ExtrasCalendarSelect.DEFAULT_MONTH_NAMES;
    this.firstDayOfWeek = ExtrasCalendarSelect.DEFAULT_FIRST_DAY_OF_WEEK;
    this.previousMonthDayStyle = ExtrasCalendarSelect.DEFAULT_PREVIOUS_MONTH_DAY_STYLE;
    this.nextMonthDayStyle = ExtrasCalendarSelect.DEFAULT_NEXT_MONTH_DAY_STYLE;
    this.currentMonthDayStyle = ExtrasCalendarSelect.DEFAULT_CURRENT_MONTH_DAY_STYLE;
    this.baseDayStyle = ExtrasCalendarSelect.DEFAULT_BASE_DAY_STYLE;
    this.selectedDayStyle = ExtrasCalendarSelect.DEFAULT_SELECTED_DAY_STYLE;
    this.yearFieldStyle = ExtrasCalendarSelect.DEFAULT_YEAR_FIELD_STYLE;
    this.monthSelectStyle = ExtrasCalendarSelect.DEFAULT_MONTH_SELECT_STYLE;
    this.dayTableStyle = ExtrasCalendarSelect.DEFAULT_DAY_TABLE_STYLE;
    
    this.yearIncrementImageSrc = null;
    this.yearDecrementImageSrc = null;
};

ExtrasCalendarSelect.DEFAULT_FOREGROUND = "#000000";
ExtrasCalendarSelect.DEFAULT_BACKGROUND = "#ffffff";
ExtrasCalendarSelect.DEFAULT_BORDER = "#5f5faf 2px groove";

ExtrasCalendarSelect.DEFAULT_DAY_OF_WEEK_NAMES = 
        new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
ExtrasCalendarSelect.DEFAULT_MONTH_NAMES = new Array(
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December");
ExtrasCalendarSelect.DEFAULT_FIRST_DAY_OF_WEEK = 0;

ExtrasCalendarSelect.MINIMUM_YEAR = 1582;
ExtrasCalendarSelect.MAXIMUM_YEAR = 9999;

ExtrasCalendarSelect.DEFAULT_PREVIOUS_MONTH_DAY_STYLE = "color: #af9f9f;";
ExtrasCalendarSelect.DEFAULT_NEXT_MONTH_DAY_STYLE = "color: #9f9faf;";
ExtrasCalendarSelect.DEFAULT_CURRENT_MONTH_DAY_STYLE = "color: #000000;";

ExtrasCalendarSelect.DEFAULT_BASE_DAY_STYLE 
        = "cursor: pointer; text-align: right; border-width: 0px; "
        + "padding: 0px 5px;";
ExtrasCalendarSelect.DEFAULT_SELECTED_DAY_STYLE 
        = "cursor: default; text-align: right; border-width: 0px; "
        + "border-collapse: collapse; padding: 0px 5px; color: #ffffaf; background-color: #3f3f4f";
ExtrasCalendarSelect.DEFAULT_YEAR_FIELD_STYLE 
        = "text-align:center; background-color: #ffffcf; border-width: 1px; border-style: inset;";
ExtrasCalendarSelect.DEFAULT_MONTH_SELECT_STYLE 
        = "text-align:left; background-color: #ffffcf; border-width: 1px; border-style: inset;";

ExtrasCalendarSelect.prototype.calculateCalendarInformation = function() {
    var firstDate = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = firstDate.getDay();
    
    this.daysInMonth = ExtrasCalendarSelect.getDaysInMonth(this.year, this.month);
    if (this.month == 0) {
        this.daysInPreviousMonth = ExtrasCalendarSelect.getDaysInMonth(this.year - 1, 11);
    } else {
        this.daysInPreviousMonth = ExtrasCalendarSelect.getDaysInMonth(this.year, this.month - 1);
    }
};

/**
 * Renders the ExtrasCalendarSelect into the DOM.
 */
ExtrasCalendarSelect.prototype.create = function() {
    var i, j;
    var calendarDivElement = document.createElement("div");
    calendarDivElement.id = this.elementId;
    calendarDivElement.style.whiteSpace = "nowrap";
    
    var monthSelect = document.createElement("select");
    monthSelect.id = this.elementId + "_month";
    EchoDomUtil.setCssText(monthSelect, this.monthSelectStyle);
    for (i = 0; i < 12; ++i) {
        var optionElement = document.createElement("option");
        optionElement.appendChild(document.createTextNode(this.monthNames[i]));
        monthSelect.appendChild(optionElement);
    }
    calendarDivElement.appendChild(monthSelect);
    
    calendarDivElement.appendChild(document.createTextNode(" "));
    
    var yearDecrementSpanElement = document.createElement("span");
    yearDecrementSpanElement.id = this.elementId + "_yeardecrement";
    yearDecrementSpanElement.style.cursor = "pointer";
    if (this.arrowLeftImage) {
        var imgElement = document.createElement("img");
        imgElement.setAttribute("src", this.arrowLeftImage);
        imgElement.setAttribute("alt", "");
        yearDecrementSpanElement.appendChild(imgElement);
    } else {
        yearDecrementSpanElement.appendChild(document.createTextNode("<"));
    }
    calendarDivElement.appendChild(yearDecrementSpanElement);
    
    var yearField = document.createElement("input");
    yearField.id = this.elementId + "_year";
    yearField.setAttribute("type", "text");
    yearField.setAttribute("maxlength", "4");
    yearField.setAttribute("size", "5");
    EchoDomUtil.setCssText(yearField, this.yearFieldStyle);
    calendarDivElement.appendChild(yearField);
    
    var yearIncrementSpanElement = document.createElement("span");
    yearIncrementSpanElement.id = this.elementId + "_yearincrement";
    yearIncrementSpanElement.style.cursor = "pointer";
    if (this.arrowRightImage) {
        var imgElement = document.createElement("img");
        imgElement.setAttribute("src", this.arrowRightImage);
        imgElement.setAttribute("alt", "");
        yearIncrementSpanElement.appendChild(imgElement);
    } else {
        yearIncrementSpanElement.appendChild(document.createTextNode(">"));
    }
    calendarDivElement.appendChild(yearIncrementSpanElement);

    var tableElement = document.createElement("table");
    tableElement.id = this.elementId + "_table";
    
    tableElement.style.borderCollapse = "collapse";
    tableElement.style.margin = "1px";
    tableElement.style.border = this.border;
    tableElement.style.backgroundColor = this.background;
    tableElement.style.color = this.foreground;
    if (this.backgroundImage) {
        EchoCssUtil.applyStyle(tableElement, this.backgroundImage);
    }
    
    var tbodyElement = document.createElement("tbody");
    
    var trElement = document.createElement("tr");
    for (j = 0; j < 7; ++j) {
        var tdElement = document.createElement("td");
        tdElement.id = this.elementId + "_dayofweek_" + i;
        EchoDomUtil.setCssText(tdElement, this.baseDayStyle);
        var dayOfWeekName = this.dayOfWeekNames[(this.firstDayOfWeek + j) % 7];
        if (this.dayOfWeekNameAbbreviationLength > 0) {
            dayOfWeekName = dayOfWeekName.substring(0, this.dayOfWeekNameAbbreviationLength);
        }
        tdElement.appendChild(document.createTextNode(dayOfWeekName));
        trElement.appendChild(tdElement);
    }
    tbodyElement.appendChild(trElement);

    for (i = 0; i < 6; ++i) {
        trElement = document.createElement("tr");
        for (j = 0; j < 7; ++j) {
            tdElement = document.createElement("td");
            EchoDomUtil.setCssText(tdElement, this.baseDayStyle);
            tdElement.id = this.elementId + "_" + i + "_" + j;
            trElement.appendChild(tdElement);
        }
        tbodyElement.appendChild(trElement);
    }
    tableElement.appendChild(tbodyElement);
    
    calendarDivElement.appendChild(tableElement);
    
    var containerElement = document.getElementById(this.containerElementId);
    containerElement.appendChild(calendarDivElement);
    
    EchoEventProcessor.addHandler(this.elementId + "_table", "click", "ExtrasCalendarSelect.processDaySelect");
    EchoEventProcessor.addHandler(this.elementId + "_month", "change", "ExtrasCalendarSelect.processMonthSelect");
    EchoEventProcessor.addHandler(this.elementId + "_year", "change", "ExtrasCalendarSelect.processYearEntry");
    EchoEventProcessor.addHandler(this.elementId + "_yearincrement", "click", "ExtrasCalendarSelect.processYearIncrement");
    EchoEventProcessor.addHandler(this.elementId + "_yeardecrement", "click", "ExtrasCalendarSelect.processYearDecrement");
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "calendar", this);

    this.setDate(this.year, this.month, this.selectedDay, false);
};

/**
 * Removes the ExtrasCalendarSelect from the DOM and disposes of any allocated
 * resources.
 */
ExtrasCalendarSelect.prototype.dispose = function() {
    // Remove event listeners.
    EchoEventProcessor.removeHandler(this.elementId + "_table", "click");
    EchoEventProcessor.removeHandler(this.elementId + "_month", "change");
    EchoEventProcessor.removeHandler(this.elementId + "_year", "change");
    EchoEventProcessor.removeHandler(this.elementId + "_yearincrement", "click");
    EchoEventProcessor.removeHandler(this.elementId + "_yeardecrement", "click");
    
    // Remove calendar.
    var calendarElement = document.getElementById(this.elementId);
    calendarElement.parentNode.removeChild(calendarElement);
};

ExtrasCalendarSelect.prototype.processDaySelect = function(elementId) {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }

    if (elementId.indexOf("_dayofweek_") !== -1) {
        // Day of week clicked.
        return;
    }

    // Extract portion of id which describes cell number, e.g., if the clicked element
    var cellId = elementId.substring(this.elementId.length + 1);
    var row = cellId.charAt(0);
    var column = cellId.charAt(2);
    this.selectDayByCoordinate(column, row);
};

ExtrasCalendarSelect.prototype.processMonthSelect = function() {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        //BUGBUG. reset month.
        return;
    }
    
    var monthSelect = document.getElementById(this.elementId + "_month");
    this.setDate(this.year, monthSelect.selectedIndex, this.selectedDay, true);
};

ExtrasCalendarSelect.prototype.processYearDecrement = function() {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }
    
    if (this.year <= ExtrasCalendarSelect.MINIMUM_YEAR) {
        return;
    }
    
    --this.year;
    this.setDate(this.year, this.month, this.selectedDay, true);
};

ExtrasCalendarSelect.prototype.processYearEntry = function() {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }
    
    var yearField = document.getElementById(this.elementId + "_year");
    if (isNaN(yearField.value)) {
        return;
    }
    this.setDate(yearField.value, this.month, this.selectedDay, true);
};

ExtrasCalendarSelect.prototype.processYearIncrement = function() {
    if (!this.enabled || !EchoClientEngine.verifyInput(this.elementId, false)) {
        return;
    }
    
    if (this.year >= ExtrasCalendarSelect.MAXIMUM_YEAR) {
        return;
    }
    
    ++this.year;
    this.setDate(this.year, this.month, this.selectedDay, true);
};

/**
 * Re-renders the display of the calendar to reflect the current month/year
 * and selected date.
 */
ExtrasCalendarSelect.prototype.renderUpdate = function() {
    var day = 1 - this.firstDayOfMonth;
    for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < 7; ++j) {
            var tdElement = document.getElementById(this.elementId + "_" + i + "_" + j);
            
            while (tdElement.hasChildNodes()) {
                tdElement.removeChild(tdElement.firstChild);
            }
            
            var renderedText;
            var styleText;
            if (day < 1) {
                renderedText = this.daysInPreviousMonth + day;
                styleText = this.baseDayStyle + this.previousMonthDayStyle;
            } else if (day > this.daysInMonth) {
                renderedText = day - this.daysInMonth;
                styleText = this.baseDayStyle + this.nextMonthDayStyle;
            } else {
                renderedText = day;
                if (day == this.selectedDay) {
                    styleText = this.selectedDayStyle;
                } else {
                    styleText = this.baseDayStyle + this.currentMonthDayStyle;
                }
            }
            var textNode = document.createTextNode(renderedText);
            EchoDomUtil.setCssText(tdElement, styleText);
            tdElement.appendChild(textNode);
            ++day;
        }
    }
};

ExtrasCalendarSelect.prototype.selectDayByCoordinate = function(column, row) {
    var selectedDay, selectedMonth, selectedYear;
    var dayCellNumber = parseInt(column) + (row * 7);
    if (dayCellNumber < this.firstDayOfMonth) {
        if (this.month == 0) {
            selectedMonth = 11;
            selectedYear = this.year - 1;
        } else {
            selectedMonth = this.month - 1;
            selectedYear = this.year;
        }
        selectedDay = this.daysInPreviousMonth - this.firstDayOfMonth + dayCellNumber + 1;
    } else if (dayCellNumber >= (this.firstDayOfMonth + this.daysInMonth)) {
        if (this.month == 11) {
            selectedMonth = 0;
            selectedYear = this.year + 1;
        } else {
            selectedMonth = this.month + 1;
            selectedYear = this.year;
        }
        selectedDay = dayCellNumber - this.firstDayOfMonth - this.daysInMonth + 1;
    } else {
        selectedMonth = this.month;
        selectedYear = this.year;
        selectedDay = dayCellNumber - this.firstDayOfMonth + 1;
    }
    
    this.setDate(selectedYear, selectedMonth, selectedDay, true);
};

ExtrasCalendarSelect.prototype.setDate = function(year, month, day, update) {
    var yearField = document.getElementById(this.elementId + "_year");
    var monthSelect = document.getElementById(this.elementId + "_month");

    this.year = year;
    this.month = month;
    this.selectedDay = day;
    yearField.value = year;
    monthSelect.selectedIndex = month;
    this.calculateCalendarInformation();
    this.renderUpdate();
    
    if (update) {
        this.updateClientMessage();
    }
};

/**
 * Updates the component state in the outgoing <code>ClientMessage</code>.
 */
ExtrasCalendarSelect.prototype.updateClientMessage = function() {
    var datePropertyElement = EchoClientMessage.createPropertyElement(this.elementId, "date");
    var calendarSelectionElement = datePropertyElement.firstChild;
    if (!calendarSelectionElement) {
        calendarSelectionElement = EchoClientMessage.messageDocument.createElement("calendar-selection");
        datePropertyElement.appendChild(calendarSelectionElement);
    }
    calendarSelectionElement.setAttribute("month", this.month);
    calendarSelectionElement.setAttribute("date", this.selectedDay);
    calendarSelectionElement.setAttribute("year", this.year);
    EchoDebugManager.updateClientMessage();
};

/**
 * Returns the ExtrasCalendarSelect instance relevant to the
 * specified root DOM element id.
 *
 * @param elementId the root DOM element id.
 * @return the ExtrasCalendarSelect instance
 */
ExtrasCalendarSelect.getComponent = function(elementId) {
    var componentId = EchoDomUtil.getComponentId(elementId);
    var calendar = EchoDomPropertyStore.getPropertyValue(componentId, "calendar");
    return calendar;
};

/**
 * Determines the number of days in a specific month.
 *
 * @param year the year of the month
 * @param month the month
 * @return the number of days in the month
 */
ExtrasCalendarSelect.getDaysInMonth = function(year, month) {
    switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
        return 31;
    case 3:
    case 5:
    case 8:
    case 10:
        return 30;
    case 1:
        if (year % 400 === 0) {
            return 29;
        } else if (year % 100 === 0) {
            return 28;
        } else if (year % 4 === 0) {
            return 29;
        } else {
            return 28;
        }
    default:
        throw "Invalid Month: " + month;
    }
};

ExtrasCalendarSelect.processDaySelect = function(echoEvent) {
    var elementId = echoEvent.target.id;
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.processDaySelect(elementId);
};

ExtrasCalendarSelect.processMonthSelect = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.processMonthSelect();
};

ExtrasCalendarSelect.processYearDecrement = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.processYearDecrement();
    EchoDomUtil.preventEventDefault(echoEvent);
};

ExtrasCalendarSelect.processYearEntry = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.processYearEntry();
};

ExtrasCalendarSelect.processYearIncrement = function(echoEvent) {
    var elementId = echoEvent.registeredTarget.id;
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.processYearIncrement();
    EchoDomUtil.preventEventDefault(echoEvent);
};

/**
 * Static object/namespace for CalendarSelect MessageProcessor 
 * implementation.
 */
ExtrasCalendarSelect.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasCalendarSelect.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasCalendarSelect.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasCalendarSelect.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "set-date":
                ExtrasCalendarSelect.MessageProcessor.processSetDate(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * CalendarSelect component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasCalendarSelect.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    if (calendar) {
	    calendar.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * CalendarSelect component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasCalendarSelect.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var year = parseInt(initMessageElement.getAttribute("year"));
    var month = parseInt(initMessageElement.getAttribute("month"));
    var date = parseInt(initMessageElement.getAttribute("date"));

    var calendar = new ExtrasCalendarSelect(elementId, containerElementId, year, month, date);

    calendar.enabled = initMessageElement.getAttribute("enabled") != "false";

    if (initMessageElement.getAttribute("border")) {
	    calendar.border = initMessageElement.getAttribute("border");
    }
    if (initMessageElement.getAttribute("foreground")) {
        calendar.foreground = initMessageElement.getAttribute("foreground");
    }
    if (initMessageElement.getAttribute("background")) {
        calendar.background = initMessageElement.getAttribute("background");
    }
    if (initMessageElement.getAttribute("background-image")) {
        calendar.backgroundImage = initMessageElement.getAttribute("background-image");
    }
    if (initMessageElement.getAttribute("selected-date-foreground")) {
        calendar.selectedDateForeground = initMessageElement.getAttribute("selected-date-foreground");
    }
    if (initMessageElement.getAttribute("selected-date-background")) {
        calendar.selectedDateBackground = initMessageElement.getAttribute("selected-date-background");
    }
    if (initMessageElement.getAttribute("selected-date-background-image")) {
        calendar.selectedDateBackgroundImage = initMessageElement.getAttribute("selected-date-background-image");
    }
    if (initMessageElement.getAttribute("adjacent-month-date-foreground")) {
        calendar.adjacentMonthDateForeground = initMessageElement.getAttribute("adjacent-month-date-foreground");
    }
    if (initMessageElement.getAttribute("arrow-left-image")) {
        calendar.arrowLeftImage = initMessageElement.getAttribute("arrow-left-image");
    }
    if (initMessageElement.getAttribute("arrow-right-image")) {
        calendar.arrowRightImage = initMessageElement.getAttribute("arrow-right-image");
    }
    if (initMessageElement.getAttribute("day-abbreviation-length")) {
        calendar.dayOfWeekNameAbbreviationLength = parseInt(initMessageElement.getAttribute("day-abbreviation-length"));
    }
    if (initMessageElement.getAttribute("first-day")) {
        calendar.firstDayOfWeek = parseInt(initMessageElement.getAttribute("first-day"));
    }
    
    for (var i = 0; i < initMessageElement.childNodes.length; ++i) {
        if (initMessageElement.childNodes[i].nodeName == "month-names") {
            // Process localized settings for month names.
            var monthNamesElement = initMessageElement.childNodes[i];
            calendar.monthNames = new Array();
            for (var j = 0; j < monthNamesElement.childNodes.length; ++j) {
                if (monthNamesElement.childNodes[j].nodeName == "month-name") {
                    calendar.monthNames.push(monthNamesElement.childNodes[j].getAttribute("value"));
                }
            }
        }
        if (initMessageElement.childNodes[i].nodeName == "day-names") {
            // Process localized settings for day of week names.
            var dayOfWeekNamesElement = initMessageElement.childNodes[i];
            calendar.dayOfWeekNames = new Array();
            for (var j = 0; j < dayOfWeekNamesElement.childNodes.length; ++j) {
                if (dayOfWeekNamesElement.childNodes[j].nodeName == "day-name") {
                    calendar.dayOfWeekNames.push(dayOfWeekNamesElement.childNodes[j].getAttribute("value"));
                }
            }
        }
    }

    calendar.create();
};

/**
 * Processes a <code>set-date</code> message to dispose the state of a 
 * CalendarSelect component that is being removed.
 *
 * @param setDateMessageElement the <code>set-date</code> element to process
 */
ExtrasCalendarSelect.MessageProcessor.processSetDate = function(setDateMessageElement) {
    var elementId = setDateMessageElement.getAttribute("eid");
    var year = parseInt(setDateMessageElement.getAttribute("year"));
    var month = parseInt(setDateMessageElement.getAttribute("month"));
    var date = parseInt(setDateMessageElement.getAttribute("date"));
    var calendar = ExtrasCalendarSelect.getComponent(elementId);
    calendar.setDate(year, month, date, false);
};
