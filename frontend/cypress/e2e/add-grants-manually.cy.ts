/// <reference types="cypress" />

describe("Add Grants - Manual Entry Flow", () => {
  const API_URL = "http://localhost:5000/api/grants"; // Adjust if your backend URL differs

  beforeEach(() => {
    // Intercept the POST request *before* visiting the page
    // Alias it as 'createGrants'
    cy.intercept("POST", API_URL, {
      statusCode: 201,
      body: {
        status: "SUCCESS",
        statusCode: 201,
        message: "Grants created successfully",
        timestamp: new Date().toISOString(),
        path: "/api/grants",
        data: [
          // Simulate the response for 2 grants
          { id: 101, name: "Manual Grant One", grant_description: "Desc 1", tags: [] },
          { id: 102, name: "Manual Grant Two", grant_description: "Desc 2", tags: [] },
        ],
        errorCode: null,
      },
    }).as("createGrants");

    // Visit the page where the CreateGrantPage component is rendered
    cy.visit("/grants/add"); // Adjust the route if needed

    // Ensure Manual tab is active by default (optional check)
    cy.get('[data-testid="tab-manual"]').should("have.class", "border-green-500"); // Check for active class
  });

  it("should show validation errors if fields are empty", () => {
    // Click submit without filling anything
    cy.get('[data-testid="submit-manual-button"]').click();

    // Check for validation error messages (relies on react-hook-form rendering errors)
    // Adjust selector based on how errors are displayed by TextInput/TextArea
    cy.get('[data-testid="name_0-error"]') // Usa el id del input + '-error'
      .should("contain.text", "Grant name is required");

    cy.get('[data-testid="grant_description_0-error"]') // Usa el id del textarea + '-error'
      .should("contain.text", "Description is required");

    // Ensure API was NOT called
    // This requires a Cypress >= 12 feature or a custom approach
    // cy.get('@createGrants.all').should('have.length', 0); // Check if intercept was hit 0 times
    // Alternative for older Cypress: Check that success message isn't shown
    cy.get('[data-testid="success-message"]').should("not.exist");
  });

  it("should allow adding multiple grants manually and submitting successfully", () => {
    // --- Fill Grant 1 ---
    // Use data-testid for robust selection
    cy.get('[data-testid="grant-name-0"]').type("Manual Grant One");
    cy.get('[data-testid="grant-description-0"]').type("Description for grant one.");

    // --- Add Second Grant ---
    cy.get('[data-testid="add-grant-button"]').click();

    // Verify second form section appeared
    cy.get('[data-testid="grant-name-1"]').should("be.visible");

    // --- Fill Grant 2 ---
    cy.get('[data-testid="grant-name-1"]').type("Manual Grant Two");
    cy.get('[data-testid="grant-description-1"]').type("Description for grant two.");

    // --- Submit ---
    cy.get('[data-testid="submit-manual-button"]').click();

    // --- Assertions ---
    // 1. Wait for the API call to complete
    cy.wait("@createGrants").its("response.statusCode").should("eq", 201);

    // 2. Check for the success message
    cy.get('[data-testid="success-message"]') // Assuming the success <p> has this testid
      .should("be.visible")
      .and("contain.text", "2 grant(s) added successfully!");

    // 3. Check for the background task note
    cy.get('[data-testid="feedback-area"]') // Assuming the feedback div has this testid
      .should("contain.text", "Tags are being generated in the background");

    // 4. Verify the form reset (check if the first input is empty again)
    cy.get('[data-testid="grant-name-0"]').should("have.value", "");
    cy.get('[data-testid="grant-description-0"]').should("have.value", "");

    // 5. Verify only one grant form is visible after reset
    cy.get('[data-testid^="grant-name-"]').should("have.length", 1); // Selects all elements whose testid starts with 'grant-name-'
  });

  it("should allow removing a grant form", () => {
    // Add a second grant
    cy.get('[data-testid="add-grant-button"]').click();
    cy.get('[data-testid^="grant-name-"]').should("have.length", 2);

    // Remove the second grant (index 1)
    cy.get('[data-testid="remove-grant-1"]').click();

    // Verify only one grant form remains
    cy.get('[data-testid^="grant-name-"]').should("have.length", 1);
    cy.get('[data-testid="grant-name-1"]').should("not.exist");
  });
});

/*
Add these data-testid attributes to your components:

CreateGrantPage.tsx:
- Manual Tab Button: data-testid="tab-manual"
- JSON Tab Button: data-testid="tab-json"
- Feedback Div: data-testid="feedback-area"
- Success <p>: data-testid="success-message"
- Error <p>: data-testid="error-message"

ManualGrantsForm.tsx:
- Grant Name Input (index i): data-testid={`grant-name-${index}`}
- Grant Desc Textarea (index i): data-testid={`grant-description-${index}`}
- Add Button: data-testid="add-grant-button"
- Submit Button: data-testid="submit-manual-button"
- Remove Button (index i): data-testid={`remove-grant-${index}`}
- (Consider adding testids to error <p> tags if not siblings)
*/
