# Simulation Labs

Play at https://simulationlabs.ai/

# Installation

- Have node version 16.14 (you can do this nicely by installing `nvm`, the node version manager, and then using `nvm use 16.14`)
- Use `npm install`
- Create `.env` with `API_KEY`, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` properly set
- Run `export $(cat .env | xargs)`
- Use `npm run dev`
- To see what to refactor use `grep -rni "TODO" * | grep -v node_modules | grep High | sed -E "s/.*TODO(.*)/TODO\1/g"`
