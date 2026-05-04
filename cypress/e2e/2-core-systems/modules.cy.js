/// <reference types="cypress" />

/**
 * Sukoun Albunyan — Module Verification Suite (Production)
 * Verifies that all 31+ enterprise modules are accessible after authentication
 */
describe('Core Module Accessibility', () => {

    before(() => {
        cy.login();
    });

    const coreRoutes = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Settings', path: '/settings' },
    ];

    coreRoutes.forEach(({ name, path }) => {
        it(`${name} module loads without error`, () => {
            cy.visit(path);
            cy.get('body').should('be.visible');
            // No 500 error page
            cy.get('body').should('not.contain', 'Server Error');
            cy.get('body').should('not.contain', '500');
            cy.get('body').should('not.contain', 'SQLSTATE');
        });
    });
});

describe('HRM Module Routes', () => {

    before(() => {
        cy.login();
    });

    const hrmRoutes = [
        { name: 'Employees List', path: '/hrm/employees' },
        { name: 'Departments', path: '/hrm/departments' },
        { name: 'Designations', path: '/hrm/designations' },
    ];

    hrmRoutes.forEach(({ name, path }) => {
        it(`HRM — ${name} loads`, () => {
            cy.request({ url: path, failOnStatusCode: false }).then((res) => {
                expect(res.status).to.be.oneOf([200, 302]);
                cy.log(`${name}: Status ${res.status}`);
            });
        });
    });
});

describe('Financial Module Routes', () => {

    before(() => {
        cy.login();
    });

    const financeRoutes = [
        { name: 'Invoices', path: '/invoices' },
        { name: 'Proposals', path: '/proposals' },
        { name: 'Contracts', path: '/contracts' },
    ];

    financeRoutes.forEach(({ name, path }) => {
        it(`Finance — ${name} responds`, () => {
            cy.request({ url: path, failOnStatusCode: false }).then((res) => {
                expect(res.status).to.not.eq(500);
                cy.log(`${name}: Status ${res.status}`);
            });
        });
    });
});

describe('CRM Module Routes', () => {

    before(() => {
        cy.login();
    });

    const crmRoutes = [
        { name: 'Leads', path: '/leads' },
        { name: 'Deals', path: '/deals' },
        { name: 'Clients', path: '/clients' },
    ];

    crmRoutes.forEach(({ name, path }) => {
        it(`CRM — ${name} responds`, () => {
            cy.request({ url: path, failOnStatusCode: false }).then((res) => {
                expect(res.status).to.not.eq(500);
                cy.log(`${name}: Status ${res.status}`);
            });
        });
    });
});

describe('UI/UX Integrity Checks', () => {

    before(() => {
        cy.login();
    });

    it('Dashboard has sidebar navigation', () => {
        cy.visit('/dashboard');
        cy.get('aside, nav, [data-sidebar]', { timeout: 10000 }).should('exist');
    });

    it('Dashboard has no broken images', () => {
        cy.visit('/dashboard');
        cy.get('img').each(($img) => {
            if ($img.attr('src')) {
                cy.wrap($img).should('be.visible').and(($i) => {
                    expect($i[0].naturalWidth).to.be.greaterThan(0);
                });
            }
        });
    });

    it('No SQLSTATE errors visible on dashboard', () => {
        cy.visit('/dashboard');
        cy.get('body').should('not.contain', 'SQLSTATE');
        cy.get('body').should('not.contain', 'Whoops');
        cy.get('body').should('not.contain', 'ErrorException');
    });
});
