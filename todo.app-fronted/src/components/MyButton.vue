<script setup>

import {defineProps, defineEmits} from 'vue'

const prop = defineProps (['text'])
const emit = defineEmits (['kk'])

function send(){
  emit('kk','hello')
}

</script>

<template>
  <div @click="send" class ="button"> {{ prop.text }}</div>

</template>

<style scoped>
  .button {
    width: 100px;
    height: 50px;
    background-color: #409eff;
    color: white;
    text-align: center;
    line-height: 50px;
    border-radius: 5px;
    cursor: pointer;
    margin: 300px auto;
    user-select:none ;
  }
</style>
