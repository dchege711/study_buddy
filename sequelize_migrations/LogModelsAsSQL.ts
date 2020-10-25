import { sequelize } from "../src/models/db/DBModels";

const DIVIDER = "------------------------------------";

/**
 * @description Process the logs of `sequelize.sync` by filtering out the
 * `DROP TABLE` statements, and splitting each log into multiple lines. The
 * splitting helps tools like `diff` give us a better understanding of how the
 * SQL has changed between database versions.
 *
 * @param line A line logged by `sequelize.sync`
 */
function processSyncLogs(line: String) {
  // Ignore `DROP TABLE` lines because they're always generated.
  if (line.startsWith("Executing (default): DROP TABLE IF EXISTS")) return;
  // Split each line into several SQL clauses so that we can diff for changes.
  // Tools like diff operate at line-difference level.
  line = line.replace("Executing (default): ", "");
  let clauses = line.split(";");
  clauses.forEach((clause) => {
    let parts = clause.split(",");
    parts.forEach((part, idx) => {
      part = part.trim();
      if (!part) return;

      let hasComma = idx !== parts.length - 1;
      console.log(`${part}${hasComma ? "," : ""}`);
    });
  });
  console.log(DIVIDER);
}

function main() {
  sequelize.sync({ force: true, logging: processSyncLogs }).then(
    function (_ /* the sequelize instance */) {
      // Deliberately do nothing. `processSyncLogs` logs the output and
      // that's all we need.
    },
    function (err) {
      // Keys: 'name', 'parent', 'original', 'sql', 'parameters'
      console.error(err.original);
    }
  );
}

if (require.main === module) {
  main();
}
