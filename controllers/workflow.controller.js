import dayjs from 'dayjs';
import { createRequire } from 'module';
import Subscription from '../models/subscription.model';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 4 , 2 ,1];

const sleepUntilReminder = async(context, label, date ) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async(context, label) => {
    return await context.run(label , () => {
        console.log(`Triggering ${label} reminder`);
        //Send email, SMS , push notification ...
    })
}

export const sendReminders = serve(async (context) => {
    const { subscriptionID } = context.requestPayload;

    const subscription  = await fetchSubscription(context, subscriptionID);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate); 

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscription.id}. Stopping workflow`);
        return;
    }

    for(const daysBefore of REMINDERS) {
        const neminderDate = renewalDate.subtract(daysBefore, 'day');

        if(neminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(`Reminder ${daysBefore} days before`, neminderDate);
        }

        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
})

const fetchSubscription = async (context, subscriptionID) => {
    return await context.run('get subscrition', () => {
        return Subscription.findById(subscriptionID).populate('user', 'name email')
    })
}