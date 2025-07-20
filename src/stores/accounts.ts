import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Account {
  label: string
  login: string
  password: string | null
  type: string
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  
  // Сохранение в localStorage
  const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }
  
  // Загрузка из localStorage
  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  }
  
  // Добавление учетной записи
  const addAccount = (account: Account) => {
    accounts.value.push(account)
    saveAccounts()
  }
  
  // Удаление учетной записи
  const removeAccount = (index: number) => {
    accounts.value.splice(index, 1)
    saveAccounts()
  }
  
  return {
    accounts,
    addAccount,
    removeAccount,
    loadAccounts
  }
})

