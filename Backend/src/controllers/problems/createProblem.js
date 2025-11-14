const validateDetails = require("../../utils/validateDetails");
const judge0 = require("../../judge0/judge0");
const Problem = require("../../models/problems");

const createFullReferenceSolution = (referenceSolution, starterCode) => {
    const starterCodeMap = {};
    (starterCode || []).forEach((sc) => {
        starterCodeMap[sc.language] = sc;
    });
    const fullReferenceSolution = [];
    referenceSolution.forEach((rs) => {
        const sc = starterCodeMap[rs.language];
        const header = sc?.headerCode || "";
        const footer = sc?.mainCode || "";
        const fullSoln = {
            language: rs.language,
            solutionCode: `${header}\n${rs.solutionCode}\n${footer}`
        };
        fullReferenceSolution.push(fullSoln);
    });
    return fullReferenceSolution;
}

const createProblem = async (req, res) => {

    try {
        
        // adding problem creator _id in req.body object
        req.body.problemCreator = req.user._id;

        // validating problem details, if all the required fields are given or not
        validateDetails.problem(req.body);

        // extracting fields from req.body
        const {referenceSolution, starterCode, visibleTestCases, hiddenTestCases} = req.body;

        // create full solution
        const fullReferenceSolution = createFullReferenceSolution(referenceSolution, starterCode);

        // checking given refernce solution, if reference solution is itself satisfying the given test cases or not
        await judge0.validateProblem(fullReferenceSolution, visibleTestCases);

        await judge0.validateProblem(fullReferenceSolution, hiddenTestCases);

        // creating new document in the collection 'problems'
        const createdProblem = await Problem.create(req.body);

        res.status(201).json(createdProblem);

    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({"error": error.message});
    } 
}

module.exports = createProblem;
