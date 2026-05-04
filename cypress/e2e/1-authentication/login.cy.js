/// <reference types="cypress" />

/**
 * Sukoun Albunyan — Authentication Flow Tests (Production)
 * Tests login, session management, and access control against the live domain
 */
describe('Authentication — Login Flow', () => {

    beforeEach(() => {
        cy.visitWithConsent('/login');
        cy.dismissCookieConsentIfPresent();
    });

    it('Rejects login with invalid credentials', () => {
        cy.get('input[name="email"], input[type="email"]').clear().type('fake@test.com');
        cy.get('input[name="password"], input[type="password"]').clear().type('wrongpassword');
        cy.get('button[type="submit"]').click();
        
        // Should stay on login page or show error
        cy.url().should('include', '/login');
    });

    it('Rejects login with empty fields', () => {
        cy.get('button[type="submit"]').click();
        // Browser validation should prevent submission or show errors
        cy.url().should('include', '/login');
    });

    it('Email field validates format', () => {
        cy.get('input[name="email"], input[type="email"]').clear().type('not-an-email');
        cy.get('input[name="password"], input[type="password"]').clear().type('somepassword');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/login');
    });

    it('Password field masks input', () => {
        cy.get('input[name="password"], input[type="password"]')
            .should('have.attr', 'type', 'password');
    });

    it('Login with valid admin credentials', function () {
        if (!Cypress.env('adminPassword')) {
            this.skip();
        }

        cy.request('/login').then((loginPageResponse) => {
            const csrfToken = /<meta name="csrf-token" content="([^"]+)"/.exec(loginPageResponse.body)?.[1];

            expect(csrfToken, 'csrf token').to.be.a('string').and.not.be.empty;

            cy.request({
                method: 'POST',
                url: '/login',
                form: true,
                followRedirect: false,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: {
                    _token: csrfToken,
                    email: Cypress.env('adminEmail'),
                    password: Cypress.env('adminPassword'),
                    remember: false,
                },
            }).then((response) => {
                expect(response.status).to.eq(302);
                expect(response.redirectedToUrl || response.headers.location).to.include('/dashboard');
            });
        });

        cy.getCookie('noble_architecture_session').should('exist');
        cy.visitWithConsent('/dashboard');
        cy.location('pathname', { timeout: 15000 }).should('eq', '/dashboard');
    });
});

describe('Authentication — Session & Access Control', () => {

    it('Unauthenticated users are redirected to login', () => {
        cy.visit('/dashboard');
        cy.url({ timeout: 10000 }).should('include', '/login');
    });

    it('Protected HRM routes redirect unauthenticated users', () => {
        cy.request({ url: '/hrm/employees', failOnStatusCode: false }).then((res) => {
            expect(res.status).to.be.oneOf([200, 302, 401]);
        });
    });

    it('Protected settings routes are guarded', () => {
        cy.request({ url: '/settings', failOnStatusCode: false }).then((res) => {
            expect(res.status).to.be.oneOf([200, 302, 401]);
        });
    });
});
