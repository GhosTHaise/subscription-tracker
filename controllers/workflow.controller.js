import dayjs from 'dayjs';
import { createRequire } from 'module';
import Subscription from '../models/subscription.model';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

export const sendReminders = serve(async (context) => {
    const { subscriptionID } = context.requestPayload;

    const subscription  = await fetchSubscription(context, subscriptionID);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate); 
})

const fetchSubscription = async (context, subscriptionID) => {
    return await context.run('get subscrition', () => {
        return Subscription.findById(subscriptionID).populate('user', 'name email')
    })
}