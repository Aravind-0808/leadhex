// Node Definitions Configuration
export const nodeDefinitions = {
    eventNodes: {
        leads: [
            { type: 'event', entity: 'leads', event: 'lead.create.after', label: 'Lead Created', icon: 'icon-add' },
            { type: 'event', entity: 'leads', event: 'lead.update.after', label: 'Lead Updated', icon: 'icon-edit' },
            { type: 'event', entity: 'leads', event: 'lead.delete.before', label: 'Lead Deleted', icon: 'icon-delete' }
        ],
        activities: [
            { type: 'event', entity: 'activities', event: 'activity.create.after', label: 'Activity Created', icon: 'icon-add' },
            { type: 'event', entity: 'activities', event: 'activity.update.after', label: 'Activity Updated', icon: 'icon-edit' },
            { type: 'event', entity: 'activities', event: 'activity.delete.before', label: 'Activity Deleted', icon: 'icon-delete' }
        ],
        persons: [
            { type: 'event', entity: 'persons', event: 'contacts.person.create.after', label: 'Person Created', icon: 'icon-add' },
            { type: 'event', entity: 'persons', event: 'contacts.person.update.after', label: 'Person Updated', icon: 'icon-edit' },
            { type: 'event', entity: 'persons', event: 'contacts.person.delete.before', label: 'Person Deleted', icon: 'icon-delete' }
        ],
        quotes: [
            { type: 'event', entity: 'quotes', event: 'quote.create.after', label: 'Quote Created', icon: 'icon-add' },
            { type: 'event', entity: 'quotes', event: 'quote.update.after', label: 'Quote Updated', icon: 'icon-edit' },
            { type: 'event', entity: 'quotes', event: 'quote.delete.before', label: 'Quote Deleted', icon: 'icon-delete' }
        ]
    },
    
    conditionNodes: [
        { type: 'condition', entity: 'leads', label: 'Lead Condition', icon: 'icon-filter' },
        { type: 'condition', entity: 'activities', label: 'Activity Condition', icon: 'icon-search' },
        { type: 'condition', entity: 'persons', label: 'Person Condition', icon: 'icon-contact' },
        { type: 'condition', entity: 'quotes', label: 'Quote Condition', icon: 'icon-quote' }
    ],
    
    actionNodes: [
        { type: 'action', entity: 'leads', actionType: 'update_lead', label: 'Update Lead', icon: 'icon-edit' },
        { type: 'action', entity: 'leads', actionType: 'send_email_to_person', label: 'Email Person', icon: 'icon-mail' },
        { type: 'action', entity: 'leads', actionType: 'send_email_to_sales_owner', label: 'Email Owner', icon: 'icon-mail' },
        { type: 'action', entity: 'leads', actionType: 'add_tag', label: 'Add Tag', icon: 'icon-tag' },
        { type: 'action', entity: 'leads', actionType: 'trigger_webhook', label: 'Trigger Webhook', icon: 'icon-settings-webhooks' }
    ]
};
