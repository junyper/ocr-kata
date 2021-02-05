#!/usr/bin/env node

import { join, sep, basename } from 'path';
import glob from 'glob';

import { parseAccountNumbers } from './lib';
import { AccountNumberStatus } from './types';

const args = process.argv.slice(2);
const sourceDir = args[0] || '.';
const destinationDir = args[1] || sourceDir;

glob(join(sourceDir, sep, '*.data'), (err, files) => {
  if (err) {
    console.error(`🔴 ${err}`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.log(`🔴 No account number *.data files found.`);
  }
  files.forEach((sourceFilePath: string) => {
    console.log(`⏳ Parsing ${sourceFilePath}...`);

    parseAccountNumbers(sourceFilePath, destinationDir, (number: string, status: AccountNumberStatus) => {
      console.log(number, status);
    })
      .then((accountNumbers) => {
        console.log(`✅ Parsed ${accountNumbers.length} account numbers from ${basename(sourceFilePath)}.`);
        console.log(`Generated output file in ${destinationDir}.`);
      })
      .catch((err) => {
        console.error(`🔴 ${err}`);
      });
  });
});
