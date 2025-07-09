const userData = {
  id: "1a054705-2d7c-4b80-a679-a10bfa983cc3", // Replace with your actual user ID
  name: "Clark Kent",
  email: "ckent@example.com",
  role: "GLOBAL_ADMIN"
};

const token = Buffer.from(JSON.stringify(userData)).toString('base64');
console.log("Your token is:", token);

