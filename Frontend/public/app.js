const init = async () => {

    const pizzas = await getPizzas()

    const pizzaContainer = document.querySelector('#pizzaContainer')
    pizzaContainer.innerHTML += pizzas.map(pizzaComponent).join('')
    
    const user = document.querySelector('#user')
    user.innerHTML += `
        <input type="text" placeholder="Név" id="name" class="customer" required>
        <input type="text" placeholder="Irányítószám" id="zipcode" class="customer" required>
        <input type="text" placeholder="Város" id="city" class="customer" required>
        <input type="text" placeholder="Utca" id="street" class="customer" required>
        <input type="text" placeholder="Házszám" id="houseNum" class="customer" required>
        <input type="tel" placeholder="Telefonszám" id="phoneNum" class="customer" required>
        <input type="email" placeholder="Email" id="email" class="customer" required>
    `
    const orderBtn = document.querySelector('#orderBtn')
    orderBtn.addEventListener('click', sendOrder)

    const addButton = document.querySelectorAll('.addBtn')
    for (let i = 0; i < addButton.length; i++) {
        addButton[i].addEventListener('click', function(event) {
            const placeOfAmountOfPizza = event.target.previousElementSibling.innerText
            const amountOfPizza = parseInt(placeOfAmountOfPizza)+1
            event.target.previousElementSibling.innerText = amountOfPizza
            renderCart(pizzas)
        })
    }

    const removeButton = document.querySelectorAll('.removeBtn')
    for (let i = 0; i < removeButton.length; i++) {
        removeButton[i].addEventListener('click', function(event) {
           const placeOfAmountOfPizza = event.target.nextElementSibling.innerText
           const amountOfPizza = parseInt(placeOfAmountOfPizza) === 0 ? 0 : parseInt(placeOfAmountOfPizza)-1
           event.target.nextElementSibling.innerText = amountOfPizza
           renderCart(pizzas)
        })
    }
    
    const pizzaSmallImgs = document.querySelectorAll('.pizzaSmallImgs')
    for (let i = 0; i < pizzaSmallImgs.length; i++) {
        pizzaSmallImgs[i].addEventListener('click', (event) => {
            const picModal = document.querySelector(".picModal")
            picModal.style.display = "flex"
            const pizzaBigImg = document.querySelector("#pizzaBigImg")
            pizzaBigImg.src = event.target.src

            // Get the <span> element that closes the modal
            const pizzaClose = document.getElementById("pizzaClose")
            // When the user clicks on <span> (x), close the modal
            pizzaClose.onclick = function() {
            picModal.style.display = "none"
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == picModal) {
                picModal.style.display = "none"
            }
        }
        })
        
    }

}

const renderCart = (pizzas) => {
    let contentOfCart = ""
    let totalPrice = 0
    for (const pizza of pizzas) {
        if (document.getElementById(pizza.id).innerText !== "0") {
            let priceSum = pizza.price * parseInt(document.getElementById(pizza.id).innerText)
            totalPrice += priceSum
            contentOfCart += `• ${document.getElementById(pizza.id).innerText} db ${pizza.name} &nbsp&nbsp&nbsp&nbsp ${priceSum.toLocaleString("hu-HU")} Ft <br>`
        }
    }
    contentOfCart += `<b>Összesen: ${totalPrice.toLocaleString()} Ft</b>`

    document.getElementById("cart").innerHTML = `
    <h2>Kosár</h2>
    ${contentOfCart === `<b>Összesen: ${totalPrice.toLocaleString()} Ft</b>` ? "<p>Még nem tettél semmit a kosárba!</p>" : contentOfCart}
    `
} 

const getPizzas = async () => {
    const response = await fetch('http://localhost:3000/pizzas')
    const pizzaArray = await response.json()
    return pizzaArray
}

const pizzaComponent = (pizza) => {
    return `
    <div class="pizzaCard">
        <div class="pizzaImageName">
            <img src="/public/img/${pizza.name.split(' ')[0]}.jpg" class="pizzaSmallImgs">
            <div class="pizzaNameIngredients">
                <h3>${pizza.name}</h3>
                <p>${pizza.ingredients}</p>
                <b>${pizza.price.toLocaleString("hu-HU")} Ft</b>
            </div>
        </div>
        <div class="addContainer">
            <button class="removeBtn"><span class="material-icons">remove</span></button>
            <div class="pizzaAmount" id="${pizza.id}">0</div/>
            <button class="addBtn"><span class="material-icons">add</span></button>
        </div>
    </div>
        `
    }
    // <button type="button" class="addButton">Hozzáad</button>

const sendOrder = async () => {
    const customerDataList = []
    const customerData = document.querySelectorAll('.customer')

    let filled = true
    for (const item of customerData) {
        if (item.value === "") {filled = false}
    }
    
    if (filled) {    

        for (const data of customerData) {
            customerDataList.push({[data.id]: data.value})
        }
        const orderData = document.getElementById("cart").innerText
        const timeOfOrder = new Date()
        const totalOrder = [{"pizzaProduct": orderData}, {"customerData": customerDataList}, {"timeOfOrder": timeOfOrder}]
        let fetchData = {
            method: 'POST',
            body:  JSON.stringify(totalOrder),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch("http://localhost:3000/order", fetchData);

        for (const item of customerData) {
            item.value=""
        }

        for (const amountDiv of document.getElementsByClassName("pizzaAmount")) {
            amountDiv.innerText = "0"
        }
        document.getElementById("cart").innerHTML = `<h2>Kosár</h2><p>Még nem adtál hozzá semmit a kosaradhoz!</p>`

        // Get the modal
        const modal = document.getElementById("myModal")

        // Get the button that opens the modal
        const btn = document.getElementById("orderBtn")

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0]

        modal.style.display = "flex"

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none"
        }


        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none"
            }
        }

    } else alert("Az összes mező kitöltése kötelező!")

}


init()

