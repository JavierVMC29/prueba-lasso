/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para iniciar sesión a través de la API.
       * Guarda el token de autenticación en localStorage para persistir la sesión.
       * @param username - El nombre de usuario (cédula o RUC).
       * @param password - La contraseña del usuario.
       * @example cy.login('mi_usuario', 'mi_contraseña')
       */
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}

// --- Implementación del Comando 'login' ---
Cypress.Commands.add("login", (username, password) => {
  // Las credenciales pueden venir de los argumentos o de variables de entorno de Cypress
  // Es mejor práctica usar variables de entorno para no exponer datos sensibles en el código.
  const user = username || Cypress.env("TEST_USER_USERNAME");
  const pass = password || Cypress.env("TEST_USER_PASSWORD");

  // cy.session es la forma recomendada para manejar el login.
  // Cachea la sesión (localStorage, cookies, etc.) para que no se tenga que
  // iniciar sesión antes de cada prueba, haciendo los tests mucho más rápidos.
  cy.session([user, pass], () => {
    // 1. Hacemos la petición a la API para obtener el token
    cy.request({
      method: "POST",
      // Se actualizó la URL para que coincida con tu endpoint de autenticación.
      // Asegúrate de tener configurado el `baseUrl` en tu archivo cypress.config.ts
      url: "https://devenlinea.daule.gob.ec/servicios/autentificacion/iniciarSesion",
      body: {
        username: user,
        password: pass,
      },
    }).then((response) => {
      // Nos aseguramos de que la petición fue exitosa
      expect(response.status).to.eq(200);
      expect(response.body.estado).to.be.true;

      // 2. Extraemos los datos de la respuesta (coincide con GetAuthSuccessResponse)
      const { token, response: userData, expiresIn } = response.body;

      // 3. Creamos el objeto que se guardará en localStorage, imitando la estructura de tu store de Zustand
      const authStorage = {
        state: {
          token: token,
          user: userData,
          expiresAt: expiresIn,
          logoutTimeoutId: null, // Zustand lo manejará en la app
        },
        version: 0, // Zustand persist middleware suele añadir una versión
      };

      // 4. Guardamos el estado de autenticación en localStorage
      // Usamos cy.window() para acceder al objeto `window` del navegador
      cy.window().then((win) => {
        win.localStorage.setItem("auth-storage", JSON.stringify(authStorage));
      });
    });
  });
});
