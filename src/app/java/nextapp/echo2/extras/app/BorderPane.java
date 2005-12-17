package nextapp.echo2.extras.app;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.FillImageBorder;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.Pane;

/**
 * A container which renders a <code>FillImageBorder</code> around its
 * content.
 */
public class BorderPane extends Component 
implements Pane {
    
    public static final String PROPERTY_BORDER = "border";
    public static final String PROPERTY_INSETS = "insets";
    
    /**
     * Returns the configured border.
     * 
     * @return the border
     */
    public FillImageBorder getBorder() {
        return (FillImageBorder) getProperty(PROPERTY_BORDER);
    }
    /**
     * Returns the inset margin.
     * 
     * @return the inset margin
     */
    public Insets getInsets() {
        return (Insets) getProperty(PROPERTY_INSETS);
    }
    
    /**
     * Sets the border.
     * 
     * @param newValue the new border
     */
    public void setBorder(FillImageBorder newValue) {
        setProperty(PROPERTY_BORDER, newValue);
    }
    
    /**
     * Sets the inset margin.
     * 
     * @param newValue the new inset margin
     */
    public void setInsets(Insets newValue) {
        setProperty(PROPERTY_INSETS, newValue);
    }
}
