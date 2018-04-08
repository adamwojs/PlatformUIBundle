/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-alloyeditor-toolbar-ezadd', function (Y) {
    "use strict";
    /**
     * Provides the `ezadd` toolbar
     *
     * @module ez-alloyeditor-toolbar-ezadd
     */
    Y.namespace('eZ');

    var AlloyEditor = Y.eZ.AlloyEditor,
        React = Y.eZ.React,
        ReactDOM = window.ReactDOM,
        ToolbarAdd = Y.extend(
            React.createClass({
                // componentDidMount: function() {},
                // componentDidUpdate: function() {},
                // doUpdatePosition: function() {},
                render: function () {}
            }), AlloyEditor.Toolbars.add,
            {}, AlloyEditor.Toolbars.add
        );

    /**
     * The `ezadd` toolbar. It extends the AlloyEditor's `add` toolbar to be
     * rendered even if the focused element in the editor is a non editable
     * element. This is useful so that it's possible to add something after a
     * CKEditor widget (ie embed or image).
     *
     * @namespace eZ.AlloyEditor.Toolbars
     * @class ezadd
     * @constructor
     * @extends AlloyEditor.Toolbars.add
     */

    ToolbarAdd.key = 'ezadd';

    // ToolbarAdd.prototype.componentDidMount = function () {
    //     this.doUpdatePosition();
    // };
    //
    // ToolbarAdd.prototype.componentDidUpdate = function () {
    //     this.doUpdatePosition();
    //
    //     // In case of exclusive rendering, focus the first descendant (button)
    //     // so the user will be able to start interacting with the buttons immediately.
    //     if (this.props.renderExclusive) {
    //         this.focus();
    //     }
    // };

    /**
     * Renders the `ezadd` toolbar. It overrides the AlloyEditor `add` toolbar
     * implementation to:
     *  * render the toolbar even if the focused element is not contenteditable
     *  * not render the toolbar if there's a text selection
     *
     * @method render
     */
    ToolbarAdd.prototype.render = function () {
        var buttons, className,
            selectionData = this.props.selectionData;

        if ( selectionData && selectionData.text ) {
            return null;
        }
        buttons = this._getButtons();
        className = this._getToolbarClassName();
        return (
            <div
                aria-label={AlloyEditor.Strings.add} className={className}
                data-tabindex={this.props.config.tabIndex || 0} onFocus={this.focus}
                onKeyDown={this.handleKey} role="toolbar" tabIndex="-1">
                <div className="ae-container">
                    {buttons}
                </div>
            </div>
        );
    };

    // ToolbarAdd.prototype.doUpdatePosition = function () {
    //     console.log("_udpatePosition from ezadd");
    //     // If component is not mounted, there is nothing to do
    //     if (!ReactDOM.findDOMNode(this)) {
    //         return;
    //     }
    //
    //     var domNode = ReactDOM.findDOMNode(this);
    //     var domElement = new CKEDITOR.dom.element(domNode);
    //     var region;
    //     if (this.props.selectionData) {
    //         region = this.props.selectionData.region;
    //     }
    //
    //     if (region) {
    //         var POSITION_LEFT = 1;
    //         var POSITION_RIGHT = 2;
    //         var domNode = ReactDOM.findDOMNode(this);
    //         var domElement = new CKEDITOR.dom.element(domNode);
    //         var startRect = region.startRect || region;
    //         var nativeEditor = this.props.editor.get('nativeEditor');
    //         var clientRect = nativeEditor.editable().getClientRect();
    //         var offsetLeft;
    //         var position = this.props.config.position || this.props.position;
    //
    //         if (position === POSITION_LEFT) {
    //             offsetLeft = clientRect.left - domNode.offsetWidth - this.props.gutterExclusive.left + 'px';
    //         } else {
    //             offsetLeft = clientRect.right + this.props.gutterExclusive.left + 'px';
    //         }
    //
    //         var range = this.props.editor._editor.getSelection().getRanges()[0];
    //         var offsetTop;
    //
    //         var startContainer = range.startContainer.$;
    //         if (startContainer instanceof Text) {
    //             startContainer = startContainer.parentNode;
    //         }
    //
    //         offsetTop = startContainer.offsetTop + 'px'
    //
    //         domNode.style.left = offsetLeft;
    //         domNode.style.top = offsetTop;
    //     }
    // };

    AlloyEditor.Toolbars[ToolbarAdd.key] = ToolbarAdd;
});
