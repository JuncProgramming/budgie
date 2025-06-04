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
    listHeader.textContent = 'No transactions yet';
    ul.style.display = 'none';
    deleteAllBtn.style.display = 'none';
  } else {
    listHeader.textContent = 'List of transactions';
    ul.style.display = 'flex';
    deleteAllBtn.style.display = 'block';
  }

  transactions.forEach((transaction) => {
    const item = document.createElement('li');
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    transaction.type === 'income' ? icon.classList.add('fa-circle-up') : icon.classList.add('fa-circle-down')
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
    amount.textContent = transaction.amount;

    ul.appendChild(item);
  });
};

const deleteAll = () => {
  localStorage.removeItem('transactions');
  ul.querySelectorAll('li').forEach((li) => li.remove());
  updateUI();
};

form.addEventListener('submit', addTransaction);
deleteAllBtn.addEventListener('click', deleteAll);

const init = () => {
  updateUI();
};

init();
