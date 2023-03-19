import {
  User
} from './models/user.mjs'

import {
  Academy
} from './models/academy.mjs'

import {
  toggleUserControls,
  generateRandomId,
  registerUser,
  loginUser,
  logoutUser,
  goToShop,
  checkPwd,
  createAcademyCardEl,
  createCartElement,
  checkCart,
  checkUser,
  cartCount
} from '/utils/utils.mjs'

toggleUserControls();
createCartElement();
checkCart();
checkUser();
cartCount();

// CARDS

fetch(`https://63407044d1fcddf69cb8c368.mockapi.io/academies`)
  .then(res => res.json()
    .then((academies) => {
      academies = academies.map(academy => new Academy(academy))
      academies.forEach((academy) => {
        createAcademyCardEl(academy, 'eventsUpcoming')
      })
    }))
