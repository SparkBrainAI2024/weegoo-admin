import { useState } from 'react';
// third-party
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ==============================|| EDITOR ||============================== //

interface ReactDraftWysiwygProps {
    editorState?: EditorState;
    onEditorStateChange?: (editorState: EditorState) => void;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbarClassName?: string;
}

const ReactDraftWysiwyg = ({
    editorState,
    onEditorStateChange,
    wrapperClassName = 'wrapperClassName',
    editorClassName = 'editorClassName',
    toolbarClassName = 'toolbarClassName'
}: ReactDraftWysiwygProps) => {
    // Manage editorState internally if not provided by the parent
    const [internalEditorState, setInternalEditorState] = useState(() => {
        const initialContent =
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        return EditorState.createWithContent(ContentState.createFromText(initialContent));
    });

    const currentEditorState = editorState || internalEditorState;

    const handleEditorStateChange = (newEditorState: EditorState) => {
        if (onEditorStateChange) {
            onEditorStateChange(newEditorState);
        } else {
            setInternalEditorState(newEditorState);
        }
    };

    return (
        <Editor
            editorState={currentEditorState}
            toolbarClassName={toolbarClassName}
            wrapperClassName={wrapperClassName}
            editorClassName={editorClassName}
            onEditorStateChange={handleEditorStateChange}
        />
    );
};

export default ReactDraftWysiwyg;