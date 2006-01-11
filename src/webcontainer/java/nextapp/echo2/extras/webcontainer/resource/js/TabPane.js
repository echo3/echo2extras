ExtrasTabPane = function(elementId) {
    this.elementId = elementId;
    this.containerElementId = null;
    this.activeTabId = null;

    this.borderType = ExtrasTabPane.BORDER_TYPE_ADJACENT_TO_TABS;
    
    this.defaultBackground = "#ffffff";
    this.defaultForeground = "#000000";
    this.inactiveHeaderBackground = "#afafcf";
    this.inactiveHeaderForeground = "";
    this.inactiveBorderSize = 1;
    this.inactiveBorderStyle = "solid";
    this.inactiveBorderColor = "#7f7f7f";
    
    this.activeHeaderBackground = "#ffffff";
    this.activeHeaderForeground = "";
    this.activeBorderSize = 1;
    this.activeBorderStyle = "solid";
    this.activeBorderColor = "#00004f";
    
    this.headerPaddingTop = 3;
    this.headerPaddingLeft = 8;
    this.headerPaddingRight = 8;
    this.headerPaddingBottom = 3;
    this.renderBox = false;
    this.tabPosition = ExtrasTabPane.TAB_POSITION_TOP;
    
    this.headerHeight = 32;
    this.activeHeaderHeightIncrease = 2;
};

/**
 * Constant for the <code>borderType</code> property indicating that no 
 * border should be drawn around the content.
 */
ExtrasTabPane.BORDER_TYPE_NONE = 0;

/**
 * Constant for the <code>borderType</code> property indicating that a
 * border should be drawn immediately adjacent to the tabs only.
 * If the tabs are positioned at the top of the <code>TabPane</code> the
 * border will only be drawn directly beneath the tabs with this setting.  
 * If the tabs are positioned at the bottom of the <code>TabPane</code> the
 * border will only be drawn directly above the tabs with this setting.
 * This is the default rendering style.
 */
ExtrasTabPane.BORDER_TYPE_ADJACENT_TO_TABS = 1;

/**
 * Constant for the <code>borderType</code> property indicating that
 * borders should be drawn above and below the content, but not at its 
 * sides.
 */
ExtrasTabPane.BORDER_TYPE_PARALLEL_TO_TABS = 2;

/**
 * Constant for the <code>borderType</code> property indicating that
 * borders should be drawn on all sides of the content.
 */
ExtrasTabPane.BORDER_TYPE_SURROUND = 3;

ExtrasTabPane.TAB_POSITION_TOP = 0;
ExtrasTabPane.TAB_POSITION_BOTTOM = 1;

ExtrasTabPane.prototype.calculateInactiveHeaderHeight = function() {
    var largerBorderSize = this.inactiveBorder > this.activeBorderSize ? this.inactiveBorderSize : this.activeBorderSize;
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom - this.activeHeaderHeightIncrease
            - this.inactiveBorderSize;
};

ExtrasTabPane.prototype.calculateActiveHeaderHeight = function() {
    // Note: Border size is added and then removed for no effect.
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom;
};

ExtrasTabPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + this.containerElementId;
    }

    var tabPaneDivElement = document.createElement("div");
    tabPaneDivElement.id = this.elementId;
    tabPaneDivElement.style.position = "absolute";
    tabPaneDivElement.style.width = "100%";
    tabPaneDivElement.style.height = "100%";
    containerElement.appendChild(tabPaneDivElement);
    
    var headerContainerDivElement = document.createElement("div");
    headerContainerDivElement.id = this.elementId + "_header";
    headerContainerDivElement.style.overflow = "hidden";
    headerContainerDivElement.style.zIndex = 1;
    headerContainerDivElement.style.position = "absolute";
    switch (this.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerContainerDivElement.style.bottom = "0px";
        break;
    default:
        headerContainerDivElement.style.top = "0px";
    }
    headerContainerDivElement.style.left = "0px";
    headerContainerDivElement.style.width = "100%";
    headerContainerDivElement.style.height = (this.headerHeight + this.activeBorderSize) + "px";
    tabPaneDivElement.appendChild(headerContainerDivElement);
    
    var headerTableElement  = document.createElement("table");
    headerTableElement.style.borderWidth = "0px";
    headerTableElement.style.borderCollapse = "collapse";
    headerTableElement.style.padding = "0px";
    headerContainerDivElement.appendChild(headerTableElement);
    
    var headerTbodyElement = document.createElement("tbody");
    headerTableElement.appendChild(headerTbodyElement);
    
    var headerTrElement = document.createElement("tr");
    headerTrElement.id = this.elementId + "_header_tr";
    headerTbodyElement.appendChild(headerTrElement);
    
    var contentContainerDivElement = document.createElement("div");
    contentContainerDivElement.id = this.elementId + "_content";
    tabPaneDivElement.appendChild(contentContainerDivElement);

    contentContainerDivElement.style.position = "absolute";
    contentContainerDivElement.style.backgroundColor = this.defaultBackground;
    contentContainerDivElement.style.color = this.defaultForeground;
    switch (this.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        ExtrasTabPane.setCssPositionTop(contentContainerDivElement.style, tabPaneDivElement.id, 0, 33); //BUGBUG (33)
        contentContainerDivElement.style.bottom = this.headerHeight + "px";
        break;
    default:
        contentContainerDivElement.style.top = this.headerHeight + "px";
        ExtrasTabPane.setCssPositionBottom(contentContainerDivElement.style, tabPaneDivElement.id, 0, 33);
    }
    contentContainerDivElement.style.left = "0px";
    ExtrasTabPane.setCssPositionRight(contentContainerDivElement.style, tabPaneDivElement.id, 0, 0);

    var activeBorder = this.getActiveBorder();
    switch (this.borderType) {
        case ExtrasTabPane.BORDER_TYPE_NONE:
	        contentContainerDivElement.style.border = "0px none";
            break;
        case ExtrasTabPane.BORDER_TYPE_SURROUND:
            contentContainerDivElement.style.border = activeBorder;
            break;
        case ExtrasTabPane.BORDER_TYPE_PARALLEL_TO_TABS:
            contentContainerDivElement.style.borderTop = activeBorder;
            contentContainerDivElement.style.borderBottom = activeBorder;
            break;
        default:
	        switch (this.tabPosition) {
	        case ExtrasTabPane.TAB_POSITION_BOTTOM:
	            contentContainerDivElement.style.borderBottom = this.getActiveBorder();
	            break;
	        default:
	            contentContainerDivElement.style.borderTop = this.getActiveBorder();
	        }
            break;
    }
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "tabPane", this);
    
    EchoEventProcessor.addHandler(headerContainerDivElement.id, "click", "ExtrasTabPane.processClick");
};

ExtrasTabPane.prototype.getInactiveBorder = function() {
    return this.inactiveBorderSize + "px " + this.inactiveBorderStyle + " " + this.inactiveBorderColor;
};

ExtrasTabPane.prototype.getActiveBorder = function() {
    return this.activeBorderSize + "px " + this.activeBorderStyle + " " + this.activeBorderColor;
};

ExtrasTabPane.prototype.selectTab = function(newTabId) {
    if (this.activeTabId) {
        // Update state of previous active header.
        var oldHeaderDivElement = document.getElementById(this.elementId + "_header_div_" + this.activeTabId);
        if (oldHeaderDivElement != null) {
            var inactiveBorder = this.getInactiveBorder();
            oldHeaderDivElement.style.backgroundColor = this.inactiveHeaderBackground;
            oldHeaderDivElement.style.color = this.inactiveHeaderForeground;
            oldHeaderDivElement.style.borderLeft = inactiveBorder;
            oldHeaderDivElement.style.borderRight = inactiveBorder;
            oldHeaderDivElement.style.cursor = "pointer";
            oldHeaderDivElement.style.height = this.calculateInactiveHeaderHeight() + "px";
            
            switch (this.tabPosition) {
            case ExtrasTabPane.TAB_POSITION_BOTTOM:
                oldHeaderDivElement.style.marginTop = this.activeBorderSize + "px";
                oldHeaderDivElement.style.borderBottom = inactiveBorder;
                break;
            default: 
                oldHeaderDivElement.style.marginTop = this.activeHeaderHeightIncrease + "px";
                oldHeaderDivElement.style.borderTop = inactiveBorder;
                break;
            }
        }

        // Hide deselected content.
        var oldContentDivElement = document.getElementById(this.elementId + "_content_" + this.activeTabId);
        if (oldContentDivElement != null) {
            oldContentDivElement.style.display = "none";
        }
    }
    
    if (!newTabId) {
        // Select last existing tab.
        var headerTrElement = document.getElementById(this.elementId + "_header_tr");
        if (headerTrElement.childNodes.length > 0) {
            var tdId = headerTrElement.childNodes[headerTrElement.childNodes.length - 1].id;
            newTabId = tdId.substring(tdId.lastIndexOf("_") + 1);
        }
    }
    
    if (newTabId) {
        // Update state of newly active header.
        var newHeaderDivElement = document.getElementById(this.elementId + "_header_div_" + newTabId);
        newHeaderDivElement.style.backgroundColor = this.activeHeaderBackground;
        newHeaderDivElement.style.color = this.activeHeaderForeground;
        var activeBorder = this.getActiveBorder();
        newHeaderDivElement.style.cursor = "default";
        newHeaderDivElement.style.borderLeft = activeBorder;
        newHeaderDivElement.style.borderRight = activeBorder;
        newHeaderDivElement.style.height = this.calculateActiveHeaderHeight() + "px";
  
        // Begin Mozilla workaround: Removing and re-adding header div element is done to make Mozilla 1.7 rendering
        // engine happy.  Without this workaround tab sizes shrink when clicked.
        var parentNode = newHeaderDivElement.parentNode;
        parentNode.removeChild(newHeaderDivElement);
        parentNode.appendChild(newHeaderDivElement);
        // End Mozilla workaround.

        switch (this.tabPosition) {
        case ExtrasTabPane.TAB_POSITION_BOTTOM:
            newHeaderDivElement.style.marginTop = "0px";
            newHeaderDivElement.style.borderBottom = activeBorder;
            break;
        default: 
            newHeaderDivElement.style.marginTop = "0px";
            newHeaderDivElement.style.borderTop = activeBorder;
            break;
        }
        
        // Display selected content.
        var newContentDivElement = document.getElementById(this.elementId + "_content_" + newTabId);
        newContentDivElement.style.display = "block";
        
        // Begin Internet Explorer workaround: Adjusting size of TabPane to eliminate scroll bars and ensure tab content
        // is displayed.
        if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
            // Internet Explorer Hack: Forces repaint, if not performed tab content will not be displayed if content
            // is a Pane (i.e., an absolute CSS positioned element).
            var tabPaneDivElement = document.getElementById(this.elementId);
            tabPaneDivElement.style.width = "99%";
            window.setTimeout("document.getElementById(\"" + this.elementId + "\").style.width = \"100%\";", 1);
        }
        // End Internet Explorer workaround.
    }
    
    // Update state information.
    this.activeTabId = newTabId;
};

ExtrasTabPane.getTabPane = function(tabPaneId) {
    return EchoDomPropertyStore.getPropertyValue(tabPaneId, "tabPane");
};

ExtrasTabPane.processClick = function(echoEvent) {
    var elementId = echoEvent.target.id;
    var tabPaneId = EchoDomUtil.getComponentId(elementId);
    var tabPane = ExtrasTabPane.getTabPane(tabPaneId);
    var headerDivTextIndex = elementId.indexOf("_header_div_");
    if (headerDivTextIndex == -1) {
        return;
    }
    var tabId = elementId.substring(headerDivTextIndex + 12);
    
    EchoClientMessage.setPropertyValue(tabPaneId, "activeTab", tabId);
    tabPane.selectTab(tabId);
};

ExtrasTabPane.setCssPositionBottom = function(style, containerElementId, bottomPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var heightExpression = "(document.getElementById(\"" + containerElementId + "\").clientHeight-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("height", heightExpression);
    } else {
        style.bottom = bottomPx + "px";
    }
};

ExtrasTabPane.setCssPositionTop = function(style, containerElementId, topPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var heightExpression = "(document.getElementById(\"" + containerElementId + "\").clientHeight-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("height", heightExpression);
    } else {
        style.top = topPx + "px";
    }
};

ExtrasTabPane.setCssPositionRight = function(style, containerElementId, rightPx, subtractedPixels) {
    if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
        var widthExpression = "(document.getElementById(\"" + containerElementId + "\").clientWidth-" 
                + subtractedPixels + ")+\"px\"";
        style.setExpression("width", widthExpression);
    } else {
        style.right = rightPx + "px";
    }
};

/**
 * Static object/namespace for TabPane MessageProcessor 
 * implementation.
 */
ExtrasTabPane.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasTabPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "add-tab":
                ExtrasTabPane.MessageProcessor.processAddTab(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasTabPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasTabPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "remove-tab":
                ExtrasTabPane.MessageProcessor.processRemoveTab(messagePartElement.childNodes[i]);
                break;
            case "set-active-tab":
                ExtrasTabPane.MessageProcessor.processSetActiveTab(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>add-tab</code> message to add a new tab to the TabPane.
 *
 * @param addTabMessageElement the <code>add-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processAddTab = function(addTabMessageElement) {
    var elementId = addTabMessageElement.getAttribute("eid");
    var tabPane = ExtrasTabPane.getTabPane(elementId);
    
    var tabId = addTabMessageElement.getAttribute("tab-id");
    var tabIndex = addTabMessageElement.getAttribute("tab-index");
    var title = addTabMessageElement.getAttribute("title");
    
    tabPaneDivElement = document.getElementById(elementId);
    if (!tabPaneDivElement) {
        throw "TabPane DIV element not found: " + elementId;
    }
    
    var headerTrElement = document.getElementById(elementId + "_header_tr");
    var headerTdElement = document.createElement("td");
    headerTdElement.style.borderWidth = "0px";
    headerTdElement.style.padding = "0px";
    headerTdElement.style.verticalAlign = "top";
    headerTdElement.id = elementId + "_header_td_" + tabId;
    
    var inactiveBorder = tabPane.getInactiveBorder();
    headerDivElement = document.createElement("div");
    headerDivElement.id = elementId + "_header_div_" + tabId;
    headerDivElement.style.overflow = "hidden";
    switch (tabPane.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerDivElement.style.marginTop = tabPane.activeBorderSize + "px";
        headerDivElement.style.borderTop = "0px none";
        headerDivElement.style.borderLeft = inactiveBorder;
        headerDivElement.style.borderRight = inactiveBorder;
        headerDivElement.style.borderBottom = inactiveBorder;
        break;
    default:
        headerDivElement.style.marginTop = tabPane.activeHeaderHeightIncrease + "px";
        headerDivElement.style.borderTop = inactiveBorder;
        headerDivElement.style.borderLeft = inactiveBorder;
        headerDivElement.style.borderRight = inactiveBorder;
        headerDivElement.style.borderBottom = "0px none";
    }
    headerDivElement.style.height = tabPane.calculateInactiveHeaderHeight() + "px";
    headerDivElement.style.backgroundColor = tabPane.inactiveHeaderBackground;
    headerDivElement.style.color = tabPane.inactiveHeaderForeground;
    headerDivElement.style.paddingTop = tabPane.headerPaddingTop + "px";
    headerDivElement.style.paddingBottom = tabPane.headerPaddingBottom + "px";
    headerDivElement.style.paddingLeft = tabPane.headerPaddingLeft + "px";
    headerDivElement.style.paddingRight = tabPane.headerPaddingRight + "px";
    headerDivElement.style.cursor = "pointer";
    headerTdElement.appendChild(headerDivElement);
    
    headerDivElement.appendChild(document.createTextNode(title === null ? "*" : title));
    
    var contentContainerDivElement = document.getElementById(elementId + "_content");
    var contentDivElement = document.createElement("div");
    contentDivElement.id = elementId + "_content_" + tabId;
    contentDivElement.style.display = "none";
    contentDivElement.style.position = "absolute";
    contentDivElement.style.width = "100%";
    contentDivElement.style.height = "100%";
    contentContainerDivElement.appendChild(contentDivElement);
    
    if (tabIndex < headerTrElement.childNodes.length) {
        headerTrElement.insertBefore(headerTdElement, headerTrElement.childNodes[tabIndex]);
    } else {
        headerTrElement.appendChild(headerTdElement);
    }
    
    if (tabPane.activeTabId == null || tabPane.activeTabId == tabId) {
        tabPane.selectTab(tabId);
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * TabPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasTabPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var tabPaneId = disposeMessageElement.getAttribute("eid");
    var headerDivElementId = tabPaneId + "_header";
    EchoEventProcessor.removeHandler(headerDivElementId, "click");
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * TabPane component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasTabPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var tabPane = new ExtrasTabPane(elementId);
    tabPane.containerElementId = initMessageElement.getAttribute("container-eid");
    var activeTabId = initMessageElement.getAttribute("active-tab");
    if (activeTabId) {
        tabPane.activeTabId = activeTabId;
    }

    tabPane.tabPosition = initMessageElement.getAttribute("tab-position") == "bottom" ? 
            ExtrasTabPane.TAB_POSITION_BOTTOM : ExtrasTabPane.TAB_POSITION_TOP;
    
    if (initMessageElement.getAttribute("header-height")) {
        tabPane.headerHeight = initMessageElement.getAttribute("header-height");
    }
    if (initMessageElement.getAttribute("default-background")) {
        tabPane.defaultBackground = initMessageElement.getAttribute("default-background");
    }
    if (initMessageElement.getAttribute("default-foreground")) {
        tabPane.defaultForeground = initMessageElement.getAttribute("default-foreground");
    }
    if (initMessageElement.getAttribute("default-font")) {
        tabPane.defaultFont = initMessageElement.getAttribute("default-font");
    }
    
    switch (initMessageElement.getAttribute("border-type")) {
    case "none":
        tabPane.borderType = ExtrasTabPane.BORDER_TYPE_NONE;
        break;
    case "surround":
        tabPane.borderType = ExtrasTabPane.BORDER_TYPE_SURROUND;
        break;
    case "parallel":
        tabPane.borderType = ExtrasTabPane.BORDER_TYPE_PARALLEL_TO_TABS;
        break;
    default:
        tabPane.borderType = ExtrasTabPane.BORDER_TYPE_ADJACENT_TO_TABS;
    }
    if (initMessageElement.getAttribute("inactive-border-style")) {
        tabPane.inactiveBorderStyle = initMessageElement.getAttribute("inactive-border-style");
    }
    if (initMessageElement.getAttribute("inactive-border-color")) {
        tabPane.inactiveBorderColor = initMessageElement.getAttribute("inactive-border-color");
    }
    if (initMessageElement.getAttribute("inactive-border-size")) {
        tabPane.inactiveBorderSize = parseInt(initMessageElement.getAttribute("inactive-border-size"));
    }
    if (initMessageElement.getAttribute("active-border-style")) {
        tabPane.activeBorderStyle = initMessageElement.getAttribute("active-border-style");
    }
    if (initMessageElement.getAttribute("active-border-color")) {
        tabPane.activeBorderColor = initMessageElement.getAttribute("active-border-color");
    }
    if (initMessageElement.getAttribute("active-border-size")) {
        tabPane.activeBorderSize = parseInt(initMessageElement.getAttribute("active-border-size"));
    }

    tabPane.create();
};

/**
 * Processes a <code>remove-tab</code> message to remove a tab from the TabPane.
 * 
 * @param removeTabMessageElement the <code>remove-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processRemoveTab = function(removeTabMessageElement) {
    var elementId = removeTabMessageElement.getAttribute("eid");
    var tabId = removeTabMessageElement.getAttribute("tab-id");
    var tabPane = ExtrasTabPane.getTabPane(elementId);
    
    var headerTdElementId = elementId + "_header_td_" + tabId;
    var headerTdElement = document.getElementById(headerTdElementId);
    if (!headerTdElement) {
        throw "Tab header not found for id: " + headerTdElementId;
    }
    headerTdElement.parentNode.removeChild(headerTdElement);
    
    var contentDivElementId = elementId + "_content_" + tabId;
    var contentDivElement = document.getElementById(contentDivElementId);
    if (!contentDivElement) {
        throw "Content not found for id: " + contentDivElementId;
    }
    contentDivElement.parentNode.removeChild(contentDivElement);

    if (tabPane.activeTabId === tabId) {
        tabPane.selectTab(null);
    }
};

/**
 * Processes a <code>set-active-tab</code> message to set the active tab.
 * 
 * @param setActiveTabMessageElement the <code>set-active-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processSetActiveTab = function(setActiveTabMessageElement) {
    var tabPaneId = setActiveTabMessageElement.getAttribute("eid");
    var tabId = setActiveTabMessageElement.getAttribute("tab-id");
    var tabPane = ExtrasTabPane.getTabPane(tabPaneId);
    tabPane.selectTab(tabId);
};
