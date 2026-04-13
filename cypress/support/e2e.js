// ***********************************************************
// Noble Architecture — Cypress E2E Support File
// Global commands and utilities for production testing
// ***********************************************************

// Custom login command
Cypress.Commands.add('login', (email, password) => {
    const loginEmail = email || Cypress.env('adminEmail');
    const loginPassword = password || Cypress.env('adminPassword');

    cy.session([loginEmail, loginPassword], () => {
        cy.visit('/login');
        cy.get('input[name="email"], input[type="email"]').clear().type(loginEmail);
        cy.get('input[name="password"], input[type="password"]').clear().type(loginPassword);
        cy.get('button[type="submit"]').click();
        cy.url().should('not.include', '/login', { timeout: 15000 });
    });
});

// Custom API health check command
Cypress.Commands.add('apiHealthCheck', (endpoint) => {
    return cy.request({
        url: endpoint || '/',
        failOnStatusCode: false,
    });
});

// Ignore common uncaught exceptions from third-party scripts
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('ResizeObserver') || 
        err.message.includes('Non-Error promise rejection') ||
        err.message.includes('NetworkError')) {
        return false;
    }
});

// Log page performance timing after each test
afterEach(() => {
    cy.window().then((win) => {
        const perf = win.performance.timing;
        const loadTime = perf.loadEventEnd - perf.navigationStart;
        if (loadTime > 0) {
            cy.log(`Page Load Time: ${loadTime}ms`);
        }
    });
});
