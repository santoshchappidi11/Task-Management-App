import React, { useContext, useState } from "react";
import { Card, Input, Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import api from "../../ApiConfig";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Context/AuthContext";

const Login = () => {
  const { Login } = useContext(AuthContexts);
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChangeValues = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (userData.email && userData.password) {
      try {
        const response = await api.post("/login", { userData });
        if (response.data.success) {
          localStorage.setItem("Token", JSON.stringify(response.data.token));
          Login(response.data);
          setUserData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          navigateTo("/");
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please fill all the fields!");
    }
  };

  return (
    <div className="w-screen flex justify-center items-center">
      <Card className="w-6/12 my-12 py-10 px-10 rounded-md" shadow="sm">
        <div className="h-8 w-full mb-5">
          <h2 className="text-2xl font-semibold">LOGIN</h2>
        </div>
        <div>
          <form
            className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4"
            onSubmit={handleLoginSubmit}
          >
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
              placeholder="Enter Your Password"
              name="password"
              onChange={handleChangeValues}
              value={userData.password}
            />
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Button
                className="w-2/12 "
                color="danger"
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
            Don't Have An Account?{" "}
            <b
              className="cursor-pointer text-success-500 font-medium"
              onClick={() => navigateTo("/register")}
            >
              Register Here!
            </b>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
