import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Context/AuthContext";

const TaskNavbar = () => {
  const navigateTo = useNavigate();
  const { state, Logout } = useContext(AuthContexts);

  return (
    <Navbar shouldHideOnScroll className="h-20 w-screen border">
      <NavbarBrand onClick={() => navigateTo("/")}>
        <h2 className="font-bold text-2xl cursor-pointer text-purple-700">
          Task Management
        </h2>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 px-8" justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/")}
            className="cursor-pointer font-medium"
          >
            ALL TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/completed-tasks")}
            className="cursor-pointer font-medium"
          >
            COMPLETED TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            onClick={() => navigateTo("/deleted-tasks")}
            className="cursor-pointer font-medium"
          >
            DELETED TASKS
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {state?.currentUser?.name && (
          <NavbarItem className="px-5">
            Welcome, ({state?.currentUser?.name?.toUpperCase()})
          </NavbarItem>
        )}
        <NavbarItem className="hidden lg:flex">
          {!state?.currentUser?.name ? (
            <Link
              onClick={() => navigateTo("/login")}
              className="cursor-pointer"
            >
              Login
            </Link>
          ) : (
            <Link onClick={Logout} className="cursor-pointer">
              Logout
            </Link>
          )}
        </NavbarItem>
        {!state?.currentUser?.name && (
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
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default TaskNavbar;
