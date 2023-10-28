import React, { useEffect, useState } from "react";

import {
  Button,
  Table,
  TableColumn,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  Card,
  CardBody,
} from "@nextui-org/react";
import api from "../../ApiConfig";
import toast from "react-hot-toast";

const DeletedTasks = () => {
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const getDeletedTasks = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/deleted-tasks", { token });
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

    getDeletedTasks();
  }, []);

  const deleteTask = async (taskId) => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/permanent-delete-task", {
          token,
          taskId,
        });

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
    <>
      <div className="flex justify-center items-center">
        <Card shadow="sm" radius="sm" className="w-6/12 mt-5 mb-6 ">
          <CardBody className="w-full">
            <p className="font-semibold text-lg text-center">DELETED TASKS</p>
          </CardBody>
        </Card>
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
          {allTasks?.length &&
            allTasks?.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task?.title}</TableCell>
                <TableCell>
                  <Button color="primary" radius="sm" className="text-white">
                    {task?.priority ? task?.priority : "Not Set"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="success" radius="sm" className="text-white">
                    {task?.status ? task?.status : "Not Set"}
                  </Button>
                </TableCell>
                <TableCell>{task?.dueDate ? task?.dueDate : "---"}</TableCell>
                <TableCell className="flex items-center justify-evenly">
                  <div>
                    <i class="fa-solid fa-arrow-rotate-left fa-xl"></i>
                  </div>
                  <div onClick={() => deleteTask(task._id)}>
                    <i className="fa-solid fa-trash fa-xl cursor-pointer"></i>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default DeletedTasks;
