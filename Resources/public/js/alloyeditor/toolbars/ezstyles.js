/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
// **NOTICE:**
// THIS IS AN AUTO-GENERATED FILE
// DO YOUR MODIFICATIONS IN THE CORRESPONDING .jsx FILE
// AND REGENERATE IT WITH: grunt jsx
// END OF NOTICE
YUI.add('ez-alloyeditor-toolbar-ezstyles', function (Y) {
    "use strict";
    /**
     * Provides the `ezadd` toolbar
     *
     * @module ez-alloyeditor-toolbar-ezadd
     */
    Y.namespace('eZ');

    var AlloyEditor = Y.eZ.AlloyEditor,
        React = Y.eZ.React,
        ToolbarStyles = Y.extend(
            React.createClass({
                render: function () {}
            }),
            AlloyEditor.Toolbars.styles,
            {},
            AlloyEditor.Toolbars.styles
        );

    /**
     * The `ezstyles` toolbar. It extends the AlloyEditor's `styles` toolbar to be
     * rendered even if the focused element in the editor is a non editable
     * element. This is useful so that it's possible to add something after a
     * CKEditor widget (ie embed or image).
     *
     * @namespace eZ.AlloyEditor.Toolbars
     * @class ezstyles
     * @constructor
     * @extends AlloyEditor.Toolbars.styles
     */
    ToolbarStyles.key = 'ezstyles';

    ToolbarStyles.prototype.render = AlloyEditor.Toolbars.styles.prototype.render;

    AlloyEditor.Toolbars[ToolbarStyles.key] = ToolbarStyles;
});
