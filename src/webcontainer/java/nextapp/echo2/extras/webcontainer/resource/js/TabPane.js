ExtrasTabPane = function() { };

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
    var renderData = EchoDomPropertyStore.getPropertyValue(elementId, "renderData");
    
    var tabId = addTabMessageElement.getAttribute("tab-id");
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
    
    headerDivElement = document.createElement("div");
    headerDivElement.id = elementId + "_header_div_" + tabId;
    headerDivElement.style.overflow = "hidden";
    
    headerDivElement.style.marginTop = renderData.selectedHeaderHeightIncrease + "px";
    headerDivElement.style.height = renderData.calculateDefaultHeaderHeight() + "px";
    headerDivElement.style.backgroundColor = renderData.defaultHeaderBackground;
    headerDivElement.style.color = renderData.defaultHeaderForeground;
    var defaultBorder = renderData.getDefaultBorder();
    headerDivElement.style.borderTop = defaultBorder;
    headerDivElement.style.borderLeft = defaultBorder;
    headerDivElement.style.borderRight = defaultBorder;
    headerDivElement.style.borderBottom = "0px none";
    headerDivElement.style.paddingTop = renderData.headerPaddingTop + "px";
    headerDivElement.style.paddingBottom = renderData.headerPaddingBottom + "px";
    headerDivElement.style.paddingLeft = renderData.headerPaddingLeft + "px";
    headerDivElement.style.paddingRight = renderData.headerPaddingRight + "px";
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
    
    headerTrElement.appendChild(headerTdElement);
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
    var renderData = new ExtrasTabPane.RenderData(elementId);
    
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var containerElement = document.getElementById(containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + containerElementId;
    }

    if (initMessageElement.getAttribute("header-height")) {
        renderData.headerHeight = initMessageElement.getAttribute("header-height");
    }
    
    var tabPaneDivElement = document.createElement("div");
    tabPaneDivElement.id = elementId;
    tabPaneDivElement.style.position = "absolute";
    tabPaneDivElement.style.width = "100%";
    tabPaneDivElement.style.height = "100%";
    
    var headerContainerDivElement = document.createElement("div");
    headerContainerDivElement.id = elementId + "_header";
    headerContainerDivElement.style.overflow = "hidden";
    headerContainerDivElement.style.zIndex = 1;
    headerContainerDivElement.style.position = "absolute";
    headerContainerDivElement.style.top = "0px";
    headerContainerDivElement.style.left = "0px";
    headerContainerDivElement.style.width = "100%";
    headerContainerDivElement.style.height = (renderData.headerHeight + renderData.borderSize) + "px";
    headerContainerDivElement.style.cursor = "pointer";
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
    contentContainerDivElement.style.position = "absolute";
    contentContainerDivElement.style.backgroundColor = renderData.defaultBackground;
    contentContainerDivElement.style.color = renderData.defaultForeground;
    contentContainerDivElement.style.top = renderData.headerHeight + "px";
    contentContainerDivElement.style.left = "0px";
    contentContainerDivElement.style.right = "0px";
    contentContainerDivElement.style.bottom = "0px";
    contentContainerDivElement.style.border = renderData.getSelectedBorder();
    tabPaneDivElement.appendChild(contentContainerDivElement);
    
    containerElement.appendChild(tabPaneDivElement);
    
    EchoDomPropertyStore.setPropertyValue(elementId, "renderData", renderData);
    
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
    var renderData = EchoDomPropertyStore.getPropertyValue(elementId, "renderData");
    
    if (renderData.selectedTabId === tabId) {
        ExtrasTabPane.selectTab(elementId, null);
    }

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
};

/**
 * Data object housed in DomPropertyStore describing rendering information 
 * about the TabPane.
 */
ExtrasTabPane.RenderData = function(elementId) {
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
    
    this.headerHeight = 32;
    this.selectedHeaderHeightIncrease = 2;
};

ExtrasTabPane.RenderData.prototype.calculateDefaultHeaderHeight = function() {
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom - this.selectedHeaderHeightIncrease
            - this.borderSize;
};

ExtrasTabPane.RenderData.prototype.calculateSelectedHeaderHeight = function() {
    // Note: Border size is added and then removed for no effect.
    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom;
};

ExtrasTabPane.RenderData.prototype.getDefaultBorder = function() {
    return this.borderSize + "px " + this.defaultBorderStyle + " " + this.defaultBorderColor;
};

ExtrasTabPane.RenderData.prototype.getSelectedBorder = function() {
    return this.borderSize + "px " + this.selectedBorderStyle + " " + this.selectedBorderColor;
};

ExtrasTabPane.processClick = function(echoEvent) {
    var elementId = echoEvent.target.id;
    var tabPaneId = EchoDomUtil.getComponentId(elementId);
    var headerDivTextIndex = elementId.indexOf("_header_div_");
    if (headerDivTextIndex == -1) {
        return;
    }
    var tabId = elementId.substring(headerDivTextIndex + 12);
    ExtrasTabPane.selectTab(tabPaneId, tabId);
};

ExtrasTabPane.selectTab = function(tabPaneId, newTabId) {
    var renderData = EchoDomPropertyStore.getPropertyValue(tabPaneId, "renderData"); 
    
    if (renderData.selectedTabId) {
        // Update state of previous selected header.
	    var oldHeaderDivElement = document.getElementById(tabPaneId + "_header_div_" + renderData.selectedTabId);
	    if (oldHeaderDivElement != null) {
		    oldHeaderDivElement.style.marginTop = renderData.selectedHeaderHeightIncrease + "px";
		    oldHeaderDivElement.style.height = renderData.calculateDefaultHeaderHeight() + "px";
		    oldHeaderDivElement.style.backgroundColor = renderData.defaultHeaderBackground;
		    oldHeaderDivElement.style.color = renderData.defaultHeaderForeground;
		    var defaultBorder = renderData.getDefaultBorder();
		    oldHeaderDivElement.style.borderTop = defaultBorder;
		    oldHeaderDivElement.style.borderLeft = defaultBorder;
		    oldHeaderDivElement.style.borderRight = defaultBorder;
		    oldHeaderDivElement.style.cursor = "pointer";
	    }

	    // Hide deselected content.
	    var oldContentDivElement = document.getElementById(tabPaneId + "_content_" + renderData.selectedTabId);
	    oldContentDivElement.style.display = "none";
    }
    
    if (newTabId) {
	    // Update state of newly selected header.
	    var newHeaderDivElement = document.getElementById(tabPaneId + "_header_div_" + newTabId);
	    newHeaderDivElement.style.marginTop = "0px";
	    newHeaderDivElement.style.height = renderData.calculateSelectedHeaderHeight() + "px";
	    newHeaderDivElement.style.backgroundColor = renderData.selectedHeaderBackground;
	    newHeaderDivElement.style.color = renderData.selectedHeaderForeground;
	    var selectedBorder = renderData.getSelectedBorder();
	    newHeaderDivElement.style.borderTop = selectedBorder;
	    newHeaderDivElement.style.borderLeft = selectedBorder;
	    newHeaderDivElement.style.borderRight = selectedBorder;
	    newHeaderDivElement.style.cursor = "default";
	    
	    // Display selected content.
	    var oldContentDivElement = document.getElementById(tabPaneId + "_content_" + newTabId);
	    oldContentDivElement.style.display = "block";
    }
    
    // Update state information.
    renderData.selectedTabId = newTabId;
};
