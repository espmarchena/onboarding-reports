# Onboarding reports

Este proyecto es una aplicación web desarrollada en **Next.js** con **React 19** que muestra un **dashboard de actividad y asistencia** basado en datos extraídos desde GitHub (en otro repositorio).

## 🚀 Tecnologías utilizadas
- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Recharts (para visualización de datos)**
- **Puppeteer (para generación de PDF)**

## 📌 Características principales
- 📊 **Visualización de actividad de usuarios** (Commits, PRs, Asistencia)
- 📅 **Calendario de asistencia**
- 📄 **Exportación de reportes en PDF** con Puppeteer

## 🛠 Instalación y ejecución

1. Clonar el repositorio:
   ```sh
   git clone git@github.com:campus-CodeArts/onboarding-reports.git
   cd tu-repo
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```sh
   npm run dev
   ```
4. Descarga los datos de prueba del fichero disponible: TODO
5. Descomprímelos y ponlos en `public/data`.

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.


## 📝 Configuración
- **Archivos de configuración:**
  - `.env.local`: Variables de entorno para GitHub API y otras integraciones.
  - `data/users.json`: Datos de asistencia simulados.

Contenido para `.env.local`:

```
PUBLIC_URL=http://localhost:3000
#HTTP_USER=codearts
HTTP_PASSWORD=codearts
```

## 📌 Notas adicionales
- Los estilos principales están en `global.css` y se pueden modificar según necesidades.
- Se pueden agregar más visualizaciones en `components/`.

## 📃 Licencia
Este proyecto está bajo la licencia **MIT**.

**Desarrollado por CodeArts**