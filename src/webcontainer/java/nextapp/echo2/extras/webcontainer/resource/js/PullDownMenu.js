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
    
    /**
     * Array containing ids of open menus.
     */
    this.openMenuPath = new Array();
};

ExtrasMenu.nextId = 0;

ExtrasMenu.prototype.create = function() {
    this.renderMenuBarAdd();
    
    EchoDomPropertyStore.setPropertyValue(this.elementId, "menu", this);
};

ExtrasMenu.prototype.dispose = function() {
};

ExtrasMenu.prototype.getElementModelId = function(menuItemElement) {
    if (!menuItemElement.id || menuItemElement.id.indexOf("_item_") == -1) {
        return null;
    }
    var lastUnderscorePosition = menuItemElement.id.lastIndexOf("_");
    return menuItemElement.id.substring(lastUnderscorePosition + 1);
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

ExtrasMenu.prototype.processItemActivate = function(itemModel) {
    if (itemModel instanceof ExtrasMenu.OptionModel) {
        this.renderMaskRemove();
        this.closeDescendantMenus(null);
//        alert("click:" + itemModel.text);
    } else if (itemModel instanceof ExtrasMenu.MenuModel) {
        this.openMenu(itemModel);
    }
};

ExtrasMenu.prototype.getItemElement = function(itemModel) {
    var itemElement = document.getElementById(this.elementId + "_bar_item_" + itemModel.id);
    if (!itemElement) {
        itemElement = document.getElementById(this.elementId + "_tr_item_" + itemModel.id);
    }
    return itemElement;
};

ExtrasMenu.prototype.processCancel = function() {
    this.renderMaskRemove();
    this.closeDescendantMenus(null);
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
    if (this.maskImage) {
        topBlockDivElement.style.backgroundImage = "url(" + this.maskImage + ")";
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
    if (this.maskImage) {
        bottomBlockDivElement.style.backgroundImage = "url(" + this.maskImage + ")";
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
    if (this.maskImage) {
        leftBlockDivElement.style.backgroundImage = "url(" + this.maskImage + ")";
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
    if (this.maskImage) {
        rightBlockDivElement.style.backgroundImage = "url(" + this.maskImage + ")";
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
                var menuItemArrowTdElement = document.createElement("td");
                menuItemArrowTdElement.appendChild(document.createTextNode(">"));
                menuItemTrElement.appendChild(menuItemArrowTdElement);
            }
        }
    }
    
    bodyElement = document.getElementsByTagName("body")[0];    
    bodyElement.appendChild(menuDivElement);

    EchoEventProcessor.addHandler(menuDivElement.id, "click", "ExtrasMenu.processMenuItemClick");
};

ExtrasMenu.prototype.renderMenuDispose = function(menuModel) {
    var menuDivElement = document.getElementById(this.elementId + "_menu_" + menuModel.id);

    EchoEventProcessor.removeHandler(menuDivElement.id, "click", "ExtrasMenu.processMenuItemClick");
    
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

    ExtrasUtil.setCssPositionRight(menuBarDivElement.style, containerElement.id, 0, 8);

    EchoEventProcessor.addHandler(this.elementId, "click", "ExtrasMenu.processMenuBarClick");
    EchoEventProcessor.addHandler(this.elementId, "mouseover", "ExtrasMenu.processMenuBarMouseOver");
    EchoEventProcessor.addHandler(this.elementId, "mouseout", "ExtrasMenu.processMenuBarMouseOut");
};

ExtrasMenu.prototype.setModel = function(menuModel) {
    this.menuModel = menuModel;
};

ExtrasMenu.processMenuBarClick = function(echoEvent) {
    var menuItemElement = echoEvent.target;
    var menuId = EchoDomUtil.getComponentId(menuItemElement.id);
    var menu = EchoDomPropertyStore.getPropertyValue(menuId, "menu");
    menu.renderMaskAdd();
    menu.processSelection(menuItemElement);
};

ExtrasMenu.processMenuBarMouseOut = function(echoEvent) {

};

ExtrasMenu.processMenuBarMouseOver = function(echoEvent) {
};

ExtrasMenu.processMenuItemClick = function(echoEvent) {
    var trElement = echoEvent.target.parentNode;
    if (!trElement || trElement.id.indexOf("_tr_item_") == -1) {
        return;
    }
    var menuId = EchoDomUtil.getComponentId(trElement.id);
    var menu = EchoDomPropertyStore.getPropertyValue(menuId, "menu");
    menu.processSelection(trElement);
};

ExtrasMenu.processMenuCancel = function(echoEvent) {
    var menuId = EchoDomUtil.getComponentId(echoEvent.registeredTarget.id);
    var menu = EchoDomPropertyStore.getPropertyValue(menuId, "menu");
    menu.processCancel();
};

ExtrasMenu.MenuModel = function(text, icon) {
    this.id = ExtrasMenu.nextId++;
    this.parent = null;
    this.text = text;
    this.icon = icon;
    this.items = new Array();
};

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

ExtrasMenu.MenuModel.prototype.toString = function() {
    return "MenuModel \"" + this.text + "\" Items:" + this.items.length;
};

ExtrasMenu.OptionModel = function(text, icon) {
    this.id = ExtrasMenu.nextId++;
    this.parent = null;
    this.text = text;
    this.icon = icon;
};

ExtrasMenu.OptionModel.prototype.toString = function() {
    return "OptionModel \"" + this.text + "\"";
};

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
    
    var menuBarModel;
    
    for (var i = 0; i < initMessageElement.childNodes.length; ++i) {
        if (initMessageElement.childNodes[i].nodeType == 1 && initMessageElement.childNodes[i].nodeName == "menu") {
            menuBarModel = ExtrasMenu.MessageProcessor.processMenuModel(initMessageElement.childNodes[i], menu);
            break;
        }
    }

    menu.setModel(menuBarModel);

    menu.create();
};

ExtrasMenu.MessageProcessor.processMenuModel = function(menuElement, menu) {
    var menuModel = new ExtrasMenu.MenuModel(menuElement.getAttribute("text"));
    for (var i = 0; i < menuElement.childNodes.length; ++i) {
        var node = menuElement.childNodes[i];
        if (node.nodeType == 1) { // Element
            if (node.nodeName == "option") {
                var optionModel = new ExtrasMenu.OptionModel(node.getAttribute("text"));
                menuModel.addItem(optionModel);
            } else if (node.nodeName == "menu") {
                var childMenuModel = ExtrasMenu.MessageProcessor.processMenuModel(node, menu);
                menuModel.addItem(childMenuModel);
            }
        }
    }
    return menuModel;
};
