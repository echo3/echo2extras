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

import nextapp.echo2.app.Component;
import nextapp.echo2.app.ContentPane;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.PullDownMenu;
import nextapp.echo2.extras.app.menu.DefaultMenuModel;
import nextapp.echo2.extras.app.menu.DefaultOptionModel;
import nextapp.echo2.extras.app.menu.SeparatorModel;

/**
 * Main InteractiveTest <code>ContentPane</code> which displays a menu
 * of available tests.
 */
public class TestPane extends ContentPane {
    
    private ActionListener commandActionListener = new ActionListener() {
        
        /**
         * @see nextapp.echo2.app.event.ActionListener#actionPerformed(nextapp.echo2.app.event.ActionEvent)
         */
        public void actionPerformed(ActionEvent e) {
            try {
                if (e.getActionCommand() == null) {
                    InteractiveApp.getApp().displayWelcomePane();
                } else {
                    String screenClassName = "nextapp.echo2.extras.testapp.testscreen." + e.getActionCommand();
                    Class screenClass = Class.forName(screenClassName);
                    Component content = (Component) screenClass.newInstance();
                    if (menuVerticalPane.getComponentCount() > 1) {
                        menuVerticalPane.remove(1);
                    }
                    menuVerticalPane.add(content);
                }
            } catch (ClassNotFoundException ex) {
                throw new RuntimeException(ex.toString());
            } catch (InstantiationException ex) {
                throw new RuntimeException(ex.toString());
            } catch (IllegalAccessException ex) {
                throw new RuntimeException(ex.toString());
            }
        }
    };
    
    private SplitPane menuVerticalPane;
    
    public TestPane() {
        super();
        
        DefaultMenuModel menuBarMenu = new DefaultMenuModel();

        DefaultMenuModel testsMenu = new DefaultMenuModel("Test");
        testsMenu.addItem(new DefaultOptionModel("Accordion Pane", null, "AccordionPaneTest"));
        testsMenu.addItem(new DefaultOptionModel("Border Pane", null, "BorderPaneTest"));
        testsMenu.addItem(new DefaultOptionModel("Calendar Select", null, "CalendarSelectTest"));
        testsMenu.addItem(new DefaultOptionModel("Color Select", null, "ColorSelectTest"));
        testsMenu.addItem(new DefaultOptionModel("Pull Down Menu", null, "PullDownMenuTest"));
        testsMenu.addItem(new DefaultOptionModel("Tab Pane", null, "TabPaneTest"));
        testsMenu.addItem(new SeparatorModel());
        testsMenu.addItem(new DefaultOptionModel("Exit", null, null));
        menuBarMenu.addItem(testsMenu);

        DefaultMenuModel optionsMenu = new DefaultMenuModel("Options");
        menuBarMenu.addItem(optionsMenu);

        SplitPane titleVerticalPane = new SplitPane(SplitPane.ORIENTATION_VERTICAL);
        titleVerticalPane.setStyleName("TestPane");
        add(titleVerticalPane);

        Label titleLabel = new Label("NextApp Echo2 Extras Test Application");
        titleLabel.setStyleName("TitleLabel");
        titleVerticalPane.add(titleLabel);
        
        menuVerticalPane = new SplitPane(SplitPane.ORIENTATION_VERTICAL, new Extent(26));
        titleVerticalPane.add(menuVerticalPane);
        
        PullDownMenu menu = new PullDownMenu(menuBarMenu);
        menu.addActionListener(commandActionListener);
        menuVerticalPane.add(menu);
    }
}
