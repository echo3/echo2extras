package nextapp.echo2.extras.webcontainer;

import java.util.StringTokenizer;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.ImageReference;
import nextapp.echo2.app.ResourceImageReference;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.menu.AbstractMenuComponent;
import nextapp.echo2.extras.app.menu.ItemModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.MenuStateModel;
import nextapp.echo2.extras.app.menu.OptionModel;
import nextapp.echo2.extras.app.menu.RadioOptionModel;
import nextapp.echo2.extras.app.menu.SeparatorModel;
import nextapp.echo2.extras.app.menu.ToggleOptionModel;
import nextapp.echo2.webcontainer.ActionProcessor;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.image.ImageRenderSupport;
import nextapp.echo2.webcontainer.image.ImageTools;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

abstract class AbstractMenuPeer 
implements ActionProcessor, ComponentSynchronizePeer, ImageRenderSupport {
    
    static final String IMAGE_PREFIX = "/nextapp/echo2/extras/webcontainer/resource/image/";
    static final ImageReference DEFAULT_ICON_SUBMENU_LEFT = new ResourceImageReference(IMAGE_PREFIX + "ArrowLeft.gif");
    static final ImageReference DEFAULT_ICON_SUBMENU_RIGHT = new ResourceImageReference(IMAGE_PREFIX + "ArrowRight.gif");
    static final ImageReference DEFAULT_ICON_TOGGLE_OFF = new ResourceImageReference(IMAGE_PREFIX + "ToggleOff.gif");
    static final ImageReference DEFAULT_ICON_TOGGLE_ON = new ResourceImageReference(IMAGE_PREFIX + "ToggleOn.gif");
    static final ImageReference DEFAULT_ICON_RADIO_OFF = new ResourceImageReference(IMAGE_PREFIX + "RadioOff.gif");
    static final ImageReference DEFAULT_ICON_RADIO_ON = new ResourceImageReference(IMAGE_PREFIX + "RadioOn.gif");
    
    static final String IMAGE_ID_BACKGROUND = "background";
    static final String IMAGE_ID_DISABLED_BACKGROUND = "disabledBackground";
    static final String IMAGE_ID_MENU_BACKGROUND = "menuBackground";
    static final String IMAGE_ID_MENU_ITEM_PREFIX = "menuItem.";
    static final String IMAGE_ID_SELECTION_BACKGROUND = "selectionBackground";
    
    static final String IMAGE_ID_SUBMENU_LEFT = "submenuLeft";
    static final String IMAGE_ID_SUBMENU_RIGHT = "submenuRight";
    
    static final String IMAGE_ID_TOGGLE_OFF = "toggleOff";
    static final String IMAGE_ID_TOGGLE_ON = "toggleOn";
    static final String IMAGE_ID_RADIO_OFF = "radioOff";
    static final String IMAGE_ID_RADIO_ON = "radioOn";

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
    PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public AbstractMenuPeer() {
        partialUpdateManager = new PartialUpdateManager();
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component component) {
        throw new UnsupportedOperationException("Component does not support children.");
    }
    
    /**
     * @see nextapp.echo2.webcontainer.image.ImageRenderSupport#getImage(nextapp.echo2.app.Component, java.lang.String)
     */
    public ImageReference getImage(Component component, String imageId) {
        if (IMAGE_ID_SUBMENU_RIGHT.equals(imageId)) {
            return DEFAULT_ICON_SUBMENU_RIGHT;
        } else if (IMAGE_ID_SUBMENU_LEFT.equals(imageId)) {
            return DEFAULT_ICON_SUBMENU_LEFT;
        } else if (IMAGE_ID_TOGGLE_OFF.equals(imageId)) {
            return DEFAULT_ICON_TOGGLE_OFF;
        } else if (IMAGE_ID_TOGGLE_ON.equals(imageId)) {
            return DEFAULT_ICON_TOGGLE_ON;
        } else if (IMAGE_ID_RADIO_OFF.equals(imageId)) {
            return DEFAULT_ICON_RADIO_OFF;
        } else if (IMAGE_ID_RADIO_ON.equals(imageId)) {
            return DEFAULT_ICON_RADIO_ON;
        } else if (imageId.startsWith(IMAGE_ID_MENU_ITEM_PREFIX)) {
            String itemPath = imageId.substring(IMAGE_ID_MENU_ITEM_PREFIX.length());
            ItemModel itemModel = getItemModel((AbstractMenuComponent) component, itemPath);
            if (itemModel instanceof MenuModel) {
                return ((MenuModel) itemModel).getIcon();
            } else if (itemModel instanceof OptionModel) {
                return ((OptionModel) itemModel).getIcon();
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    
    ItemModel getItemModelById(AbstractMenuComponent menu, String id) {
        return getItemModelById(menu.getModel(), id);
    }
    
    private ItemModel getItemModelById(MenuModel menuModel, String id) {
        int size = menuModel.getItemCount();
        for (int i = 0; i < size; ++i) {
            ItemModel itemModel = menuModel.getItem(i);
            if (id.equals(itemModel.getId())) {
                return itemModel;
            }
            if (itemModel instanceof MenuModel) {
                itemModel = getItemModelById((MenuModel) itemModel, id);
                if (itemModel != null) {
                    return itemModel;
                }
            }
        }
        return null;
    }
    
    ItemModel getItemModel(AbstractMenuComponent menu, String itemPath) {
        ItemModel itemModel = menu.getModel();
        StringTokenizer st = new StringTokenizer(itemPath, ".");
        while (st.hasMoreTokens()) {
            int index = Integer.parseInt(st.nextToken());
            itemModel = ((MenuModel) itemModel).getItem(index);
        }
        return itemModel;
    }

    String getItemPath(MenuModel menuModel, ItemModel targetItemModel) {
        StringBuffer out = new StringBuffer();
        getItemPath(menuModel, targetItemModel, out);
        return out.length() == 0 ? null : out.toString();
    }
    
    void getItemPath(MenuModel menuModel, ItemModel targetItemModel, StringBuffer out) {
        int itemCount = menuModel.getItemCount();
        for (int i = 0; i < itemCount; ++i) {
            ItemModel currentItemModel = menuModel.getItem(i);
            if (targetItemModel.equals(currentItemModel)) {
                out.append(i);
                return;
            }
            if (currentItemModel instanceof MenuModel) {
                getItemPath((MenuModel) currentItemModel, targetItemModel, out); 
            }
            if (out.length() != 0) {
                out.insert(0, i + ".");
                return;
            }
        }
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ActionProcessor#processAction(nextapp.echo2.webcontainer.ContainerInstance, 
     *      nextapp.echo2.app.Component, org.w3c.dom.Element)
     */
    public void processAction(ContainerInstance ci, Component component, Element element) {
        AbstractMenuComponent menu = (AbstractMenuComponent) component;
        String actionName = element.getAttribute(ActionProcessor.ACTION_NAME);
        String actionValue = element.getAttribute(ActionProcessor.ACTION_VALUE);
        if ("select".equals(actionName)) {
            ItemModel itemModel = getItemModel((AbstractMenuComponent) component, actionValue);
            if (!(itemModel instanceof MenuModel || itemModel instanceof OptionModel)) {
                // Should not occur unless client input tampered with.
                return;
            }
            ci.getUpdateManager().getClientUpdateManager().setComponentAction(menu, AbstractMenuComponent.INPUT_SELECT, itemModel);
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
        AbstractMenuComponent menu = (AbstractMenuComponent) component;
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
        renderDisposeDirective(rc, (AbstractMenuComponent) component);
    }

    abstract void renderInitDirective(RenderContext rc, Component component, String targetId);
    
    abstract void renderDisposeDirective(RenderContext rc, Component component);
    
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
    void renderModel(RenderContext rc, AbstractMenuComponent menu, MenuModel menuModel, Element parentElement) {
        Document document = rc.getServerMessage().getDocument();
        Element menuModelElement = document.createElement("menu");

        MenuStateModel stateModel = menu.getStateModel();
        
        if (menuModel.getText() != null) {
            menuModelElement.setAttribute("text", menuModel.getText());
        }
        if (menuModel.getIcon() != null) {
            String itemPath = getItemPath(menu.getModel(), menuModel);
            menuModelElement.setAttribute("icon", ImageTools.getUri(rc, this, menu, IMAGE_ID_MENU_ITEM_PREFIX + itemPath));
        }
        if (menuModel.getId() != null && !stateModel.isEnabled(menuModel.getId())) {
            menuModelElement.setAttribute("enabled", "false");
        }

        int length = menuModel.getItemCount();
        for (int i = 0; i < length; ++i) {
            ItemModel itemModel = menuModel.getItem(i);
            if (itemModel instanceof MenuModel) {
                renderModel(rc, menu, (MenuModel) itemModel, menuModelElement); 
            } else if (itemModel instanceof OptionModel) {
                Element optionModelElement = document.createElement("option");
                OptionModel optionModel = (OptionModel) itemModel;
                if (optionModel.getId() != null && !stateModel.isEnabled(optionModel.getId())) {
                    optionModelElement.setAttribute("enabled", "false");
                }
                if (optionModel instanceof ToggleOptionModel) {
                    if (optionModel instanceof RadioOptionModel) {
                        optionModelElement.setAttribute("type", "radio");
                    } else {
                        optionModelElement.setAttribute("type", "toggle");
                    }
                    if (stateModel != null && stateModel.isSelected(((ToggleOptionModel) optionModel).getId())) {
                        optionModelElement.setAttribute("selected", "true");
                    }
                } else {
                    optionModelElement.setAttribute("type", "default");
                }
                if (optionModel.getText() != null) {
                    optionModelElement.setAttribute("text", optionModel.getText());
                }
                if (optionModel.getIcon() != null) {
                    String itemPath = getItemPath(menu.getModel(), optionModel);
                    optionModelElement.setAttribute("icon", ImageTools.getUri(rc, this, menu, 
                            IMAGE_ID_MENU_ITEM_PREFIX + itemPath));
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
