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
 * ExtrasAccordionPane Namespace/Object/Constructor.
 * Creates a new AccordionPane data object.
 *
 * @param elementId the DOM element id of the AccordionPane that will be
 *        rendered (when the create() method is invoked)
 * @param containerElementId the DOM element id of the container to which the
 *        AccordionPane will be added
 * @param activeTabId the id of the initially active tab
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
    this.tabBackgroundImage = null;
    this.tabRolloverEnabled = false;
    this.tabRolloverForeground = null;
    this.tabRolloverBackground = null;
    this.tabRolloverBackgroundImage = null;
    this.tabRolloverBorderColor = null;
    this.tabRolloverBorderStyle = null;
    this.tabInsets = new EchoCoreProperties.Insets(2, 5);

    this.animationEnabled = true;
    this.animationTime = 350;
    this.animationSleepInterval = 1;

    /**
     * Array of ExtrasAccordionPane.Tab objects, representing displayed tabs, \
     * in top-to-bottom sequence.
     */
    this.tabs = [];
    
    /**
     * Root DIV element of rendered AccordionPane.
     */
    this.accordionPaneDivElement = null;
};

ExtrasAccordionPane.PANE_INSETS = new EchoCoreProperties.Insets(0);

/**
 * Adds a Tab to the AccordionPane.
 *
 * @param the ExtrasAccordionPane.Tab data object representing the tab
 * @param tabIndex the index at which the tab should be inserted
 */
ExtrasAccordionPane.prototype.addTab = function(tab, tabIndex) {
    ExtrasUtil.Arrays.insertElement(this.tabs, tab, tabIndex);
    
    tab.tabDivElement = document.createElement("div");
    tab.tabDivElement.id = this.elementId + "_tab_" + tab.tabId;
    tab.tabDivElement.style.cursor = "pointer";
    tab.tabDivElement.style.height = this.tabHeight + "px";
    tab.tabDivElement.style.borderTop = this.tabBorderSize + "px " + this.tabBorderStyle + " " + this.tabBorderColor;
    tab.tabDivElement.style.borderBottom = this.tabBorderSize + "px " + this.tabBorderStyle + " " + this.tabBorderColor;
    tab.tabDivElement.style.padding = this.tabInsets.toString();
    tab.tabDivElement.style.backgroundColor = this.tabBackground;
    if (this.tabBackgroundImage) {
        EchoCssUtil.applyStyle(tab.tabDivElement, this.tabBackgroundImage);
    }
    tab.tabDivElement.style.color = this.tabForeground;
    tab.tabDivElement.style.position = "absolute";
    tab.tabDivElement.style.left = "0px";
    tab.tabDivElement.style.right = "0px";
    tab.tabDivElement.style.overflow = "hidden";
    tab.tabDivElement.appendChild(document.createTextNode(tab.title));
    this.accordionPaneDivElement.appendChild(tab.tabDivElement);

    tab.contentDivElement = document.createElement("div");
    var tabContentInsets = this.getTabContentInsets(tab);
    tab.contentDivElement.id = this.elementId + "_content_" + tab.tabId;
    tab.contentDivElement.style.display = "none";
    tab.contentDivElement.style.position = "absolute";
    tab.contentDivElement.style.left = "0px";
    tab.contentDivElement.style.right = "0px";
    tab.contentDivElement.style.padding = tabContentInsets.toString();
    tab.contentDivElement.style.overflow = "auto";
    this.accordionPaneDivElement.appendChild(tab.contentDivElement);

    EchoVirtualPosition.register(tab.tabDivElement.id);
    EchoVirtualPosition.register(tab.contentDivElement.id);
    
    EchoEventProcessor.addHandler(tab.tabDivElement, "click", "ExtrasAccordionPane.processTabClick");
    EchoEventProcessor.addHandler(tab.tabDivElement, "mouseover", "ExtrasAccordionPane.processTabRolloverEnter");
    EchoEventProcessor.addHandler(tab.tabDivElement, "mouseout", "ExtrasAccordionPane.processTabRolloverExit");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.addEventListener(tab.tabDivElement, "selectstart", ExtrasAccordionPane.absorbMouseSelection, false);
    } else {
        EchoDomUtil.addEventListener(tab.tabDivElement, "mousedown", ExtrasAccordionPane.absorbMouseSelection, false);
    }
};

ExtrasAccordionPane.prototype.calculateTabHeight = function() {
    return this.tabHeight + this.tabInsets.top + this.tabInsets.bottom + (this.tabBorderSize * 2);
};

/**
 * Renders the AccordionPane to the DOM, beneath its previously specified
 * container element.
 *
 * Note: When the tab pane is destroyed,  the dispose() method must be invoked
 * to release resources allocated by this method.
 */
ExtrasAccordionPane.prototype.create = function() {
    var containerElement = document.getElementById(this.containerElementId);
    this.accordionPaneDivElement = document.createElement("div");
    this.accordionPaneDivElement.id = this.elementId;
    this.accordionPaneDivElement.style.position = "absolute";
    this.accordionPaneDivElement.style.overflow = "hidden";
    this.accordionPaneDivElement.style.width = "100%";
    this.accordionPaneDivElement.style.height = "100%";
    if (this.background != null) {
        this.accordionPaneDivElement.style.background = this.background;
    }
    if (this.foreground != null) {
        this.accordionPaneDivElement.style.foreground = this.foreground;
    }
    
    containerElement.appendChild(this.accordionPaneDivElement);
    
    EchoDomPropertyStore.setPropertyValue(this.accordionPaneDivElement, "component", this);
};

/**
 * Releases resources held by the AccordionPane.
 */
ExtrasAccordionPane.prototype.dispose = function() {
    for (var i = 0; i < this.tabs.length; ++i) {
        this.disposeTab(this.tabs[i]);
    }
    EchoDomPropertyStore.dispose(this.accordionPaneDivElement);
    this.accordionPaneDivElement = null;
};

/**
 * Disposes of resources used by a tab in an AccordionPane.
 * Invoked prior to removing tab or in process of disposing entire
 * AccordionPane.
 *
 * @param tab the tab to dispose
 */
ExtrasAccordionPane.prototype.disposeTab = function(tab) {
    EchoEventProcessor.removeHandler(tab.tabDivElement, "click");
    EchoEventProcessor.removeHandler(tab.tabDivElement, "mouseover");
    EchoEventProcessor.removeHandler(tab.tabDivElement, "mouseout");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.removeEventListener(tab.tabDivElement, "selectstart", ExtrasAccordionPane.absorbMouseSelection, false);
    } else {
        EchoDomUtil.removeEventListener(tab.tabDivElement, "mousedown", ExtrasAccordionPane.absorbMouseSelection, false);
    }
    tab.dispose();
};

/**
 * Retrieves the ExtrasAccordionPane.Tab instance with the specified tab id.
 * 
 * @param tabId the tab id
 * @return the Tab, or null if no tab is present with the specified id
 */
ExtrasAccordionPane.prototype.getTabById = function(tabId) {
    for (var i = 0; i < this.tabs.length; ++i) {
        if (this.tabs[i].tabId == tabId) {
            return this.tabs[i];
        }
    }
    return null;
};

/**
 * Returns an new EchoCoreProperties.Insets representing the insets with which the 
 * specified tab should be rendered.
 *
 * @param tabId the id of the tab
 * @return the insets
 */
ExtrasAccordionPane.prototype.getTabContentInsets = function(tab) {
    if (tab.pane) {
        return ExtrasAccordionPane.PANE_INSETS;
    } else {
        return this.defaultContentInsets;
    }
};

/**
 * Removes a tab from an AccordionPane.
 *
 * @param tabId the id of the tab to remove
 */
ExtrasAccordionPane.prototype.removeTab = function(tab) {
    var tabIndex = ExtrasUtil.Arrays.indexOf(this.tabs, tab);
    ExtrasUtil.Arrays.removeIndex(this.tabs, tabIndex);

    tab.tabDivElement.parentNode.removeChild(tab.tabDivElement);
    tab.contentDivElement.parentNode.removeChild(tab.contentDivElement);

    this.disposeTab(tab);
};

/**
 * Redraws tabs in the appropriate positions, exposing the content of the 
 * selected tab.
 */
ExtrasAccordionPane.prototype.redrawTabs = function() {
    if (this.rotation) {
        this.rotation.cancel();
    }
    
    if (this.activeTabId == null || !this.getTabById(this.activeTabId)) {
        if (this.tabs.length > 0) {
            this.activeTabId = this.tabs[0].tabId;
        } else {
            this.activeTabId = null;
        }
    }

    var selectionPassed = false;
    var tabHeight = this.calculateTabHeight();
    for (var i = 0; i < this.tabs.length; ++i) {
        if (selectionPassed) {
            this.tabs[i].tabDivElement.style.top = "";
            this.tabs[i].tabDivElement.style.bottom = (tabHeight * (this.tabs.length - i - 1)) + "px";
        } else {
            this.tabs[i].tabDivElement.style.bottom = "";
            this.tabs[i].tabDivElement.style.top = (tabHeight * i) + "px";
        }

        this.tabs[i].contentDivElement.style.height = "";
        
        if (this.activeTabId == this.tabs[i].tabId) {
            selectionPassed = true;
            this.tabs[i].contentDivElement.style.display = "block";
            this.tabs[i].contentDivElement.style.top = (tabHeight * (i + 1)) + "px";
            var bottomPx = tabHeight * (this.tabs.length - i - 1);
            this.tabs[i].contentDivElement.style.bottom = bottomPx + "px";
        } else {
            this.tabs[i].contentDivElement.style.display = "none";
        }
    }
    
    EchoVirtualPosition.redraw();
};

/**
 * "Rotates" the AccordionPane to display the specified tab.
 *
 * @param oldTabId the currently displayed tab id
 * @param newTabId the tab that will be displayed
 */ 
ExtrasAccordionPane.prototype.rotateTabs = function(oldTabId, newTabId) {
    if (oldTabId == newTabId) {
        // Do nothing.
        return;
    }
    if (this.getTabById(oldTabId) == null) {
        // Old tab has been removed.
        this.redrawTabs();
        return;
    }
    if (this.rotation) {
        // Rotation was already in progress, cancel
        this.rotation.cancel();
        this.redrawTabs();
    } else {
        // Start new rotation.
        new ExtrasAccordionPane.Rotation(this, oldTabId, newTabId);
    }
};

/**
 * Selects a specific tab.
 * 
 * @param tabId the id of the tab to select
 */
ExtrasAccordionPane.prototype.selectTab = function(newTabId, animate) {
    EchoClientMessage.setPropertyValue(this.elementId, "activeTab", newTabId);
    var oldTabId = this.activeTabId;
    this.activeTabId = newTabId;
    if (animate && oldTabId != null && this.animationEnabled) {
        this.rotateTabs(oldTabId, newTabId);
    } else {
        this.redrawTabs();
    }
};

/**
 * Sets the highlight (i.e. rollover effect) state of a specific tab.
 *
 * @param tabId the id of the tab
 * @param state the highlight state (true indicating it should be highlighted,
 *        false indicating it should not)
 */
ExtrasAccordionPane.prototype.setTabHighlight = function(tabId, state) {
    var tab = this.getTabById(tabId);
    if (state) {
        if (this.tabRolloverBackground) {
            tab.tabDivElement.style.backgroundColor = this.tabRolloverBackground;
        } else {
            tab.tabDivElement.style.backgroundColor = ExtrasUtil.Color.adjustIntensity(this.tabBackground, 1.4);
        }
        if (this.tabRolloverBackgroundImage) {
		    if (this.tabBackgroundImage) {
		        tab.tabDivElement.style.backgroundImage = "";
		        tab.tabDivElement.style.backgroundPosition = "";
		        tab.tabDivElement.style.backgroundRepeat = "";
		    }
		    EchoCssUtil.applyStyle(tab.tabDivElement, this.tabRolloverBackgroundImage);
        }
        if (this.tabRolloverBorderColor) {
            tab.tabDivElement.style.borderTopColor = this.tabRolloverBorderColor;
            tab.tabDivElement.style.borderBottomColor = this.tabRolloverBorderColor;
        } else {
            tab.tabDivElement.style.borderTopColor = ExtrasUtil.Color.adjustIntensity(this.tabBorderColor, 1.4);
            tab.tabDivElement.style.borderBottomColor = ExtrasUtil.Color.adjustIntensity(this.tabBorderColor, 1.4);
        }
        if (this.tabRolloverForeground) {
            tab.tabDivElement.style.color = this.tabRolloverForeground;
        }
        if (this.tabRolloverBorderStyle) {
            tab.tabDivElement.style.borderTopStyle = this.tabRolloverBorderStyle;
            tab.tabDivElement.style.borderBottomStyle = this.tabRolloverBorderStyle;
        }
    } else {
        tab.tabDivElement.style.backgroundColor = this.tabBackground;
        tab.tabDivElement.style.color = this.tabForeground;
        tab.tabDivElement.style.borderTopColor = this.tabBorderColor;
        tab.tabDivElement.style.borderBottomColor = this.tabBorderColor;
        tab.tabDivElement.style.borderTopStyle = this.tabBorderStyle;
        tab.tabDivElement.style.borderBottomStyle = this.tabBorderStyle;
        if (this.tabBackgroundImage) {
		    if (this.tabRolloverBackgroundImage) {
		        tab.tabDivElement.style.backgroundImage = "";
		        tab.tabDivElement.style.backgroundPosition = "";
		        tab.tabDivElement.style.backgroundRepeat = "";
			    EchoCssUtil.applyStyle(tab.tabDivElement, this.tabBackgroundImage);
		    }
        }
    }
};

/**
 * Returns the AccordionPane data object instance based on the root element id
 * of the AccordionPane.
 *
 * @param componentId the root element id of the AccordionPane
 * @return the relevant AccordionPane instance
 */
ExtrasAccordionPane.getComponent = function(componentId) {
    return EchoDomPropertyStore.getPropertyValue(componentId, "component");
};

/**
 * Returns the tab id of the specified tab header element.
 *
 * @param tabDivElement the DOM element id of the tab header
 * @return the tab id.
 */
ExtrasAccordionPane.getTabId = function(tabDivElementId) {
    var lastUnderscoreIndex = tabDivElementId.lastIndexOf("_");
    return tabDivElementId.substring(lastUnderscoreIndex + 1);
};

/**
 * Prevents a mousedown (DOM) or selectstart (IE) event from performing
 * its default action (which may cause a selection).
 * 
 * @param e the event
 */
ExtrasAccordionPane.absorbMouseSelection = function(e) {
    EchoDomUtil.preventEventDefault(e);
};

/**
 * Event handler to process a user click on a tab header.
 *
 * @param echoEvent the event (must be forwarded by EchoEventProcessor)
 */
ExtrasAccordionPane.processTabClick = function(echoEvent) {
    var tabDivElement = echoEvent.registeredTarget;
    var componentId = EchoDomUtil.getComponentId(tabDivElement.id);
    if (!EchoClientEngine.verifyInput(componentId, false)) {
        return;
    }
    var accordion = ExtrasAccordionPane.getComponent(componentId);
    var tabId = ExtrasAccordionPane.getTabId(tabDivElement.id);

    accordion.setTabHighlight(tabId, false);
    
    if (accordion.getTabById(tabId).rendered) {
        accordion.selectTab(tabId, true);
    } else {
        // Connect to server with updated tab state such that non-rendered tab will be rendered.
        accordion.selectTab(tabId, false);
        EchoServerTransaction.connect();
    }
};

/**
 * Event handler to process a tab header rollover-enter event
 *
 * @param echoEvent the event (must be forwarded by EchoEventProcessor)
 */
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

/**
 * Event handler to process  a tab header rollover-exit event
 *
 * @param echoEvent the event (must be forwarded by EchoEventProcessor)
 */
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

/**
 * Object to manage rotation animation of an AccordionPane.
 * These objects are created and assigned to a specific AccordionPane
 * while it is animating.
 *
 * Creates and starts a new Rotation.  This constructor will store the
 * created Rotation object in the specified AccordionPane's 'rotation'
 * property.
 *
 * @param accordionPane the ExtrasAccordionPane to rotate
 * @param oldTabId the old (current) tab id
 * @param newTabId the new tab id to display
 */
ExtrasAccordionPane.Rotation = function(accordionPane, oldTabId, newTabId) {
    this.accordionPane = accordionPane;
    this.oldTab = accordionPane.getTabById(oldTabId);
    this.newTab = accordionPane.getTabById(newTabId);
    
    this.oldTabContentInsets = this.accordionPane.getTabContentInsets(this.oldTab);
    this.newTabContentInsets = this.accordionPane.getTabContentInsets(this.newTab);
    
    this.animationStartTime = new Date().getTime();
    this.animationEndTime = this.animationStartTime + this.accordionPane.animationTime;
    
    this.accordionPane.rotation = this;
    this.tabHeight = this.accordionPane.calculateTabHeight();
    
    this.rotatingTabs = [];
    
    this.animationStepIndex = 0;
    
    this.oldTabIndex = ExtrasUtil.Arrays.indexOf(this.accordionPane.tabs, this.oldTab);
    this.newTabIndex = ExtrasUtil.Arrays.indexOf(this.accordionPane.tabs, this.newTab);
    this.directionDown = this.newTabIndex < this.oldTabIndex;
    
    if (this.directionDown) {
        // Tabs are sliding down (a tab on the top has been selected).
        for (var i = this.oldTabIndex; i > this.newTabIndex; --i) {
            this.rotatingTabs.push(this.accordionPane.tabs[i]);
        }
    } else {
        // Tabs are sliding up (a tab on the bottom has been selected).
        for (var i = this.oldTabIndex + 1; i <= this.newTabIndex; ++i) {
            this.rotatingTabs.push(this.accordionPane.tabs[i]);
        }
    }
    
    this.regionHeight = this.accordionPane.accordionPaneDivElement.offsetHeight;
    
    if (this.directionDown) {
        // Numbers of tabs above that will not be moving.
        this.numberOfTabsAbove = this.newTabIndex + 1;
        
        // Number of tabs below that will not be moving.
        this.numberOfTabsBelow = this.accordionPane.tabs.length - 1 - this.newTabIndex
        
        // Initial top position of topmost moving tab.
        this.startTopPosition = this.tabHeight * this.numberOfTabsAbove;
        
        // Final top position of topmost moving tab.
        this.endTopPosition = this.regionHeight - this.tabHeight * (this.numberOfTabsBelow);
        
        // Number of pixels across which animation will occur.
        this.animationDistance = this.endTopPosition - this.startTopPosition;
    
    } else {
        // Numbers of tabs above that will not be moving.
        this.numberOfTabsAbove = this.newTabIndex;
    
        // Numbers of tabs below that will not be moving.
        this.numberOfTabsBelow = this.accordionPane.tabs.length - 1 - this.newTabIndex

        // Initial bottom position of bottommost moving tab.
        this.startBottomPosition = this.tabHeight * this.numberOfTabsBelow;

        // Final bottom position of bottommost moving tab.
        this.endBottomPosition = this.regionHeight - this.tabHeight * (this.numberOfTabsAbove + 1);
        
        // Number of pixels across which animation will occur.
        this.animationDistance = this.endBottomPosition - this.startBottomPosition;
    }
    
    this.overflowUpdate();
    this.animationStep();
};

/**
 * Renders the next step of the rotation animation.
 * Queues subsequent frame of animation via Window.setTimeout() call to self.
 */
ExtrasAccordionPane.Rotation.prototype.animationStep = function() {
    var currentTime = new Date().getTime();
    
    if (currentTime < this.animationEndTime) {
        // Number of pixels (from 0) to step current current frame.
        
        var stepFactor = (currentTime - this.animationStartTime) / this.accordionPane.animationTime;
        var stepPosition = Math.round(stepFactor * this.animationDistance);

        if (this.directionDown) {

            // Move each moving tab to next step position.
            for (var i = 0; i < this.rotatingTabs.length; ++i) {
                var newPosition = stepPosition + this.startTopPosition + (this.tabHeight * (this.rotatingTabs.length - i - 1));
                this.rotatingTabs[i].tabDivElement.style.top = newPosition + "px";
            }
            
            // Adjust height of expanding new tab content to fill expanding space.
            var newContentHeight = stepPosition - this.oldTabContentInsets.top - this.oldTabContentInsets.bottom;
            if (newContentHeight < 0) {
                newContentHeight = 0;
            }
            this.newTab.contentDivElement.style.height = newContentHeight + "px";
            
            // On first frame, display new tab content.
            if (this.animationStepIndex == 0) {
                this.oldTab.contentDivElement.style.bottom = "";
                this.newTab.contentDivElement.style.display = "block";
                this.newTab.contentDivElement.style.top = (this.numberOfTabsAbove * this.tabHeight) + "px";
            }
            
            // Move top of old content downward.
            var oldTop = stepPosition + this.startTopPosition + (this.rotatingTabs.length * this.tabHeight);
            this.oldTab.contentDivElement.style.top = oldTop + "px";
            
            // Reduce height of contracting old tab content to fit within contracting space.
            var oldContentHeight = this.regionHeight - oldTop - ((this.numberOfTabsBelow - 1) * this.tabHeight) 
                    - this.oldTabContentInsets.top - this.oldTabContentInsets.bottom;
            if (oldContentHeight < 0) {
                oldContentHeight = 0;
            }
            this.oldTab.contentDivElement.style.height = oldContentHeight + "px";
        } else {
            // Move each moving tab to next step position.
            for (var i = 0; i < this.rotatingTabs.length; ++i) {
                var newPosition = stepPosition + this.startBottomPosition + (this.tabHeight * (this.rotatingTabs.length - i - 1));
                this.rotatingTabs[i].tabDivElement.style.bottom = newPosition + "px";
            }
            
            // On first frame, display new tab content.
            if (this.animationStepIndex == 0) {
                this.oldTab.contentDivElement.style.bottom = "";
                this.newTab.contentDivElement.style.top = "";
                this.newTab.contentDivElement.style.bottom = (this.numberOfTabsBelow * this.tabHeight) + "px";
                this.newTab.contentDivElement.style.height = "0px";
                this.newTab.contentDivElement.style.display = "block";
            }
            
            // Reduce height of contracting old tab content to fit within contracting space.
            var oldContentHeight = this.regionHeight - stepPosition 
                    - ((this.numberOfTabsAbove + this.numberOfTabsBelow + 1) * this.tabHeight)
                    - this.oldTabContentInsets.top - this.oldTabContentInsets.bottom;
            if (oldContentHeight < 0) {
                oldContentHeight = 0;
            }
            this.oldTab.contentDivElement.style.height = oldContentHeight + "px";
            
            // Increase height of expanding tab content to fit within expanding space.
            var newContentHeight = stepPosition - this.newTabContentInsets.top - this.newTabContentInsets.bottom;
            if (newContentHeight < 0) {
                newContentHeight = 0;
            };
            this.newTab.contentDivElement.style.height = newContentHeight + "px";
        }
        
        ++this.animationStepIndex;
    
        // Continue Rotation.
        window.setTimeout("ExtrasAccordionPane.Rotation.animationStep(\"" + this.accordionPane.elementId + "\")", 
                this.accordionPane.animationSleepInterval);
    } else {
        // Complete Rotation.
        this.overflowRestore();
        var accordionPane = this.accordionPane;
        this.dispose();
        accordionPane.redrawTabs();
    }
};

/**
 * Cancels the rotation.
 */
ExtrasAccordionPane.Rotation.prototype.cancel = function() {
    this.overflowRestore();
    this.dispose();
};

/**
 * Disposes of the rotation.
 */
ExtrasAccordionPane.Rotation.prototype.dispose = function() {
    this.oldTab = null;
    this.oldTabContentInsets = null;
    this.newTab = null;
    this.newTabContentInsets = null;
    this.rotatingTabs = null;
    this.oldContentOverflow = null;
    this.newContentOverflow = null;
    this.accordionPane.rotation = null;
};

ExtrasAccordionPane.Rotation.prototype.overflowRestore = function() {
    this.oldTab.contentDivElement.style.overflow = this.oldContentOverflow ? this.oldContentOverflow : ""; 
    this.newTab.contentDivElement.style.overflow = this.newContentOverflow ? this.newContentOverflow : "";
};

ExtrasAccordionPane.Rotation.prototype.overflowUpdate = function() {
    if (this.oldTab.contentDivElement.style.overflow) {
        this.oldContentOverflow = this.oldTab.contentDivElement.style.overflow; 
    }
    if (this.newTab.contentDivElement.style.overflow) {
        this.newContentOverflow = this.newTab.contentDivElement.style.overflow; 
    }

    this.oldTab.contentDivElement.style.overflow = "hidden";
    this.newTab.contentDivElement.style.overflow = "hidden";
};

/**
 * Static method invoked by Window.setTimeout which invokes appropriate
 * AccordionPane.setTimeout() instance method.
 *
 * @param accordionPaneId the id of the AccordionPane to step
 */
ExtrasAccordionPane.Rotation.animationStep = function(accordionPaneId) {
    var accordionPane = ExtrasAccordionPane.getComponent(accordionPaneId);
    if (accordionPane == null || accordionPane.rotation == null) {
        return;
    }
    accordionPane.rotation.animationStep();
};

/**
 * A data object which represents a single tab within an AccordionPane.
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
ExtrasAccordionPane.Tab = function(tabId, title, pane, rendered) { 
    this.tabId = tabId;
    this.title = title;
    this.pane = pane;
    this.rendered = rendered;
    this.tabDivElement = null;
    this.contentDivElement = null;
};

/**
 * Disposes of a Tab object, releasing resources.
 */
ExtrasAccordionPane.Tab.prototype.dispose = function() {
    this.tabDivElement = null;
    this.contentDivElement = null;
};

/**
 * Static object/namespace for AccordionPane MessageProcessor 
 * implementation.
 */
ExtrasAccordionPane.MessageProcessor = { };

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
    var rendered = addTabMessageElement.getAttribute("rendered") == "true";
    
    var tab = new ExtrasAccordionPane.Tab(tabId, title, pane, rendered);
    
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
    if (accordionPane) {
        accordionPane.dispose();
    }
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
    if (initMessageElement.getAttribute("tab-background-image")) {
        accordionPane.tabBackgroundImage = initMessageElement.getAttribute("tab-background-image");
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
    if (initMessageElement.getAttribute("tab-rollover-background-image")) {
        accordionPane.tabRolloverBackgroundImage = initMessageElement.getAttribute("tab-rollover-background-image");
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
        accordionPane.defaultContentInsets 
                = new EchoCoreProperties.Insets(initMessageElement.getAttribute("default-content-insets"));
    }
    if (initMessageElement.getAttribute("tab-insets")) {
        accordionPane.tabInsets = new EchoCoreProperties.Insets(initMessageElement.getAttribute("tab-insets"));
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
    accordionPane.redrawTabs();
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
    var tab = accordionPane.getTabById(tabId);
    if (tab) {
        accordionPane.removeTab(tab);
    }
};

/**
 * Processes a <code>set-active-tab</code> message to set the active tab.
 * 
 * @param setActiveTabMessageElement the <code>set-active-tab</code> element to process
 */
ExtrasAccordionPane.MessageProcessor.processSetActiveTab = function(setActiveTabMessageElement) {
    var elementId = setActiveTabMessageElement.getAttribute("eid");
    var tabId = setActiveTabMessageElement.getAttribute("active-tab");
    var accordionPane = ExtrasAccordionPane.getComponent(elementId);
    accordionPane.getTabById(tabId).rendered = true;
    accordionPane.selectTab(tabId, true);
};
