import React from 'react';
import { fabric } from 'fabric';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Typography,
    makeStyles,
    Theme,
    createStyles,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Button,
} from '@material-ui/core';
import { TextFields as TextIcon } from '@material-ui/icons';
import { SketchPicker } from 'react-color';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];
const FONTS = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        formControl: {
            marginBottom: theme.spacing(2),
            minWidth: 120,
            width: '100%',
        },
        colorPicker: {
            marginTop: theme.spacing(2),
        },
        button: {
            marginBottom: theme.spacing(2),
        },
    })
);

interface TextPanelProps {
    canvas: fabric.Canvas | null;
}

export const TextPanel: React.FC<TextPanelProps> = ({ canvas }) => {
    const classes = useStyles();
    const [selectedObject, setSelectedObject] = React.useState<fabric.IText | null>(
        null
    );
    const [showColorPicker, setShowColorPicker] = React.useState(false);

    React.useEffect(() => {
        if (!canvas) return;

        const handleSelection = () => {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                setSelectedObject(activeObject as fabric.IText);
            } else {
                setSelectedObject(null);
            }
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleSelection);

        return () => {
            canvas.off('selection:created', handleSelection);
            canvas.off('selection:updated', handleSelection);
            canvas.off('selection:cleared', handleSelection);
        };
    }, [canvas]);

    const addText = () => {
        if (!canvas) return;

        const text = new fabric.IText('Click to edit', {
            left: 50,
            top: 50,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#000000',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedObject) return;
        selectedObject.set('text', event.target.value);
        canvas?.renderAll();
    };

    const handleFontChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (!selectedObject) return;
        selectedObject.set('fontFamily', event.target.value as string);
        canvas?.renderAll();
    };

    const handleFontSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (!selectedObject) return;
        selectedObject.set('fontSize', event.target.value as number);
        canvas?.renderAll();
    };

    const handleColorChange = (color: any) => {
        if (!selectedObject) return;
        selectedObject.set('fill', color.hex);
        canvas?.renderAll();
    };

    return (
        <div className={classes.root}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<TextIcon />}
                onClick={addText}
                fullWidth
                className={classes.button}
            >
                Add Text
            </Button>

            {selectedObject && (
                <>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Text"
                            value={selectedObject.text}
                            onChange={handleTextChange}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel>Font Family</InputLabel>
                        <Select
                            value={selectedObject.fontFamily}
                            onChange={handleFontChange}
                        >
                            {FONTS.map((font) => (
                                <MenuItem key={font} value={font}>
                                    {font}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel>Font Size</InputLabel>
                        <Select
                            value={selectedObject.fontSize}
                            onChange={handleFontSizeChange}
                        >
                            {FONT_SIZES.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}px
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <Typography gutterBottom>Color</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            style={{
                                backgroundColor: selectedObject.fill as string,
                                color: '#ffffff',
                            }}
                        >
                            {selectedObject.fill}
                        </Button>
                        {showColorPicker && (
                            <div className={classes.colorPicker}>
                                <SketchPicker
                                    color={selectedObject.fill as string}
                                    onChange={handleColorChange}
                                />
                            </div>
                        )}
                    </FormControl>
                </>
            )}
        </div>
    );
}; 