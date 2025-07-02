
'use client';

import { useState, useEffect } from 'react';
import Joyride, { type Step, type CallBackProps, ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useI18n } from '@/context/i18n-context';

export function FeatureTour() {
    const { t } = useI18n();
    const [isMounted, setIsMounted] = useState(false);

    const [tourState, setTourState] = useState({
        run: false,
        steps: [],
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const hasSeenTour = localStorage.getItem('rangel_guitar_tour_v1');
        if (!hasSeenTour) {
            setTourState({
                run: true,
                steps: [
                    {
                        target: 'body',
                        content: t('tourWelcomeContent'),
                        title: t('tourWelcomeTitle'),
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#search-bar-tour-target',
                        content: t('tourSearchContent'),
                        title: t('tourSearchTitle'),
                    },
                    {
                        target: '#first-song-card-tour-target',
                        content: t('tourSongCardContent'),
                        title: t('tourSongCardTitle'),
                        placement: 'top',
                    },
                    {
                        target: '#user-menu-tour-target',
                        content: t('tourUserMenuContent'),
                        title: t('tourUserMenuTitle'),
                    },
                ]
            });
        }
    }, [isMounted, t]);


    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
            setTourState(prev => ({ ...prev, run: false }));
            localStorage.setItem('rangel_guitar_tour_v1', 'true');
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <Joyride
            run={tourState.run}
            steps={tourState.steps}
            callback={handleJoyrideCallback}
            continuous
            showProgress
            showSkipButton
            disableOverlayClose
            locale={{
                back: t('tourBack'),
                close: t('tourClose'),
                last: t('tourLast'),
                next: t('tourNext'),
                skip: t('tourSkip'),
            }}
            styles={{
                options: {
                    zIndex: 10000,
                },
            }}
        />
    );
}
