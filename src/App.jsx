import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePageLoggedIn from "./components/pages/HomePageLoggedIn";
import HomePageLoggedOut from "./components/pages/HomePageLoggedOut";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import AddAnnouncement from "./components/Announcement/AddAnnouncement";
import AnnouncementList from "./components/Announcement/AnnouncementList";
import AnnouncementDetails from "./components/Announcement/AnnouncementDetails";
import NotFoundPage from "./components/pages/NotFoundPage";
import AdminPanel from "./components/pages/AdminPanel";
import UserProfileView from "./components/pages/UserProfileView";
import UserChat from "./components/pages/UserChat";
import EditAnnouncement from "./components/Announcement/EditAnnouncement";
import UsersList from "./components/pages/UsersList.jsx";

// import "./App.css";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/home" element={<HomePageLoggedIn />} />
            <Route path="/" element={<HomePageLoggedOut />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-announcement" element={<AddAnnouncement />} />
            <Route path="/announcement/:id" element={<AnnouncementDetails />} />
            <Route path="/announcements" element={<AnnouncementList />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/user/:userId" element={<UserProfileView />} />
            <Route path="/profile/:userId" element={<UserProfileView />} />
            <Route path="/userView/:userId" element={<UserProfileView />} />

            <Route path="/chat/:userId" element={<UserChat />} />
            <Route
              path="/edit-announcement/:id"
              element={<EditAnnouncement />}
            />
            <Route path="/usersList" element={<UsersList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
