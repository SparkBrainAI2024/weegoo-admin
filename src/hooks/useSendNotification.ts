import { BroadcastNotificationInput, sendBroadcastNotification } from 'graphql/mutations/settings.mutation';
import { useState, useCallback } from 'react';

export function useSendNotification() {
    const [sending, setSending] = useState(false);
    const [lastSentAt, setLastSentAt] = useState<string | null>(null);

    const send = useCallback(async (input: BroadcastNotificationInput) => {
        setSending(true);
        const res = await sendBroadcastNotification(input);
        setSending(false);
        if (res.success) setLastSentAt(res.sentAt);
        return res;
    }, []);

    return { send, sending, lastSentAt };
}
