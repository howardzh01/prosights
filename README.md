# ProSights

Monorepo

# Getting Started

- Use `npm install`
- Create `.env` file in root. Ask Kevin for the variables! You will need at a minimum, variables for Clerk, OpenAI, Supabase, Data Sources (e.g. Coresignal, SEMRUSH, ...), and Posthog
- Use `npm run dev` to get a running localhost
- We use Vercel for deployments of the NextJS app, so pushing to the main branch will auto-update the site if the build succeeds. Contact Howard for Vercel/deployment related issues

# Special Dependencies

- We use Modal for xlsx downloads, which has a development instance and a token id/secret on Kevin's computer. If you want to serve or deploy your own instance, you can set up a modal account (do "modal [serve/deploy] [file_path_to_python_function]") and update the xlsx download API endpoint URL.
- Clerk (for user authentication) has both a development and production instance. Since we are using a social login (i.e. Google), we're required to provide our own Client ID and Client secret. This is NOT an issue for development instances because Clerk provides their own Client ID/secret to make the development process easy. Thus, Kevin made a client ID/secret using the Google API Console with his Prosights account. If you need changes, contact him.
