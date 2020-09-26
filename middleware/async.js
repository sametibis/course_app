// Controller içinde try/catch kullanmamak ve sadece burada tek bir yerden tüm catch bloklarını kontrol edebilmek için.
// kaynak : https://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// const asyncHandler2 = function (fn) {
//   return function (req, res, next) {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

module.exports = asyncHandler;
