#!/usr/bin/env python

"""
A meta-helper script for managing my database migrations.
"""

import argparse
import logging
import os
import pathlib
import subprocess

from datetime import datetime
from glob import glob
from typing import List

logging.basicConfig(
    format="%(filename)s:%(funcName)s:%(lineno)s: %(levelname)s: %(message)s", 
    level=logging.DEBUG)

# https://stackoverflow.com/questions/3430372/how-do-i-get-the-full-path-of-the-current-files-directory/3430395#3430395
WORKING_DIR = pathlib.Path(__file__).parent.absolute()

DUMPS_DIR = os.path.join(WORKING_DIR, "sql_dumps")
if not os.path.exists(DUMPS_DIR): os.mkdir(DUMPS_DIR)

def get_dump_file_name_without_extension(suffix: str):
    """
    Returns the filepath that should be used to create the files WITHOUT the
    extension. It is up to the caller to append an appropriate suffix. For
    instance, the returned string may be: `/path/to/use/name`. The caller should
    append suffixes like `/path/to/use/name.dump` before creating a file.
    """
    prefix = datetime.now().isoformat(timespec="milliseconds")
    file_name = "--".join([prefix, suffix]) # Two dashes for name splitting
    return os.path.join(DUMPS_DIR, file_name)

def get_file_paths_of_diff_targets() -> List[str]:
    """
    Returns the two most recently created `.dump` files in `sql_dumps/` folder.
    This function assumes that the files are prefixed by the ISO-string of their
    creation time, and therefore sorting makes sense. The newest dump is listed
    first.

    If no such pair exists, the function returns an empty list.
    """

    dump_filepaths = glob(os.path.join(DUMPS_DIR, "*.dump"))

    # If there aren't enough files to diff, return an empty list.
    if len(dump_filepaths) < 2: return []

    dump_filepaths.sort(reverse=True)
    return dump_filepaths[:2]

    # Otherwise, we only have one `.dump` file and it doesn't make sense to diff
    return None

def make_sql_dump(dump_file_suffix: str) -> str:
    """
    Make a SQL dump of the current database models. Return the filepath of the
    created dump.
    """
    
    path_without_ext = get_dump_file_name_without_extension(dump_file_suffix)
    sql_dump_filepath = "".join([path_without_ext, ".dump"])
    fd = open(sql_dump_filepath, "w")

    logging.info("Writing a new SQL dump to {}...".format(sql_dump_filepath))

    try:
        # `npx` runs the binary using the local `node_modules` [1]. We installed
        # `ts-node` as a dev dependency for this project. `ts-node` allows us to run
        # .ts files 'directly' [2].
        #
        # [1]: https://www.npmjs.com/package/npx
        # [2]: https://github.com/TypeStrong/ts-node
        results = subprocess.run(
            ["npx", "ts-node", "LogModelsAsSQL.ts"],
            check=True, stdout=fd)
        logging.info("... SUCCESS!")

    except subprocess.CalledProcessError as err:
        logging.info("...FAILED!")
        logging.error(err.with_traceback())
    
    fd.close()

    return sql_dump_filepath

def diff_sql_dumps_if_possible():
    """
    Diff the two most recent files in the `sql_dumps` folder and store the
    results in a `.diff` file that shares the basename of the newer of the two
    files.

    If there aren't two such files, then this function is a no-op.
    """
    diff_targets = get_file_paths_of_diff_targets()
    if not diff_targets:
        logging.warning("No SQL dumps were found for diff'ing.")
        return

    diff_output_file = diff_targets[0].replace(".dump", ".diff")
    fd = open(diff_output_file, "w")

    logging.info(f"Comparing {os.path.split(diff_targets[0])[1]} to "
                 f"{os.path.split(diff_targets[1])[1]}...")
    
    try:
        # `$ diff from.file to.file`. We therefore need to supply the older
        # file first since we want to know how to get to the newer state.
        results = subprocess.run(
            ["diff", diff_targets[1], diff_targets[0], "--side-by-side", 
                "--suppress-common-lines", "--minimal", "--ignore-blank-lines"],
            check=True, stdout=fd)
        logging.info("...SUCCESS!")

    except subprocess.CalledProcessError as err:
        logging.info("...FAILED!")
        logging.error(err.with_traceback())

    fd.close()
    

def main():
    os.chdir(WORKING_DIR)
    logging.info("Working from {}".format(WORKING_DIR))

    parser = argparse.ArgumentParser(
        description="A meta-helper script for managing my database migrations.")

    parser.add_argument(
        "--reason", type=str, 
        help="The reason for the migration, preferably without whitespace, "
             "e.g. 'add-user-table'. If specified, a new SQL dump file will be "
             "created and diff'd")
    
    args = parser.parse_args()

    if args.reason: current_dump_path = make_sql_dump(args.reason)
    diff_sql_dumps_if_possible()

if __name__ == "__main__":
    main()
