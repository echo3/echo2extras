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

package nextapp.echo2.extras.webcontainer;

import java.util.StringTokenizer;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.MenuBarPane;
import nextapp.echo2.extras.app.menu.ItemModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.OptionModel;
import nextapp.echo2.extras.app.menu.SeparatorModel;
import nextapp.echo2.webcontainer.ActionProcessor;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.propertyrender.BorderRender;
import nextapp.echo2.webcontainer.propertyrender.ColorRender;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for synchronizing
 * <code>MenuBarPane</code> components.
 */
public class MenuBarPanePeer 
implements ActionProcessor, ComponentSynchronizePeer {

    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service MENU_SERVICE = JavaScriptService.forResource("Echo2Extras.Menu",
            "/nextapp/echo2/extras/webcontainer/resource/js/Menu.js");

    static {
        WebRenderServlet.getServiceRegistry().add(MENU_SERVICE);
    }
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public MenuBarPanePeer() {
        partialUpdateManager = new PartialUpdateManager();
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component component) {
        throw new UnsupportedOperationException("Component does not support children.");
    }

    /**
     * @see nextapp.echo2.webcontainer.ActionProcessor#processAction(nextapp.echo2.webcontainer.ContainerInstance, 
     *      nextapp.echo2.app.Component, org.w3c.dom.Element)
     */
    public void processAction(ContainerInstance ci, Component component, Element element) {
        MenuBarPane menu = (MenuBarPane) component;
        String actionName = element.getAttribute(ActionProcessor.ACTION_NAME);
        String actionValue = element.getAttribute(ActionProcessor.ACTION_VALUE);
        if ("select".equals(actionName)) {
            OptionModel optionModel = null;
            MenuModel menuModel = menu.getModel();
            StringTokenizer st = new StringTokenizer(actionValue, ",");
            while (st.hasMoreTokens()) {
                int index = Integer.parseInt(st.nextToken());
                if (st.hasMoreTokens()) {
                    menuModel = (MenuModel) menuModel.getItem(index);
                } else {
                    optionModel = (OptionModel) menuModel.getItem(index);
                }
            }
            if (optionModel == null) {
                // Should not occur unless client input tampered with.
                return;
            }
            ci.getUpdateManager().getClientUpdateManager().setComponentAction(menu, MenuBarPane.INPUT_SELECT, optionModel);
        }
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(ExtrasUtil.JS_EXTRAS_UTIL_SERVICE.getId());
        serverMessage.addLibrary(MENU_SERVICE.getId());
        MenuBarPane menu = (MenuBarPane) component;
        renderInitDirective(rc, menu, targetId);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(ExtrasUtil.JS_EXTRAS_UTIL_SERVICE.getId());
        serverMessage.addLibrary(MENU_SERVICE.getId());
        renderDisposeDirective(rc, (MenuBarPane) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param menu the <code>MenuBarPane</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, MenuBarPane menu) {
        String elementId = ContainerInstance.getElementId(menu);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasMenu.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }

    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param menu the <code>MenuBarPane</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, MenuBarPane menu, String targetId) {
        String elementId = ContainerInstance.getElementId(menu);
        ServerMessage serverMessage = rc.getServerMessage();
        Element partElement = serverMessage.addPart(ServerMessage.GROUP_ID_UPDATE, "ExtrasMenu.MessageProcessor");
        Element initElement = serverMessage.getDocument().createElement("init");
        initElement.setAttribute("container-eid", targetId);
        initElement.setAttribute("eid", elementId);
        if (!menu.isRenderEnabled()) {
            initElement.setAttribute("enabled", "false");
        }
        
        Color background = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_BACKGROUND);
        if (background != null) {
            initElement.setAttribute("background", ColorRender.renderCssAttributeValue(background));
        }
        Border border = (Border) menu.getRenderProperty(MenuBarPane.PROPERTY_BORDER);
        if (border != null) {
            initElement.setAttribute("border", BorderRender.renderCssAttributeValue(border));
        }
        Color foreground = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_FOREGROUND);
        if (foreground != null) {
            initElement.setAttribute("foreground", ColorRender.renderCssAttributeValue(foreground));
        }
        Color menuBackground = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_MENU_BACKGROUND);
        if (menuBackground != null) {
            initElement.setAttribute("menu-background", ColorRender.renderCssAttributeValue(menuBackground));
        }
        Border menuBorder = (Border) menu.getRenderProperty(MenuBarPane.PROPERTY_MENU_BORDER);
        if (menuBorder != null) {
            initElement.setAttribute("menu-border", BorderRender.renderCssAttributeValue(menuBorder));
        }
        Color menuForeground = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_MENU_FOREGROUND);
        if (menuForeground != null) {
            initElement.setAttribute("menu-foreground", ColorRender.renderCssAttributeValue(menuForeground));
        }
        Color selectionBackground = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_SELECTION_BACKGROUND);
        if (selectionBackground != null) {
            initElement.setAttribute("selection-background", ColorRender.renderCssAttributeValue(selectionBackground));
        }
        Color selectionForeground = (Color) menu.getRenderProperty(MenuBarPane.PROPERTY_SELECTION_FOREGROUND);
        if (selectionForeground != null) {
            initElement.setAttribute("selection-foreground", ColorRender.renderCssAttributeValue(selectionForeground));
        }
        
        renderModel(rc, menu.getModel(), initElement);
        
        partElement.appendChild(initElement);
    }
    
    /**
     * Renders an XML representation of a <code>MenuModel</code> to the 
     * <code>ServerMessage</code>.  This method is invoked recursively to render
     * hierarchies of menus.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param menuModel the <code>MenuModel</code> to render
     * @param parentElement the parent <code>Element</code>, either the 'init'
     *        element or the containing 'menu' element
     */
    private void renderModel(RenderContext rc, MenuModel menuModel, Element parentElement) {
        Document document = rc.getServerMessage().getDocument();
        Element menuModelElement = document.createElement("menu");
        if (menuModel.getText() != null) {
            menuModelElement.setAttribute("text", menuModel.getText());
        }
        int length = menuModel.getItemCount();
        for (int i = 0; i < length; ++i) {
            ItemModel itemModel = menuModel.getItem(i);
            if (itemModel instanceof MenuModel) {
                renderModel(rc, (MenuModel) itemModel, menuModelElement); 
            } else if (itemModel instanceof OptionModel) {
                Element optionModelElement = document.createElement("option");
                OptionModel optionModel = (OptionModel) itemModel;
                if (optionModel.getText() != null) {
                    optionModelElement.setAttribute("text", optionModel.getText());
                }
                menuModelElement.appendChild(optionModelElement);
            } else if (itemModel instanceof SeparatorModel) {
                menuModelElement.appendChild(document.createElement("separator"));
            }
        }
        parentElement.appendChild(menuModelElement);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderUpdate(nextapp.echo2.webcontainer.RenderContext,
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String)
     */
    public boolean renderUpdate(RenderContext rc, ServerComponentUpdate update, String targetId) {
        // Determine if fully replacing the component is required.
        if (partialUpdateManager.canProcess(rc, update)) {
            partialUpdateManager.process(rc, update);
        } else {
            // Perform full update.
            DomUpdate.renderElementRemove(rc.getServerMessage(), ContainerInstance.getElementId(update.getParent()));
            renderAdd(rc, update, targetId, update.getParent());
        }
        return true;
    }
}
