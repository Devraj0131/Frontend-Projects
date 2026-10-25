let expenses = [];
const savedExpenses = localStorage.getItem("expenses");
let expenseId;
let editingExpenseId = null;

if (savedExpenses) {
  try {
    const parsedExpenses = JSON.parse(savedExpenses);

    if (Array.isArray(parsedExpenses)) {
      expenses = parsedExpenses;
    }
  } catch {
    expenses = [];
  }
}

if (expenses.length === 0) {
  expenseId = 0;
} else {
  const ids = expenses.map((items) => items.id);
  expenseId = Math.max(...ids);
}

expenses.forEach((expense) => {
  renderExpenses(expense);
});

calculateExpense();
updateCategoryTotal();

const expenseForm = document.querySelector(".input-Section");
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const expenseNameInput = document.getElementById("expenseName");
  const expenseCategoryInput = document.getElementById("expenseCategory");
  const amountInput = document.getElementById("amount");
  const dateInput = document.getElementById("date");
  const errorDisplay = document.getElementById("errorDisplay");

  const expenseName = expenseNameInput.value.trim();
  const expenseCategory = expenseCategoryInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (
    expenseName === "" &&
    expenseCategory === "" &&
    amount <= 0 &&
    date === ""
  ) {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Please fill in all fields.";
    return;
  } else if (expenseName === "") {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Enter an expense name.";
    return;
  } else if (expenseCategory === "") {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Please select a category";
    return;
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Enter a valid amount.";
    return;
  } else if (date === "") {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Select a date.";
    return;
  }
  errorDisplay.style.display = "none";

  if (editingExpenseId !== null) {
    const expense = expenses.find((item) => {
      return item.id === editingExpenseId;
    });

    expense.name = expenseName;
    expense.category = expenseCategory;
    expense.amount = amount;
    expense.date = date;

    const expenseDiv = document.querySelector(
      `[data-expense-id= "${editingExpenseId}"]`,
    );

    expenseDiv.remove();
    renderExpenses(expense);

    calculateExpense();
    saveExpenses();
    updateCategoryTotal();

    editingExpenseId = null;
  } else {
    expenseId++;
    const expense = addExpense(
      expenseId,
      expenseName,
      expenseCategory,
      amount,
      date,
    );
    calculateExpense();
    saveExpenses();
    renderExpenses(expense);
    updateCategoryTotal();
  }
  document.getElementById("add").textContent = "Add";
  document.getElementById("cancelEdit").hidden = true;
  expenseForm.reset();

  console.log(expenses);
});

document.getElementById("cancelEdit").addEventListener("click", (event) => {
  editingExpenseId = null;
  document.getElementById("add").textContent = "Add";
  document.getElementById("cancelEdit").hidden = true;
  expenseForm.reset();
});

function addExpense(expenseId, expenseName, expenseCategory, amount, date) {
  const expense = {
    id: expenseId,
    name: expenseName,
    category: expenseCategory,
    amount: amount,
    date: date,
  };

  console.log(expense);
  expenses.push(expense);
  return expense;
}

function renderExpenses(expense) {
  const categoryContainer = document.querySelector(`.${expense.category}`); //Dyanamic

  const expenseNameInput = document.getElementById("expenseName");
  const expenseCategoryInput = document.getElementById("expenseCategory");
  const amountInput = document.getElementById("amount");
  const dateInput = document.getElementById("date");
  const errorDisplay = document.getElementById("errorDisplay");

  const expenseDiv = document.createElement("div");
  const dltBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  expenseDiv.classList.add("expenseDiv");

  expenseDiv.dataset.expenseId = expense.id;
  dltBtn.dataset.expenseId = expense.id;
  editBtn.dataset.expenseId = expense.id;
  const expenseName = document.createElement("p");
  const amount = document.createElement("p");
  const date = document.createElement("p");

  expenseName.textContent = `Name: ${expense.name}`;
  amount.textContent = `Amount: ${expense.amount.toFixed(2)}`;
  date.textContent = `Date: ${expense.date}`;
  dltBtn.textContent = "Delete";
  editBtn.textContent = "Edit";
  dltBtn.classList.add("dltBtn");
  editBtn.classList.add("editBtn");

  expenseDiv.append(expenseName);
  expenseDiv.append(amount);
  expenseDiv.append(date);
  expenseDiv.append(dltBtn);
  expenseDiv.append(editBtn);

  categoryContainer.append(expenseDiv);

  dltBtn.addEventListener("click", (event) => {
    expenses = expenses.filter(
      (item) => item.id !== Number(dltBtn.dataset.expenseId),
    );

    if (editingExpenseId === Number(dltBtn.dataset.expenseId)) {
      editingExpenseId = null;
      expenseForm.reset();
      document.getElementById("add").textContent = "Add";
      document.getElementById("cancelEdit").hidden = true;
    }
    calculateExpense();
    saveExpenses();
    expenseDiv.remove();
    updateCategoryTotal();
  });

  editBtn.addEventListener("click", (event) => {
    const expenseToEdit = expenses.find((item) => {
      return item.id === Number(editBtn.dataset.expenseId);
    });
    editingExpenseId = expenseToEdit.id;
    document.getElementById("add").textContent = "Update";
    document.getElementById("cancelEdit").hidden = false;

    expenseNameInput.value = expenseToEdit.name;
    expenseCategoryInput.value = expenseToEdit.category;
    amountInput.value = expenseToEdit.amount;
    dateInput.value = expenseToEdit.date;
    console.log(expenseToEdit);
  });
}

function calculateExpense() {
  const totalAmount = document.getElementById("totalAmount");
  const total = expenses.reduce((total, item) => {
    return total + item.amount;
  }, 0);

  totalAmount.textContent = `Total Amount: ${total.toFixed(2)}`;
}

function calculateCategoryTotal() {
  const categoryTotal = expenses.reduce(
    (result, item) => {
      result[item.category] += item.amount;
      return result;
    },
    {
      food: 0,
      transport: 0,
      essential: 0,
      bills: 0,
      entertainment: 0,
      other: 0,
    },
  );
  return categoryTotal;
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateCategoryTotal() {
  const categoryTotal = calculateCategoryTotal();

  document.querySelector("#foodTotal").textContent =
    `Total: ${categoryTotal.food.toFixed(2)}`;

  document.querySelector("#transportTotal").textContent =
    `Total: ${categoryTotal.transport.toFixed(2)}`;

  document.querySelector("#essentialTotal").textContent =
    `Total: ${categoryTotal.essential.toFixed(2)}`;

  document.querySelector("#billsTotal").textContent =
    `Total: ${categoryTotal.bills.toFixed(2)}`;

  document.querySelector("#entertainmentTotal").textContent =
    `Total: ${categoryTotal.entertainment.toFixed(2)}`;

  document.querySelector("#otherTotal").textContent =
    `Total: ${categoryTotal.other.toFixed(2)}`;
}
