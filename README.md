# Banking APP by Guesmia

This project is bootstacked by Next.js 15.03, PostgreSQL, Prisma, and Docker.

## Getting Started

### Prerequisties

-   Node.js: Version 20.0 or higher
-   Docker: Required only if PostgreSQL is not installed locally

### Development

1. Set environment variables

    Refer to `.env.example` for the required environment variables and create a `.env` file with the necessary configurations.

2. Setup DB configuration

    Use the following commands to set up the PostgreSQL database:

    ```bash
    docker-compose up -d
    npx prisma generate
    npx prisma migrate dev
    ```

3. Start the application locally:

    ```bash
    npm run dev
    ```

### Testing

Automated testing is handled via GitHub workflows, ensuring continuous integration and quality checks.
To run tests locally, use:

```bash
npm test
```

## Hosting

This project is continuously deployed to **Vercel**, utilizing Vercel’s seamless GitHub integration. Every push to the repository triggers an automatic deployment.
