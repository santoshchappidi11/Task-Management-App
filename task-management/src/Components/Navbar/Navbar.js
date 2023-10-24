import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

const TaskNavbar = () => {
  return (
    <Navbar className="sm" justify="center">
      <NavbarBrand>
        <p className="font-bold text-inherit">Task Management</p>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-12" justify="space-between">
        <NavbarItem>
          <Link color="foreground" href="#">
            ALL TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" color="foreground">
            COMPLETED TASKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            DELETED TASKS
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TaskNavbar;
