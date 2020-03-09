# [DB Migrations](https://sequelize.org/v5/manual/migrations.html)

- [Running a Migration](#running-a-migration)
- [Other Commands](#other-commands)
- [Appendix](#appendix)
  - [Why is the migration file empty?](#why-is-the-migration-file-empty)

I'll be using `Sequelize-CLI` to handle database migrations for me. `$ npx sequelize-cli --help` is useful for listing the available commands.

## Running a Migration

`$ python migration_helper.py --reason=your-reason-for-the-db-change`

* This will create a `.dump` file of the current database state in the `sql_dumps` folder.
* It will also create a `.diff` file of the above dump with the most recent dump if any.
* It will also generate a migration file in the `migrations` folder by calling `$ npx sequelize-cli migration:generate --name your-reason-for-the-db-change`. See [why is the migration file empty?](#why-is-the-migration-file-empty)

`$ npx sequelize-cli db:migrate`

* Ensures that the migration table exists and runs any migration files that haven't been ran yet.

## Other Commands

`$ npx sequelize-cli db:migrate:undo` reverts the most recent migration.

## Appendix

### Why is the migration file empty?

* `$ npx sequelize-cli migration:generate --name your-reason-for-the-db-change` generates empty migration files in the `migrations` folder.
* As far as I know, these migration files will be empty skeletons.
* If we wanted auto-generated migration files, we'd generate the database models using commands like `$ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`.
* However, this creates `.js` files - making us lose all the good stuff that TypeScript provides.
* We'll therefore be editing the migration files ourselves. The first migration file will be nasty, but it's gotta be done. I think subsequent migrations will be few and far between.
