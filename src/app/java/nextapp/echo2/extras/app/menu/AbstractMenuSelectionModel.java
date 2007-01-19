package nextapp.echo2.extras.app.menu;

import java.util.EventListener;

import nextapp.echo2.app.event.ChangeEvent;
import nextapp.echo2.app.event.ChangeListener;
import nextapp.echo2.app.event.EventListenerList;

public abstract class AbstractMenuSelectionModel implements MenuSelectionModel {

    private EventListenerList listenerList = new EventListenerList();

    /**
     * @see nextapp.echo2.extras.app.menu.MenuSelectionModel#addChangeListener(nextapp.echo2.app.event.ChangeListener)
     */
    public void addChangeListener(ChangeListener l) {
        listenerList.addListener(ChangeListener.class, l);
    }

    /**
     * Notifies <code>ChangeListener</code>s of a selection state change.
     */
    protected void fireStateChanged() {
        ChangeEvent e = new ChangeEvent(this);
        EventListener[] listeners = listenerList.getListeners(ChangeListener.class);
        for (int i = 0; i < listeners.length; ++i) {
            ((ChangeListener) listeners[i]).stateChanged(e);
        }
    }

    /**
     * @see nextapp.echo2.extras.app.menu.MenuSelectionModel#removeChangeListener(nextapp.echo2.app.event.ChangeListener)
     */
    public void removeChangeListener(ChangeListener l) {
        listenerList.removeListener(ChangeListener.class, l);
    }

}
