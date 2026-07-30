<script setup>
import { ref } from 'vue'
import axios from 'axios';


const str = ref('')
const list = ref([
])
const openedId = ref(null)

/*进度条拖动功能*/
let startX = 0;
let currentitem = null

function dragstart(e,item){
  currentitem = item
  startX = e.clientX;

  document.addEventListener('pointermove', dragmove);
  document.addEventListener('pointerup', dragend);
}

let animationFrame = null;
function dragmove(e){
  if (!currentitem) return;
  const distance = e.clientX - startX;

  if (distance > 0) {
    currentitem.dragDistance = distance;
  }
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(() => {
    if (!currentitem) {
      animationFrame = null;
      return;
    }

    currentitem.dragDistance = Math.max(distance, 0);
    animationFrame = null;
  });
}

async function dragend(){
  if (!currentitem) return;
  const finishWidth = 800;
  if (currentitem.dragDistance >= finishWidth){
    currentitem.iscompleted = true;

    await togglecheckbox(currentitem);
    currentitem.dragDistance = 0;
  } else{
    currentitem.dragDistance = 0
  }
  currentitem = null;
  document.removeEventListener('pointermove', dragmove);
  document.removeEventListener('pointerup', dragend);
}




async function getlist(){
  const res = await axios({
    url:"http://localhost:8989/todos",
    method:"GET"                          
  }) 
  list.value = res.data
  console.log(res);

  list.value.sort((a,b) => {
    return Number(b.iscompleted) - Number(a.iscompleted)
  })
}
getlist()

async function add() {
  if (!str.value.trim()) return;

  const update ={
    text :str.value,
    iscompleted: false,
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

async function saveDescription(item){
  console.log(item)
  await axios({
    url:`http://localhost:8989/todos/${item.id}`,
    method:"put",
    data:{description : item.description}
  })
}


function toggle(id) {
  if(openedId.value === id){
    openedId.value = null
  } else{
    openedId.value = id
  }
}

async function togglecheckbox(item){
  await axios({
    url:`http://localhost:8989/todos/${item.id}/completed`,
    method:"patch",
    data:{
      iscompleted: item.iscompleted
    }
  })
  await getlist()
}


</script>

<template>
  <div class="todoapp">
        <div class="title">Todo App</div>

         <div class="Todo-from">
            <input v-model="str" class="Todo-input" type="text" placeholder="Add a new task">
            <div @click="add" class="Todo-Button">Add Task</div>
        </div>
        
        <div v-for="(item,index) in list" 
              :key="item.id ||index" 
              :class="[item.iscompleted ? 'completed' : 'item']"
              @pointerdown="dragstart($event, item)">

          <div class="drag-background">
            <div class="drag-progress"
              :style="{ width: item.dragDistance + 'px' }"
               :class="{dragging: currentitem === item}"
            ></div>
          </div>

            <div class="item-main-row">
              

              <div class="item-left">
                <input @change="togglecheckbox(item)" type="checkbox" v-model="item.iscompleted">
                <span class="name">{{ item.text }}</span>
              </div>

              <div class="item-right">
                <div @click="toggle(item.id)" class = "Detail">▼</div>
                <div @click="del(item.id)" class="delete">Delete</div>
              </div>
            </div>
              


            <div v-if="openedId === item.id" class="item-detail-row">
                <textarea 
                  v-model="item.description" 
                  @blur="saveDescription(item)" 
                  placeholder="请输入简介...">
                </textarea>
            </div>
        </div>
  </div>

</template>

<style scoped>
    .drag-background{
      position:absolute;
      left:0;
      bottom:0;

      width:100%;
      height:4px;

      background: #b7eff1;
  }

    .name{
      user-select: none;
    }

    .drag-progress{
      position:absolute;
      left:0;
      bottom:0;

      height:4px;
      width:0;
      background: linear-gradient(to right, #D9CA84, #36A7AD);
      transition: width 0.2s ;
    }

    .dragging{
      transition: none;
    }

    .item-detail-row textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #dfe1e5;
      border-radius: 12px;       
      resize: vertical;          /* 只允許上下拉伸高度 */
      font-family: inherit;
      font-size: 14px;
    }

    .item-detail-row {
      width: 100%;
      padding-bottom: 15px;     
      border-top: 1px dashed #dfe1e5; 
    }

    .item-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .item-main-row {
      display: flex;
      width: 100%;
      height: 50px;           
      align-items: center;       /* 垂直置中 */
      justify-content: space-between; /*左右排列*/
    }

    .item {
      display: flex;
      flex-direction: column;    /*上下排列 */
      width: 60%;
      min-height: 50px;          /* 改用最小高度 */
      border-radius: 20px;
      border: 1px solid #dfe1e5;
      padding: 10px;          
      margin: 10px auto;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 20px;
      box-sizing: border-box;
      background-color: white;
      position: relative;
      overflow: hidden;
      justify-content: space-between;
    }



    .Detail{
      cursor: pointer;
      user-select: none;
    }

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
        /*opacity: 0.5;*/
        position: relative;
        overflow: hidden;
    }

    .delete{
        color: red;
        cursor: pointer;
        user-select: none;
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
