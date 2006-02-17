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

ExtrasMenu = function(elementId, containerElementId) {
    this.elementId = elementId;
    this.containerElementId = containerElementId;
    this.menuModel = null;
    
    this.maskDeployed = false;
    
    this.menuBarHeight = 24;
    this.menuBarBorderSize = 1;
    this.menuBarBorderStyle = "outset";
    this.menuBarBorderColor = "#cfcfcf";
    this.menuBarForeground = "#000000";
    this.menuBarBackground = "#cfcfcf";
    this.menuBarItemInsets = "3px 12px";
    
    this.menuBarRolloverBackground = "#00007f";
    this.menuBarRolloverForeground = "#ffffff";
    
    this.menuInsetsTop = 2;
    this.menuInsetsBottom = 2;
    this.menuInsetsLeft = 2;
    this.menuInsetsRight = 2;
    this.menuItemInsets = "1px 12px";
    this.menuBorderSize = 1;
    this.menuBorderStyle = "outset";
    this.menuBorderColor = "#cfcfcf";
    this.menuForeground = "#000000";
    this.menuBackground = "#cfcfcf";
    this.menuSelectionBackground = "#3f3f3f";
    this.menuSelectionForeground = "#ffffff";
    
    this.transparentImageSrc = null;
    
    /**
     * Array containing ids of open menus.
     */
    this.openMenuPath = new Array();
};

ExtrasMenu.nextId = 0;

/**
 * @param menuModel the menu model whose descendants should be closed;
 *        providing null will close all descendant menus; the specified
 *        menuModel will remain open
 */
ExtrasMenu.prototype.closeDescendantMenus = function(menuModel) {
    for (var i = this.openMenuPath.length - 1;  i >= 0; --i) {
        if (menuModel != null && this.openMenuPath[i].id == menuModel.id) {
            // Stop once specified menu is found.
            return;
        }
        this.renderMenuDispose(this.openMenuPath[i]);
        --this.openMenuPath.length
    }
};

/**
 * Renders the menu to the DOM, beneath its previously specified
 * container element.
 *
 * Note: When the menu is destroyed,  the dispose() method must be invoked
 * to release resources allocated by this method.
 */
ExtrasMenu.prototype.create = function() {
    this.renderMenuBarAdd();
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
};

ExtrasMenu.prototype.dispose = function() {
    this.renderMenuBarDispose();
};

ExtrasMenu.prototype.getElementModelId = function(menuItemElement) {
    if (!menuItemElement.id) {
        return this.getElementModelId(menuItemElement.parentNode);
    }
    if (menuItemElement.id.indexOf("_item_") == -1) {
        return null;
    }
    var lastUnderscorePosition = menuItemElement.id.lastIndexOf("_");
    return menuItemElement.id.substring(lastUnderscorePosition + 1);
};

ExtrasMenu.prototype.getItemElement = function(itemModel) {
    var itemElement = document.getElementById(this.elementId + "_bar_item_" + itemModel.id);
    if (!itemElement) {
        itemElement = document.getElementById(this.elementId + "_tr_item_" + itemModel.id);
    }
    return itemElement;
};

ExtrasMenu.prototype.getMenuBarBorder = function() {
    return this.menuBarBorderSize + "px " + this.menuBarBorderStyle + " " + this.menuBarBorderColor;
};

ExtrasMenu.prototype.getMenuBorder = function() {
    return this.menuBorderSize + "px " + this.menuBorderStyle + " " + this.menuBorderColor;
};

ExtrasMenu.prototype.getTotalMenuBarHeight = function() {
    return this.menuBarHeight + this.menuBarBorderSize * 2;
};

ExtrasMenu.prototype.isMenuBarItemElement = function(itemElement) {
    return itemElement.id.indexOf("_bar_item") != -1;
};

ExtrasMenu.prototype.notifyServer = function(menuModel) {
    var path = ExtrasMenu.getItemPath(menuModel);
    EchoClientMessage.setActionValue(this.elementId, "select", path.join());
    EchoServerTransaction.connect();
};

ExtrasMenu.prototype.openMenu = function(menuModel) {
    if (this.openMenuPath.length != 0) {
        var openMenu = this.openMenuPath[this.openMenuPath.length - 1];
        if (openMenu.id == menuModel.id) {
            // Do nothing: menu is already open.
            return;
        }
        if (openMenu.id != menuModel.parent.id) {
            this.closeDescendantMenus(menuModel);
        }
    }
    
    this.openMenuPath.push(menuModel);

    var itemElement = this.getItemElement(menuModel);
    var bounds = new ExtrasUtil.Bounds(itemElement);
    if (this.isMenuBarItemElement(itemElement)) {
        var offsetTop = (this.menuBarBorderSize * 2) + this.menuBarHeight + bounds.top;
        this.renderMenuAdd(menuModel, bounds.left, offsetTop);
    } else {
        var menuDivElement = itemElement.parentNode.parentNode.parentNode;
        var offsetLeft = bounds.left + menuDivElement.clientWidth;
        this.renderMenuAdd(menuModel, offsetLeft, bounds.top);
    }
};

ExtrasMenu.prototype.processCancel = function() {
    this.renderMaskRemove();
    this.closeDescendantMenus(null);
};

ExtrasMenu.prototype.processItemActivate = function(itemModel) {
    if (itemModel instanceof ExtrasMenu.OptionModel) {
        this.renderMaskRemove();
        this.closeDescendantMenus(null);
        this.notifyServer(itemModel);
    } else if (itemModel instanceof ExtrasMenu.MenuModel) {
        this.openMenu(itemModel);
    }
};

ExtrasMenu.prototype.processSelection = function(menuItemElement) {
    var modelId = this.getElementModelId(menuItemElement);
    var menuItemModel = this.menuModel.getItem(modelId);
    this.processItemActivate(menuItemModel);
};

ExtrasMenu.prototype.renderMaskAdd = function() {
    if (this.maskDeployed) {
        return;
    }
    this.maskDeployed = true;
    
    var menuDivElement = document.getElementById(this.elementId);
    var bounds = new ExtrasUtil.Bounds(menuDivElement);
    var bodyElement = document.getElementsByTagName("body")[0];    
    bounds.height = this.getTotalMenuBarHeight();
    
    var topBlockDivElement = document.createElement("div");
    topBlockDivElement.id = this.elementId + "_block_top";
    topBlockDivElement.style.position = "absolute";
    topBlockDivElement.style.top = "0px";
    topBlockDivElement.style.left = "0px";
    topBlockDivElement.style.width = "100%";
    topBlockDivElement.style.height = bounds.top + "px";
    if (this.transparentImageSrc) {
        topBlockDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    }
    bodyElement.appendChild(topBlockDivElement);
    EchoEventProcessor.addHandler(topBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");

    var bottomBlockDivElement = document.createElement("div");
    bottomBlockDivElement.id = this.elementId + "_block_bottom";
    bottomBlockDivElement.style.position = "absolute";
    bottomBlockDivElement.style.height = (document.documentElement.clientHeight - (bounds.top + bounds.height)) + "px";
    bottomBlockDivElement.style.left = "0px";
    bottomBlockDivElement.style.width = "100%";
    bottomBlockDivElement.style.bottom = "0px";
    if (this.transparentImageSrc) {
        bottomBlockDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    }
    bodyElement.appendChild(bottomBlockDivElement);
    EchoEventProcessor.addHandler(bottomBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");

    var leftBlockDivElement = document.createElement("div");
    leftBlockDivElement.id = this.elementId + "_block_left";
    leftBlockDivElement.style.position = "absolute";
    leftBlockDivElement.style.top = bounds.top + "px";
    leftBlockDivElement.style.left = "0px";
    leftBlockDivElement.style.width = bounds.left + "px";
    leftBlockDivElement.style.height = bounds.height + "px";
    if (this.transparentImageSrc) {
        leftBlockDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    }
    bodyElement.appendChild(leftBlockDivElement);
    EchoEventProcessor.addHandler(leftBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");

    var rightBlockDivElement = document.createElement("div");
    rightBlockDivElement.id = this.elementId + "_block_right";
    rightBlockDivElement.style.position = "absolute";
    rightBlockDivElement.style.top = bounds.top + "px";
    rightBlockDivElement.style.right = "0px";
    rightBlockDivElement.style.height = bounds.height + "px";
    rightBlockDivElement.style.width = (document.documentElement.clientWidth - (bounds.left + bounds.width)) + "px";
    if (this.transparentImageSrc) {
        rightBlockDivElement.style.backgroundImage = "url(" + this.transparentImageSrc + ")";
    }
    bodyElement.appendChild(rightBlockDivElement);
    EchoEventProcessor.addHandler(rightBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");
};

ExtrasMenu.prototype.renderMaskRemove = function() {
    if (!this.maskDeployed) {
        return;
    }
    this.maskDeployed = false;

    var bodyElement = document.getElementsByTagName("body")[0];    
    var topBlockDivElement = document.getElementById(this.elementId + "_block_top");
    if (topBlockDivElement) {
        EchoEventProcessor.removeHandler(topBlockDivElement.id, "click");
        bodyElement.removeChild(topBlockDivElement);
    }
    var bottomBlockDivElement = document.getElementById(this.elementId + "_block_bottom");
    if (bottomBlockDivElement) {
        EchoEventProcessor.removeHandler(bottomBlockDivElement.id, "click");
        bodyElement.removeChild(bottomBlockDivElement);
    }
    var leftBlockDivElement = document.getElementById(this.elementId + "_block_left");
    if (leftBlockDivElement) {
        EchoEventProcessor.removeHandler(leftBlockDivElement.id, "click");
        bodyElement.removeChild(leftBlockDivElement);
    }
    var rightBlockDivElement = document.getElementById(this.elementId + "_block_right");
    if (rightBlockDivElement) {
        EchoEventProcessor.removeHandler(rightBlockDivElement.id, "click");
        bodyElement.removeChild(rightBlockDivElement);
    }
}

ExtrasMenu.prototype.renderMenuAdd = function(menuModel, xPosition, yPosition) {
    var menuDivElement = document.createElement("div");
    menuDivElement.id = this.elementId + "_menu_" + menuModel.id;
    menuDivElement.style.padding = this.menuInsetsTop + "px " + this.menuInsetsTop + "px " 
            + this.menuInsetsTop + "px " + this.menuInsetsTop + "px";
    menuDivElement.style.border = this.getMenuBorder();
    menuDivElement.style.backgroundColor = this.menuBackground;
    menuDivElement.style.color = this.menuForeground;
    menuDivElement.style.position = "absolute";
    menuDivElement.style.top = yPosition + "px";
    menuDivElement.style.left = xPosition + "px";
    
    var menuTableElement = document.createElement("table");
    menuTableElement.style.borderCollapse = "collapse";
    menuDivElement.appendChild(menuTableElement);
    
    var menuTbodyElement = document.createElement("tbody");
    menuTableElement.appendChild(menuTbodyElement);
    
    for (var i = 0; i < menuModel.items.length; ++i) {
        if (menuModel.items[i] instanceof ExtrasMenu.OptionModel
                || menuModel.items[i] instanceof ExtrasMenu.MenuModel) {
            var menuItemTrElement = document.createElement("tr");
            menuItemTrElement.id = this.elementId + "_tr_item_" + menuModel.items[i].id;
            menuItemTrElement.style.cursor = "pointer";
            menuTbodyElement.appendChild(menuItemTrElement);
            
            var menuItemContentTdElement = document.createElement("td");
            menuItemContentTdElement.style.padding = this.menuItemInsets;
            menuItemContentTdElement.appendChild(document.createTextNode(menuModel.items[i].text));
            menuItemTrElement.appendChild(menuItemContentTdElement);
            
            if (menuModel.items[i] instanceof ExtrasMenu.MenuModel) {
                // Submenus have adjacent column containing 'expand' icons.
                var menuItemArrowTdElement = document.createElement("td");
                menuItemArrowTdElement.appendChild(document.createTextNode(">"));
                menuItemTrElement.appendChild(menuItemArrowTdElement);
            } else {
                // Menu items fill both columns.
                menuItemContentTdElement.colSpan = 2;
            }
        } else if (menuModel.items[i] instanceof ExtrasMenu.SeparatorModel) {
            var menuItemTrElement = document.createElement("tr");
            menuTbodyElement.appendChild(menuItemTrElement);
            var menuItemContentTdElement = document.createElement("td");
            menuItemContentTdElement.colSpan = 2;
            menuItemContentTdElement.style.padding = "0px";
            menuItemContentTdElement.appendChild(document.createElement("hr"));
            menuItemTrElement.appendChild(menuItemContentTdElement);
        }
    }
    
    bodyElement = document.getElementsByTagName("body")[0];    
    bodyElement.appendChild(menuDivElement);

    EchoEventProcessor.addHandler(menuDivElement.id, "click", "ExtrasMenu.processMenuItemClick");
    EchoEventProcessor.addHandler(menuDivElement.id, "mouseover", "ExtrasMenu.processMenuBarMouseOver");
    EchoEventProcessor.addHandler(menuDivElement.id, "mouseout", "ExtrasMenu.processMenuBarMouseOut");
};

ExtrasMenu.prototype.renderMenuDispose = function(menuModel) {
    var menuDivElement = document.getElementById(this.elementId + "_menu_" + menuModel.id);

    EchoEventProcessor.removeHandler(menuDivElement.id, "click");
    EchoEventProcessor.removeHandler(menuDivElement.id, "mouseover");
    EchoEventProcessor.removeHandler(menuDivElement.id, "mouseout");
    
    if (menuDivElement) {
        menuDivElement.parentNode.removeChild(menuDivElement);
    }
};

ExtrasMenu.prototype.renderMenuBarAdd = function() {
    var containerElement = document.getElementById(this.containerElementId);
    var menuBarDivElement = document.createElement("div");
    menuBarDivElement.id = this.elementId;
    menuBarDivElement.style.position = "absolute";
    menuBarDivElement.style.left = "0px";
    menuBarDivElement.style.right = "0px";
    menuBarDivElement.style.height = this.menuBarHeight + "px";
    
    menuBarDivElement.style.backgroundColor = this.menuBarBackground;
    menuBarDivElement.style.borderTop = this.getMenuBarBorder();
    menuBarDivElement.style.borderBottom = this.getMenuBarBorder();
    
    var menuBarTableElement = document.createElement("table");
    menuBarTableElement.style.borderCollapse = "collapse";
    menuBarDivElement.appendChild(menuBarTableElement);
    
    var menuBarTbodyElement = document.createElement("tbody");
    menuBarTableElement.appendChild(menuBarTbodyElement);
    
    var menuBarTrElement = document.createElement("tr");
    menuBarTbodyElement.appendChild(menuBarTrElement);
    
    if (this.menuModel != null) {
        for (var i = 0; i < this.menuModel.items.length; ++i) {
            if (this.menuModel.items[i] instanceof ExtrasMenu.OptionModel
                    || this.menuModel.items[i] instanceof ExtrasMenu.MenuModel) {
                var menuBarItemTdElement = document.createElement("td");
                menuBarItemTdElement.style.padding = "0px";
                menuBarTrElement.appendChild(menuBarItemTdElement);
                var menuBarItemDivElement = document.createElement("div");
                menuBarItemDivElement.id = this.elementId + "_bar_item_" + this.menuModel.items[i].id;
                menuBarItemDivElement.style.cursor = "pointer";
                menuBarItemDivElement.style.padding = this.menuBarItemInsets;
                menuBarItemTdElement.appendChild(menuBarItemDivElement);
                var textNode = document.createTextNode(this.menuModel.items[i].text);
                menuBarItemDivElement.appendChild(textNode);
            }
        }
    }
    
    containerElement.appendChild(menuBarDivElement);

    EchoVirtualPosition.register(menuBarDivElement.id);

    EchoEventProcessor.addHandler(this.elementId, "click", "ExtrasMenu.processMenuBarClick");
    EchoEventProcessor.addHandler(this.elementId, "mouseover", "ExtrasMenu.processMenuBarMouseOver");
    EchoEventProcessor.addHandler(this.elementId, "mouseout", "ExtrasMenu.processMenuBarMouseOut");
};

ExtrasMenu.prototype.renderMenuBarDispose = function() {
    EchoEventProcessor.removeHandler(this.elementId, "click");
    EchoEventProcessor.removeHandler(this.elementId, "mouseover");
    EchoEventProcessor.removeHandler(this.elementId, "mouseout");
};

ExtrasMenu.prototype.setHighlight = function(itemModel, state) {
    var itemElement = this.getItemElement(itemModel);
    if (!itemElement) {
        return;
    }
    if (state) {
        itemElement.style.backgroundColor = this.menuSelectionBackground;
        itemElement.style.color = this.menuSelectionForeground;
    } else {
        itemElement.style.backgroundColor = "";
        itemElement.style.color = "";
    }
};

ExtrasMenu.prototype.setModel = function(menuModel) {
    this.menuModel = menuModel;
};

/**
 * Returns the Menu data object instance based on the root element id
 * of the Menu.
 *
 * @param componentId the root element id of the Menu
 * @return the relevant Menu instance
 */
ExtrasMenu.getComponent = function(componentId) {
    return EchoDomPropertyStore.getPropertyValue(componentId, "component");
};

ExtrasMenu.getItemPath = function(itemModel) {
    var path = new Array();
    while (itemModel.parent != null) {
        path.unshift(itemModel.parent.indexOfItem(itemModel));
        itemModel = itemModel.parent;
    }
    return path;
};

ExtrasMenu.processMenuBarClick = function(echoEvent) {
    EchoDomUtil.preventEventDefault(echoEvent);
    var menuItemElement = echoEvent.target;
    var menuId = EchoDomUtil.getComponentId(menuItemElement.id);
    var menu = ExtrasMenu.getComponent(menuId);
    menu.renderMaskAdd();
    menu.processSelection(menuItemElement);
};

ExtrasMenu.processMenuBarMouseOut = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var menu = ExtrasMenu.getComponent(menuId);
    var modelId = menu.getElementModelId(menuItemElement);
    var itemModel = menu.menuModel.getItem(modelId);
    if (itemModel) {
        menu.setHighlight(itemModel, false);
    }
};

ExtrasMenu.processMenuBarMouseOver = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var menu = ExtrasMenu.getComponent(menuId);
    var modelId = menu.getElementModelId(menuItemElement);
    var itemModel = menu.menuModel.getItem(modelId);
    if (itemModel) {
        menu.setHighlight(itemModel, true);
    }
};

ExtrasMenu.processMenuItemClick = function(echoEvent) {
    var trElement = echoEvent.target.parentNode;
    if (!trElement || trElement.id.indexOf("_tr_item_") == -1) {
        return;
    }
    var menuId = EchoDomUtil.getComponentId(trElement.id);
    var menu = ExtrasMenu.getComponent(menuId);
    menu.processSelection(trElement);
};

ExtrasMenu.processMenuCancel = function(echoEvent) {
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var menu = ExtrasMenu.getComponent(menuId);
    menu.processCancel();
};

/**
 * Represenation of a menu that may contain submenus, options, and separators.
 * Creates a new MenuModel.
 *
 * @param text the title of the menu model which will appear in its parent menu
 *        when this menu is used as a submenu
 * @param icon the icon of the menu model which will appear in its parent menu
 *        when this menu is used as a submenu
 */
ExtrasMenu.MenuModel = function(text, icon) {
    this.id = ExtrasMenu.nextId++;
    this.parent = null;
    this.text = text;
    this.icon = icon;
    this.items = new Array();
};

/**
 * Adds an item to the MenuModel.
 *
 * @param item the item (must be a MenuModel, OptionModel, or SeparatorModel.
 */
ExtrasMenu.MenuModel.prototype.addItem = function(item) {
    this.items.push(item);
    item.parent = this;
};

ExtrasMenu.MenuModel.prototype.getItem = function(id) {
    var i;
    for (i = 0; i < this.items.length; ++i) {
        if (this.items[i].id == id) {
            return this.items[i];
        }
    }
    for (i = 0; i < this.items.length; ++i) {
        if (this.items[i] instanceof ExtrasMenu.MenuModel) {
            var itemModel = this.items[i].getItem(id);
            if (itemModel) {
                return itemModel;
            }
        }
    }
    return null;
};

ExtrasMenu.MenuModel.prototype.indexOfItem = function(item) {
    for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i] == item) {
            return i;
        }
    }
    return -1;
};

/**
 * toString() implementation.
 */
ExtrasMenu.MenuModel.prototype.toString = function() {
    return "MenuModel \"" + this.text + "\" Items:" + this.items.length;
};

ExtrasMenu.OptionModel = function(text, icon) {
    this.id = ExtrasMenu.nextId++;
    this.parent = null;
    this.text = text;
    this.icon = icon;
};

/**
 * toString() implementation.
 */
ExtrasMenu.OptionModel.prototype.toString = function() {
    return "OptionModel \"" + this.text + "\"";
};

/**
 * A representation of a menu separator.
 */
ExtrasMenu.SeparatorModel = function() {
    this.parent = null;
};

/**
 * Static object/namespace for PullDownMenu MessageProcessor 
 * implementation.
 */
ExtrasMenu.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasMenu.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasMenu.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasMenu.MessageProcessor.processInit(messagePartElement.childNodes[i]);
                break;
            }
        }
    }
};

/**
 * Processes an <code>dispose</code> message to dispose the state of a 
 * PullDownMenu component that is being removed.
 *
 * @param disposeMessageElement the <code>dispose</code> element to process
 */
ExtrasMenu.MessageProcessor.processDispose = function(disposeMessageElement) {
    var menuId = disposeMessageElement.getAttribute("eid");
    var menu = ExtrasMenu.getComponent(menuId);
    if (menu) {
        menu.dispose();
    }
};

/**
 * Processes an <code>init</code> message to initialize the state of a 
 * PullDownMenu component that is being added.
 *
 * @param initMessageElement the <code>init</code> element to process
 */
ExtrasMenu.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var menu = new ExtrasMenu(elementId, containerElementId);
    menu.transparentImageSrc = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ExtrasUtil.Transparent";
    
    var menuBarModel;
    
    for (var i = 0; i < initMessageElement.childNodes.length; ++i) {
        if (initMessageElement.childNodes[i].nodeType == 1 && initMessageElement.childNodes[i].nodeName == "menu") {
            menuBarModel = ExtrasMenu.MessageProcessor.processMenuModel(initMessageElement.childNodes[i]);
            break;
        }
    }

    menu.setModel(menuBarModel);

    menu.create();
};

/**
 * Translates a MenuModel represented as an XML 'menu' element into a 
 * ExtrasMenu.MenuModel instance.
 *
 * @param menuElement the 'menu' element to translate
 * @return the created ExtrasMenu.MenuModel instance
 */
ExtrasMenu.MessageProcessor.processMenuModel = function(menuElement) {
    var menuModel = new ExtrasMenu.MenuModel(menuElement.getAttribute("text"));
    for (var i = 0; i < menuElement.childNodes.length; ++i) {
        var node = menuElement.childNodes[i];
        if (node.nodeType == 1) { // Element
            if (node.nodeName == "option") {
                var optionModel = new ExtrasMenu.OptionModel(node.getAttribute("text"));
                menuModel.addItem(optionModel);
            } else if (node.nodeName == "menu") {
                var childMenuModel = ExtrasMenu.MessageProcessor.processMenuModel(node);
                menuModel.addItem(childMenuModel);
            } else if (node.nodeName == "separator") {
                var separatorModel = new ExtrasMenu.SeparatorModel();
                menuModel.addItem(separatorModel);
            }
        }
    }
    return menuModel;
};
