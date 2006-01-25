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

ExtrasAccordionPane = function(elementId, containerElementId, activeTabId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.activeTabId = activeTabId;

    this.defaultContentInsets = ExtrasAccordionPane.PANE_INSETS;
    this.tabHeight = 20;
    this.tabBorderSize = 1;
    this.tabBorderStyle = "outset";
    this.tabBorderColor = "#cfcfcf";
    this.tabForeground = "#000000";
    this.tabBackground = "#cfcfcf";
    this.tabRolloverEnabled = false;
    this.tabRolloverForeground = "#00007f";
    this.tabRolloverBackground = "#efefef";
    this.tabRolloverBorderColor = "#cfcfcf";
    this.tabRolloverBorderStyle = "outset";
    this.tabInsets = new ExtrasUtil.Insets(2, 5);
    
    this.tabIds = new Array();
    this.tabIdToTabMap = new EchoCollectionsMap();
};

ExtrasAccordionPane.PANE_INSETS = new ExtrasUtil.Insets(0);

ExtrasAccordionPane.prototype.addTab = function(tab, tabIndex) {
    ExtrasUtil.Arrays.insertElement(this.tabIds, tab.tabId, tabIndex);
    this.tabIdToTabMap.put(tab.tabId, tab);
    
    if (this.activeTabId == null) {
        this.activeTabId = tab.tabId;
    }

    var tabDivElement = document.createElement("div");
    tabDivElement.id = this.elementId + "_tab_" + tab.tabId;
    tabDivElement.style.cursor = "pointer";
    tabDivElement.style.height = this.tabHeight + "px";
    tabDivElement.style.border = this.getTabBorder();
    tabDivElement.style.padding = this.tabInsets.toString();
    tabDivElement.style.backgroundColor = this.tabBackground;
    tabDivElement.style.color = this.tabForeground;
    tabDivElement.style.position = "absolute";
    tabDivElement.style.left = "0px";
    tabDivElement.style.right = "0px";
    tabDivElement.style.overflow = "hidden";
    
    tabDivElement.appendChild(document.createTextNode(tab.title));
    var accordionPaneDivElement = document.getElementById(this.elementId);
    accordionPaneDivElement.appendChild(tabDivElement);

    var tabContentDivElement = document.createElement("div");
    var tabContentInsets = this.getTabContentInsets(tab.tabId);
    tabContentDivElement.id = this.elementId + "_content_" + tab.tabId;
    tabContentDivElement.style.display = "none";
    tabContentDivElement.style.position = "absolute";
    tabContentDivElement.style.left = "0px";
    tabContentDivElement.style.right = "0px";
    tabContentDivElement.style.padding = tabContentInsets.toString();
    tabContentDivElement.style.overflow = "auto";
    accordionPaneDivElement.appendChild(tabContentDivElement);

    var subtractedHeight = tabContentInsets.left + tabContentInsets.right;
    ExtrasUtil.setCssPositionRight(tabContentDivElement.style, accordionPaneDivElement.id, 0, subtractedHeight);
    ExtrasUtil.setCssPositionRight(tabDivElement.style, accordionPaneDivElement.id, 0, 
            this.tabInsets.left + this.tabInsets.right);
    
    EchoEventProcessor.addHandler(tabDivElement.id, "click", "ExtrasAccordionPane.processTabClick");
    EchoEventProcessor.addHandler(tabDivElement.id, "mouseover", "ExtrasAccordionPane.processTabRolloverEnter");
    EchoEventProcessor.addHandler(tabDivElement.id, "mouseout", "ExtrasAccordionPane.processTabRolloverExit");
};

ExtrasAccordionPane.prototype.calculateTabHeight = function() {
    return this.tabHeight + this.tabInsets.top + this.tabInsets.bottom + (this.tabBorderSize * 2);
};

ExtrasAccordionPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    var accordionPaneDivElement = document.createElement("div");
    accordionPaneDivElement.id = this.elementId;
    accordionPaneDivElement.style.position = "absolute";
    accordionPaneDivElement.style.overflow = "hidden";
    accordionPaneDivElement.style.width = "100%";
    accordionPaneDivElement.style.height = "100%";
    if (this.background != null) {
        accordionPaneDivElement.style.background = this.background;
    }
    if (this.foreground != null) {
        accordionPaneDivElement.style.foreground = this.foreground;
    }
    
    containerElement.appendChild(accordionPaneDivElement);
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
};

ExtrasAccordionPane.prototype.dispose = function() {
    for (var i = 0; i < this.tabIds.length; ++i) {
	    EchoEventProcessor.removeHandler(this.tabIds[i], "click");
	    EchoEventProcessor.removeHandler(this.tabIds[i], "mouseover");
	    EchoEventProcessor.removeHandler(this.tabIds[i], "mouseout");
    }
};

ExtrasAccordionPane.prototype.getTabContentElement = function(tabId) {
    return document.getElementById(this.elementId + "_content_" + tabId);
};

ExtrasAccordionPane.prototype.getTabElement = function(tabId) {
    return document.getElementById(this.elementId + "_tab_" + tabId);
};

ExtrasAccordionPane.prototype.getTabBorder = function() {
    return this.tabBorderSize + "px " + this.tabBorderStyle + " " + this.tabBorderColor;
};

ExtrasAccordionPane.prototype.getTabContentInsets = function(tabId) {
    var tab = this.tabIdToTabMap.get(tabId);
    if (tab.pane) {
        return ExtrasAccordionPane.PANE_INSETS;
    } else {
        return this.defaultContentInsets;
    }
};

ExtrasAccordionPane.prototype.removeTab = function(tabId) {
    var tabDivElement = this.getTabElement(tabId);
    var tabContentDivElement = this.getTabContentElement(tabId);

    EchoEventProcessor.removeHandler(tabDivElement.id, "click");
    EchoEventProcessor.removeHandler(tabDivElement.id, "mouseover");
    EchoEventProcessor.removeHandler(tabDivElement.id, "mouseout");
    
    ExtrasUtil.Arrays.removeElement(this.tabIds, tabId);
    this.tabIdToTabMap.remove(tabId);

    tabDivElement.parentNode.removeChild(tabDivElement);
    tabContentDivElement.parentNode.removeChild(tabContentDivElement);
};

ExtrasAccordionPane.prototype.repositionTabs = function() {
    var selectionPassed = false;
    var tabHeight = this.calculateTabHeight();
    for (var i = 0; i < this.tabIds.length; ++i) {
        var tabDivElement = this.getTabElement(this.tabIds[i]);
        var tabContentDivElement = this.getTabContentElement(this.tabIds[i]);
        if (selectionPassed) {
            tabDivElement.style.top = "";
            tabDivElement.style.bottom = (tabHeight * (this.tabIds.length - i - 1)) + "px";
        } else {
            tabDivElement.style.top = (tabHeight * i) + "px";
            tabDivElement.style.bottom = ""; 
        }
        
        if (this.activeTabId == this.tabIds[i]) {
            selectionPassed = true;
            tabContentDivElement.style.display = "block";
            tabContentDivElement.style.top = (tabHeight * (i + 1)) + "px";
            var bottomPx = tabHeight * (this.tabIds.length - i - 1);
            var tabContentInsets = this.getTabContentInsets(this.tabIds[i]);
            var subtractedHeight = tabHeight * this.tabIds.length + tabContentInsets.top + tabContentInsets.bottom;
            ExtrasUtil.setCssPositionBottom(tabContentDivElement.style, this.elementId, bottomPx, subtractedHeight);
            tabContentDivElement.style.bottom = bottomPx + "px";
        } else {
            tabContentDivElement.style.display = "none";
        }
    }
};

ExtrasAccordionPane.prototype.selectTab = function(tabId) {
    EchoClientMessage.setPropertyValue(this.elementId, "activeTab", tabId);
    this.activeTabId = tabId;
    this.repositionTabs();
};

ExtrasAccordionPane.prototype.setTabHighlight = function(tabId, state) {
    var tabDivElement = this.getTabElement(tabId);
    tabDivElement.style.backgroundColor = state ? this.tabRolloverBackground : this.tabBackground;
    tabDivElement.style.color = state ? this.tabRolloverForeground : this.tabForeground;
    tabDivElement.style.borderColor = state ? this.tabRolloverBorderColor : this.tabBorderColor;
    tabDivElement.style.borderStyle = state ? this.tabRolloverBorderStyle : this.tabBorderStyle;
};

ExtrasAccordionPane.getComponent = function(componentId) {
    return EchoDomPropertyStore.getPropertyValue(componentId, "component");
};

ExtrasAccordionPane.getTabId = function(tabDivElementId) {
    var lastUnderscoreIndex = tabDivElementId.lastIndexOf("_");
    return tabDivElementId.substring(lastUnderscoreIndex + 1);
};

ExtrasAccordionPane.processTabClick = function(echoEvent) {
    var tabDivElement = echoEvent.registeredTarget;
    var componentId = EchoDomUtil.getComponentId(tabDivElement.id);
    if (!EchoClientEngine.verifyInput(componentId, false)) {
        return;
    }
    var accordion = ExtrasAccordionPane.getComponent(componentId);
    var tabId = ExtrasAccordionPane.getTabId(tabDivElement.id);
    accordion.selectTab(tabId);
};

ExtrasAccordionPane.processTabRolloverEnter = function(echoEvent) {
    var tabDivElement = echoEvent.registeredTarget;
    var componentId = EchoDomUtil.getComponentId(tabDivElement.id);
    if (!EchoClientEngine.verifyInput(componentId, false)) {
        return;
    }
    var accordion = ExtrasAccordionPane.getComponent(componentId);
    if (!accordion.tabRolloverEnabled) {
        return;
    }
    var tabId = ExtrasAccordionPane.getTabId(tabDivElement.id);
    accordion.setTabHighlight(tabId, true);
};

ExtrasAccordionPane.processTabRolloverExit = function(echoEvent) {
    var tabDivElement = echoEvent.registeredTarget;
    var componentId = EchoDomUtil.getComponentId(tabDivElement.id);
    if (!EchoClientEngine.verifyInput(componentId, false)) {
        return;
    }
    var accordion = ExtrasAccordionPane.getComponent(componentId);
    if (!accordion.tabRolloverEnabled) {
        return;
    }
    var tabId = ExtrasAccordionPane.getTabId(tabDivElement.id);
    accordion.setTabHighlight(tabId, false);
};

ExtrasAccordionPane.Tab = function(tabId, title, pane) { 
    this.tabId = tabId;
    this.title = title;
    this.pane = pane;
};

/**
 * Static object/namespace for AccordionPane MessageProcessor 
 * implementation.
 */
ExtrasAccordionPane.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasAccordionPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "add-tab":
                ExtrasAccordionPane.MessageProcessor.processAddTab(messagePartElement.childNodes[i]);
                break;
            case "dispose":
                ExtrasAccordionPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasAccordionPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            case "redraw":
                ExtrasAccordionPane.MessageProcessor.processRedraw(messagePartElement.childNodes[i]);
                break;
            case "remove-tab":
                ExtrasAccordionPane.MessageProcessor.processRemoveTab(messagePartElement.childNodes[i]);
                break;
            case "set-active-tab":
                ExtrasAccordionPane.MessageProcessor.processSetActiveTab(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>add-tab</code> message to add a new tab to the AccordionPane.
 *
 * @param addTabMessageElement the <code>add-tab</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processAddTab = function(addTabMessageElement) {
    var elementId = addTabMessageElement.getAttribute("eid");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    if (!accordionPane) {
        throw "AccordionPane not found with id: " + elementId;
    }
    
    var tabId = addTabMessageElement.getAttribute("tab-id");
    var tabIndex = addTabMessageElement.getAttribute("tab-index");
    var title = addTabMessageElement.getAttribute("title");
    var pane = addTabMessageElement.getAttribute("pane") == "true";
    
    var tab = new ExtrasAccordionPane.Tab(tabId, title, pane);
    
    accordionPane.addTab(tab, tabIndex);
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * AccordionPane component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processDispose = function(disposeMessageElement) {
    var elementId = disposeMessageElement.getAttribute("eid");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    if (!accordionPane) {
        throw "AccordionPane not found with id: " + elementId;
    }
    accordionPane.dispose();
};

/**
 * Processes an <code>init</code> message to create an AccordionPane.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var activeTabId = initMessageElement.getAttribute("active-tab");
    var accordionPane = new ExtrasAccordionPane(elementId, containerElementId, activeTabId);
    
    if (initMessageElement.getAttribute("background")) {
        accordionPane.background = initMessageElement.getAttribute("background");
    }
    if (initMessageElement.getAttribute("foreground")) {
        accordionPane.foreground = initMessageElement.getAttribute("foreground");
    }
    if (initMessageElement.getAttribute("tab-background")) {
        accordionPane.tabBackground = initMessageElement.getAttribute("tab-background");
    }
    if (initMessageElement.getAttribute("tab-foreground")) {
        accordionPane.tabForeground = initMessageElement.getAttribute("tab-foreground");
    }
    if (initMessageElement.getAttribute("tab-border-size")) {
        accordionPane.tabBorderSize = parseInt(initMessageElement.getAttribute("tab-border-size"));
    }
    if (initMessageElement.getAttribute("tab-border-style")) {
        accordionPane.tabBorderStyle = initMessageElement.getAttribute("tab-border-style");
    }
    if (initMessageElement.getAttribute("tab-border-color")) {
        accordionPane.tabBorderColor = initMessageElement.getAttribute("tab-border-color");
    }
    if (initMessageElement.getAttribute("tab-rollover-enabled")) {
        accordionPane.tabRolloverEnabled = initMessageElement.getAttribute("tab-rollover-enabled") == "true";
    }
    if (initMessageElement.getAttribute("tab-rollover-background")) {
        accordionPane.tabRolloverBackground = initMessageElement.getAttribute("tab-rollover-background");
    }
    if (initMessageElement.getAttribute("tab-rollover-foreground")) {
        accordionPane.tabRolloverForeground = initMessageElement.getAttribute("tab-rollover-foreground");
    }
    if (initMessageElement.getAttribute("tab-rollover-border-style")) {
        accordionPane.tabRolloverBorderStyle = initMessageElement.getAttribute("tab-rollover-border-style");
    }
    if (initMessageElement.getAttribute("tab-rollover-border-color")) {
        accordionPane.tabRolloverBorderColor = initMessageElement.getAttribute("tab-rollover-border-color");
    }
    if (initMessageElement.getAttribute("default-content-insets")) {
        accordionPane.defaultContentInsets = new ExtrasUtil.Insets(initMessageElement.getAttribute("default-content-insets"));
    }
    if (initMessageElement.getAttribute("tab-insets")) {
        accordionPane.tabInsets = new ExtrasUtil.Insets(initMessageElement.getAttribute("tab-insets"));
    }
    
    accordionPane.create();
    
    if (initMessageElement.getAttribute("enabled") == "false") {
        EchoDomPropertyStore.setPropertyValue(elementId, "EchoClientEngine.inputDisabled", true);
    }
};

/**
 * Processes an <code>redraw</code> message to redraw the state of an
 * AccordionPane. 
 *
 * @param redrawMessageElement the <code>redraw</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processRedraw = function(redrawMessageElement) {
    var elementId = redrawMessageElement.getAttribute("eid");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    if (!accordionPane) {
        throw "AccordionPane not found with id: " + elementId;
    }
    accordionPane.repositionTabs();
};

/**
 * Processes a <code>remove-tab</code> message to remove a tab from the 
 * AccordionPane.
 * 
 * @param removeTabMessageElement the <code>remove-tab</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processRemoveTab = function(removeTabMessageElement) {
    var elementId = removeTabMessageElement.getAttribute("eid");
    var tabId = removeTabMessageElement.getAttribute("tab-id");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    if (!accordionPane) {
        throw "AccordionPane not found with id: " + elementId;
    }
    accordionPane.removeTab(tabId);
};

/**
 * Processes a <code>set-active-tab</code> message to set the active tab.
 * 
 * @param setActiveTabMessageElement the <code>set-active-tab</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processSetActiveTab = function(setActiveTabMessageElement) {
    var elementId = setActiveTabMessageElement.getAttribute("eid");
    var tabId = setActiveTabMessageElement.getAttribute("tab-id");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    accordionPane.selectTab(tabId);
};
