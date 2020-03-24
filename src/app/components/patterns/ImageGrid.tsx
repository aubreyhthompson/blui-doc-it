import React, { useState, HTMLAttributes } from 'react';
import {
    Grid,
    GridProps,
    makeStyles,
    createStyles,
    Typography,
    Theme,
    useTheme,
    useMediaQuery,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: theme.spacing(5),
        },
        image: {
            boxShadow: theme.shadows[2],
            maxHeight: '100%',
            maxWidth: '100%',
            [theme.breakpoints.up('sm')]: {
                cursor: 'zoom-in',
            },
        },
        fullScreenZoom: {
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: theme.palette.type === 'light' ? '#fffd' : '#000a',
            display: 'flex',
            zIndex: 1001,
            alignItems: 'center',
            justifyContent: 'center',
            [theme.breakpoints.up('sm')]: {
                cursor: 'zoom-out',
            },
        },
    })
);

type Content = string | JSX.Element;
type ImageGridProps = {
    caption?: string;
    gridContainerProps?: GridProps;
    gridComponentProps?: GridProps;
    gridImageProps?: GridProps;
    images: Content[];
    rootProps?: HTMLAttributes<HTMLDivElement>;
};
export const ImageGrid: React.FC<ImageGridProps> = (props): JSX.Element => {
    const { images, caption, rootProps, gridContainerProps, gridImageProps, gridComponentProps } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [imageOpened, setImageOpened] = useState(-1);
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <div className={classes.root} {...rootProps}>
            <Grid
                container
                spacing={2}
                justify={images.length < 3 ? 'center' : undefined}
                alignItems={'center'}
                wrap={'wrap'}
                style={{ marginBottom: theme.spacing(0.5) }}
                {...gridContainerProps}
            >
                {images.map((item, index) =>
                    typeof item === 'string' ? (
                        <Grid key={`content_${index}`} item xs={12} sm={6} md={4} {...gridImageProps}>
                            <img
                                className={classes.image}
                                src={item}
                                width={'100%'}
                                onClick={(): void => {
                                    if (smUp) {
                                        setImageOpened(index);
                                    }
                                }}
                            />
                        </Grid>
                    ) : (
                        <Grid key={`content_${index}`} item xs={12} sm={6} md={4} {...gridComponentProps}>
                            {item}
                        </Grid>
                    )
                )}
            </Grid>
            <Typography variant={'caption'}>{caption}</Typography>
            {imageOpened !== -1 && smUp && (
                <div className={classes.fullScreenZoom} onClick={(): void => setImageOpened(-1)}>
                    <img className={classes.image} style={{ cursor: 'inherit' }} src={images[imageOpened] as string} />
                </div>
            )}
        </div>
    );
};
ImageGrid.displayName = 'ImageGrid';
