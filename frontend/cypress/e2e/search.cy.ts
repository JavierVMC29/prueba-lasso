describe("Barra de Búsqueda E2E", () => {
  // Antes de cada prueba en este archivo, iniciamos sesión y visitamos la página principal.
  beforeEach(() => {
    // Usamos el comando personalizado que creamos.
    // Recuerda configurar tus credenciales en cypress.config.ts o pasarlas directamente.
    cy.login();
    cy.visit("/");
  });

  it("debería encontrar resultados, mostrarlos y permitir la navegación", () => {
    const searchQuery = "Certificado";

    // 1. Interceptamos la llamada POST a la API de búsqueda.
    // Esto hace que nuestra prueba sea consistente y no dependa de la data real.
    cy.intercept("POST", "/ventanilla/interna/busqueda-coincidencias/consultar", {
      statusCode: 200,
      body: [
        {
          nombre: "Certificado de Prueba E2E",
          descripcion: "Descripción del certificado de prueba para el test.",
          link: "/certificaciones/prueba-e2e",
          icon: "file-text-icon", // Simula un ícono de tu DynamicIcon
        },
      ],
    }).as("searchRequest");

    // 2. Buscamos el input de búsqueda y escribimos en él.
    cy.get('input[placeholder="¿Qué trámite buscas?"]').should("be.visible").type(searchQuery);

    // 3. Esperamos a que la llamada a la API interceptada se complete.
    cy.wait("@searchRequest").its("request.body").should("deep.equal", {
      query: searchQuery,
    });

    // 4. Verificamos que el contenedor de resultados es visible.
    cy.contains(`Resultados para: "${searchQuery}"`).should("be.visible");

    // 5. Verificamos que nuestra tarjeta de resultado mockeada se renderizó.
    const resultCard = cy.contains(".cursor-pointer", "Certificado de Prueba E2E");
    resultCard.should("be.visible");
    resultCard.within(() => {
      cy.contains("Descripción del certificado de prueba para el test.").should("be.visible");
    });

    // 6. Hacemos clic en el resultado.
    resultCard.click();

    // 7. Verificamos que la navegación fue exitosa.
    cy.url().should("include", "/certificaciones/prueba-e2e");
  });

  it("debería mostrar un mensaje cuando no se encuentran resultados", () => {
    const searchQuery = "un-tramite-que-no-existe";

    // Interceptamos la llamada y devolvemos un array vacío para simular "no resultados".
    cy.intercept("POST", "/ventanilla/interna/busqueda-coincidencias/consultar", {
      statusCode: 200,
      body: [],
    }).as("emptySearchRequest");

    // Escribimos en la barra de búsqueda.
    cy.get('input[placeholder="¿Qué trámite buscas?"]').type(searchQuery);

    // Esperamos la respuesta de la API.
    cy.wait("@emptySearchRequest");

    // Verificamos que se muestra el mensaje correcto al usuario.
    cy.contains("p", "No se encontraron resultados para tu búsqueda.").should("be.visible");
  });
});
