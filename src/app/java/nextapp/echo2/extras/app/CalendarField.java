package nextapp.echo2.extras.app;

import java.util.Date;

import nextapp.echo2.app.Border;
import nextapp.echo2.app.Component;

/**
 * A user-input component which allows for the selection of a single date.
 */
public class CalendarField extends Component {

    public static final String DATE_CHANGED_PROPERTY = "date";
    public static final String PROPERTY_BORDER = "border";
    
    private Date date;
    
    /**
     * Creates a new <code>CalendarField</code>.
     */
    public CalendarField() {
        this(null);
    }
    
    /**
     * Creates a new <code>CalendarField</code>.
     * 
     * @param date the initially selected date
     */
    public CalendarField(Date date) {
        super();
        this.date = date;
    }
    
    /**
     * Returns the border surrounding the displayed calendar month.
     * 
     * @return the border
     */
    public Border getBorder() {
        return (Border) getProperty(PROPERTY_BORDER);
    }
    
    /**
     * Returns the selected date.
     * 
     * @return the selected date
     */
    public Date getDate() {
        return date;
    }
    
    /**
     * Sets the border surrounding the displayed calendar month.
     * 
     * @param newValue the new border
     */
    public void setBorder(Border newValue) {
        setProperty(PROPERTY_BORDER, newValue);
    }
    
    /**
     * Sets the selected date.
     * 
     * @param newValue the new date
     */
    public void setDate(Date newValue) {
        Date oldValue = date;
        date = newValue;
        firePropertyChange(DATE_CHANGED_PROPERTY, oldValue, newValue);
    }

    /**
     * @see nextapp.echo2.app.Component#processInput(java.lang.String, java.lang.Object)
     */
    public void processInput(String inputName, Object inputValue) {
        if (DATE_CHANGED_PROPERTY.equals(inputName)) {
            setDate((Date) inputValue);
        }
    }
}
