import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, useTheme, makeStyles, createStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Spacer } from '@brightlayer-ui/react-components';
import { getAnnouncementDetails } from '../../api';
import { AnnouncementData } from '../../../__types__';
import { HIDE_BANNER, SHOW_BANNER } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import * as Colors from '@brightlayer-ui/colors';

type BannerData = {
    bannerDismissed: boolean;
    id: number;
};
const useStyles = makeStyles(() =>
    createStyles({
        bannerContainer: {
            '& > a': {
                textDecoration: 'underline',
                cursor: 'pointer',
                color: Colors.white[50],
            },
        },
    })
);

export const AnnouncementAppbar: React.FC = () => {
    const [announcementDetails, setAnnouncementDetails] = useState<AnnouncementData>();
    const environment = process.env.NODE_ENV;
    const [showBanner, setShowBanner] = useState(true);
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();

    const banner = (): BannerData => {
        const announcementBannerData = window.sessionStorage.getItem('announcement_banner_data');
        const announcementBannerDetails = announcementBannerData ? JSON.parse(announcementBannerData) : undefined;
        return announcementBannerDetails;
    };

    useEffect(() => {
        const loadAnnoncement = async (): Promise<void> => {
            const data = await getAnnouncementDetails();
            if (data === undefined) {
                dispatch({ type: SHOW_BANNER, payload: false });
                return;
            }
            setAnnouncementDetails(data);

            const currentDate = new Date().toJSON().slice(0, 10);
            const from = new Date(data?.startDate);
            const to = new Date(data?.endDate);
            const check = new Date(currentDate);
            const show = check > from && check < to;
            if (data) {
                dispatch({ type: SHOW_BANNER, payload: show });
            }

            if (banner() === undefined) {
                const announcementBannerData = {
                    'banner-dismissed': false,
                    id: data.id,
                };
                sessionStorage.setItem('announcement_banner_data', JSON.stringify(announcementBannerData));
            } else {
                if (banner().id !== data.id) {
                    const announcementBannerData = {
                        'banner-dismissed': false,
                        id: data.id,
                    };
                    sessionStorage.setItem('announcement_banner_data', JSON.stringify(announcementBannerData));
                }
            }

            if (data.devOnly && environment === 'production') {
                setShowBanner(false);
            }
        };
        void loadAnnoncement();
    }, []);

    return (
        <div>
            {announcementDetails && showBanner && (
                <AppBar position="sticky" color={'secondary'} elevation={0}>
                    <Toolbar>
                        <div
                            className={classes.bannerContainer}
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            dangerouslySetInnerHTML={{ __html: announcementDetails?.bannerContent }}
                        />
                        <Spacer />
                        <IconButton
                            style={{ marginRight: -theme.spacing(1) }}
                            color={'inherit'}
                            onClick={(): void => {
                                dispatch({ type: HIDE_BANNER });
                                sessionStorage.setItem(
                                    'announcement_banner_data',
                                    JSON.stringify({ 'banner-dismissed': true, id: announcementDetails.id })
                                );
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}
        </div>
    );
};
