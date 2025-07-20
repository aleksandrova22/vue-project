<script setup lang="ts">
import FormList from './components/FormList.vue';

</script>

<template>
  
  <main>
    <FormList />
  </main>
</template>

<style>

main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}

/* 
@media (min-width: 1024px) {
  main {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }


  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  } 
}*/
</style>
