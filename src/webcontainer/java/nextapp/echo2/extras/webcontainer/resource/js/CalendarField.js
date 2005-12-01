ExtrasCalendarField = function(elementId) {
    this.elementId = elementId;

    this.tableElement = null;
    this.monthSelect = null;
    this.yearField = null;
    
    this.firstDayOfMonth = 4;
    this.daysInPreviousMonth = 29;
    this.daysInMonth = 31;
    this.month = null;
    this.selectedDay = -1;
    this.year = null;
    
    this.dayOfWeekNameAbbreviationLength = 1;
    this.dayOfWeekNames = ExtrasCalendarField.DEFAULT_DAY_OF_WEEK_NAMES;
    this.monthNames = ExtrasCalendarField.DEFAULT_MONTH_NAMES;
    this.firstDayOfWeek = ExtrasCalendarField.DEFAULT_FIRST_DAY_OF_WEEK;
    this.previousMonthDayStyle = ExtrasCalendarField.DEFAULT_PREVIOUS_MONTH_DAY_STYLE;
    this.nextMonthDayStyle = ExtrasCalendarField.DEFAULT_NEXT_MONTH_DAY_STYLE;
    this.currentMonthDayStyle = ExtrasCalendarField.DEFAULT_CURRENT_MONTH_DAY_STYLE;
    this.baseDayStyle = ExtrasCalendarField.DEFAULT_BASE_DAY_STYLE;
    this.selectedDayStyle = ExtrasCalendarField.DEFAULT_SELECTED_DAY_STYLE;
    this.yearFieldStyle = ExtrasCalendarField.DEFAULT_YEAR_FIELD_STYLE;
    this.monthSelectStyle = ExtrasCalendarField.DEFAULT_MONTH_SELECT_STYLE;
    this.dayTableStyle = ExtrasCalendarField.DEFAULT_DAY_TABLE_STYLE;
};

/**
 * Static object/namespace for CalendarField MessageProcessor 
 * implementation.
 */
ExtrasCalendarField.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasCalendarField.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "init":
                ExtrasCalendarField.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasCalendarField.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * CalendarField component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasCalendarField.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var calendar = ExtrasCalendarField.getCalendar(elementId);
    calendar.dispose();
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * CalendarField component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasCalendarField.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    
    var foregroundColor = initMessageElement.getAttribute("foreground");
    var backgroundColor = initMessageElement.getAttribute("background");

    // Render div element.
    var containerElement = document.getElementById(containerElementId);
    var calendar = ExtrasCalendarField.create(containerElement, elementId);
    
    var year = parseInt(initMessageElement.getAttribute("year"));
    var month = parseInt(initMessageElement.getAttribute("month"));
    var date = parseInt(initMessageElement.getAttribute("date"));
    
    calendar.setDate(year, month, date);
    
    var divElement = document.createElement("div");
};

ExtrasCalendarField.DEFAULT_DAY_OF_WEEK_NAMES = 
        new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
ExtrasCalendarField.DEFAULT_MONTH_NAMES = new Array(
         "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December");
ExtrasCalendarField.DEFAULT_FIRST_DAY_OF_WEEK = 0;

ExtrasCalendarField.MINIMUM_YEAR = 1582;
ExtrasCalendarField.MAXIMUM_YEAR = 9999;

ExtrasCalendarField.DEFAULT_PREVIOUS_MONTH_DAY_STYLE = "color: #af9f9f;";
ExtrasCalendarField.DEFAULT_NEXT_MONTH_DAY_STYLE = "color: #9f9faf;";
ExtrasCalendarField.DEFAULT_CURRENT_MONTH_DAY_STYLE = "color: #000000;";

ExtrasCalendarField.DEFAULT_BASE_DAY_STYLE 
        = "cursor: pointer; text-align: right; border-width: 0px; "
        + "padding: 0px 5px;";
ExtrasCalendarField.DEFAULT_SELECTED_DAY_STYLE 
        = "cursor: default; text-align: right; border-width: 0px; "
        + "border-collapse: collapse; padding: 0px 5px; color: #ffffaf; background-color: #3f3f4f";
ExtrasCalendarField.DEFAULT_YEAR_FIELD_STYLE 
        = "text-align:center; background-color: #ffffcf; border-width: 1px; border-style: inset;";
ExtrasCalendarField.DEFAULT_MONTH_SELECT_STYLE 
        = "text-align:left; background-color: #ffffcf; border-width: 1px; border-style: inset;";
ExtrasCalendarField.DEFAULT_DAY_TABLE_STYLE 
        = "border-color: #5f5faf; border-width: 2px; margin: 1px; border-style: groove; border-collapse: collapse;";

ExtrasCalendarField.create = function(parentElement, elementId) {
    var calendar = ExtrasCalendarField.getCalendar(elementId);
    if (calendar !== null) {
        calendar.dispose();
    }

    calendar = new ExtrasCalendarField(elementId);
    var calendarElement = calendar.create();
    parentElement.appendChild(calendarElement);
    EchoDomPropertyStore.setPropertyValue(calendar.elementId, "calendar", calendar);
    calendar.renderUpdate();
    return calendar;
};

ExtrasCalendarField.getCalendar = function(elementId) {
    var componentId = EchoDomUtil.getComponentId(elementId);
    var calendar = EchoDomPropertyStore.getPropertyValue(componentId, "calendar");
    return calendar;
};

ExtrasCalendarField.getDaysInMonth = function(year, month) {
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

ExtrasCalendarField.prototype.create = function() {
    var i, j;
    var divElement = document.createElement("div");
    divElement.setAttribute("id", this.elementId);
    
    this.monthSelect = document.createElement("select");
    this.monthSelect.setAttribute("id", this.elementId + "_month");
    this.monthSelect.style.cssText = this.monthSelectStyle;
    for (i = 0; i < 12; ++i) {
        var optionElement = document.createElement("option");
        optionElement.appendChild(document.createTextNode(this.monthNames[i]));
        this.monthSelect.appendChild(optionElement);
    }
    divElement.appendChild(this.monthSelect);
    
    this.yearField = document.createElement("input");
    this.yearField.setAttribute("id", this.elementId + "_year");
    this.yearField.setAttribute("type", "text");
    this.yearField.setAttribute("maxlength", "4");
    this.yearField.setAttribute("size", "5");
    this.yearField.style.cssText = this.yearFieldStyle;
    
    divElement.appendChild(this.yearField);

    this.tableElement = document.createElement("table");
    this.tableElement.setAttribute("id", this.elementId + "_table");
    this.tableElement.style.cssText = this.dayTableStyle;
    
    var tbodyElement = document.createElement("tbody");
    
    var trElement = document.createElement("tr");
    for (j = 0; j < 7; ++j) {
        var tdElement = document.createElement("td");
        tdElement.style.cssText = this.baseDayStyle;
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
            tdElement.style.cssText = this.baseDayStyle;
            tdElement.setAttribute("id", this.elementId + "_" + i + "_" + j);
            trElement.appendChild(tdElement);
        }
        tbodyElement.appendChild(trElement);
    }
    this.tableElement.appendChild(tbodyElement);
    
    divElement.appendChild(this.tableElement);
    
    EchoDomUtil.addEventListener(this.tableElement, "click", this.processDaySelect);
    EchoDomUtil.addEventListener(this.monthSelect, "change", this.processMonthSelect);
    EchoDomUtil.addEventListener(this.yearField, "change", this.processYearEntry);
    return divElement;
};

ExtrasCalendarField.prototype.dispose = function() {
    // Remove event listeners.
    EchoDomUtil.removeEventListener(this.tableElement, "click", this.processDaySelect);
    EchoDomUtil.removeEventListener(this.monthSelect, "change", this.processMonthSelect);
    EchoDomUtil.removeEventListener(this.yearField, "change", this.processYearEntry);
    
    // Remove DOM references.
    this.monthSelect = null;
    this.yearField = null;

    // Remove calendar.
    var calendarElement = document.getElementById(this.elementId);
    calendarElement.parentNode.removeChild(calendarElement);
};

ExtrasCalendarField.prototype.processDaySelect = function(e) {
    var elementId = EchoDomUtil.getEventTarget(e).id;
    var calendar = ExtrasCalendarField.getCalendar(elementId);

    // Extract portion of id which describes cell number, e.g., if the clicked element
    var cellId = elementId.substring(calendar.elementId.length + 1);
    var row = cellId.charAt(0);
    var column = cellId.charAt(2);
    calendar.selectDayByCoordinate(column, row);
};

ExtrasCalendarField.prototype.processMonthSelect = function(e) {
    var elementId = EchoDomUtil.getEventTarget(e).id;
    var calendar = ExtrasCalendarField.getCalendar(elementId);
    calendar.setDate(calendar.year, calendar.monthSelect.selectedIndex, calendar.selectedDay, true);
};

ExtrasCalendarField.prototype.processYearEntry = function(e) {
    var elementId = EchoDomUtil.getEventTarget(e).id;
    var calendar = ExtrasCalendarField.getCalendar(elementId);
    if (isNaN(calendar.yearField.value)) {
        return;
    }
    if (calendar.yearField.value < 0) {
    }
    if (calendar.yearField.value < 1582) {
    }
    
    calendar.setDate(calendar.yearField.value, calendar.month, calendar.selectedDay, true);
};

/**
 * Re-renders the display of the calendar to reflect the current month/year
 * and selected date.
 */
ExtrasCalendarField.prototype.renderUpdate = function() {
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
            tdElement.style.cssText = styleText;
            tdElement.appendChild(textNode);
            ++day;
        }
    }
};

ExtrasCalendarField.prototype.selectDayByCoordinate = function(column, row) {
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

ExtrasCalendarField.prototype.calculateCalendarInformation = function() {
    var firstDate = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = firstDate.getDay();
    
    this.daysInMonth = ExtrasCalendarField.getDaysInMonth(this.year, this.month);
    if (this.month == 0) {
        this.daysInPreviousMonth = ExtrasCalendarField.getDaysInMonth(this.year - 1, 11);
    } else {
        this.daysInPreviousMonth = ExtrasCalendarField.getDaysInMonth(this.year, this.month - 1);
    }
};

ExtrasCalendarField.prototype.setDate = function(year, month, day, update) {
    this.year = year;
    this.month = month;
    this.selectedDay = day;
    this.yearField.value = year;
    this.monthSelect.selectedIndex = month;
    this.calculateCalendarInformation();
    this.renderUpdate();
    
    if (update) {
        this.updateClientMessage();
    }
};

/**
 * Updates the component state in the outgoing <code>ClientMessage</code>.
 */
ExtrasCalendarField.prototype.updateClientMessage = function() {
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
