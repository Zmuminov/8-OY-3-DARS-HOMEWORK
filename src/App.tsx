// MY FILE
import "./App.css";
// OTHER FILE
import { FaTrash } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { RiPencilFill } from "react-icons/ri";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid transparent",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
function App() {
  // FILTER
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  // HANDLE OPEN CLOSE
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (event: React.MouseEvent) => {
    event.preventDefault();
    if (newTodo !== "") {
      const newId = crypto.randomUUID();
      const newTodoItem: TodoItem = {
        id: newId,
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  return (
    <>
      <div className="w-[700px] mx-auto mt-40">
        <h2 className="flex justify-center mb-8 text-5xl font-bold text-white">
          TODO LIST
        </h2>
        <div className="flex justify-between items-center">
          <button
            onClick={handleOpen}
            className="bg-blue-700 hover:bg-blue-800 transition-all text-white cursor-pointer py-[10px] px-[20px] text[16px] rounded-lg"
          >
            Add Task
          </button>
          <div className="bg-white rounded-lg">
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Filter
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={age}
                onChange={handleChange}
                autoWidth
                label="Age"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Unchecked</MenuItem>
                <MenuItem value={21}>Checked</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="spring-modal-title" variant="h5" component="h2">
                <p className="text-black font-bold">Add Todo</p>
              </Typography>
              <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                <form className="flex justify-between items-center flex-col gap-4">
                  <input
                    className="bg-gray-400 text-black rounded-lg px-12 py-4 w-[300px] w-full"
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                  <button
                    onClick={addTodo}
                    className="bg-blue-700 hover:bg-blue-800 transition-all w-full text-white   cursor-pointer py-[10px] px-[20px] text[16px] rounded-lg"
                  >
                    Add Todo
                  </button>
                </form>
              </Typography>
            </Box>
          </Fade>
        </Modal>

        {todos.length > 0 && (
          <div className="todoCardsContainer">
            {todos.map((todo) => (
              <div key={todo.id} className="todoCard">
                <div className="todoTitlee">
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <p
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </p>
                </div>
                <div className="changeIcon">
                  <FaTrash
                    className="change text-black"
                    onClick={() => removeTodo(todo.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
