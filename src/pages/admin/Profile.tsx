import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { adminStore } from '@/lib/store';

export default function AdminProfile() {
  const [user, setUser] = useState(adminStore.getUser());
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.current !== 'admin123') {
      alert('Current password is incorrect');
      return;
    }
    setPasswordSaved(true);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-h2" style={{ color: 'var(--color-text)' }}>
          Admin Profile
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          Manage your account settings
        </p>
      </div>

      <div
        className="rounded-xl p-6 md:p-8"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center font-body font-semibold text-2xl mb-3"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <button
            onClick={() => alert('Photo upload coming soon!')}
            className="font-body text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Change Photo
          </button>
          <h3 className="font-body font-semibold text-xl mt-3">{user.name}</h3>
          <span
            className="inline-block mt-1 px-3 py-1 rounded-pill font-body text-[11px] font-medium"
            style={{ backgroundColor: 'rgba(196,154,132,0.2)', color: 'var(--color-accent)' }}
          >
            {user.role}
          </span>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Full Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full h-10 px-4 rounded-lg text-sm font-body outline-none transition-shadow focus:shadow-glow"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Email
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full h-10 px-4 rounded-lg text-sm font-body outline-none transition-shadow focus:shadow-glow"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Phone
            </label>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full h-10 px-4 rounded-lg text-sm font-body outline-none transition-shadow focus:shadow-glow"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Bio
            </label>
            <textarea
              rows={3}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-sm font-body outline-none resize-none transition-shadow focus:shadow-glow"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
            />
          </div>
          <button
            type="submit"
            className="w-full h-11 rounded-pill font-body font-medium text-sm transition-all hover:scale-[1.02] hover:shadow-md"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Profile Updated
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>

        {/* Password Section */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
          <h4 className="font-body font-semibold text-base mb-4" style={{ color: 'var(--color-text)' }}>
            Change Password
          </h4>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="relative">
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Enter current password"
                className="w-full h-10 px-4 pr-10 rounded-lg text-sm font-body outline-none"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px]"
                style={{ color: 'var(--color-muted)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="Enter new password"
                className="w-full h-10 px-4 pr-10 rounded-lg text-sm font-body outline-none"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-[34px]"
                style={{ color: 'var(--color-muted)' }}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Confirm new password"
                className="w-full h-10 px-4 pr-10 rounded-lg text-sm font-body outline-none"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[34px]"
                style={{ color: 'var(--color-muted)' }}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-pill font-body font-medium text-sm transition-all hover:scale-[1.02] hover:shadow-md"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {passwordSaved ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Password Updated
                </span>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
