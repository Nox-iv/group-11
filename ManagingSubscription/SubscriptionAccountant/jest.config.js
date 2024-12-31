// jest.config.js
module.exports = {
    // The test environment that will be used for testing
    testEnvironment: 'node',
    
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // The glob patterns Jest uses to detect test files
    testMatch: [
      '**/__tests__/**/*.js',
      '**/*.test.js'
    ],
  
    // An array of regexp pattern strings that are matched against all test paths
    testPathIgnorePatterns: [
      '/node_modules/'
    ]
  };