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

/**
 * ExtrasTabPane Object/Namespace/Constructor.
 *
 * @param elementId the root id of the tab pane.
 * @param containerElementId the id of the DOM element which will contain the 
 *        tab pane.
 * @param activeTabId the id of the active tab (if applicable)
 */
ExtrasTabPane = function(elementId, containerElementId, activeTabId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.activeTabId = activeTabId;

    this.borderType = ExtrasTabPane.BORDER_TYPE_ADJACENT_TO_TABS;
    this.defaultContentInsets = ExtrasTabPane.PANE_INSETS;
    
    this.defaultBackground = "#ffffff";
    this.defaultForeground = "#000000";

    this.tabInactiveBorderSize = 1;
    this.tabInactiveBorderStyle = "solid";
    this.tabInactiveBorderColor = "#7f7f7f";
    this.tabActiveBorderSize = 1;
    this.tabActiveBorderStyle = "solid";
    this.tabActiveBorderColor = "#00004f";
    
    this.tabInactiveBackground = "#afafcf";
    this.tabInactiveBackgroundImage = null;
    this.tabInactiveFont = null;
    this.tabInactiveForeground = "";

    this.tabActiveBackground = "#ffffff";
    this.tabActiveBackgroundImage = null;
    this.tabActiveFont = null;
    this.tabActiveForeground = "";
    
    this.headerPaddingTop = 3;
    this.headerPaddingLeft = 8;
    this.headerPaddingRight = 8;
    this.headerPaddingBottom = 3;
    
    this.renderBox = false;
    this.tabPosition = ExtrasTabPane.TAB_POSITION_TOP;
    
    this.insets = new EchoCoreProperties.Insets(2);
    
    this.tabSpacing = 0;
    this.tabInset = 10;
    
    this.headerHeight = 32;
    this.activeHeaderHeightIncrease = 2;
    
    this.enabled = true;
    
    this.tabs = new Array();

    this.tabPaneDivElement = null;
    this.headerContainerDivElement = null;
    this.headerTrElement = null
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

ExtrasTabPane.PANE_INSETS = new EchoCoreProperties.Insets(0);

ExtrasTabPane.TAB_POSITION_TOP = 0;
ExtrasTabPane.TAB_POSITION_BOTTOM = 1;

ExtrasTabPane.prototype.addTab = function(tab, tabIndex) {
    ExtrasUtil.Arrays.insertElement(this.tabs, tab, tabIndex);

    tab.headerTdElement = document.createElement("td");
    tab.headerTdElement.style.borderWidth = "0px";
    tab.headerTdElement.style.padding = "0px";
    tab.headerTdElement.style.verticalAlign = "top";
    tab.headerTdElement.id = this.elementId + "_header_td_" + tab.tabId;
    
    var inactiveBorder = this.getInactiveBorder();
    headerDivElement = document.createElement("div");
    headerDivElement.id = this.elementId + "_header_div_" + tab.tabId;
    headerDivElement.style.overflow = "hidden";
    switch (this.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerDivElement.style.marginTop = this.tabActiveBorderSize + "px";
        headerDivElement.style.borderTop = "0px none";
        headerDivElement.style.borderLeft = inactiveBorder;
        headerDivElement.style.borderRight = inactiveBorder;
        headerDivElement.style.borderBottom = inactiveBorder;
        break;
    default:
        headerDivElement.style.marginTop = this.activeHeaderHeightIncrease + "px";
        headerDivElement.style.borderTop = inactiveBorder;
        headerDivElement.style.borderLeft = inactiveBorder;
        headerDivElement.style.borderRight = inactiveBorder;
        headerDivElement.style.borderBottom = "0px none";
    }
    if (this.tabSpacing) {
        headerDivElement.style.marginRight = this.tabSpacing + "px";
    }

    headerDivElement.style.height = this.calculateHeaderHeight(false) + "px";
    headerDivElement.style.backgroundColor = this.tabInactiveBackground;
    headerDivElement.style.color = this.tabInactiveForeground;
    headerDivElement.style.paddingTop = this.headerPaddingTop + "px";
    headerDivElement.style.paddingBottom = this.headerPaddingBottom + "px";
    headerDivElement.style.paddingLeft = this.headerPaddingLeft + "px";
    headerDivElement.style.paddingRight = this.headerPaddingRight + "px";
    headerDivElement.style.cursor = "pointer";
    tab.headerTdElement.appendChild(headerDivElement);
    
    headerDivElement.appendChild(document.createTextNode(tab.title === null ? "*" : tab.title));
    
    tab.contentDivElement = document.createElement("div");
    var contentInsets = this.getTabContentInsets(tab);
    tab.contentDivElement.id = this.elementId + "_content_" + tab.tabId;
    tab.contentDivElement.style.display = "none";
    tab.contentDivElement.style.position = "absolute";
    tab.contentDivElement.style.left = "0px";
    tab.contentDivElement.style.right = "0px";
    tab.contentDivElement.style.bottom = "0px";
    tab.contentDivElement.style.top = "0px";
    tab.contentDivElement.style.padding = contentInsets.toString();
    this.contentContainerDivElement.appendChild(tab.contentDivElement);
    
    EchoVirtualPosition.register(tab.contentDivElement.id);
    
    if (tabIndex < this.headerTrElement.childNodes.length) {
        this.headerTrElement.insertBefore(tab.headerTdElement, this.headerTrElement.childNodes[tabIndex]);
    } else {
        this.headerTrElement.appendChild(tab.headerTdElement);
    }
    
    if (this.activeTabId == tab.tabId) {
        this.selectTab(tab.tabId);
    }
};

ExtrasTabPane.prototype.calculateHeaderHeight = function(active) {
    if (active) {
	    // Note: Border size is added and then removed for no effect.
	    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom;
    } else {
	    var largerBorderSize = this.tabInactiveBorder > this.tabActiveBorderSize 
                ? this.tabInactiveBorderSize : this.tabActiveBorderSize;
	    return this.headerHeight - this.headerPaddingTop - this.headerPaddingBottom - this.activeHeaderHeightIncrease
	            - this.tabInactiveBorderSize;
    }
};

ExtrasTabPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    if (!containerElement) {
        throw "Container element not found: " + this.containerElementId;
    }

    this.tabPaneDivElement = document.createElement("div");
    this.tabPaneDivElement.id = this.elementId;
    this.tabPaneDivElement.style.position = "absolute";
    this.tabPaneDivElement.style.overflow = "hidden";
    
    var renderedInsets = new EchoCoreProperties.Insets();
    if (this.insets) {
        if (this.borderType == ExtrasTabPane.BORDER_TYPE_SURROUND) {
            renderedInsets.top = this.insets.top;
            renderedInsets.bottom = this.insets.bottom;
            renderedInsets.left = this.insets.left;
            renderedInsets.right = this.insets.right;
        } else if (this.borderType == ExtrasTabPane.BORDER_TYPE_PARALLEL) {
            renderedInsets.top = this.insets.top;
            renderedInsets.bottom = this.insets.bottom;
        } else {
            if (this.tabPosition == ExtrasTabPane.TAB_POSITION_BOTTOM) {
                renderedInsets.bottom = this.insets.bottom;
            } else {
                renderedInsets.top = this.insets.top;
            }
        }
    }
    this.tabPaneDivElement.style.top = renderedInsets.top + "px";
    this.tabPaneDivElement.style.bottom = renderedInsets.bottom + "px";
    this.tabPaneDivElement.style.left = renderedInsets.left + "px";
    this.tabPaneDivElement.style.right = renderedInsets.right + "px";
    
    EchoVirtualPosition.register(this.tabPaneDivElement.id);
    containerElement.appendChild(this.tabPaneDivElement);
    
    this.headerContainerDivElement = document.createElement("div");
    this.headerContainerDivElement.id = this.elementId + "_header";
    this.headerContainerDivElement.style.overflow = "hidden";
    this.headerContainerDivElement.style.zIndex = 1;
    this.headerContainerDivElement.style.position = "absolute";
    switch (this.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        this.headerContainerDivElement.style.bottom = "0px";
        break;
    default:
        this.headerContainerDivElement.style.top = "0px";
    }
    this.headerContainerDivElement.style.left = this.tabInset + "px";
    this.headerContainerDivElement.style.right = this.tabInset + "px";
    this.headerContainerDivElement.style.height = (this.headerHeight + this.tabActiveBorderSize) + "px";
    this.tabPaneDivElement.appendChild(this.headerContainerDivElement);
    
    var headerTableElement  = document.createElement("table");
    headerTableElement.style.borderWidth = "0px";
    headerTableElement.style.borderCollapse = "collapse";
    headerTableElement.style.padding = "0px";
    this.headerContainerDivElement.appendChild(headerTableElement);
    
    var headerTbodyElement = document.createElement("tbody");
    headerTableElement.appendChild(headerTbodyElement);
    
    this.headerTrElement = document.createElement("tr");
    this.headerTrElement.id = this.elementId + "_header_tr";
    headerTbodyElement.appendChild(this.headerTrElement);
    
    this.contentContainerDivElement = document.createElement("div");
    this.contentContainerDivElement.id = this.elementId + "_content";
    this.tabPaneDivElement.appendChild(this.contentContainerDivElement);

    this.contentContainerDivElement.style.position = "absolute";
    this.contentContainerDivElement.style.backgroundColor = this.defaultBackground;
    this.contentContainerDivElement.style.color = this.defaultForeground;
    if (this.tabPosition == ExtrasTabPane.TAB_POSITION_BOTTOM) {
        this.contentContainerDivElement.style.top = "0px";
        this.contentContainerDivElement.style.bottom = this.headerHeight + "px";
    } else {
        this.contentContainerDivElement.style.top = this.headerHeight + "px";
        this.contentContainerDivElement.style.bottom = "0px";
    }
    this.contentContainerDivElement.style.left = "0px";
    this.contentContainerDivElement.style.right = "0px";
    EchoVirtualPosition.register(this.contentContainerDivElement.id);

    var activeBorder = this.getActiveBorder();
    switch (this.borderType) {
    case ExtrasTabPane.BORDER_TYPE_NONE:
        this.contentContainerDivElement.style.border = "0px none";
        break;
    case ExtrasTabPane.BORDER_TYPE_SURROUND:
        this.contentContainerDivElement.style.border = activeBorder;
        break;
    case ExtrasTabPane.BORDER_TYPE_PARALLEL_TO_TABS:
        this.contentContainerDivElement.style.borderTop = activeBorder;
        this.contentContainerDivElement.style.borderBottom = activeBorder;
        break;
    default:
        switch (this.tabPosition) {
        case ExtrasTabPane.TAB_POSITION_BOTTOM:
            this.contentContainerDivElement.style.borderBottom = this.getActiveBorder();
            break;
        default:
            this.contentContainerDivElement.style.borderTop = this.getActiveBorder();
        }
        break;
    }
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "tabPane", this);
    
    EchoEventProcessor.addHandler(this.headerContainerDivElement, "click", "ExtrasTabPane.processClick");
};

ExtrasTabPane.prototype.dispose = function() {
    for (var i = 0; i < this.tabs.length; ++i) {
        this.tabs[i].dispose();
    }
    this.tabs = null;

    EchoEventProcessor.removeHandler(this.headerContainerDivElement, "click");
    EchoDomPropertyStore.dispose(this.tabPaneDivElement);

    this.tabPaneDivElement = null;
    this.headerContainerDivElement = null;
    this.headerTrElement = null
};

/**
 * Retrieves the ExtrasTabPane.Tab instance with the specified tab id.
 * 
 * @param tabId the tab id
 * @return the Tab, or null if no tab is present with the specified id
 */
ExtrasTabPane.prototype.getTabById = function(tabId) {
    for (var i = 0; i < this.tabs.length; ++i) {
        if (this.tabs[i].tabId == tabId) {
            return this.tabs[i];
        }
    }
    return null;
};

ExtrasTabPane.prototype.getActiveBorder = function() {
    return this.tabActiveBorderSize + "px " + this.tabActiveBorderStyle + " " + this.tabActiveBorderColor;
};

ExtrasTabPane.prototype.getInactiveBorder = function() {
    return this.tabInactiveBorderSize + "px " + this.tabInactiveBorderStyle + " " + this.tabInactiveBorderColor;
};

/**
 * Returns an EchoCoreProperties.Insets representing the insets with which the 
 * specified tab should be rendered.
 *
 * @param tabId the id of the tab
 * @return the insets
 */
ExtrasTabPane.prototype.getTabContentInsets = function(tab) {
    if (tab.pane) {
        return ExtrasTabPane.PANE_INSETS;
    } else {
        return this.defaultContentInsets;
    }
};

ExtrasTabPane.prototype.removeTab = function(tab) {
    ExtrasUtil.Arrays.removeElement(this.tabs, tab);

    tab.headerTdElement.parentNode.removeChild(tab.headerTdElement);
    tab.contentDivElement.parentNode.removeChild(tab.contentDivElement);
    if (this.activeTabId == tab.tabId) {
        this.selectTab(null);
    }
};

ExtrasTabPane.prototype.selectTab = function(tabId) {
    if (this.activeTabId) {
        this.updateTabState(this.activeTabId, false);
    }
    
    if (tabId != null) {
        this.updateTabState(tabId, true);
    }
    
    // Update state information.
    this.activeTabId = tabId;
    
    var activeTab = this.getTabById(tabId);
    if (activeTab) {
        EchoVirtualPosition.redraw();
    }
};

ExtrasTabPane.prototype.updateTabState = function(tabId, selected) {
    var headerDivElement = document.getElementById(this.elementId + "_header_div_" + tabId);
    if (!headerDivElement) {
        // Do nothing.
        return;
    }

    // Begin Mozilla workaround: Removing and re-adding header div element is done to make Mozilla 1.7 rendering
    // engine happy.  Without this workaround tab sizes shrink when clicked.
    var parentNode = headerDivElement.parentNode;
    parentNode.removeChild(headerDivElement);
    parentNode.appendChild(headerDivElement);
    // End Mozilla workaround.

    var border = selected ? this.getActiveBorder() : this.getInactiveBorder();
    headerDivElement.style.backgroundColor = selected ? this.tabActiveBackground : this.tabInactiveBackground;
    headerDivElement.style.color = selected ? this.tabActiveForeground : this.tabInactiveForeground;
    headerDivElement.style.cursor = selected ? "default" : "pointer";
    headerDivElement.style.borderLeft = border;
    headerDivElement.style.borderRight = border;
    headerDivElement.style.height = this.calculateHeaderHeight(selected) + "px";

    switch (this.tabPosition) {
    case ExtrasTabPane.TAB_POSITION_BOTTOM:
        headerDivElement.style.marginTop = this.tabActiveBorderSize + "px";
        headerDivElement.style.borderBottom = border;
        break;
    default: 
        headerDivElement.style.marginTop = (selected ? 0 : this.activeHeaderHeightIncrease) + "px";
        headerDivElement.style.borderTop = border;
        break;
    }

    var newContentDivElement = document.getElementById(this.elementId + "_content_" + tabId);
    newContentDivElement.style.display = selected ? "block" : "none";
};

ExtrasTabPane.getComponent = function(tabPaneId) {
    return EchoDomPropertyStore.getPropertyValue(tabPaneId, "tabPane");
};

ExtrasTabPane.processClick = function(echoEvent) {
    var elementId = echoEvent.target.id;
    var tabPaneId = EchoDomUtil.getComponentId(elementId);
    var tabPane = ExtrasTabPane.getComponent(tabPaneId);
    if (!tabPane.enabled || !EchoClientEngine.verifyInput(tabPaneId, false)) {
        return;
    }
    
    var headerDivTextIndex = elementId.indexOf("_header_div_");
    if (headerDivTextIndex == -1) {
        return;
    }
    var tabId = elementId.substring(headerDivTextIndex + 12);
   
    EchoClientMessage.setPropertyValue(tabPaneId, "activeTab", tabId);
    
    if (tabPane.getTabById(tabId).rendered) {
        tabPane.selectTab(tabId);
    } else {
        // Connect to server with updated tab state such that non-rendered tab will be rendered.
        EchoServerTransaction.connect();
    }
};

/**
 * A data object which represents a single tab within an TabPane.
 * Creates a new Tab.
 *
 * @param tabId the id of the tab
 * @param title the title text to display in the tab header
 * @param pane a boolean flag indicating whether the tab's content is a pane
 *        component
 * @param rendered a boolean flag indicating whether the tab's content has
 *        been rendered to the client (if it has not it must be fetched when
 *        the tab is selected)
 */
ExtrasTabPane.Tab = function(tabId, title, pane, rendered) { 
    this.tabId = tabId;
    this.title = title;
    this.pane = pane;
    this.rendered = rendered;
};

ExtrasTabPane.Tab.prototype.dispose = function() {
    this.headerTdElement = null;
    this.contentDivElement = null;
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
    var tabPane = ExtrasTabPane.getComponent(elementId);
    if (!tabPane) {
        throw "TabPane not found with id: " + elementId;
    }
    
    var tabId = addTabMessageElement.getAttribute("tab-id");
    var tabIndex = addTabMessageElement.getAttribute("tab-index");
    var title = addTabMessageElement.getAttribute("title");
    var pane = addTabMessageElement.getAttribute("pane") == "true";
    var rendered = addTabMessageElement.getAttribute("rendered") == "true";

    var tab = new ExtrasTabPane.Tab(tabId, title, pane, rendered);
    
    tabPane.addTab(tab, tabIndex);
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * TabPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasTabPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var tabPane = ExtrasTabPane.getComponent(elementId);
    if (tabPane) {
        tabPane.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * TabPane component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasTabPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var activeTabId = initMessageElement.getAttribute("active-tab");
    var tabPane = new ExtrasTabPane(elementId, containerElementId, activeTabId);

    tabPane.enabled = initMessageElement.getAttribute("enabled") != "false";

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
    if (initMessageElement.getAttribute("insets")) {
        tabPane.insets = new EchoCoreProperties.Insets(initMessageElement.getAttribute("insets"));
    }
    if (initMessageElement.getAttribute("default-content-insets")) {
        tabPane.defaultContentInsets = new EchoCoreProperties.Insets(
                initMessageElement.getAttribute("default-content-insets"));
    }
    if (initMessageElement.getAttribute("tab-inset")) {
        tabPane.tabInset = parseInt(initMessageElement.getAttribute("tab-inset"));
    }
    if (initMessageElement.getAttribute("tab-spacing")) {
        tabPane.tabSpacing = parseInt(initMessageElement.getAttribute("tab-spacing"));
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
    
    if (initMessageElement.getAttribute("tab-active-background")) {
        tabPane.tabActiveBackground = initMessageElement.getAttribute("tab-active-background");
    }
    if (initMessageElement.getAttribute("tab-active-background-image")) {
        tabPane.tabActiveBackgroundImage = initMessageElement.getAttribute("tab-active-background-image");
    }
    if (initMessageElement.getAttribute("tab-active-border-style")) {
        tabPane.tabActiveBorderStyle = initMessageElement.getAttribute("tab-active-border-style");
    }
    if (initMessageElement.getAttribute("tab-active-border-color")) {
        tabPane.tabActiveBorderColor = initMessageElement.getAttribute("tab-active-border-color");
    }
    if (initMessageElement.getAttribute("tab-active-border-size")) {
        tabPane.tabActiveBorderSize = parseInt(initMessageElement.getAttribute("tab-active-border-size"));
    }
    if (initMessageElement.getAttribute("tab-active-font")) {
        tabPane.tabActiveFont = initMessageElement.getAttribute("tab-active-font");
    }
    if (initMessageElement.getAttribute("tab-active-foreground")) {
        tabPane.tabActiveForeground = initMessageElement.getAttribute("tab-active-foreground");
    }

    if (initMessageElement.getAttribute("tab-inactive-background")) {
        tabPane.tabInactiveBackground = initMessageElement.getAttribute("tab-inactive-background");
    }
    if (initMessageElement.getAttribute("tab-inactive-background-image")) {
        tabPane.tabInactiveBackgroundImage = initMessageElement.getAttribute("tab-inactive-background-image");
    }
    if (initMessageElement.getAttribute("tab-inactive-border-style")) {
        tabPane.tabInactiveBorderStyle = initMessageElement.getAttribute("tab-inactive-border-style");
    }
    if (initMessageElement.getAttribute("tab-inactive-border-color")) {
        tabPane.tabInactiveBorderColor = initMessageElement.getAttribute("tab-inactive-border-color");
    }
    if (initMessageElement.getAttribute("tab-inactive-border-size")) {
        tabPane.tabInactiveBorderSize = parseInt(initMessageElement.getAttribute("tab-inactive-border-size"));
    }
    if (initMessageElement.getAttribute("tab-inactive-font")) {
        tabPane.tabInactiveFont = initMessageElement.getAttribute("tab-inactive-font");
    }
    if (initMessageElement.getAttribute("tab-inactive-foreground")) {
        tabPane.tabInactiveForeground = initMessageElement.getAttribute("tab-inactive-foreground");
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
    var tabPane = ExtrasTabPane.getComponent(elementId);
    var tab = tabPane.getTabById(tabId);
    if (tab) {
        tabPane.removeTab(tab);
    }
};

/**
 * Processes a <code>set-active-tab</code> message to set the active tab.
 * 
 * @param setActiveTabMessageElement the <code>set-active-tab</code> element to process
 */
ExtrasTabPane.MessageProcessor.processSetActiveTab = function(setActiveTabMessageElement) {
    var tabPaneId = setActiveTabMessageElement.getAttribute("eid");
    var tabId = setActiveTabMessageElement.getAttribute("active-tab");
    var tabPane = ExtrasTabPane.getComponent(tabPaneId);
    tabPane.getTabById(tabId).rendered = true;
    tabPane.selectTab(tabId);
};
