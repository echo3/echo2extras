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
    this.enabled = true;
    this.menuModel = null;
    
    this.maskDeployed = false;
    
    this.borderSize = 1;
    this.borderStyle = "outset";
    this.borderColor = "#cfcfcf";
    
    this.foreground = "#000000";
    this.background = "#cfcfcf";
    this.backgroundImage = null;
    
    this.disabledBackground = null;
    this.disabledBackgroundImage = null;
    this.disabledForeground = "#7f7f7f";
    this.menuInsetsTop = 2;
    this.menuInsetsBottom = 2;
    this.menuInsetsLeft = 2;
    this.menuInsetsRight = 2;
    this.menuItemInsetsTop = 1;
    this.menuItemInsetsLeft = 12;
    this.menuItemInsetsRight = 12;
    this.menuItemInsetsBottom = 1;
    this.menuItemIconTextMargin = 5;
    this.menuBorder = null;
    this.menuForeground = null;
    this.menuBackground = null;
    this.menuBackgroundImage = null;
    this.selectionBackground = "#3f3f3f";
    this.selectionBackgroundImage = null;
    this.selectionForeground = "#ffffff";
    
    this.transparentImage = null;
    this.submenuImage = null;
    this.toggleOffIcon = "ToggleOff.gif";
    this.toggleOnIcon = "ToggleOn.gif";
    this.radioOffIcon = "RadioOff.gif";
    this.radioOnIcon = "RadioOn.gif";
    
    /**
     * Array containing ids of open menus.
     */
    this.openMenuPath = new Array();
};

ExtrasMenu.MAX_Z_INDEX = 65535;

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
    EchoDomPropertyStore.setPropertyValue(this.elementId, "component", this);
};

ExtrasMenu.prototype.getBorder = function() {
    return this.borderSize + "px " + this.borderStyle + " " + this.borderColor;
};

ExtrasMenu.prototype.getMenuBorder = function() {
    return (this.menuBorderSize == undefined ? this.borderSize : this.menuBorderSize) + "px "
            + (this.menuBorderStyle == undefined ? this.borderStyle : this.menuBorderStyle) + " "
            + (this.menuBorderColor == undefined ? this.borderColor : this.menuBorderColor);
};

ExtrasMenu.prototype.notifyServer = function(menuModel) {
    var path = ExtrasMenu.getItemPath(menuModel);
    EchoClientMessage.setActionValue(this.elementId, "select", path.join("."));
    EchoServerTransaction.connect();
};

/**
 * @return true if the menu should be opened, false it if is already opened
 */
ExtrasMenu.prototype.prepareOpenMenu = function(menuModel) {
    if (this.openMenuPath.length != 0) {
        var openMenu = this.openMenuPath[this.openMenuPath.length - 1];
        if (openMenu.id == menuModel.id) {
            // Do nothing: menu is already open.
            return false;
        }
        if (openMenu.id != menuModel.parent.id) {
            this.closeDescendantMenus(menuModel.parent);
        }
    }
    
    this.openMenuPath.push(menuModel);
    return true;
    
};

ExtrasMenu.prototype.drawSubMenu = function(menuModel) {
    var itemElement = this.getItemElement(menuModel);
    var bounds = new EchoCssUtil.Bounds(itemElement);
    var menuDivElement = itemElement.parentNode.parentNode.parentNode;
    var borderSize = parseInt(this.menuBorderSize ? this.menuBorderSize : this.borderSize);
    var offsetLeft = bounds.left + menuDivElement.clientWidth + borderSize * 2 - 2;
    this.renderMenuAdd(menuModel, offsetLeft, bounds.top);
};

ExtrasMenu.prototype.processCancel = function() {
    this.renderMaskRemove();
    this.closeDescendantMenus(null);
};

ExtrasMenu.prototype.processItemActivate = function(itemModel) {
    if (!itemModel.enabled) {
        return;
    }
    if (itemModel instanceof ExtrasMenu.OptionModel) {
        this.renderMaskRemove();
        this.closeDescendantMenus(null);
        this.doAction(itemModel);
    } else if (itemModel instanceof ExtrasMenu.MenuModel) {
        this.openMenu(itemModel);
    }
};

ExtrasMenu.prototype.processSelection = function(modelId) {
    var menuItemModel = this.menuModel.getItem(modelId);
    this.processItemActivate(menuItemModel);
};

ExtrasMenu.prototype.renderMenuAdd = function(menuModel, xPosition, yPosition) {
    var menuDivElement = document.createElement("div");
    menuDivElement.id = this.elementId + "_menu_" + menuModel.id;
    menuDivElement.style.padding = this.menuInsetsTop + "px " + this.menuInsetsTop + "px " 
            + this.menuInsetsTop + "px " + this.menuInsetsTop + "px";
    menuDivElement.style.border = this.getMenuBorder();
    menuDivElement.style.backgroundColor = this.menuBackground == null ? this.background : this.menuBackground;
    menuDivElement.style.color = this.menuForeground == null ? this.foreground : this.menuForeground;
    menuDivElement.style.zIndex = ExtrasMenu.MAX_Z_INDEX;
    if (this.menuBackgroundImage != null || (this.menuBackground == null && this.backgroundImage != null)) {
        // Apply menu background image if it is set, or apply default background 
        // image if it is set and the menu background is NOT set.
        EchoCssUtil.applyStyle(menuDivElement, 
              this.menuBackgroundImage == null ? this.backgroundImage : this.menuBackgroundImage);
    }
    menuDivElement.style.position = "absolute";
    menuDivElement.style.top = yPosition + "px";
    menuDivElement.style.left = xPosition + "px";
    
    var menuTableElement = document.createElement("table");
    menuTableElement.style.borderCollapse = "collapse";
    menuDivElement.appendChild(menuTableElement);
    
    var menuTbodyElement = document.createElement("tbody");
    menuTableElement.appendChild(menuTbodyElement);

    // Determine if any icons are present.
    var hasIcons = false;
    for (var i = 0; i < menuModel.items.length; ++i) {
        if (menuModel.items[i].icon || menuModel.items[i] instanceof ExtrasMenu.ToggleOptionModel) {
            hasIcons = true;
            break;
        }
    }
    var textPadding, iconPadding;
    if (hasIcons) {
        iconPadding = "0 0 0 " + this.menuItemInsetsLeft + "px";
        textPadding = this.menuItemInsetsTop + "px " + this.menuItemInsetsRight + "px " 
                + this.menuItemInsetsBottom + "px " + this.menuItemIconTextMargin + "px";
    } else {
        textPadding = this.menuItemInsetsTop + "px " + this.menuItemInsetsRight + "px " 
                + this.menuItemInsetsBottom + "px " + this.menuItemInsetsLeft + "px";
    }
    
    for (var i = 0; i < menuModel.items.length; ++i) {
        if (menuModel.items[i] instanceof ExtrasMenu.OptionModel
                || menuModel.items[i] instanceof ExtrasMenu.MenuModel) {
            var menuItemTrElement = document.createElement("tr");
            menuItemTrElement.id = this.elementId + "_tr_item_" + menuModel.items[i].id;
            menuItemTrElement.style.cursor = "pointer";
            menuTbodyElement.appendChild(menuItemTrElement);

            if (hasIcons) {
                var menuItemIconTdElement = document.createElement("td");
                menuItemIconTdElement.style.padding = iconPadding;
                if (menuModel.items[i] instanceof ExtrasMenu.ToggleOptionModel) {
                    var iconSrc;
                    if (menuModel.items[i] instanceof ExtrasMenu.RadioOptionModel) {
                        iconSrc = menuModel.items[i].selected ? this.radioOnIcon : this.radioOffIcon;
                    } else {
                        iconSrc = menuModel.items[i].selected ? this.toggleOnIcon : this.toggleOffIcon;
                    }
                    var imgElement = document.createElement("img");
                    imgElement.setAttribute("src", iconSrc);
                    imgElement.setAttribute("alt", "");
                    menuItemIconTdElement.appendChild(imgElement);
                } else if (menuModel.items[i].icon) {
                    var imgElement = document.createElement("img");
                    imgElement.setAttribute("src", menuModel.items[i].icon);
                    imgElement.setAttribute("alt", "");
                    menuItemIconTdElement.appendChild(imgElement);
                }
                menuItemTrElement.appendChild(menuItemIconTdElement);
            }
            
            var menuItemContentTdElement = document.createElement("td");
            menuItemContentTdElement.style.padding = textPadding;
            if (!menuModel.items[i].enabled) {
                menuItemContentTdElement.style.color = this.disabledForeground;
            }
            menuItemContentTdElement.appendChild(document.createTextNode(menuModel.items[i].text));
            menuItemTrElement.appendChild(menuItemContentTdElement);
            
            if (menuModel.items[i] instanceof ExtrasMenu.MenuModel) {
                // Submenus have adjacent column containing 'expand' icons.
                var menuItemArrowTdElement = document.createElement("td");
                if (this.submenuImage) {
                    var imgElement = document.createElement("img");
                    imgElement.setAttribute("src", this.submenuImage);
                    imgElement.setAttribute("alt", "");
                    menuItemArrowTdElement.appendChild(imgElement);
                } else {
                    menuItemArrowTdElement.appendChild(document.createTextNode(">"));
                }
                menuItemTrElement.appendChild(menuItemArrowTdElement);
            } else {
                // Menu items fill both columns.
                menuItemContentTdElement.colSpan = 2;
            }
        } else if (menuModel.items[i] instanceof ExtrasMenu.SeparatorModel) {
            var menuItemTrElement = document.createElement("tr");
            menuTbodyElement.appendChild(menuItemTrElement);
            var menuItemContentTdElement = document.createElement("td");
            menuItemContentTdElement.colSpan = hasIcons ? 3 : 2;
            menuItemContentTdElement.style.padding = "3px 0px";
            var hrDivElement = document.createElement("div");
            hrDivElement.style.borderTopWidth = "1px";
            hrDivElement.style.borderTopStyle = "solid";
            hrDivElement.style.borderTopColor = "#a7a7a7";
            hrDivElement.style.height = "0px";
            hrDivElement.style.fontSize = "1px";
            hrDivElement.style.lineHeight = "0px";
            menuItemContentTdElement.appendChild(hrDivElement);
            menuItemTrElement.appendChild(menuItemContentTdElement);
        }
    }
    
    bodyElement = document.getElementsByTagName("body")[0];    
    bodyElement.appendChild(menuDivElement);

    EchoEventProcessor.addHandler(menuDivElement, "click", "ExtrasMenu.processMenuItemClick");
    EchoEventProcessor.addHandler(menuDivElement, "mouseover", "ExtrasMenu.processMenuItemMouseOver");
    EchoEventProcessor.addHandler(menuDivElement, "mouseout", "ExtrasMenu.processMenuItemMouseOut");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.addEventListener(menuDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.addEventListener(menuDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }
    
    return menuDivElement;
};

ExtrasMenu.prototype.renderMenuDispose = function(menuModel) {
    var menuDivElement = document.getElementById(this.elementId + "_menu_" + menuModel.id);

    EchoEventProcessor.removeHandler(menuDivElement, "click");
    EchoEventProcessor.removeHandler(menuDivElement, "mouseover");
    EchoEventProcessor.removeHandler(menuDivElement, "mouseout");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.removeEventListener(menuDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.removeEventListener(menuDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }
    
    if (menuDivElement) {
        menuDivElement.parentNode.removeChild(menuDivElement);
    }
};

ExtrasMenu.prototype.setHighlight = function(itemModel, state) {
    if (!itemModel.enabled) {
        return;
    }
    var itemElement = this.getItemElement(itemModel);
    if (!itemElement) {
        return;
    }
    if (state) {
        if (this.selectionBackgroundImage != null) {
            EchoCssUtil.applyStyle(itemElement, this.selectionBackgroundImage);
        }
        itemElement.style.backgroundColor = this.selectionBackground;
        itemElement.style.color = this.selectionForeground;
    } else {
        itemElement.style.backgroundImage = "";
        itemElement.style.backgroundColor = "";
        itemElement.style.color = "";
    }
};

ExtrasMenu.prototype.setModel = function(menuModel) {
    this.menuModel = menuModel;
};

/**
 * Prevents a mousedown (DOM) or selectstart (IE) event from performing
 * its default action (which may cause a selection).
 * 
 * @param e the event
 */
ExtrasMenu.absorbMouseSelection = function(e) {
    EchoDomUtil.preventEventDefault(e);
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

ExtrasMenu.getElementModelId = function(menuItemElement) {
    if (!menuItemElement.id) {
        return ExtrasMenu.getElementModelId(menuItemElement.parentNode);
    }

    if (menuItemElement.id.indexOf("_item_") == -1) {
        return null;
    }
    var lastUnderscorePosition = menuItemElement.id.lastIndexOf("_");
    return menuItemElement.id.substring(lastUnderscorePosition + 1);
};

ExtrasMenu.getItemModel = function(menuModel, path) {
    var pathItems = path.split(".");
    for (var i = 0; i < pathItems.length; ++i) {
        menuModel = menuModel.items[parseInt(pathItems[i])];
    }
    return menuModel;
};

ExtrasMenu.getItemPath = function(itemModel) {
    var path = new Array();
    while (itemModel.parent != null) {
        path.unshift(itemModel.parent.indexOfItem(itemModel));
        itemModel = itemModel.parent;
    }
    return path;
};

ExtrasMenu.processMenuItemMouseOut = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var modelId = ExtrasMenu.getElementModelId(menuItemElement);
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    if (menuId == null) {
        return;
    }
    var menu = ExtrasMenu.getComponent(menuId);

    if (!menu.enabled || !EchoClientEngine.verifyInput(menuId, false)) {
        return;
    }

    var itemModel = menu.menuModel.getItem(modelId);
    if (itemModel) {
        menu.setHighlight(itemModel, false);
    }
};

ExtrasMenu.processMenuItemMouseOver = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var modelId = ExtrasMenu.getElementModelId(menuItemElement);
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    if (menuId == null) {
        return;
    }
    var menu = ExtrasMenu.getComponent(menuId);

    if (!menu.enabled || !EchoClientEngine.verifyInput(menuId, false)) {
        return;
    }
    
    var itemModel = menu.menuModel.getItem(modelId);
    if (itemModel) {
        menu.setHighlight(itemModel, true);
    }
};

ExtrasMenu.processMenuItemClick = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var modelId = ExtrasMenu.getElementModelId(menuItemElement);
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    if (menuId == null) {
        return;
    }
    var menu = ExtrasMenu.getComponent(menuId);
    
    if (!menu.enabled || !EchoClientEngine.verifyInput(menuId, false)) {
        return;
    }
    
    menu.processSelection(modelId);
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
    this.enabled = true;
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
    this.enabled = true;
};

/**
 * toString() implementation.
 */
ExtrasMenu.OptionModel.prototype.toString = function() {
    return "OptionModel \"" + this.text + "\"";
};

ExtrasMenu.ToggleOptionModel = function(text, selected) {
    this.id = ExtrasMenu.nextId++;
    this.text = text;
    this.selected = selected;
};

ExtrasMenu.ToggleOptionModel.prototype = new ExtrasMenu.OptionModel(null, null);

ExtrasMenu.RadioOptionModel = function(text, selected) {
    this.id = ExtrasMenu.nextId++;
    this.text = text;
    this.selected = selected;
};

ExtrasMenu.RadioOptionModel.prototype = new ExtrasMenu.ToggleOptionModel(null, null);

/**
 * A representation of a menu separator.
 */
ExtrasMenu.SeparatorModel = function() {
    this.parent = null;
};

ExtrasMenu.MessageParser = function() { };

/**
 * Parses a MenuModel represented as an XML 'menu' element into a 
 * ExtrasMenu.MenuModel instance.
 *
 * @param menuElement the 'menu' element to translate
 * @return the created ExtrasMenu.MenuModel instance
 */
ExtrasMenu.MessageParser.parseMenuModel = function(menuElement) {
    var menuModel = new ExtrasMenu.MenuModel(menuElement.getAttribute("text"), menuElement.getAttribute("icon"));
    menuModel.enabled = menuElement.getAttribute("enabled") != "false"; 

    for (var i = 0; i < menuElement.childNodes.length; ++i) {
        var node = menuElement.childNodes[i];
        if (node.nodeType == 1) { // Element
            if (node.nodeName == "option") {
                var optionModel;
                var text = node.getAttribute("text");
                var selected = node.getAttribute("selected") == "true"; 
                switch (node.getAttribute("type")) {
                case "radio":
                    optionModel = new ExtrasMenu.RadioOptionModel(text, selected);
                    break;
                case "toggle":
                    optionModel = new ExtrasMenu.ToggleOptionModel(text, selected);
                    break;
                default:
                    var icon = node.getAttribute("icon");
                    optionModel = new ExtrasMenu.OptionModel(text, icon);
                }
                optionModel.enabled = node.getAttribute("enabled") != "false"; 
                menuModel.addItem(optionModel);
            } else if (node.nodeName == "menu") {
                var childMenuModel = ExtrasMenu.MessageParser.parseMenuModel(node);
                menuModel.addItem(childMenuModel);
            } else if (node.nodeName == "separator") {
                var separatorModel = new ExtrasMenu.SeparatorModel();
                menuModel.addItem(separatorModel);
            }
        }
    }
    return menuModel;
};

ExtrasDropDownMenu = function(elementId, containerElementId) {
    ExtrasMenu.call(this, elementId, containerElementId);
    
    this.selection = false;
};

ExtrasDropDownMenu.prototype = new ExtrasMenu;

ExtrasDropDownMenu.prototype.create = function() {
    this.renderDropDownAdd();
    ExtrasMenu.prototype.create.call(this);
    if (this.selectedItem) {
        this.setSelection(this.selectedItem);
    }
};

ExtrasDropDownMenu.prototype.dispose = function() {
    this.renderDropDownDispose();
};

ExtrasDropDownMenu.prototype.doAction = function(menuModel) {
    if (this.selection) {
        this.setSelection(menuModel);
    }
    
    if (!this.selection || this.immediateServerNotification) {
        this.notifyServer(menuModel);
    }
};

ExtrasDropDownMenu.prototype.drawDropDownMenu = function(menuModel) {
    var itemElement = this.getItemElement(menuModel);
    var bounds = new EchoCssUtil.Bounds(itemElement);
    this.renderMenuAdd(menuModel, bounds.left, bounds.top + bounds.height);
};

ExtrasDropDownMenu.prototype.getItemElement = function(itemModel) {
    itemElement = document.getElementById(this.elementId + "_tr_item_" + itemModel.id);
    if (itemElement == null) {
        itemElement = document.getElementById(this.elementId);
    }
    return itemElement;
};

ExtrasDropDownMenu.prototype.isDropDownElement = function(itemElement) {
    return itemElement.id == this.elementId;
};

ExtrasDropDownMenu.prototype.openMenu = function(menuModel) {
    if (!this.prepareOpenMenu(menuModel)) {
        // Do nothing: menu is already open.
        return;
    }

    var itemElement = this.getItemElement(menuModel);
    var bounds = new EchoCssUtil.Bounds(itemElement);
    if (this.isDropDownElement(itemElement)) { 
        this.drawDropDownMenu(menuModel);
    } else {
        this.drawSubMenu(menuModel);
    }
};

ExtrasDropDownMenu.prototype.renderDropDownAdd = function() {
    var containerElement = document.getElementById(this.containerElementId);
    var dropDownDivElement = document.createElement("div");
    dropDownDivElement.id = this.elementId;
    
    if (this.width) {
        dropDownDivElement.style.width = this.width;
    }
    if (this.height) {
        dropDownDivElement.style.height = this.height;
    }
    dropDownDivElement.style.backgroundColor = this.background;
    dropDownDivElement.style.color = this.foreground;
    if (this.backgroundImage != null) {
        EchoCssUtil.applyStyle(dropDownDivElement, this.backgroundImage);
    }
    
    var relativeContainerDivElement = document.createElement("div");
    relativeContainerDivElement.style.position = "relative";
    
    var expandElement = document.createElement("span");
    expandElement.style.position = "absolute";
    expandElement.style.top = "2px";
    expandElement.style.right = "5px";
    if (this.expandIcon) {
        var imgElement = document.createElement("img");
        imgElement.src = this.expandIcon;
        expandElement.appendChild(imgElement);
    } else {
        expandElement.appendChild(document.createTextNode("V"));
    }
    relativeContainerDivElement.appendChild(expandElement);
    
    var contentDivElement = document.createElement("div");
    contentDivElement.id = this.elementId + "_content";
    contentDivElement.appendChild(document.createTextNode("\u00a0"));
    relativeContainerDivElement.appendChild(contentDivElement);
    
    EchoEventProcessor.addHandler(dropDownDivElement, "click", "ExtrasDropDownMenu.processDropDownClick");
    //EchoEventProcessor.addHandler(dropDownDivElement, "mouseover", "ExtrasDropDownMenu.processMenuItemMouseOver");
    //EchoEventProcessor.addHandler(dropDownDivElement, "mouseout", "ExtrasDropDownMenu.processMenuItemMouseOut");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.addEventListener(dropDownDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.addEventListener(dropDownDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }

    dropDownDivElement.appendChild(relativeContainerDivElement);
    containerElement.appendChild(dropDownDivElement);
};

ExtrasDropDownMenu.prototype.renderDropDownDispose = function() {
    var dropDownDivElement = document.getElementById(this.elementId);
    EchoEventProcessor.removeHandler(dropDownDivElement, "click");
    EchoEventProcessor.removeHandler(dropDownDivElement, "mouseover");
    EchoEventProcessor.removeHandler(dropDownDivElement, "mouseout");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.removeEventListener(dropDownDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.removeEventListener(dropDownDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }
};

ExtrasDropDownMenu.prototype.renderMaskAdd = function() {
    if (this.maskDeployed) {
        return;
    }
    this.maskDeployed = true;
    
    var bodyElement = document.getElementsByTagName("body")[0];    

    var blockDivElement = document.createElement("div");
    blockDivElement.id = this.elementId + "_block";
    blockDivElement.style.position = "absolute";
    blockDivElement.style.top = "0px";
    blockDivElement.style.left = "0px";
    blockDivElement.style.width = "100%";
    blockDivElement.style.height = "100%";
    if (this.transparentImage) {
        blockDivElement.style.backgroundImage = "url(" + this.transparentImage + ")";
    }
    bodyElement.appendChild(blockDivElement);
    EchoEventProcessor.addHandler(blockDivElement.id, "click", "ExtrasMenu.processMenuCancel");
};

ExtrasDropDownMenu.prototype.renderMaskRemove = function() {
    if (!this.maskDeployed) {
        return;
    }
    this.maskDeployed = false;

    var bodyElement = document.getElementsByTagName("body")[0];    
    var blockDivElement = document.getElementById(this.elementId + "_block");
    if (blockDivElement) {
        EchoEventProcessor.removeHandler(blockDivElement.id, "click");
        bodyElement.removeChild(blockDivElement);
    }
};

ExtrasDropDownMenu.processDropDownClick = function(echoEvent) {
    EchoDomUtil.preventEventDefault(echoEvent);

    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    if (menuId == null) {
        return;
    }
    var menu = ExtrasMenu.getComponent(menuId);

    if (!menu.enabled || !EchoClientEngine.verifyInput(menuId, false)) {
        return;
    }
    
    menu.renderMaskAdd();
    
    menu.processItemActivate(menu.menuModel);
};

ExtrasDropDownMenu.prototype.setSelection = function(menuModel) {
    this.selectedItem = menuModel;
    
    var contentDivElement = document.getElementById(this.elementId + "_content");
    for (var i = contentDivElement.childNodes.length - 1; i >= 0; --i) {
        contentDivElement.removeChild(contentDivElement.childNodes[i]);
    }
    
    if (menuModel.text) {
        if (menuModel.icon) {
            // Render Text and Icon
            var tableElement = document.createElement("table");
            var tbodyElement = document.createElement("tbody");
            var trElement = document.createElement("tr");
            var tdElement = document.createElement("td");
            var imgElement = document.createElement("img");
            imgElement.src = menuModel.icon;
            tdElement.appendChild(imgElement);
            trElement.appendChild(tdElement);
            tdElement = document.createElement("td");
            tdElement.style.width = "3px";
            trElement.appendChild(tdElement);
            tdElement = document.createElement("td");
            tdElement.appendChild(document.createTextNode(menuModel.text));
            trElement.appendChild(tdElement);
            tbodyElement.appendChild(trElement);
            tableElement.appendChild(tbodyElement);
            contentDivElement.appendChild(tableElement);
        } else {
            // Render Text Only
            contentDivElement.appendChild(document.createTextNode(menuModel.text));
        }
    } else if (menuModel.icon) {
        // Render Icon Only
        var imgElement = document.createElement("img");
        imgElement.src = menuModel.icon;
        contentDivElement.appendChild(imgElement);
    }
};

/**
 * Static object/namespace for DropDownMenu MessageProcessor 
 * implementation.
 */
ExtrasDropDownMenu.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasDropDownMenu.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasDropDownMenu.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasDropDownMenu.MessageProcessor.processInit(messagePartElement.childNodes[i]);
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
ExtrasDropDownMenu.MessageProcessor.processDispose = function(disposeMessageElement) {
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
ExtrasDropDownMenu.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var menu = new ExtrasDropDownMenu(elementId, containerElementId);

    var menuModel;
    
    for (var i = 0; i < initMessageElement.childNodes.length; ++i) {
        if (initMessageElement.childNodes[i].nodeType == 1 && initMessageElement.childNodes[i].nodeName == "menu") {
            menuModel = ExtrasMenu.MessageParser.parseMenuModel(initMessageElement.childNodes[i]);
            break;
        }
    }

    menu.setModel(menuModel);
    
    menu.transparentImage = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ExtrasUtil.Transparent";
    
    menu.enabled = initMessageElement.getAttribute("enabled") != "false";
    menu.selection = initMessageElement.getAttribute("selection") != "false";
    if (initMessageElement.getAttribute("selected-path")) {
        menu.selectedItem = ExtrasMenu.getItemModel(menuModel, initMessageElement.getAttribute("selected-path"));
    }
    if (initMessageElement.getAttribute("background")) {
        menu.background = initMessageElement.getAttribute("background");
    }
    if (initMessageElement.getAttribute("background-image")) {
        menu.backgroundImage = initMessageElement.getAttribute("background-image");
    }
    if (initMessageElement.getAttribute("border-style")) {
        menu.borderStyle = initMessageElement.getAttribute("border-style");
    }
    if (initMessageElement.getAttribute("border-color")) {
        menu.borderColor = initMessageElement.getAttribute("border-color");
    }
    if (initMessageElement.getAttribute("border-size")) {
        menu.borderSize = parseInt(initMessageElement.getAttribute("border-size"));
    }
    if (initMessageElement.getAttribute("disabled-background")) {
        menu.disabledBackground = initMessageElement.getAttribute("disabled-background");
    }
    if (initMessageElement.getAttribute("disabled-background-image")) {
        menu.disabledBackgroundImage = initMessageElement.getAttribute("disabled-background-image");
    }
    if (initMessageElement.getAttribute("disabled-foreground")) {
        menu.disabledForeground = initMessageElement.getAttribute("disabled-foreground");
    }
    if (initMessageElement.getAttribute("disabled-expand-icon")) {
        menu.disabledExpandIcon = initMessageElement.getAttribute("disabled-expand-icon");
    }
    if (initMessageElement.getAttribute("expand-icon")) {
        menu.expandIcon = initMessageElement.getAttribute("expand-icon");
    }
    if (initMessageElement.getAttribute("foreground")) {
        menu.foreground = initMessageElement.getAttribute("foreground");
    }
    if (initMessageElement.getAttribute("height")) {
        menu.height = initMessageElement.getAttribute("height");
    }
    if (initMessageElement.getAttribute("selection-background")) {
        menu.selectionBackground = initMessageElement.getAttribute("selection-background");
    }
    if (initMessageElement.getAttribute("selection-background-image")) {
        menu.selectionBackgroundImage = initMessageElement.getAttribute("selection-background-image");
    }
    if (initMessageElement.getAttribute("selection-foreground")) {
        menu.selectionForeground = initMessageElement.getAttribute("selection-foreground");
    }
    if (initMessageElement.getAttribute("icon-toggle-off")) {
        menu.toggleOffIcon = initMessageElement.getAttribute("icon-toggle-off");
    }
    if (initMessageElement.getAttribute("icon-toggle-on")) {
        menu.toggleOnIcon = initMessageElement.getAttribute("icon-toggle-on");
    }
    if (initMessageElement.getAttribute("icon-radio-off")) {
        menu.radioOffIcon = initMessageElement.getAttribute("icon-radio-off");
    }
    if (initMessageElement.getAttribute("icon-radio-on")) {
        menu.radioOnIcon = initMessageElement.getAttribute("icon-radio-on");
    }
    if (initMessageElement.getAttribute("submenu-image")) {
        menu.submenuImage = initMessageElement.getAttribute("submenu-image");
    }
    if (initMessageElement.getAttribute("width")) {
        menu.width = initMessageElement.getAttribute("width");
    }


    menu.create();
};

ExtrasMenuBarPane = function(elementId, containerElementId) {
    ExtrasMenu.call(this, elementId, containerElementId);
    this.menuBarItemInsets = "0px 12px";
};

ExtrasMenuBarPane.prototype = new ExtrasMenu;

ExtrasMenuBarPane.prototype.create = function() {
    this.renderMenuBarAdd();
    ExtrasMenu.prototype.create.call(this);
};

ExtrasMenuBarPane.prototype.dispose = function() {
    this.renderMenuBarDispose();
};

ExtrasMenuBarPane.prototype.doAction = function(menuModel) {
    this.notifyServer(menuModel);
};

ExtrasMenuBarPane.prototype.drawMenuBarSubMenu = function(menuModel) {
    var itemElement = this.getItemElement(menuModel);
    var bounds = new EchoCssUtil.Bounds(itemElement);

    var offsetTop = this.getMenuBarHeight() + bounds.top;
    var menuDivElement = this.renderMenuAdd(menuModel, bounds.left, offsetTop);

    var bottomDistance = menuDivElement.parentNode.offsetHeight - (menuDivElement.offsetTop + menuDivElement.offsetHeight);
    if (bottomDistance < 0) {
        // Menu descends beneath bottom of window.
        var newTop = bounds.top - menuDivElement.offsetHeight;
        if (newTop > 0) {
            menuDivElement.style.top = newTop + "px";
        }
    }
};

ExtrasMenuBarPane.prototype.getItemElement = function(itemModel) {
    var itemElement = document.getElementById(this.elementId + "_bar_td_item_" + itemModel.id);
    if (!itemElement) {
        itemElement = document.getElementById(this.elementId + "_tr_item_" + itemModel.id);
    }
    return itemElement;
};

ExtrasMenuBarPane.prototype.getMenuBarHeight = function() {
    var menuBarDivElement = document.getElementById(this.elementId);
    return menuBarDivElement.offsetHeight;
};

ExtrasMenuBarPane.prototype.isMenuBarItemElement = function(itemElement) {
    return itemElement.id.indexOf("_bar_td_item") != -1;
};

ExtrasMenuBarPane.prototype.openMenu = function(menuModel) {
    if (!this.prepareOpenMenu(menuModel)) {
        // Do nothing: menu is already open.
        return;
    }

    var itemElement = this.getItemElement(menuModel);
    var bounds = new EchoCssUtil.Bounds(itemElement);
    if (this.isMenuBarItemElement(itemElement)) {
        this.drawMenuBarSubMenu(menuModel);
    } else {
        this.drawSubMenu(menuModel);
    }
};

ExtrasMenuBarPane.prototype.renderMaskAdd = function() {
    if (this.maskDeployed) {
        return;
    }
    this.maskDeployed = true;
    
    var menuDivElement = document.getElementById(this.elementId);
    var bounds = new EchoCssUtil.Bounds(menuDivElement);
    var bodyElement = document.getElementsByTagName("body")[0];    
    bounds.height = this.getMenuBarHeight();
    
    var topBlockDivElement = document.createElement("div");
    topBlockDivElement.id = this.elementId + "_block_top";
    topBlockDivElement.style.position = "absolute";
    topBlockDivElement.style.top = "0px";
    topBlockDivElement.style.left = "0px";
    topBlockDivElement.style.width = "100%";
    topBlockDivElement.style.height = bounds.top + "px";
    if (this.transparentImage) {
        topBlockDivElement.style.backgroundImage = "url(" + this.transparentImage + ")";
    }
    bodyElement.appendChild(topBlockDivElement);
    EchoEventProcessor.addHandler(topBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");

    var bottomBlockDivElement = document.createElement("div");
    bottomBlockDivElement.id = this.elementId + "_block_bottom";
    bottomBlockDivElement.style.position = "absolute";
    var height = (document.documentElement.clientHeight - (bounds.top + bounds.height));
    height = height > 0 ? height : 0;
    bottomBlockDivElement.style.height = height + "px";
    bottomBlockDivElement.style.left = "0px";
    bottomBlockDivElement.style.width = "100%";
    bottomBlockDivElement.style.bottom = "0px";
    if (this.transparentImage) {
        bottomBlockDivElement.style.backgroundImage = "url(" + this.transparentImage + ")";
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
    if (this.transparentImage) {
        leftBlockDivElement.style.backgroundImage = "url(" + this.transparentImage + ")";
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
    if (this.transparentImage) {
        rightBlockDivElement.style.backgroundImage = "url(" + this.transparentImage + ")";
    }
    bodyElement.appendChild(rightBlockDivElement);
    EchoEventProcessor.addHandler(rightBlockDivElement.id, "click", "ExtrasMenu.processMenuCancel");
};

ExtrasMenuBarPane.prototype.renderMaskRemove = function() {
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
};

ExtrasMenuBarPane.prototype.renderMenuBarAdd = function() {
    var containerElement = document.getElementById(this.containerElementId);
    var menuBarDivElement = document.createElement("div");
    menuBarDivElement.id = this.elementId;
    menuBarDivElement.style.position = "absolute";
    menuBarDivElement.style.left = "0px";
    menuBarDivElement.style.right = "0px";
    menuBarDivElement.style.top = "0px";
    menuBarDivElement.style.bottom = "0px";
    
    menuBarDivElement.style.backgroundColor = this.background;
    menuBarDivElement.style.color = this.foreground;
    menuBarDivElement.style.borderTop = this.getBorder();
    menuBarDivElement.style.borderBottom = this.getBorder();
    if (this.backgroundImage != null) {
        EchoCssUtil.applyStyle(menuBarDivElement, this.backgroundImage);
    }
    
    var menuBarTableElement = document.createElement("table");
    menuBarTableElement.style.height = "100%";
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
                menuBarItemTdElement.id = this.elementId + "_bar_td_item_" + this.menuModel.items[i].id;
                menuBarItemTdElement.style.padding = "0px";
                menuBarItemTdElement.style.height = "100%";
                menuBarItemTdElement.style.cursor = "pointer";
                menuBarTrElement.appendChild(menuBarItemTdElement);
                var menuBarItemDivElement = document.createElement("div");
                menuBarItemDivElement.style.padding = this.menuBarItemInsets;
                menuBarItemTdElement.appendChild(menuBarItemDivElement);
                var textNode = document.createTextNode(this.menuModel.items[i].text);
                menuBarItemDivElement.appendChild(textNode);
            }
        }
    }
    
    containerElement.appendChild(menuBarDivElement);

    EchoVirtualPosition.register(menuBarDivElement.id);
    EchoEventProcessor.addHandler(menuBarDivElement, "click", "ExtrasMenuBarPane.processMenuBarClick");
    EchoEventProcessor.addHandler(menuBarDivElement, "mouseover", "ExtrasMenu.processMenuItemMouseOver");
    EchoEventProcessor.addHandler(menuBarDivElement, "mouseout", "ExtrasMenu.processMenuItemMouseOut");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.addEventListener(menuBarDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.addEventListener(menuBarDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }
};

ExtrasMenuBarPane.prototype.renderMenuBarDispose = function() {
    var menuBarDivElement = document.getElementById(this.elementId);
    EchoEventProcessor.removeHandler(menuBarDivElement, "click");
    EchoEventProcessor.removeHandler(menuBarDivElement, "mouseover");
    EchoEventProcessor.removeHandler(menuBarDivElement, "mouseout");
    if (EchoClientProperties.get("browserInternetExplorer")) {
        EchoDomUtil.removeEventListener(menuBarDivElement, "selectstart", ExtrasMenu.absorbMouseSelection, false);
    } else {
        EchoDomUtil.removeEventListener(menuBarDivElement, "mousedown", ExtrasMenu.absorbMouseSelection, false);
    }
};

ExtrasMenuBarPane.processMenuBarClick = function(echoEvent) {
    EchoDomUtil.preventEventDefault(echoEvent);

    var menuItemElement = echoEvent.target;
    var modelId = ExtrasMenu.getElementModelId(menuItemElement);
    
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    if (menuId == null) {
        return;
    }
    var menu = ExtrasMenu.getComponent(menuId);

    if (!menu.enabled || !EchoClientEngine.verifyInput(menuId, false)) {
        return;
    }

    if (!modelId) {
        menu.processCancel();
        return;
    }
    
    menu.renderMaskAdd();
    menu.processSelection(modelId);
};

/**
 * Static object/namespace for MenuBarPane MessageProcessor 
 * implementation.
 */
ExtrasMenuBarPane.MessageProcessor = function() { };

/**
 * MessageProcessor process() implementation 
 * (invoked by ServerMessage processor).
 *
 * @param messagePartElement the <code>message-part</code> element to process.
 */
ExtrasMenuBarPane.MessageProcessor.process = function(messagePartElement) {
    for (var i = 0; i < messagePartElement.childNodes.length; ++i) {
        if (messagePartElement.childNodes[i].nodeType === 1) {
            switch (messagePartElement.childNodes[i].tagName) {
            case "dispose":
                ExtrasMenuBarPane.MessageProcessor.processDispose(messagePartElement.childNodes[i]);
                break;
            case "init":
                ExtrasMenuBarPane.MessageProcessor.processInit(messagePartElement.childNodes[i]);
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
ExtrasMenuBarPane.MessageProcessor.processDispose = function(disposeMessageElement) {
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
ExtrasMenuBarPane.MessageProcessor.processInit = function(initMessageElement) {
    var elementId = initMessageElement.getAttribute("eid");
    
    var containerElementId = initMessageElement.getAttribute("container-eid");
    var menu = new ExtrasMenuBarPane(elementId, containerElementId);
    menu.transparentImage = EchoClientEngine.baseServerUri + "?serviceId=Echo2Extras.ExtrasUtil.Transparent";
    
    menu.enabled = initMessageElement.getAttribute("enabled") != "false";
    if (initMessageElement.getAttribute("background")) {
        menu.background = initMessageElement.getAttribute("background");
    }
    if (initMessageElement.getAttribute("background-image")) {
        menu.backgroundImage = initMessageElement.getAttribute("background-image");
    }
    if (initMessageElement.getAttribute("border-style")) {
        menu.borderStyle = initMessageElement.getAttribute("border-style");
    }
    if (initMessageElement.getAttribute("border-color")) {
        menu.borderColor = initMessageElement.getAttribute("border-color");
    }
    if (initMessageElement.getAttribute("border-size")) {
        menu.borderSize = parseInt(initMessageElement.getAttribute("border-size"));
    }
    if (initMessageElement.getAttribute("disabled-background")) {
        menu.disabledBackground = initMessageElement.getAttribute("disabled-background");
    }
    if (initMessageElement.getAttribute("disabled-background-image")) {
        menu.disabledBackgroundImage = initMessageElement.getAttribute("disabled-background-image");
    }
    if (initMessageElement.getAttribute("disabled-foreground")) {
        menu.disabledForeground = initMessageElement.getAttribute("disabled-foreground");
    }
    if (initMessageElement.getAttribute("foreground")) {
        menu.foreground = initMessageElement.getAttribute("foreground");
    }
    if (initMessageElement.getAttribute("menu-background")) {
        menu.menuBackground = initMessageElement.getAttribute("menu-background");
    }
    if (initMessageElement.getAttribute("menu-background-image")) {
        menu.menuBackgroundImage = initMessageElement.getAttribute("menu-background-image");
    }
    if (initMessageElement.getAttribute("menu-border-style")) {
        menu.menuBorderStyle = initMessageElement.getAttribute("menu-border-style");
    }
    if (initMessageElement.getAttribute("menu-border-color")) {
        menu.menuBorderColor = initMessageElement.getAttribute("menu-border-color");
    }
    if (initMessageElement.getAttribute("menu-border-size")) {
        menu.menuBorderSize = parseInt(initMessageElement.getAttribute("menu-border-size"));
    }
    if (initMessageElement.getAttribute("menu-foreground")) {
        menu.menuForeground = initMessageElement.getAttribute("menu-foreground");
    }
    if (initMessageElement.getAttribute("selection-background")) {
        menu.selectionBackground = initMessageElement.getAttribute("selection-background");
    }
    if (initMessageElement.getAttribute("selection-background-image")) {
        menu.selectionBackgroundImage = initMessageElement.getAttribute("selection-background-image");
    }
    if (initMessageElement.getAttribute("selection-foreground")) {
        menu.selectionForeground = initMessageElement.getAttribute("selection-foreground");
    }
    if (initMessageElement.getAttribute("icon-toggle-off")) {
        menu.toggleOffIcon = initMessageElement.getAttribute("icon-toggle-off");
    }
    if (initMessageElement.getAttribute("icon-toggle-on")) {
        menu.toggleOnIcon = initMessageElement.getAttribute("icon-toggle-on");
    }
    if (initMessageElement.getAttribute("icon-radio-off")) {
        menu.radioOffIcon = initMessageElement.getAttribute("icon-radio-off");
    }
    if (initMessageElement.getAttribute("icon-radio-on")) {
        menu.radioOnIcon = initMessageElement.getAttribute("icon-radio-on");
    }
    if (initMessageElement.getAttribute("submenu-image")) {
        menu.submenuImage = initMessageElement.getAttribute("submenu-image");
    }

    var menuBarModel;
    
    for (var i = 0; i < initMessageElement.childNodes.length; ++i) {
        if (initMessageElement.childNodes[i].nodeType == 1 && initMessageElement.childNodes[i].nodeName == "menu") {
            menuBarModel = ExtrasMenu.MessageParser.parseMenuModel(initMessageElement.childNodes[i]);
            break;
        }
    }

    menu.setModel(menuBarModel);

    menu.create();
};
