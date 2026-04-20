import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Video, 
  Link as LinkIcon, 
  FileText, 
  StickyNote, 
  Upload, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  GripVertical
} from "lucide-react";

interface Resource {
  id?: string;
  title: string;
  type: "VIDEO" | "LINK" | "DOCUMENT" | "NOTE";
  url?: string;
  content?: string;
  sortOrder: number;
}

interface Module {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  order: number;
  estimatedMinutes: number | null;
  isPublished: boolean;
  resources: Resource[];
}

export default function ManageModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    order: 0,
    estimatedMinutes: 0,
    isPublished: false,
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await apiFetch("/admin/modules");
      setModules(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch modules");
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

  const handleResourceChange = (index: number, field: keyof Resource, value: any) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const addResource = () => {
    setResources([...resources, { title: "", type: "VIDEO", url: "", sortOrder: resources.length }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    setUploadingVideo(index);
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append("video", file);

    try {
      const result = await apiFetch("/admin/modules/upload-video", {
        method: "POST",
        body: uploadFormData,
      });
      handleResourceChange(index, "url", result.url);
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Video upload failed");
    } finally {
      setUploadingVideo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      order: Number(formData.order),
      estimatedMinutes: Number(formData.estimatedMinutes),
      resources: resources.map((r, i) => ({ ...r, sortOrder: i })),
    };

    try {
      if (isEditing) {
        await apiFetch(`/admin/modules/${isEditing}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Module updated");
      } else {
        await apiFetch("/admin/modules", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Module created");
      }

      resetForm();
      fetchModules();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      order: 0,
      estimatedMinutes: 0,
      isPublished: false,
    });
    setResources([]);
  };

  const handleEdit = (mod: Module) => {
    setIsEditing(mod.id);
    setFormData({
      title: mod.title,
      slug: mod.slug,
      shortDescription: mod.shortDescription,
      description: mod.description,
      order: mod.order,
      estimatedMinutes: mod.estimatedMinutes || 0,
      isPublished: mod.isPublished,
    });
    setResources(mod.resources || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiFetch(`/admin/modules/${id}`, { method: "DELETE" });
      toast.success("Module deleted");
      fetchModules();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-[#050020] text-white selection:bg-blue-500/30 font-outfit">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">
              Manage Modules
            </h1>
            <p className="text-white/50 mt-2">Create and organize your educational content</p>
          </div>
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-3 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Module</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-12">
            <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                {isEditing ? <Edit2 className="w-6 h-6 text-blue-400" /> : <Plus className="w-6 h-6 text-green-400" />}
                {isEditing ? "Edit Module" : "Create New Module"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all shadow-inner"
                        placeholder="e.g. Introduction to Neural Networks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        required
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all font-mono text-sm"
                        placeholder="intro-to-nn"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Order</label>
                        <input
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Duration (Min)</label>
                        <input
                          type="number"
                          name="estimatedMinutes"
                          value={formData.estimatedMinutes}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPublished ? "bg-blue-600" : "bg-white/10"}`}></div>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isPublished ? "translate-x-6" : "translate-x-0"}`}></div>
                        </div>
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Published & Visible</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    required
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all"
                    placeholder="Brief highlight of this module..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">Full Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 text-white placeholder:text-white/20 transition-all"
                    placeholder="Detailed overview..."
                  />
                </div>

                {/* Resources Section */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                       <LinkIcon className="w-5 h-5 text-blue-400" />
                       Module Resources
                    </h3>
                    <button
                      type="button"
                      onClick={addResource}
                      className="text-sm flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Resource
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resources.map((resource, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl relative group"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-4">
                            <input
                              type="text"
                              required
                              placeholder="Resource Title"
                              value={resource.title}
                              onChange={(e) => handleResourceChange(index, "title", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <select
                              value={resource.type}
                              onChange={(e) => handleResourceChange(index, "type", e.target.value)}
                              className="w-full bg-[#0a0525] border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer"
                            >
                              <option value="VIDEO">Video</option>
                              <option value="LINK">Link</option>
                              <option value="DOCUMENT">Doc</option>
                              <option value="NOTE">Note</option>
                            </select>
                          </div>
                          <div className="md:col-span-5 flex gap-2">
                            <input
                              type="text"
                              placeholder={resource.type === "VIDEO" ? "Video URL (YouTube or Upload)" : "URL / Destination"}
                              value={resource.url || ""}
                              onChange={(e) => handleResourceChange(index, "url", e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                            />
                            {resource.type === "VIDEO" && (
                              <label className={`cursor-pointer p-2.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all ${uploadingVideo === index ? "opacity-50 pointer-events-none" : ""}`}>
                                <Upload className={`w-4 h-4 ${uploadingVideo === index ? "animate-bounce" : ""}`} />
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => handleVideoUpload(index, e)}
                                />
                              </label>
                            )}
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeResource(index)}
                              className="p-2.5 text-white/20 hover:text-red-400 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {resources.length === 0 && (
                      <div className="py-8 border border-dashed border-white/10 rounded-2xl text-center text-white/30 text-sm">
                        No resources added. Modules are better with content!
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                  >
                    {submitting ? "Saving Content..." : isEditing ? "Update Module" : "Create Module"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>

          {/* List Section */}
          <div className="lg:col-span-12 mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Active Modules</h2>
              <div className="h-px bg-white/10 flex-1 ml-6"></div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                <p className="text-white/30 italic">No modules found. Start building your curriculum!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                  {modules.map((mod) => (
                    <motion.div
                      key={mod.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/8 transition-all hover:border-blue-500/20 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                          {mod.order}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{mod.title}</h3>
                            {mod.isPublished ? (
                              <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/20 rounded-full font-bold uppercase tracking-wider">Live</span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white/40 border border-white/20 rounded-full font-bold uppercase tracking-wider">Draft</span>
                            )}
                          </div>
                          <p className="text-white/40 text-sm mt-1 line-clamp-1">{mod.shortDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="hidden sm:flex flex-col items-end">
                           <span className="text-xs text-white/30 uppercase tracking-widest">Resources</span>
                           <span className="text-sm font-semibold">{mod.resources?.length || 0} items</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mod)}
                            className="p-3 bg-white/5 hover:bg-blue-500/20 text-blue-400 border border-white/10 rounded-xl transition-all"
                            title="Edit Module"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(mod.id)}
                            className="p-3 bg-white/5 hover:bg-red-500/20 text-red-500 border border-white/10 rounded-xl transition-all"
                            title="Delete Module"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
