package nextapp.echo2.extras.app;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Component;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.Pane;
import nextapp.echo2.app.PaneContainer;

/**
 * A <code>PaneContainer</code> which contains multiple panes in vertically 
 * arranged tabs that slide up and down to reveal a single child 
 * <code>Pane</code> at a time.
 */
public class AccordionPane extends Component
implements Pane, PaneContainer {

    public static final String ACTIVE_TAB_CHANGED_PROPERTY = "activeTab";
    public static final String INPUT_ACTIVE_TAB = "activeTab";
    
    public static final String PROPERTY_TAB_BACKGROUND = "tabBackground";
    public static final String PROPERTY_TAB_BORDER = "tabBorder";
    public static final String PROPERTY_TAB_FOREGROUND = "tabForeground";
    public static final String PROPERTY_TAB_INSETS = "tabInsets";
    public static final String PROPERTY_TAB_ROLLOVER_FOREGROUND = "tabRolloverForeground";
    public static final String PROPERTY_TAB_ROLLOVER_BACKGROUND = "tabRolloverBackground";
    public static final String PROPERTY_TAB_ROLLOVER_BORDER = "tabRolloverBorder";

    /**
     * <code>renderId</code> of the active tab <code>Component</code>.
     */
    private String activeTabRenderId;

    /**
     * Default constructor.
     */
    public AccordionPane() {
        super();
    }
    
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
     * Returns the tab background color.
     *
     * @return the tab background color
     */
    public Color getTabBackground() {
        return (Color) getProperty(PROPERTY_TAB_BACKGROUND);
    }
    
    /**
     * Returns the tab border.
     *
     * @return the tab border
     */
    public Border getTabBorder() {
        return (Border) getProperty(PROPERTY_TAB_BORDER);
    }
    
    /**
     * Returns the tab foreground color.
     *
     * @return the tab foreground color
     */
    public Color getTabForeground() {
        return (Color) getProperty(PROPERTY_TAB_FOREGROUND);
    }
    
    /**
     * Returns the tab inset margin.
     *
     * @return the tab inset margin
     */
    public Insets getTabInsets() {
        return (Insets) getProperty(PROPERTY_TAB_INSETS);
    }
    
    /**
     * Returns the tab rollover background color.
     *
     * @return the tab rollover background color
     */
    public Color getTabRolloverBackground() {
        return (Color) getProperty(PROPERTY_TAB_ROLLOVER_BACKGROUND);
    }
    
    /**
     * Returns the tab rollover border.
     *
     * @return the tab rollover border
     */
    public Border getTabRolloverBorder() {
        return (Border) getProperty(PROPERTY_TAB_ROLLOVER_BORDER);
    }
    
    /**
     * Returns the tab rollover foreground color.
     *
     * @return the tab rollover foreground color
     */
    public Color getTabRolloverForeground() {
        return (Color) getProperty(PROPERTY_TAB_ROLLOVER_FOREGROUND);
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
     * Sets the tab background color.
     *
     * @param newValue the new tab background color
     */
    public void setTabBackground(Color newValue) {
        setProperty(PROPERTY_TAB_BACKGROUND, newValue);
    }
    
    /**
     * Sets the tab border.
     *
     * @param newValue the new tab border
     */
    public void setTabBorder(Border newValue) {
        setProperty(PROPERTY_TAB_BORDER, newValue);
    }
    
    /**
     * Sets the tab foreground color.
     *
     * @param newValue the new tab foreground color
     */
    public void setTabForeground(Color newValue) {
        setProperty(PROPERTY_TAB_FOREGROUND, newValue);
    }

    /**
     * Sets the tab inset margin.
     *
     * @param newValue the new tab inset margin
     */
    public void setTabInsets(Insets newValue) {
        setProperty(PROPERTY_TAB_INSETS, newValue);
    }

    /**
     * Sets the tab rollover background color.
     *
     * @param newValue the new tab rollover background color
     */
    public void setTabRolloverBackground(Color newValue) {
        setProperty(PROPERTY_TAB_ROLLOVER_BACKGROUND, newValue);
    }
    
    /**
     * Sets the tab rollover border.
     *
     * @param newValue the new tab rollover border
     */
    public void setTabRolloverBorder(Border newValue) {
        setProperty(PROPERTY_TAB_ROLLOVER_BORDER, newValue);
    }
    
    /**
     * Sets the tab rollover foreground color.
     *
     * @param newValue the new tab rollover foreground color
     */
    public void setTabRolloverForeground(Color newValue) {
        setProperty(PROPERTY_TAB_ROLLOVER_FOREGROUND, newValue);
    }
}
