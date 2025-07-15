
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    rePassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUpdateInfo = () => {
    setShowPasswordModal(true);
    setError("");
  };

  const handlePasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: passwordPrompt,
    });
    if (pwError) {
      setError("Incorrect password.");
      return;
    }
    setShowPasswordModal(false);
    setEditMode(true);
    setPasswordPrompt("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    // Validation
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSaving(false);
      return;
    }
    if (form.password !== form.rePassword) {
      setError("Passwords do not match.");
      setIsSaving(false);
      return;
    }
    if (form.email !== user?.email) {
      // Check if email is valid
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        setError("Please enter a valid email address.");
        setIsSaving(false);
        return;
      }
    }
    try {
      if (form.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: form.email });
        if (emailError) {
          if (emailError.message.toLowerCase().includes("already registered")) {
            setError("That email is already in use.");
          } else {
            setError(emailError.message);
          }
          setIsSaving(false);
          return;
        }
      }
      if (form.password) {
        const { error: pwError } = await supabase.auth.updateUser({ password: form.password });
        if (pwError) {
          setError(pwError.message);
          setIsSaving(false);
          return;
        }
      }
      if (form.name !== user?.name) {
        await supabase.auth.updateUser({ data: { full_name: form.name, name: form.name } });
      }
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setForm(f => ({ ...f, password: "", rePassword: "" }));
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
    setIsSaving(false);
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="fixed top-0 w-full z-50 bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Settings
              </span>
            </div>
          </div>
        </nav>

        <div className="pt-20 max-w-xl mx-auto px-4 py-8">
          <button
            className="mb-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <div className="bg-gray-800 rounded-lg p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              onClick={handleUpdateInfo}
              disabled={editMode}
            >
              Update Info
            </button>
            <h2 className="text-xl font-bold mb-6">User Information</h2>
            <div className="space-y-4">
              {error && <div className="text-red-400 font-medium mb-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    disabled={!editMode}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {editMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Re-enter Password</label>
                  <div className="relative">
                    <input
                      type={showRePassword ? "text" : "password"}
                      name="rePassword"
                      value={form.rePassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                      disabled={!editMode}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowRePassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showRePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
              {editMode && (
                <div className="text-xs text-gray-400 mb-2">
                  For your security, your current password is never shown. Enter a new password to change it.
                </div>
              )}

            </div>
            <button
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
              onClick={handleSave}
              disabled={!editMode || isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Password Prompt Modal */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
            <form onSubmit={handlePasswordConfirm} className="space-y-4">
              <h3 className="text-lg font-bold mb-2">Enter your password to update info</h3>
              <input
                type="password"
                value={passwordPrompt}
                onChange={(e) => setPasswordPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Password"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Confirm
              </button>
            </form>
          </DialogContent>
        </Dialog>


      </div>
    </ProtectedRoute>
  );
};

export default Settings;
