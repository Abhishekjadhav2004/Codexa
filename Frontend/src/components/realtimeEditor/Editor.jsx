import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import ACTIONS from '../../utils/realtimeActions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);
    const isUpdatingFromSocket = useRef(false);
    
    useEffect(() => {
        if (editorRef.current && !viewRef.current) {
            viewRef.current = new EditorView({
                doc: '// Start coding here...\n',
                extensions: [
                    basicSetup,
                    javascript(),
                    oneDark,
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged && !isUpdatingFromSocket.current) {
                            const code = update.state.doc.toString();
                            onCodeChange(code);
                            if (socketRef.current) {
                                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                                    roomId,
                                    code,
                                });
                            }
                        }
                    })
                ],
                parent: editorRef.current
            });
        }

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (socketRef.current && viewRef.current) {
            const handleCodeChange = ({ code }) => {
                if (code !== null && code !== viewRef.current.state.doc.toString()) {
                    isUpdatingFromSocket.current = true;
                    
                    // Preserve cursor position
                    const currentSelection = viewRef.current.state.selection.main;
                    const currentPos = currentSelection.from;
                    
                    viewRef.current.dispatch({
                        changes: {
                            from: 0,
                            to: viewRef.current.state.doc.length,
                            insert: code
                        },
                        selection: { anchor: Math.min(currentPos, code.length) }
                    });
                    
                    // Reset flag after a short delay
                    setTimeout(() => {
                        isUpdatingFromSocket.current = false;
                    }, 100);
                }
            };

            socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

            return () => {
                socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            };
        }
    }, [socketRef.current]);

    return <div ref={editorRef} className="codemirror-editor"></div>;
};

export default Editor;
