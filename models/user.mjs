export class User {
  constructor (param) {
    this.id = param.id;
    this.createdAt = param.createdAt;
    this.name = param.name;
    this.avatar = param.avatar;
    this.password = param.password;
    this.email = param.email;
  }
}
