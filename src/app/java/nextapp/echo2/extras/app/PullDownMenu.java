package nextapp.echo2.extras.app;

import java.util.EventListener;

import nextapp.echo2.app.Component;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.menu.DefaultMenuModel;
import nextapp.echo2.extras.app.menu.MenuModel;
import nextapp.echo2.extras.app.menu.OptionModel;

public class PullDownMenu extends Component {
    
    public static final String MODEL_CHANGED_PROPERTY = "model";
    public static final String INPUT_SELECT = "select";
    
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
     * Adds an <code>ActionListener</code> to be notified when a menu item 
     * is selected.
     * 
     * @param l the listener to add
     */
    public void addActionListener(ActionListener l) {
        getEventListenerList().addListener(ActionListener.class, l);
    }
    
    /**
     * Notifies <code>ActionListener</code>s that an option was chosen. 
     * 
     * @param optionModel the selected <code>OptionModel</code>
     */
    private void fireActionPerformed(OptionModel optionModel) {
        if (!hasEventListenerList()) {
            return;
        }
        ActionEvent e = new ActionEvent(this, optionModel.getActionCommand());
        EventListener[] listeners = getEventListenerList().getListeners(ActionListener.class);
        for (int i = 0; i < listeners.length; ++i) {
            ((ActionListener) listeners[i]).actionPerformed(e);
        }
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
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String name, Object value) {
        if (INPUT_SELECT.equals(name)) {
            OptionModel optionModel = (OptionModel) value;
            fireActionPerformed(optionModel);
        }
    }
    
    /**
     * Removes an <code>ActionListener</code> from being notified when a menu 
     * item is selected.
     * 
     * @param l the listener to remove
     */
    public void removeActionListener(ActionListener l) {
        getEventListenerList().removeListener(ActionListener.class, l);
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
