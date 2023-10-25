import React from "react";
import {
  Button,
  Table,
  TableColumn,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  CardBody,
  Card,
} from "@nextui-org/react";

const CompletedTasks = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <Card shadow="sm" radius="sm" className="w-6/12 mt-5 mb-6 ">
          <CardBody className="w-full">
            <p className="font-semibold text-lg text-center">COMPLETED TASKS</p>
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
        <TableBody>
          <TableRow key="1">
            <TableCell>Complete Styling of Todo List</TableCell>
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
              <div>
                <i class="fa-solid fa-arrow-rotate-left fa-xl"></i>
              </div>
              <div>
                <i className="fa-solid fa-trash fa-xl cursor-pointer"></i>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default CompletedTasks;
