import {
  Academy
} from '../models/academy.mjs'

import {
  User
} from '../models/user.mjs'

export class CartProduct {
  constructor(params, user) {
    this.academy = new Academy(params);
    this.userId = new User(user);
  }
}
