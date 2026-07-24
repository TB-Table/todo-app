<script setup>
import { ref } from 'vue'
import axios from 'axios';


const str = ref('')
const list = ref([

])

async function getlist(){
  const res = await axios({
    url:"http://localhost:8989/todos",
    method:"GET"                          
  }) 
  list.value = res.data
  console.log(res);
}
getlist()

async function add() {
  if (!str.value.trim()) return;

  const update ={
    text :str.value,
    iscompleted: false
  }

  const res = await axios.post("http://localhost:8989/todos",update)

  list.value.push(res.data)

  str.value = ''
}

async function del(id){
  await axios({
    url:`http://localhost:8989/todos/${id}`,
    method:"delete"
  })
  list.value = list.value.filter(item => item.id !== id)

}


</script>

<template>
  <div class="todoapp">
        <div class="title">Todo App</div>
        
        <div class="Todo-from">
            <input v-model="str" class="Todo-input" type="text" placeholder="Add a new task">
        <div @click="add" class="Todo-Button">Add Task</div>
        </div>

        <div v-for="(item,index) in list" :key="item.id ||index" :class="[item.iscompleted ? 'completed' : 'item']">
            <div>
            <input type="checkbox" v-model="item.iscompleted">
            <span class="name">{{ item.text }}</span>
            </div>

            <div @click="del(item.id)" class="delete">Delete</div>
        </div>
  </div>

</template>

<style scoped>

    .completed{
      display: flex;
        width: 60%;
        height: 50px;
        border-radius: 20px 20px 20px 20px;
        border: 1px solid #dfe1e5;
        padding: 10px;
        margin: 10px auto;
        align-items: center;
        box-shadow:rgba(149,157,165,0.2) 0px 8px 20px;
        justify-content: space-between;
        text-decoration: line-through;
        opacity: 0.5;
    }

    .delete{
        color: red;
        cursor: pointer;
    }

    .item{
        display: flex;
        width: 60%;
        height: 50px;
        border-radius: 20px 20px 20px 20px;
        border: 1px solid #dfe1e5;
        padding: 10px;
        margin: 10px auto;
        align-items: center;
        box-shadow:rgba(149,157,165,0.2) 0px 8px 20px;
        justify-content: space-between;
    }

    .Todo-Button {
        background: linear-gradient(to right, #EAE5C9, #6cc6cb);
        width: 70px;
        height: 50px;
        border-radius: 0 20px 20px 0;
        border: 1px solid #dfe1e5;
        padding: 10px;
        line-height: 50px;
        cursor: pointer;
        user-select: none;
        color: #ffff
    }
    

    .Todo-input {
        width: 60%;
        height: 50px;
        border-radius: 20px 0 0 20px;
        border: 1px solid #dfe1e5;
        padding: 10px;
        outline: none;
    }


    .todoapp {
        margin-top: 35px;
        width: 98%;
        min-height: 400px;
        background-color: white;
        border-radius: 5px; 
        margin-left: 1%;
        padding-bottom: 20px;
        box-sizing: border-box;
    }

    .todoapp .title {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        padding-top: 20px;
    }

    .Todo-from {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    :global(body) {
      background: linear-gradient(to right, #EAE5C9, #6cc6cb);
    }

</style>
