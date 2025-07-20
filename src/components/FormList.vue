<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { useAccountsStore } from '../stores/accounts';

const accountsStore = useAccountsStore();
const label = ref('');
const login = ref('');
const password = ref('');
const type = ref('local');


const errors = ref({
  label: '',
  login: '',
  password: '',
  type: ''
});


const isFormValid = computed(() => {
  return !errors.value.login && !errors.value.password &&
    !errors.value.type && (type.value !== 'local' || !errors.value.password);
});

//проверка метки
const validateLabel = () => {
  if (label.value.length > 50) {
    errors.value.label = 'Максимум 50 символов';
    return false;
  }

  if (label.value && !/^[a-zA-Zа-яА-Я0-9\s;]+$/.test(label.value)) {
    errors.value.label = 'Используйте только буквы, цифры и знак ; для разделения';
    return false;
  }

  errors.value.label = '';
  return true;
};

//проверка логина
const validateLogin = () => {
  if (!login.value.trim()) {
    errors.value.login = 'Обязательное поле';
    return false;
  }

  if (login.value.length > 100) {
    errors.value.login = 'Максимум 100 символов';
    return false;
  }

  errors.value.login = '';
  return true;
};



// проверка пароля
const validatePassword = () => {
  if (type.value === 'local') {
    if (!password.value.trim()) {
      errors.value.password = 'Обязательное поле для локальной записи';
      return false;
    }

    if (password.value.length > 100) {
      errors.value.password = 'Максимум 100 символов';
      return false;
    }
  } else {
    errors.value.password = '';
  }

  return true;
};


// Валидация типа записи
// const validateType = () => {
//   if (!type.value) {
//     errors.value.type = 'Выберите тип записи';
//     return false;
//   }

//   errors.value.type = '';
//   return true;
// };

// Общая валидация
const validateForm = () => {
  const validLabel = validateLabel();
  const validLogin = validateLogin();
  const validPassword = validatePassword();
  // const validType = validateType();

  return validLabel && validLogin && validPassword;
};


const addAccount = () => {
  if (!validateForm()) return;

  accountsStore.addAccount({
    label: label.value,
    login: login.value,
    password: type.value === 'local' ? password.value : null,
    type: type.value
  });

  // Очистка полей после добавления
  resetForm();
};

// Функция для удаления учетной записи
const removeAccount = (index: number) => {
  accountsStore.removeAccount(index);
};

// Очистка формы
const resetForm = () => {
  label.value = '';
  login.value = '';
  password.value = '';
  type.value = 'local';
  errors.value = {
    label: '',
    login: '',
    password: '',
    type: ''
  };
};

// Обработчик изменения типа записи
const handleTypeChange = () => {
  validatePassword();
  // Очищаем пароль при переключении на LDAP
  if (type.value === 'LDAP') {
    password.value = '';
  }
};

onMounted(() => {
  accountsStore.loadAccounts();
});

</script>

<template>

  <div>
    <h2>Учетные записи</h2>
    <button @click="addAccount" :disabled="!isFormValid">Добавить ➕ </button>
  </div>


  <div class="form-group">
    <label>Метки (необязательно)</label>
    <input v-model="label" @blur="validateLabel" placeholder="Введите метки через ;" maxlength="50" />
    <div class="error" v-if="errors.label">{{ errors.label }}</div>
    <div class="hint">Максимум 50 символов. Разделяйте метки знаком ;</div>
  </div>

  <div class="form-group">
    <label>Тип записи</label>
    <select v-model="type" @change="handleTypeChange">
      <option value="local">Локальная</option>
      <option value="LDAP">LDAP</option>
    </select>
    <!-- <div class="error" v-if="errors.type">{{ errors.type }}</div> -->
  </div>

  <div class="form-group">
    <label>Логин (обязательно)</label>
    <input v-model="login" @blur="validateLogin" placeholder="Введите логин" maxlength="100" required />
    <div class="error" v-if="errors.login">{{ errors.login }}</div>
    <div class="hint">Максимум 100 символов</div>
  </div>

  <div class="form-group" v-if="type === 'local'">
    <label>Пароль (обязательно)</label>
    <input v-model="password" @blur="validatePassword" placeholder="Введите пароль" maxlength="100" type="password"
      required />
    <div class="error" v-if="errors.password">{{ errors.password }}</div>
    <div class="hint">Максимум 100 символов</div>
  </div>



  <div class="accounts-list">
    <h3>Список учетных записей: ({{ accountsStore.accounts.length }})</h3>
    <ul>
      <li v-for="(account, index) in accountsStore.accounts" :key="index">
        <p><strong>Метка:</strong> {{ account.label || 'Не указано' }}</p>
        <p><strong>Тип:</strong> {{ account.type === 'local' ? 'Локальная' : 'LDAP' }}</p>
        <p><strong>Логин:</strong> {{ account.login }}</p>
        <p v-if="account.type === 'local' && account.password">
          <strong>Пароль:</strong> {{ '•'.repeat(account.password.length) }}
        </p>
        <p><button @click="removeAccount(index)">❌</button></p>
      </li>
    </ul>
  </div>



</template>


<style>
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
select {
  padding: 0.5rem;
  width: 100%;
  max-width: 300px;
}

.error {
  color: red;
  margin-top: 5px;
}

.hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.2rem;
}

button {
  width: 100px;
  height: 40px;
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: medium;
  font-weight: bold;
  color: white;
  background-color: rgb(97, 189, 79);
  margin: 3px;
  text-align: center;
  cursor: pointer;
}


.accounts-list {
  display: flex;
  flex-direction: column;
}

ul {
  list-style-type: none;
  padding: 10px;
}

li {

  padding: 5px;
  border-radius: 5px;

  & button {

    background-color: #ff6b6b;
  }
}
</style>