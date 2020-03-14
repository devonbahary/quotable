require('@babel/register');

const UsersService = require('../services/UsersService').default;
const usersService = new UsersService();

(async () => {
    try {
        await usersService.assignAndNotifyTodaysRandomQuote();
    } catch (err) {
        console.error('assignDailyQuotes.js error:', err);
    }
    process.exit(1);
})();