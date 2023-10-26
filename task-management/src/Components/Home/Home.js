import {
  Input,
  Button,
  Table,
  TableColumn,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../ApiConfig";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState();
  const [allTasks, setAllTasks] = useState([]);
  // const [getTask, setGetTask] = useState({});
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    priority: "",
  });

  const handleInputValue = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeValues = (e) => {
    setTaskDetails({ ...taskDetails, [e.target.name]: e.target.value });
  };

  const handleInputSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      if (title) {
        try {
          const response = await api.post("/add-task-title", { token, title });
          if (response.data.success) {
            setTitle("");
            setAllTasks(response.data.tasks);
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Please add the title!");
      }
    }
  };

  useEffect(() => {
    const getYourTasks = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/get-your-tasks", { token });
          if (response.data.success) {
            setAllTasks(response.data.tasks);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    };

    getYourTasks();
  }, []);

  const getEditTask = async (taskId) => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = api.post("/get-edit-task", { token, taskId });
        if (response.data.success) {
          setTaskDetails(response.data.task);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleOpen = (taskId) => {
    onOpen();
    getEditTask(taskId);
  };

  const handleUpdateTaskSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <div className="flex w-screen flex-wrap md:flex-nowrap gap-4 justify-center items-center mt-10 mb-8">
        <Input
          type="text"
          className="w-10/12 "
          placeholder="Add Todo Title"
          onChange={handleInputValue}
          value={title}
        />
        <Button
          color="success"
          radius="sm"
          className="text-white"
          type="submit"
          onClick={handleInputSubmit}
        >
          ADD TODO
        </Button>
      </div>
      <Table className="w-11/12 mx-auto">
        <TableHeader>
          <TableColumn className="text-center w-5/12">TITLE</TableColumn>
          <TableColumn className="text-center">PRIORITY</TableColumn>
          <TableColumn className="text-center">STATUS</TableColumn>
          <TableColumn className="text-center w-2/12">DUE DATE</TableColumn>
          <TableColumn className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."}>
          {allTasks?.length &&
            allTasks?.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task?.title}</TableCell>
                <TableCell>
                  <Button color="primary" radius="sm" className="text-white">
                    HIGH
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="success" radius="sm" className="text-white">
                    IN PROGRESS
                  </Button>
                </TableCell>
                <TableCell>5th Jun 2023</TableCell>
                <TableCell className="flex items-center justify-evenly">
                  <div onClick={() => handleOpen(task._id)}>
                    <i
                      className="fa-solid fa-pen-to-square fa-xl cursor-pointer"
                      onClick={() => getEditTask(task._id)}
                    ></i>
                  </div>
                  <div>
                    <i className="fa-solid fa-trash fa-xl cursor-pointer"></i>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <>
        <Modal size="3xl" isOpen={isOpen} onClose={onClose} radius="sm">
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2>Edit Your Todo</h2>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdateTaskSubmit}>
                  <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                      size="sm"
                      type="text"
                      label="Title"
                      placeholder="Enter Title"
                      name="title"
                      onChange={handleChangeValues}
                      value={taskDetails.title}
                    />
                  </div>
                  <div className="w-full mt-5">
                    <Textarea
                      variant="flat"
                      label="Description"
                      placeholder="Enter your description"
                      className="w-full md:col-span-6 mb-6 md:mb-0"
                      name="description"
                      onChange={handleChangeValues}
                      value={taskDetails.description}
                    />
                  </div>
                  <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4 my-1">
                    <label className="text-stone-500">Due Date</label>
                    <Input
                      type="date"
                      className="w-4/12"
                      name="dueDate"
                      onChange={handleChangeValues}
                      value={taskDetails.dueDate}
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <RadioGroup
                      label="Priority"
                      orientation="horizontal"
                      name="priority"
                      onChange={handleChangeValues}
                      value={taskDetails.priority}
                    >
                      <Radio value="buenos-aires">Low</Radio>
                      <Radio value="sydney">Medium</Radio>
                      <Radio value="san-francisco">High</Radio>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <RadioGroup
                      label="Status"
                      orientation="horizontal"
                      name="status"
                      onChange={handleChangeValues}
                      value={taskDetails.status}
                    >
                      <Radio value="buenos-aires">New</Radio>
                      <Radio value="sydney">In Progress</Radio>
                      <Radio value="san-francisco">Completed</Radio>
                    </RadioGroup>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  radius="sm"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  onPress={onClose}
                  type="submit"
                >
                  Update Todo
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default Home;
