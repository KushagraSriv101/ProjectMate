import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../apicalls/users";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge, Space } from "antd";
import Notifications from "./Notifications";

function ProtectedPage({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);
  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  return (
    user && (
      <div>
        {/* Navbar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-[#fff9f3] to-[#fef3e7] text-[#1e293b] px-8 py-4 shadow-sm border-b border-[#f1e0d6]">
          {/* Logo */}
          {/* Logo / Brand */}
          <div
            className="flex items-center space-x-2 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-widest uppercase text-[#f97316] hover:scale-105 transition-transform duration-200">
              ProjectMate
            </h1>
          </div>


          {/* Right side (user & notifications) */}
          <div className="flex items-center bg-white px-5 py-2 rounded-full shadow-sm border border-[#f3f3f3]">
            <span
              className="text-[#f97316] font-medium cursor-pointer hover:underline mr-3"
              onClick={() => navigate("/profile")}
            >
              {user?.firstName}
            </span>

            <Badge
              count={notifications.filter((notification) => !notification.read).length}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                size="large"
                className="bg-[#f97316] hover:bg-[#fb923c] transition-all"
                icon={<i className="ri-notification-line text-white text-lg"></i>}
                onClick={() => setShowNotifications(true)}
              />
            </Badge>

            <i
              className="ri-logout-box-r-line ml-6 text-[#64748b] text-xl cursor-pointer hover:text-[#f97316] transition-all"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* Page content */}
        <div className="px-8 py-5">{children}</div>

        {/* Notifications */}
        {showNotifications && (
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        )}
      </div>

    )
  );
}

export default ProtectedPage;
