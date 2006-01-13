package nextapp.echo2.extras.app;

import nextapp.echo2.app.Component;
import nextapp.echo2.extras.app.menu.DefaultMenuModel;
import nextapp.echo2.extras.app.menu.MenuModel;

public class PullDownMenu extends Component {
    
    public static String MODEL_CHANGED_PROPERTY = "model";
    
    private MenuModel model;
    
    /**
     * Creates a new <code>PullDownMenu</code> with an empty
     * <code>DefaultMenuModel</code> as its model.
     */
    public PullDownMenu() {
        this(new DefaultMenuModel());
    }
    
    /**
     * Creates a new <code>PullDownMenu</code> displaying the specified 
     * <code>MenuModel</code>.
     * 
     * @param model the model
     */
    public PullDownMenu(MenuModel model) {
        super();
        setModel(model);
    }
    
    /**
     * Returns the model
     * 
     * @return the model
     */
    public MenuModel getModel() {
        return model;
    }
    
    /**
     * Sets the model.
     * 
     * @param newValue the new model
     */
    public void setModel(MenuModel newValue) {
        MenuModel oldValue = model;
        model = newValue;
        firePropertyChange(MODEL_CHANGED_PROPERTY, oldValue, newValue);
    }

}
