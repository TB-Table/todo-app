//引入Express模块
const express =require('express');
const cors = require('cors');

//创建Express应用实例
const app= express();
//定义端口号，可以是任意未被占用的端口
const port = 8989;

app.use(express.json()); 
app.use(cors()); 

//定义根路由
let todosList = [];

app.get('/todos', (req, res) => {
  res.json(todosList);
});

app.post('/todos',(req,res)=>{
  const newTodo = {
    id: Date.now(), // 用時間戳記生成不重複的 ID
    text: req.body.text,
    iscompleted: req.body.iscompleted || false
  };
   todosList.push(newTodo);
   console.log("已完成")

    res.json(newTodo); 
})



app.delete('/todos/:id',(req,res)=>{
    
    const todoId = Number(req.params.id);
    todosList = todosList.filter(item => item.id !== todoId)
    res.json("已删除")
})


//启动服务器
app.listen(port, ()=> {
console.log(`Server running at http://localhost:${port}`);
})
