import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { getDateFormat } from "../../utils/helpers";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole();
      dispatch(SetLoading(false));
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">
          👋 Hey {user?.firstName} {user?.lastName},
        </h1>
        <p className="home-subtitle">
          Welcome back to <span className="highlight">ProjectMate</span> — your all-in-one project tracker.
        </p>
      </div>

      <div className="home-project-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="home-project-card"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h1 className="home-project-name">{project.name}</h1>
              <Divider className="home-project-divider" />
              <div className="home-project-info">
                <span>📅 {getDateFormat(project.createdAt)}</span>
                <span>👤 {project.owner.firstName}</span>
                <span
                  className={`status-tag ${
                    project.status === "active"
                      ? "active"
                      : project.status === "completed"
                      ? "completed"
                      : "pending"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="home-no-projects">
            <h2>No projects found 🗂️</h2>
            <p>Start by creating your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
