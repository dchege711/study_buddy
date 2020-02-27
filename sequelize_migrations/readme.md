# [DB Migrations](https://sequelize.org/v5/manual/migrations.html)

I'll be using `Sequelize-CLI` to handle database migrations for me. `$ npx sequelize-cli --help` is useful for listing the available commands.

## Running a Migration

`$ npx sequelize-cli migration:generate --name <NAME>` to generate migration files. As far as I know, these migration files will be empty skeletons. If we wanted auto-generated migration files, we'd generate the database models using commands like `$ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`. However, this creates `.js` files - making us lose all the good stuff that TypeScript provides.

We'll therefore be editing the migration files ourselves. The first migration file will be nasty, but it's gotta be done. I think subsequent migrations will be few and far between.

`$ npx sequelize-cli db:migrate` ensures ther migration table exists and runs any migration files that haven't been ran yet.

`$ npx sequelize-cli db:migrate:undo` reverts the most recent migration.
