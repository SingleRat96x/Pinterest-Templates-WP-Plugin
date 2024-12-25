import React from 'react';
import { fabric } from 'fabric';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    makeStyles,
    Theme,
    createStyles,
    Typography,
    Button,
    FormControl,
} from '@material-ui/core';
import {
    CropSquare,
    RadioButtonUnchecked,
    Timeline,
    Category as ShapesIcon,
} from '@material-ui/icons';
import { SketchPicker } from 'react-color';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        shapeButton: {
            marginBottom: theme.spacing(1),
            width: '100%',
        },
        colorPicker: {
            marginTop: theme.spacing(2),
        },
        formControl: {
            marginTop: theme.spacing(2),
            width: '100%',
        },
    })
);

interface ShapesPanelProps {
    canvas: fabric.Canvas | null;
}

export const ShapesPanel: React.FC<ShapesPanelProps> = ({ canvas }) => {
    const classes = useStyles();
    const [selectedObject, setSelectedObject] = React.useState<fabric.Object | null>(
        null
    );
    const [showColorPicker, setShowColorPicker] = React.useState(false);

    React.useEffect(() => {
        if (!canvas) return;

        const handleSelection = () => {
            const activeObject = canvas.getActiveObject();
            if (
                activeObject &&
                (activeObject.type === 'rect' ||
                    activeObject.type === 'circle' ||
                    activeObject.type === 'line')
            ) {
                setSelectedObject(activeObject);
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

    const addRectangle = () => {
        if (!canvas) return;

        const rect = new fabric.Rect({
            left: 50,
            top: 50,
            width: 100,
            height: 100,
            fill: '#000000',
        });

        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
    };

    const addCircle = () => {
        if (!canvas) return;

        const circle = new fabric.Circle({
            left: 50,
            top: 50,
            radius: 50,
            fill: '#000000',
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    };

    const addLine = () => {
        if (!canvas) return;

        const line = new fabric.Line([50, 50, 200, 50], {
            stroke: '#000000',
            strokeWidth: 2,
        });

        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
    };

    const handleColorChange = (color: any) => {
        if (!selectedObject) return;

        if (selectedObject.type === 'line') {
            selectedObject.set('stroke', color.hex);
        } else {
            selectedObject.set('fill', color.hex);
        }

        canvas?.renderAll();
    };

    return (
        <div className={classes.root}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<CropSquare />}
                onClick={addRectangle}
                className={classes.shapeButton}
            >
                Add Rectangle
            </Button>

            <Button
                variant="contained"
                color="primary"
                startIcon={<RadioButtonUnchecked />}
                onClick={addCircle}
                className={classes.shapeButton}
            >
                Add Circle
            </Button>

            <Button
                variant="contained"
                color="primary"
                startIcon={<Timeline />}
                onClick={addLine}
                className={classes.shapeButton}
            >
                Add Line
            </Button>

            {selectedObject && (
                <FormControl className={classes.formControl}>
                    <Typography gutterBottom>Color</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        style={{
                            backgroundColor:
                                selectedObject.type === 'line'
                                    ? (selectedObject.stroke as string)
                                    : (selectedObject.fill as string),
                            color: '#ffffff',
                        }}
                    >
                        {selectedObject.type === 'line'
                            ? selectedObject.stroke
                            : selectedObject.fill}
                    </Button>
                    {showColorPicker && (
                        <div className={classes.colorPicker}>
                            <SketchPicker
                                color={
                                    selectedObject.type === 'line'
                                        ? (selectedObject.stroke as string)
                                        : (selectedObject.fill as string)
                                }
                                onChange={handleColorChange}
                            />
                        </div>
                    )}
                </FormControl>
            )}
        </div>
    );
}; 