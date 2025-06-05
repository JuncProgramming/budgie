const balance = document.getElementById('balance');
const form = document.querySelector('form');
const transactionNameInput = document.getElementById('transaction-name');
const transactionAmountInput = document.getElementById('transaction-amount');
const typeInput = document.querySelector('#type input[name="type"]:checked');
const typeValue = typeInput ? typeInput.value : '';
const listHeader = document.getElementById('transaction-header');
const ul = document.querySelector('ul');
const deleteAllBtn = document.getElementById('delete');

const getTransactions = () => {
  return JSON.parse(localStorage.getItem('transactions')) || [];
};

const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const addTransaction = (e) => {
  e.preventDefault();
  const name = transactionNameInput.value;
  const amount = Number(Number(transactionAmountInput.value).toFixed(2));
  const typeInput = document.querySelector('#type input[name="type"]:checked');
  const typeValue = typeInput ? typeInput.value : '';
  if (!name.trim() || !amount || !typeValue) return;
  const transaction = {
    name,
    amount,
    type: typeValue,
    id: Date.now(),
  };
  saveTransaction(transaction);
  transactionNameInput.value = '';
  transactionAmountInput.value = '';
  if (typeInput) typeInput.checked = false;
  updateUI();
};

const updateUI = () => {
  const transactions = getTransactions();
  while (ul.firstChild) ul.removeChild(ul.firstChild);

  if (transactions.length === 0) {
    balance.style.display = 'none';
    listHeader.textContent = 'No transactions yet';
    ul.style.display = 'none';
    deleteAllBtn.style.display = 'none';
  } else {
    balance.style.display = 'block';
    listHeader.textContent = 'List of transactions';
    ul.style.display = 'flex';
    deleteAllBtn.style.display = 'block';
  }

  transactions.forEach((transaction) => {
    const item = document.createElement('li');
    item.dataset.id = transaction.id;
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    transaction.type === 'income'
      ? icon.classList.add('fa-circle-up')
      : icon.classList.add('fa-circle-down');
    const div = document.createElement('div');
    div.classList.add('transaction-info');
    const name = document.createElement('span');
    name.classList.add('transaction-name-li');
    const amount = document.createElement('span');
    amount.classList.add('transaction-amount-li');

    item.appendChild(icon);
    item.appendChild(div);
    div.appendChild(name);
    div.appendChild(amount);

    name.textContent = transaction.name;
    (amount.textContent = new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(transaction.amount)),
      ul.appendChild(item);
  });
};

const deleteItem = (e) => {
  if (e.target.closest('li')) {
    const transactions = getTransactions();
    if(confirm('Are you sure you want to delete this transaction?')) {
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction.id !== Number(e.target.closest('li').dataset.id)
    );
    localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
    updateUI();
  } }else {
    return;
  }
};

const deleteAll = () => {
  if(confirm('Are you sure you want to delete all transactions?')) {
  localStorage.removeItem('transactions');
  ul.querySelectorAll('li').forEach((li) => li.remove());
  updateUI();
  }
};

form.addEventListener('submit', addTransaction);
ul.addEventListener('click', deleteItem);
deleteAllBtn.addEventListener('click', deleteAll);

const init = () => {
  updateUI();
};

init();
