import { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
import { v4 } from "uuid";
import Title from "./components/Title";

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  useEffect(() => {
    // Salvar as tarefas no local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      // CHAMAR A API
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_limit=10`,
        {
          method: "GET",
        }
      );

      // PEGAR OS DADOS QUE ELA RETORNA
      const data = await response.json();

      // PERSISTIR OS DADOS QUE ELA RETORNA
      setTasks(data);
    };
    fetchTasks();
  }, []);

  function onTaskClick(taskId) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }

      // Nao preciso atualizar essa tarefa
      return task;
    });
    setTasks(newTasks);
  }

  function onDeleteTaskClick(taskId) {
    // funcao para remover tarefa
    const removeTask = tasks.filter((task) => task.id !== taskId);
    setTasks(removeTask);
  }

  function onAddTaskSubmit(title, description) {
    const newTasks = {
      id: v4(),
      title,
      description,
      isCompleted: false,
    };
    // Adicionando a nova tarefa ao array de tarefas e atualizando o estado
    setTasks([...tasks, newTasks]);
  }

  return (
    <div className="w-full h-full bg-slate-500 flex justify-center p-6">
      <div className=" w-[500px] space-y-4">
        <Title>Gerenciador de Tarefas</Title>
        <AddTask onAddTaskSubmit={onAddTaskSubmit} />
        <Tasks
          tasks={tasks}
          onTaskClick={onTaskClick}
          onDeleteTaskClick={onDeleteTaskClick}
        />
      </div>
    </div>
  );
}

export default App;
