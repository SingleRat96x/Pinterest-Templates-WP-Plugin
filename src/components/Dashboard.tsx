import React from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        title: {
            marginBottom: theme.spacing(4),
        },
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.02)',
            },
        },
        newTemplateCard: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            backgroundColor: theme.palette.grey[100],
            '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: theme.palette.grey[200],
            },
        },
        templatePreview: {
            width: '100%',
            paddingTop: '150%', // 2:3 aspect ratio
            position: 'relative',
            backgroundColor: theme.palette.grey[200],
        },
        addIcon: {
            fontSize: 48,
            marginBottom: theme.spacing(2),
        },
    })
);

interface DashboardProps {
    onCreateNew: () => void;
    onEditTemplate: (template: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEditTemplate }) => {
    const classes = useStyles();
    const [templates, setTemplates] = React.useState<any[]>([]);

    React.useEffect(() => {
        // TODO: Fetch templates from WordPress REST API
        const fetchTemplates = async () => {
            try {
                const response = await fetch('/wp-json/templates-for-pinterest/v1/templates');
                const data = await response.json();
                setTemplates(data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.root}>
            <Typography variant="h4" component="h1" className={classes.title}>
                Pinterest Templates
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card className={classes.newTemplateCard} onClick={onCreateNew}>
                        <CardContent>
                            <AddIcon className={classes.addIcon} color="primary" />
                            <Typography variant="h6" align="center">
                                Create New Template
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {templates.map((template) => (
                    <Grid key={template.id} item xs={12} sm={6} md={4} lg={3}>
                        <Card
                            className={classes.card}
                            onClick={() => onEditTemplate(template)}
                        >
                            <div className={classes.templatePreview}>
                                {/* TODO: Add template preview */}
                            </div>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {template.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                >
                                    {new Date(template.date).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}; 