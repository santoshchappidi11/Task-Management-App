import React, { useState } from "react";

import { Card, Input, Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import api from "../../ApiConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChangeValues = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      userData.name &&
      userData.email &&
      userData.password &&
      userData.confirmPassword
    ) {
      if (userData.password == userData.confirmPassword) {
        try {
          const response = await api.post("/register", { userData });
          if (response.data.success) {
            setUserData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            navigateTo("/login");
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Password and ConfirmPassword does not match!");
      }
    } else {
      toast.error("Please fill all the fields!");
    }
  };

  return (
    <div className="w-screen flex justify-center items-center">
      <Card className="w-6/12 my-12 py-10 px-10 rounded-md" shadow="sm">
        <div className="h-8 w-full mb-5">
          <h2 className="text-2xl font-semibold">Register</h2>
        </div>
        <div>
          <form
            className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4"
            onSubmit={handleRegisterSubmit}
          >
            <Input
              radius="sm"
              type="text"
              label="Name"
              placeholder="Enter your Name"
              name="name"
              onChange={handleChangeValues}
              value={userData.name}
            />
            <Input
              radius="sm"
              type="email"
              label="Email"
              placeholder="Enter your Email"
              name="email"
              onChange={handleChangeValues}
              value={userData.email}
            />
            <Input
              radius="sm"
              type="password"
              label="Password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChangeValues}
              value={userData.password}
            />
            <Input
              radius="sm"
              type="password"
              label="Confirm Passwordd"
              placeholder="Enter Confirm Password"
              name="confirmPassword"
              onChange={handleChangeValues}
              value={userData.confirmPassword}
            />
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Button
                className="w-2/1"
                color="success"
                variant="ghost"
                radius="sm"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
        <div className="mt-5">
          <p>
            Already Have An Account?{" "}
            <b
              className="cursor-pointer text-danger-500 font-medium"
              onClick={() => navigateTo("/login")}
            >
              Login Here!
            </b>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
