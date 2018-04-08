/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
/* global CKEDITOR */
YUI.add('ez-alloyeditor-toolbar-config-block-floating-base', function (Y) {
    "use strict";
     /**
     * Provides base methods to toolbar dedicated to block element (heading,
     * paragraph, ...).
     *
     * @module ez-alloyeditor-toolbar-config-block-floating-base
     */
    Y.namespace('eZ.AlloyEditorToolbarConfig');

    var ReactDOM = window.ReactDOM;
    var TOOLBAR_FIXED_CLASS = 'ae-toolbar-styles-fixed';

    function getScrollY(editor, toolbar) {
        var container = (new Y.Node(editor)).ancestor('.ez-main-content'),
            scrollY;

        if (container.getStyle('overflow') === 'auto') {
            scrollY = container.getDOMNode().scrollTop;
        } else {
            scrollY = window.scrollY;
        }

        return scrollY;
    }

    function isToolbarOutOfViewport (editor, toolbar) {
        var container = (new Y.Node(editor)).ancestor('.ez-main-content'),
            scrollY;

        if (container.getStyle('overflow') === 'auto') {
            scrollY = container.getDOMNode().scrollTop;
        } else {
            scrollY = window.scrollY;
        }

        return scrollY >= (editor.offsetTop - toolbar.offsetHeight) &&
               scrollY <= (editor.offsetTop + editor.offsetHeight + toolbar.offsetHeight);
    }

    function setPositionFor (block, editor) {
        console.log("setPositionFor");

        /* jshint validthis: true */
        var editorNode = editor.element.$,
            toolbarNode = (new CKEDITOR.dom.element(ReactDOM.findDOMNode(this))).$;

        var scrollY = getScrollY(editorNode, toolbarNode);

        toolbarNode.style.left = editorNode.offsetLeft + 'px';
        toolbarNode.style.top = (editorNode.offsetTop - toolbarNode.offsetHeight - scrollY) + 'px';

        if (isToolbarOutOfViewport(editorNode, toolbarNode)) {
            toolbarNode.classList.add(TOOLBAR_FIXED_CLASS);
        } else {
            toolbarNode.classList.remove(TOOLBAR_FIXED_CLASS);
        }

        return true;
    }

    Y.eZ.AlloyEditorToolbarConfig.BlockFloatingBase = {
        /**
         * Returns the arrow box classes for the toolbar. The toolbar is
         * always positioned above its related block and has a special class to
         * move its tail on the left.
         *
         * @method getArrowBoxClasses
         * @return {String}
         */
        getArrowBoxClasses: function () {
            return 'ae-toolbar-floating ae-arrow-box ae-arrow-box-bottom ez-ae-arrow-box-left';
        },

        /**
         * Sets the position of the toolbar. It overrides the default styles
         * toolbar positioning to position the toolbar just above its related
         * block element. The related block element is the block indicated in
         * CKEditor's path or the target of the editorEvent event.
         *
         * @method setPosition
         * @param {Object} payload
         * @param {AlloyEditor.Core} payload.editor
         * @param {Object} payload.selectionData
         * @param {Object} payload.editorEvent
         * @return {Boolean} true if the method was able to position the
         * toolbar
         */
        setPosition: function (payload) {
            var editor = payload.editor.get('nativeEditor'),
                block = editor.elementPath().block;

            if ( !block ) {
                block = new CKEDITOR.dom.element(payload.editorEvent.data.nativeEvent.target);
            }
            return setPositionFor.call(this, block, editor);
        },
    };
});
