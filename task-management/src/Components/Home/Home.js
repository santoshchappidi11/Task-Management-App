import {
  Input,
  Button,
  Table,
  TableColumn,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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

import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../ApiConfig";
import { AuthContexts } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [priorityValue, setPriorityValue] = useState();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Priority"]));

  const [selectedDate, setSelectedDate] = React.useState(
    new Set(["Date Created"])
  );

  // console.log(priorityValue, "priority");

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const { state } = useContext(AuthContexts);
  const navigateTo = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState();
  const [allTasks, setAllTasks] = useState([]);
  const [updateTaskId, setUpdateTaskId] = useState("");
  const [taskDetails, setTaskDetails] = useState({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    status: "Not Set",
    priority: "Not Set",
  });

  // console.log(selectedValue, "selected value");

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
          const response = await api.post("/add-task-title", {
            token,
            title,
            status: taskDetails.status,
            priority: taskDetails.priority,
          });
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
    if (selectedValue === "All") {
      setPriorityValue("");
    } else {
      setPriorityValue(selectedValue);
    }
  }, [selectedValue, priorityValue]);

  useEffect(() => {
    const getYourTasks = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/get-your-tasks", {
            token,
            priority: priorityValue ? priorityValue : "",
            filterByDate: selectedDate ? selectedDate : "",
          });
          if (response.data.success) {
            setAllTasks(response?.data?.tasks);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    };

    getYourTasks();
  }, [priorityValue, selectedDate]);

  const getEditTask = async (taskId) => {
    setTaskDetails({
      _id: "",
      title: "",
      description: "",
      dueDate: "",
      status: "",
      priority: "",
    });
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/get-edit-task", { token, taskId });

        if (response.data.success) {
          // console.log(response?.data?.task);
          setTaskDetails(response?.data?.task);
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
    if (taskId) {
      getEditTask(taskId);
      setUpdateTaskId(taskId);
    }
  };

  const handleUpdateTaskSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/update-task", {
          taskId: updateTaskId,
          token,
          taskDetails,
        });

        if (response.data.success) {
          setTaskDetails({
            _id: "",
            title: "",
            description: "",
            dueDate: "",
            status: "Not Set",
            priority: "Not Set",
          });
          setAllTasks(response.data.tasks);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  const deleteTask = async (taskId) => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/delete-task", { token, taskId });

        if (response.data.success) {
          setAllTasks(response.data.tasks);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <div>
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
      <div className="w-full flex justify-evenly items-center px-16 pb-5">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" color="danger" className="capitalize">
              {selectedDate}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filter Date"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedDate}
            onSelectionChange={setSelectedDate}
          >
            <DropdownItem key="New">New</DropdownItem>
            <DropdownItem key="Old">Old</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" color="danger" className="capitalize">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filter Priority"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="All">All</DropdownItem>
            <DropdownItem key="High">High</DropdownItem>
            <DropdownItem key="Low">Low</DropdownItem>
            <DropdownItem key="Medium">Medium</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Table className="w-11/12 mx-auto">
        <TableHeader>
          <TableColumn className="text-center w-5/12">TITLE</TableColumn>
          <TableColumn className="text-center">PRIORITY</TableColumn>
          <TableColumn className="text-center">STATUS</TableColumn>
          <TableColumn className="text-center w-2/12">DUE DATE</TableColumn>
          <TableColumn className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Tasks to display!"}>
          {allTasks?.length > 0 &&
            allTasks?.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task?.title}</TableCell>
                <TableCell>
                  <Button
                    color={`${
                      (task?.priority == "High" && "danger") ||
                      (task?.priority == "Medium" && "success") ||
                      (task?.priority == "Low" && "primary") ||
                      (task?.priority == "Not Set" && "secondary")
                    }`}
                    radius="sm"
                    className="text-white"
                  >
                    {task?.priority ? task?.priority : "Not Set"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color={`${
                      (task?.status == "New" && "warning") ||
                      (task?.status == "In Progress" && "primary") ||
                      (task?.status == "Completed" && "success") ||
                      (task?.status == "Not Set" && "secondary")
                    }`}
                    radius="sm"
                    className="text-white"
                  >
                    {task?.status ? task?.status : "Not Set"}
                  </Button>
                </TableCell>
                <TableCell>{task?.dueDate ? task?.dueDate : "---"}</TableCell>
                <TableCell className="flex items-center justify-evenly">
                  <div onClick={() => handleOpen(task._id)}>
                    <i className="fa-solid fa-pen-to-square fa-xl cursor-pointer"></i>
                  </div>
                  <div onClick={() => deleteTask(task._id)}>
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
              <form onSubmit={handleUpdateTaskSubmit}>
                <ModalBody>
                  <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                      size="sm"
                      type="text"
                      label="Title"
                      placeholder="Enter Title"
                      name="title"
                      onChange={handleChangeValues}
                      value={taskDetails?.title}
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
                      value={taskDetails?.description}
                    />
                  </div>
                  <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4 my-1">
                    <label className="text-stone-500">Due Date</label>
                    <Input
                      type="date"
                      className="w-4/12"
                      name="dueDate"
                      onChange={handleChangeValues}
                      value={taskDetails?.dueDate}
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <RadioGroup
                      label="Priority"
                      orientation="horizontal"
                      name="priority"
                      onChange={handleChangeValues}
                      value={taskDetails?.priority}
                    >
                      <Radio value="Low">Low</Radio>
                      <Radio value="Medium">Medium</Radio>
                      <Radio value="High">High</Radio>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <RadioGroup
                      label="Status"
                      orientation="horizontal"
                      name="status"
                      onChange={handleChangeValues}
                      value={taskDetails?.status}
                    >
                      <Radio value="New">New</Radio>
                      <Radio value="In Progress">In Progress</Radio>
                      <Radio value="Completed">Completed</Radio>
                    </RadioGroup>
                  </div>
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
              </form>
            </>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default Home;
