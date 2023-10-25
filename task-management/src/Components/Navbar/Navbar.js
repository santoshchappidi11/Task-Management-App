import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const TaskNavbar = () => {
  const navigateTo = useNavigate();

  return (
    <Navbar shouldHideOnScroll className="h-20 w-screen border">
      <NavbarBrand onClick={() => navigateTo("/")}>
        <h2 className="font-bold text-2xl cursor-pointer">Task Management</h2>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/")}
            className="cursor-pointer"
          >
            ALL TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/completed-tasks")}
            className="cursor-pointer"
          >
            COMPLETED TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/deleted-tasks")}
            className="cursor-pointer"
          >
            DELETED TASKS
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link onClick={() => navigateTo("/login")} className="cursor-pointer">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            onClick={() => navigateTo("/register")}
            className="cursor-pointer"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TaskNavbar;
