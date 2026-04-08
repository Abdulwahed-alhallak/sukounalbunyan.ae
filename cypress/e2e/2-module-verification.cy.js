describe('Global Module Availability & Stability Test', () => {
    beforeEach(() => {
        // Assume Noble Company with full access
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@noble.com');
        cy.get('input[name="password"]').type('12345678');
        cy.get('form').submit();
        cy.url().should('include', '/dashboard');
    });

    const coreModules = [
        { name: 'HRM', url: '/employee' },
        { name: 'CRM/Lead', url: '/leads' },
        { name: 'Projects (Taskly)', url: '/projects' },
        { name: 'Accounting', url: '/bank-transfer' },
        { name: 'POS', url: '/pos' },
    ];

    coreModules.forEach(module => {
        it(`Should successfully navigate to ${module.name} indicating the module is wired correctly`, () => {
            cy.request(module.url).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });
});
