import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiImage, FiSave, FiLogOut, FiTrash2 } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/profile', profileData);
            updateUser(data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
            return;
        }

        setLoading(true);

        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
            // TODO: Implement account deletion
            alert('Account deletion feature coming soon!');
        }
    };

    return (
        <div className="settings-page">
            <div className="container">
                <div className="settings-header">
                    <h1 className="gradient-text">Settings</h1>
                    <p className="text-muted">Manage your account settings and preferences</p>
                </div>

                <div className="settings-container">
                    {/* Sidebar Tabs */}
                    <div className="settings-sidebar glass">
                        <button
                            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <FiUser /> Profile
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <FiLock /> Security
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <FiTrash2 /> Account
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="settings-content glass">
                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="settings-section fade-in">
                                <h2>Profile Information</h2>
                                <p className="text-muted">Update your profile details and avatar</p>

                                <form onSubmit={handleProfileUpdate} className="settings-form">
                                    <div className="form-group">
                                        <label className="label">
                                            <FiUser /> Name
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">
                                            <FiMail /> Email
                                        </label>
                                        <input
                                            type="email"
                                            className="input"
                                            value={profileData.email}
                                            disabled
                                            title="Email cannot be changed"
                                        />
                                        <small className="text-muted">Email cannot be changed</small>
                                    </div>

                                    <div className="form-group">
                                        <label className="label">Bio</label>
                                        <textarea
                                            className="input"
                                            rows="4"
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                            maxLength="500"
                                        />
                                        <small className="text-muted">
                                            {profileData.bio?.length || 0}/500 characters
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label className="label">
                                            <FiImage /> Avatar URL
                                        </label>
                                        <input
                                            type="url"
                                            className="input"
                                            value={profileData.avatar}
                                            onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        {profileData.avatar && (
                                            <div className="avatar-preview">
                                                <img src={profileData.avatar} alt="Avatar preview" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="settings-section fade-in">
                                <h2>Change Password</h2>
                                <p className="text-muted">Update your password to keep your account secure</p>

                                <form onSubmit={handlePasswordChange} className="settings-form">
                                    <div className="form-group">
                                        <label className="label">npm,
                                            <FiLock /> Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">
                                            <FiLock /> New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength="6"
                                        />
                                        <small className="text-muted">Minimum 6 characters</small>
                                    </div>

                                    <div className="form-group">
                                        <label className="label">
                                            <FiLock /> Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        <FiLock /> {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div className="settings-section fade-in">
                                <h2>Account Management</h2>
                                <p className="text-muted">Manage your account and sessions</p>

                                <div className="account-actions">
                                    <div className="action-card">
                                        <div className="action-info">
                                            <h3>Logout</h3>
                                            <p>Sign out from your account on this device</p>
                                        </div>
                                        <button
                                            className="btn btn-outline"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>

                                    <div className="action-card danger">
                                        <div className="action-info">
                                            <h3>Delete Account</h3>
                                            <p>Permanently delete your account and all data</p>
                                        </div>
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleDeleteAccount}
                                        >
                                            <FiTrash2 /> Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
