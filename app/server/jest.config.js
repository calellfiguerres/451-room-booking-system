module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/client/app/$1',
        '^~/.client/(.*)$': '<rootDir>/client/app/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};