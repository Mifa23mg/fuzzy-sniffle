import { LightningElement, track } from 'lwc';

const RELATED_ITEMS = [
    { id: 'r1', name: 'Q2 Renewal Opportunity', type: 'Opportunity', status: 'Negotiation', amount: '$125,000' },
    { id: 'r2', name: 'Customer Satisfaction Case', type: 'Case', status: 'In Progress', amount: '-' },
    { id: 'r3', name: 'Partner Introduction Task', type: 'Task', status: 'Not Started', amount: '-' }
];

const TIMELINE_ITEMS = [
    { id: 't1', iconName: 'standard:log_a_call', title: 'Follow-up Call', detail: 'Discussed renewal timeline and budget confirmation.', date: 'Apr 11, 2026' },
    { id: 't2', iconName: 'standard:email', title: 'Proposal Sent', detail: 'Shared updated proposal with legal terms attached.', date: 'Apr 9, 2026' },
    { id: 't3', iconName: 'standard:task', title: 'Internal Task', detail: 'Coordinate final pricing approval with finance.', date: 'Apr 7, 2026' }
];

export default class Contact extends LightningElement {
    @track isFollowing = true;

    contact = {
        name: 'Carole White',
        title: 'VP Sales',
        account: 'Global Media',
        department: 'Sales',
        email: 'cwhite@globalmedia.com',
        phone: '(415) 555-1212',
        mobile: '(415) 555-1300',
        mailingAddress: '123 Market St, San Francisco, CA 94105',
        leadSource: 'Web',
        owner: 'Rachel Adams',
        description: 'Primary business stakeholder for west coast expansion opportunities.'
    };

    relatedItems = RELATED_ITEMS;
    timelineItems = TIMELINE_ITEMS;

    get followLabel() {
        return this.isFollowing ? 'Following' : 'Follow';
    }

    get followVariant() {
        return this.isFollowing ? 'success' : 'neutral';
    }

    get followIconName() {
        return this.isFollowing ? 'utility:check' : 'utility:add';
    }

    handleFollowToggle() {
        this.isFollowing = !this.isFollowing;
    }
}
