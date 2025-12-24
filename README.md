## Todo App – Clean Starter

This project is a **minimal Next.js app** prepared as a clean starting point for building a new Todo application.

### Prerequisites

-   Node.js 18+ and npm
-   Docker and Docker Compose

### Database Setup (MySQL with Docker)

1. **Start MySQL container:**

    ```bash
    docker-compose up -d
    ```

2. **Create `.env` file** in the root directory:

    ```env
    # Database Configuration
    MYSQL_ROOT_PASSWORD=rootpassword
    MYSQL_DATABASE=todoapp
    MYSQL_USER=todoapp_user
    MYSQL_PASSWORD=todoapp_password
    MYSQL_PORT=3306

    # Database Connection String (for Prisma)
    DATABASE_URL="mysql://todoapp_user:todoapp_password@localhost:3306/todoapp"
    ```

3. **Check MySQL is running:**

    ```bash
    docker-compose ps
    ```

4. **Stop MySQL container:**

    ```bash
    docker-compose down
    ```

5. **Stop and remove volumes (⚠️ deletes all data):**
    ```bash
    docker-compose down -v
    ```

### Scripts

-   **`npm run dev`**: Start the development server on `http://localhost:3000`
-   **`npm run build`**: Create a production build
-   **`npm run start`**: Run the production build

### Current State

-   Empty `Home` page (`src/app/page.tsx`) with a basic `<main>` wrapper
-   Minimal global styles in `src/app/globals.css`
-   Simple `RootLayout` in `src/app/layout.tsx` with updated metadata
-   MySQL database configured with Docker Compose

You can now freely design the UI and structure the app (components, hooks, state management) without any of the default Create Next App boilerplate.
