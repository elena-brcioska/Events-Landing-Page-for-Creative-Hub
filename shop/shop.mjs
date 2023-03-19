import {
  toggleUserControls,
  createAcademyCardEl,
  createCartElement,
  checkCart,
  checkUser,
  cartCount
} from '../utils/utils.mjs'

import {
  Academy
} from '../models/academy.mjs'

toggleUserControls();
createCartElement();
checkUser();
checkCart();

cartCount();

fetch(`https://63407044d1fcddf69cb8c368.mockapi.io/academies`)
  .then(res => res.json()
    .then((academies) => {
      academies = academies.map(academy => new Academy(academy))
      academies.forEach((academy) => {
        createAcademyCardEl(academy, 'shop')
      })
    }))
