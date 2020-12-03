# TrueAccord Interview Project

Prompt: https://gist.github.com/jeffling/2dd661ff8398726883cff09839dc316c

### Usage:
- `npm install` to install all the required packages
- `npm start` will run the program and output the process debts, one per line in the console
- `npm test` will run the mocha tests found in the test/ directory


### Overview of Time:
- ~30 mins writing initial script to understand functionality and API responses.
- ~1 hr rewriting to class style for easier testability and started simple tests
- ~1 hr Testing and fixing bugs
- ~15 mins writing summary/documentation and checking deliverables

### Notes:
- I needed to keep performance in mind, so I knew that I should to preprocess the payments before iterating through each of the debts. Otherwise, I would have iterated through each payment for each debt resulting in a O(n^2) runtime.
- I needed a function to populate the data and also a way to pass in data so that I can rely on my own data for tests instead of the API.
- With more time I would have experimented with different ways to aggregate payments and assign them to debts to test tradeoffs for time and spatial performance

### Bugs:
- The prompt states that API responses with dates would be in ISO 8601 format, but they were in the format: "YYYY-MM-DD"  

