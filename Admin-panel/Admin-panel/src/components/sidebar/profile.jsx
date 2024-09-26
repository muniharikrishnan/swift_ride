import React from "react";
import "./profile.scss";

const Profile = () => {
  const user = {
    name: "Muni Hari Krishnan",
    email: "amruthavallia7@gmail.com",
    phone: "+91 7708169507",
    address: "66 Jothi swamy Street,Tiruttani,Tiruvallur district,Tamil Nadu",
    bio: "Software Engineer with a passion for building scalable applications.",
  };

  return (
    <div className="profile">
      <h2 className="profile__title">User Profile</h2>
      <div className="profile__info">
        <h3 className="profile__info-title">Personal Information</h3>
        <div className="profile__info-item">
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div className="profile__info-item">
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div className="profile__info-item">
          <strong>Phone:</strong> <span>{user.phone}</span>
        </div>
        <div className="profile__info-item">
          <strong>Address:</strong> <span>{user.address}</span>
        </div>
        <div className="profile__info-item">
          <strong>Bio:</strong> <span>{user.bio}</span>
        </div>
      </div>
      <button className="profile__edit-button">Edit Profile</button>
    </div>
  );
};

export default Profile;
