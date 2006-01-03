/* 
 * This file is part of the Echo Web Application Framework (hereinafter "Echo").
 * Copyright (C) 2002-2005 NextApp, Inc.
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

package nextapp.echo2.extras.testapp.testscreen;

import nextapp.echo2.app.Color;
import nextapp.echo2.app.ContentPane;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.WindowPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.extras.app.CalendarField;
import nextapp.echo2.extras.app.TabPane;
import nextapp.echo2.extras.app.layout.TabPaneLayoutData;
import nextapp.echo2.extras.testapp.ButtonColumn;
import nextapp.echo2.extras.testapp.StyleUtil;

/**
 * Interactive test module for <code>TabPane</code>s.
 */
public class TabPaneTest extends SplitPane {
        
    private int tabNumber;

    public TabPaneTest() {
        
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");
        
        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);
        
        final TabPane tabPane = new TabPane();
        add(tabPane);
        
        controlsColumn.addButton("Set Foreground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                tabPane.setForeground(color);
            }
        });
        
        controlsColumn.addButton("Set Background", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color color = StyleUtil.randomColor();
                tabPane.setBackground(color);
            }
        });

        controlsColumn.addButton("Add TabPane", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (getComponentCount() < 2) {
                    add(tabPane);
                }
            }
        });

        controlsColumn.addButton("Remove TabPane", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                remove(tabPane);
            }
        });

        controlsColumn.addButton("Add Label (No LayoutData)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                tabPane.add(new Label("Generic Label"));
            }
        });

        controlsColumn.addButton("Add Label", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label);
                ++tabNumber;
            }
        });

        controlsColumn.addButton("Add Label (index 0)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Inserted Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label, 0);
                ++tabNumber;
            }
        });
        
        controlsColumn.addButton("Add Label (index 2)", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() < 2) {
                    // Do nothing
                    return;
                }
                Label label = new Label("Tab Pane Child " + tabNumber);
                label.setBackground(StyleUtil.randomBrightColor());
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Inserted Label #" + tabNumber);
                label.setLayoutData(layoutData);
                tabPane.add(label, 2);
                ++tabNumber;
            }
        });
        
        controlsColumn.addButton("Add CalendarField", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                CalendarField calendarField = new CalendarField();
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("Calendar #" + tabNumber++);
                calendarField.setLayoutData(layoutData);
                tabPane.add(calendarField);
            }
        });

        controlsColumn.addButton("Add TabPaneTest", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                TabPaneTest tabPaneTest = new TabPaneTest();
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("TPT #" + tabNumber++);
                tabPaneTest.setLayoutData(layoutData);
                tabPane.add(tabPaneTest);
            }
        });

        controlsColumn.addButton("Add TabPaneTest", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                TabPaneTest tabPaneTest = new TabPaneTest();
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("TPT #" + tabNumber++);
                tabPaneTest.setLayoutData(layoutData);
                tabPane.add(tabPaneTest);
            }
        });

        controlsColumn.addButton("Add ContentPane", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                final ContentPane contentPane = new ContentPane();
                ButtonColumn buttonColumn = new ButtonColumn();
                buttonColumn.addButton("Add WindowPane", new ActionListener(){
                
                    public void actionPerformed(ActionEvent e) {
                        WindowPane windowPane = new WindowPane();
                        windowPane.setStyleName("Default");
                        windowPane.setTitle("Test Window");
                        windowPane.add(new Label(StyleUtil.QUASI_LATIN_TEXT_1));
                        contentPane.add(windowPane);
                    }
                });
                buttonColumn.addButton("Add TabPaneTest WindowPane", new ActionListener(){
                
                    public void actionPerformed(ActionEvent e) {
                        WindowPane windowPane = new WindowPane();
                        windowPane.setStyleName("Default");
                        windowPane.setTitle("Test Window");
                        windowPane.add(new TabPaneTest());
                        contentPane.add(windowPane);
                    }
                });
                contentPane.add(buttonColumn);
                TabPaneLayoutData layoutData = new TabPaneLayoutData();
                layoutData.setTitle("ContentPane #" + tabNumber++);
                contentPane.setLayoutData(layoutData);
                tabPane.add(contentPane);
            }
        });

        controlsColumn.addButton("Remove Child", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (tabPane.getComponentCount() > 0) {
                    tabPane.remove(tabPane.getComponentCount() - 1);
                }
            }
        });

    }
}
