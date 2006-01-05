package nextapp.echo2.extras.app;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Pane;
import nextapp.echo2.app.PaneContainer;

/**
 * A container pane which displays child components in separate tabs.
 */
public class TabPane extends Component 
implements Pane, PaneContainer {
    
    public static final String ACTIVE_TAB_CHANGED_PROPERTY = "activeTab";
    public static final String INPUT_ACTIVE_TAB = "activeTab";

    public static final String PROPERTY_BORDER = "border";
    public static final String PROPERTY_BORDER_TYPE = "borderType";
    public static final String PROPERTY_TAB_HEIGHT = "tabHeight";
    public static final String PROPERTY_TAB_POSITION = "tabPosition";
    public static final String PROPERTY_TAB_WIDTH = "tabWidth";
    
    /**
     * Constant for the <code>borderType</code> property indicating that no 
     * border should be drawn around the content.
     */
    public static final int BORDER_TYPE_NONE = 0;

    /**
     * Constant for the <code>borderType</code> property indicating that a
     * border should be drawn immediately adjacent to the tabs only.
     * If the tabs are positioned at the top of the <code>TabPane</code> the
     * border will only be drawn directly beneath the tabs with this setting.  
     * If the tabs are positioned at the bottom of the <code>TabPane</code> the
     * border will only be drawn directly above the tabs with this setting.
     * This is the default rendering style.
     */
    public static final int BORDER_TYPE_ADJACENT_TO_TABS = 1;

    /**
     * Constant for the <code>borderType</code> property indicating that
     * borders should be drawn above and below the content, but not at its 
     * sides.
     */
    public static final int BORDER_TYPE_PARALLEL_TO_TABS = 2;
    
    /**
     * Constant for the <code>borderType</code> property indicating that
     * borders should be drawn on all sides of the content.
     */
    public static final int BORDER_TYPE_SURROUND = 3;
    
    /**
     * Constant for the <code>tabPosition</code> property indicating that the
     * tabs should be rendered beneath the content.
     */
    public static final int TAB_POSITION_BOTTOM = 1;
    
    /**
     * Constant for the <code>tabPosition</code> property indicating that the
     * tabs should be rendered above the content.
     * This is the default rendering style.
     */
    public static final int TAB_POSITION_TOP = 0;
    
    /**
     * <code>renderId</code> of the active tab <code>Component</code>.
     */
    private String activeTabRenderId;
    
    /**
     * Returns the index of the active tab.
     * 
     * @return the active tab index
     */
    public int getActiveTabIndex() {
        if (activeTabRenderId == null) {
            return 0;
        }
        int length = getComponentCount();
        for (int i = 0; i < length; ++i) {
            if (activeTabRenderId.equals(getComponent(i).getRenderId())) {
                return i;
            }
        }
        return 0;
    }
    
    /**
     * Returns the <code>Component</code> contained in the active tab.
     * 
     * @return the active tab <code>Component</code>
     */
    public Component getActiveTab() {
        int activeTabIndex = getActiveTabIndex();
        if (activeTabIndex < getComponentCount()) {
            return getComponent(activeTabIndex);
        } else {
            return null;
        }
    }
    
    /**
     * Returns the <code>Border</code> used to draw the <code>TabPane</code>.
     * 
     * @return the border
     */
    public Border getBorder() {
        return (Border) getProperty(PROPERTY_BORDER);
    }
    
    /**
     * Returns the mode in which the border will be drawn around the 
     * <code>TabPane</code>.
     * 
     * @return the border border type, one of the following values:
     *         <ul>
     *          <li><code>BORDER_TYPE_NONE</code></li>
     *          <li><code>BORDER_TYPE_ADJACENT_TO_TABS</code> (the default)</li>
     *          <li><code>BORDER_TYPE_PARALLEL_TO_TABS</code></li>
     *          <li><code>BORDER_TYPE_SURROUND</code></li>
     *         </ul>
     */
    public int getBorderType() {
        Integer value = (Integer) getProperty(PROPERTY_BORDER_TYPE);
        if (value == null) {
            return BORDER_TYPE_ADJACENT_TO_TABS;
        } else {
            return value.intValue();
        }
    }
    
    /**
     * Returns the height of an individual tab.
     * 
     * @return the tab height
     */
    public Extent getTabHeight() {
        return (Extent) getProperty(PROPERTY_TAB_HEIGHT);
    }
    
    /**
     * Returns the position where the tabs are located relative to the pane 
     * content.
     * 
     * @return the tab position, one of the following values:
     *         <ul>
     *          <li><code>TAB_POSITION_TOP</code></li>
     *          <li><code>TAB_POSITION_BOTTOM</code></li>
     *         </ul>
     */
    public int getTabPosition() {
        Integer tabPosition = (Integer) getProperty(PROPERTY_TAB_POSITION);
        return tabPosition == null ? TAB_POSITION_TOP : tabPosition.intValue();
    }
    
    /**
     * Returns the width of an individual tab.
     * 
     * @return the tab width
     */
    public Extent getTabWidth() {
        return (Extent) getProperty(PROPERTY_TAB_WIDTH);
    }
    
    /**
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String inputName, Object inputValue) {
        super.processInput(inputName, inputValue);
        if (inputName.equals(INPUT_ACTIVE_TAB)) {
            setActiveTab((Component) inputValue);
        }
    }
    
    /**
     * Sets the active tab.
     * 
     * @param newValue the child <code>Component</code> whose tab should 
     *        be displayed.
     */
    public void setActiveTab(Component newValue) {
        activeTabRenderId = newValue == null ? null : newValue.getRenderId();
        firePropertyChange(ACTIVE_TAB_CHANGED_PROPERTY, null, null);
    }
    
    /**
     * Sets the active tab index.
     * 
     * @param newValue the index of the child <code>Component</code> whose tab
     *        should be displayed
     */
    public void setActiveTabIndex(int newValue) {
        if (newValue < getComponentCount()) {
            setActiveTab(getComponent(newValue));
        }
    }

    /**
     * Sets the <code>Border</code> used to draw the <code>TabPane</code>.
     * 
     * @param newValue the new border
     */
    public void setBorder(Border newValue) {
        setProperty(PROPERTY_BORDER, newValue);
    }
    
    /**
     * Sets the mode in which the border will be drawn around the 
     * <code>TabPane</code>.
     * 
     * @param newValue the new border type one of the following values:
     *        <ul>
     *         <li><code>BORDER_TYPE_NONE</code></li>
     *         <li><code>BORDER_TYPE_ADJACENT_TO_TABS</code> (the default)</li>
     *         <li><code>BORDER_TYPE_PARALLEL_TO_TABS</code></li>
     *         <li><code>BORDER_TYPE_SURROUND</code></li>
     *        </ul>
     */
    public void setBorderType(int newValue) {
        setProperty(PROPERTY_BORDER_TYPE, new Integer(newValue));
    }
    
    /**
     * Sets the height of an individual tab.
     * 
     * @param newValue the new tab height
     */
    public void setTabHeight(Extent newValue) {
        setProperty(PROPERTY_TAB_HEIGHT, newValue);
    }
    
    /**
     * Sets the position where the tabs are located relative to the pane 
     * content.
     * 
     * @param newValue the new tab position, one of the following values:
     *        <ul>
     *         <li><code>TAB_POSITION_TOP</code></li>
     *         <li><code>TAB_POSITION_BOTTOM</code></li>
     *        </ul>
     */
    public void setTabPosition(int newValue) {
        setProperty(PROPERTY_TAB_POSITION, new Integer(newValue));
    }

    /**
     * Sets the width of an individual tab.
     * 
     * @param newValue the new tab width
     */
    public void setTabWidth(Extent newValue) {
        setProperty(PROPERTY_TAB_WIDTH, newValue);
    }
}
