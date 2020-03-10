require('@babel/register');

const UsersService = require('../services/UsersService').default;
const usersService = new UsersService();

(async () => {
    await usersService.assignRandomDailyQuotes();
    process.exit(1);
})();