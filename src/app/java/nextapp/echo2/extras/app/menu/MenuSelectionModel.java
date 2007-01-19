package nextapp.echo2.extras.app.menu;

import nextapp.echo2.app.event.ChangeListener;

public interface MenuSelectionModel {
    
    void addChangeListener(ChangeListener l);
    
    void removeChangeListener(ChangeListener l);
    
    void setSelectedId(String id);
    
    String getSelectedId();
    
}
