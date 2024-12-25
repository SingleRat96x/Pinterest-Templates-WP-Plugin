import React from 'react';
import { fabric } from 'fabric';
import {
    makeStyles,
    Theme,
    createStyles,
    Typography,
    Button,
    FormControl,
} from '@material-ui/core';
import { Palette as ColorIcon } from '@material-ui/icons';
import { SketchPicker } from 'react-color';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        colorPicker: {
            marginTop: theme.spacing(2),
        },
        dropzone: {
            border: `2px dashed ${theme.palette.grey[300]}`,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(4),
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: theme.spacing(2),
            '&:hover': {
                borderColor: theme.palette.primary.main,
            },
        },
        activeDropzone: {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
        },
        colorButton: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
    })
);

interface BackgroundPanelProps {
    canvas: fabric.Canvas | null;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ canvas }) => {
    const classes = useStyles();
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState('#ffffff');

    React.useEffect(() => {
        if (canvas) {
            setBackgroundColor(canvas.backgroundColor as string);
        }
    }, [canvas]);

    const handleColorChange = (color: any) => {
        if (!canvas) return;

        const newColor = color.hex;
        canvas.setBackgroundColor(newColor, () => {
            canvas.renderAll();
            setBackgroundColor(newColor);
        });
    };

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            if (!canvas) return;

            const file = acceptedFiles[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                fabric.Image.fromURL(reader.result as string, (img) => {
                    // Scale the image to cover the entire canvas
                    if (canvas.width && canvas.height && img.width && img.height) {
                        const scaleX = canvas.width / img.width;
                        const scaleY = canvas.height / img.height;
                        const scale = Math.max(scaleX, scaleY);

                        img.scale(scale);

                        // Center the image
                        img.set({
                            left: (canvas.width - img.width * scale) / 2,
                            top: (canvas.height - img.height * scale) / 2,
                            selectable: false,
                            evented: false,
                        });

                        // Remove any existing background image
                        const objects = canvas.getObjects();
                        const existingBackground = objects.find(
                            (obj) => obj.data?.isBackground
                        );
                        if (existingBackground) {
                            canvas.remove(existingBackground);
                        }

                        // Set this image as the background
                        img.data = { isBackground: true };
                        canvas.add(img);
                        canvas.sendToBack(img);
                        canvas.renderAll();
                    }
                });
            };
            reader.readAsDataURL(file);
        },
        [canvas]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        },
        multiple: false,
    });

    const removeBackgroundImage = () => {
        if (!canvas) return;

        const objects = canvas.getObjects();
        const backgroundImage = objects.find((obj) => obj.data?.isBackground);
        if (backgroundImage) {
            canvas.remove(backgroundImage);
            canvas.renderAll();
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6" gutterBottom>
                Background
            </Typography>

            <Button
                variant="contained"
                color="primary"
                startIcon={<ColorIcon />}
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={classes.colorButton}
            >
                {showColorPicker ? 'Hide Color Picker' : 'Change Color'}
            </Button>

            {showColorPicker && (
                <div className={classes.colorPicker}>
                    <SketchPicker
                        color={backgroundColor}
                        onChange={handleColorChange}
                    />
                </div>
            )}

            <Typography variant="subtitle1" gutterBottom>
                Or add a background image:
            </Typography>

            <div
                {...getRootProps({
                    className: `${classes.dropzone} ${
                        isDragActive ? classes.activeDropzone : ''
                    }`,
                })}
            >
                <input {...getInputProps()} />
                <Typography variant="body1" gutterBottom>
                    {isDragActive
                        ? 'Drop the image here'
                        : 'Drag and drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Supports PNG, JPG, JPEG, and GIF
                </Typography>
            </div>

            <Button
                variant="outlined"
                color="secondary"
                onClick={removeBackgroundImage}
                style={{ marginTop: 16 }}
                fullWidth
            >
                Remove Background Image
            </Button>
        </div>
    );
}; 