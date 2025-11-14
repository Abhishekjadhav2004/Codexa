// const axios = require("axios");
// const isObject = require("../utils/isObject");
// const { sleep } = require("../utils/utils"); 
// const CustomError = require("../utils/CustomError");

// const judge0 = {

//   // languages Ids
//   languageId: {
//     c: 110,
//     cpp: 105,
//     java: 91,
//     javascript: 102,
//     python: 109 
//   },

//   // error Ids
//   errors: {
//     4: "Wrong Answer",
//     5: "Time Limit Exceeded",
//     6: "Compilation Error",
//     7: "Runtime Error (SIGSEGV)",
//     8: "Runtime Error (SIGXFSZ)",
//     9: "Runtime Error (SIGFPE)",
//     10: "Runtime Error (SIGABRT)",
//     11: "Runtime Error (NZEC)",
//     12: "Runtime Error (Other)",
//     13: "Internal Error",
//     14: "Exec Format Error"
//   },


//   // to submitting solution to judge0
//   validateProblem: async function (referenceSolution, testCases) {   

//     // creating submission batch
//     const submissionBatch = this.createSubmissionBatch(referenceSolution, testCases);

//     // submitting batch to judge0
//     const result = await this.submitBatch(submissionBatch);
    
//     // checking result
//     await this.checkResult(result.data);

//   },

//   // to check the user submitted result
//   submitUserSolution: async function (userSolution, language, testCases) {   

//     // creating submission batch
//     const submissionBatch = this.createSubmissionBatch([{language: language, solutionCode: userSolution}], testCases);

//     // submitting batch to judge0
//     const result = await this.submitBatch(submissionBatch);
    
//     // checking result
//     return await this.getSubmissionResult(result.data);

//   },

//   // to run user solution
//   runUserSolution: async function (userSolution, language, testCases) {   

//     // creating submission batch
//     const submissionBatch = this.createSubmissionBatch([{language: language, solutionCode: userSolution}], testCases);

//     // submitting batch to judge0
//     const result = await this.submitBatch(submissionBatch);
    
//     // checking result
//     return await this.getRunTestResult(result.data);

//   },

//   // this fuctions creates submission batch
//   createSubmissionBatch: function (solutions, testCases) {

//     const submissionBatch = [];
    
//     for (const solution of solutions) {

//       if(!isObject(solution))
//         throw new CustomError("Solution Array can only contain elements of type Object", 400)

//       if(solution.solutionCode == "")
//         throw new CustomError("SolutionCode could not be empty field", 400);

//       languageId = this.getLanguageId(solution.language);

//       for (const testCase of testCases) {
//         const batch = {
//           language_id: languageId,
//           source_code: solution.solutionCode,
//           stdin: testCase.input,
//           expected_output: testCase.output
//         }

//         submissionBatch.push(batch);
//       }
      
//     }

//     return submissionBatch;
//   },


//   // submitting batch
//   submitBatch: async function (submissionBatch) {

//     const options = {
//       method: 'POST',
//       url: process.env.JUDGE0_URL,
//       params: {
//         base64_encoded: 'false'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST,
//         'Content-Type': 'application/json'
//       },
//       data: {
//         // adding submission batch
//         submissions: submissionBatch    
//       }
//     };

//     // submitting to judge0
//     const result = await axios.request(options);

//     return result;

//   },
 
  
//   // this function returns the language Id  if exists otherwise throw an error 'Invalid language'
//   getLanguageId: function (language) {
//     const languageId = this.languageId[language];

//     if(!languageId)
//       throw new CustomError(`Invalid language: '${language}' given in referenceSolution`, 400);

//     return languageId;
//   },


//   // check result
//   checkResult: async function (tokens) {
    
//     const tokenString = this.createTokenString(tokens);

//     const options = {
//       method: 'GET',
//       url: process.env.JUDGE0_URL,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     // checking if all testCases has successfully run or not 
//     let result;
//     while(true) {

//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id>2)

//       if(allTestCasesRun)
//         break;

//       await sleep(1000);
    
//     }

//     // checking have all test cases passed
//     for (const testCase of result) {
      
//       if(testCase.status_id != 3)
//         throw new CustomError(this.errors[testCase.status_id], 400);
//     }
//   },

//   // to get Submission result
//   getSubmissionResult: async function (tokens) {
    
//     const tokenString = this.createTokenString(tokens);

//     const options = {
//       method: 'GET',
//       url: process.env.JUDGE0_URL,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     // checking if all testCases has successfully run or not 
//     let result;
//     while(true) {

//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id>2)

//       if(allTestCasesRun)
//         break;

//       await sleep(1000);
    
//     }

//     const submissionResult = {
//       totalTestCases: result.length
//     }
//     // checking have all test cases passed
//     for (const testCase of result) {

//       if(testCase.status_id == 5) {

//         submissionResult.status = "tle";
//         submissionResult.errorMessage = testCase.compile_output;

//         return submissionResult;

//       }

//       if(testCase.status_id == 6) {

//         submissionResult.status = "compilation-error";
//         submissionResult.errorMessage = testCase.compile_output;

//         return submissionResult;

//       }

//       if(testCase.status_id >12) {

//         submissionResult.status = "pending";
//         submissionResult.errorMessage = testCase.compile_output;

//         return submissionResult;

//       }

//       if(testCase.status_id > 6) {

//         if(!submissionResult.passedTestCases)
//           submissionResult.passedTestCases = 0;
      
//         submissionResult.status = "runtime-error";
//         submissionResult.errorMessage = testCase.compile_output;
//         return submissionResult;

//       }

//       if(!submissionResult.passedTestCases) {
//         submissionResult.passedTestCases = 0;
//         submissionResult.runtime = 0;
//         submissionResult.memory = 0;
//       }
      
//       if(testCase.status_id==3)
//         submissionResult.passedTestCases++;

//       submissionResult.runtime += parseFloat(testCase.time);
//       if(testCase.memory > submissionResult.memory)
//         submissionResult.memory = testCase.memory;
//     }
    
//     if(submissionResult.passedTestCases<result.length)
//       submissionResult.status = "wrong-answer";
//     else
//       submissionResult.status = "accepted";

//     return submissionResult;
//   },  

//   // to get run test result
//   getRunTestResult: async function (tokens) {
    
//     const tokenString = this.createTokenString(tokens);

//     const options = {
//       method: 'GET',
//       url: process.env.JUDGE0_URL,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     // checking if all testCases has successfully run or not 
//     let result;
//     while(true) {

//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id>2)

//       if(allTestCasesRun)
//         break;

//       await sleep(1000);
    
//     }

//     let runTestResult = []
//     // checking if all test cases passed
//     for (const testCase of result) {

//       const testResult = {
//         status: null,
//         runtime: testCase.time,
//         memory: testCase.memory,
//         errorMessage: testCase.compile_output,
//         input: testCase.stdin,
//         expectedOutput: testCase.expected_output,
//         output: testCase.stdout
//       }

//       if(testCase.status_id==3)
//         testResult.status = "accepted";
//       else if(testCase.status_id==4) 
//         testResult.status = "wrong-answer";
//       else if(testCase.status_id==5) 
//         testResult.status = "tle";
//       else if(testCase.status_id == 6) 
//         testResult.status = "compilation-error";
//       else if(testCase.status_id >12) 
//         testResult.status = "pending";
//       else 
//         testResult.status = "runtime-error";

//       runTestResult.push(testResult);

//     }
//     return runTestResult;
//   },  

//   createTokenString: function (tokens) {
//     return tokens.map(tokenObject => tokenObject.token).join(',');
//   }

// }

// module.exports = judge0;
// const axios = require("axios");
// const isObject = require("../utils/isObject");
// const { sleep } = require("../utils/utils"); 
// const CustomError = require("../utils/CustomError");

// const judge0 = {

//   // languages Ids
//   languageId: {
//     c: 50,
//     cpp: 54,
//     java: 62,         // Correct ID for Java
//     javascript: 63,
//     python: 71 
// },


//   // error Ids
//   errors: {
//     4: "Wrong Answer",
//     5: "Time Limit Exceeded",
//     6: "Compilation Error",
//     7: "Runtime Error (SIGSEGV)",
//     8: "Runtime Error (SIGXFSZ)",
//     9: "Runtime Error (SIGFPE)",
//     10: "Runtime Error (SIGABRT)",
//     11: "Runtime Error (NZEC)",
//     12: "Runtime Error (Other)",
//     13: "Internal Error",
//     14: "Exec Format Error"
//   },

//   // to submitting solution to judge0
//   validateProblem: async function (referenceSolution, testCases) {   
//     const submissionBatch = this.createSubmissionBatch(referenceSolution, testCases);
//     const result = await this.submitBatch(submissionBatch);
//     await this.checkResult(result.data);
//   },

//   // to check the user submitted result
//   submitUserSolution: async function (userSolution, language, testCases) {   
//     const submissionBatch = this.createSubmissionBatch([{language: language, solutionCode: userSolution}], testCases);
//     const result = await this.submitBatch(submissionBatch);
//     return await this.getSubmissionResult(result.data);
//   },

//   // to run user solution
//   runUserSolution: async function (userSolution, language, testCases) {   
//     const submissionBatch = this.createSubmissionBatch([{language: language, solutionCode: userSolution}], testCases);
//     const result = await this.submitBatch(submissionBatch);
//     return await this.getRunTestResult(result.data);
//   },

//   // this function creates submission batch
//   createSubmissionBatch: function (solutions, testCases) {
//     const submissionBatch = [];

//     // Ensure solutions is always an array
//     if (!Array.isArray(solutions)) {
//         solutions = [solutions];
//     }

//     for (const solution of solutions) {
//       if (!isObject(solution))
//         throw new CustomError("Solution must be an object with language and solutionCode", 400);

//       if (!solution.solutionCode || solution.solutionCode.trim() === "")
//         throw new CustomError("solutionCode cannot be empty", 400);

//       const languageId = this.getLanguageId(solution.language);

//       for (const testCase of testCases) {
//         submissionBatch.push({
//           language_id: languageId,
//           source_code: solution.solutionCode,
//           stdin: testCase.input,
//           expected_output: testCase.output
//         });
//       }
//     }
//     return submissionBatch;
//   },

//   // submitting batch
//   submitBatch: async function (submissionBatch) {
//     // Ensure we hit the batch endpoint
//     const baseUrl = process.env.JUDGE0_URL;
//     const batchUrl = baseUrl.endsWith('/submissions/batch')
//       ? baseUrl
//       : baseUrl.endsWith('/submissions')
//         ? `${baseUrl}/batch`
//         : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;
//     const options = {
//       method: 'POST',
//       url: batchUrl,
//       params: {
//         base64_encoded: 'false'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST,
//         'Content-Type': 'application/json'
//       },
//       data: {
//         submissions: submissionBatch    
//       }
//     };

//     const result = await axios.request(options);
//     return result;
//   },

//   getLanguageId: function (language) {
//     const languageId = this.languageId[language];
//     if (!languageId)
//       throw new CustomError(`Invalid language: '${language}' given in referenceSolution`, 400);
//     return languageId;
//   },

//   checkResult: async function (tokens) {
//     const tokenString = this.createTokenString(tokens);
//     const baseUrl = process.env.JUDGE0_URL;
//     const batchUrl = baseUrl.endsWith('/submissions/batch')
//       ? baseUrl
//       : baseUrl.endsWith('/submissions')
//         ? `${baseUrl}/batch`
//         : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;
//     const options = {
//       method: 'GET',
//       url: batchUrl,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     let result;
//     while (true) {
//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id > 2);
//       if (allTestCasesRun) break;
//       await sleep(1000);
//     }

//     for (const testCase of result) {
//       if (testCase.status_id != 3) {
//         const details = [];
//         if (testCase.stderr) details.push(`stderr: ${testCase.stderr}`);
//         if (testCase.compile_output) details.push(`compile: ${testCase.compile_output}`);
//         if (testCase.message) details.push(`message: ${testCase.message}`);
//         const extra = details.length ? ` | ${details.join(' | ')}` : '';
//         throw new CustomError(`${this.errors[testCase.status_id]}${extra}`.trim(), 400);
//       }
//     }
//   },

//   getSubmissionResult: async function (tokens) {
//     const tokenString = this.createTokenString(tokens);
//     const baseUrl = process.env.JUDGE0_URL;
//     const batchUrl = baseUrl.endsWith('/submissions/batch')
//       ? baseUrl
//       : baseUrl.endsWith('/submissions')
//         ? `${baseUrl}/batch`
//         : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;
//     const options = {
//       method: 'GET',
//       url: batchUrl,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     let result;
//     while (true) {
//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id > 2);
//       if (allTestCasesRun) break;
//       await sleep(1000);
//     }

//     const submissionResult = { totalTestCases: result.length };
//     for (const testCase of result) {
//       if (testCase.status_id == 5) {
//         submissionResult.status = "tle";
//         submissionResult.errorMessage = testCase.compile_output;
//         return submissionResult;
//       }
//       if (testCase.status_id == 6) {
//         submissionResult.status = "compilation-error";
//         submissionResult.errorMessage = testCase.compile_output;
//         return submissionResult;
//       }
//       if (testCase.status_id > 12) {
//         submissionResult.status = "pending";
//         submissionResult.errorMessage = testCase.compile_output;
//         return submissionResult;
//       }
//       if (testCase.status_id > 6) {
//         submissionResult.status = "runtime-error";
//         submissionResult.errorMessage = testCase.compile_output;
//         return submissionResult;
//       }
//       if (!submissionResult.passedTestCases) {
//         submissionResult.passedTestCases = 0;
//         submissionResult.runtime = 0;
//         submissionResult.memory = 0;
//       }
//       if (testCase.status_id == 3)
//         submissionResult.passedTestCases++;
//       submissionResult.runtime += parseFloat(testCase.time);
//       if (testCase.memory > submissionResult.memory)
//         submissionResult.memory = testCase.memory;
//     }
//     if (submissionResult.passedTestCases < result.length)
//       submissionResult.status = "wrong-answer";
//     else
//       submissionResult.status = "accepted";

//     return submissionResult;
//   },

//   getRunTestResult: async function (tokens) {
//     const tokenString = this.createTokenString(tokens);
//     const baseUrl = process.env.JUDGE0_URL;
//     const batchUrl = baseUrl.endsWith('/submissions/batch')
//       ? baseUrl
//       : baseUrl.endsWith('/submissions')
//         ? `${baseUrl}/batch`
//         : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;
//     const options = {
//       method: 'GET',
//       url: batchUrl,
//       params: {
//         tokens: tokenString,
//         base64_encoded: 'false',
//         fields: '*'
//       },
//       headers: {
//         'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//         'x-rapidapi-host': process.env.X_RAPID_API_HOST
//       }
//     };

//     let result;
//     while (true) {
//       result = (await axios.request(options)).data.submissions;
//       const allTestCasesRun = result.every((testCase) => testCase.status_id > 2);
//       if (allTestCasesRun) break;
//       await sleep(1000);
//     }

//     let runTestResult = [];
//     for (const testCase of result) {
//       const testResult = {
//         status: null,
//         runtime: testCase.time,
//         memory: testCase.memory,
//         errorMessage: testCase.compile_output,
//         input: testCase.stdin,
//         expectedOutput: testCase.expected_output,
//         output: testCase.stdout
//       };
//       if (testCase.status_id == 3) testResult.status = "accepted";
//       else if (testCase.status_id == 4) testResult.status = "wrong-answer";
//       else if (testCase.status_id == 5) testResult.status = "tle";
//       else if (testCase.status_id == 6) testResult.status = "compilation-error";
//       else if (testCase.status_id > 12) testResult.status = "pending";
//       else testResult.status = "runtime-error";

//       runTestResult.push(testResult);
//     }
//     return runTestResult;
//   },

//   createTokenString: function (tokens) {
//     return tokens.map(tokenObject => tokenObject.token).join(',');
//   }
// };

// module.exports = judge0;
const axios = require("axios");
const isObject = require("../utils/isObject");
const { sleep } = require("../utils/utils");
const CustomError = require("../utils/CustomError");

const judge0 = {

  // Supported Language IDs
  languageId: {
    c: 50,
    cpp: 54,
    java: 62,
    javascript: 63,
    python: 71
  },

  // Error Mapping
  errors: {
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error"
  },

  // Validate problem with reference solution
  validateProblem: async function (referenceSolution, testCases) {
    const submissionBatch = this.createSubmissionBatch(referenceSolution, testCases);
    const result = await this.submitBatch(submissionBatch);
    await this.checkResult(result.data);
  },

  // Submit user solution (for evaluation)
  submitUserSolution: async function (userSolution, language, testCases) {
    const submissionBatch = this.createSubmissionBatch(
      [{ language: language, solutionCode: userSolution }],
      testCases
    );
    const result = await this.submitBatch(submissionBatch);
    return await this.getSubmissionResult(result.data);
  },

  // Run user code (for run/test mode)
  runUserSolution: async function (userSolution, language, testCases) {
    const submissionBatch = this.createSubmissionBatch(
      [{ language: language, solutionCode: userSolution }],
      testCases
    );
    const result = await this.submitBatch(submissionBatch);
    return await this.getRunTestResult(result.data);
  },

  // Create submission batch
  createSubmissionBatch: function (solutions, testCases) {
    const submissionBatch = [];

    if (!Array.isArray(solutions)) {
      solutions = [solutions];
    }

    for (const solution of solutions) {
      if (!isObject(solution))
        throw new CustomError("Solution must be an object with language and solutionCode", 400);

      if (!solution.solutionCode || solution.solutionCode.trim() === "")
        throw new CustomError("solutionCode cannot be empty", 400);

      const languageId = this.getLanguageId(solution.language);

      for (const testCase of testCases) {
        submissionBatch.push({
          language_id: languageId,
          source_code: solution.solutionCode,
          stdin: testCase.input,
          expected_output: testCase.output
        });
      }
    }

    return submissionBatch;
  },

  // ✅ Optimized batch submission (Base64 + Chunked)
  submitBatch: async function (submissionBatch) {
    const baseUrl = process.env.JUDGE0_URL;
    const batchUrl = baseUrl.endsWith('/submissions/batch')
      ? baseUrl
      : baseUrl.endsWith('/submissions')
        ? `${baseUrl}/batch`
        : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;

    const chunkSize = 3; // Avoid large payload (10KB limit on RapidAPI)
    const allResults = [];

    for (let i = 0; i < submissionBatch.length; i += chunkSize) {
      const batch = submissionBatch.slice(i, i + chunkSize);

      // Encode safely in base64
      const encodedBatch = batch.map(item => ({
        language_id: item.language_id,
        source_code: Buffer.from(item.source_code).toString("base64"),
        stdin: Buffer.from(item.stdin || "").toString("base64"),
        expected_output: Buffer.from(item.expected_output || "").toString("base64")
      }));

      const options = {
        method: "POST",
        url: batchUrl,
        params: {
          base64_encoded: "true"
        },
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.X_RAPID_API_KEY,
          "x-rapidapi-host": process.env.X_RAPID_API_HOST
        },
        data: { submissions: encodedBatch }
      };

      try {
        const result = await axios.request(options);
        allResults.push(...result.data);
      } catch (err) {
        console.error("❌ Judge0 Batch Submission Failed:");
        console.error("Payload size:", JSON.stringify(batch).length, "bytes");
        console.error(err.response?.data || err.message);
        throw new CustomError(`Judge0 submission failed: ${err.message}`, 400);
      }

      // Prevent rate-limit errors
      await sleep(1000);
    }

    return { data: allResults };
  },

  // Get Language ID
  getLanguageId: function (language) {
    const languageId = this.languageId[language];
    if (!languageId)
      throw new CustomError(`Invalid language: '${language}'`, 400);
    return languageId;
  },

  // Check problem validation result
  checkResult: async function (tokens) {
    const tokenString = this.createTokenString(tokens);
    const baseUrl = process.env.JUDGE0_URL;
    const batchUrl = baseUrl.endsWith('/submissions/batch')
      ? baseUrl
      : baseUrl.endsWith('/submissions')
        ? `${baseUrl}/batch`
        : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;

    const options = {
      method: "GET",
      url: batchUrl,
      params: {
        tokens: tokenString,
        base64_encoded: "true",
        fields: "*"
      },
      headers: {
        "x-rapidapi-key": process.env.X_RAPID_API_KEY,
        "x-rapidapi-host": process.env.X_RAPID_API_HOST
      }
    };

    let result;
    while (true) {
      result = (await axios.request(options)).data.submissions;
      const allDone = result.every((t) => t.status_id > 2);
      if (allDone) break;
      await sleep(1000);
    }

    for (const testCase of result) {
      if (testCase.status_id != 3) {
        const details = [];
        if (testCase.stderr) details.push(`stderr: ${testCase.stderr}`);
        if (testCase.compile_output) details.push(`compile: ${testCase.compile_output}`);
        if (testCase.message) details.push(`message: ${testCase.message}`);
        const extra = details.length ? ` | ${details.join(" | ")}` : "";
        throw new CustomError(`${this.errors[testCase.status_id]}${extra}`.trim(), 400);
      }
    }
  },

  // Get submission result (for user submissions)
  getSubmissionResult: async function (tokens) {
    const tokenString = this.createTokenString(tokens);
    const baseUrl = process.env.JUDGE0_URL;
    const batchUrl = baseUrl.endsWith('/submissions/batch')
      ? baseUrl
      : baseUrl.endsWith('/submissions')
        ? `${baseUrl}/batch`
        : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;

    const options = {
      method: "GET",
      url: batchUrl,
      params: {
        tokens: tokenString,
        base64_encoded: "true",
        fields: "*"
      },
      headers: {
        "x-rapidapi-key": process.env.X_RAPID_API_KEY,
        "x-rapidapi-host": process.env.X_RAPID_API_HOST
      }
    };

    let result;
    while (true) {
      result = (await axios.request(options)).data.submissions;
      const allDone = result.every((t) => t.status_id > 2);
      if (allDone) break;
      await sleep(1000);
    }

    const submissionResult = { totalTestCases: result.length };
    for (const testCase of result) {
      if (testCase.status_id == 5) {
        submissionResult.status = "tle";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }
      if (testCase.status_id == 6) {
        submissionResult.status = "compilation-error";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }
      if (testCase.status_id > 12) {
        submissionResult.status = "pending";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }
      if (testCase.status_id > 6) {
        submissionResult.status = "runtime-error";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }
      if (!submissionResult.passedTestCases) {
        submissionResult.passedTestCases = 0;
        submissionResult.runtime = 0;
        submissionResult.memory = 0;
      }
      if (testCase.status_id == 3)
        submissionResult.passedTestCases++;
      submissionResult.runtime += parseFloat(testCase.time);
      if (testCase.memory > submissionResult.memory)
        submissionResult.memory = testCase.memory;
    }
    if (submissionResult.passedTestCases < result.length)
      submissionResult.status = "wrong-answer";
    else
      submissionResult.status = "accepted";

    return submissionResult;
  },

  // Get Run Test result
  getRunTestResult: async function (tokens) {
    const tokenString = this.createTokenString(tokens);
    const baseUrl = process.env.JUDGE0_URL;
    const batchUrl = baseUrl.endsWith('/submissions/batch')
      ? baseUrl
      : baseUrl.endsWith('/submissions')
        ? `${baseUrl}/batch`
        : `${baseUrl.replace(/\/$/, '')}/submissions/batch`;

    const options = {
      method: "GET",
      url: batchUrl,
      params: {
        tokens: tokenString,
        base64_encoded: "true",
        fields: "*"
      },
      headers: {
        "x-rapidapi-key": process.env.X_RAPID_API_KEY,
        "x-rapidapi-host": process.env.X_RAPID_API_HOST
      }
    };

    let result;
    while (true) {
      result = (await axios.request(options)).data.submissions;
      const allDone = result.every((t) => t.status_id > 2);
      if (allDone) break;
      await sleep(1000);
    }

    const runTestResult = [];
    for (const testCase of result) {
      const testResult = {
        status: null,
        runtime: testCase.time,
        memory: testCase.memory,
        errorMessage: testCase.compile_output,
        input: testCase.stdin,
        expectedOutput: testCase.expected_output,
        output: testCase.stdout
      };
      if (testCase.status_id == 3) testResult.status = "accepted";
      else if (testCase.status_id == 4) testResult.status = "wrong-answer";
      else if (testCase.status_id == 5) testResult.status = "tle";
      else if (testCase.status_id == 6) testResult.status = "compilation-error";
      else if (testCase.status_id > 12) testResult.status = "pending";
      else testResult.status = "runtime-error";

      runTestResult.push(testResult);
    }
    return runTestResult;
  },

  // Combine tokens into string
  createTokenString: function (tokens) {
    return tokens.map(t => t.token).join(",");
  }
};

module.exports = judge0;
