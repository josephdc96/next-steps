const bcryptjs = require('bcryptjs');

const password = "cauJoseph96";
bcryptjs.hash(password, 12).then((x) => console.log(x));