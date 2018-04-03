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

    var ReactDOM = Y.eZ.AlloyEditor.ReactDOM;

    function getScrollParent (editor) {
        var cof = document.querySelector('.ez-view-universaldiscoverycreateview');
        if (cof && cof.contains(editor)) {
            return cof.querySelector('.ez-main-content').scrollTop;
        }

        return window;
    }

    function isToolbarFixed (editor, toolbar) {
        var scrollY;

        var cof = document.querySelector('.ez-view-universaldiscoverycreateview');
        if (cof && cof.contains(editor)) {
            scrollY = cof.querySelector('.ez-main-content').scrollTop;
        } else {
            scrollY = window.scrollY;
        }

        return scrollY >= (editor.offsetTop - toolbar.offsetHeight) &&
               scrollY <= (editor.offsetTop + editor.offsetHeight + toolbar.offsetHeight);
    }

    function setPositionFor (block, editor) {
        console.log("setPositionFor from block-floating-base");
        /* jshint validthis: true */
        var domElement = new CKEDITOR.dom.element(ReactDOM.findDOMNode(this));
        //domElement.addClass('ae-toolbar-transition');
        domElement.setStyles({
            left: editor.element.$.offsetLeft + 'px',
            top: (editor.element.$.offsetTop - domElement.$.offsetHeight) + 'px'
        });

        if (isToolbarFixed(editor.element.$, domElement.$)) {
            domElement.$.classList.add('ae-toolbar-styles-fixed');
        } else {
            domElement.$.classList.remove('ae-toolbar-styles-fixed');
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

        onMountFn: function () {
            this.handleScrollId = Y.eZ.AlloyEditorToolbarConfig.BlockFloatingBase.onScroll.bind(this);
            this.scrollParent = getScrollParent(this.props.editor._editor.element.$);
            console.log("Scroll parent ", this.scrollParent);
            this.scrollParent.addEventListener('scroll', this.handleScrollId);
        },

        onUnmountFn: function () {
            if (this.scrollParent) {
                this.scrollParent.removeEventListener('scroll', this.handleScrollId);
            }
        },

        onComponentWillUpdate: function() {

        },

        onScroll: function (e) {
            console.log('onScroll');
            var editor = this.props.editor._editor.element.$,
                toolbar = ReactDOM.findDOMNode(this);

            if (!toolbar) {
                return ;
            }

            if (isToolbarFixed(editor, toolbar)) {
                toolbar.classList.add('ae-toolbar-styles-fixed');
            } else {
                toolbar.classList.remove('ae-toolbar-styles-fixed');
            }
        }
    };
});
