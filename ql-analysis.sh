# Assumes `codeql` is installed and available in the PATH.
# https://docs.github.com/en/code-security/codeql-cli/getting-started-with-the-codeql-cli/setting-up-the-codeql-cli

# Create a CodeQL database.
# https://docs.github.com/en/code-security/codeql-cli/getting-started-with-the-codeql-cli/preparing-your-code-for-codeql-analysis
codeql_db_dir="codeql-db"
rm -rf codeql-db
codeql database create $codeql_db_dir --language=javascript-typescript --no-run-unnecessary-builds

# Analyze the CodeQL database.
# https://docs.github.com/en/code-security/codeql-cli/getting-started-with-the-codeql-cli/analyzing-your-code-with-codeql-queries
output_file_path="$codeql_db_dir/analysis.sarif"
codeql database analyze codeql-db codeql/javascript-queries \
    --download --sarif-category=javascript-typescript --format=sarifv2.1.0 \
    --output=$output_file_path

# https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer
# helps me see the SARIF file in a more readable format. No need to push to GitHub.
#
# Upload the SARIF file to GitHub for easier viewing.
# head_sha="$(git log --format="%H" -n 1)"
# current_branch="$(git branch --show-current)"
# codeql github upload-results \
#     --repository=dchege711/study_buddy --ref=refs/heads/$current_branch \
#     --commit=$head_sha --sarif=$output_file_path
