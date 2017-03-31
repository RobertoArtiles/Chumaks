console.log("init log")

const bodyText = document.body.innerText

var deliveryPrice = null
var tax = null
try {
    weight = calculateDeliveryWeight()
    deliveryPrice = calculateDeliveryPrice(weight).toFixed(2)
    tax = calculateTaxPrice().toFixed(2)
} catch (e) {
    console.log(e)
}

console.log("weight:", weight, "price:", deliveryPrice, "tax:", tax)

// TODO: check for dimensions
var errorMessage = null
if (weight > 200) {
  errorMessage = "вес больше 200 кг"
}

const text = errorMessage != null ? `Доставка невозможна: ${errorMessage}` : `Доставка: ${deliveryPrice != null ? '$' + deliveryPrice : '?'}
Пошлина: ${tax != null ? '$' + tax : '?'}`

const info = `вес: ${weight.toFixed(2)} кг; доставка: ${weight.toFixed(2)}кг * $5.8/кг = $${deliveryPrice};`

var container = document.createElement('div')
container.className = "container"
container.id = "container"
container.onClick = ""

const logo = chrome.extension.getURL("images/np_logo.png")
container.innerHTML = `<img src="${logo}" class="logo"><span class='text'>${text}</span>`

document.body.appendChild(container)

function showInfoPopup() {
  var popup = document.getElementById("container")
  popup.classList.toggle("show")
}

function calculateDeliveryWeight() {
    const results = bodyText.match(/Shipping Weight:?\D*(\d+\.?\d*) (ounces|pounds).*(\(View shipping)?/)
    if (results == null) {
        throw "Couldn't find Shipping Weight"
    }

    const weightNumber = Number(results[1])
    const isPounds = results[2] === "pounds"
    console.log("num", weightNumber, "isPounds", isPounds)
    const weightPounds = isPounds
        ? weightNumber
        : weightNumber / 16
    const weightKg = weightPounds / 2.20462

    return weightKg
}

function calculateDeliveryPrice(weight) {
    try {
        const deliveryPrice = 5.8 * Math.max(0.5, weight)
        return deliveryPrice
    } catch (e) {
        console.log(e)
    }
    return null
}

function calculateTaxPrice() {
    var results = bodyText.match(/.*Buy New:?\D*\$(\d+\.?,?\d*).*/)
    if (results == null) {
        results = bodyText.match(/\nPrice:?\D*\$(\d+\.?,?\d*).*/)
    }
    if (results == null) {
        throw "Couldn't find the price"
    }
    console.log("result:", results[1])

    const price = Number(results[1].replace(",", ""))
    console.log("price:", price);
    const tax = Math.max(0, (price - 160) * 0.35)
    return tax
}
