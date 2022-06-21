//Register variables and selectors
const addCarts = document.querySelectorAll('#addCart');
const tbody = document.querySelector('.divTable tbody')
const divCart = document.querySelector('#divCart')
const contentlistCard = document.querySelector('#contentlistCard')
const btnDelete = document.querySelector('#btnDelete')
const totalCart = document.querySelector('#totalCart')
const bgOpacity = document.querySelector('#bgOpacity')
let Cart = [];

//Register events
registerEvents();
function registerEvents() {
    //Se ejecuta al presiona 'Añadir al Carrito'
    addCarts.forEach( ( cart ) => {
        cart.addEventListener('click', clickAddCart);
    });
    contentlistCard.addEventListener('click', showCart)
    divCart.addEventListener('click', deleteBurger)
    btnDelete.addEventListener('click', deleteCart)
    //Leer localStorage
    document.addEventListener('DOMContentLoaded', () => {
        Cart = JSON.parse(localStorage.getItem('cart')) || [];
        addHtml(Cart)
    })
}

//Register functions
function clickAddCart(e) {
    //SelectedBurger tiene la referencia al html(por eso abajo no se pone document sino selectedBurger)
    const selectedBurger = e.target.parentElement.parentElement
    const infoBurger = {
        image: selectedBurger.querySelector('img').src,
        name: selectedBurger.querySelector('h4').textContent,
        price: selectedBurger.querySelector('.prices').textContent,   
        id: selectedBurger.querySelector('input').getAttribute('data-id'), 
        quantity: 1,
    }
    //Verifica si ya existe una Burger en el carrito(de ser asi aumenta la cantidad)
    const burgerExists = Cart.some( burger => burger.id === infoBurger.id );
    if ( burgerExists ) {
        const burgers = Cart.map( burger => { //.map siempre requiere el return
            if ( burger.id === infoBurger.id ){
                burger.quantity++;
                return burger; //Retorna la burger duplicada para crear un nuevo arreglo
            } else{
                return burger; //Se retornan las burgers no duplicadas para crear un nuevo arreglo
            }
        })
        //Agregar objeto(burgers) al arreglo
        Cart = [ ...burgers ]
    } else {
        //Agregar objeto(infoBurger) al arreglo
        Cart = [ ...Cart, infoBurger ]
    }
    //Agregar infoBurger(objeto) al arreglo y al carrito
    addHtml(Cart)
    messageSwet('Añadiendo...')
}

function addHtml(Cart) {
    cleanHTML();
    Cart.forEach( info => {
        const { image, name, price, quantity, id } = info
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><img src ="${image}" class="imgB"></td>
            <td>${name}</td>
            <td>$ ${price}</td>
            <td>${quantity}</td>
            <td><a href="#" class="deletBurger" data-id="${id}"> X </a>
        `;
        tbody.appendChild(row)
    });
    plusCart(Cart)
    //Guardar en LocalStorage
    syncStorage()
}

function plusCart(Cart) {
    let resultPlus = Cart.reduce( (total, burger) => total + (parseInt(burger.price) * burger.quantity ), 0 );
    cleanHtmlTotal()
    totalCart.append(`$ ${resultPlus}`)
}

function cleanHtmlTotal() {
    while (totalCart.firstChild) {
        totalCart.removeChild(totalCart.firstChild);
    }
}

function syncStorage() {
    localStorage.setItem('cart', JSON.stringify(Cart))
}

function showCart() {
    const checkClass = divCart.classList.contains('block')
    if( !checkClass ) {
        addCarts.forEach( ( cart ) => {
            cart.disabled = true;
        });
        divCart.classList.add('block')
        bgOpacity.classList.add('opacity')
    } else {
        addCarts.forEach( ( cart ) => {
            cart.disabled = false;
        });
        divCart.classList.remove('block')
        bgOpacity.classList.remove('opacity')
    }
}

function deleteBurger(e) {
    e.preventDefault();
    if(e.target.classList.contains('deletBurger')) {
        const burgerId = e.target.getAttribute('data-id')
        Cart = Cart.filter( burger => burger.id !== burgerId );
        addHtml(Cart)
        messageSwet('Eliminando...')
    }
}

function deleteCart() {
    Cart = []
    addHtml(Cart)
    messageSwet('Eliminando carrito...')
    setTimeout(() => {
        addCarts.forEach( ( cart ) => {
            cart.disabled = false;
        });
        bgOpacity.classList.remove('opacity')
        divCart.classList.remove('block')
    }, 1000)
}

function cleanHTML() {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function messageSwet(title) {
    Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: 1500
      })
}