import React, { useEffect, useState } from "react";
import axios from "axios";

function UpdateProfile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id = localStorage.getItem("userId");

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8080/users/${id}`);
                setUser({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    password: "" // don't pre-fill password
                });
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err.response?.data || err.message);
                setError("Failed to fetch user data");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // Handle input change
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    // Update profile
    const onSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            name: user.name,
            email: user.email,
        };
        if (user.password && user.password.trim() !== "") {
            updatedUser.password = user.password;
        }

        try {
            await axios.put(`http://localhost:8080/users/${id}`, updatedUser);
            alert("Profile updated successfully!");
            setUser(prev => ({ ...prev, password: "" })); // clear password
        } catch (err) {
            console.error("Error updating profile:", err.response?.data || err.message);
            alert("Failed to update profile. Please try again.");
        }
    };

    // Delete profile
    const deleteAccount = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/users/${id}`);
            alert("Account deleted successfully!");
            localStorage.removeItem("userId");
            window.location.href = "/register";
        } catch (err) {
            console.error("Delete Error:", err.response?.data || err.message);
            alert("Failed to delete account. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ maxWidth: "500px", margin: "20px auto" }}>
            <h1>Edit Profile</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Username</label><br />
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={onInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label><br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={onInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={onInputChange}
                        placeholder="Enter new password or leave blank"
                    />
                </div>

                <button type="submit">Update Profile</button>
                <button type="button" onClick={() => deleteAccount(id)}>Delete Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfile;