# Operating Model

## Agent roles
- Project Intelligence: detect the real project before modification
- Planner: convert discovery outputs into a safe implementation plan
- Executor: perform targeted changes with minimum architectural drift
- Verifier: validate behavior, contracts, build, and delivery assumptions
- Documenter: update project artifacts and handover notes

## Mode selection
### Greenfield mode
Use when the repository is empty, skeletal, or clearly at bootstrap stage.
Entry workflow: `new-project-bootstrap.md`

### Brownfield mode
Use when the repository already contains meaningful code, configs, migrations, routes, build files, or deployment logic.
Entry workflow: `existing-project-intake.md`
