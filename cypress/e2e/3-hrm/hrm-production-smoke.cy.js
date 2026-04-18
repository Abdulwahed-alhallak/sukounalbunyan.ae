/// <reference types="cypress" />

const hrmRoutes = [
    { name: 'HR Dashboard', path: '/hrm' },
    { name: 'Employees', path: '/hrm/employees' },
    { name: 'Employee Create', path: '/hrm/employees/create' },
    { name: 'Document Expiries', path: '/hrm/employees/expiries' },
    { name: 'Org Chart', path: '/hrm/org-chart' },
    { name: 'Assets', path: '/hrm/assets' },
    { name: 'Employee Contracts', path: '/hrm/employee-contracts' },
    { name: 'Attendance Tracker', path: '/hrm/attendances/tracker' },
    { name: 'Attendances', path: '/hrm/attendances' },
    { name: 'Shift Scheduler', path: '/hrm/shifts/scheduler' },
    { name: 'Shifts', path: '/hrm/shifts' },
    { name: 'Biometric Logs', path: '/hrm/biometric-logs' },
    { name: 'Leave Types', path: '/hrm/leave-types' },
    { name: 'Leave Timeline', path: '/hrm/leave-applications/timeline' },
    { name: 'Leave Applications', path: '/hrm/leave-applications' },
    { name: 'Leave Balance', path: '/hrm/leave-balance' },
    { name: 'Holidays', path: '/hrm/holidays' },
    { name: 'Payrolls', path: '/hrm/payrolls' },
    { name: 'Set Salary', path: '/hrm/set-salary' },
    { name: 'Vacation Settlement', path: '/hrm/vacation-settlement' },
    { name: 'Final Settlement', path: '/hrm/final-settlement' },
    { name: 'Awards', path: '/hrm/awards' },
    { name: 'Promotions', path: '/hrm/promotions' },
    { name: 'Resignations', path: '/hrm/resignations' },
    { name: 'Terminations', path: '/hrm/terminations' },
    { name: 'Warnings', path: '/hrm/warnings' },
    { name: 'Violations', path: '/hrm/violations' },
    { name: 'Complaints', path: '/hrm/complaints' },
    { name: 'Transfers', path: '/hrm/employee-transfers' },
    { name: 'Documents', path: '/hrm/documents' },
    { name: 'Acknowledgments', path: '/hrm/acknowledgments' },
    { name: 'Announcements', path: '/hrm/announcements' },
    { name: 'Events', path: '/hrm/events' },
    { name: 'Branches', path: '/hrm/branches' },
    { name: 'Departments', path: '/hrm/departments' },
    { name: 'Designations', path: '/hrm/designations' },
    { name: 'Employee Document Types', path: '/hrm/employee-document-types' },
    { name: 'Award Types', path: '/hrm/award-types' },
    { name: 'Termination Types', path: '/hrm/termination-types' },
    { name: 'Warning Types', path: '/hrm/warning-types' },
    { name: 'Violation Types', path: '/hrm/violation-types' },
    { name: 'Complaint Types', path: '/hrm/complaint-types' },
    { name: 'Holiday Types', path: '/hrm/holiday-types' },
    { name: 'Document Categories', path: '/hrm/document-categories' },
    { name: 'Announcement Categories', path: '/hrm/announcement-categories' },
    { name: 'Event Types', path: '/hrm/event-types' },
    { name: 'Allowance Types', path: '/hrm/allowance-types' },
    { name: 'Deduction Types', path: '/hrm/deduction-types' },
    { name: 'Loan Types', path: '/hrm/loan-types' },
    { name: 'Working Days', path: '/hrm/working-days' },
    { name: 'IP Restricts', path: '/hrm/ip-restricts' },
];

const extractPageProps = () =>
    cy.window().then((win) => {
        const app = win.document.getElementById('app');
        expect(app, '#app container').to.exist;
        return JSON.parse(app.getAttribute('data-page')).props;
    });

describe('HRM Production Smoke', () => {
    beforeEach(() => {
        cy.visitWithConsent('/login');
        cy.dismissCookieConsentIfPresent();
        cy.get('input[name="email"], input[type="email"]').clear().type(Cypress.env('adminEmail'));
        cy.get('input[name="password"], input[type="password"]').clear().type(Cypress.env('adminPassword'));
        cy.get('button[type="submit"]').click();
        cy.url().should('not.include', '/login', { timeout: 20000 });
    });

    it('loads the HRM route surface without server errors', () => {
        cy.wrap(hrmRoutes).each(({ name, path }) => {
            cy.request({ url: path, failOnStatusCode: false }).then((response) => {
                expect(response.status, `${name} (${path})`).to.be.oneOf([200, 302]);
                expect(response.body, `${name} (${path}) response body`).to.not.contain('SQLSTATE');
                expect(response.body, `${name} (${path}) response body`).to.not.contain('Server Error');
            });
        });
    });

    it('keeps employee, department, and designation relationships coherent on the employee form', () => {
        cy.visit('/hrm/employees/create');
        extractPageProps().then((props) => {
            const branches = props.branches || [];
            const departments = props.departments || [];
            const designations = props.designations || [];

            expect(branches, 'branches').to.be.an('array').and.not.be.empty;
            expect(departments, 'departments').to.be.an('array').and.not.be.empty;
            expect(designations, 'designations').to.be.an('array').and.not.be.empty;

            const linkedDepartment = departments.find((department) => department.branch_id);
            expect(linkedDepartment, 'department linked to a branch').to.exist;

            const linkedDesignation = designations.find((designation) => designation.department_id);
            expect(linkedDesignation, 'designation linked to a department').to.exist;
        });
    });

    it('returns dynamic leave relations for a seeded employee', () => {
        cy.visit('/hrm/leave-applications');
        extractPageProps().then((props) => {
            const employees = props.employees || [];

            expect(employees, 'employees').to.be.an('array').and.not.be.empty;

            const employee = employees[0];

            cy.request(`/hrm/users/${employee.id}/leave_types`).then((leaveTypesResponse) => {
                expect(leaveTypesResponse.status).to.eq(200);
                expect(leaveTypesResponse.body, 'leave types payload').to.be.an('array');

                const leaveTypes = leaveTypesResponse.body;
                if (leaveTypes.length > 0) {
                    cy.request(`/hrm/leave-balance/${employee.id}/${leaveTypes[0].id}`).then((balanceResponse) => {
                        expect(balanceResponse.status).to.eq(200);
                        expect(balanceResponse.body).to.have.property('available_leaves');
                    });
                }
            });
        });
    });

    it('returns dynamic shift relations for a seeded employee', () => {
        cy.visit('/hrm/attendances');
        extractPageProps().then((props) => {
            const employees = props.employees || [];

            expect(employees, 'attendance employees').to.be.an('array').and.not.be.empty;

            const employee = employees[0];
            cy.request(`/hrm/employees/${employee.id}/shifts`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body, 'shift relation payload').to.be.an('array');
            });
        });
    });

    it('renders the unified HRM shell on the key management pages', () => {
        const pages = [
            { path: '/hrm', screenshot: 'hrm-dashboard' },
            { path: '/hrm/employees', screenshot: 'hrm-employees' },
            { path: '/hrm/attendances', screenshot: 'hrm-attendances' },
            { path: '/hrm/leave-applications', screenshot: 'hrm-leave-applications' },
            { path: '/hrm/payrolls', screenshot: 'hrm-payrolls' },
        ];

        cy.wrap(pages).each(({ path, screenshot }) => {
            cy.visit(path);
            cy.get('body').should('be.visible');
            cy.get('.premium-card, .hrm-panel').its('length').should('be.greaterThan', 0);
            cy.get('body').should('not.contain', 'localhost:5173');
            cy.get('body').should('not.contain', 'SQLSTATE');
            cy.screenshot(screenshot, { capture: 'viewport' });
        });
    });
});
