import React from 'react';
import { fabric } from 'fabric';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Paper,
    makeStyles,
    Theme,
    createStyles,
    Drawer,
    Tabs,
    Tab,
    Button,
} from '@material-ui/core';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    TextFields as TextIcon,
    Image as ImageIcon,
    Category as ShapesIcon,
    Palette as ColorIcon,
} from '@material-ui/icons';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { TextPanel } from './editor/TextPanel';
import { ShapesPanel } from './editor/ShapesPanel';
import { ImagePanel } from './editor/ImagePanel';
import { BackgroundPanel } from './editor/BackgroundPanel';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1500;
const CANVAS_SCALE = 0.4; // 40% of original size

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flexGrow: 1,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            height: '100%',
            overflow: 'hidden',
            marginTop: 64,
            backgroundColor: theme.palette.grey[100],
        },
        canvasContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        },
        canvas: {
            backgroundColor: '#fff',
            boxShadow: theme.shadows[8],
        },
        drawer: {
            width: 300,
            flexShrink: 0,
        },
        drawerPaper: {
            width: 300,
            marginTop: 64,
        },
        toolbar: theme.mixins.toolbar,
    })
);

interface EditorProps {
    template: any;
    onSave: (templateData: any) => void;
    onClose: () => void;
}

export const Editor: React.FC<EditorProps> = ({ template, onSave, onClose }) => {
    const classes = useStyles();
    const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
    const [activeTab, setActiveTab] = React.useState(0);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        if (canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width: CANVAS_WIDTH * CANVAS_SCALE,
                height: CANVAS_HEIGHT * CANVAS_SCALE,
            });

            fabricCanvas.setZoom(CANVAS_SCALE);
            setCanvas(fabricCanvas);

            // Load template data if available
            if (template?.data?.objects) {
                fabricCanvas.loadFromJSON(template.data, () => {
                    fabricCanvas.renderAll();
                });
            }

            return () => {
                fabricCanvas.dispose();
            };
        }
    }, [template]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSave = () => {
        if (canvas) {
            const templateData = {
                ...template,
                data: canvas.toJSON(),
            };
            onSave(templateData);
        }
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {template?.title || 'New Template'}
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>
                <div className={classes.canvasContainer}>
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.25}
                        maxScale={2}
                        wheel={{ disabled: true }}
                    >
                        <TransformComponent>
                            <canvas ref={canvasRef} className={classes.canvas} />
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </main>

            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="right"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<TextIcon />} aria-label="Text" />
                    <Tab icon={<ShapesIcon />} aria-label="Shapes" />
                    <Tab icon={<ImageIcon />} aria-label="Images" />
                    <Tab icon={<ColorIcon />} aria-label="Background" />
                </Tabs>

                {activeTab === 0 && <TextPanel canvas={canvas} />}
                {activeTab === 1 && <ShapesPanel canvas={canvas} />}
                {activeTab === 2 && <ImagePanel canvas={canvas} />}
                {activeTab === 3 && <BackgroundPanel canvas={canvas} />}
            </Drawer>
        </div>
    );
}; 