import {
  CartProduct
} from '../models/cartProduct.mjs'

import {
  User
} from '../models/user.mjs'

import {
  Academy
} from '../models/academy.mjs'

export const toggleUserControls = () => {
  const registerBtn = document.getElementById('submitRegistration');
  registerBtn.addEventListener('click', () => registerUser())

  const loginBtn = document.getElementById('submitLogin');
  loginBtn.addEventListener('click', () => loginUser())

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => logoutUser())

  if (localStorage.getItem('user')) {
    document.getElementById('loggedInUserControlBtn').style.display = 'block';
    document.getElementById('userControlBtn').style.display = 'none';
  } else {
    document.getElementById('loggedInUserControlBtn').style.display = 'none';
    document.getElementById('userControlBtn').style.display = 'block';
    document.getElementById('loginBtn').disabled = false;
  }
}

// CHECK PASSWORD

export const checkPwd = (str, values) => {

  const errorMsg = document.getElementById('errorMsg');

  if (str.length < 10) {
    errorMsg.style.visibility = 'visible';
    errorMsg.innerHTML = "Password must be at least 10 characters long";
  } else if (str.search(/[a-z]/) == -1) {
    errorMsg.style.visibility = 'visible';
    errorMsg.innerHTML = "Password must contain at least one lowercase letter";
  } else if (str.search(/[0-9]/) == -1) {
    errorMsg.style.visibility = 'visible';
    errorMsg.innerHTML = "Password must contain at least one number";
  } else if (str.search(/[A-Z]/) == -1) {
    errorMsg.style.visibility = 'visible';
    errorMsg.innerHTML = "Password must contain at least one uppercase letter";
  } else if (str.search(/[#?!@$%^&*-]/) == -1) {
    errorMsg.style.visibility = 'visible';
    errorMsg.innerHTML = "Password must contain at least one special character";
  } else if (str.search) {
    errorMsg.style.visibility = 'hidden';
    document.getElementById('submitRegistration').disabled = true;
    return true;

  }
}

// REGISTER

export const registerUser = () => {

  const form = document.forms['registerForm'];
  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  if (form.checkValidity()) {
    if (checkPwd(values.password, values)) {
      document.getElementById('errorMsg').style.visibility = 'hidden';
      fetch('https://63407044d1fcddf69cb8c368.mockapi.io/users', {
        method: 'POST',
        body: values
      }).then(() => {
        $('#registerUser').modal('hide')
        $('#loginUser').modal('show')
      })
    }
  } else {
    document.getElementById('errorMsg').style.visibility = 'visible';
    document.getElementById('errorMsg').innerHTML = 'You must enter a valid email address and password'
  }

}

// LOGIN

export const generateRandomId = (max) => Math.round(Math.random() * (max - 1) + 1);

export const checkUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    document.getElementById('cartLogin').style.display = 'none';
    document.querySelectorAll('cart-item-wrapper').forEach(item => item.style.display = 'block');
  } else {
    document.getElementById('cartTotalPrice').style.display = 'none';
    document.getElementById('cartLogin').style.display = 'block';
    document.querySelectorAll('.cart-item-wrapper').forEach((item) => {
      item.style.display = 'none';
    })
  }
}

export const loginUser = () => {

  const form = document.forms['loginForm'];
  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  if (form.checkValidity()) {
    document.getElementById('errorMsgLogin').style.visibility = 'hidden';
    document.getElementById('submitLogin').disabled = true;
    fetch('https://63407044d1fcddf69cb8c368.mockapi.io/users').then((res) => res.json()).then((usersCount) => {
      const userId = generateRandomId(usersCount.count);
      fetch(`https://63407044d1fcddf69cb8c368.mockapi.io/users/${userId}`).then((res) => res.json()).then(responseUser => {
        const user = new User(responseUser);
        localStorage.setItem('user', JSON.stringify(user));
        $('#loginUser').modal('hide')
        toggleUserControls();
        window.location.reload();
      })
    })
  } else {
    document.getElementById('errorMsgLogin').style.visibility = 'visible';
    document.getElementById('errorMsgLogin').innerHTML = 'You must enter a valid email address and password'
  }

}

// LOG OUT

export const logoutUser = () => {
  localStorage.removeItem('user');
  toggleUserControls();
  checkCart();
  window.location.reload();
}

// NAVIGATE TO SHOP

export const goToShop = () => {
  window.location.href = window.location.origin + "/shop/shop.html"
}

// ADD TO CART

export const cartCount = () => {
  const cartItemsNumber = document.getElementsByClassName('cart-item-wrapper').length;
  document.getElementById('cartItems').innerHTML = cartItemsNumber;
}

let totalPrice = 0;

const changeTotalPrice = (price) => {
  totalPrice = totalPrice + price;
  document.getElementById('totalPrice').innerHTML = totalPrice + 'MKD';
}


export const checkCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    const productExists = cart?.find((cartItem) => cartItem.userId.id == user.id)
    if (productExists) {
      document.getElementById('emptyCart').style.display = 'none';
      document.getElementById('cartTotalPrice').style.display = 'flex';
    } else {
      document.getElementById('emptyCart').style.display = 'block';
      document.getElementById('cartTotalPrice').style.display = 'none';
    }
  }

}

export const createCartElement = () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    cart?.forEach((cart) => {
      if (cart.userId.id == user.id) {
        createCartItem(cart);
        changeTotalPrice(cart.academy.price);
      }
    })
  }
}

export const addCartToLocalStorage = (newCartProduct) => {
  const cart = JSON.parse(localStorage.getItem('cart'))
  const productExist = cart?.find((cartItem) => cartItem.academy.id == newCartProduct.academy.id)

  if (cart) {

    cart.push(newCartProduct);
    localStorage.setItem('cart', JSON.stringify(cart))
    createCartItem(newCartProduct);
    cartCount();

  } else {

    localStorage.setItem('cart', JSON.stringify([newCartProduct]))
    createCartElement();
    cartCount();
  }
}

export const addToCart = (academy, user) => {
  const cartProduct = new CartProduct(academy, user);
  addCartToLocalStorage(cartProduct, user);
  changeTotalPrice(academy.price);
}

const createCartItem = (cartItem) => {

  const cartDropdown = document.getElementById('cartBtnItems');

  const cartItemWrapper = document.createElement('div');
  cartItemWrapper.classList.add('cart-item-wrapper');
  cartItemWrapper.id = cartItem.academy.id;

  const cartImgContainer = document.createElement('div');
  const cartItemImg = document.createElement('img');
  cartItemImg.src = cartItem.academy.image;

  const cartItemInfo = document.createElement('div');
  cartItemInfo.classList.add('cart-item-info');

  const cartItemInfoContainer = document.createElement('div');

  const cartItemName = document.createElement('p');
  cartItemName.classList.add('cart-item-name');
  cartItemName.innerHTML = cartItem.academy.name;

  const cartItemPrice = document.createElement('p');
  cartItemPrice.classList.add('cart-item-price');
  cartItemPrice.innerHTML = '<span>Цена:</span> ' + cartItem.academy.price;

  const removeCartItemBtn = document.createElement('button');
  removeCartItemBtn.classList.add('remove-cart-item');
  removeCartItemBtn.innerHTML = 'избриши'
  removeCartItemBtn.addEventListener('click', (e) => {

    const cart = JSON.parse(localStorage.getItem('cart'));
    const productExist = cart?.find((cartItem) => cartItem.academy.id == e.target.parentNode.parentNode.id);
    const btnEl = document.getElementById('addToCartBtn' + cartItem.academy.id);

    if (productExist) {

      if (window.location.pathname.split("/").pop() == 'shop.html') {
        btnEl.disabled = false;
      }
      e.target.parentNode.parentNode.remove()
      const index = cart.indexOf(productExist);
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart))
      const itemPrice = -(cartItem.academy.price);
      changeTotalPrice(itemPrice)
      checkCart();
      cartCount();
    }

  });

  cartItemWrapper.appendChild(cartImgContainer);
  cartImgContainer.appendChild(cartItemImg);

  cartItemWrapper.appendChild(cartItemInfo);
  cartItemInfo.appendChild(cartItemInfoContainer);
  cartItemInfoContainer.appendChild(cartItemName);
  cartItemInfoContainer.appendChild(cartItemPrice);
  cartItemInfo.appendChild(removeCartItemBtn);

  cartDropdown.appendChild(cartItemWrapper);

}

// CREATE SHOP CARDS

export const createAcademyCardEl = (academy, container) => {

  const cardsContainer = document.getElementById(container);

  const cardGridWrapper = document.createElement('div');
  cardGridWrapper.classList.add('col-lg-4');
  cardGridWrapper.classList.add('col-md-6');

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card-wrapper');

  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');

  const cardATag = document.createElement('a');
  cardATag.setAttribute('data-toggle', 'modal');
  cardATag.setAttribute('data-target', '#cardModal');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card--body');

  const cardHeader = document.createElement('h3');
  cardHeader.classList.add('card--header');
  cardHeader.innerHTML = academy.name.toUpperCase();

  const locationIcon = document.createElement('img');
  locationIcon.src = "/Icons_Vectors/Event Cards/Location.svg";
  locationIcon.alt = "location";

  const cardLocation = document.createElement('p');
  cardLocation.classList.add('card--text');
  cardLocation.innerHTML = academy.place;

  const textBreak = document.createElement('br');
  const textBreak1 = document.createElement('br');
  const textBreak2 = document.createElement('br');

  const timeIcon = document.createElement('img');
  timeIcon.src = "/Icons_Vectors/Event Cards/Time.svg";
  timeIcon.alt = "time";

  const cardDate = document.createElement('p');
  cardDate.classList.add('card--text');


  const eventDate = new Date(academy.date);

  const dayOfMonth = eventDate.getDate();
  const month = eventDate.getMonth();
  const year = eventDate.getFullYear();

  const dateString = dayOfMonth + "-" + (month + 1) + "-" + year;

  cardDate.innerHTML = dateString;


  const topicIcon = document.createElement('img');
  topicIcon.src = "/Icons_Vectors/Event Cards/Topic.svg";
  topicIcon.alt = "topic";

  const cardTopic = document.createElement('p');
  cardTopic.classList.add('card--text');
  cardTopic.innerHTML = academy.name;

  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card--footer');

  const cardSpeakers = document.createElement('span');
  cardSpeakers.classList.add('card--text');
  cardSpeakers.innerHTML = 'Спикери:';

  const academySpeakers = document.createElement('p');
  academySpeakers.innerHTML = `${academy.speakers[0]}, ${academy.speakers[1]}, ${academy.speakers[2]}`;

  const cardBtnWrapper = document.createElement('div');
  cardBtnWrapper.classList.add('card-btn-wrapper');

  const buyNowBtn = document.createElement('button');
  buyNowBtn.classList.add('btn');
  buyNowBtn.classList.add('buy-ticket');
  buyNowBtn.classList.add('btn-main');
  buyNowBtn.classList.add('float-right');
  buyNowBtn.innerHTML = 'Купи карта'
  buyNowBtn.addEventListener('click', () => goToShop())

  const reserveBtn = document.createElement('button');
  reserveBtn.classList.add('btn');
  reserveBtn.classList.add('btn-main');
  reserveBtn.classList.add('float-right');
  reserveBtn.innerHTML = 'Резервирај место';
  reserveBtn.setAttribute('data-toggle', 'modal');
  reserveBtn.setAttribute('data-target', '#registerModal');

  cardsContainer.appendChild(cardGridWrapper);

  cardGridWrapper.appendChild(cardWrapper);
  cardWrapper.appendChild(eventCard);

  eventCard.appendChild(cardATag);

  cardATag.appendChild(cardBody);
  cardBody.appendChild(cardHeader);
  cardBody.appendChild(locationIcon);
  cardBody.appendChild(cardLocation);
  cardBody.appendChild(textBreak);
  cardBody.appendChild(timeIcon);
  cardBody.appendChild(cardDate);
  cardBody.appendChild(textBreak1);
  cardBody.appendChild(topicIcon);
  cardBody.appendChild(cardTopic);

  eventCard.appendChild(cardFooter);

  cardFooter.appendChild(cardSpeakers);
  cardFooter.appendChild(academySpeakers);

  if (window.location.pathname.split("/").pop() == 'index.html') {
    cardFooter.appendChild(cardBtnWrapper);
    cardBtnWrapper.appendChild(buyNowBtn);
    cardBtnWrapper.appendChild(reserveBtn);
  }

  if (window.location.pathname.split("/").pop() == 'shop.html') {

    const academyImg = document.createElement('img');
    academyImg.src = academy.image;
    academyImg.classList.add('academy-img');

    const priceTag = document.createElement('span');
    priceTag.classList.add('price-tag');
    priceTag.innerHTML = '<i class="fa-solid fa-tag price-icon"></i>Цена: ';

    const priceMkd = document.createElement('span');
    priceMkd.classList.add('price-mkd');
    priceMkd.innerHTML = academy.price + 'MKD';

    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('btn');
    addToCartBtn.classList.add('add-to-card');
    addToCartBtn.classList.add('btn-main');
    addToCartBtn.id = 'addToCartBtn' + academy.id;
    addToCartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping cart-icon"></i> Додади во кошничка';

    const cart = JSON.parse(localStorage.getItem('cart'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const academyExist = cart?.find((item) => item.academy.id == academy.id && item.userId.id == user.id);

      if (academyExist) {
        addToCartBtn.disabled = true;
      } else {
        addToCartBtn.disabled = false;
      }
    }

    addToCartBtn.addEventListener('click', (e) => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        e.target.disabled = true;
        addToCart(academy, user);
        checkCart();
      } else {
        $('#loginUser').modal('show')
      }

    })

    cardBody.appendChild(textBreak2);
    cardFooter.appendChild(priceTag);
    cardFooter.appendChild(priceMkd);
    cardFooter.appendChild(cardBtnWrapper);

    cardBtnWrapper.appendChild(addToCartBtn);

    cardBody.insertBefore(academyImg, cardHeader);
  }

}
