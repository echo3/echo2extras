/* 
 * This file is part of the Echo2 Extras Project.
 * Copyright (C) 2002-2009 NextApp, Inc.
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
import nextapp.echo2.app.Color;
import nextapp.echo2.app.Column;
import nextapp.echo2.app.ContentPane;
import nextapp.echo2.app.Extent;
import nextapp.echo2.app.Font;
import nextapp.echo2.app.Insets;
import nextapp.echo2.app.Label;
import nextapp.echo2.app.Row;
import nextapp.echo2.app.SplitPane;
import nextapp.echo2.app.WindowPane;
import nextapp.echo2.app.event.ActionEvent;
import nextapp.echo2.app.event.ActionListener;
import nextapp.echo2.app.layout.SplitPaneLayoutData;

/**
 * A <code>WindowPane</code> which contains an event console.
 */
public class ConsoleWindowPane extends WindowPane {
    
    private Column column;
    private ContentPane logPane;
    
    public ConsoleWindowPane() {
        super();
        setTitle("Console");
        setStyleName("Default");
        
        SplitPane splitPane = new SplitPane(SplitPane.ORIENTATION_VERTICAL_BOTTOM_TOP, new Extent(32));
        add(splitPane);
        
        Row controlRow = new Row();
        controlRow.setStyleName("ControlPane");
        splitPane.add(controlRow);
        
        Button button = new Button("Clear", Styles.ICON_24_NO);
        button.setStyleName("ControlPane.Button");
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                column.removeAll();
            }
        });
        controlRow.add(button);
        
        SplitPaneLayoutData splitPaneLayoutData;
        logPane = new ContentPane();
        logPane.setFont(new Font(Font.MONOSPACE, Font.PLAIN, new Extent(10)));
        logPane.setForeground(Color.GREEN);
        splitPaneLayoutData = new SplitPaneLayoutData();
        splitPaneLayoutData.setBackground(Color.BLACK);
        logPane.setLayoutData(splitPaneLayoutData);
        splitPane.add(logPane);
        
        column = new Column();
        column.setInsets(new Insets(5));
        logPane.add(column);
    }
    
    public void writeMessage(String message) {
        column.add(new Label(message));
        logPane.setVerticalScroll(new Extent(-1));
    }
}
