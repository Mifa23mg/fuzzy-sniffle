import { LightningElement } from 'lwc';

const TRIAL_BALANCE_ROWS = [
    {
        id: 'tb-1',
        glAccount: '1000 - Cash Operating',
        openingBalance: '$102,450.00',
        debits: '$24,390.00',
        credits: '$18,240.00',
        endingBalance: '$108,600.00',
    },
    {
        id: 'tb-2',
        glAccount: '1100 - Accounts Receivable',
        openingBalance: '$56,700.00',
        debits: '$9,800.00',
        credits: '$14,200.00',
        endingBalance: '$52,300.00',
    },
];

const MANUAL_MATCHING_ROWS = [
    {
        id: 'mm-1',
        statementDate: '2026-05-01',
        statementLine: 'DEP-77219',
        amount: '$4,100.00',
        journalEntry: 'GLTJ-004581',
        bankReference: '',
        status: 'Unmatched',
    },
    {
        id: 'mm-2',
        statementDate: '2026-05-01',
        statementLine: 'DEP-77220',
        amount: '$2,650.00',
        journalEntry: 'GLTJ-004582',
        bankReference: '',
        status: 'Unmatched',
    },
    {
        id: 'mm-3',
        statementDate: '2026-05-01',
        statementLine: 'WDR-65011',
        amount: '$1,290.00',
        journalEntry: 'GLTJ-004583',
        bankReference: '',
        status: 'Unmatched',
    },
];

const BILLING_RECONCILIATION_ROWS = [
    {
        id: 'br-1',
        billingRecord: 'INV-300145',
        carrierSupportDoc: 'CAR-SUP-9912',
        billed: '$6,200.00',
        carrierSupported: '$6,200.00',
        clientFundsReceived: '$6,200.00',
        variance: '$0.00',
        status: 'Balanced',
    },
    {
        id: 'br-2',
        billingRecord: 'INV-300146',
        carrierSupportDoc: 'CAR-SUP-9913',
        billed: '$4,800.00',
        carrierSupported: '$4,600.00',
        clientFundsReceived: '$4,600.00',
        variance: '$200.00',
        status: 'Review Required',
    },
];

export default class Reconciliation extends LightningElement {
    trialBalanceRows = TRIAL_BALANCE_ROWS;
    manualMatchingRows = MANUAL_MATCHING_ROWS;
    billingReconciliationRows = BILLING_RECONCILIATION_ROWS;

    get matchedCount() {
        return this.manualMatchingRows.filter((row) => row.status === 'Matched').length;
    }

    get unmatchedCount() {
        return this.manualMatchingRows.filter((row) => row.status !== 'Matched').length;
    }

    get manualMatchingRowsWithUiState() {
        return this.manualMatchingRows.map((row) => {
            const isMatched = row.status === 'Matched';
            const hasBankReference = Boolean((row.bankReference || '').trim());
            return {
                ...row,
                statusClass: isMatched ? 'slds-badge slds-theme_success' : 'slds-badge slds-theme_warning',
                actionLabel: isMatched ? 'Matched' : 'Mark Matched',
                actionDisabled: isMatched || !hasBankReference,
            };
        });
    }

    get billingRowsWithUiState() {
        return this.billingReconciliationRows.map((row) => ({
            ...row,
            statusClass:
                row.status === 'Balanced'
                    ? 'slds-badge slds-theme_success'
                    : 'slds-badge slds-theme_warning',
        }));
    }

    handleBankReferenceChange(event) {
        const rowId = event.currentTarget.dataset.id;
        const bankReference = event.target.value;

        this.manualMatchingRows = this.manualMatchingRows.map((row) =>
            row.id === rowId ? { ...row, bankReference } : row
        );
    }

    handleMarkMatched(event) {
        const rowId = event.currentTarget.dataset.id;
        this.manualMatchingRows = this.manualMatchingRows.map((row) =>
            row.id === rowId ? { ...row, status: 'Matched' } : row
        );
    }
}
