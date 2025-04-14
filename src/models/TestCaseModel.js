TestCast: [
  {
    name: "Login",
    userStory: "description of the story",
    testScenarios: [
      {
        scenario: "scenario1",
        testCases: [
          {
            name: "testcase1",
            testScript: {
              scriptId: "abc123",
              url: "abc.com",
              script: "script",
            },
            testCaseCategory: ["smoke", "regression"],
          },
          {
            name: "testcase2",
            testScript: {
              scriptId: "abc123",
              url: "xyz.com",
              script: "script",
            },
            testCaseCategory: ["smoke"],
          },
        ],
        bddScenario: [],
        automationScript: [],
      },
      {
        scenario: "scenario2",
        testCases: [
          { name: "testcase1", testScript: [{}] },
          { name: "testcase2", testScript: [{}] },
        ],
        bddScenario: [],
        automationScript: [],
      },
    ],
  },
];
