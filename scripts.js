const Modal = {
    open() {
        // abrir modal
        // adicinar a classe 'active' ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')                
    },
    close() {
        // fechar o modal
        // remover a classe 'active' do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    /* transactions = [
        {
            description: 'Luz',
            amount: -50000, // -500,00 (posteriormente dividir por 100)
            date: '15/08/2021',
        },
        {
            description: 'Website',
            amount: 500000, // 5.000,00
            date: '15/08/2021',
        },
        {
            description: 'Internet',
            amount: 20000, // 200,00
            date: '15/08/2021',
        },
    ], */

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        // pegar todas as transacoes e, para cada transacao
        Transaction.all.forEach(transaction => {
            // se ela for maior do que zero
            if(transaction.amount > 0) {
                // somar a uma variavel variavel acumuladora
                income += transaction.amount
            }
        })
        // retornar a variavel
        return income
    },

    expenses() {
        let expense = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
        /*
        let total = 0
        transactions.forEach(transaction => {
            total += transaction.amount
        })
        return total
        */
        return Transaction.incomes() + Transaction.expenses() // valor neg ja esta embutido
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    
    // funcao que vai criar o HTML
    innerHTMLTransaction(transaction, index) {
        const cssClass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${cssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        </tr>
        `
        return html;
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatAmount(value) {
        value = Number(value) * 100
        // value.replace(/\,\./g, "")
        return value
    },

    formatCurrency(value) {
        // extrai o sinal e armazenar em 'signal'
        const signal = Number(value) < 0 ? "-" : ""

        // Regex (Regular expressions)
        // '//' = definem uma expressao regular
        // 'g' = faz uma pesquisa global
        // '\D' = pegue tudo que nao e numero (e transforme em "")
        value = String(value).replace(/\D/g, "")

        // soluçao inteligente para exibir numeros com/sem casas decimais
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        // desestruturando o objeto
        const { description, amount, date } = Form.getValues()

        // trim() = limpeza dos espaços vazios de uma string
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos.")
            }
    },

    formatvalues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        // evita o comportamento padrao: de enviar as info pela address bar
        event.preventDefault()

        try {
            // verificar se todas as info foram preenchidas
            Form.validateFields()
    
            // formatar os dados para salvar
            const transaction = Form.formatvalues()

            // salvar
            Transaction.add(transaction)

            // apagar os dados do formulario
            Form.clearFields()

            // fechar o modal
            Modal.close()
            
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        // DOM.addTransaction(transactions[0])
        // DOM.addTransaction(transactions[1])
        // DOM.addTransaction(transactions[2])
        
        // Transaction.all.forEach(function(transaction,index) {
        //     DOM.addTransaction(transaction, index)
        // })

        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()