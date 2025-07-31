
    const subcategoryMap = {
      Housing: ['Rent', 'Home Loan EMI', 'Maintenance Charges', 'Property Tax', 'Other'],
      Utilities: ['Electricity Bill', 'Water Bill', 'Internet/WiFi', 'Gas', 'Mobile Recharge', 'Other'],
      Food: ['Groceries', 'Vegetables & Fruits', 'Dining Out', 'Snacks / Tea / Coffee', 'Other'],
      Transport: ['Fuel', 'Auto/Taxi', 'Bus/Train', 'Cab', 'Vehicle Maintenance', 'Other'],
      Entertainment: ['Subscriptions', 'Movies / Events', 'Trips', 'Games', 'Other'],
      Health: ['Doctor', 'Medicines', 'Health Insurance', 'Lab Tests', 'Emergency', 'Other'],
      Education: ['Tuition Fees', 'Exam Fees', 'Books', 'Online Courses', 'Coaching', 'Other'],
      EMI: ['Credit Card EMI', 'Personal Loan EMI', 'Car Loan EMI', 'Bike Loan EMI', 'Other'],
      Other: ['Other']
    };

    function updateSubcategories(mainSelect) {
      const subSelect = mainSelect.parentElement.querySelector('.sub-category');
      const selectedMain = mainSelect.value;
      subSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';
      if (subcategoryMap[selectedMain]) {
        subcategoryMap[selectedMain].forEach(sub => {
          const opt = document.createElement('option');
          opt.textContent = sub;
          opt.value = sub;
          subSelect.appendChild(opt);
        });
      }
    }

    function addExpense() {
      const expenseList = document.getElementById('expense-list');
      const newExpense = expenseList.firstElementChild.cloneNode(true);
      newExpense.querySelector('.main-category').value = '';
      updateSubcategories(newExpense.querySelector('.main-category'));
      newExpense.querySelector('.sub-category').innerHTML = '<option value="">-- Select Subcategory --</option>';
      newExpense.querySelector('input[type="number"]').value = '';
      expenseList.appendChild(newExpense);
    }

    function removeExpense(button) {
      const list = document.getElementById('expense-list');
      if (list.children.length > 1) {
        button.parentElement.remove();
      }
    }

    function getExpenses() {
      const groups = document.querySelectorAll('.expense-group');
      const entries = [];
      groups.forEach(group => {
        const category = group.querySelector('.sub-category').value;
        const amount = parseFloat(group.querySelector('input[type="number"]').value);
        if (category && !isNaN(amount)) {
          entries.push({ category, amount });
        }
      });
      return entries;
    }

    function submitData() {
      const incomeInput = document.getElementById('income');
      const savingsInput = document.getElementById('savings');
      if (!incomeInput.value || !savingsInput.value) {
        alert("⚠️ Please fill out Monthly Income and Savings Goal before submitting.");
        return;
      }

      const income = parseFloat(incomeInput.value);
      const savings = parseFloat(savingsInput.value);
      const expenses = getExpenses();
      const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
      const balance = income - totalExpense;

      alert(
        `Income: ₹${income}\nTotal Expenses: ₹${totalExpense}\nBalance: ₹${balance}\nSavings Goal: ₹${savings}\n` +
        (balance >= savings ? '🎉 On track!' : '⚠️ Try reducing expenses.')
      );
    }

    function getCurrentMonthKey() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    function loadFixedBudget() {
      const key = getCurrentMonthKey();
      const fixedData = JSON.parse(localStorage.getItem('fixedBudget')) || {};
      if (fixedData[key]) {
        document.getElementById('income').value = fixedData[key].income;
        document.getElementById('savings').value = fixedData[key].savings;
        document.getElementById('income').disabled = true;
        document.getElementById('savings').disabled = true;
      }
    }

    function saveFixedBudgetIfNeeded() {
      const key = getCurrentMonthKey();
      let fixedData = JSON.parse(localStorage.getItem('fixedBudget')) || {};
      if (!fixedData[key]) {
        const income = parseFloat(document.getElementById('income').value);
        const savings = parseFloat(document.getElementById('savings').value);
        if (isNaN(income) || isNaN(savings)) {
          alert("⚠️ Please enter valid income and savings values.");
          return false;
        }
        fixedData[key] = { income, savings };
        localStorage.setItem('fixedBudget', JSON.stringify(fixedData));
        document.getElementById('income').disabled = true;
        document.getElementById('savings').disabled = true;
        alert("✅ Monthly Income & Savings Goal saved and locked for this month.");
        return true;
      }
      return true;
    }

    function saveToStorage() {
      if (!saveFixedBudgetIfNeeded()) return;

      const key = getCurrentMonthKey();
      const fixedData = JSON.parse(localStorage.getItem('fixedBudget'));
      const income = fixedData[key].income;
      const savings = fixedData[key].savings;

      const expenses = getExpenses();
      const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
      const balance = income - totalExpense;
      const today = new Date().toISOString().split('T')[0];

      const session = { income, savings, expenses, totalExpense, balance, date: today };
      let records = JSON.parse(localStorage.getItem('budgetRecords')) || [];
      records.push(session);
      localStorage.setItem('budgetRecords', JSON.stringify(records));

      alert("📦 Budget entry saved for today!");
      displaySavedRecords();
    }

    function displaySavedRecords() {
      const tbody = document.getElementById('records-body');
      tbody.innerHTML = '';
      const records = JSON.parse(localStorage.getItem('budgetRecords')) || [];
      if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1rem;">No records found</td></tr>`;
        return;
      }
      records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${record.date}</td>
          <td style="border: 1px solid #d1d5db; padding: 0.5rem;">₹${record.income}</td>
          <td style="border: 1px solid #d1d5db; padding: 0.5rem;">₹${record.savings}</td>
          <td style="border: 1px solid #d1d5db; padding: 0.5rem;">₹${record.totalExpense}</td>
          <td style="border: 1px solid #d1d5db; padding: 0.5rem;">₹${record.balance}</td>`;
        tbody.appendChild(row);
      });
    }

    function saveReminder() {
      const date = document.getElementById('reminder-date').value;
      const purpose = document.getElementById('reminder-purpose').value.trim();
      if (!date || !purpose) {
        alert("⚠️ Please fill in both the date and purpose.");
        return;
      }
      const reminder = { date, purpose };
      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      if (reminders.some(r => r.date === date)) {
        alert("🔔 A reminder already exists for this date.");
        return;
      }
      reminders.push(reminder);
      localStorage.setItem('reminders', JSON.stringify(reminders));
      alert(`✅ Reminder set for ${date} — ${purpose}`);
      document.getElementById('reminder-date').value = '';
      document.getElementById('reminder-purpose').value = '';
    }

    function resetFixedBudget() {
      if (!confirm("⚠️ Are you sure you want to reset the fixed monthly income and savings for this month?")) return;
      const key = getCurrentMonthKey();
      let fixedData = JSON.parse(localStorage.getItem('fixedBudget')) || {};
      if (fixedData[key]) {
        delete fixedData[key];
        localStorage.setItem('fixedBudget', JSON.stringify(fixedData));
        document.getElementById('income').disabled = false;
        document.getElementById('savings').disabled = false;
        document.getElementById('income').value = '';
        document.getElementById('savings').value = '';
        alert("🔁 Monthly income and savings reset. You can now re-enter and save again.");
      } else {
        alert("ℹ️ No fixed budget set yet for this month.");
      }
    }

    // Initialize
    loadFixedBudget();
    displaySavedRecords();
