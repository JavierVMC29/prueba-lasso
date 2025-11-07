/// <reference types="cypress" />

describe("Add Grants - JSON Upload Flow", () => {
  const API_URL = "http://localhost:5000/api/grants"; // Adjust if your backend URL differs

  beforeEach(() => {
    // Intercept the POST request
    cy.intercept("POST", API_URL, {
      statusCode: 201,
      body: {
        status: "SUCCESS",
        statusCode: 201,
        message: "Grants created successfully",
        timestamp: new Date().toISOString(),
        path: "/api/grants",
        data: [
          // Simulate the response for the 2 grants in the fixture
          { id: 201, name: "Cypress Test Grant 1", description: "Desc 1", tags: [] },
          { id: 202, name: "Cypress Test Grant 2", description: "Desc 2", tags: [] },
        ],
        errorCode: null,
      },
    }).as("createGrants");

    // Visit the page
    cy.visit("/grants/add"); // Adjust the route if needed

    // Switch to the JSON Upload tab
    cy.get('[data-testid="tab-json"]').click();
    cy.get('[data-testid="tab-json"]').should("have.class", "border-green-500"); // Check for active class
  });

  it("should allow uploading a valid JSON file, confirming, and submitting successfully", () => {
    // --- Upload File ---
    // Use the fixture file we created
    cy.get('[data-testid="file-input"]') // Select the hidden file input
      .selectFile("cypress/fixtures/grants.json", { force: true }); // Use force because it's hidden

    // --- Assertions for Confirmation Step ---
    // 1. Check that the confirmation view is visible
    cy.get('[data-testid="confirmation-view"]') // Assuming the confirmation div has this testid
      .should("be.visible")
      .and("contain.text", "File Ready for Submission")
      .and("contain.text", "Found 2 grants") // Check grant count from fixture
      .and("contain.text", "grants.json"); // Check file name

    // 2. Check the list preview (optional but good)
    cy.get('[data-testid="confirmation-view"]').find("li").should("have.length", 2);
    cy.get('[data-testid="confirmation-view"]').should("contain.text", "Cypress Test Grant 1");

    // --- Confirm Submission ---
    cy.get('[data-testid="confirm-upload-button"]').click();

    // --- Assertions for Success ---
    // 1. Wait for the API call
    cy.wait("@createGrants").its("response.statusCode").should("eq", 201);

    // 2. Check for the success message
    cy.get('[data-testid="success-message"]').should("be.visible").and("contain.text", "2 grant(s) added successfully!");

    // 3. Check for the background task note
    cy.get('[data-testid="feedback-area"]').should("contain.text", "Tags are being generated in the background");

    // 4. Verify the UI reset back to the upload prompt
    cy.get('[data-testid="file-upload-zone"]').should("be.visible");
    cy.get('[data-testid="confirmation-view"]').should("not.exist");
  });

  it("should show an error message for an invalid JSON file structure", () => {
    // Create invalid JSON content on the fly
    const invalidJsonContent = '[{"name": "Wrong Structure"}]'; // Missing required fields

    // Upload the invalid content
    cy.get('[data-testid="file-input"]').selectFile(
      {
        contents: Cypress.Buffer.from(invalidJsonContent),
        fileName: "invalid.json",
        mimeType: "application/json",
      },
      { force: true }
    );

    // Assert that the file error message is shown
    cy.get('[data-testid="file-error-message"]') // Assuming the file error <p> has this testid
      .should("be.visible")
      .and("contain.text", "Invalid JSON structure");

    // Assert that the confirmation view is NOT shown
    cy.get('[data-testid="confirmation-view"]').should("not.exist");

    // Ensure API was NOT called
    // cy.get('@createGrants.all').should('have.length', 0); // Requires Cypress >= 12
    cy.get('[data-testid="success-message"]').should("not.exist"); // Alternative check
  });

  it("should allow canceling the confirmation step", () => {
    // Upload valid file
    cy.get('[data-testid="file-input"]').selectFile("cypress/fixtures/grants.json", { force: true });

    // Verify confirmation view is shown
    cy.get('[data-testid="confirmation-view"]').should("be.visible");

    // Click cancel
    cy.get('[data-testid="cancel-upload-button"]').click();

    // Verify the UI reset back to the upload prompt
    cy.get('[data-testid="file-upload-zone"]').should("be.visible");
    cy.get('[data-testid="confirmation-view"]').should("not.exist");
    cy.get('[data-testid="file-error-message"]').should("not.exist");

    // Ensure API was NOT called
    // cy.get('@createGrants.all').should('have.length', 0); // Requires Cypress >= 12
    cy.get('[data-testid="success-message"]').should("not.exist"); // Alternative check
  });
});

/*
Add these data-testid attributes to your components:

JsonUploadForm.tsx:
- File Upload Label/Zone: data-testid="file-upload-zone"
- Hidden File Input: data-testid="file-input"
- Confirmation View Div: data-testid="confirmation-view"
- Confirm Button: data-testid="confirm-upload-button"
- Cancel Button: data-testid="cancel-upload-button"
- File Error <p>: data-testid="file-error-message"
*/
