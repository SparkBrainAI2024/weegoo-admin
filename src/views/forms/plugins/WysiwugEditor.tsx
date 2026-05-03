// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MainCard from 'components/ui-component/cards/MainCard';
import SecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// assets
import LinkIcon from '@mui/icons-material/Link';

// types
import { ThemeMode } from 'types/config';
import { useField, useFormikContext } from 'formik';

// ==============================|| PLUGIN - EDITORS ||============================== //

interface WysiwygEditorProps {
    name: string;
    label?: string;
    [key: string]: any;
}

const WysiwygEditor = ({ name, label, ...otherProps }: WysiwygEditorProps) => {
    const theme = useTheme();
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleReactDraftChange = (editorState: EditorState) => {
        const content = editorState.getCurrentContent().getPlainText();
        setFieldValue(name, content);
    };

    const config = {
        ...field,
        ...otherProps,
        error: false,
        helperText: ''
    };

    if (meta && meta.touched && meta.error) {
        config.error = true;
        config.helperText = meta.error;
    }

    return (
        <MainCard
            title={label || "Wysiwyg Editor"}
            secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://www.npmjs.com/package/react-draft-wysiwyg" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        '& .rdw-editor-wrapper': {
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'background.paper',
                            border: '1px solid',
                            borderColor: config.error
                                ? theme.palette.error.main
                                : theme.palette.mode === ThemeMode.DARK
                                    ? alpha(theme.palette.dark.light, 0.2)
                                    : 'primary.light',
                            borderRadius: '12px',
                            overflow: 'scroll',
                            '& .rdw-editor-main': {
                                px: 2,
                                py: 0.5,
                                border: 'none'
                            },
                            '& .rdw-editor-toolbar': {
                                pt: 1.25,
                                border: 'none',
                                borderBottom: '1px solid',
                                borderColor: config.error
                                    ? theme.palette.error.main
                                    : theme.palette.mode === ThemeMode.DARK
                                        ? alpha(theme.palette.dark.light, 0.2)
                                        : 'primary.light',
                                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
                                '& .rdw-option-wrapper': {
                                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
                                    borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'grey.900'
                                },
                                '& .rdw-dropdown-wrapper': {
                                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
                                    borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'grey.900',
                                    '& .rdw-dropdown-selectedtext': {
                                        color: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'grey.900'
                                    }
                                },
                                '& .rdw-embedded-modal-btn:disabled ': {
                                    color: theme.palette.mode === ThemeMode.DARK ? 'grey.900' : 'inherit'
                                },
                                '& .rdw-embedded-modal-btn': { color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'inherit' },
                                '& .rdw-link-modal-btn': { color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'inherit' },
                                '& .rdw-link-modal-btn:disabled': { color: theme.palette.mode === ThemeMode.DARK ? 'grey.900' : 'inherit' },
                                '& .rdw-image-modal-btn': { color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'inherit' },
                                '& .rdw-image-modal-btn:disabled': { color: theme.palette.mode === ThemeMode.DARK ? 'grey.900' : 'inherit' }
                            }
                        }
                    }}
                >
                    <Stack spacing={gridSpacing}>
                        <Editor
                            editorState={field.value}
                            onEditorStateChange={handleReactDraftChange}
                            wrapperClassName="rdw-editor-wrapper"
                            editorClassName="rdw-editor-main"
                            toolbarClassName="rdw-editor-toolbar"
                        />

                        {config.error && (
                            <Typography variant="caption" color="error">
                                {config.helperText}
                            </Typography>
                        )}
                    </Stack>
                </Grid>

            </Grid>
        </MainCard>
    );
};

export default WysiwygEditor;