package nextapp.echo2.extras.webcontainer;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.PullDownMenu;
import nextapp.echo2.extras.app.menu.ItemModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.OptionModel;
import nextapp.echo2.extras.app.menu.SeparatorModel;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.PartialUpdateManager;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.propertyrender.ColorRender;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for synchronizing
 * <code>PullDownMenu</code> components.
 */
public class PullDownMenuPeer 
implements ComponentSynchronizePeer {

    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service PULL_DOWN_MENU_SERVICE = JavaScriptService.forResource("Echo2Extras.PullDownMenu",
            "/nextapp/echo2/extras/webcontainer/resource/js/PullDownMenu.js");

    static {
        WebRenderServlet.getServiceRegistry().add(PULL_DOWN_MENU_SERVICE);
    }
    
    /**
     * The <code>PartialUpdateManager</code> for this synchronization peer.
     */
    private PartialUpdateManager partialUpdateManager;
    
    /**
     * Default constructor.
     */
    public PullDownMenuPeer() {
        partialUpdateManager = new PartialUpdateManager();
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component component) {
        throw new UnsupportedOperationException("Component does not support children.");
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(ExtrasUtil.SERVICE.getId());
        serverMessage.addLibrary(PULL_DOWN_MENU_SERVICE.getId());
        PullDownMenu menu = (PullDownMenu) component;
        renderInitDirective(rc, menu, targetId);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(ExtrasUtil.SERVICE.getId());
        serverMessage.addLibrary(PULL_DOWN_MENU_SERVICE.getId());
        renderDisposeDirective(rc, (PullDownMenu) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param menu the <code>PullDownMenu</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, PullDownMenu menu) {
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
     * @param menu the <code>PullDownMenu</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, PullDownMenu menu, String targetId) {
        String elementId = ContainerInstance.getElementId(menu);
        ServerMessage serverMessage = rc.getServerMessage();
        Element partElement = serverMessage.addPart(ServerMessage.GROUP_ID_UPDATE, "ExtrasMenu.MessageProcessor");
        Element initElement = serverMessage.getDocument().createElement("init");
        initElement.setAttribute("container-eid", targetId);
        initElement.setAttribute("eid", elementId);
        
        Color background = (Color) menu.getRenderProperty(PullDownMenu.PROPERTY_BACKGROUND);
        if (background != null) {
            initElement.setAttribute("default-background", ColorRender.renderCssAttributeValue(background));
        }
        Color foreground = (Color) menu.getRenderProperty(PullDownMenu.PROPERTY_FOREGROUND);
        if (foreground != null) {
            initElement.setAttribute("default-foreground", ColorRender.renderCssAttributeValue(foreground));
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