// hooks/useNotification.ts
import { useState } from 'react';
import { SeverityEnum } from 'types/enum';

interface NotificationState {
    message: string;
    severity: SeverityEnum;
}

const useNotification = () => {
    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        severity: SeverityEnum.INFO
    });

    const showSuccess = (message: string) =>
        setNotification({ message, severity: SeverityEnum.SUCCESS });

    const showError = (message: string) =>
        setNotification({ message, severity: SeverityEnum.ERROR });

    const showInfo = (message: string) =>
        setNotification({ message, severity: SeverityEnum.INFO });

    const clearNotification = () =>
        setNotification({ message: '', severity: SeverityEnum.INFO });

    return { notification, showSuccess, showError, showInfo, clearNotification };
};

export default useNotification;