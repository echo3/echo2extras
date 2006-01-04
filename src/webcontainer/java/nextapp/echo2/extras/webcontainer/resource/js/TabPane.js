ExtrasTabPane = function(elementId) {
    this.selectedTabId = null;

    this.elementId = elementId;
    this.defaultBackground = "#ffffff";
    this.defaultForeground = "#000000";
    this.selectedHeaderBackground = "#ffffff";
    this.selectedHeaderForeground = "";
    this.defaultHeaderBackground = "#afafcf";
    this.defaultHeaderForeground = "";
    this.borderSize = 1;
    this.defaultBorderStyle = "solid";
    this.defaultBorderColor = "#7f7f7f";
    this.selectedBorderStyle = "solid";
    this.selectedBorderColor = "#00004f";
    this.headerPaddingTop = 3;
    this.headerPaddingLeft = 8;
    this.headerPaddingRight = 8;
    this.headerPaddingBottom = 3;
    this.renderBox = false;
    this.tabPosition = ExtrasTabPane.TAB_POSITION_TOP;
    
    this.headerHeight = 32;
    this.selectedHeaderHeightIncrease = 2;
};

ExtrasTabPane.TAB_POSITION_TOP = 0;
ExtrasTabPane.TAB_POSITION_BOTTOM = 1;

ExtrasTabPane.prototype.calculateDefaultHeaderHeight = function() {
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom - this.selectedHeaderHeightIncrease
            - this.borderSize;
};

ExtrasTabPane.prototype.calculateSelectedHeaderHeight = function() {
    // Note: Border size is added and then removed for no effect.
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom;
};

ExtrasTabPane.prototype.getDefaultBorder = function() {
    return this.borderSize + "px " + this.defaultBorderStyle + " " + this.defaultBorderColor;
};

ExtrasTabPane.prototype.getSelectedBorder = function() {
    return this.borderSize + "px " + this.selectedBorderStyle + " " + this.selectedBorderColor;
};

ExtrasTabPane.prototype.selectTab = function(newTabId) {
    if (this.selectedTabId) {
        // Update state of previous selected header.
        var oldHeaderDivElement = document.getElementById(this.elementId + "_header_div_" + this.selectedTabId);
        if (oldHeaderDivElement != null) {
            var defaultBorder = this.getDefaultBorder();
            oldHeaderDivElement.style.backgroundColor = this.defaultHeaderBackground;
            oldHeaderDivElement.style.color = this.defaultHeaderForeground;
            oldHeaderDivElement.style.borderLeft = defaultBorder;
            oldHeaderDivElement.style.borderRight = defaultBorder;
            oldHeaderDivElement.style.cursor = "pointer";
            oldHeaderDivElement.style.height = this.calculateDefaultHeaderHeight() + "px";
            
            switch (this.tabPosition) {
            case ExtrasTabPane.TAB_POSITION_BOTTOM:
                oldHeaderDivElement.style.marginTop = this.borderSize + "px";
                oldHeaderDivElement.style.borderBottom = defaultBorder;
                break;
            default: 
                oldHeaderDivElement.style.marginTop = this.selectedHeaderHeightIncrease + "px";
                oldHeaderDivElement.style.borderTop = defaultBorder;
                break;
            }
        }

        // Hide deselected content.
        var oldContentDivElement = document.getElementById(this.elementId + "_content_" + this.selectedTabId);
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
        // Update state of newly selected header.
        var newHeaderDivElement = document.getElementById(this.elementId + "_header_div_" + newTabId);
        newHeaderDivElement.style.backgroundColor = this.selectedHeaderBackground;
        newHeaderDivElement.style.color = this.selectedHeaderForeground;
        var selectedBorder = this.getSelectedBorder();
        newHeaderDivElement.style.cursor = "default";
        newHeaderDivElement.style.borderLeft = selectedBorder;
        newHeaderDivElement.style.borderRight = selectedBorder;
        newHeaderDivElement.style.height = this.calculateSelectedHeaderHeight() + "px";

        switch (this.tabPosition) {
        case ExtrasTabPane.TAB_POSITION_BOTTOM:
            newHeaderDivElement.style.marginTop = "0px";
            newHeaderDivElement.style.borderBottom = selectedBorder;
            break;
        default: 
            newHeaderDivElement.style.marginTop = "0px";
            newHeaderDivElement.style.borderTop = selectedBorder;
            break;
        }
        
        // Display selected content.
        var newContentDivElement = document.getElementById(this.elementId + "_content_" + newTabId);
        newContentDivElement.style.display = "block";
        
        if (EchoClientProperties.get("quirkCssPositioningOneSideOnly")) {
            // Internet Explorer Hack: Forces repaint, if not performed tab content will not be displayed if content
            // is a Pane (i.e., an absolute CSS positioned element).
            var tabPaneDivElement = document.getElementById(this.elementId);
            tabPaneDivElement.style.width = "99%";
            window.setTimeout("document.getElementById(\"" + this.elementId + "\").style.width = \"100%\";", 1);
        }
    }
    
    // Update state information.
    this.selectedTabId = newTabId;
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
    
    var defaultBorder = tabPane.getDefaultBorder();
    headerDivElement = document.createElement("div");
    headerDivElement.id = elementId + "_header_div_" + tabId;
    headerDivElement.style.overflow = "hidden";
    switch (tabPane.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerDivElement.style.marginTop = tabPane.borderSize + "px";
        headerDivElement.style.borderTop = "0px none";
        headerDivElement.style.borderLeft = defaultBorder;
        headerDivElement.style.borderRight = defaultBorder;
        headerDivElement.style.borderBottom = defaultBorder;
        break;
    default:
        headerDivElement.style.marginTop = tabPane.selectedHeaderHeightIncrease + "px";
        headerDivElement.style.borderTop = defaultBorder;
        headerDivElement.style.borderLeft = defaultBorder;
        headerDivElement.style.borderRight = defaultBorder;
        headerDivElement.style.borderBottom = "0px none";
    }
    headerDivElement.style.height = tabPane.calculateDefaultHeaderHeight() + "px";
    headerDivElement.style.backgroundColor = tabPane.defaultHeaderBackground;
    headerDivElement.style.color = tabPane.defaultHeaderForeground;
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
    
    if (tabPane.selectedTabId == null || tabPane.selectedTabId == tabId) {
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
    tabPane.tabPosition = initMessageElement.getAttribute("tab-position") == "bottom" ? 
            ExtrasTabPane.TAB_POSITION_BOTTOM : ExtrasTabPane.TAB_POSITION_TOP;
    
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var containerElement = document.getElementById(containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + containerElementId;
    }
    
    var activeTabId = initMessageElement.getAttribute("active-tab");
    if (activeTabId) {
        tabPane.selectedTabId = activeTabId;
    }

    if (initMessageElement.getAttribute("header-height")) {
        tabPane.headerHeight = initMessageElement.getAttribute("header-height");
    }
    
    var tabPaneDivElement = document.createElement("div");
    tabPaneDivElement.id = elementId;
    tabPaneDivElement.style.position = "absolute";
    tabPaneDivElement.style.width = "100%";
    tabPaneDivElement.style.height = "100%";
    containerElement.appendChild(tabPaneDivElement);
    
    var headerContainerDivElement = document.createElement("div");
    headerContainerDivElement.id = elementId + "_header";
    headerContainerDivElement.style.overflow = "hidden";
    headerContainerDivElement.style.zIndex = 1;
    headerContainerDivElement.style.position = "absolute";
    switch (tabPane.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerContainerDivElement.style.bottom = "0px";
        break;
    default:
        headerContainerDivElement.style.top = "0px";
    }
    headerContainerDivElement.style.left = "0px";
    headerContainerDivElement.style.width = "100%";
    headerContainerDivElement.style.height = (tabPane.headerHeight + tabPane.borderSize) + "px";
    tabPaneDivElement.appendChild(headerContainerDivElement);
    
    var headerTableElement  = document.createElement("table");
    headerTableElement.style.borderWidth = "0px";
    headerTableElement.style.borderCollapse = "collapse";
    headerTableElement.style.padding = "0px";
    headerContainerDivElement.appendChild(headerTableElement);
    
    var headerTbodyElement = document.createElement("tbody");
    headerTableElement.appendChild(headerTbodyElement);
    
    var headerTrElement = document.createElement("tr");
    headerTrElement.id = elementId + "_header_tr";
    headerTbodyElement.appendChild(headerTrElement);
    
    var contentContainerDivElement = document.createElement("div");
    contentContainerDivElement.id = elementId + "_content";
    tabPaneDivElement.appendChild(contentContainerDivElement);

    contentContainerDivElement.style.position = "absolute";
    contentContainerDivElement.style.backgroundColor = tabPane.defaultBackground;
    contentContainerDivElement.style.color = tabPane.defaultForeground;
    switch (tabPane.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        ExtrasTabPane.setCssPositionTop(contentContainerDivElement.style, tabPaneDivElement.id, 0, 33); //BUGBUG (33)
        contentContainerDivElement.style.bottom = tabPane.headerHeight + "px";
        break;
    default:
        contentContainerDivElement.style.top = tabPane.headerHeight + "px";
        ExtrasTabPane.setCssPositionBottom(contentContainerDivElement.style, tabPaneDivElement.id, 0, 33);
    }
    contentContainerDivElement.style.left = "0px";
    ExtrasTabPane.setCssPositionRight(contentContainerDivElement.style, tabPaneDivElement.id, 0, 0);
    if (tabPane.renderBox) {
        contentContainerDivElement.style.border = tabPane.getSelectedBorder();
    } else {
        switch (tabPane.tabPosition) {
        case ExtrasTabPane.TAB_POSITION_BOTTOM:
            contentContainerDivElement.style.borderBottom = tabPane.getSelectedBorder();
            break;
        default:
            contentContainerDivElement.style.borderTop = tabPane.getSelectedBorder();
        }
    }
    
    EchoDomPropertyStore.setPropertyValue(elementId, "tabPane", tabPane);
    
    EchoEventProcessor.addHandler(headerContainerDivElement.id, "click", "ExtrasTabPane.processClick");
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

    if (tabPane.selectedTabId === tabId) {
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
