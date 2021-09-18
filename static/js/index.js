const calculator = {
    userInput: "0",
    resultCalculation: "0",
    operator: ["+", "-", "/", "*"]
}

function getLength(statement) {
    if (!statement) {
        return;
    }

    return statement.length
}

function getLastIndex(statement) {
    if (!statement) {
        return;
    }

    const lastIndex = getLength(statement) - 1

    return lastIndex
}

function getLastValue(statement) {
    if (!statement) {
        return;
    }

    return statement[getLastIndex(statement)]
}

function updateDisplay(isCalculate = false) {
    if (!isCalculate) {
        document.getElementById("display-result").value = calculator.userInput
    } else {
        calculator.userInput = calculator.resultCalculation

        document.getElementById("display-result").value = calculator.resultCalculation
    }
}

function deleteLastInput() {
    if (!calculator.userInput) {
        return;
    }

    if (calculator.userInput.length === 1) {
        calculator.userInput = 0
        updateDisplay()

        return
    }

    calculator.userInput = String(calculator.userInput).slice(
        0, getLastIndex(String(calculator.userInput))
    )

    updateDisplay()
}

function clearCalculator() {
    calculator.userInput = "0"
    calculator.resultCalculation = "0"

    updateDisplay()
}

function validateCalculation(operation) {
    operation = String(operation)

    let lastValue = getLastValue(operation)

    let regInfinityDevide = /\/0/g
    let regFirstLastDevideMultiply = /[\/\*]/g
    let regLastAddSubtractOperator = /[\+\-]/g
    console.log(operation, calculator.operator)

    if (calculator.operator.includes(calculator.userInput) === -1 ||
        calculator.operator.includes(calculator.userInput) === 0
    ) {
        alert("cannot found operator")

        return
    }

    if (operation.search(regInfinityDevide) > -1) {
        return false
    }

    if (operation.search(regFirstLastDevideMultiply) === 0 ||
        lastValue.search(regFirstLastDevideMultiply) === 0 ||
        lastValue.search(regLastAddSubtractOperator) === 0
    ) {
        return false
    }

    return true
}

function inverse() {
    const regNumber = /\d+/g
    const regOperator = /[\/\*\+\-]/g

    const addSubtractOperator = ["+", "-"]

    if (calculator.userInput === "0" || !calculator.userInput) {
        return
    }

    const lastInputUser = getLastValue(calculator.userInput)

    if (String(lastInputUser).search(regOperator) > -1) {
        if (addSubtractOperator.includes(lastInputUser)) {
            let sliceWithoutLastInput = calculator.userInput.slice(0, getLastIndex(calculator.userInput))
            let changeOperator = lastInputUser === "+" ? "-" : "+"

            let combineSliceWithChangeOperator = sliceWithoutLastInput + changeOperator

            calculator.userInput = combineSliceWithChangeOperator
            updateDisplay()

            return
        }

        alert("cannot double operator")

        return
    }

    let lastInputValueNumber = getLastValue(calculator.userInput.split(regOperator))

    // last input value operator usually contain 1 until 2 operators, for example (7 *- 9)
    let lastInputValueOperator = getLastValue(calculator.userInput.split(regNumber).filter(result => result))
    let singleLastInputValueOperator = getLastValue(String(lastInputValueOperator))

    if (addSubtractOperator.includes(singleLastInputValueOperator)) {
        lastInputValueNumber = singleLastInputValueOperator + lastInputValueNumber
    }

    let sliceWithoutLastNumber = calculator.userInput.slice(0, getLength(calculator.userInput) - getLength(lastInputValueNumber))
    let inverseLastNumber = lastInputValueNumber * -1

    console.log(sliceWithoutLastNumber, inverseLastNumber)

    inverseLastNumber = String(inverseLastNumber)[0] === '-' ||
        String(lastInputValueOperator).length === 2 ||
        calculator.userInput.search(regOperator) === 0 ?
        inverseLastNumber :
        `+${inverseLastNumber}`

    const combineSliceWithInverse = sliceWithoutLastNumber + inverseLastNumber

    calculator.userInput = combineSliceWithInverse
    updateDisplay()
}

function userInput(value) {
    if (value === ".") {
        const regOperator = /[\/\*\+\-]/g
        const regNumber = /\d+/g

        let splitWithoutOperator = String(calculator.userInput).split(regOperator)
        let lastValueInput = getLastValue(splitWithoutOperator)

        let lastValueWithoutNumber = lastValueInput.split(regNumber).filter(result => result)

        if (getLength(lastValueWithoutNumber) > 0) {
            alert("cannot using double dot")

            return;
        }
    }
    if (!calculator.userInput || calculator.userInput === "0") {
        if (value === ".") {
            calculator.userInput += value
        } else {
            calculator.userInput = value
        }
    } else {
        let lastInputValue = getLastValue(calculator.userInput)

        if (calculator.operator.includes(value) && calculator.operator.includes(lastInputValue)) {
            alert("double operator")

            return
        }

        calculator.userInput += value
    }
}

function performCalculation() {
    if (!calculator.userInput) {
        alert("cannot find input")
        return;
    }

    const validateUserInput = validateCalculation(calculator.userInput)

    if (!validateUserInput) {
        alert("check your input")
        return;
    }

    calculator.resultCalculation = eval(calculator.userInput)

    let newHistory = {
        statement: calculator.userInput,
        result: calculator.resultCalculation
    }

    // console.log(calculator.history)

    updateDisplay(true)
    renderHistory();
}

const buttons = document.querySelectorAll("button")

for (let button of buttons) {
    button.addEventListener("click", function(event) {
        event.preventDefault()

        const target = event.target

        if (target.classList.contains("non-calculate")) {
            return
        }

        if (target.classList.contains("delete")) {
            deleteLastInput()

            return;
        }

        if (target.classList.contains("inverse")) {
            inverse()

            return;
        }

        if (target.classList.contains("clear")) {
            clearCalculator()

            return;
        }

        if (target.classList.contains("equals")) {
            performCalculation()

            return;
        }

        userInput(event.target.value || 0)

        updateDisplay()
    })
}

function changeTheme() {
    let theme = document.getElementById('theme')
    let changeThemeEl = document.getElementById("change-theme")

    if (theme.getAttribute("href") === "./static/css/light-mode.css") {
        theme.href = "./static/css/dark-mode.css"
        changeThemeEl.innerHTML = `<i class="fa fa-sun-o"></i>\n switch`
    } else {
        theme.href = "./static/css/light-mode.css"
        changeThemeEl.innerHTML = `<i class="fa fa-moon-o"></i>\n switch`
    }
}

updateDisplay()