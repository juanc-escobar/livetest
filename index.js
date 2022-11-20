let container = document.getElementById("container");

let cart = JSON.parse(localStorage.getItem("cartMemory")) || [];

let callAllProducts = async () => {
    let storeItems = []
    let  dataApi = await fetch("https://fakestoreapi.com/products")
    let dataJason = await dataApi.json()
    dataJason.map((element) => { storeItems.push(element)})
    return storeItems
}


let showProducts = async () => {
    let storeItems = await callAllProducts(); 
    container.innerHTML = storeItems.map((element) => {
      let { id, title, image, price} = element
      let search = cart.find((element) => element.id === id) || [];
    return `
    <div class="card">
    <img src="${image}" alt="${title}" class="card__img">
    <h3 class="card__title">${title}</h3>
    <p class="card__content">Price: $${price} | <span class="quantity" id="${id}">Quantity: ${search.quantity === undefined ? 0 : search.quantity} </span></p>
    <button class="btn" onclick="addProduct(${id})">Add</button>
    </div>`
}).join("")

}

showProducts();

let callProduct = async (id) => {
    let storeItems = []
    let  dataApi = await fetch(`https://fakestoreapi.com/products/${id}`)
    let dataJason = await dataApi.json()
    storeItems.push(dataJason)
    return storeItems
}

let addProduct = async (id) => {
    let storeItems = await callProduct (id);
    let selectedProduct = storeItems.find((element) => element.id === id)
    let search = cart.find((element) => element.id === selectedProduct.id)
    if (search === undefined) {
        cart.push({
            id: selectedProduct.id,
            quantity: 1,
            price: selectedProduct.price,
        });
    } else {
        search.quantity += 1;
    }
    update(selectedProduct.id);
    localStorage.setItem("cartMemory", JSON.stringify(cart))
    console.log(cart)
};

let update = (id) => {
    let search = cart.find((element) => element.id === id)
    document.getElementById(id).innerHTML = search.quantity;
    cartCount();
};

let cartCount = () => {
    let cartCounter = document.getElementById("cart-count");
    cartCounter.innerHTML = cart.map((element) => element.quantity).reduce((a, b) => a + b, 0);
}

cartCount();

let total = document.getElementById("totalPrice");

let totalPrice = async () => {
    container.innerHTML = ""
    let storeItems = await callAllProducts ();
    let cartLenght = cartCount()
    if (cartLenght !== 0) {   
      let price = cart.map ((element)=>{
        let {quantity, id} = element
        let search = storeItems.find((item) => item.id === id) || [];
        return quantity * search.price;
      }).reduce((a,b) => a + b, 0).toFixed(2);
      total.innerHTML = `
      <div class="total">
      <h2>Total Price: </h2>
      <h3>$${price}</h3>
      <button class="btn" onclick="clearCart()">Empty Cart</button>
      </div>
      `
    } 
  };
    
  let clearCart = () => {
    cart = [];
    totalPrice();
    cartCount();
    localStorage.setItem("cartMemory", JSON.stringify(cart));
  }