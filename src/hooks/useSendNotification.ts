import { useMutation } from '@apollo/client';
import { SEND_PUSH_NOTIFICATION, SendPushNotificationInput } from 'graphql/mutations/settings.mutation';

export function useSendNotification() {
    const [sendPushNotification, { loading: sending }] = useMutation(SEND_PUSH_NOTIFICATION);

    const send = async (input: SendPushNotificationInput) => {
        const { data } = await sendPushNotification({ variables: { input } });
        return data?.sendPushNotification;
    };

    return { send, sending };
}
