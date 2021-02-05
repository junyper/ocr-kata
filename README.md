# A solution to the Bank OCR code Kata

(see <http://codingdojo.org/kata/BankOCR/>)

This Kata was presented at XP2006 by EmmanuelGaillot and ChristopheThibaut.
## Running the CLI script

In this workspace run `npm install && npm link`.

Run `ocr-kata <source> <destination>`.

The output will be generated into the `<destination>` directory, or the `<source>` directory if omitted, with a `.out` extension.

E.g: `ocr-kata src/__fixtures__` will generate `.out` files in the `src/__fixtures__` directory.
## Building changes

Run `npm run build`. The build output will be generated in the `/dist` directory.
## Running tests

Run `npm test` or `npx jest --watch` to run the tests in 'watch' mode.
