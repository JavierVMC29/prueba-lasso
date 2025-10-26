# DAULE Frontend

## Requisitos previos

1. Tener instalado Node.js 20.10.0 o superior
2. Tener instalado pnpm

## Como levantar en local

Crea un archivo `.env` y copia el contenido del archivo `.env.example`

Instala las dependencias:

```bash
pnpm install --frozen-lockfile
```

Levanta el proyecto en modo desarrollo:

```bash
pnpm run dev
```

### Como agregar nuevas dependencias

Para agregar una nueva dependencia:

```bash
pnpm add -E <nombre-de-la-libreria>
```

Para agregar una nueva dependencia de desarrollo:

```bash
pnpm add -E -D <nombre-de-la-libreria>
```

- El `-E` sirve para instalar una version exacta.
- El `-D` sirve para isntalar dependencias de desarrollo.

## Como desplegar

Haz el build del proyecto:

```bash
pnpm run build
```

Esto generara los archivos estaticos en la carpeta `dist`

Estos archivos los puedes subir al servidor donde vayas a desplegar.

---

## SonarQube

Para realizar un análisis estático del código en tu máquina local, sigue estas instrucciones:

1.  Levanta el contenedor de SonarQube con Docker:
    ```bash
    docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
    ```
2.  Accede a [http://localhost:9000](http://localhost:9000) con las credenciales por defecto:
    - **Usuario:** `admin`
    - **Clave:** `admin`
3.  Genera un token de acceso de usuario en My Account > Security > User Token.
4.  Añade el token generado a tu archivo de entorno de desarrollo (ej. `.env`):
    ```
    SONAR_TOKEN=<pega_aqui_tu_token>
    ```
5.  Ejecuta el script de análisis desde la raíz del proyecto:
    ```bash
    node sonarqube.js
    ```
    Los resultados estarán disponibles en tu instancia local de SonarQube. Para más información, consulta la [documentación oficial](https://docs.sonarsource.com/sonarqube/latest/try-out-sonarqube/).

---
