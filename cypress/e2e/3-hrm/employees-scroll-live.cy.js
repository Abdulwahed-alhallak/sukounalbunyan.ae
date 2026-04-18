/// <reference types="cypress" />

describe('HRM Employees Scroll', () => {
    it('allows scrolling through the employees list and reaching pagination controls', () => {
        cy.visitWithConsent('/login');
        cy.dismissCookieConsentIfPresent();
        cy.get('input[name="email"], input[type="email"]').clear().type(Cypress.env('adminEmail'));
        cy.get('input[name="password"], input[type="password"]').clear().type(Cypress.env('adminPassword'));
        cy.get('button[type="submit"]').click();
        cy.url().should('not.include', '/login', { timeout: 20000 });

        cy.visit(
            '/hrm/employees?branch_id=all&department_id=all&direction=asc&employee_id=&employment_type=&gender=&per_page=10&sort=&user_name=&view=list'
        );
        cy.contains('h1', 'Employees', { timeout: 30000 }).should('be.visible');

        cy.window().then((win) => {
            const mains = [...win.document.querySelectorAll('main')];
            const contentMain = mains[mains.length - 1];
            const pageScroller = win.document.scrollingElement;
            const mainScrollable = Boolean(contentMain && contentMain.scrollHeight > contentMain.clientHeight);
            const pageScrollable = Boolean(pageScroller && pageScroller.scrollHeight > pageScroller.clientHeight);

            expect(mainScrollable || pageScrollable, 'page exposes a usable scroll container').to.eq(true);

            if (mainScrollable && contentMain) {
                const overflowY = getComputedStyle(contentMain).overflowY;
                expect(overflowY).to.match(/auto|scroll/);
                contentMain.scrollTo({ top: contentMain.scrollHeight, behavior: 'auto' });
                return;
            }

            win.scrollTo(0, pageScroller.scrollHeight);
        });

        cy.contains(/Showing .* of .* results/i).should('be.visible');
        cy.contains('button', /Next/i).should('be.visible');
        cy.get('body').should('not.contain', 'SQLSTATE');
    });
});
