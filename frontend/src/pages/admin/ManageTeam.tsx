import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  fullName: string;
  roleTitle: string;
  bio: string;
  imageUrl: string | null;
  isVisible: boolean;
}

export default function ManageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    roleTitle: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    sortOrder: 0,
    isVisible: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await apiFetch("/admin/team");
      setMembers(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("roleTitle", formData.roleTitle);
      submitData.append("bio", formData.bio);
      submitData.append("linkedinUrl", formData.linkedinUrl || "");
      submitData.append("twitterUrl", formData.twitterUrl || "");
      submitData.append("sortOrder", String(formData.sortOrder));
      submitData.append("isVisible", String(formData.isVisible));
      if (file) {
        submitData.append("image", file);
      }

      if (isEditing) {
        await apiFetch(`/admin/team/${isEditing}`, {
          method: "PATCH",
          body: submitData,
        });
        toast.success("Team member updated");
      } else {
        await apiFetch("/admin/team", {
          method: "POST",
          body: submitData,
        });
        toast.success("Team member added");
      }

      setFormData({ 
        fullName: "", 
        roleTitle: "", 
        bio: "", 
        linkedinUrl: "", 
        twitterUrl: "", 
        sortOrder: 0, 
        isVisible: true 
      });
      setFile(null);
      setIsEditing(null);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setIsEditing(member.id);
    setFormData({
      fullName: member.fullName,
      roleTitle: member.roleTitle,
      bio: member.bio,
      linkedinUrl: (member as any).linkedinUrl || "",
      twitterUrl: (member as any).twitterUrl || "",
      sortOrder: (member as any).sortOrder || 0,
      isVisible: member.isVisible,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await apiFetch(`/admin/team/${id}`, { method: "DELETE" });
      toast.success("Member deleted");
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  return (
    <div className="pt-32 pb-12 px-6 min-h-screen bg-[#050020] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Manage Team
        </h1>

        {/* Form Section */}
        <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">
            {isEditing ? "Edit Team Member" : "Add New Member"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                  placeholder="e.g. Alex Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Role Title</label>
                <input
                  type="text"
                  name="roleTitle"
                  required
                  value={formData.roleTitle}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                  placeholder="e.g. CEO & Founder"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Bio</label>
              <textarea
                name="bio"
                required
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                placeholder="Brief biography..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Twitter URL</label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white placeholder:text-white/20 transition-all font-outfit"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Photo {isEditing && "(Leave empty to keep current)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 file:transition-all cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isVisible"
                id="isVisible"
                checked={formData.isVisible}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-white/10 bg-white/5 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="isVisible" className="text-sm text-white/70 cursor-pointer select-none">
                Visible on public About page
              </label>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                {submitting ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ 
                      fullName: "", 
                      roleTitle: "", 
                      bio: "", 
                      linkedinUrl: "", 
                      twitterUrl: "", 
                      sortOrder: 0, 
                      isVisible: true 
                    });
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white font-semibold px-10 py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Current Team Members</h2>
            <div className="h-px bg-white/10 flex-1 ml-6"></div>
          </div>
          
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/40 italic">No team members added yet. Start by filling the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {members.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all hover:border-blue-500/30"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-500/50 shadow-xl transition-all"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-white/10 text-white font-bold text-xl">
                            {member.fullName.charAt(0)}
                          </div>
                        )}
                        {!member.isVisible && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050020]" title="Hidden from public"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{member.fullName}</h3>
                        <p className="text-white/50 text-sm font-outfit uppercase tracking-widest">{member.roleTitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-3 hover:bg-white/10 text-blue-400 rounded-xl transition-all border border-transparent hover:border-white/10"
                        title="Edit Info"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-transparent hover:border-white/10"
                        title="Remove Member"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
