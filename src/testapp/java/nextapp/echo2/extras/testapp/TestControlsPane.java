/* 
 * This file is part of the Echo2 Extras Project.
 * Copyright (C) 2005-2006 NextApp, Inc.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

package nextapp.echo2.extras.testapp;

import nextapp.echo2.app.Button;
import nextapp.echo2.app.Column;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.AccordionPane;
import nextapp.echo2.extras.app.layout.AccordionPaneLayoutData;

public class TestControlsPane extends SplitPane {

    public static final String CATEGORY_CONTENT = "Add / Remove Content";
    public static final String CATEGORY_PROPERTIES = "Properties";
    public static final String CATEGORY_SELECTION = "Selection";
    public static final String CATEGORY_INTEGRATION = "Integration Tests";
    
    private AccordionPane controlGroupsAccordion;
    
    public TestControlsPane(String testTitle) {
        super(SplitPane.ORIENTATION_VERTICAL, new Extent(40));

        Label titleLabel = new Label(testTitle);
        titleLabel.setStyleName("TitleLabel2");
        add(titleLabel);
        
        controlGroupsAccordion = new AccordionPane();
        controlGroupsAccordion.setStyleName("TestControlsAccordion");
        add(controlGroupsAccordion);
    }
    
    public void addButton(String category, String label, ActionListener listener) {
        Column controlsColumn = (Column) getComponent(category);
        if (controlsColumn == null) {
            controlsColumn = new Column();
            controlsColumn.setId(category);
            controlsColumn.setInsets(new Insets(10, 5));
            AccordionPaneLayoutData layoutData = new AccordionPaneLayoutData();
            layoutData.setTitle(category);
            controlsColumn.setLayoutData(layoutData);
            controlGroupsAccordion.add(controlsColumn);
        }
        
        Button button = new Button(label);
        button.setStyleName("Default");
        button.addActionListener(listener);
        controlsColumn.add(button);
    }
}
