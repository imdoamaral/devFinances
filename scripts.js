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

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000, // 500,00
        date: '15/08/2021',
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000, // 5.000,00
        date: '15/08/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: 20000, // 200,00
        date: '15/08/2021',
    },
]

const Transaction = {
    income() {
        // somar as entradas
    },
    expenses() {
        // somar as saidas
    },
    total() {
        // entradas - saidas
    }
}

const DOM = {
    addTransaction(transactions, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transactions)

        console.log(tr.innerHTML)
    },
    
    // funcao que vai criar o HTML
    innerHTMLTransaction(transactions) {
        const html = `
        <tr>
            <td class="description">${transactions.description}</td>
            <td class="expense">${transactions.amount}</td>
            <td class="date">${transactions.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        </tr>
        `
        return html;
    }
}

DOM.addTransaction(transactions[0])