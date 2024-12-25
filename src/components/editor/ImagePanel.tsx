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
import { Image as ImageIcon } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        dropzone: {
            border: `2px dashed ${theme.palette.grey[300]}`,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(4),
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: theme.spacing(2),
            '&:hover': {
                borderColor: theme.palette.primary.main,
            },
        },
        activeDropzone: {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
        },
    })
);

interface ImagePanelProps {
    canvas: fabric.Canvas | null;
}

export const ImagePanel: React.FC<ImagePanelProps> = ({ canvas }) => {
    const classes = useStyles();

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            if (!canvas) return;

            acceptedFiles.forEach((file) => {
                const reader = new FileReader();

                reader.onload = () => {
                    fabric.Image.fromURL(reader.result as string, (img) => {
                        // Scale the image to fit within the canvas while maintaining aspect ratio
                        const maxDimension = 400; // Maximum width or height
                        let scale = 1;

                        if (img.width && img.height) {
                            if (img.width > img.height) {
                                scale = maxDimension / img.width;
                            } else {
                                scale = maxDimension / img.height;
                            }
                        }

                        img.scale(scale);

                        // Center the image on the canvas
                        if (canvas.width && canvas.height && img.width && img.height) {
                            img.set({
                                left: (canvas.width - img.width * scale) / 2,
                                top: (canvas.height - img.height * scale) / 2,
                            });
                        }

                        canvas.add(img);
                        canvas.setActiveObject(img);
                        canvas.renderAll();
                    });
                };

                reader.readAsDataURL(file);
            });
        },
        [canvas]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        },
    });

    return (
        <div className={classes.root}>
            <div
                {...getRootProps({
                    className: `${classes.dropzone} ${
                        isDragActive ? classes.activeDropzone : ''
                    }`,
                })}
            >
                <input {...getInputProps()} />
                <ImageIcon style={{ fontSize: 48, marginBottom: 16 }} />
                <Typography variant="body1" gutterBottom>
                    {isDragActive
                        ? 'Drop the image here'
                        : 'Drag and drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Supports PNG, JPG, JPEG, and GIF
                </Typography>
            </div>
        </div>
    );
}; 