// ***********************************************************
// Noble Architecture — Cypress E2E Support File
// Global commands and utilities for production testing
// ***********************************************************

const acceptedCookieConsent = JSON.stringify({
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: Date.now(),
});

const seedCookieConsent = (win) => {
    win.localStorage.setItem('cookie-consent', acceptedCookieConsent);
};

// Visit a page with cookie consent pre-accepted so overlays do not block tests.
Cypress.Commands.add('visitWithConsent', (url) => {
    cy.visit(url, {
        onBeforeLoad: seedCookieConsent,
    });
});

// Dismiss cookie consent when it appears on the production login page.
Cypress.Commands.add('dismissCookieConsentIfPresent', () => {
    cy.get('body').then(($body) => {
        const acceptAllButton = $body.find('button').filter((_, button) =>
            /accept all/i.test(button.innerText || '')
        ).first();

        if (acceptAllButton.length) {
            cy.wrap(acceptAllButton).click({ force: true });
        }
    });
});

// Custom login command
Cypress.Commands.add('login', (email, password) => {
    const loginEmail = email || Cypress.env('adminEmail');
    const loginPassword = password || Cypress.env('adminPassword');

    cy.session([loginEmail, loginPassword], () => {
        cy.visitWithConsent('/login');
        cy.dismissCookieConsentIfPresent();
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
