module.exports = {
  setupFilesAfterEnv: ['<rootDir>/env.config.js'],
  coverageDirectory: '<rootDir>/storage/coverage',
  collectCoverageFrom: [
    '{api,src}/**/**/*.{js,jsx}',
    '{src/utils}/*.js',
    '!{api,src}/**/**/index.{js,jsx}',
    '!{src/utils}/index.js',
    '!src/server/dist.{js,map}'
  ],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/config/jest/styleMock.js'
  },
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.jsx?$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/']
};