import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

const App: React.FC = () => {
    const [currentTemplate, setCurrentTemplate] = React.useState<any>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    const handleCreateNew = () => {
        setCurrentTemplate({
            title: 'New Template',
            data: {
                objects: [],
                background: '#ffffff',
            },
        });
        setIsEditing(true);
    };

    const handleEditTemplate = (template: any) => {
        setCurrentTemplate(template);
        setIsEditing(true);
    };

    const handleSaveTemplate = async (templateData: any) => {
        // TODO: Implement save functionality using WordPress REST API
        setIsEditing(false);
        setCurrentTemplate(null);
    };

    const handleClose = () => {
        setIsEditing(false);
        setCurrentTemplate(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isEditing ? (
                <Editor
                    template={currentTemplate}
                    onSave={handleSaveTemplate}
                    onClose={handleClose}
                />
            ) : (
                <Dashboard
                    onCreateNew={handleCreateNew}
                    onEditTemplate={handleEditTemplate}
                />
            )}
        </ThemeProvider>
    );
};

export default App; 