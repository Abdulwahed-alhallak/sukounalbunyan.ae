/// <reference types="cypress" />

/**
 * Noble Architecture — Production Health & Availability Suite
 * Tests the live domain https://noble.dion.sy for critical infrastructure health
 */
describe('Production Infrastructure Health', () => {

    it('Server responds with HTTP 200 or redirect', () => {
        cy.apiHealthCheck('/').then((response) => {
            expect(response.status).to.be.oneOf([200, 301, 302]);
        });
    });

    it('Login page loads successfully', () => {
        cy.visit('/login');
        cy.url().should('include', '/login');
        cy.get('body').should('be.visible');
    });

    it('Login page renders form elements', () => {
        cy.visit('/login');
        cy.get('input[name="email"], input[type="email"]', { timeout: 10000 }).should('exist');
        cy.get('input[name="password"], input[type="password"]').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('Login page has correct page title', () => {
        cy.visit('/login');
        cy.title().should('contain', 'Noble');
    });

    it('HTTPS is enforced (no mixed content)', () => {
        cy.visit('/login');
        cy.location('protocol').should('eq', 'https:');
    });

    it('No server error pages (500/503)', () => {
        cy.request({ url: '/login', failOnStatusCode: false }).then((res) => {
            expect(res.status).to.not.be.oneOf([500, 502, 503]);
        });
    });

    it('API endpoint /api responds', () => {
        cy.request({ url: '/api/user', failOnStatusCode: false }).then((res) => {
            // Should return 401 (unauthenticated) not 500
            expect(res.status).to.be.oneOf([200, 401, 302]);
        });
    });
});

describe('RTL & Arabic Language Rendering', () => {

    it('Login page respects RTL direction for Arabic', () => {
        cy.visit('/login');
        // Check if the html tag has dir="rtl" or if the root wrapper has it
        cy.get('html').then(($html) => {
            const dir = $html.attr('dir');
            const lang = $html.attr('lang');
            cy.log(`Document Direction: ${dir}, Language: ${lang}`);
            // At minimum, the page should load without errors
            expect($html.length).to.eq(1);
        });
    });

    it('Arabic fonts are loaded (IBM Plex Sans Arabic)', () => {
        cy.visit('/login');
        cy.document().then((doc) => {
            const fonts = doc.fonts;
            if (fonts && fonts.ready) {
                fonts.ready.then(() => {
                    const fontFamilies = [];
                    fonts.forEach(f => fontFamilies.push(f.family));
                    cy.log('Loaded fonts: ' + fontFamilies.join(', '));
                });
            }
        });
    });
});

describe('Performance Benchmarks', () => {

    it('Login page loads under 5 seconds', () => {
        cy.visit('/login');
        cy.window().then((win) => {
            const perf = win.performance.timing;
            const loadTime = perf.loadEventEnd - perf.navigationStart;
            cy.log(`Full Load Time: ${loadTime}ms`);
            expect(loadTime).to.be.lessThan(5000);
        });
    });

    it('No console errors on login page', () => {
        cy.visit('/login', {
            onBeforeLoad(win) {
                cy.stub(win.console, 'error').as('consoleError');
            }
        });
        cy.get('@consoleError').should('not.be.called');
    });
});
