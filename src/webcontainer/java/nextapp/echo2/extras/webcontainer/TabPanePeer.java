package nextapp.echo2.extras.webcontainer;

import org.w3c.dom.Document;
import org.w3c.dom.DocumentFragment;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.update.ServerComponentUpdate;
import nextapp.echo2.extras.app.TabPane;
import nextapp.echo2.extras.app.layout.TabPaneLayoutData;
import nextapp.echo2.webcontainer.ComponentSynchronizePeer;
import nextapp.echo2.webcontainer.ContainerInstance;
import nextapp.echo2.webcontainer.DomUpdateSupport;
import nextapp.echo2.webcontainer.RenderContext;
import nextapp.echo2.webcontainer.propertyrender.ExtentRender;
import nextapp.echo2.webrender.ClientProperties;
import nextapp.echo2.webrender.ServerMessage;
import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.output.CssStyle;
import nextapp.echo2.webrender.servermessage.DomUpdate;
import nextapp.echo2.webrender.service.JavaScriptService;

/**
 * <code>ComponentSynchronizePeer</code> implementation for synchronizing
 * <code>TabPane</code> components.
 */
public class TabPanePeer 
implements ComponentSynchronizePeer, DomUpdateSupport {

    private static void renderCssPositionExpression(CssStyle cssStyle, String parentElementId, int position, boolean vertical) {
        if (vertical) {
            cssStyle.setAttribute("height", 
                    "expression((document.getElementById('" + parentElementId + "').clientHeight-" + position + ")+'px')");
        } else {
            cssStyle.setAttribute("width", 
                    "expression((document.getElementById('" + parentElementId + "').clientWidth-" + position + ")+'px')");
        }
    }

    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service TAB_PANE_SERVICE = JavaScriptService.forResource("Echo2Extras.TabPane",
            "/nextapp/echo2/extras/webcontainer/resource/js/TabPane.js");

    static {
        WebRenderServlet.getServiceRegistry().add(TAB_PANE_SERVICE);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#getContainerId(nextapp.echo2.app.Component)
     */
    public String getContainerId(Component child) {
        return ContainerInstance.getElementId(child.getParent()) + "_content_" + child.getId();
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderAdd(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String, nextapp.echo2.app.Component)
     */
    public void renderAdd(RenderContext rc, ServerComponentUpdate update, String targetId, Component component) {
        DocumentFragment htmlFragment = rc.getServerMessage().getDocument().createDocumentFragment();
        renderHtml(rc, update, htmlFragment, component);
        DomUpdate.renderElementAdd(rc.getServerMessage(), targetId, htmlFragment);
    }

    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderDispose(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, nextapp.echo2.app.Component)
     */
    public void renderDispose(RenderContext rc, ServerComponentUpdate update, Component component) {
        rc.getServerMessage().addLibrary(TAB_PANE_SERVICE.getId());
        renderDisposeDirective(rc, (TabPane) component);
    }

    /**
     * Renders a dispose directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param tabPane the <code>TabPane</code> being rendered
     */
    private void renderDisposeDirective(RenderContext rc, TabPane tabPane) {
        String elementId = ContainerInstance.getElementId(tabPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_PREREMOVE, 
                "ExtrasTabPane.MessageProcessor", "dispose");
        initElement.setAttribute("eid", elementId);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.DomUpdateSupport#renderHtml(nextapp.echo2.webcontainer.RenderContext, 
     *      nextapp.echo2.app.update.ServerComponentUpdate, org.w3c.dom.Node, nextapp.echo2.app.Component)
     */
    public void renderHtml(RenderContext rc, ServerComponentUpdate update, Node parentNode, Component component) {
        ServerMessage serverMessage = rc.getServerMessage();
        serverMessage.addLibrary(TAB_PANE_SERVICE.getId());
        TabPane tabPane = (TabPane) component;
        renderInitDirective(rc, tabPane);
        Document document = serverMessage.getDocument();
        
        Element divElement = document.createElement("div");
        String elementId = ContainerInstance.getElementId(tabPane);
        divElement.setAttribute("id", elementId);
        
        CssStyle divStyle = new CssStyle();
        divStyle.setAttribute("left", "0px;");
        divStyle.setAttribute("top", "0px;");
        divStyle.setAttribute("width", "100%;");
        divStyle.setAttribute("height", "100%;");
        divStyle.setAttribute("position", "absolute");
        divElement.setAttribute("style", divStyle.renderInline());
        
        Component[] childComponents = tabPane.getComponents();
        Element tableElement = document.createElement("table");
        divElement.appendChild(tableElement);
        
        Element tbodyElement = document.createElement("tbody");
        tableElement.appendChild(tbodyElement);
        
        Element trElement = document.createElement("tr");
        tbodyElement.appendChild(trElement);
        
        for (int i = 0; i < childComponents.length; ++i) {
            Element tdElement = document.createElement("td");
            trElement.appendChild(tdElement);
            
            Element tabLabelDivElement = document.createElement("div");
            CssStyle tabLabelDivStyle = new CssStyle();
            tabLabelDivStyle.setAttribute("background-color", "#afafff");
            tabLabelDivStyle.setAttribute("padding", "2px 8px");
            tdElement.setAttribute("style", tabLabelDivStyle.renderInline());
            tdElement.appendChild(tabLabelDivElement);
            
            TabPaneLayoutData tabPaneLayoutData = (TabPaneLayoutData) childComponents[i].getLayoutData();
            String tabTitle = null;
            if (tabPaneLayoutData != null) {
                tabTitle = tabPaneLayoutData.getTitle();
            }
            tdElement.appendChild(document.createTextNode(tabTitle == null ? Integer.toString(i + 1) : tabTitle));
        }
        
        parentNode.appendChild(divElement);
    }
    
    private void renderInitTabDirective(RenderContext rc, TabPane tabPane, int index) {
        boolean renderPositioningBothSides = !rc.getContainerInstance().getClientProperties()
                .getBoolean(ClientProperties.QUIRK_CSS_POSITIONING_ONE_SIDE_ONLY);
        boolean renderSizeExpression = !renderPositioningBothSides && rc.getContainerInstance().getClientProperties()
                .getBoolean(ClientProperties.PROPRIETARY_IE_CSS_EXPRESSIONS_SUPPORTED);

        int tabHeight = ExtentRender.toPixels((Extent) tabPane.getProperty(TabPane.PROPERTY_TAB_HEIGHT), 32);
        
        ServerMessage serverMessage = rc.getServerMessage();
        Document document = serverMessage.getDocument();
        String elementId = ContainerInstance.getElementId(tabPane);
        
        Component childComponent = tabPane.getComponent(index);
        
        Element tabContentDivElement = document.createElement("div");
        tabContentDivElement.setAttribute("id", elementId + "_tabcontent_" + childComponent.getId());
        
        CssStyle tabContentDivStyle = new CssStyle();
        tabContentDivStyle.setAttribute("left", "0px;");
        tabContentDivStyle.setAttribute("top", tabHeight + "px;");
        tabContentDivStyle.setAttribute("width", "100%;");
        tabContentDivStyle.setAttribute("bottom", "0px");
        tabContentDivElement.setAttribute("position", "absolute");
        tabContentDivElement.setAttribute("display", "none");
    }

    /**
     * Renders an initialization directive.
     * 
     * @param rc the relevant <code>RenderContext</code>
     * @param tabPane the <code>TabPane</code> being rendered
     */
    private void renderInitDirective(RenderContext rc, TabPane tabPane) {
        String elementId = ContainerInstance.getElementId(tabPane);
        ServerMessage serverMessage = rc.getServerMessage();
        Element initElement = serverMessage.appendPartDirective(ServerMessage.GROUP_ID_POSTUPDATE, 
                "ExtrasTabPane.MessageProcessor", "init");
        initElement.setAttribute("eid", elementId);
    }
    
    /**
     * @see nextapp.echo2.webcontainer.ComponentSynchronizePeer#renderUpdate(
     *      nextapp.echo2.webcontainer.RenderContext, nextapp.echo2.app.update.ServerComponentUpdate, java.lang.String)
     */
    public boolean renderUpdate(RenderContext rc, ServerComponentUpdate update, String targetId) {
        DomUpdate.renderElementRemove(rc.getServerMessage(), ContainerInstance.getElementId(update.getParent()));
        renderAdd(rc, update, targetId, update.getParent());
        return true;
    }
}
