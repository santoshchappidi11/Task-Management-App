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

import React from "react";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  return (
    <div className="">
      <div className="flex w-screen flex-wrap md:flex-nowrap gap-4 justify-center items-center mt-10 mb-8">
        <Input type="text" className="w-10/12 " placeholder="Add Todo Title" />
        <Button color="success" radius="sm" className="text-white">
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
              <div onClick={() => handleOpen()}>
                <i className="fa-solid fa-pen-to-square fa-xl cursor-pointer"></i>
              </div>
              <div>
                <i className="fa-solid fa-trash fa-xl cursor-pointer"></i>
              </div>
            </TableCell>
          </TableRow>
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    size="sm"
                    type="text"
                    label="Title"
                    placeholder="Enter Title"
                  />
                </div>
                <div className="w-full mt-5">
                  <Textarea
                    variant="flat"
                    label="Description"
                    placeholder="Enter your description"
                    className="w-full md:col-span-6 mb-6 md:mb-0"
                  />
                </div>
                <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4 my-1">
                  <label className="text-stone-500">Due Date</label>
                  <Input type="date" className="w-4/12" />
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <RadioGroup label="Priority" orientation="horizontal">
                    <Radio value="buenos-aires">Low</Radio>
                    <Radio value="sydney">Medium</Radio>
                    <Radio value="san-francisco">High</Radio>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <RadioGroup label="Status" orientation="horizontal">
                    <Radio value="buenos-aires">New</Radio>
                    <Radio value="sydney">In Progress</Radio>
                    <Radio value="san-francisco">Completed</Radio>
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
                <Button color="primary" radius="sm" onPress={onClose}>
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
