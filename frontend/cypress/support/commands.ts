/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      waitForBackend(): Chainable<void>
      waitForFrontend(): Chainable<void>
    }
  }
}

Cypress.Commands.add('waitForBackend', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8000/api/health',
    retryOnStatusCodeFailure: true,
    timeout: 30000,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('waitForFrontend', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:5173',
    retryOnStatusCodeFailure: true,
    timeout: 30000,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

export {};