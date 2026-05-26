import { LightningElement, api } from 'lwc';

export default class GlobalNavigation extends LightningElement {
    @api currentPage = 'home';
    @api navItems = [];

    /** Nav items with isActive and tabClass derived from currentPage (for template) */
    get navItemsWithActive() {
        return (this.navItems || []).map((item) => {
            const isActive = item.page === this.currentPage;
            const base = 'slds-context-bar__item';
            return {
                ...item,
                isActive,
                tabClass: isActive ? `${base} slds-is-active` : base,
            };
        });
    }

    /** Menu items for lightning-button-menu in the app launcher section. */
    get menuItems() {
        return (this.navItems || []).map((item) => ({
            ...item,
            isActive: item.page === this.currentPage,
        }));
    }

    handleNavItemClick(event) {
        event.preventDefault();
        const page = event.currentTarget.dataset.page;
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: { page },
                bubbles: true,
                composed: true,
            })
        );
    }

    handleMenuNavigate(event) {
        const page = event.detail.value;
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: { page },
                bubbles: true,
                composed: true,
            })
        );
    }
}
