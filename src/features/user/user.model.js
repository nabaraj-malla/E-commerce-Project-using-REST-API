export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this.id = id;
  }

  static signUp(name, email, password, type) {
    const newUser = new UserModel(name, email, password, type);
    newUser.id = users.length + 1;
    users.push(newUser);
    console.log("newUser", newUser);
    return newUser;
  }

  static signIn(email, password) {
    const user = users.find(
      (user) => user.email == email && user.password == password
    );
    return user;
  }

  static getAll() {
    return users;
  }
}

let users = [
  {
    id: 1,
    name: "seller User",
    email: "seller@seller.com",
    password: "1seller1",
    type: "seller",
  },
  {
    id: 2,
    name: "user1",
    email: "user1@test.com",
    password: "user1#1",
    type: "customer",
  },
];
